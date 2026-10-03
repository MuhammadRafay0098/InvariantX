"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "The requested workspace state could not be loaded.",
  onRetry,
  retryLabel = "Try again",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-rose-400/15",
        "bg-rose-400/[0.025] p-6",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-rose-400/[0.055] blur-[90px]" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={[
              "flex size-11 shrink-0 items-center justify-center rounded-2xl",
              "border border-rose-300/15 bg-rose-300/[0.055]",
            ].join(" ")}
          >
            <AlertTriangle
              aria-hidden="true"
              className="size-4 text-rose-200"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">{title}</h2>

            <p className="mt-1.5 max-w-xl text-xs leading-5 text-zinc-500">
              {description}
            </p>
          </div>
        </div>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className={[
              "inline-flex min-h-11 shrink-0 items-center justify-center gap-2",
              "rounded-xl border border-rose-300/15",
              "bg-rose-300/[0.055] px-4",
              "text-xs font-medium text-rose-100",
              "transition duration-200",
              "hover:border-rose-300/25 hover:bg-rose-300/[0.09]",
              "focus:outline-none",
              "focus-visible:ring-2 focus-visible:ring-rose-300/40",
            ].join(" ")}
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />

            {retryLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
