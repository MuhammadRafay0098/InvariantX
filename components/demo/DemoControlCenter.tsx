"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BrainCircuit,
  CheckCircle2,
  FlaskConical,
  GitBranch,
  KeyRound,
  LoaderCircle,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import DemoActionError from "./DemoActionError";
import DemoEvidencePanel from "./DemoEvidencePanel";
import DemoResetDialog from "./DemoResetDialog";
import DemoStageRail from "./DemoStageRail";

import {
  INITIAL_DEMO_STATE,
  type ApprovalResult,
  type DemoState,
  type IncidentAnalysisResult,
  type RepositoryDemoResult,
  type TransferResult,
  type ValidationResult,
} from "./types";

interface ApiEnvelope<T> {
  data?: T;
  error?: string;
}

type DemoAction =
  | "reset"
  | "incident"
  | "analysis"
  | "transfer"
  | "validation"
  | "approval";

interface DemoFailure {
  action: Exclude<DemoAction, "reset">;
  message: string;
}

async function requestApi<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  let payload: ApiEnvelope<T>;

  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new Error(
      `The server returned an unreadable response (${response.status}).`,
    );
  }

  if (!response.ok) {
    throw new Error(
      payload.error ?? `Request failed with status ${response.status}.`,
    );
  }

  if (payload.data === undefined) {
    throw new Error(
      "The server response did not contain the expected demo data.",
    );
  }

  return payload.data;
}

export default function DemoControlCenter() {
  const router = useRouter();

  const [state, setState] = useState<DemoState>(INITIAL_DEMO_STATE);

  const [busy, setBusy] = useState<DemoAction | null>(null);

  const [failure, setFailure] = useState<DemoFailure | null>(null);

  const [resetOpen, setResetOpen] = useState(false);

  const execute = useCallback(
    async (
      action: DemoAction,
      operation: () => Promise<void>,
    ): Promise<void> => {
      if (busy !== null) {
        return;
      }

      setBusy(action);

      if (action !== "reset") {
        setFailure(null);
      }

      try {
        await operation();
        router.refresh();
      } catch (caughtError: unknown) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "Unexpected demo error.";

        if (action === "reset") {
          setResetOpen(false);

          setFailure({
            action:
              state.stage === "idle"
                ? "incident"
                : state.stage === "incident"
                  ? "analysis"
                  : state.stage === "analysis"
                    ? "transfer"
                    : state.stage === "transfer"
                      ? "validation"
                      : "approval",
            message: `Demo reset failed: ${message}`,
          });
        } else {
          setFailure({
            action,
            message,
          });
        }
      } finally {
        setBusy(null);
      }
    },
    [busy, router, state.stage],
  );

  const runIncident = useCallback(() => {
    void execute("incident", async () => {
      const repository = await requestApi<RepositoryDemoResult>(
        "/api/demo/repository/run",
        {
          method: "POST",
        },
      );

      if (!repository.incidentDetected || !repository.incidentId) {
        throw new Error(
          "Repository demo completed without producing the expected security incident.",
        );
      }

      setState({
        ...INITIAL_DEMO_STATE,
        stage: "incident",
        repository,
      });
    });
  }, [execute]);

  const analyzeIncident = useCallback(() => {
    const incidentId = state.repository?.incidentId;

    if (!incidentId) {
      return;
    }

    void execute("analysis", async () => {
      const analysis = await requestApi<IncidentAnalysisResult>(
        `/api/incidents/${encodeURIComponent(incidentId)}/analyze`,
        {
          method: "POST",
        },
      );

      setState((current) => ({
        ...current,
        stage: "analysis",
        analysis,
      }));
    });
  }, [execute, state.repository?.incidentId]);

  const transferInvariant = useCallback(() => {
    const invariantId = state.analysis?.invariant.id;

    if (!invariantId) {
      return;
    }

    void execute("transfer", async () => {
      const transfer = await requestApi<TransferResult>(
        `/api/invariants/${encodeURIComponent(invariantId)}/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceAgentId: "AGENT-001",
            targetAgentId: "AGENT-002",
          }),
        },
      );

      setState((current) => ({
        ...current,
        stage: "transfer",
        transfer,
      }));
    });
  }, [execute, state.analysis?.invariant.id]);

  const validateDefense = useCallback(() => {
    const transferId = state.transfer?.transfer.id;

    if (!transferId) {
      return;
    }

    void execute("validation", async () => {
      const validation = await requestApi<ValidationResult>(
        `/api/transfers/${encodeURIComponent(transferId)}/validate`,
        {
          method: "POST",
        },
      );

      setState((current) => ({
        ...current,
        stage: "validation",
        validation,
      }));
    });
  }, [execute, state.transfer?.transfer.id]);

  const approveDefense = useCallback(() => {
    const transferId =
      state.validation?.transfer.id ?? state.transfer?.transfer.id;

    if (!transferId) {
      return;
    }

    void execute("approval", async () => {
      const approval = await requestApi<ApprovalResult>(
        `/api/transfers/${encodeURIComponent(transferId)}/approve`,
        {
          method: "POST",
        },
      );

      if (
        approval.transfer.status !== "approved" ||
        approval.policy.status !== "active"
      ) {
        throw new Error(
          "Approval completed without activating the transferred defense.",
        );
      }

      setState((current) => ({
        ...current,
        stage: "approval",
        approval,
      }));
    });
  }, [execute, state.transfer?.transfer.id, state.validation?.transfer.id]);

  const confirmReset = useCallback(() => {
    void execute("reset", async () => {
      const result = await requestApi<{ reset: boolean }>("/api/demo/reset", {
        method: "POST",
      });

      if (!result.reset) {
        throw new Error("The server did not confirm the demo reset.");
      }

      setState(INITIAL_DEMO_STATE);
      setFailure(null);
      setResetOpen(false);
    });
  }, [execute]);

  const retryFailedAction = useCallback(() => {
    if (!failure || busy !== null) {
      return;
    }

    switch (failure.action) {
      case "incident":
        runIncident();
        break;

      case "analysis":
        analyzeIncident();
        break;

      case "transfer":
        transferInvariant();
        break;

      case "validation":
        validateDefense();
        break;

      case "approval":
        approveDefense();
        break;
    }
  }, [
    failure,
    busy,
    runIncident,
    analyzeIncident,
    transferInvariant,
    validateDefense,
    approveDefense,
  ]);

  const nextAction =
    state.stage === "idle"
      ? {
          label: "Run repository incident",
          action: runIncident,
          busyKey: "incident" as const,
          icon: ShieldAlert,
        }
      : state.stage === "incident"
        ? {
            label: "Analyze incident",
            action: analyzeIncident,
            busyKey: "analysis" as const,
            icon: BrainCircuit,
          }
        : state.stage === "analysis"
          ? {
              label: "Transfer invariant",
              action: transferInvariant,
              busyKey: "transfer" as const,
              icon: GitBranch,
            }
          : state.stage === "transfer"
            ? {
                label: "Validate defense",
                action: validateDefense,
                busyKey: "validation" as const,
                icon: FlaskConical,
              }
            : state.stage === "validation"
              ? {
                  label: "Approve & activate",
                  action: approveDefense,
                  busyKey: "approval" as const,
                  icon: KeyRound,
                }
              : null;

  const running = busy !== null;
  const NextActionIcon = nextAction?.icon;

  return (
    <>
      <div className="min-w-0 space-y-4 sm:space-y-5" aria-busy={running}>
        <DemoStageRail stage={state.stage} />

        <section className="relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.018] sm:rounded-3xl">
          <div className="pointer-events-none absolute -left-16 top-0 hidden size-64 rounded-full bg-cyan-400/[0.035] blur-[80px] sm:block" />
          <div className="pointer-events-none absolute -right-20 bottom-0 hidden size-64 rounded-full bg-violet-500/[0.035] blur-[80px] sm:block" />

          <div
            className={[
              "relative flex min-w-0 flex-col gap-4 sm:gap-5",
              "border-b border-white/[0.06] p-4 sm:p-5 lg:px-6",
              "lg:flex-row lg:items-center lg:justify-between",
            ].join(" ")}
          >
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-200/70">
                Live Security Transfer
              </p>

              <h2 className="mt-1.5 text-[clamp(1rem,2vw,1.125rem)] font-semibold text-white">
                Controlled end-to-end demonstration
              </h2>

              <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-500">
                Execute each trust boundary explicitly and inspect the evidence
                produced at every stage.
              </p>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap lg:flex-nowrap">
              <button
                type="button"
                disabled={running}
                onClick={() => setResetOpen(true)}
                className={[
                  "inline-flex min-h-11 w-full items-center justify-center gap-2",
                  "rounded-xl border border-white/[0.08]",
                  "bg-white/[0.025] px-3",
                  "text-xs text-zinc-400",
                  "transition duration-200",
                  "hover:bg-white/[0.05] hover:text-white",
                  "focus:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-white/20",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "sm:w-auto",
                ].join(" ")}
              >
                <RotateCcw aria-hidden="true" className="size-3.5" />
                Reset
              </button>

              {nextAction ? (
                <button
                  type="button"
                  disabled={running}
                  onClick={nextAction.action}
                  className={[
                    "inline-flex min-h-11 w-full items-center justify-center gap-2",
                    "rounded-xl border border-cyan-300/20",
                    "bg-cyan-300/[0.08] px-4",
                    "text-xs font-medium text-cyan-100",
                    "transition duration-300",
                    "hover:border-cyan-300/30 hover:bg-cyan-300/[0.13]",
                    "focus:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-cyan-300/35",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "sm:w-auto",
                  ].join(" ")}
                >
                  {busy === nextAction.busyKey ? (
                    <LoaderCircle
                      aria-hidden="true"
                      className="size-3.5 animate-spin motion-reduce:animate-none"
                    />
                  ) : NextActionIcon ? (
                    <NextActionIcon aria-hidden="true" className="size-3.5" />
                  ) : null}

                  {busy === nextAction.busyKey
                    ? "Processing..."
                    : nextAction.label}
                </button>
              ) : (
                <div
                  role="status"
                  className={[
                    "inline-flex min-h-11 w-full items-center justify-center gap-2",
                    "rounded-xl border border-emerald-400/20",
                    "bg-emerald-400/[0.07] px-4",
                    "text-xs font-medium text-emerald-100",
                    "sm:w-auto",
                  ].join(" ")}
                >
                  <CheckCircle2 aria-hidden="true" className="size-3.5" />
                  Demo complete
                </div>
              )}
            </div>
          </div>

          <div className="relative min-w-0 p-4 sm:p-5 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.stage}
                initial={{
                  opacity: 0,
                  y: 8,
                  filter: "blur(5px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  y: -5,
                  filter: "blur(4px)",
                }}
                transition={{
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <DemoEvidencePanel state={state} />
              </motion.div>
            </AnimatePresence>

            {failure ? (
              <div className="mt-4">
                <DemoActionError
                  message={failure.message}
                  retryLabel="Retry failed step"
                  retrying={busy === failure.action}
                  onRetry={retryFailedAction}
                  onDismiss={() => setFailure(null)}
                />
              </div>
            ) : null}
          </div>
        </section>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <BoundaryCard
            icon={BrainCircuit}
            title="AI proposes"
            description="Analysis, invariant extraction, semantic mapping and explanation."
          />

          <BoundaryCard
            icon={ShieldAlert}
            title="Engine proves"
            description="Deterministic policy evaluation and fixed sandbox validation."
          />

          <BoundaryCard
            icon={KeyRound}
            title="Human activates"
            description="No transferred defense becomes active without explicit approval."
          />
        </div>
      </div>

      <DemoResetDialog
        open={resetOpen}
        resetting={busy === "reset"}
        onCancel={() => {
          if (busy !== "reset") {
            setResetOpen(false);
          }
        }}
        onConfirm={confirmReset}
      />
    </>
  );
}

interface BoundaryCardProps {
  icon: typeof ShieldAlert;
  title: string;
  description: string;
}

function BoundaryCard({ icon: Icon, title, description }: BoundaryCardProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-black/20 p-4">
      <Icon aria-hidden="true" className="size-4 text-zinc-500" />

      <p className="mt-3 text-xs font-medium text-zinc-300">{title}</p>

      <p className="mt-1.5 break-words text-[11px] leading-5 text-zinc-600">
        {description}
      </p>
    </div>
  );
}
