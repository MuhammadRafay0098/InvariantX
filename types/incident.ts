import type { CapabilityClass, TrustLevel } from "./agent";

export const INCIDENT_STATUSES = ["detected", "analyzed", "resolved"] as const;

export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export const INCIDENT_SEVERITIES = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export type IncidentSeverity = (typeof INCIDENT_SEVERITIES)[number];

export interface Incident {
  id: string;

  agentId: string;
  runId: string;

  originalGoal: string;

  source: string;
  sourceTrust: TrustLevel;

  observedAction: string;
  capabilityClass: CapabilityClass;

  trustedAuthorization: boolean;

  severity: IncidentSeverity;
  status: IncidentStatus;

  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentAnalysis {
  incidentId: string;

  sourceTrust: TrustLevel;

  influence: "agent_decision";

  actionClass: CapabilityClass;

  authorizationPresent: boolean;

  securityRelationship: string;

  confidence: number;
}
