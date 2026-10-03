import { eq } from "drizzle-orm";

import { db } from "../db/client";
import { validationRuns } from "../db/schema";
import { createValidationRunId } from "../utils/id";

import type { ValidationRun, ValidationScenario } from "../../types/validation";
import type { PolicyDecision } from "../../types/policy";

interface SaveValidationRunInput {
  transferId: string;
  scenario: ValidationScenario;
  actualDecision: PolicyDecision;
}

export async function saveValidationRun(
  input: SaveValidationRunInput,
): Promise<ValidationRun> {
  const [existing] = await db
    .select()
    .from(validationRuns)
    .where(eq(validationRuns.transferId, input.transferId));

  const existingScenario =
    existing?.scenarioId === input.scenario.id ? existing : undefined;

  if (existingScenario) {
    return existingScenario;
  }

  const [created] = await db
    .insert(validationRuns)
    .values({
      id: createValidationRunId(),
      transferId: input.transferId,
      scenarioId: input.scenario.id,
      type: input.scenario.type,
      expectedDecision: input.scenario.expectedDecision,
      actualDecision: input.actualDecision,
      passed: input.actualDecision === input.scenario.expectedDecision,
      notes: null,
    })
    .returning();

  if (!created) {
    throw new Error(
      `Failed to persist validation scenario ${input.scenario.id}.`,
    );
  }

  return created;
}
