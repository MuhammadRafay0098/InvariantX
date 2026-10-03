import type { Policy, PolicyDecision } from "../../types/policy";
import type { TrustLevel } from "../../types/agent";

export interface PolicyEvaluationContext {
  agentId: string;
  capability: string;
  sourceTrust: TrustLevel;
  trustedAuthorization: boolean;
}

export function evaluatePolicyRule(
  policy: Policy,
  context: PolicyEvaluationContext,
): PolicyDecision {
  if (
    policy.targetAgentId !== context.agentId ||
    policy.targetCapability !== context.capability
  ) {
    return "allow";
  }

  if (
    policy.conditions.sourceTrust !== context.sourceTrust ||
    policy.conditions.trustedAuthorization !== context.trustedAuthorization
  ) {
    return "allow";
  }

  return policy.effect;
}

export function evaluatePolicy(
  policy: Policy,
  context: PolicyEvaluationContext,
): PolicyDecision {
  if (policy.status !== "active") {
    return "allow";
  }

  return evaluatePolicyRule(policy, context);
}
