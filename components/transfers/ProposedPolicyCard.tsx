import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";
import type { Policy } from "@/types/policy";

interface ProposedPolicyCardProps {
  policy: Policy;
}

export default function ProposedPolicyCard({
  policy,
}: ProposedPolicyCardProps) {
  const active = policy.status === "active";

  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-violet-400/15 bg-violet-400/[0.025]">
      <div className="pointer-events-none absolute -right-20 -top-20 hidden size-56 rounded-full bg-violet-500/[0.05] blur-[75px] sm:block" />

      <div className="relative flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.06]">
            <LockKeyhole className="size-4 text-violet-200" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              {active
                ? "Active transferred defense"
                : "Proposed transferred defense"}
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              {active
                ? "Human-approved deterministic policy."
                : "Generated from the mapped invariant. Not enforced yet."}
            </p>
          </div>
        </div>

        <StatusBadge tone={active ? "success" : "warning"}>
          {active ? "ACTIVE" : "INACTIVE · PROPOSED"}
        </StatusBadge>
      </div>

      <div className="relative p-5">
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          <PolicyField label="Target agent" value={policy.targetAgentId} />

          <PolicyField
            label="Target capability"
            value={policy.targetCapability}
          />

          <PolicyField
            label="Source trust condition"
            value={policy.conditions.sourceTrust}
          />

          <PolicyField
            label="Trusted authorization"
            value={
              policy.conditions.trustedAuthorization
                ? "required / present"
                : "absent"
            }
          />
        </div>

        <div className="mt-3 rounded-2xl border border-violet-400/10 bg-violet-400/[0.035] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-violet-200" />

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                Deterministic effect
              </p>

              <p className="mt-2 font-mono text-sm font-medium text-violet-100">
                {policy.effect}
              </p>

              {!active ? (
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Runtime enforcement remains unchanged until sandbox validation
                  succeeds and a human explicitly approves this policy.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {!active ? (
          <div className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-amber-200/60">
            <KeyRound className="mt-0.5 size-3.5 shrink-0" />
            Human approval is required before activation.
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface PolicyFieldProps {
  label: string;
  value: string;
}

function PolicyField({ label, value }: PolicyFieldProps) {
  return (
    <div className="rounded-xl border border-white/[0.055] bg-black/20 p-3.5">
      <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-600">
        {label}
      </p>

      <p className="mt-2 [overflow-wrap:anywhere] font-mono text-[11px] leading-4 text-zinc-300">
        {value}
      </p>
    </div>
  );
}
