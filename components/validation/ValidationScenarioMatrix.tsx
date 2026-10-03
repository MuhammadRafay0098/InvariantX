import {
  CalendarCheck,
  Check,
  FileText,
  Mail,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";

import type { ValidationRun, ValidationScenario } from "@/types/validation";

interface ValidationScenarioMatrixProps {
  scenarios: readonly ValidationScenario[];
  runs: ValidationRun[];
}

export default function ValidationScenarioMatrix({
  scenarios,
  runs,
}: ValidationScenarioMatrixProps) {
  return (
    <div className="grid min-w-0 gap-3 xl:grid-cols-2">
      <ScenarioGroup
        title="Security preservation"
        subtitle="Untrusted-derived side effects must require approval."
        type="security"
        scenarios={scenarios}
        runs={runs}
      />

      <ScenarioGroup
        title="Benign utility"
        subtitle="Legitimate agent behavior must remain available."
        type="utility"
        scenarios={scenarios}
        runs={runs}
      />
    </div>
  );
}

interface ScenarioGroupProps {
  title: string;
  subtitle: string;
  type: "security" | "utility";
  scenarios: readonly ValidationScenario[];
  runs: ValidationRun[];
}

function ScenarioGroup({
  title,
  subtitle,
  type,
  scenarios,
  runs,
}: ScenarioGroupProps) {
  const filtered = scenarios.filter((scenario) => scenario.type === type);

  const security = type === "security";

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.065] bg-black/15">
      <div className="border-b border-white/[0.055] p-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={[
              "flex size-9 shrink-0 items-center justify-center rounded-xl border",
              security
                ? "border-rose-400/15 bg-rose-400/[0.055]"
                : "border-emerald-400/15 bg-emerald-400/[0.055]",
            ].join(" ")}
          >
            {security ? (
              <ShieldAlert className="size-4 text-rose-200" />
            ) : (
              <ShieldCheck className="size-4 text-emerald-200" />
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-200">{title}</h3>

            <p className="mt-1 text-[11px] leading-5 text-zinc-600">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-px bg-white/[0.04]">
        {filtered.map((scenario) => {
          const run = runs.find((item) => item.scenarioId === scenario.id);

          return (
            <ScenarioRow key={scenario.id} scenario={scenario} run={run} />
          );
        })}
      </div>
    </section>
  );
}

interface ScenarioRowProps {
  scenario: ValidationScenario;
  run?: ValidationRun;
}

function ScenarioRow({ scenario, run }: ScenarioRowProps) {
  const passed = run?.passed ?? null;

  const ScenarioIcon =
    scenario.targetTool === "summarize_email"
      ? FileText
      : scenario.type === "security"
        ? Mail
        : CalendarCheck;

  return (
    <div className="min-w-0 bg-[#080a11]/90 p-3.5 sm:p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.055] bg-white/[0.025]">
          <ScenarioIcon className="size-3.5 text-zinc-500" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[9px] text-zinc-600">
                  {scenario.id}
                </span>

                <span className="text-xs font-medium text-zinc-300">
                  {scenario.name}
                </span>
              </div>

              <p className="mt-1.5 text-[10px] leading-4 text-zinc-600">
                {scenario.description}
              </p>
            </div>

            <ScenarioState passed={passed} />
          </div>

          <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2">
            <DecisionField label="Expected" value={scenario.expectedDecision} />

            <DecisionField
              label="Actual"
              value={run?.actualDecision ?? "pending"}
            />
          </div>

          <div className="mt-2 flex min-w-0 flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] leading-4 text-zinc-700 [&>span]:[overflow-wrap:anywhere]">
            <span>trust: {scenario.sourceTrust}</span>

            <span>
              auth: {scenario.trustedAuthorization ? "true" : "false"}
            </span>

            <span>tool: {scenario.targetTool}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenarioState({ passed }: { passed: boolean | null }) {
  if (passed === null) {
    return (
      <span className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-zinc-600">
        Pending
      </span>
    );
  }

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-[9px] font-medium uppercase tracking-[0.12em]",
        passed
          ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-200"
          : "border-rose-400/15 bg-rose-400/[0.06] text-rose-200",
      ].join(" ")}
    >
      {passed ? <Check className="size-3" /> : <X className="size-3" />}

      {passed ? "Passed" : "Failed"}
    </span>
  );
}

interface DecisionFieldProps {
  label: string;
  value: string;
}

function DecisionField({ label, value }: DecisionFieldProps) {
  return (
    <div className="min-w-0 rounded-lg border border-white/[0.045] bg-black/20 px-3 py-2.5">
      <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-zinc-700">
        {label}
      </p>

      <p className="mt-1 [overflow-wrap:anywhere] font-mono text-[10px] leading-4 text-zinc-400">{value}</p>
    </div>
  );
}
