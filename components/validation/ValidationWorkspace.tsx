"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  LoaderCircle,
  Play,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import HumanApprovalGate from "./HumanApprovalGate";
import ValidationAnalystPanel from "./ValidationAnalystPanel";
import ValidationScenarioMatrix from "./ValidationScenarioMatrix";
import ValidationScorePanel from "./ValidationScorePanel";

import StatusBadge from "@/components/ui/StatusBadge";
import { VALIDATION_SCENARIOS } from "@/lib/validation/scenarios";
import type { ValidationAnalysisResult } from "@/lib/ai/schemas";
import type { AIExecutionMetadata } from "@/lib/ai/types";
import type { Policy } from "@/types/policy";
import type { Transfer } from "@/types/transfer";
import type { ValidationRun, ValidationSummary } from "@/types/validation";

interface ValidationWorkspaceProps {
  initialTransfer: Transfer;
  initialPolicy: Policy | null;
  initialRuns: ValidationRun[];
}

interface ValidationApiData {
  runs: ValidationRun[];
  summary: ValidationSummary;
  transfer: Transfer;
  policy: Policy;
  analysis: {
    data: ValidationAnalysisResult;
    metadata: AIExecutionMetadata;
  };
}

interface ValidationApiResponse {
  data?: ValidationApiData;
  error?: string;
}

interface ApprovalApiResponse {
  data?: {
    transfer: Transfer;
    policy: Policy;
  };
  error?: string;
}

export default function ValidationWorkspace({
  initialTransfer,
  initialPolicy,
  initialRuns,
}: ValidationWorkspaceProps) {
  const [transfer, setTransfer] = useState(initialTransfer);

  const [policy, setPolicy] = useState<Policy | null>(initialPolicy);

  const [runs, setRuns] = useState<ValidationRun[]>(initialRuns);

  const [summary, setSummary] = useState<ValidationSummary | null>(
    derivePersistedSummary(initialTransfer, initialRuns),
  );

  const [analysis, setAnalysis] = useState<ValidationAnalysisResult | null>(
    null,
  );

  const [analysisExecution, setAnalysisExecution] =
    useState<AIExecutionMetadata | null>(null);

  const [validating, setValidating] = useState(false);

  const [approving, setApproving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const canValidate =
    transfer.status === "mapped" && policy?.status === "inactive";

  const readyForReview =
    transfer.status === "ready_for_review" && policy?.status === "inactive";

  const approved =
    transfer.status === "approved" && policy?.status === "active";

  const passedRuns = useMemo(
    () => runs.filter((run) => run.passed).length,
    [runs],
  );

  async function validateDefense() {
    if (!canValidate || validating) {
      return;
    }

    setValidating(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/transfers/${encodeURIComponent(transfer.id)}/validate`,
        {
          method: "POST",
        },
      );

      const payload = (await response.json()) as ValidationApiResponse;

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Defense validation failed.");
      }

      setTransfer(payload.data.transfer);
      setPolicy(payload.data.policy);
      setRuns(payload.data.runs);
      setSummary(payload.data.summary);
      setAnalysis(payload.data.analysis.data);
      setAnalysisExecution(payload.data.analysis.metadata);
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Defense validation failed.",
      );
    } finally {
      setValidating(false);
    }
  }

  async function approveDefense() {
    if (!readyForReview || approving) {
      return;
    }

    setApproving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/transfers/${encodeURIComponent(transfer.id)}/approve`,
        {
          method: "POST",
        },
      );

      const payload = (await response.json()) as ApprovalApiResponse;

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Human approval failed.");
      }

      setTransfer(payload.data.transfer);
      setPolicy(payload.data.policy);
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Human approval failed.",
      );
    } finally {
      setApproving(false);
    }
  }

  if (!policy) {
    return (
      <div className="rounded-2xl border border-rose-400/15 bg-rose-400/[0.035] p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-4 text-rose-200" />

          <div>
            <p className="text-sm font-medium text-rose-100">
              Proposed policy unavailable
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              This transfer cannot be validated until an inactive transferred
              policy exists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-5">
      <section className="relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#090c14]/70 backdrop-blur-md sm:backdrop-blur-lg">
        <div className="pointer-events-none absolute left-1/2 top-0 hidden size-80 -translate-x-1/2 rounded-full bg-emerald-500/[0.04] blur-[90px] sm:block" />

        <div className="relative flex min-w-0 flex-col gap-4 border-b border-white/[0.06] p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.055]">
              <FlaskConical className="size-4 text-emerald-200" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold text-white">
                  Deterministic sandbox suite
                </h2>

                <StatusBadge
                  tone={
                    approved ? "success" : readyForReview ? "info" : "warning"
                  }
                >
                  {transfer.status.replaceAll("_", " ").toUpperCase()}
                </StatusBadge>
              </div>

              <p className="mt-1 text-xs text-zinc-500">
                Six fixed scenarios evaluate the proposed rule without
                activating it.
              </p>
            </div>
          </div>

          {canValidate ? (
            <button
              type="button"
              onClick={validateDefense}
              disabled={validating}
              className={[
                "inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-4 md:w-auto",
                "border border-emerald-300/15 bg-emerald-300/[0.07]",
                "text-xs font-medium text-emerald-100",
                "transition duration-300",
                "hover:border-emerald-300/25 hover:bg-emerald-300/[0.11]",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {validating ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <Play className="size-3.5" />
              )}

              {validating ? "Running sandbox..." : "Run 6 validation scenarios"}
            </button>
          ) : null}
        </div>

        <div className="relative min-w-0 p-3.5 sm:p-5">
          <AnimatePresence mode="wait">
            {validating ? (
              <motion.div
                key="validating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-4 min-w-0 overflow-hidden rounded-xl border border-cyan-400/10 bg-cyan-400/[0.025] p-3.5 sm:p-4"
              >
                <div className="scan-line" />

                <div className="relative flex items-center gap-3">
                  <LoaderCircle className="size-4 animate-spin text-cyan-200" />

                  <div>
                    <p className="text-xs font-medium text-zinc-300">
                      Evaluating proposed policy
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      Security and utility scenarios are evaluated by the
                      deterministic policy rule engine.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <ValidationScenarioMatrix
            scenarios={VALIDATION_SCENARIOS}
            runs={runs}
          />

          {runs.length > 0 ? (
            <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2 font-mono text-[10px] leading-4 text-zinc-600">
              <CheckCircle2 className="size-3.5 text-emerald-300" />
              {passedRuns}/{runs.length} deterministic checks passed
            </div>
          ) : null}
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-400/15 bg-rose-400/[0.035] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-200" />

            <p className="text-xs leading-5 text-rose-100">{error}</p>
          </div>
        </div>
      ) : null}

      {summary ? (
        <ValidationScorePanel summary={summary} />
      ) : (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          <PendingMetric icon={ShieldCheck} label="Security" />

          <PendingMetric icon={Activity} label="Utility" />
        </div>
      )}
      {analysis && analysisExecution ? (
        <ValidationAnalystPanel
          analysis={analysis}
          execution={analysisExecution}
        />
      ) : null}

      {readyForReview || approved ? (
        <HumanApprovalGate
          transfer={transfer}
          policy={policy}
          approving={approving}
          onApprove={approveDefense}
        />
      ) : null}
    </div>
  );
}

function derivePersistedSummary(
  transfer: Transfer,
  runs: ValidationRun[],
): ValidationSummary | null {
  if (
    transfer.securityScore === null ||
    transfer.utilityScore === null ||
    runs.length === 0
  ) {
    return null;
  }

  const securityRuns = runs.filter((run) => run.type === "security");

  const utilityRuns = runs.filter((run) => run.type === "utility");

  const securityPassed = securityRuns.filter((run) => run.passed).length;

  const utilityPassed = utilityRuns.filter((run) => run.passed).length;

  return {
    security: {
      passed: securityPassed,
      total: securityRuns.length,
      score: transfer.securityScore,
    },
    utility: {
      passed: utilityPassed,
      total: utilityRuns.length,
      score: transfer.utilityScore,
    },
    recommendation:
      transfer.status === "ready_for_review" || transfer.status === "approved"
        ? "ready_for_review"
        : transfer.securityScore < 1
          ? "revise"
          : "reject",
  };
}

interface PendingMetricProps {
  icon: typeof ShieldCheck;
  label: string;
}

function PendingMetric({ icon: Icon, label }: PendingMetricProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-black/15 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl border border-white/[0.055] bg-white/[0.025]">
          <Icon className="size-4 text-zinc-600" />
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-400">{label} score</p>

          <p className="mt-1 font-mono text-[10px] text-zinc-700">
            PENDING VALIDATION
          </p>
        </div>
      </div>
    </div>
  );
}
