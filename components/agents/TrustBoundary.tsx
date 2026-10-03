import { KeyRound, ShieldAlert, ShieldCheck } from "lucide-react";

import type { AgentCapabilityView } from "./CapabilityGraph";

interface TrustBoundaryProps {
  capabilities: AgentCapabilityView[];
}

export default function TrustBoundary({ capabilities }: TrustBoundaryProps) {
  const untrustedCapabilities = capabilities.filter(
    (capability) => capability.defaultSourceTrust === "untrusted",
  );

  const authorizationCapabilities = capabilities.filter(
    (capability) => capability.requiresAuthorization,
  );

  const externalCapabilities = capabilities.filter(
    (capability) => capability.capabilityClass === "external_side_effect",
  );

  return (
    <div className="grid min-w-0 gap-2 sm:grid-cols-3">
      <BoundaryItem
        icon={ShieldAlert}
        label="Untrusted inputs"
        value={untrustedCapabilities.length}
        description="Capabilities exposed to untrusted-derived content."
      />

      <BoundaryItem
        icon={KeyRound}
        label="Authorization gates"
        value={authorizationCapabilities.length}
        description="Capabilities requiring explicit trusted authority."
      />

      <BoundaryItem
        icon={ShieldCheck}
        label="External effects"
        value={externalCapabilities.length}
        description="Capabilities capable of changing external state."
      />
    </div>
  );
}

interface BoundaryItemProps {
  icon: typeof ShieldCheck;
  label: string;
  value: number;
  description: string;
}

function BoundaryItem({
  icon: Icon,
  label,
  value,
  description,
}: BoundaryItemProps) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.05] bg-black/20 p-3">
      <div className="flex items-center justify-between gap-3">
        <Icon className="size-3.5 text-zinc-600" />

        <span className="font-mono text-xs text-zinc-300">{value}</span>
      </div>

      <p className="mt-3 text-[10px] font-medium text-zinc-400">{label}</p>

      <p className="mt-1 text-[9px] leading-4 text-zinc-700">{description}</p>
    </div>
  );
}
