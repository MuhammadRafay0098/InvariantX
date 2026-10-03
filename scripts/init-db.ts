import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const { initializeDatabase } = await import("../lib/db/initialize");

  console.log("Initializing InvariantX database...");

  await initializeDatabase();

  console.log("InvariantX database initialized successfully.");
}

main().catch((error: unknown) => {
  console.error("Failed to initialize InvariantX database.", error);

  process.exitCode = 1;
});
