import { db } from "../../../db";
import { users } from "../../../db/schema/users";
import { User } from "../../../db/schema/users";
import bcrypt from 'bcrypt';

export const register = async (user: User) => {
  const { password, ...rest } = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db.insert(users).values({ ...rest, password: hashedPassword });
  return newUser;
} 
