"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Fingerprint,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import type { IncidentAnalysis } from "@/lib/ai/schemas";
import type { AIExecutionMetadata } from "@/lib/ai/types";
import type { Invariant } from "@/types/invariant";

interface AnalysisResponseData {
  incidentId: string;
  analysis: IncidentAnalysis;
  invariant: Invariant;
  execution: {
    incidentAnalyst: AIExecutionMetadata;
    invariantMiner: AIExecutionMetadata;
  };
}

interface AnalysisResponse {
  data?: AnalysisResponseData;
  error?: string;
}

interface IncidentAnalysisPanelProps {
  incidentId: string;
  alreadyAnalyzed: boolean;
}

export default function IncidentAnalysisPanel({
  incidentId,
  alreadyAnalyzed,
}: IncidentAnalysisPanelProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function analyzeIncident() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/incidents/${encodeURIComponent(incidentId)}/analyze`,
        {
          method: "POST",
        },
      );

      const payload = (await response.json()) as AnalysisResponse;

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Incident analysis failed.");
      }

      setResult(payload.data);
      router.refresh();
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Incident analysis failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassPanel className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-0 size-64 rounded-full bg-violet-500/[0.06] blur-[90px]" />

      <div className="relative flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.06]">
            <BrainCircuit className="size-4 text-violet-200" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              AI security analysis
            </h2>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Incident Analyst interprets the event, then Invariant Miner
              extracts the transferable security principle.
            </p>
          </div>
        </div>

        {!result ? (
          <button
            type="button"
            onClick={analyzeIncident}
            disabled={loading}
            className={[
              "inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4",
              "border border-violet-300/15 bg-violet-300/[0.08]",
              "text-xs font-medium text-violet-100",
              "transition hover:border-violet-300/25 hover:bg-violet-300/[0.12]",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
          >
            {loading ? (
              <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}

            {loading
              ? "Analyzing..."
              : alreadyAnalyzed
                ? "Re-run analysis"
                : "Analyze incident"}
          </button>
        ) : null}
      </div>

      <div className="relative p-5">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-3 md:grid-cols-2"
            >
              <ProcessingModule
                icon={BrainCircuit}
                title="Incident Analyst"
                description="Interpreting trust, capability, authorization, and observed action."
              />

              <ProcessingModule
                icon={Fingerprint}
                title="Invariant Miner"
                description="Deriving an attack-independent security constraint."
              />
            </motion.div>
          ) : null}

          {!loading && !result && !error ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-white/[0.055] bg-black/15 p-5"
            >
              <div className="flex items-start gap-4">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-violet-200" />

                <div>
                  <p className="text-sm font-medium text-zinc-300">
                    Ready for semantic analysis
                  </p>

                  <p className="mt-1.5 max-w-2xl text-xs leading-5 text-zinc-600">
                    AI modules provide structured analysis and invariant
                    extraction. They do not activate policies or override
                    deterministic security enforcement.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}

          {!loading && error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-rose-400/15 bg-rose-400/[0.035] p-5"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-200" />

                <div>
                  <p className="text-sm font-medium text-rose-100">
                    Analysis failed
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                    {error}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}

          {!loading && result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid gap-3 lg:grid-cols-2">
                <AnalysisModuleResult
                  icon={BrainCircuit}
                  title="Incident Analyst"
                  metadata={result.execution.incidentAnalyst}
                />

                <AnalysisModuleResult
                  icon={Fingerprint}
                  title="Invariant Miner"
                  metadata={result.execution.invariantMiner}
                />
              </div>

              <InvariantCard invariant={result.invariant} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}

interface ProcessingModuleProps {
  icon: typeof BrainCircuit;
  title: string;
  description: string;
}

function ProcessingModule({
  icon: Icon,
  title,
  description,
}: ProcessingModuleProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-400/10 bg-violet-400/[0.025] p-5">
      <div className="scan-line" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.06]">
            <Icon className="size-4 text-violet-200" />
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-200">{title}</p>

            <div className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-violet-300/70">
              <LoaderCircle className="size-3 animate-spin" />
              Processing
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-zinc-600">{description}</p>
      </div>
    </div>
  );
}

interface AnalysisModuleResultProps {
  icon: typeof BrainCircuit;
  title: string;
  metadata: AIExecutionMetadata;
}

function AnalysisModuleResult({
  icon: Icon,
  title,
  metadata,
}: AnalysisModuleResultProps) {
  return (
    <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06]">
          <Icon className="size-3.5 text-emerald-200" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-zinc-200">{title}</p>

          <p className="mt-0.5 truncate font-mono text-[10px] text-zinc-600">
            {metadata.provider} · {metadata.model}
          </p>
        </div>

        <CheckCircle2 className="size-4 text-emerald-300" />
      </div>

      <div className="mt-3">
        <StatusBadge
          tone={metadata.mode === "live_llm" ? "success" : "warning"}
        >
          {metadata.mode === "live_llm" ? "LIVE LLM" : "DEMO FALLBACK"}
        </StatusBadge>
      </div>
    </div>
  );
}

interface InvariantCardProps {
  invariant: Invariant;
}

function InvariantCard({ invariant }: InvariantCardProps) {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.035] p-5">
      <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-cyan-400/[0.08] blur-[70px]" />

      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07]">
              <Fingerprint className="size-4 text-cyan-100" />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-200/70">
                Extracted Security Invariant
              </p>

              <p className="mt-1.5 font-mono text-xs text-cyan-100">
                {invariant.id}
              </p>
            </div>
          </div>

          <StatusBadge tone="success">
            {invariant.status.toUpperCase()}
          </StatusBadge>
        </div>

        <blockquote className="mt-5 max-w-3xl text-base font-medium leading-7 tracking-[-0.015em] text-zinc-100">
          “{invariant.humanDescription}”
        </blockquote>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <InvariantField label="Source trust" value={invariant.sourceTrust} />

          <InvariantField label="Action class" value={invariant.actionClass} />

          <InvariantField
            label="Authorization"
            value={invariant.authorizationRequirement}
          />

          <InvariantField label="Constraint" value={invariant.constraint} />
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => {
              router.push(`/invariants/${encodeURIComponent(invariant.id)}`);
            }}
            className="inline-flex items-center gap-2 text-xs font-medium text-cyan-200 transition hover:text-cyan-100"
          >
            Continue to transfer
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface InvariantFieldProps {
  label: string;
  value: string;
}

function InvariantField({ label, value }: InvariantFieldProps) {
  return (
    <div className="rounded-xl border border-white/[0.055] bg-black/20 p-3">
      <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600">
        {label}
      </p>

      <p className="mt-2 break-words font-mono text-[11px] leading-4 text-zinc-300">
        {value}
      </p>
    </div>
  );
}
