import { users } from "../../../db/schema/users";
import { db } from "../../../db";
import { User } from "../../../db/schema/users";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { paginate } from "../../../helpers/response";
import { safeUser } from "./user.schema";
import { AppError } from "../../../utils/errors";
import { ErrorTypes } from "../../../utils/errors";

export const createUser = async (user: User) => {
  try {
    const { password, ...rest } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db
      .insert(users)
      .values({ ...rest, password: hashedPassword })
      .returning({                                  
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        verified_at: users.verified_at,
      });
    return newUser as safeUser;
  } catch (error: any) {
    // Check for PostgreSQL unique violation error code
    if (error.code === '23505') {
      throw new AppError(
        'User with this email already exists',
        409,
        ErrorTypes.USER_ALREADY_EXISTS
      );
    }
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new AppError('User not found', 404, ErrorTypes.USER_NOT_FOUND);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (page: number, limit: number) => {
  try {
    const query = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
        deleted_at: users.deleted_at,
      })
      .from(users);

    return paginate<User>(query, users, { page, limit });
  } catch (error) {
    throw error instanceof Error ? error : new Error("Pagination failed");
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new AppError('User not found', 404, ErrorTypes.USER_NOT_FOUND);
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: string, payload: User) => {
  try {
    await getUserById(id); // Verify user exists
    return db.update(users).set(payload).where(eq(users.id, id));
  } catch (error) {
    throw error;
  }
};

export const getUserByResetPasswordToken = async (token: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.reset_password_token, token))
      .limit(1);

    if (!user) {
      throw new AppError('User not found', 404, ErrorTypes.USER_NOT_FOUND);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUserByVerificationToken = async (token: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.verification_token, token))
      .limit(1);

    if (!user) {
      throw new AppError('User not found', 404, ErrorTypes.USER_NOT_FOUND);
    }

    return user;
  } catch (error) {
    throw error;
  }
};

