import type { CapabilityClass, TrustLevel } from "./agent";

export const TRACE_EVENT_TYPES = [
  "user_request",
  "content_read",
  "agent_decision",
  "tool_request",
  "tool_result",
  "incident_detected",
  "policy_decision",
] as const;

export type TraceEventType = (typeof TRACE_EVENT_TYPES)[number];

export interface TraceEvent {
  id: string;
  incidentId: string | null;
  runId: string;

  step: number;
  agentId: string;

  eventType: TraceEventType;

  source: string | null;
  sourceTrust: TrustLevel;

  toolName: string | null;
  capabilityClass: CapabilityClass | null;

  authorized: boolean | null;

  summary: string;

  createdAt: Date;
}
