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

  const { runValidationSuite } = await import("../lib/validation/runner");

  const { analyzeValidationResults } =
    await import("../lib/ai/validation-analyst");

  const { evaluatePolicy } = await import("../lib/security/policy-engine");

  console.log("Running InvariantX complete validation lifecycle...");

  // 1. Observe source-agent incident.
  const repositoryRun = await runRepositoryAgent();

  if (!repositoryRun.incidentId) {
    throw new Error("Repository demo did not produce an incident.");
  }

  // 2. AI incident analysis + invariant mining.
  const analysis = await analyzeIncidentAndExtractInvariant(
    repositoryRun.incidentId,
  );

  // 3. AI semantic transfer.
  const transferResult = await transferInvariantToAgent(
    analysis.invariant.id,
    "AGENT-001",
    "AGENT-002",
  );

  // 4. Generate inactive proposed defense.
  const proposedPolicy = await createPolicyForTransfer({
    invariant: analysis.invariant,
    transfer: transferResult.transfer,
  });

  if (proposedPolicy.status !== "inactive") {
    throw new Error(
      "Newly proposed policy must remain inactive before validation.",
    );
  }

  const securityContext = {
    agentId: "AGENT-002",
    capability: "create_calendar_event",
    sourceTrust: "untrusted" as const,
    trustedAuthorization: false,
  };

  // 5. Inactive policy must have no runtime authority.
  const beforeApprovalDecision = evaluatePolicy(
    proposedPolicy,
    securityContext,
  );

  if (beforeApprovalDecision !== "allow") {
    throw new Error(
      "Inactive policy unexpectedly affected runtime enforcement.",
    );
  }

  // 6. Deterministic sandbox validation.
  const validation = await runValidationSuite(
    transferResult.transfer.id,
    proposedPolicy,
  );

  if (validation.transfer.status !== "ready_for_review") {
    throw new Error("Transfer did not reach ready_for_review.");
  }

  // 7. AI Validation Analyst explains deterministic results.
  const validationAnalysis = await analyzeValidationResults({
    transferId: validation.transfer.id,
    targetAgentId: validation.transfer.targetAgentId,
    targetTool: validation.transfer.targetTool,
    runs: validation.runs,
    summary: validation.summary,
  });

  // AI is not allowed to override deterministic recommendation.
  if (
    validationAnalysis.data.recommendation !== validation.summary.recommendation
  ) {
    throw new Error(
      "Validation Analyst attempted to diverge from the deterministic recommendation.",
    );
  }

  // AI analysis must not change policy state.
  if (proposedPolicy.status !== "inactive") {
    throw new Error("Validation analysis unexpectedly changed policy state.");
  }

  // 8. Explicit human approval simulation.
  const approvedPolicy = await activatePolicy(proposedPolicy.id);

  // 9. Deterministic runtime enforcement.
  const afterApprovalDecision = evaluatePolicy(approvedPolicy, securityContext);

  if (afterApprovalDecision !== "require_approval") {
    throw new Error("Approved policy was not enforced correctly.");
  }

  console.log(
    JSON.stringify(
      {
        aiModules: {
          incidentAnalyst: analysis.execution.incidentAnalyst,
          invariantMiner: analysis.execution.invariantMiner,
          semanticMapper: transferResult.execution,
          validationAnalyst: validationAnalysis.metadata,
        },

        validation: {
          summary: validation.summary,
          analysis: validationAnalysis.data,
        },

        lifecycle: {
          policyBeforeHumanApproval: proposedPolicy.status,
          runtimeDecisionBeforeApproval: beforeApprovalDecision,
          transferAfterValidation: validation.transfer.status,
          humanApproval: "approved",
          policyAfterHumanApproval: approvedPolicy.status,
          transferFinalStatus: "approved",
          runtimeDecisionAfterApproval: afterApprovalDecision,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  console.error("Validation lifecycle demo failed.", error);

  process.exitCode = 1;
});
