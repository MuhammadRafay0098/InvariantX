"use client";

import { AlertTriangle, LoaderCircle, RotateCcw, X } from "lucide-react";

interface DemoResetDialogProps {
  open: boolean;
  resetting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DemoResetDialog({
  open,
  resetting,
  onCancel,
  onConfirm,
}: DemoResetDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close reset confirmation"
        disabled={resetting}
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-demo-title"
        aria-describedby="reset-demo-description"
        className={[
          "relative z-10 w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl",
          "border border-amber-300/15",
          "max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-[#090c13]/95 p-4 shadow-2xl shadow-black/50 sm:max-h-[calc(100dvh-2rem)] sm:p-5",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute -right-16 -top-20 hidden size-52 rounded-full bg-amber-300/[0.05] blur-[70px] sm:block" />

        <div className="relative">
          <div className="flex min-w-0 items-start justify-between gap-3 sm:gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/[0.06]">
                <AlertTriangle
                  aria-hidden="true"
                  className="size-4 text-amber-200"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-amber-200/65">
                  Reset Demo
                </p>

                <h2
                  id="reset-demo-title"
                  className="mt-1 text-base font-semibold text-white"
                >
                  Clear the current security run?
                </h2>
              </div>
            </div>

            <button
              type="button"
              disabled={resetting}
              onClick={onCancel}
              aria-label="Cancel reset"
              className={[
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                "text-zinc-600 transition",
                "hover:bg-white/[0.05] hover:text-zinc-300",
                "focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-white/20",
                "disabled:opacity-40",
              ].join(" ")}
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>

          <p
            id="reset-demo-description"
            className="mt-4 text-xs leading-5 text-zinc-500"
          >
            Runtime incidents, invariants, transfers, policies and validation
            evidence from this demo run will be cleared. Seeded agents and
            capabilities remain available.
          </p>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={resetting}
              onClick={onCancel}
              className={[
                "inline-flex min-h-11 items-center justify-center rounded-xl",
                "border border-white/[0.08] bg-white/[0.025] px-4",
                "text-xs font-medium text-zinc-400",
                "transition hover:bg-white/[0.05] hover:text-white",
                "focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-white/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
              ].join(" ")}
            >
              Keep current run
            </button>

            <button
              type="button"
              disabled={resetting}
              onClick={onConfirm}
              className={[
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl",
                "border border-amber-300/20 bg-amber-300/[0.075] px-4",
                "text-xs font-medium text-amber-100",
                "transition",
                "hover:border-amber-300/30 hover:bg-amber-300/[0.12]",
                "focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-amber-300/35",
                "disabled:cursor-not-allowed disabled:opacity-50",
              ].join(" ")}
            >
              {resetting ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-3.5 animate-spin motion-reduce:animate-none"
                />
              ) : (
                <RotateCcw aria-hidden="true" className="size-3.5" />
              )}

              {resetting ? "Resetting..." : "Reset demo"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
