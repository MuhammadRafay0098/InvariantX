import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import ValidationWorkspace from "@/components/validation/ValidationWorkspace";
import { getTransferDetails } from "@/lib/services/dashboard-service";

export const dynamic = "force-dynamic";

interface ValidationPageProps {
  searchParams: Promise<{
    transfer?: string;
  }>;
}

export default async function ValidationPage({
  searchParams,
}: ValidationPageProps) {
  const { transfer: transferId } = await searchParams;

  if (!transferId) {
    redirect("/transfers");
  }

  const details = await getTransferDetails(transferId);

  if (!details) {
    redirect("/transfers");
  }

  return (
    <AppShell>
      <div className="min-w-0 space-y-5 sm:space-y-6">
        <section>
          <Link
            href={`/transfers/${encodeURIComponent(details.transfer.id)}`}
            className="mb-5 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-200"
          >
            <ArrowLeft className="size-3.5" />
            Transfer
          </Link>

          <div className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06]">
                <ShieldCheck className="size-5 text-emerald-200" />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-200/70">
                  Sandbox Validation
                </p>

                <h1 className="mt-1.5 max-w-3xl text-[clamp(1.5rem,4vw,1.875rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
                  Prove the defense before activation.
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  Deterministic scenarios test security improvement and benign
                  utility before any human-approved policy activation.
                </p>
              </div>
            </div>

            <div className="max-w-full [overflow-wrap:anywhere] font-mono text-[10px] leading-4 text-zinc-600 lg:max-w-[24rem] lg:text-right">
              {details.transfer.id}
            </div>
          </div>
        </section>

        <ValidationWorkspace
          initialTransfer={details.transfer}
          initialPolicy={details.policy}
          initialRuns={details.validationRuns}
        />
      </div>
    </AppShell>
  );
}
