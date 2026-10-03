import {
  ArrowRight,
  BrainCircuit,
  Check,
  Fingerprint,
  Network,
  ScanSearch,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";

const stages = [
  {
    label: "Incident",
    description: "Observe unsafe capability use",
    icon: ScanSearch,
    tone: "rose",
  },
  {
    label: "Analyze",
    description: "Interpret security semantics",
    icon: BrainCircuit,
    tone: "amber",
  },
  {
    label: "Invariant",
    description: "Extract reusable constraint",
    icon: Fingerprint,
    tone: "cyan",
  },
  {
    label: "Map",
    description: "Bind to target capabilities",
    icon: Network,
    tone: "violet",
  },
  {
    label: "Validate",
    description: "Test security and utility",
    icon: ShieldCheck,
    tone: "emerald",
  },
  {
    label: "Approve",
    description: "Human-controlled activation",
    icon: UserCheck,
    tone: "blue",
  },
] as const;

const toneClasses = {
  rose: {
    icon: "border-rose-400/15 bg-rose-400/[0.06] text-rose-200",
    line: "from-rose-400/50",
  },
  amber: {
    icon: "border-amber-400/15 bg-amber-400/[0.06] text-amber-200",
    line: "from-amber-400/50",
  },
  cyan: {
    icon: "border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-200",
    line: "from-cyan-400/50",
  },
  violet: {
    icon: "border-violet-400/15 bg-violet-400/[0.06] text-violet-200",
    line: "from-violet-400/50",
  },
  emerald: {
    icon: "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-200",
    line: "from-emerald-400/50",
  },
  blue: {
    icon: "border-blue-400/15 bg-blue-400/[0.06] text-blue-200",
    line: "from-blue-400/50",
  },
} as const;

export default function SecurityPipeline() {
  return (
    <GlassPanel className="min-w-0 overflow-hidden">
      <div className="flex min-w-0 flex-col gap-4 border-b border-white/[0.06] p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-300/60">
              Core security workflow
            </span>

            <span className="h-px w-8 bg-gradient-to-r from-cyan-300/40 to-transparent" />
          </div>

          <h2 className="text-base font-semibold tracking-[-0.02em] text-white">
            Security transfer pipeline
          </h2>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-500">
            Defense knowledge moves from an observed incident to a validated,
            human-approved policy through controlled and auditable stages.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <StatusBadge tone="info">DETERMINISTIC GATES</StatusBadge>
          <StatusBadge tone="success">HUMAN APPROVAL</StatusBadge>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const tone = toneClasses[stage.tone];
            const finalStage = index === stages.length - 1;

            return (
              <div
                key={stage.label}
                className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.055] bg-black/15 p-4 transition duration-200 hover:border-white/[0.1] hover:bg-white/[0.025]"
              >
                <div
                  className={[
                    "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent opacity-60",
                    tone.line,
                  ].join(" ")}
                />

                <div className="mb-5 flex items-center justify-between gap-3">
                  <div
                    className={[
                      "flex size-9 shrink-0 items-center justify-center rounded-xl border",
                      tone.icon,
                    ].join(" ")}
                  >
                    <Icon className="size-4" />
                  </div>

                  <span className="font-mono text-[10px] tracking-[0.12em] text-zinc-700">
                    0{index + 1}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-zinc-200">
                    {stage.label}
                  </h3>

                  <p className="mt-1.5 text-[11px] leading-4 text-zinc-600">
                    {stage.description}
                  </p>
                </div>

                {!finalStage ? (
                  <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-zinc-700 2xl:hidden">
                    <Check className="size-3 text-emerald-300/50" />
                    Controlled handoff
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-emerald-300/60">
                    <Check className="size-3" />
                    Activation gate
                  </div>
                )}

                {!finalStage ? (
                  <div className="absolute -right-2 top-8 z-10 hidden size-4 items-center justify-center rounded-full border border-white/[0.08] bg-[#090b12] 2xl:flex">
                    <ArrowRight className="size-2 text-zinc-600" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex min-w-0 flex-col gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.018] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.05]">
              <Fingerprint className="size-3.5 text-cyan-200" />
            </div>

            <p className="min-w-0 text-[11px] leading-5 text-zinc-500">
              AI proposes and explains security knowledge; deterministic policy
              logic validates enforcement conditions before human activation.
            </p>
          </div>

          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-700">
            auditable by design
          </span>
        </div>
      </div>
    </GlassPanel>
  );
}