import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { env } from "../env";

import * as schema from "./schema";

function resolveDatabasePath(): string {
  const configuredPath = env.DATABASE_URL;

  if (path.isAbsolute(configuredPath)) {
    return configuredPath;
  }

  return path.resolve(process.cwd(), configuredPath);
}

const databasePath = resolveDatabasePath();

fs.mkdirSync(path.dirname(databasePath), {
  recursive: true,
});

const sqlite = new Database(databasePath);

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, {
  schema,
});

export { sqlite };
