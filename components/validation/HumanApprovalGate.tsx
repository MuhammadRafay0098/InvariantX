"use client";

import {
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import type { Policy } from "@/types/policy";
import type { Transfer } from "@/types/transfer";

interface HumanApprovalGateProps {
  transfer: Transfer;
  policy: Policy;
  approving: boolean;
  onApprove: () => void;
}

export default function HumanApprovalGate({
  transfer,
  policy,
  approving,
  onApprove,
}: HumanApprovalGateProps) {
  const approved = transfer.status === "approved" && policy.status === "active";

  if (approved) {
    return (
      <section className="relative min-w-0 overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.035] p-4 sm:p-5">
        <div className="pointer-events-none absolute right-0 top-0 hidden size-52 rounded-full bg-emerald-400/[0.06] blur-[70px] sm:block" />

        <div className="relative flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08]">
            <CheckCircle2 className="size-5 text-emerald-200" />
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-200/70">
              Defense Activated
            </p>

            <h3 className="mt-1 text-base font-semibold text-white">
              Human approval complete.
            </h3>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500">
              The transferred policy is now active and can participate in
              deterministic runtime enforcement.
            </p>

            <div className="mt-4 inline-flex max-w-full items-start gap-2 rounded-lg border border-emerald-400/15 bg-black/20 px-3 py-2">
              <ShieldCheck className="size-3.5 text-emerald-300" />

              <span className="[overflow-wrap:anywhere] font-mono text-[10px] leading-4 text-emerald-100">
                untrusted + no trusted authorization → require_approval
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-w-0 overflow-hidden rounded-2xl border border-amber-400/15 bg-amber-400/[0.025]">
      <div className="pointer-events-none absolute -right-16 -top-16 hidden size-52 rounded-full bg-amber-400/[0.05] blur-[70px] sm:block" />

      <div className="relative flex min-w-0 flex-col gap-5 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-amber-400/15 bg-amber-400/[0.055]">
            <KeyRound className="size-5 text-amber-200" />
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-amber-200/70">
              Human Control Boundary
            </p>

            <h3 className="mt-1 text-base font-semibold text-white">
              Validation passed. Activation still requires you.
            </h3>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500">
              The proposed policy remains inactive until explicit human
              approval. AI cannot cross this boundary.
            </p>

            <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2 font-mono text-[10px] leading-4 text-zinc-600">
              <LockKeyhole className="size-3" />
              current policy status: {policy.status}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={approving}
          onClick={onApprove}
          className={[
            "inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-4 md:w-auto",
            "border border-amber-300/20 bg-amber-300/[0.08]",
            "text-xs font-medium text-amber-100",
            "transition duration-300",
            "hover:border-amber-300/30 hover:bg-amber-300/[0.13]",
            "disabled:cursor-not-allowed disabled:opacity-60",
          ].join(" ")}
        >
          {approving ? (
            <LoaderCircle className="size-3.5 animate-spin" />
          ) : (
            <KeyRound className="size-3.5" />
          )}

          {approving ? "Activating..." : "Approve & activate"}
        </button>
      </div>
    </section>
  );
}
