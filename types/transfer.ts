export const TRANSFER_STATUSES = [
  "mapped",
  "validating",
  "ready_for_review",
  "approved",
  "rejected",
] as const;

export type TransferStatus = (typeof TRANSFER_STATUSES)[number];

export interface SemanticMapping {
  applicable: boolean;

  targetAgentId: string;
  targetTool: string;

  capabilityClass: "external_side_effect";
  sourceTrustClass: "untrusted";

  mappingConfidence: number;

  reason: string;
}

export interface Transfer {
  id: string;

  invariantId: string;

  sourceAgentId: string;
  targetAgentId: string;

  targetTool: string;

  mappingConfidence: number;

  securityScore: number | null;
  utilityScore: number | null;

  status: TransferStatus;

  createdAt: Date;
  updatedAt: Date;
}
