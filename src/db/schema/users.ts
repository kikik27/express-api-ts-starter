import { pgTable, integer, uuid, varchar, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { globalSchema } from "./global.schema";

export const rolesEnum = pgEnum("roles", ["admin", "user"])

export const users = pgTable("users", {
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  role: rolesEnum().default('user'),
  reset_password_token: varchar("reset_password_token", { length: 256 }),
  verification_token: varchar("verification_token", { length: 256 }),
  verified_at: timestamp(),
  ...globalSchema
});

export type User = typeof users.$inferSelect;
