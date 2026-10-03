import { LoaderCircle } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  description?: string;
}

export default function LoadingState({
  title = "Loading workspace",
  description = "Preparing the latest security state.",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-white/[0.07]",
        "bg-white/[0.025] p-6",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-cyan-400/[0.055] blur-[90px]" />

      <div className="relative flex items-start gap-4">
        <div
          className={[
            "flex size-11 shrink-0 items-center justify-center rounded-2xl",
            "border border-cyan-300/15 bg-cyan-300/[0.055]",
          ].join(" ")}
        >
          <LoaderCircle
            aria-hidden="true"
            className="size-4 animate-spin text-cyan-200 motion-reduce:animate-none"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{title}</p>

          <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-500">
            {description}
          </p>

          <div aria-hidden="true" className="mt-5 space-y-2.5">
            <div className="h-2.5 w-52 max-w-full animate-pulse rounded-full bg-white/[0.055] motion-reduce:animate-none" />
            <div className="h-2.5 w-72 max-w-full animate-pulse rounded-full bg-white/[0.035] motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
