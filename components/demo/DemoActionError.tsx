"use client";

import { AlertTriangle, RotateCcw, X } from "lucide-react";

interface DemoActionErrorProps {
  message: string;
  retryLabel?: string;
  retrying?: boolean;
  onRetry?: () => void;
  onDismiss: () => void;
}

export default function DemoActionError({
  message,
  retryLabel = "Retry step",
  retrying = false,
  onRetry,
  onDismiss,
}: DemoActionErrorProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-rose-400/15",
        "bg-rose-400/[0.035] p-3.5 sm:p-4",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 hidden size-40 rounded-full bg-rose-400/[0.05] blur-[60px] sm:block" />

      <div className="relative flex min-w-0 items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-rose-300/15 bg-rose-300/[0.06]">
          <AlertTriangle aria-hidden="true" className="size-4 text-rose-200" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-rose-100">
                This step could not complete
              </p>

              <p className="mt-1 break-words text-[11px] leading-5 text-rose-100/55">
                {message}
              </p>
            </div>

            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss error"
              className={[
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                "text-zinc-600 transition",
                "hover:bg-white/[0.05] hover:text-zinc-300",
                "focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-rose-300/30",
              ].join(" ")}
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>

          {onRetry ? (
            <button
              type="button"
              disabled={retrying}
              onClick={onRetry}
              className={[
                "mt-3 inline-flex min-h-9 items-center justify-center gap-2",
                "rounded-lg border border-rose-300/15",
                "bg-rose-300/[0.055] px-3",
                "text-[11px] font-medium text-rose-100",
                "transition duration-200",
                "hover:border-rose-300/25 hover:bg-rose-300/[0.09]",
                "focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-rose-300/30",
                "disabled:cursor-not-allowed disabled:opacity-50",
              ].join(" ")}
            >
              <RotateCcw
                aria-hidden="true"
                className={[
                  "size-3",
                  retrying ? "animate-spin motion-reduce:animate-none" : "",
                ].join(" ")}
              />

              {retrying ? "Retrying..." : retryLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
