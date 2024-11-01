import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DB_URL = process.env.DATABASE_URL;

export const client = postgres(DB_URL!, { prepare: false });
export const db = drizzle(client);
