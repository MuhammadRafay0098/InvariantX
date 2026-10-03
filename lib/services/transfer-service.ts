import { and, eq } from "drizzle-orm";

import { db } from "../db/client";
import { transfers } from "../db/schema";
import { createTransferId } from "../utils/id";

import type { SemanticMapping, Transfer } from "../../types/transfer";

interface CreateTransferInput {
  invariantId: string;
  sourceAgentId: string;
  mapping: SemanticMapping;
}

export async function createTransfer(
  input: CreateTransferInput,
): Promise<Transfer> {
  const [existing] = await db
    .select()
    .from(transfers)
    .where(
      and(
        eq(transfers.invariantId, input.invariantId),
        eq(transfers.targetAgentId, input.mapping.targetAgentId),
      ),
    )
    .limit(1);

  if (existing) {
    return existing;
  }

  const transferId = createTransferId();

  const [created] = await db
    .insert(transfers)
    .values({
      id: transferId,
      invariantId: input.invariantId,
      sourceAgentId: input.sourceAgentId,
      targetAgentId: input.mapping.targetAgentId,
      targetTool: input.mapping.targetTool,
      mappingConfidence: input.mapping.mappingConfidence,
      securityScore: null,
      utilityScore: null,
      status: "mapped",
    })
    .returning();

  if (!created) {
    throw new Error("Failed to create semantic transfer.");
  }

  return created;
}

export async function getTransferById(
  transferId: string,
): Promise<Transfer | null> {
  const [transfer] = await db
    .select()
    .from(transfers)
    .where(eq(transfers.id, transferId))
    .limit(1);

  return transfer ?? null;
}

export async function markTransferValidating(
  transferId: string,
): Promise<Transfer> {
  const [updated] = await db
    .update(transfers)
    .set({
      status: "validating",
      updatedAt: new Date(),
    })
    .where(eq(transfers.id, transferId))
    .returning();

  if (!updated) {
    throw new Error(`Transfer ${transferId} was not found.`);
  }

  return updated;
}

interface CompleteTransferValidationInput {
  transferId: string;
  securityScore: number;
  utilityScore: number;
  readyForReview: boolean;
}

export async function completeTransferValidation(
  input: CompleteTransferValidationInput,
): Promise<Transfer> {
  const [updated] = await db
    .update(transfers)
    .set({
      securityScore: input.securityScore,
      utilityScore: input.utilityScore,
      status: input.readyForReview ? "ready_for_review" : "rejected",
      updatedAt: new Date(),
    })
    .where(eq(transfers.id, input.transferId))
    .returning();

  if (!updated) {
    throw new Error(`Transfer ${input.transferId} was not found.`);
  }

  return updated;
}
