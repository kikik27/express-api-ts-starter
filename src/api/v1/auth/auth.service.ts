import { db } from "../../../db";
import { users } from "../../../db/schema/users";
import { User } from "../../../db/schema/users";
import bcrypt from "bcrypt";
import { generateAccessToken, generateTokens } from "../../../utils/jwt";
import { eq } from "drizzle-orm";
import { createUser, getUserByEmail, getUserByResetPasswordToken, getUserByVerificationToken, updateUser } from "../users/user.service";
import { sendEmailResetPassword, sendEmailVerifyEmail } from "../../../mailer/mailer.service";

export const register = async (user: User) => {
  const verificationToken = Buffer.from(`${user.email}${Date.now()}`).toString('base64');

  const userWithToken = {
    ...user,
    verification_token: verificationToken,
    verified_at: null
  };

  // Create new user with verification token
  const newUser = await createUser(userWithToken);

  // Send verification email
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  await sendEmailVerifyEmail(newUser, { url: verificationUrl });

  return generateTokens(newUser.id);
};

export const login = async (payload: User) => {
  try {
    const { password, email } = payload;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then(results => results[0]);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const { accessToken } = await generateTokens(user.id);
    return { accessToken };
  } catch (error) {
    throw error;
  }
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
    await sendEmailResetPassword(updatedUser, { url: resetPasswordUrl });

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
