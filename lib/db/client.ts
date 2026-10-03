import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "../env";

import * as schema from "./schema";

function normalizeDatabaseUrl(configuredUrl: string): string {
  const value = configuredUrl.trim();

  if (
    value.startsWith("file:") ||
    value.startsWith("libsql:") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("ws://") ||
    value.startsWith("wss://")
  ) {
    return value;
  }

  return `file:${value}`;
}

const databaseUrl = normalizeDatabaseUrl(env.DATABASE_URL);

export const client = createClient({
  url: databaseUrl,
  authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema,
});