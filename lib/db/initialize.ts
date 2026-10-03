import path from "node:path";

import { migrate } from "drizzle-orm/libsql/migrator";

import { db } from "./client";

export async function initializeDatabase(): Promise<void> {
  const migrationsFolder = path.resolve(process.cwd(), "drizzle");

  await migrate(db, {
    migrationsFolder,
  });
}