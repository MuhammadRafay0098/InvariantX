import {
  Ban,
  Database,
  ExternalLink,
  KeyRound,
  ShieldAlert,
} from "lucide-react";

import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Incident } from "@/types/incident";

interface IncidentEvidenceProps {
  incident: Incident;
}

export default function IncidentEvidence({ incident }: IncidentEvidenceProps) {
  return (
    <GlassPanel className="overflow-hidden">
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/[0.06]">
            <ShieldAlert className="size-4 text-rose-200" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              Incident evidence
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Deterministic facts captured during execution.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-white/[0.05] sm:grid-cols-2">
        <EvidenceItem
          icon={Database}
          label="Source"
          value={incident.source}
          badge={
            <StatusBadge tone="danger">
              {incident.sourceTrust.toUpperCase()}
            </StatusBadge>
          }
        />

        <EvidenceItem
          icon={ExternalLink}
          label="Observed action"
          value={incident.observedAction}
        />

        <EvidenceItem
          icon={ShieldAlert}
          label="Capability class"
          value={incident.capabilityClass}
        />

        <EvidenceItem
          icon={KeyRound}
          label="Trusted authorization"
          value={incident.trustedAuthorization ? "Present" : "Absent"}
          badge={
            <StatusBadge
              tone={incident.trustedAuthorization ? "success" : "danger"}
            >
              {incident.trustedAuthorization ? "AUTHORIZED" : "ABSENT"}
            </StatusBadge>
          }
        />
      </div>

      <div className="border-t border-white/[0.06] p-5">
        <div className="flex items-start gap-3 rounded-2xl border border-rose-400/10 bg-rose-400/[0.03] p-4">
          <Ban className="mt-0.5 size-4 shrink-0 text-rose-200" />

          <div>
            <p className="text-xs font-medium text-zinc-200">
              Security boundary
            </p>

            <p className="mt-1.5 text-xs leading-5 text-zinc-500">
              Untrusted-derived context requested an external side-effect
              capability without trusted authorization. The sandbox intercepted
              execution.
            </p>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

interface EvidenceItemProps {
  icon: typeof Database;
  label: string;
  value: string;
  badge?: React.ReactNode;
}

function EvidenceItem({ icon: Icon, label, value, badge }: EvidenceItemProps) {
  return (
    <div className="bg-[#080a11]/80 p-5">
      <div className="flex items-center gap-2 text-zinc-600">
        <Icon className="size-3.5" />
        <span className="text-[10px] font-medium uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="break-all font-mono text-xs text-zinc-300">
          {value}
        </span>

        {badge}
      </div>
    </div>
  );
}
