import { BrainCircuit, CheckCircle2, Cpu } from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";
import type { ValidationAnalysisResult } from "@/lib/ai/schemas";
import type { AIExecutionMetadata } from "@/lib/ai/types";

interface ValidationAnalystPanelProps {
  analysis: ValidationAnalysisResult;
  execution: AIExecutionMetadata;
}

export default function ValidationAnalystPanel({
  analysis,
  execution,
}: ValidationAnalystPanelProps) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-2xl border border-violet-400/15 bg-violet-400/[0.025]">
      <div className="pointer-events-none absolute left-1/2 top-0 hidden size-72 -translate-x-1/2 rounded-full bg-violet-500/[0.05] blur-[80px] sm:block" />

      <div className="relative flex min-w-0 flex-col gap-4 border-b border-white/[0.06] p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.06]">
            <BrainCircuit className="size-4 text-violet-200" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Validation Analyst
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              Advisory explanation of deterministic validation results.
            </p>
          </div>
        </div>

        <StatusBadge
          tone={execution.mode === "live_llm" ? "success" : "warning"}
        >
          {execution.mode === "live_llm" ? "LIVE LLM" : "DEMO FALLBACK"}
        </StatusBadge>
      </div>

      <div className="relative min-w-0 space-y-4 p-4 sm:p-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2 font-mono text-[9px] leading-4 text-zinc-600 [&>span]:[overflow-wrap:anywhere]">
          <Cpu className="size-3" />
          <span>{execution.provider}</span>
          <span>·</span>
          <span>{execution.model}</span>
        </div>

        <AnalysisBlock label="Assessment" text={analysis.summary} />

        <div className="grid min-w-0 gap-3 md:grid-cols-2">
          <AnalysisBlock label="Security" text={analysis.securityAssessment} />

          <AnalysisBlock label="Utility" text={analysis.utilityAssessment} />
        </div>

        <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.035] p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-300" />

            <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-emerald-200/70">
              Deterministic recommendation preserved
            </p>
          </div>

          <p className="mt-2 font-mono text-xs text-emerald-100">
            {analysis.recommendation}
          </p>
        </div>

        {analysis.reviewerNotes.length > 0 ? (
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-600">
              Reviewer notes
            </p>

            <div className="mt-2 space-y-2">
              {analysis.reviewerNotes.map((note, index) => (
                <div
                  key={`${index}-${note}`}
                  className="rounded-xl border border-white/[0.05] bg-black/20 px-3.5 py-3 text-[11px] leading-5 text-zinc-500"
                >
                  {note}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <p className="text-[10px] leading-4 text-zinc-700">
          AI explains the results only. It cannot approve, activate, or override
          deterministic policy enforcement.
        </p>
      </div>
    </section>
  );
}

function AnalysisBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.055] bg-black/20 p-4">
      <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-600">
        {label}
      </p>

      <p className="mt-2 [overflow-wrap:anywhere] text-xs leading-5 text-zinc-400">{text}</p>
    </div>
  );
}
