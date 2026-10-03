import Link from "next/link";
import { ArrowLeft, Fingerprint, ShieldCheck } from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";
import type { Invariant } from "@/types/invariant";

interface InvariantHeaderProps {
  invariant: Invariant;
}

export default function InvariantHeader({ invariant }: InvariantHeaderProps) {
  return (
    <section>
      <Link
        href="/invariants"
        className="mb-5 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-200"
      >
        <ArrowLeft className="size-3.5" />
        All invariants
      </Link>

      <div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
            <Fingerprint className="size-5 text-cyan-100" />
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-200/70">
                Security Invariant
              </span>

              <StatusBadge tone="success">
                {invariant.status.toUpperCase()}
              </StatusBadge>
            </div>

            <h1 className="[overflow-wrap:anywhere] font-mono text-lg font-semibold leading-7 tracking-[-0.03em] text-white sm:text-2xl">
              {invariant.id}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
              {invariant.humanDescription}
            </p>
          </div>
        </div>

        <div className="flex max-w-full items-center gap-2 text-xs leading-5 text-zinc-600">
          <ShieldCheck className="size-3.5 text-emerald-300/70" />
          Attack-independent security knowledge
        </div>
      </div>
    </section>
  );
}
