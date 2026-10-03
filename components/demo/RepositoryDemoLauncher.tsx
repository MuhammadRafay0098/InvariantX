"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  GitBranch,
  LoaderCircle,
  Play,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import type { RepositoryRunResult } from "@/types/agent-run";

interface RepositoryDemoResponse {
  data?: RepositoryRunResult;
  error?: string;
}

type LauncherState = "idle" | "running" | "intercepted" | "completed" | "error";

export default function RepositoryDemoLauncher() {
  const router = useRouter();

  const [state, setState] = useState<LauncherState>("idle");
  const [result, setResult] = useState<RepositoryRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isRunning = state === "running";

  async function runDemo() {
    if (isRunning) {
      return;
    }

    setState("running");
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/demo/repository/run", {
        method: "POST",
      });

      const payload = (await response.json()) as RepositoryDemoResponse;

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Repository security demo failed.");
      }

      setResult(payload.data);

      if (payload.data.incidentDetected && payload.data.incidentId) {
        setState("intercepted");
        return;
      }

      setState("completed");
    } catch (caughtError: unknown) {
      setState("error");

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Repository security demo failed.",
      );
    }
  }

  function openIncident() {
    if (!result?.incidentId) {
      return;
    }

    router.push(`/incidents/${encodeURIComponent(result.incidentId)}`);
  }

  return (
    <GlassPanel className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-cyan-400/[0.07] blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-36 left-[25%] size-72 rounded-full bg-violet-500/[0.06] blur-[100px]" />

      <div className="relative border-b border-white/[0.06] p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusBadge tone="info">AGENT-001</StatusBadge>

              <StatusBadge tone="neutral">SANDBOX</StatusBadge>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
                <GitBranch className="size-5 text-cyan-200" />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-[-0.025em] text-white">
                  Repository Assistant
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                  Analyze the synthetic repository issue set and observe whether
                  untrusted content attempts to influence an unrelated external
                  side effect.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={runDemo}
            disabled={isRunning}
            className={[
              "group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4",
              "border border-cyan-300/15 bg-cyan-300/[0.08]",
              "text-sm font-medium text-cyan-100",
              "transition duration-300",
              "hover:border-cyan-300/25 hover:bg-cyan-300/[0.12]",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
          >
            {isRunning ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Play className="size-4 fill-current" />
            )}

            {isRunning ? "Running sandbox..." : "Run repository demo"}
          </button>
        </div>
      </div>

      <div className="relative p-5 sm:p-6">
        <AnimatePresence mode="wait">
          {state === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-3 md:grid-cols-3"
            >
              <DemoStep
                index="01"
                title="Read issues"
                description="Inspect synthetic repository content."
              />

              <DemoStep
                index="02"
                title="Evaluate intent"
                description="Track trust and requested capability."
              />

              <DemoStep
                index="03"
                title="Intercept"
                description="Block unsafe external side effects."
              />
            </motion.div>
          ) : null}

          {state === "running" ? (
            <motion.div
              key="running"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative overflow-hidden rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.035] p-5"
            >
              <div className="scan-line" />

              <div className="relative flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07]">
                  <LoaderCircle className="size-4 animate-spin text-cyan-200" />
                </div>

                <div>
                  <p className="text-sm font-medium text-cyan-100">
                    Repository agent is executing
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                    The sandbox is reading synthetic issues, recording traces,
                    and evaluating requested capabilities.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}

          {state === "intercepted" && result ? (
            <motion.div
              key="intercepted"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-rose-400/15 bg-rose-400/[0.035] p-5"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/[0.07]">
                    <AlertTriangle className="size-4 text-rose-200" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        Security incident intercepted
                      </p>

                      <StatusBadge tone="danger">HIGH</StatusBadge>
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                      {result.processedIssues} issues processed. Unsafe external
                      side-effect execution was intercepted in the sandbox.
                    </p>

                    <p className="mt-2 font-mono text-[10px] text-zinc-600">
                      {result.incidentId}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openIncident}
                  className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.045] px-4 text-xs font-medium text-zinc-200 transition hover:bg-white/[0.08]"
                >
                  Inspect incident
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </motion.div>
          ) : null}

          {state === "completed" && result ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.035] p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07]">
                  <ShieldCheck className="size-4 text-emerald-200" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Repository analysis completed
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                    No security incident was detected during this execution.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}

          {state === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-rose-400/15 bg-rose-400/[0.035] p-5"
            >
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-300" />

                <div>
                  <p className="text-sm font-medium text-rose-100">
                    Demo execution failed
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                    {error}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}

interface DemoStepProps {
  index: string;
  title: string;
  description: string;
}

function DemoStep({ index, title, description }: DemoStepProps) {
  return (
    <div className="rounded-2xl border border-white/[0.055] bg-black/15 p-4">
      <span className="font-mono text-[10px] text-zinc-700">{index}</span>

      <p className="mt-4 text-sm font-medium text-zinc-300">{title}</p>

      <p className="mt-1.5 text-[11px] leading-4 text-zinc-600">
        {description}
      </p>
    </div>
  );
}
