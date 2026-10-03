"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  GitBranch,
  LoaderCircle,
  Network,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import CapabilityMapping from "@/components/transfers/CapabilityMapping";
import ProposedPolicyCard from "@/components/transfers/ProposedPolicyCard";
import StatusBadge from "@/components/ui/StatusBadge";
import type { AIExecutionMetadata } from "@/lib/ai/types";
import type { Policy } from "@/types/policy";
import type { SemanticMapping, Transfer } from "@/types/transfer";

interface SemanticTransferPanelProps {
  invariantId: string;
}

interface TransferResponseData {
  invariantId: string;
  mapping: SemanticMapping;
  transfer: Transfer;
  execution: AIExecutionMetadata;
  policy: Policy;
}

interface TransferResponse {
  data?: TransferResponseData;
  error?: string;
}

export default function SemanticTransferPanel({
  invariantId,
}: SemanticTransferPanelProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransferResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function transferInvariant() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
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

      const payload = (await response.json()) as TransferResponse;

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Semantic transfer failed.");
      }

      setResult(payload.data);
      router.refresh();
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Semantic transfer failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#090c14]/70 backdrop-blur-md sm:backdrop-blur-lg">
        <div className="pointer-events-none absolute left-1/2 top-0 hidden size-72 -translate-x-1/2 rounded-full bg-violet-500/[0.045] blur-[90px] sm:block" />

        <div className="relative flex min-w-0 flex-col gap-4 border-b border-white/[0.06] p-4 sm:gap-5 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.06]">
              <Network className="size-5 text-violet-200" />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-200/70">
                Cross-Agent Transfer
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-white">
                Bind the invariant to a different agent.
              </h2>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500">
                The Semantic Mapper reasons over capability semantics rather
                than matching tool names or attack signatures.
              </p>
            </div>
          </div>

          {!result ? (
            <button
              type="button"
              onClick={transferInvariant}
              disabled={loading}
              className={[
                "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4",
                "border border-violet-300/15 bg-violet-300/[0.08]",
                "text-xs font-medium text-violet-100",
                "transition duration-300",
                "hover:border-violet-300/25 hover:bg-violet-300/[0.12]",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {loading ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5" />
              )}

              {loading ? "Mapping semantics..." : "Transfer to Email Agent"}
            </button>
          ) : null}
        </div>

        <div className="relative p-5 sm:p-6">
          <AnimatePresence mode="wait">
            {!loading && !result && !error ? (
              <motion.div
                key="ready"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid min-w-0 gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
              >
                <AgentCard
                  icon={GitBranch}
                  label="Source agent"
                  name="Repository Assistant"
                  agentId="AGENT-001"
                  detail="send_notification"
                />

                <div className="hidden items-center justify-center lg:flex">
                  <ArrowRight className="size-5 text-zinc-700" />
                </div>

                <AgentCard
                  icon={Bot}
                  label="Target agent"
                  name="Email Calendar Assistant"
                  agentId="AGENT-002"
                  detail="create_calendar_event"
                />
              </motion.div>
            ) : null}

            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative overflow-hidden rounded-2xl border border-violet-400/10 bg-violet-400/[0.025] p-5"
              >
                <div className="scan-line" />

                <div className="relative flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.06]">
                    <BrainCircuit className="size-4 text-violet-200" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-zinc-200">
                        Semantic Mapper
                      </p>

                      <LoaderCircle className="size-3.5 animate-spin text-violet-300" />
                    </div>

                    <p className="mt-1.5 max-w-2xl text-xs leading-5 text-zinc-500">
                      Comparing the invariant against the target agent&apos;s
                      registered capabilities and trust semantics.
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
                      Semantic transfer failed
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
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex flex-col gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06]">
                      <CheckCircle2 className="size-4 text-emerald-200" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        Semantic mapping completed
                      </p>

                      <p className="mt-1 font-mono text-[10px] text-zinc-600">
                        {result.execution.provider} · {result.execution.model}
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    tone={
                      result.execution.mode === "live_llm"
                        ? "success"
                        : "warning"
                    }
                  >
                    {result.execution.mode === "live_llm"
                      ? "LIVE LLM"
                      : "DEMO FALLBACK"}
                  </StatusBadge>
                </div>

                <CapabilityMapping
                  targetTool={result.mapping.targetTool}
                  confidence={result.mapping.mappingConfidence}
                />

                <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
                  <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                    Mapper reasoning
                  </p>

                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    {result.mapping.reason}
                  </p>
                </div>

                <ProposedPolicyCard policy={result.policy} />

                <div className="flex min-w-0 justify-stretch sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/transfers/${encodeURIComponent(result.transfer.id)}`,
                      )
                    }
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.07] px-4 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/[0.11] sm:w-auto"
                  >
                    Open transfer
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

interface AgentCardProps {
  icon: typeof Bot;
  label: string;
  name: string;
  agentId: string;
  detail: string;
}

function AgentCard({
  icon: Icon,
  label,
  name,
  agentId,
  detail,
}: AgentCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035]">
          <Icon className="size-4 text-zinc-400" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-600">
            {label}
          </p>

          <p className="mt-1.5 text-sm font-medium text-zinc-200">{name}</p>

          <p className="mt-1 font-mono text-[10px] text-zinc-600">{agentId}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-white/[0.05] pt-3">
        <p className="font-mono text-[11px] text-zinc-400">{detail}</p>
      </div>
    </div>
  );
}
