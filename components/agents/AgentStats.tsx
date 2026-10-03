import { Activity, Bot, Boxes, ShieldAlert } from "lucide-react";

interface AgentStatsProps {
  agentCount: number;
  capabilityCount: number;
  sideEffectCount: number;
  authorizationCount: number;
}

interface StatItem {
  label: string;
  value: number;
  description: string;
  icon: typeof Bot;
  tone: "cyan" | "violet" | "rose" | "emerald";
}

const toneStyles = {
  cyan: {
    border: "border-cyan-400/10",
    background: "bg-cyan-400/[0.035]",
    icon: "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-200",
  },
  violet: {
    border: "border-violet-400/10",
    background: "bg-violet-400/[0.035]",
    icon: "border-violet-400/15 bg-violet-400/[0.07] text-violet-200",
  },
  rose: {
    border: "border-rose-400/10",
    background: "bg-rose-400/[0.035]",
    icon: "border-rose-400/15 bg-rose-400/[0.07] text-rose-200",
  },
  emerald: {
    border: "border-emerald-400/10",
    background: "bg-emerald-400/[0.035]",
    icon: "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-200",
  },
} as const;

export default function AgentStats({
  agentCount,
  capabilityCount,
  sideEffectCount,
  authorizationCount,
}: AgentStatsProps) {
  const stats: StatItem[] = [
    {
      label: "Registered agents",
      value: agentCount,
      description: "Active participants in the transfer environment.",
      icon: Bot,
      tone: "cyan",
    },
    {
      label: "Capabilities",
      value: capabilityCount,
      description: "Semantically classified tools across registered agents.",
      icon: Boxes,
      tone: "violet",
    },
    {
      label: "Side-effect tools",
      value: sideEffectCount,
      description: "Capabilities capable of changing external state.",
      icon: ShieldAlert,
      tone: "rose",
    },
    {
      label: "Authorization gates",
      value: authorizationCount,
      description: "Capabilities requiring trusted authorization.",
      icon: Activity,
      tone: "emerald",
    },
  ];

  return (
    <section className="grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const styles = toneStyles[stat.tone];

        return (
          <article
            key={stat.label}
            className={[
              "relative min-w-0 overflow-hidden rounded-2xl border p-4",
              "bg-black/20 backdrop-blur-md sm:backdrop-blur-lg",
              styles.border,
              styles.background,
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                  {stat.label}
                </p>

                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                  {stat.value}
                </p>
              </div>

              <div
                className={[
                  "flex size-9 items-center justify-center rounded-xl border",
                  styles.icon,
                ].join(" ")}
              >
                <Icon className="size-4" />
              </div>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-zinc-600">
              {stat.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}
