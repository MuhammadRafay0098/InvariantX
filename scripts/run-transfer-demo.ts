import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const { runRepositoryAgent } = await import("../lib/agents/repository-agent");

  const { analyzeIncidentAndExtractInvariant } =
    await import("../lib/services/incident-analysis-service");

  const { transferInvariantToAgent } =
    await import("../lib/services/semantic-transfer-service");

  console.log("Running InvariantX cross-agent transfer demo...");

  const repositoryRun = await runRepositoryAgent();

  if (!repositoryRun.incidentId) {
    throw new Error("Repository demo did not produce an incident.");
  }

  const analysis = await analyzeIncidentAndExtractInvariant(
    repositoryRun.incidentId,
  );

  const result = await transferInvariantToAgent(
    analysis.invariant.id,
    "AGENT-001",
    "AGENT-002",
  );

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error: unknown) => {
  console.error("Cross-agent transfer demo failed.", error);

  process.exitCode = 1;
});
