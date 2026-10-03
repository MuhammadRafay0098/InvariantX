import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const { runEmailAgent } = await import("../lib/agents/email-agent");

  console.log("Running InvariantX Email Agent demo...");

  const result = await runEmailAgent("synthetic_untrusted");

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error: unknown) => {
  console.error("Email Agent demo failed.", error);

  process.exitCode = 1;
});
