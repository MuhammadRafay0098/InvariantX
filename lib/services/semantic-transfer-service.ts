import { getCapabilitiesByAgentId } from "./capability-service";
import { getInvariantById } from "./invariant-service";
import { createTransfer } from "./transfer-service";

import { mapInvariantToTarget } from "../ai/semantic-mapper";

import type { AIExecutionMetadata } from "../ai/types";
import type { SemanticMapping, Transfer } from "../../types/transfer";

interface TransferInvariantResult {
  invariantId: string;
  mapping: SemanticMapping;
  transfer: Transfer;
  execution: AIExecutionMetadata;
}

export async function transferInvariantToAgent(
  invariantId: string,
  sourceAgentId: string,
  targetAgentId: string,
): Promise<TransferInvariantResult> {
  if (sourceAgentId === targetAgentId) {
    throw new Error("Source and target agents must be different.");
  }

  const invariant = await getInvariantById(invariantId);

  if (!invariant) {
    throw new Error(`Invariant ${invariantId} was not found.`);
  }

  if (invariant.status !== "active") {
    throw new Error(`Invariant ${invariantId} is not active.`);
  }

  const capabilities = await getCapabilitiesByAgentId(targetAgentId);

  if (capabilities.length === 0) {
    throw new Error(
      `Target agent ${targetAgentId} has no registered capabilities.`,
    );
  }

  const mappingResult = await mapInvariantToTarget(
    invariant,
    targetAgentId,
    capabilities,
  );

  if (!mappingResult.data.applicable) {
    throw new Error(
      `Invariant ${invariantId} is not applicable to target agent ${targetAgentId}.`,
    );
  }

  const transfer = await createTransfer({
    invariantId,
    sourceAgentId,
    mapping: mappingResult.data,
  });

  return {
    invariantId,
    mapping: mappingResult.data,
    transfer,
    execution: mappingResult.metadata,
  };
}
