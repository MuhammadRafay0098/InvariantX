import { activatePolicy, getPolicyByTransferId } from "./policy-service";
import { getTransferById } from "./transfer-service";

export async function approveTransfer(transferId: string) {
  const transfer = await getTransferById(transferId);

  if (!transfer) {
    throw new Error(`Transfer ${transferId} was not found.`);
  }

  if (transfer.status !== "ready_for_review") {
    throw new Error("Transfer is not ready for human approval.");
  }

  const policy = await getPolicyByTransferId(transferId);

  if (!policy) {
    throw new Error("Proposed policy was not found.");
  }

  const activatedPolicy = await activatePolicy(policy.id);

  const approvedTransfer = await getTransferById(transferId);

  return {
    transfer: approvedTransfer,
    policy: activatedPolicy,
  };
}
