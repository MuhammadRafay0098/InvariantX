import { Activity, ArrowUpRight, Clock3 } from "lucide-react";

import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";

interface DashboardIncident {
  id: string;
  agentId: string;
  status: string;
  riskLevel?: string | null;
  createdAt: Date | string;
}

interface RecentIncidentsProps {
  incidents: DashboardIncident[];
}

function formatTimestamp(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getRiskTone(
  riskLevel?: string | null,
): "danger" | "warning" | "neutral" {
  if (riskLevel === "critical" || riskLevel === "high") {
    return "danger";
  }

  if (riskLevel === "medium") {
    return "warning";
  }

  return "neutral";
}

export default function RecentIncidents({
  incidents,
}: RecentIncidentsProps) {
  return (
    <GlassPanel className="h-full min-w-0 overflow-hidden">
      <div className="flex min-w-0 items-start justify-between gap-4 border-b border-white/[0.06] p-4 sm:p-5">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-rose-300/55">
              Event stream
            </span>

            <span className="h-px w-7 bg-gradient-to-r from-rose-300/35 to-transparent" />
          </div>

          <h2 className="text-sm font-semibold text-white">
            Recent incidents
          </h2>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Latest security events observed across registered agents.
          </p>
        </div>

        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-rose-400/10 bg-rose-400/[0.045]">
          <Activity className="size-4 text-rose-200/70" />
        </div>
      </div>

      <div className="min-w-0 p-3 sm:p-4">
        {incidents.length > 0 ? (
          <div className="space-y-2">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="group flex min-w-0 flex-col gap-3 rounded-2xl border border-white/[0.05] bg-black/15 p-3.5 transition duration-200 hover:border-white/[0.1] hover:bg-white/[0.025] sm:flex-row sm:items-center sm:p-4"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-rose-400/10 bg-rose-400/[0.05]">
                    <Activity className="size-3.5 text-rose-200" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="max-w-full truncate font-mono text-xs font-medium text-zinc-300">
                        {incident.id}
                      </span>

                      <StatusBadge tone={getRiskTone(incident.riskLevel)}>
                        {(incident.riskLevel ?? incident.status).toUpperCase()}
                      </StatusBadge>
                    </div>

                    <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-600">
                      <span className="min-w-0 break-all">
                        Agent {incident.agentId}
                      </span>

                      <span className="flex shrink-0 items-center gap-1.5">
                        <Clock3 className="size-3" />
                        {formatTimestamp(incident.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden size-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-zinc-700 transition group-hover:border-white/[0.06] group-hover:bg-white/[0.025] group-hover:text-zinc-400 sm:flex">
                  <ArrowUpRight className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] px-6 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05]">
              <Activity className="size-4 text-emerald-200" />
            </div>

            <p className="text-sm font-medium text-zinc-300">
              No incidents recorded
            </p>

            <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-600">
              Run the repository security demo to generate the first sandboxed
              incident.
            </p>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}