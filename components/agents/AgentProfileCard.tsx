import { Bot, CircleCheck, Network } from "lucide-react";

import CapabilityGraph, { type AgentCapabilityView } from "./CapabilityGraph";
import TrustBoundary from "./TrustBoundary";

interface AgentProfileCardProps {
  agent: {
    id: string;
    name: string;
    domain: string;
    description: string;
    status: string;
  };
  capabilities: AgentCapabilityView[];
  accent: "cyan" | "violet";
}

const accentStyles = {
  cyan: {
    shell: "border-cyan-400/10",
    glow: "bg-cyan-400/[0.055]",
    icon: "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-200",
    label: "text-cyan-200/70",
  },
  violet: {
    shell: "border-violet-400/10",
    glow: "bg-violet-400/[0.055]",
    icon: "border-violet-400/15 bg-violet-400/[0.07] text-violet-200",
    label: "text-violet-200/70",
  },
} as const;

export default function AgentProfileCard({
  agent,
  capabilities,
  accent,
}: AgentProfileCardProps) {
  const styles = accentStyles[accent];

  return (
    <article
      className={[
        "relative min-w-0 overflow-hidden rounded-3xl border bg-[#07090e]/80",
        "shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-md sm:backdrop-blur-lg",
        styles.shell,
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute -right-20 -top-20 hidden size-64 rounded-full blur-[80px] sm:block",
          styles.glow,
        ].join(" ")}
      />

      <header className="relative border-b border-white/[0.055] p-5 sm:p-6">
        <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={[
                "flex size-11 shrink-0 items-center justify-center rounded-2xl border",
                styles.icon,
              ].join(" ")}
            >
              <Bot className="size-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-white">
                  {agent.name}
                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-emerald-200">
                  <CircleCheck className="size-2.5" />
                  {agent.status}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="[overflow-wrap:anywhere] font-mono text-[10px] text-zinc-600">
                  {agent.id}
                </span>

                <span className="size-1 rounded-full bg-zinc-800" />

                <span
                  className={[
                    "text-[10px] uppercase tracking-[0.14em]",
                    styles.label,
                  ].join(" ")}
                >
                  {agent.domain}
                </span>
              </div>

              <p className="mt-3 max-w-xl text-xs leading-5 text-zinc-500">
                {agent.description}
              </p>
            </div>
          </div>

          <div className="flex w-fit max-w-full shrink-0 items-center gap-2 rounded-xl border border-white/[0.055] bg-black/20 px-3 py-2">
            <Network className="size-3.5 text-zinc-600" />

            <span className="font-mono text-[10px] text-zinc-500">
              {capabilities.length} capabilities
            </span>
          </div>
        </div>
      </header>

      <div className="relative space-y-6 p-5 sm:p-6">
        <CapabilityGraph capabilities={capabilities} />

        <div>
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
            Trust boundary
          </p>

          <TrustBoundary capabilities={capabilities} />
        </div>
      </div>
    </article>
  );
}
