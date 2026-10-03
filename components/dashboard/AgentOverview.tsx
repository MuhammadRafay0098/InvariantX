import { Bot, CalendarDays, GitBranch, Radio } from "lucide-react";

import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";

interface DashboardAgent {
  id: string;
  name: string;
  status: string;
}

interface AgentOverviewProps {
  agents: DashboardAgent[];
}

function getAgentVisual(name: string) {
  const normalizedName = name.toLowerCase();

  if (
    normalizedName.includes("email") ||
    normalizedName.includes("calendar")
  ) {
    return {
      icon: CalendarDays,
      gradient: "from-violet-400/[0.12] to-fuchsia-400/[0.03]",
      iconClass: "text-violet-200",
      eyebrow: "Messaging domain",
    };
  }

  return {
    icon: GitBranch,
    gradient: "from-cyan-400/[0.12] to-blue-400/[0.03]",
    iconClass: "text-cyan-200",
    eyebrow: "Repository domain",
  };
}

export default function AgentOverview({
  agents,
}: AgentOverviewProps) {
  const activeAgents = agents.filter(
    (agent) => agent.status === "active",
  ).length;

  return (
    <GlassPanel className="h-full min-w-0 overflow-hidden">
      <div className="flex min-w-0 items-start justify-between gap-4 border-b border-white/[0.06] p-4 sm:p-5">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-300/55">
              Transfer environment
            </span>

            <span className="h-px w-7 bg-gradient-to-r from-cyan-300/35 to-transparent" />
          </div>

          <h2 className="text-sm font-semibold text-white">
            Agent topology
          </h2>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Structurally different agents available for semantic transfer.
          </p>
        </div>

        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.045]">
          <Bot className="size-4 text-cyan-200/70" />
        </div>
      </div>

      <div className="border-b border-white/[0.05] px-4 py-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="min-w-0 rounded-xl border border-white/[0.05] bg-black/15 px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-700">
              Registered
            </p>

            <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-zinc-200">
              {agents.length}
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-emerald-400/[0.07] bg-emerald-400/[0.025] px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-300/50">
              Active
            </p>

            <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-emerald-100">
              {activeAgents}
            </p>
          </div>
        </div>
      </div>

      <div className="min-w-0 space-y-3 p-3 sm:p-4">
        {agents.length > 0 ? (
          agents.map((agent) => {
            const visual = getAgentVisual(agent.name);
            const Icon = visual.icon;
            const active = agent.status === "active";

            return (
              <div
                key={agent.id}
                className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.055] bg-black/15 p-3.5 transition duration-200 hover:border-white/[0.1] hover:bg-white/[0.025] sm:p-4"
              >
                <div
                  className={[
                    "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50",
                    visual.gradient,
                  ].join(" ")}
                />

                <div className="relative flex min-w-0 items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-black/25">
                    <Icon
                      className={`size-[17px] ${visual.iconClass}`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-700">
                          {visual.eyebrow}
                        </p>

                        <h3 className="truncate text-sm font-medium text-zinc-200">
                          {agent.name}
                        </h3>

                        <p className="mt-0.5 break-all font-mono text-[10px] text-zinc-600">
                          {agent.id}
                        </p>
                      </div>

                      <StatusBadge
                        tone={active ? "success" : "neutral"}
                        pulse={active}
                      >
                        {agent.status.toUpperCase()}
                      </StatusBadge>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-600">
                      <Radio
                        className={[
                          "size-3",
                          active
                            ? "text-emerald-300/60"
                            : "text-zinc-700",
                        ].join(" ")}
                      />

                      Capability graph available
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.08] px-4 py-10 text-center">
            <p className="text-sm text-zinc-500">
              No agents registered.
            </p>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}