import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import GlassPanel from "@/components/ui/GlassPanel";

interface MetricCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  accent?: "cyan" | "violet" | "emerald" | "amber";
}

const accents = {
  cyan: {
    icon: "text-cyan-200",
    iconBackground: "border-cyan-400/15 bg-cyan-400/[0.07]",
    glow: "from-cyan-400/10",
  },
  violet: {
    icon: "text-violet-200",
    iconBackground: "border-violet-400/15 bg-violet-400/[0.07]",
    glow: "from-violet-400/10",
  },
  emerald: {
    icon: "text-emerald-200",
    iconBackground: "border-emerald-400/15 bg-emerald-400/[0.07]",
    glow: "from-emerald-400/10",
  },
  amber: {
    icon: "text-amber-200",
    iconBackground: "border-amber-400/15 bg-amber-400/[0.07]",
    glow: "from-amber-400/10",
  },
} as const;

export default function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  accent = "cyan",
}: MetricCardProps) {
  const palette = accents[accent];

  return (
    <GlassPanel
      interactive
      className="group relative min-h-36 min-w-0 overflow-hidden p-4 sm:min-h-40 sm:p-5"
    >
      <div
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-24",
          "bg-gradient-to-b to-transparent opacity-0 transition-opacity duration-500",
          "group-hover:opacity-100",
          palette.glow,
        ].join(" ")}
      />

      <div className="relative flex h-full min-w-0 flex-col justify-between gap-5 sm:gap-6">
        <div className="flex items-start justify-between gap-4">
          <div
            className={[
              "flex size-10 items-center justify-center rounded-xl border",
              palette.iconBackground,
            ].join(" ")}
          >
            <Icon
              aria-hidden="true"
              className={`size-[18px] ${palette.icon}`}
            />
          </div>

          <ArrowUpRight
            aria-hidden="true"
            className="size-4 text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/50"
          />
        </div>

        <div>
          <div className="break-words text-[clamp(1.65rem,4vw,1.875rem)] font-semibold tracking-[-0.04em] text-white">
            {value}
          </div>

          <div className="mt-1 text-sm font-medium text-zinc-300">{label}</div>

          <p className="mt-1.5 text-xs leading-5 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
