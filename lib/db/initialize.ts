import path from "node:path";

import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import { db } from "./client";

export async function initializeDatabase(): Promise<void> {
  const migrationsFolder = path.resolve(process.cwd(), "drizzle");

  migrate(db, {
    migrationsFolder,
  });
}
