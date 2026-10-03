import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const { runRepositoryAgent } = await import("../lib/agents/repository-agent");

  console.log("Running InvariantX Repository Agent demo...");

  const result = await runRepositoryAgent();

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error: unknown) => {
  console.error("Repository Agent demo failed.", error);

  process.exitCode = 1;
});
