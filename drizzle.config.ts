import { defineConfig } from "drizzle-kit";

const databaseUrl =
  process.env.DATABASE_URL ?? "file:./data/invariantx.db";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",

  dbCredentials: {
    url: databaseUrl,
  },

  verbose: true,
  strict: true,
});