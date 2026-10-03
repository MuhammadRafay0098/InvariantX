import { Boxes } from "lucide-react";

import CapabilityNode from "./CapabilityNode";

import type { CapabilityClass, TrustLevel } from "../../types/agent";

export interface AgentCapabilityView {
  id: string;
  agentId: string;

  toolName: string;
  capabilityClass: CapabilityClass;

  riskLevel: "low" | "medium" | "high" | "critical";
  defaultSourceTrust: TrustLevel;

  requiresAuthorization: boolean;
  description: string;
}

interface CapabilityGraphProps {
  capabilities: AgentCapabilityView[];
}

export default function CapabilityGraph({
  capabilities,
}: CapabilityGraphProps) {
  return (
    <div className="min-w-0">
      <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Boxes className="size-3.5 text-zinc-600" />

          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
            Capability graph
          </p>
        </div>

        <span className="font-mono text-[10px] text-zinc-700">
          {capabilities.length} registered
        </span>
      </div>

      <div className="relative min-w-0 space-y-3">
        {capabilities.length > 1 ? (
          <div className="pointer-events-none absolute bottom-8 left-[18px] top-8 w-px bg-gradient-to-b from-cyan-400/20 via-violet-400/10 to-transparent" />
        ) : null}

        {capabilities.map((capability) => (
          <div key={capability.id} className="relative">
            <CapabilityNode
              toolName={capability.toolName}
              capabilityClass={capability.capabilityClass}
              sourceTrust={capability.defaultSourceTrust}
              requiresAuthorization={capability.requiresAuthorization}
              description={capability.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
