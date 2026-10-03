import { z } from "zod";

export const incidentAnalysisSchema = z.object({
  summary: z.string().min(1),

  sourceTrust: z.enum(["trusted", "untrusted", "unknown"]),

  capabilityClass: z.enum([
    "read_content",
    "read_untrusted_content",
    "local_generation",
    "external_side_effect",
  ]),

  trustedAuthorization: z.boolean(),

  securityRelevant: z.boolean(),

  reasoning: z.string().min(1),
});

export type IncidentAnalysis = z.infer<typeof incidentAnalysisSchema>;

export const invariantCandidateSchema = z.object({
  sourceTrust: z.enum(["trusted", "untrusted", "unknown"]),

  influence: z.literal("agent_decision"),

  actionClass: z.enum([
    "read_content",
    "read_untrusted_content",
    "local_generation",
    "external_side_effect",
  ]),

  authorization: z.literal("trusted_authorization_required"),

  constraint: z.literal("deny_or_require_approval"),

  humanDescription: z.string().min(1),

  reasoning: z.string().min(1),
});

export type InvariantCandidate = z.infer<typeof invariantCandidateSchema>;

export const semanticMappingSchema = z.object({
  applicable: z.boolean(),

  targetAgentId: z.string().min(1),
  targetTool: z.string().min(1),

  capabilityClass: z.literal("external_side_effect"),

  sourceTrustClass: z.literal("untrusted"),

  mappingConfidence: z.number().min(0).max(1),

  reason: z.string().min(1),
});

export type SemanticMappingResult = z.infer<typeof semanticMappingSchema>;

export const validationAnalysisSchema = z.object({
  summary: z.string().min(1),
  securityAssessment: z.string().min(1),
  utilityAssessment: z.string().min(1),
  recommendation: z.enum(["ready_for_review", "revise", "reject"]),
  reviewerNotes: z.array(z.string().min(1)),
});

export type ValidationAnalysisResult = z.infer<typeof validationAnalysisSchema>;
