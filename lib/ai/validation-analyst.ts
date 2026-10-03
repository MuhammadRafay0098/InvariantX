import { runStructuredAI } from "./client";
import {
  validationAnalysisSchema,
  type ValidationAnalysisResult,
} from "./schemas";

import type { StructuredAIResult } from "./types";
import type { ValidationRun, ValidationSummary } from "../../types/validation";

interface AnalyzeValidationInput {
  transferId: string;
  targetAgentId: string;
  targetTool: string;
  runs: ValidationRun[];
  summary: ValidationSummary;
}

export async function analyzeValidationResults(
  input: AnalyzeValidationInput,
): Promise<StructuredAIResult<ValidationAnalysisResult>> {
  const fallback: ValidationAnalysisResult = {
    summary:
      input.summary.recommendation === "ready_for_review"
        ? "The proposed transferred defense passed all deterministic sandbox validation scenarios and is ready for human review."
        : "The proposed transferred defense did not fully satisfy deterministic sandbox validation.",
    securityAssessment: `${input.summary.security.passed}/${input.summary.security.total} security scenarios passed.`,
    utilityAssessment: `${input.summary.utility.passed}/${input.summary.utility.total} utility scenarios passed.`,
    recommendation: input.summary.recommendation,
    reviewerNotes: [
      "Deterministic validation results remain authoritative.",
      "This analysis does not activate or approve the policy.",
      "Human approval is required before runtime enforcement.",
    ],
  };

  return runStructuredAI({
    module: "validation_analyst",
    schema: validationAnalysisSchema,
    fallback,
    systemPrompt: `
You are the InvariantX Validation Analyst.

Your role is strictly advisory.

You receive deterministic sandbox validation results for a proposed
cross-agent security policy.

You MUST:
- summarize the supplied results accurately;
- explain the security-test outcome;
- explain the utility-test outcome;
- preserve the deterministic recommendation exactly;
- provide concise notes useful to a human reviewer.

You MUST NOT:
- change pass/fail results;
- invent validation scenarios;
- alter scores;
- approve or activate a policy;
- claim authority over deterministic policy enforcement.

The deterministic validation engine is authoritative.

You MUST return exactly one JSON object with these exact keys:
{
  "summary": string,
  "securityAssessment": string,
  "utilityAssessment": string,
  "recommendation": "ready_for_review" | "revise" | "reject",
  "reviewerNotes": string[]
}

The recommendation MUST exactly equal the deterministic recommendation
provided in the input.

Return JSON only.
`.trim(),
    userPrompt: JSON.stringify(
      {
        transferId: input.transferId,
        targetAgentId: input.targetAgentId,
        targetTool: input.targetTool,
        deterministicResults: {
          security: input.summary.security,
          utility: input.summary.utility,
          recommendation: input.summary.recommendation,
        },
        scenarios: input.runs.map((run) => ({
          scenarioId: run.scenarioId,
          type: run.type,
          expectedDecision: run.expectedDecision,
          actualDecision: run.actualDecision,
          passed: run.passed,
        })),
      },
      null,
      2,
    ),
  });
}
