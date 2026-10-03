import Link from "next/link";
import { ArrowRight, Fingerprint } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import { getDashboardData } from "@/lib/services/dashboard-service";

export const dynamic = "force-dynamic";

export default async function InvariantsPage() {
  const dashboard = await getDashboardData();
  const invariants = dashboard.recent.invariants;

  return (
    <AppShell>
      <div className="min-w-0 space-y-5 sm:space-y-6">
        <section>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200/70">
            <Fingerprint className="size-3.5" />
            Security Knowledge
          </div>

          <h1 className="max-w-4xl text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-white">
            Extracted invariants.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Attack-independent security principles mined from observed agent
            incidents.
          </p>
        </section>

        <GlassPanel className="overflow-hidden">
          <div className="border-b border-white/[0.06] p-5">
            <h2 className="text-sm font-semibold text-white">
              Invariant registry
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Recently extracted transferable constraints.
            </p>
          </div>

          <div className="p-4">
            {invariants.length > 0 ? (
              <div className="space-y-2">
                {invariants.map((invariant) => (
                  <Link
                    key={invariant.id}
                    href={`/invariants/${encodeURIComponent(invariant.id)}`}
                    className="group flex min-w-0 flex-col gap-3 rounded-2xl border border-white/[0.055] bg-black/15 p-3.5 transition hover:border-cyan-400/10 hover:bg-cyan-400/[0.02] sm:flex-row sm:items-center sm:p-4"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05]">
                        <Fingerprint className="size-4 text-cyan-200" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs text-zinc-300">
                          {invariant.id}
                        </p>

                        <p className="mt-1 [overflow-wrap:anywhere] text-[11px] leading-4 text-zinc-600 sm:truncate">
                          {invariant.actionClass} · {invariant.sourceTrust}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge
                        tone={
                          invariant.status === "active" ? "success" : "neutral"
                        }
                      >
                        {invariant.status.toUpperCase()}
                      </StatusBadge>

                      <ArrowRight className="size-3.5 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-zinc-400">
                  No invariants extracted yet.
                </p>

                <Link
                  href="/incidents"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-cyan-300"
                >
                  Analyze an incident
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            )}
          </div>
        </GlassPanel>
      </div>
    </AppShell>
  );
}
