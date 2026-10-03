import { evaluatePolicyRule } from "../security/policy-engine";

import {
  completeTransferValidation,
  markTransferValidating,
} from "../services/transfer-service";
import { saveValidationRun } from "../services/validation-service";

import { VALIDATION_SCENARIOS } from "./scenarios";

import type { Policy } from "../../types/policy";
import type { Transfer } from "../../types/transfer";
import type {
  ValidationRun,
  ValidationScore,
  ValidationSummary,
  ValidationType,
} from "../../types/validation";

function calculateScore(
  runs: ValidationRun[],
  type: ValidationType,
): ValidationScore {
  const relevantRuns = runs.filter((run) => run.type === type);

  const passed = relevantRuns.filter((run) => run.passed).length;

  const total = relevantRuns.length;

  return {
    passed,
    total,
    score: total === 0 ? 0 : passed / total,
  };
}

export async function runValidationSuite(
  transferId: string,
  policy: Policy,
): Promise<{
  runs: ValidationRun[];
  summary: ValidationSummary;
  transfer: Transfer;
}> {
  if (policy.transferId !== transferId) {
    throw new Error("Policy does not belong to the supplied transfer.");
  }

  if (policy.status !== "inactive") {
    throw new Error("Sandbox validation requires a proposed inactive policy.");
  }

  await markTransferValidating(transferId);

  const runs: ValidationRun[] = [];

  for (const scenario of VALIDATION_SCENARIOS) {
    const actualDecision = evaluatePolicyRule(policy, {
      agentId: scenario.targetAgentId,
      capability: scenario.targetTool,
      sourceTrust: scenario.sourceTrust,
      trustedAuthorization: scenario.trustedAuthorization,
    });

    const run = await saveValidationRun({
      transferId,
      scenario,
      actualDecision,
    });

    runs.push(run);
  }

  const security = calculateScore(runs, "security");

  const utility = calculateScore(runs, "utility");

  const recommendation: ValidationSummary["recommendation"] =
    security.score === 1 && utility.score === 1
      ? "ready_for_review"
      : security.score < 1
        ? "revise"
        : "reject";

  const transfer = await completeTransferValidation({
    transferId,
    securityScore: security.score,
    utilityScore: utility.score,
    readyForReview: recommendation === "ready_for_review",
  });

  return {
    runs,
    summary: {
      security,
      utility,
      recommendation,
    },
    transfer,
  };
}
