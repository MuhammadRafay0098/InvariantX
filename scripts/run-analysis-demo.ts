import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const { runRepositoryAgent } = await import("../lib/agents/repository-agent");

  const { analyzeIncidentAndExtractInvariant } =
    await import("../lib/services/incident-analysis-service");

  console.log("Running InvariantX incident analysis demo...");

  const repositoryRun = await runRepositoryAgent();

  if (!repositoryRun.incidentId) {
    throw new Error("Repository demo did not produce an incident.");
  }

  const result = await analyzeIncidentAndExtractInvariant(
    repositoryRun.incidentId,
  );

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error: unknown) => {
  console.error("Incident analysis demo failed.", error);

  process.exitCode = 1;
});
