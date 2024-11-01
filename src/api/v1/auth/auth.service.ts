import { db } from "../../../db";
import { users } from "../../../db/schema/users";
import { User } from "../../../db/schema/users";
import bcrypt from 'bcrypt';
import { generateAccessToken, generateTokens } from "../../../utils/jwt";
import { eq } from "drizzle-orm";
import { log } from "console";
import { createUser } from "../users/user.service";

export const register = async (user: User) => {
  const newUser = await createUser(user);
  return generateTokens(user);
} 

export const login = async (payload: User) => {
  try {
    const { password, ...rest } = payload;
    const user = await db.select().from(users).where(eq(users.email, rest.email)).limit(1);
    console.log(user);
    if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user[0].password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
    const { accessToken } = await generateTokens(user[0]);
    return { accessToken };
  } catch (error) {
    throw error;
  }
}
