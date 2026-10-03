import { eq } from "drizzle-orm";

import { db } from "../db/client";
import { policies, transfers } from "../db/schema";
import { createPolicyId } from "../utils/id";

import type { Policy } from "../../types/policy";
import type { Transfer } from "../../types/transfer";
import type { Invariant } from "../../types/invariant";

interface CreatePolicyInput {
  invariant: Invariant;
  transfer: Transfer;
}

export async function createPolicyForTransfer(
  input: CreatePolicyInput,
): Promise<Policy> {
  const [existing] = await db
    .select()
    .from(policies)
    .where(eq(policies.transferId, input.transfer.id))
    .limit(1);

  if (existing) {
    return {
      ...existing,
      conditions: {
        sourceTrust: existing.sourceTrust,
        trustedAuthorization: existing.trustedAuthorization,
      },
    };
  }

  const [created] = await db
    .insert(policies)
    .values({
      id: createPolicyId(),
      invariantId: input.invariant.id,
      transferId: input.transfer.id,
      targetAgentId: input.transfer.targetAgentId,
      targetCapability: input.transfer.targetTool,

      sourceTrust: input.invariant.sourceTrust,
      trustedAuthorization: false,

      effect: "require_approval",
      status: "inactive",
    })
    .returning();

  if (!created) {
    throw new Error("Failed to create transferred policy.");
  }

  return {
    ...created,
    conditions: {
      sourceTrust: created.sourceTrust,
      trustedAuthorization: created.trustedAuthorization,
    },
  };
}

export async function getPolicyByTransferId(
  transferId: string,
): Promise<Policy | null> {
  const [policy] = await db
    .select()
    .from(policies)
    .where(eq(policies.transferId, transferId))
    .limit(1);

  if (!policy) {
    return null;
  }

  return {
    ...policy,
    conditions: {
      sourceTrust: policy.sourceTrust,
      trustedAuthorization: policy.trustedAuthorization,
    },
  };
}

export async function activatePolicy(policyId: string): Promise<Policy> {
  const [existing] = await db
    .select()
    .from(policies)
    .where(eq(policies.id, policyId));

  if (!existing) {
    throw new Error(`Policy ${policyId} was not found.`);
  }

  if (existing.status === "active") {
    return {
      ...existing,
      conditions: {
        sourceTrust: existing.sourceTrust,
        trustedAuthorization: existing.trustedAuthorization,
      },
    };
  }

  const [transfer] = await db
    .select()
    .from(transfers)
    .where(eq(transfers.id, existing.transferId));

  if (!transfer) {
    throw new Error(`Transfer ${existing.transferId} was not found.`);
  }

  if (transfer.status !== "ready_for_review") {
    throw new Error(
      "Policy cannot be activated before successful validation and human review.",
    );
  }

  if (transfer.securityScore !== 1 || transfer.utilityScore !== 1) {
    throw new Error(
      "Policy cannot be activated because validation did not fully pass.",
    );
  }

  const activatedAt = new Date();

  const [updated] = await db
    .update(policies)
    .set({
      status: "active",
      activatedAt,
    })
    .where(eq(policies.id, policyId))
    .returning();

  if (!updated) {
    throw new Error(`Failed to activate policy ${policyId}.`);
  }

  await db
    .update(transfers)
    .set({
      status: "approved",
      updatedAt: activatedAt,
    })
    .where(eq(transfers.id, existing.transferId));

  return {
    ...updated,
    conditions: {
      sourceTrust: updated.sourceTrust,
      trustedAuthorization: updated.trustedAuthorization,
    },
  };
}
