import { ArrowRight, Fingerprint, Sparkles } from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";

interface DashboardHeroProps {
  activeAgents: number;
  totalAgents: number;
}

export default function DashboardHero({
  activeAgents,
  totalAgents,
}: DashboardHeroProps) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.025] px-4 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-md sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute -right-20 -top-32 hidden size-72 rounded-full bg-cyan-400/[0.07] blur-[70px] md:block" />
      <div className="pointer-events-none absolute bottom-[-150px] left-[30%] hidden size-72 rounded-full bg-violet-500/[0.07] blur-[72px] md:block" />

      <div className="relative grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_340px] 2xl:items-end">
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <StatusBadge tone="success" pulse>
              SYSTEM OPERATIONAL
            </StatusBadge>

            <StatusBadge tone="info">
              {activeAgents}/{totalAgents} AGENTS ACTIVE
            </StatusBadge>
          </div>

          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="hidden size-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.12] to-violet-400/[0.06] sm:flex">
              <Fingerprint className="size-5 text-cyan-100" />
            </div>

            <div className="min-w-0">
              <p className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-200/70 sm:text-xs sm:tracking-[0.2em]">
                <Sparkles className="size-3.5 shrink-0" />
                Cross-Agent Defense Intelligence
              </p>

              <h1 className="max-w-4xl text-[clamp(1.85rem,4.5vw,2.875rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-white">
                Transfer security knowledge,
                <span className="hero-gradient-text">
                  {" "}
                  not attack signatures.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:mt-5 sm:text-[15px]">
                InvariantX converts observed agent incidents into reusable
                security principles, maps them across different capability
                structures, and validates defenses before human-controlled
                activation.
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-black/20 p-3.5 sm:p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/[0.04] via-transparent to-violet-400/[0.04]" />

          <div className="relative min-w-0">
            <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
              <span className="min-w-0 text-xs font-medium text-zinc-400">
                Current security model
              </span>

              <span className="size-1.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
            </div>

            <div className="grid min-w-0 grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 text-[10px] sm:gap-3 sm:text-xs">
              <span className="min-w-0 rounded-lg border border-white/[0.06] bg-white/[0.035] px-1.5 py-2 text-center text-zinc-300 sm:px-3">
                Incident
              </span>

              <ArrowRight className="size-3 shrink-0 text-zinc-700 sm:size-3.5" />

              <span className="min-w-0 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.05] px-1.5 py-2 text-center text-cyan-100 sm:px-3">
                Invariant
              </span>

              <ArrowRight className="size-3 shrink-0 text-zinc-700 sm:size-3.5" />

              <span className="min-w-0 rounded-lg border border-violet-400/10 bg-violet-400/[0.05] px-1.5 py-2 text-center text-violet-100 sm:px-3">
                Defense
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}