import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const { resetDemoEnvironment } = await import("../lib/db/reset");

  console.log("Resetting InvariantX demo state...");

  await resetDemoEnvironment();

  console.log("InvariantX demo state reset successfully.");
}

main().catch((error: unknown) => {
  console.error("Failed to reset InvariantX demo environment.", error);

  process.exitCode = 1;
});
