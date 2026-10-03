import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const { runRepositoryAgent } = await import("../lib/agents/repository-agent");
  const { analyzeIncidentAndExtractInvariant } =
    await import("../lib/services/incident-analysis-service");
  const { transferInvariantToAgent } =
    await import("../lib/services/semantic-transfer-service");
  const { createPolicyForTransfer, activatePolicy } =
    await import("../lib/services/policy-service");
  const { evaluatePolicy } = await import("../lib/security/policy-engine");

  console.log("Running InvariantX policy enforcement demo...");

  const repositoryRun = await runRepositoryAgent();

  if (!repositoryRun.incidentId) {
    throw new Error("Repository demo did not produce an incident.");
  }

  const analysis = await analyzeIncidentAndExtractInvariant(
    repositoryRun.incidentId,
  );

  const transfer = await transferInvariantToAgent(
    analysis.invariant.id,
    "AGENT-001",
    "AGENT-002",
  );

  const policy = await createPolicyForTransfer({
    invariant: analysis.invariant,
    transfer: transfer.transfer,
  });

  const context = {
    agentId: "AGENT-002",
    capability: "create_calendar_event",
    sourceTrust: "untrusted" as const,
    trustedAuthorization: false,
  };

  const beforeApproval = evaluatePolicy(policy, context);

  const activePolicy = await activatePolicy(policy.id);

  const afterApproval = evaluatePolicy(activePolicy, context);

  console.log(
    JSON.stringify(
      {
        policyId: policy.id,
        beforeApproval: {
          policyStatus: policy.status,
          decision: beforeApproval,
        },
        afterApproval: {
          policyStatus: activePolicy.status,
          decision: afterApproval,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  console.error("Policy enforcement demo failed.", error);

  process.exitCode = 1;
});
