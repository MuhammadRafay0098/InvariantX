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

  const created = db.transaction((tx) => {
    const incident = tx
      .select({ id: incidents.id })
      .from(incidents)
      .where(eq(incidents.id, input.incidentId))
      .limit(1)
      .get();

    if (!incident) {
      throw new Error(`Incident ${input.incidentId} was not found.`);
    }

    return tx
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
      .returning()
      .get();
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
