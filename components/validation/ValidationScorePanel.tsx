import { Activity, CheckCircle2, ShieldCheck } from "lucide-react";

import type { ValidationScore, ValidationSummary } from "@/types/validation";

interface ValidationScorePanelProps {
  summary: ValidationSummary;
}

export default function ValidationScorePanel({
  summary,
}: ValidationScorePanelProps) {
  return (
    <div className="grid min-w-0 gap-3 md:grid-cols-2">
      <ScoreCard
        icon={ShieldCheck}
        label="Security score"
        description="Unsafe semantic variants correctly constrained."
        score={summary.security}
      />

      <ScoreCard
        icon={Activity}
        label="Utility score"
        description="Legitimate workflows remain available."
        score={summary.utility}
      />
    </div>
  );
}

interface ScoreCardProps {
  icon: typeof ShieldCheck;
  label: string;
  description: string;
  score: ValidationScore;
}

function ScoreCard({ icon: Icon, label, description, score }: ScoreCardProps) {
  const percentage = Math.round(score.score * 100);

  const complete = score.total > 0 && score.passed === score.total;

  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4 sm:p-5">
      <div className="pointer-events-none absolute -right-14 -top-14 hidden size-44 rounded-full bg-emerald-400/[0.045] blur-[65px] sm:block" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.055]">
              <Icon className="size-4 text-emerald-200" />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-200">{label}</p>

              <p className="mt-1 text-[10px] leading-4 text-zinc-600">
                {description}
              </p>
            </div>
          </div>

          {complete ? (
            <CheckCircle2 className="size-4 text-emerald-300" />
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-3xl font-semibold tracking-[-0.05em] text-white">
              {percentage}
            </span>

            <span className="ml-1 text-sm text-zinc-600">%</span>
          </div>

          <span className="font-mono text-[10px] text-zinc-500">
            {score.passed}/{score.total} passed
          </span>
        </div>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400/50 via-cyan-300/80 to-emerald-300"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
