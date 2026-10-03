import {
  BrainCircuit,
  Check,
  FlaskConical,
  GitBranch,
  KeyRound,
  Radar,
} from "lucide-react";

import type { DemoStage } from "./types";

interface DemoStageRailProps {
  stage: DemoStage;
}

const stages = [
  {
    id: "incident",
    label: "Incident",
    description: "Observe",
    icon: Radar,
  },
  {
    id: "analysis",
    label: "Invariant",
    description: "Extract",
    icon: BrainCircuit,
  },
  {
    id: "transfer",
    label: "Transfer",
    description: "Map",
    icon: GitBranch,
  },
  {
    id: "validation",
    label: "Validate",
    description: "Prove",
    icon: FlaskConical,
  },
  {
    id: "approval",
    label: "Activate",
    description: "Approve",
    icon: KeyRound,
  },
] as const;

const stageOrder: Record<DemoStage, number> = {
  idle: 0,
  incident: 1,
  analysis: 2,
  transfer: 3,
  validation: 4,
  approval: 5,
};

export default function DemoStageRail({ stage }: DemoStageRailProps) {
  const currentIndex = stageOrder[stage];

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-black/20">
      <div
        className={[
          "overflow-x-auto overscroll-x-contain scroll-smooth",
          "[scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        <div className="flex min-w-max xl:grid xl:min-w-0 xl:grid-cols-5">
          {stages.map((item, index) => {
            const itemIndex = index + 1;
            const complete = currentIndex > itemIndex;
            const active = currentIndex === itemIndex;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                aria-current={active ? "step" : undefined}
                className={[
                  "relative flex min-h-[4.75rem] w-[9.25rem] shrink-0 items-center gap-2.5 px-3.5 py-3.5 sm:w-40 sm:gap-3 sm:px-4 sm:py-4",
                  "border-r border-white/[0.06]",
                  "last:border-r-0",
                  "xl:w-auto xl:shrink",
                  active ? "bg-cyan-400/[0.045]" : "",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex size-9 shrink-0 items-center justify-center rounded-xl border",
                    complete
                      ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200"
                      : active
                        ? "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-200"
                        : "border-white/[0.07] bg-white/[0.025] text-zinc-600",
                  ].join(" ")}
                >
                  {complete ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : (
                    <Icon aria-hidden="true" className="size-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <p
                    className={[
                      "text-xs font-medium",
                      complete || active ? "text-zinc-200" : "text-zinc-600",
                    ].join(" ")}
                  >
                    {item.label}
                  </p>

                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-700">
                    {item.description}
                  </p>
                </div>

                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
