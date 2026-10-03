import { notFound } from "next/navigation";
import { KeyRound, Network, ShieldCheck } from "lucide-react";

import InvariantHeader from "@/components/invariants/InvariantHeader";
import SemanticTransferPanel from "@/components/invariants/SemanticTransferPanel";
import AppShell from "@/components/layout/AppShell";
import GlassPanel from "@/components/ui/GlassPanel";
import { getInvariantById } from "@/lib/services/invariant-service";

export const dynamic = "force-dynamic";

interface InvariantPageProps {
  params: Promise<{
    invariant_id: string;
  }>;
}

export default async function InvariantPage({ params }: InvariantPageProps) {
  const { invariant_id } = await params;

  const invariant = await getInvariantById(invariant_id);

  if (!invariant) {
    notFound();
  }

  return (
    <AppShell>
      <div className="min-w-0 space-y-5 sm:space-y-6">
        <InvariantHeader invariant={invariant} />

        <GlassPanel className="overflow-hidden">
          <div className="border-b border-white/[0.06] p-5">
            <h2 className="text-sm font-semibold text-white">
              Transfer semantics
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              The reusable constraint extracted from the original incident.
            </p>
          </div>

          <div className="grid min-w-0 gap-px bg-white/[0.05] sm:grid-cols-2 xl:grid-cols-4">
            <SemanticField
              icon={ShieldCheck}
              label="Source trust"
              value={invariant.sourceTrust}
            />

            <SemanticField
              icon={Network}
              label="Action class"
              value={invariant.actionClass}
            />

            <SemanticField
              icon={KeyRound}
              label="Authorization"
              value={invariant.authorizationRequirement}
            />

            <SemanticField
              icon={ShieldCheck}
              label="Constraint"
              value={invariant.constraint}
            />
          </div>
        </GlassPanel>

        <SemanticTransferPanel invariantId={invariant.id} />
      </div>
    </AppShell>
  );
}

interface SemanticFieldProps {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}

function SemanticField({ icon: Icon, label, value }: SemanticFieldProps) {
  return (
    <div className="min-w-0 bg-[#080a11]/80 p-4 sm:p-5">
      <Icon className="size-3.5 text-cyan-200/60" />

      <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-600">
        {label}
      </p>

      <p className="mt-2 [overflow-wrap:anywhere] font-mono text-[11px] leading-4 text-zinc-300">
        {value}
      </p>
    </div>
  );
}
