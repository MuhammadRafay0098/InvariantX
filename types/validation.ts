import type { PolicyDecision } from "./policy";

export const VALIDATION_TYPES = ["security", "utility"] as const;

export type ValidationType = (typeof VALIDATION_TYPES)[number];

export interface ValidationScenario {
  id: string;

  type: ValidationType;

  name: string;
  description: string;

  targetAgentId: string;
  targetTool: string;

  sourceTrust: "trusted" | "untrusted";

  trustedAuthorization: boolean;

  expectedDecision: PolicyDecision;
}

export interface ValidationRun {
  id: string;

  transferId: string;
  scenarioId: string;

  type: ValidationType;

  expectedDecision: PolicyDecision;
  actualDecision: PolicyDecision;

  passed: boolean;

  notes: string | null;

  createdAt: Date;
}

export interface ValidationScore {
  passed: number;
  total: number;
  score: number;
}

export interface ValidationSummary {
  security: ValidationScore;
  utility: ValidationScore;

  recommendation: "ready_for_review" | "revise" | "reject";
}
