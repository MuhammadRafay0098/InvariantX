import { asc, eq } from "drizzle-orm";

import { db } from "../../lib/db/client";
import { traces } from "../../lib/db/schema";
import { createTraceId } from "../../lib/utils/id";

import type { CapabilityClass, TrustLevel } from "../../types/agent";
import type { TraceEvent, TraceEventType } from "../../types/trace";

interface CreateTraceInput {
  runId: string;
  step: number;

  agentId: string;

  eventType: TraceEventType;

  source?: string | null;
  sourceTrust?: TrustLevel;

  toolName?: string | null;
  capabilityClass?: CapabilityClass | null;

  authorized?: boolean | null;

  summary: string;

  incidentId?: string | null;
}

export async function createTrace(
  input: CreateTraceInput,
): Promise<TraceEvent> {
  const id = createTraceId();

  const [createdTrace] = await db
    .insert(traces)
    .values({
      id,

      incidentId: input.incidentId ?? null,

      runId: input.runId,
      step: input.step,

      agentId: input.agentId,

      eventType: input.eventType,

      source: input.source ?? null,

      sourceTrust: input.sourceTrust ?? "unknown",

      toolName: input.toolName ?? null,

      capabilityClass: input.capabilityClass ?? null,

      authorized: input.authorized ?? null,

      summary: input.summary,
    })
    .returning();

  return createdTrace;
}

export async function getRunTraces(runId: string): Promise<TraceEvent[]> {
  return db
    .select()
    .from(traces)
    .where(eq(traces.runId, runId))
    .orderBy(asc(traces.step));
}

export async function attachRunTracesToIncident(
  runId: string,
  incidentId: string,
): Promise<void> {
  await db
    .update(traces)
    .set({
      incidentId,
    })
    .where(eq(traces.runId, runId));
}
