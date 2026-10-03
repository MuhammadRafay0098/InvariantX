import type { CapabilityClass, TrustLevel } from "./agent";

export const INVARIANT_STATUSES = ["active", "retired"] as const;

export type InvariantStatus = (typeof INVARIANT_STATUSES)[number];

export const AUTHORIZATION_REQUIREMENTS = [
  "trusted_authorization_required",
] as const;

export type AuthorizationRequirement =
  (typeof AUTHORIZATION_REQUIREMENTS)[number];

export const INVARIANT_CONSTRAINTS = ["deny_or_require_approval"] as const;

export type InvariantConstraint = (typeof INVARIANT_CONSTRAINTS)[number];

export interface Invariant {
  id: string;
  incidentId: string;

  sourceTrust: TrustLevel;

  influence: "agent_decision";

  actionClass: CapabilityClass;

  authorizationRequirement: AuthorizationRequirement;
  constraint: InvariantConstraint;

  humanDescription: string;

  status: InvariantStatus;

  createdAt: Date;
}
