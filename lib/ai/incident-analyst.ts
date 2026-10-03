import type { Incident } from "../../types/incident";

import { runStructuredAI } from "./client";
import { incidentAnalysisSchema, type IncidentAnalysis } from "./schemas";
import type { StructuredAIResult } from "./types";

const SYSTEM_PROMPT = `
You are the Incident Analyst for InvariantX.

Your job is to analyze an already-detected AI agent security incident.

Focus only on security semantics:
- source trust
- capability class
- trusted authorization
- whether the event is security relevant

Do not invent tools, actions, permissions, or facts that are not present
in the supplied incident.

Return only valid JSON matching the requested structure.
`.trim();

export async function analyzeIncident(
  incident: Incident,
): Promise<StructuredAIResult<IncidentAnalysis>> {
  const fallback: IncidentAnalysis = {
    summary:
      "Untrusted-derived context influenced an external side-effect request without trusted authorization.",

    sourceTrust: incident.sourceTrust,

    capabilityClass: incident.capabilityClass,

    trustedAuthorization: incident.trustedAuthorization,

    securityRelevant:
      incident.sourceTrust === "untrusted" &&
      incident.capabilityClass === "external_side_effect" &&
      !incident.trustedAuthorization,

    reasoning:
      "The incident combines untrusted input, an external side-effect capability, and absence of trusted authorization.",
  };

  const userPrompt = JSON.stringify(
    {
      task: "Analyze this detected incident using only the supplied facts.",
      incident: {
        id: incident.id,
        agentId: incident.agentId,
        originalGoal: incident.originalGoal,
        source: incident.source,
        sourceTrust: incident.sourceTrust,
        observedAction: incident.observedAction,
        capabilityClass: incident.capabilityClass,
        trustedAuthorization: incident.trustedAuthorization,
        severity: incident.severity,
        status: incident.status,
      },
      requiredOutput: {
        summary: "string",
        sourceTrust: "trusted | untrusted | unknown",
        capabilityClass:
          "read_content | read_untrusted_content | local_generation | external_side_effect",
        trustedAuthorization: "boolean",
        securityRelevant: "boolean",
        reasoning: "string",
      },
    },
    null,
    2,
  );

  return runStructuredAI({
    module: "incident_analyst",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    schema: incidentAnalysisSchema,
    fallback,
  });
}
