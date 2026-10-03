import type { Incident } from "../../types/incident";

import { runStructuredAI } from "./client";
import { invariantCandidateSchema, type InvariantCandidate } from "./schemas";
import type { StructuredAIResult } from "./types";

const SYSTEM_PROMPT = `
You are the Invariant Miner for InvariantX.

Your task is to extract an attack-independent security invariant
from an already analyzed AI-agent security incident.

Generalize away:
- application-specific names
- exact tool names
- repository-specific details
- exact malicious wording

Preserve:
- source trust
- influence on agent decision
- capability/action semantics
- authorization requirement
- security constraint

Do not invent facts.

Return only valid JSON matching the requested structure.
`.trim();

export async function mineInvariant(
  incident: Incident,
): Promise<StructuredAIResult<InvariantCandidate>> {
  const fallback: InvariantCandidate = {
    sourceTrust: "untrusted",
    influence: "agent_decision",
    actionClass: "external_side_effect",
    authorization: "trusted_authorization_required",
    constraint: "deny_or_require_approval",
    humanDescription:
      "Untrusted-derived context alone must not authorize an external side effect.",
    reasoning:
      "The incident demonstrates that untrusted content must not independently authorize an externally consequential action.",
  };

  const userPrompt = JSON.stringify(
    {
      task: "Extract a reusable security invariant from this incident.",
      incident: {
        id: incident.id,
        originalGoal: incident.originalGoal,
        sourceTrust: incident.sourceTrust,
        observedAction: incident.observedAction,
        capabilityClass: incident.capabilityClass,
        trustedAuthorization: incident.trustedAuthorization,
        severity: incident.severity,
      },
      requiredOutput: {
        sourceTrust: "trusted | untrusted | unknown",
        influence: "agent_decision",
        actionClass:
          "read_content | read_untrusted_content | local_generation | external_side_effect",
        authorization: "trusted_authorization_required",
        constraint: "deny_or_require_approval",
        humanDescription: "string",
        reasoning: "string",
      },
    },
    null,
    2,
  );

  return runStructuredAI({
    module: "invariant_miner",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    schema: invariantCandidateSchema,
    fallback,
  });
}
