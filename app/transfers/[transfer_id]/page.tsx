import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Network, ShieldCheck } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import CapabilityMapping from "@/components/transfers/CapabilityMapping";
import ProposedPolicyCard from "@/components/transfers/ProposedPolicyCard";
import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import { getTransferDetails } from "@/lib/services/dashboard-service";

export const dynamic = "force-dynamic";

interface TransferPageProps {
  params: Promise<{
    transfer_id: string;
  }>;
}

export default async function TransferPage({ params }: TransferPageProps) {
  const { transfer_id } = await params;

  const details = await getTransferDetails(transfer_id);

  if (!details) {
    notFound();
  }

  const { transfer, policy, validationRuns } = details;

  return (
    <AppShell>
      <div className="space-y-5">
        <section>
          <Link
            href="/transfers"
            className="mb-5 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-200"
          >
            <ArrowLeft className="size-3.5" />
            All transfers
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.06]">
                <Network className="size-5 text-violet-200" />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-200/70">
                  Cross-Agent Transfer
                </p>

                <h1 className="mt-1.5 break-all font-mono text-xl font-semibold text-white sm:text-2xl">
                  {transfer.id}
                </h1>

                <p className="mt-2 text-xs text-zinc-500">
                  {transfer.sourceAgentId}
                  {" → "}
                  {transfer.targetAgentId}
                </p>
              </div>
            </div>

            <StatusBadge
              tone={
                transfer.status === "approved"
                  ? "success"
                  : transfer.status === "ready_for_review"
                    ? "info"
                    : transfer.status === "rejected"
                      ? "danger"
                      : "warning"
              }
            >
              {transfer.status.replaceAll("_", " ").toUpperCase()}
            </StatusBadge>
          </div>
        </section>

        <CapabilityMapping
          targetTool={transfer.targetTool}
          confidence={transfer.mappingConfidence}
        />

        {policy ? (
          <ProposedPolicyCard policy={policy} />
        ) : (
          <GlassPanel className="p-5">
            <p className="text-sm text-zinc-400">
              No policy is associated with this transfer.
            </p>
          </GlassPanel>
        )}

        <GlassPanel className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05]">
                <ShieldCheck className="size-4 text-emerald-200" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Sandbox validation
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Security and benign-utility scenarios must pass before human
                  review.
                </p>
              </div>
            </div>

            {transfer.status === "mapped" ? (
              <Link
                href={`/validation?transfer=${encodeURIComponent(transfer.id)}`}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.07] px-4 text-xs font-medium text-emerald-100 transition hover:bg-emerald-300/[0.11]"
              >
                Validate defense
                <ArrowRight className="size-3.5" />
              </Link>
            ) : null}
          </div>

          <div className="grid min-w-0 gap-px bg-white/[0.05] sm:grid-cols-3">
            <TransferMetric
              label="Validation runs"
              value={String(validationRuns.length)}
            />

            <TransferMetric
              label="Security score"
              value={
                transfer.securityScore === null
                  ? "Pending"
                  : `${Math.round(transfer.securityScore * 100)}%`
              }
            />

            <TransferMetric
              label="Utility score"
              value={
                transfer.utilityScore === null
                  ? "Pending"
                  : `${Math.round(transfer.utilityScore * 100)}%`
              }
            />
          </div>
        </GlassPanel>
      </div>
    </AppShell>
  );
}

interface TransferMetricProps {
  label: string;
  value: string;
}

function TransferMetric({ label, value }: TransferMetricProps) {
  return (
    <div className="min-w-0 bg-[#080a11]/80 p-4 sm:p-5">
      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-600">
        {label}
      </p>

      <p className="mt-2 [overflow-wrap:anywhere] font-mono text-sm text-zinc-200">{value}</p>
    </div>
  );
}
