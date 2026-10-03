import { asc } from "drizzle-orm";

import AppShell from "../../components/layout/AppShell";
import AgentsWorkspace from "../../components/agents/AgentsWorkspace";
import { db } from "../../lib/db/client";
import { agents, capabilities } from "../../lib/db/schema";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const [agentRows, capabilityRows] = await Promise.all([
    db.select().from(agents).orderBy(asc(agents.id)),

    db
      .select()
      .from(capabilities)
      .orderBy(asc(capabilities.agentId), asc(capabilities.id)),
  ]);

  const agentViews = agentRows.map((agent) => ({
    id: agent.id,
    name: agent.name,
    domain: agent.domain,
    description: agent.description,
    status: agent.status,
  }));

  const capabilityViews = capabilityRows.map((capability) => ({
    id: capability.id,
    agentId: capability.agentId,
    toolName: capability.toolName,
    capabilityClass: capability.capabilityClass,
    riskLevel: capability.riskLevel,
    defaultSourceTrust: capability.defaultSourceTrust,
    requiresAuthorization: capability.requiresAuthorization,
    description: capability.description,
  }));

  return (
    <AppShell>
      <AgentsWorkspace agents={agentViews} capabilities={capabilityViews} />
    </AppShell>
  );
}
