import { Play, ShieldCheck, Sparkles } from "lucide-react";

import AppShell from "../../components/layout/AppShell";
import DemoControlCenter from "../../components/demo/DemoControlCenter";

export const dynamic = "force-dynamic";

export default function DemoPage() {
  return (
    <AppShell>
      <div className="min-w-0 space-y-4 sm:space-y-5">
        <section className="relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] px-4 py-6 sm:rounded-3xl sm:px-6 sm:py-7 lg:px-7 lg:py-8">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-cyan-400/[0.045] blur-[90px] sm:size-80" />
          <div className="pointer-events-none absolute left-1/3 top-0 hidden size-64 rounded-full bg-violet-500/[0.035] blur-[90px] sm:block" />

          <div className="relative min-w-0 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-200/70 sm:tracking-[0.18em]">
              <Play className="size-3.5" />
              Interactive Security Transfer
            </div>

            <h1 className="mt-3 max-w-2xl text-[clamp(1.8rem,4.2vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-white">
              Watch one incident become a defense for another agent.
            </h1>

            <p className="mt-4 max-w-2xl text-[13px] leading-6 text-zinc-500 sm:text-sm">
              Run the complete InvariantX lifecycle step by step: detect an
              unsafe capability request, extract its security invariant, map
              that invariant across agents, prove the defense in a sandbox, then
              explicitly approve activation.
            </p>

            <div className="mt-5 flex min-w-0 flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-1.5 text-[10px] text-emerald-200/70">
                <ShieldCheck className="size-3" />
                Deterministic enforcement
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/10 bg-violet-400/[0.04] px-3 py-1.5 text-[10px] text-violet-200/70">
                <Sparkles className="size-3" />
                AI-assisted reasoning
              </span>
            </div>
          </div>
        </section>

        <DemoControlCenter />
      </div>
    </AppShell>
  );
}
