import AgentOverview from "@/components/dashboard/AgentOverview";
import DashboardHero from "@/components/dashboard/DashboardHero";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import RecentIncidents from "@/components/dashboard/RecentIncidents";
import SecurityPipeline from "@/components/dashboard/SecurityPipeline";
import AppShell from "@/components/layout/AppShell";
import { getAgents, getDashboardData } from "@/lib/services/dashboard-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [dashboard, agents] = await Promise.all([
    getDashboardData(),
    getAgents(),
  ]);

  const activeAgents = agents.filter(
    (agent) => agent.status === "active",
  ).length;

  return (
    <AppShell>
      <div className="min-w-0 space-y-4 sm:space-y-5">
        <DashboardHero
          activeAgents={activeAgents}
          totalAgents={agents.length}
        />

        <MetricsGrid
          agents={dashboard.counts.agents}
          incidents={dashboard.counts.incidents}
          invariants={dashboard.counts.invariants}
          approvedPolicies={dashboard.counts.activePolicies}
        />

        <SecurityPipeline />

        <section className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <RecentIncidents incidents={dashboard.recent.incidents} />

          <AgentOverview agents={agents} />
        </section>
      </div>
    </AppShell>
  );
}
