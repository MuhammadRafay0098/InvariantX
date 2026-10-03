export const AGENT_STATUSES = ["active", "inactive"] as const;

export type AgentStatus = (typeof AGENT_STATUSES)[number];

export const TRUST_LEVELS = ["trusted", "untrusted", "unknown"] as const;

export type TrustLevel = (typeof TRUST_LEVELS)[number];

export const RISK_LEVELS = ["low", "medium", "high", "critical"] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];

export const CAPABILITY_CLASSES = [
  "read_content",
  "read_untrusted_content",
  "local_generation",
  "external_side_effect",
] as const;

export type CapabilityClass = (typeof CAPABILITY_CLASSES)[number];

export interface Agent {
  id: string;
  name: string;
  domain: string;
  description: string;
  status: AgentStatus;
  createdAt: Date;
}

export interface Capability {
  id: string;
  agentId: string;

  toolName: string;
  capabilityClass: CapabilityClass;

  riskLevel: RiskLevel;
  defaultSourceTrust: TrustLevel;

  requiresAuthorization: boolean;

  description: string;
}
