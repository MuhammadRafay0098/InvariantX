import Link from "next/link";
import { Activity, ArrowRight, Play } from "lucide-react";

import RepositoryDemoLauncher from "@/components/demo/RepositoryDemoLauncher";
import AppShell from "@/components/layout/AppShell";
import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import { getDashboardData } from "@/lib/services/dashboard-service";

export const dynamic = "force-dynamic";

export default async function IncidentsPage() {
  const dashboard = await getDashboardData();
  const incidents = dashboard.recent.incidents;

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-rose-200/70">
              <Activity className="size-3.5" />
              Incident Laboratory
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Observe the failure first.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Run the sandboxed Repository Assistant, capture the security
              violation, then convert the observed failure into transferable
              defense knowledge.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Play className="size-3.5" />
            Synthetic execution only
          </div>
        </section>

        <RepositoryDemoLauncher />

        <GlassPanel className="overflow-hidden">
          <div className="border-b border-white/[0.06] p-5">
            <h2 className="text-sm font-semibold text-white">
              Recorded incidents
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Most recent persisted security events.
            </p>
          </div>

          <div className="p-4">
            {incidents.length > 0 ? (
              <div className="space-y-2">
                {incidents.map((incident) => (
                  <Link
                    key={incident.id}
                    href={`/incidents/${encodeURIComponent(incident.id)}`}
                    className="group flex flex-col gap-3 rounded-2xl border border-white/[0.055] bg-black/15 p-4 transition hover:border-white/[0.1] hover:bg-white/[0.025] sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-rose-400/10 bg-rose-400/[0.05]">
                        <Activity className="size-4 text-rose-200" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs text-zinc-300">
                          {incident.id}
                        </p>

                        <p className="mt-1 text-[11px] text-zinc-600">
                          {incident.agentId} · {incident.observedAction}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge
                        tone={
                          incident.status === "analyzed" ? "success" : "warning"
                        }
                      >
                        {incident.status.toUpperCase()}
                      </StatusBadge>

                      <ArrowRight className="size-3.5 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-zinc-400" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-zinc-400">
                  No incidents recorded yet.
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Run the Repository Assistant demo above.
                </p>
              </div>
            )}
          </div>
        </GlassPanel>
      </div>
    </AppShell>
  );
}
