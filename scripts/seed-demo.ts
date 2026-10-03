import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const { seedDemoEnvironment } = await import("../lib/db/seed");

  console.log("Seeding InvariantX demo environment...");

  const result = await seedDemoEnvironment();

  console.log(
    `Demo environment ready: ${result.agents} agents, ${result.capabilities} capabilities.`,
  );
}

main().catch((error: unknown) => {
  console.error("Failed to seed InvariantX demo environment.", error);

  process.exitCode = 1;
});
