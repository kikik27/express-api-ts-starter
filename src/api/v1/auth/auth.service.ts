import { db } from "../../../db";
import { users } from "../../../db/schema/users";
import { User } from "../../../db/schema/users";
import bcrypt from "bcrypt";
import { generateAccessToken, generateTokens } from "../../../utils/jwt";
import { eq } from "drizzle-orm";
import { createUser, getUserByEmail, getUserByResetPasswordToken, getUserByVerificationToken, updateUser } from "../users/user.service";
import { sendEmailResetPassword, sendEmailVerifyEmail } from "../../../mailer/mailer.service";
import { AppError, ErrorTypes } from "../../../utils/errors";
import { queueManager, QueueNames } from '../../../utils/queue';

export const register = async (user: User) => {
  try {
    const verificationToken = Buffer.from(`${user.email}${Date.now()}`).toString('base64');

    const userWithToken = {
      ...user,
      verification_token: verificationToken,
      verified_at: null
    };

    const newUser = await createUser(userWithToken);

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    await queueManager.addJob(QueueNames.EMAIL, {
      type: 'verification',
      user: newUser,
      verificationUrl
    });

    return generateTokens(newUser.id);
  } catch (error) {
    throw error;
  }
};

export const login = async (payload: User) => {
  const { password, email } = payload;

  const user = await getUserByEmail(email);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401, ErrorTypes.INVALID_CREDENTIALS);
  }

  const { accessToken } = await generateTokens(user.id);
  return { accessToken };
};

export const forgotPassword = async (payload: User) => {
  try {
    return await getUserByEmail(payload.email);
  } catch (error) {
    throw error;
  }
};

export const sendResetPassword = async (payload: User) => {
  try {
    const user = await getUserByEmail(payload.email);
    const resetToken = Buffer.from(`${user.email}${Date.now()}`).toString('base64');
    
    const updatedUser = {
      ...user,
      reset_password_token: resetToken
    };
    
    await updateUser(user.id, updatedUser);

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await queueManager.addJob(QueueNames.EMAIL, {
      type: 'reset_password',
      user: updatedUser,
      resetPasswordUrl
    });

    return true;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const user = await getUserByResetPasswordToken(token);
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = {
      ...user,
      password: hashedPassword,
      reset_password_token: null
    };

    await updateUser(user.id, updatedUser);
    return true;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const user = await getUserByVerificationToken(token);
    const updatedUser = {
      ...user,
      verified_at: new Date(),
      verification_token: null
    };
    await updateUser(user.id, updatedUser);
    return true;
  } catch (error) {
    throw error;
  }
};
