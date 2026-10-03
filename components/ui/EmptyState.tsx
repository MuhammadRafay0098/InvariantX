import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-white/[0.07]",
        "bg-white/[0.02] p-6",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-cyan-400/[0.035] blur-[80px]" />

      <div className="relative flex min-h-40 flex-col items-center justify-center text-center">
        <div
          className={[
            "flex size-11 items-center justify-center rounded-2xl",
            "border border-white/[0.08] bg-white/[0.035]",
          ].join(" ")}
        >
          <Icon aria-hidden="true" className="size-4 text-zinc-400" />
        </div>

        <h2 className="mt-4 text-sm font-semibold text-white">{title}</h2>

        <p className="mt-1.5 max-w-md text-xs leading-5 text-zinc-500">
          {description}
        </p>
      </div>
    </div>
  );
}
