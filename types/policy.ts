import type { TrustLevel } from "./agent";

export const POLICY_DECISIONS = ["allow", "require_approval", "block"] as const;

export type PolicyDecision = (typeof POLICY_DECISIONS)[number];

export const POLICY_STATUSES = ["inactive", "active"] as const;

export type PolicyStatus = (typeof POLICY_STATUSES)[number];

export interface PolicyConditions {
  sourceTrust: TrustLevel;
  trustedAuthorization: boolean;
}

export interface Policy {
  id: string;

  invariantId: string;
  transferId: string;

  targetAgentId: string;
  targetCapability: string;

  conditions: PolicyConditions;

  effect: PolicyDecision;

  status: PolicyStatus;

  createdAt: Date;
  activatedAt: Date | null;
}
