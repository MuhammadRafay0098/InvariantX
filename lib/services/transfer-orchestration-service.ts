import { getInvariantById } from "./invariant-service";
import { createPolicyForTransfer } from "./policy-service";
import { transferInvariantToAgent } from "./semantic-transfer-service";

export async function createSemanticTransferWithPolicy(
  invariantId: string,
  sourceAgentId: string,
  targetAgentId: string,
) {
  const invariant = await getInvariantById(invariantId);

  if (!invariant) {
    throw new Error(`Invariant ${invariantId} was not found.`);
  }

  const result = await transferInvariantToAgent(
    invariantId,
    sourceAgentId,
    targetAgentId,
  );

  const policy = await createPolicyForTransfer({
    invariant,
    transfer: result.transfer,
  });

  if (policy.status !== "inactive") {
    throw new Error(
      "Transferred policy must remain inactive until validation and human approval.",
    );
  }

  return {
    ...result,
    policy,
  };
}
