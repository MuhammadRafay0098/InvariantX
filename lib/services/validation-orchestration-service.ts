import { analyzeValidationResults } from "../ai/validation-analyst";
import { runValidationSuite } from "../validation/runner";

import {
  createPolicyForTransfer,
  getPolicyByTransferId,
} from "./policy-service";
import { getInvariantById } from "./invariant-service";
import { getTransferById } from "./transfer-service";

export async function validateTransfer(transferId: string) {
  const transfer = await getTransferById(transferId);

  if (!transfer) {
    throw new Error(`Transfer ${transferId} was not found.`);
  }

  if (transfer.status !== "mapped") {
    throw new Error(
      `Transfer ${transferId} cannot be validated from status ${transfer.status}.`,
    );
  }

  const invariant = await getInvariantById(transfer.invariantId);

  if (!invariant) {
    throw new Error(`Invariant ${transfer.invariantId} was not found.`);
  }

  let policy = await getPolicyByTransferId(transferId);

  if (!policy) {
    policy = await createPolicyForTransfer({
      invariant,
      transfer,
    });
  }

  if (policy.status !== "inactive") {
    throw new Error(
      "Only an inactive proposed policy can be sandbox validated.",
    );
  }

  const validation = await runValidationSuite(transferId, policy);

  const analysis = await analyzeValidationResults({
    transferId,
    targetAgentId: validation.transfer.targetAgentId,
    targetTool: validation.transfer.targetTool,
    runs: validation.runs,
    summary: validation.summary,
  });

  if (analysis.data.recommendation !== validation.summary.recommendation) {
    throw new Error(
      "Validation Analyst diverged from the deterministic recommendation.",
    );
  }

  return {
    ...validation,
    analysis,
    policy,
  };
}
