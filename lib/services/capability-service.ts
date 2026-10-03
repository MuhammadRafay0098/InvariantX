import { eq } from "drizzle-orm";

import { db } from "../db/client";
import { capabilities } from "../db/schema";

export async function getCapabilitiesByAgentId(agentId: string) {
  return db
    .select({
      agentId: capabilities.agentId,
      toolName: capabilities.toolName,
      capabilityClass: capabilities.capabilityClass,
      defaultSourceTrust: capabilities.defaultSourceTrust,
      requiresAuthorization: capabilities.requiresAuthorization,
      description: capabilities.description,
    })
    .from(capabilities)
    .where(eq(capabilities.agentId, agentId));
}
