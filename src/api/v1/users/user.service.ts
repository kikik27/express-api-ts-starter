import { users } from "../../../db/schema/users";
import { db } from "../../../db";
import { User } from "../../../db/schema/users";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { errorResponse, paginate } from "../../../helpers/response";

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
        created_at: users.created_at,
      });
    return newUser;
  } catch (error) {
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
      throw new Error("User not found");
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
      throw new Error("User not found");
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
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};