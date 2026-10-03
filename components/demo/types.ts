import type { AIExecutionMetadata } from "../../lib/ai/types";
import type { IncidentAnalysis } from "../../lib/ai/schemas";
import type { Invariant } from "../../types/invariant";
import type { Policy } from "../../types/policy";
import type { Transfer } from "../../types/transfer";
import type { ValidationRun, ValidationSummary } from "../../types/validation";

export const DEMO_STAGES = [
  "idle",
  "incident",
  "analysis",
  "transfer",
  "validation",
  "approval",
] as const;

export type DemoStage = (typeof DEMO_STAGES)[number];

export interface RepositoryDemoResult {
  runId: string;
  agentId: "AGENT-001";
  status: "completed" | "intercepted" | "failed";
  incidentDetected: boolean;
  incidentId: string | null;
  summary: string;
  processedIssues: number;
}

export interface IncidentAnalysisResult {
  incidentId: string;
  analysis: IncidentAnalysis;
  invariant: Invariant;
  execution: {
    incidentAnalyst: AIExecutionMetadata;
    invariantMiner: AIExecutionMetadata;
  };
}

export interface TransferMapping {
  applicable: boolean;
  targetAgentId: string;
  targetTool: string;
  capabilityClass: "external_side_effect";
  sourceTrustClass: "untrusted";
  mappingConfidence: number;
  reason: string;
}

export interface TransferResult {
  invariantId: string;
  mapping: TransferMapping;
  transfer: Transfer;
  execution: AIExecutionMetadata;
}

export interface ValidationAnalysis {
  summary: string;
  securityAssessment: string;
  utilityAssessment: string;
  recommendation: "ready_for_review" | "revise" | "reject";
  reviewerNotes: string[];
}

export interface ValidationResult {
  runs: ValidationRun[];
  summary: ValidationSummary;
  transfer: Transfer;
  policy: Policy;
  analysis: {
    data: ValidationAnalysis;
    metadata: AIExecutionMetadata;
  };
}

export interface ApprovalResult {
  transfer: Transfer;
  policy: Policy;
}

export interface DemoState {
  stage: DemoStage;

  repository: RepositoryDemoResult | null;
  analysis: IncidentAnalysisResult | null;
  transfer: TransferResult | null;
  validation: ValidationResult | null;
  approval: ApprovalResult | null;
}

export const INITIAL_DEMO_STATE: DemoState = {
  stage: "idle",
  repository: null,
  analysis: null,
  transfer: null,
  validation: null,
  approval: null,
};
