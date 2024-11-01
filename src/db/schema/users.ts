import { pgTable, integer, uuid, varchar, pgEnum } from "drizzle-orm/pg-core";
import { globalSchema } from "./global.schema";

export const rolesEnum = pgEnum("roles", ["admin", "user"])

export const users = pgTable("users", {
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  role: rolesEnum().default('user'),
  ...globalSchema
});

export type User = typeof users.$inferSelect;
