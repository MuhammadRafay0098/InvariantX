import { eq } from "drizzle-orm";

import { db } from "../db/client";
import { incidents, invariants } from "../db/schema";
import { createInvariantId } from "../utils/id";

import type { InvariantCandidate } from "../ai/schemas";
import type { Invariant } from "../../types/invariant";

interface CreateInvariantInput {
  incidentId: string;
  candidate: InvariantCandidate;
}

export async function createInvariant(
  input: CreateInvariantInput,
): Promise<Invariant> {
  const [existing] = await db
    .select()
    .from(invariants)
    .where(eq(invariants.incidentId, input.incidentId))
    .limit(1);

  if (existing) {
    return existing;
  }

  const invariantId = createInvariantId();

  const created = await db.transaction(async (tx) => {
    const [incident] = await tx
      .select({
        id: incidents.id,
      })
      .from(incidents)
      .where(eq(incidents.id, input.incidentId))
      .limit(1);

    if (!incident) {
      throw new Error(`Incident ${input.incidentId} was not found.`);
    }

    const [createdInvariant] = await tx
      .insert(invariants)
      .values({
        id: invariantId,
        incidentId: input.incidentId,
        sourceTrust: input.candidate.sourceTrust,
        influence: input.candidate.influence,
        actionClass: input.candidate.actionClass,
        authorizationRequirement: input.candidate.authorization,
        constraint: input.candidate.constraint,
        humanDescription: input.candidate.humanDescription,
        status: "active",
      })
      .returning();

    if (!createdInvariant) {
      throw new Error("Failed to create security invariant.");
    }

    return createdInvariant;
  });

  return created;
}

export async function getInvariantById(
  invariantId: string,
): Promise<Invariant | null> {
  const [invariant] = await db
    .select()
    .from(invariants)
    .where(eq(invariants.id, invariantId))
    .limit(1);

  return invariant ?? null;
}