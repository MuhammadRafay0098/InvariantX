import type { ReactNode } from "react";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

interface StatusBadgeProps {
  children: ReactNode;
  tone?: StatusTone;
  pulse?: boolean;
  className?: string;
}

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-white/10 bg-white/[0.045] text-zinc-300",
  info: "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-200",
  success: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-200",
  warning: "border-amber-400/20 bg-amber-400/[0.08] text-amber-200",
  danger: "border-rose-400/20 bg-rose-400/[0.08] text-rose-200",
};

const dotClasses: Record<StatusTone, string> = {
  neutral: "bg-zinc-400",
  info: "bg-cyan-300",
  success: "bg-emerald-300",
  warning: "bg-amber-300",
  danger: "bg-rose-300",
};

export default function StatusBadge({
  children,
  tone = "neutral",
  pulse = false,
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex max-w-full shrink-0 items-center gap-2 rounded-full border px-2.5 py-1",
        "text-[10px] font-medium tracking-[0.06em] sm:text-[11px] sm:tracking-[0.08em]",
        toneClasses[tone],
        className,
      ].join(" ")}
    >
      <span className="relative flex size-1.5">
        {pulse ? (
          <span
            className={[
              "absolute inline-flex size-full animate-ping rounded-full opacity-60",
              dotClasses[tone],
            ].join(" ")}
          />
        ) : null}

        <span
          className={[
            "relative inline-flex size-1.5 rounded-full",
            dotClasses[tone],
          ].join(" ")}
        />
      </span>

      {children}
    </span>
  );
}
