import { users } from "../../../db/schema/users";
import { db } from "../../../db";
import { User } from "../../../db/schema/users";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { errorResponse, paginate } from "../../../helpers/response";


export const createUser = async (user: User) => {
  const { password, ...rest } = user;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await db.insert(users).values({ ...rest, password: hashedPassword }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at
    });
  return newUser[0];
}

export const getUserById = async (id: string) => {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user[0];
}

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
        deleted_at: users.deleted_at
      })
      .from(users);

    return paginate<User>(
      query,
      users,
      { page, limit }
    );
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Pagination failed');
  }
}
