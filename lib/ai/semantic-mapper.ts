import type { Invariant } from "../../types/invariant";
import type { SemanticMapping } from "../../types/transfer";

import { runStructuredAI } from "./client";
import { semanticMappingSchema } from "./schemas";
import type { StructuredAIResult } from "./types";

interface TargetCapability {
  agentId: string;
  toolName: string;
  capabilityClass:
    | "read_content"
    | "read_untrusted_content"
    | "local_generation"
    | "external_side_effect";
  defaultSourceTrust: "trusted" | "untrusted" | "unknown";
  requiresAuthorization: boolean;
  description: string;
}

const SYSTEM_PROMPT = `
You are the Semantic Mapper for InvariantX.

Map an abstract security invariant from one AI agent onto a
structurally different target agent.

Match security semantics rather than tool names.

You MUST return exactly one JSON object with these exact keys:

{
  "applicable": boolean,
  "targetAgentId": string,
  "targetTool": string,
  "capabilityClass": "external_side_effect",
  "sourceTrustClass": "untrusted",
  "mappingConfidence": number,
  "reason": string
}

Rules:
- Do not wrap the result in another object.
- Do not rename any key.
- Do not omit any key.
- mappingConfidence must be a number from 0 to 1.
- targetAgentId must equal the supplied target agent ID.
- targetTool must be selected only from supplied target capabilities.
- capabilityClass must be "external_side_effect".
- sourceTrustClass must be "untrusted".
- Do not invent capabilities.
- Return JSON only with no additional text.
`.trim();
export async function mapInvariantToTarget(
  invariant: Invariant,
  targetAgentId: string,
  capabilities: TargetCapability[],
): Promise<StructuredAIResult<SemanticMapping>> {
  const externalCapability = capabilities.find(
    (capability) => capability.capabilityClass === "external_side_effect",
  );

  if (!externalCapability) {
    throw new Error(
      `Target agent ${targetAgentId} has no external side-effect capability.`,
    );
  }

  const fallback: SemanticMapping = {
    applicable: true,
    targetAgentId,
    targetTool: externalCapability.toolName,
    capabilityClass: "external_side_effect",
    sourceTrustClass: "untrusted",
    mappingConfidence: 1,
    reason:
      "The target capability performs an external side effect and therefore matches the invariant's protected action class.",
  };

  const userPrompt = JSON.stringify(
    {
      task: "Map this invariant onto the supplied target agent capabilities.",
      invariant: {
        sourceTrust: invariant.sourceTrust,
        influence: invariant.influence,
        actionClass: invariant.actionClass,
        authorizationRequirement: invariant.authorizationRequirement,
        constraint: invariant.constraint,
        humanDescription: invariant.humanDescription,
      },
      targetAgentId,
      targetCapabilities: capabilities,
    },
    null,
    2,
  );

  return runStructuredAI({
    module: "semantic_mapper",
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    schema: semanticMappingSchema,
    fallback,
  });
}
