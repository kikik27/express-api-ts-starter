import { timestamp, uuid } from "drizzle-orm/pg-core";

export const globalSchema = {
  id: uuid().primaryKey(),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}
