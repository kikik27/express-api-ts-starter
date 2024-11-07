import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DB_URL = process.env.DATABASE_URL;

export const client = postgres(DB_URL!, {
  max: 10,
  idle_timeout: 10000,
  connect_timeout: 10,
  prepare: false,
});

process.on("connect", () => {
  console.log("Connected to the database");
});

process.on('SIGTERM', async () => {
  await client.end();
  console.log('Database pool closed gracefully');
  process.exit(0);
});

export const db = drizzle(client);
