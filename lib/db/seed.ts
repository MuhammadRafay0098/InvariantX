import { eq } from "drizzle-orm";

import { db } from "./client";
import { agents, capabilities } from "./schema";

interface SeedResult {
  agents: number;
  capabilities: number;
}

const demoAgents = [
  {
    id: "AGENT-001",
    name: "Repository Assistant",
    domain: "repository",
    description:
      "Sandboxed assistant that reads repository content, summarizes issues, and exposes a simulated external notification capability.",
    status: "active" as const,
  },
  {
    id: "AGENT-002",
    name: "Email Calendar Assistant",
    domain: "email_calendar",
    description:
      "Sandboxed assistant that reads external email, summarizes messages, and exposes a simulated calendar side-effect capability.",
    status: "active" as const,
  },
];

const demoCapabilities = [
  {
    id: "CAP-REP-001",
    agentId: "AGENT-001",
    toolName: "read_issue",
    capabilityClass: "read_untrusted_content" as const,
    riskLevel: "low" as const,
    defaultSourceTrust: "untrusted" as const,
    requiresAuthorization: false,
    description:
      "Reads issue content that may originate from an untrusted external contributor.",
  },
  {
    id: "CAP-REP-002",
    agentId: "AGENT-001",
    toolName: "read_file",
    capabilityClass: "read_content" as const,
    riskLevel: "low" as const,
    defaultSourceTrust: "trusted" as const,
    requiresAuthorization: false,
    description: "Reads repository file content inside the sandbox.",
  },
  {
    id: "CAP-REP-003",
    agentId: "AGENT-001",
    toolName: "create_summary",
    capabilityClass: "local_generation" as const,
    riskLevel: "low" as const,
    defaultSourceTrust: "unknown" as const,
    requiresAuthorization: false,
    description:
      "Produces a local textual summary without external side effects.",
  },
  {
    id: "CAP-REP-004",
    agentId: "AGENT-001",
    toolName: "send_notification",
    capabilityClass: "external_side_effect" as const,
    riskLevel: "high" as const,
    defaultSourceTrust: "unknown" as const,
    requiresAuthorization: true,
    description:
      "Simulates sending an external notification. No real notification is transmitted.",
  },
  {
    id: "CAP-EMAIL-001",
    agentId: "AGENT-002",
    toolName: "read_email",
    capabilityClass: "read_untrusted_content" as const,
    riskLevel: "low" as const,
    defaultSourceTrust: "untrusted" as const,
    requiresAuthorization: false,
    description: "Reads synthetic external email content inside the sandbox.",
  },
  {
    id: "CAP-EMAIL-002",
    agentId: "AGENT-002",
    toolName: "summarize_email",
    capabilityClass: "local_generation" as const,
    riskLevel: "low" as const,
    defaultSourceTrust: "unknown" as const,
    requiresAuthorization: false,
    description:
      "Produces a local email summary without changing external state.",
  },
  {
    id: "CAP-EMAIL-003",
    agentId: "AGENT-002",
    toolName: "create_calendar_event",
    capabilityClass: "external_side_effect" as const,
    riskLevel: "high" as const,
    defaultSourceTrust: "unknown" as const,
    requiresAuthorization: true,
    description:
      "Simulates calendar event creation. No real calendar service is modified.",
  },
];

export async function seedDemoEnvironment(): Promise<SeedResult> {
  for (const agent of demoAgents) {
    const existingAgent = await db
      .select({
        id: agents.id,
      })
      .from(agents)
      .where(eq(agents.id, agent.id))
      .limit(1);

    if (existingAgent.length === 0) {
      await db.insert(agents).values(agent);
    }
  }

  for (const capability of demoCapabilities) {
    const existingCapability = await db
      .select({
        id: capabilities.id,
      })
      .from(capabilities)
      .where(eq(capabilities.id, capability.id))
      .limit(1);

    if (existingCapability.length === 0) {
      await db.insert(capabilities).values(capability);
    }
  }

  return {
    agents: demoAgents.length,
    capabilities: demoCapabilities.length,
  };
}
