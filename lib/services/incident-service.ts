import { eq } from "drizzle-orm";

import { db } from "../../lib/db/client";
import { incidents, traces } from "../../lib/db/schema";
import { createIncidentId } from "../../lib/utils/id";

import type { CapabilityClass, TrustLevel } from "../../types/agent";
import type { Incident, IncidentSeverity } from "../../types/incident";

interface CreateIncidentInput {
  agentId: string;
  runId: string;

  originalGoal: string;

  source: string;
  sourceTrust: TrustLevel;

  observedAction: string;
  capabilityClass: CapabilityClass;

  trustedAuthorization: boolean;

  severity?: IncidentSeverity;
}

export async function createIncident(
  input: CreateIncidentInput,
): Promise<Incident> {
  const existing = await db
    .select()
    .from(incidents)
    .where(eq(incidents.runId, input.runId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const incidentId = createIncidentId();

  const incident = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(incidents)
      .values({
        id: incidentId,

        agentId: input.agentId,
        runId: input.runId,

        originalGoal: input.originalGoal,

        source: input.source,
        sourceTrust: input.sourceTrust,

        observedAction: input.observedAction,
        capabilityClass: input.capabilityClass,

        trustedAuthorization: input.trustedAuthorization,

        severity: input.severity ?? "high",

        status: "detected",
      })
      .returning();

    if (!created) {
      throw new Error("Failed to create security incident.");
    }

    await tx
      .update(traces)
      .set({
        incidentId,
      })
      .where(eq(traces.runId, input.runId));

    return created;
  });

  return incident;
}

export async function getIncidentById(
  incidentId: string,
): Promise<Incident | null> {
  const [incident] = await db
    .select()
    .from(incidents)
    .where(eq(incidents.id, incidentId))
    .limit(1);

  return incident ?? null;
}

export async function markIncidentAnalyzed(
  incidentId: string,
): Promise<Incident> {
  const updated = await db
    .update(incidents)
    .set({
      status: "analyzed",
      updatedAt: new Date(),
    })
    .where(eq(incidents.id, incidentId))
    .returning();

  const incident = updated[0];

  if (!incident) {
    throw new Error(`Incident ${incidentId} was not found.`);
  }

  return incident;
}