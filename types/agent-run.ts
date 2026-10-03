import type { CapabilityClass, TrustLevel } from "./agent";

export const AGENT_RUN_STATUSES = [
  "completed",
  "intercepted",
  "failed",
] as const;

export type AgentRunStatus = (typeof AGENT_RUN_STATUSES)[number];

export interface ToolExecutionContext {
  runId: string;
  agentId: string;

  source: string | null;
  sourceTrust: TrustLevel;

  trustedAuthorization: boolean;
}

export interface ToolExecutionResult<T> {
  success: boolean;

  toolName: string;
  capabilityClass: CapabilityClass;

  simulated: true;

  data: T;

  message: string;
}

export interface RepositoryRunResult {
  runId: string;
  agentId: "AGENT-001";

  status: AgentRunStatus;

  incidentDetected: boolean;
  incidentId: string | null;

  summary: string;

  processedIssues: number;
}

export interface EmailRunResult {
  runId: string;
  agentId: "AGENT-002";

  status: AgentRunStatus;

  source: string;
  sourceTrust: TrustLevel;

  requestedTool: string | null;

  decision:
    | "would_execute"
    | "allow"
    | "require_approval"
    | "block"
    | "no_external_action";

  simulated: true;

  summary: string;
}
