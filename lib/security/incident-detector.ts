import type { CapabilityClass, TrustLevel } from "../../types/agent";

export interface IncidentEvaluationContext {
  sourceTrust: TrustLevel;

  capabilityClass: CapabilityClass;

  trustedAuthorization: boolean;
}

export interface IncidentEvaluation {
  incidentDetected: boolean;

  reason: string | null;
}

export function detectSecurityIncident(
  context: IncidentEvaluationContext,
): IncidentEvaluation {
  const incidentDetected =
    context.sourceTrust === "untrusted" &&
    context.capabilityClass === "external_side_effect" &&
    !context.trustedAuthorization;

  if (!incidentDetected) {
    return {
      incidentDetected: false,
      reason: null,
    };
  }

  return {
    incidentDetected: true,
    reason:
      "Untrusted-derived context attempted to influence an external side effect without trusted authorization.",
  };
}
