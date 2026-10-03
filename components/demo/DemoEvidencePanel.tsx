import {
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  FlaskConical,
  GitBranch,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import type { DemoState } from "./types";

interface DemoEvidencePanelProps {
  state: DemoState;
}

interface EvidenceRowProps {
  label: string;
  value: string;
}

function EvidenceRow({ label, value }: EvidenceRowProps) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.055] bg-black/20 p-3">
      <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-700">
        {label}
      </p>

      <p className="mt-1.5 font-mono text-[11px] leading-5 text-zinc-300 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

export default function DemoEvidencePanel({ state }: DemoEvidencePanelProps) {
  if (state.approval) {
    return (
      <section className="relative min-w-0 overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.035] p-4 sm:p-5">
        <div className="pointer-events-none absolute right-0 top-0 hidden size-56 rounded-full bg-emerald-400/[0.06] blur-[80px] sm:block" />

        <div className="relative flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08]">
            <CheckCircle2 className="size-5 text-emerald-200" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-200/70">
              Defense Activated
            </p>

            <h3 className="mt-1 text-lg font-semibold text-white">
              Human-approved transfer complete.
            </h3>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500">
              The validated defense is now active under deterministic runtime
              enforcement.
            </p>

            <div className="mt-4 rounded-xl border border-emerald-400/15 bg-black/20 px-3 py-2 font-mono text-[10px] leading-5 text-emerald-100 [overflow-wrap:anywhere]">
              untrusted + no trusted authorization → require_approval
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (state.validation) {
    const security = state.validation.summary.security;
    const utility = state.validation.summary.utility;

    return (
      <section className="min-w-0 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.025] p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06]">
            <FlaskConical className="size-4 text-emerald-200" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white">
              Sandbox validation passed
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Deterministic security and utility scenarios completed.
            </p>

            <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <EvidenceRow
                label="Security"
                value={`${security.passed}/${security.total} passed`}
              />

              <EvidenceRow
                label="Utility"
                value={`${utility.passed}/${utility.total} passed`}
              />

              <EvidenceRow
                label="Recommendation"
                value={state.validation.summary.recommendation}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (state.transfer) {
    return (
      <section className="min-w-0 rounded-2xl border border-violet-400/15 bg-violet-400/[0.025] p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.06]">
            <GitBranch className="size-4 text-violet-200" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white">
              Semantic transfer established
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Different tools are connected through equivalent security
              semantics.
            </p>

            <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <EvidenceRow
                label="Source capability"
                value="send_notification"
              />

              <EvidenceRow
                label="Semantic class"
                value={state.transfer.mapping.capabilityClass}
              />

              <EvidenceRow
                label="Target capability"
                value={state.transfer.mapping.targetTool}
              />
            </div>

            <p className="mt-3 text-[10px] text-zinc-600">
              Mapping confidence:{" "}
              {Math.round(state.transfer.mapping.mappingConfidence * 100)}%
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (state.analysis) {
    return (
      <section className="min-w-0 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.025] p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06]">
            <BrainCircuit className="size-4 text-cyan-200" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white">
              Transferable invariant extracted
            </p>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
              {state.analysis.invariant.humanDescription}
            </p>

            <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
              <EvidenceRow
                label="Source trust"
                value={state.analysis.invariant.sourceTrust}
              />

              <EvidenceRow
                label="Action class"
                value={state.analysis.invariant.actionClass}
              />

              <EvidenceRow
                label="Authorization"
                value={state.analysis.invariant.authorizationRequirement}
              />

              <EvidenceRow
                label="Constraint"
                value={state.analysis.invariant.constraint}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (state.repository) {
    return (
      <section className="min-w-0 rounded-2xl border border-rose-400/15 bg-rose-400/[0.025] p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/[0.06]">
            <CircleAlert className="size-4 text-rose-200" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white">
              Security incident intercepted
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Repository Assistant encountered untrusted-derived influence
              toward an external side effect.
            </p>

            <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <EvidenceRow label="Agent" value={state.repository.agentId} />

              <EvidenceRow
                label="Incident"
                value={state.repository.incidentId ?? "none"}
              />

              <EvidenceRow label="Execution" value={state.repository.status} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4 sm:p-5 lg:p-6">
      <div className="pointer-events-none absolute left-1/2 top-0 hidden size-64 -translate-x-1/2 rounded-full bg-cyan-400/[0.035] blur-[80px] sm:block" />

      <div className="relative flex min-w-0 items-start gap-3 sm:gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05]">
          <ShieldCheck className="size-5 text-cyan-200" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-white">
            Demo environment ready
          </p>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500">
            Start with the Repository Assistant. InvariantX will expose each
            security-transfer stage without granting AI autonomous policy
            activation.
          </p>

          <div className="mt-4 flex min-w-0 items-start gap-2 font-mono text-[10px] leading-5 text-zinc-600 [overflow-wrap:anywhere]">
            <LockKeyhole className="size-3.5" />
            human approval remains mandatory
          </div>
        </div>
      </div>
    </section>
  );
}
