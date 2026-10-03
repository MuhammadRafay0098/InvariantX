import { Activity, Bot, Fingerprint, ShieldCheck } from "lucide-react";

import MetricCard from "@/components/ui/MetricCard";

interface MetricsGridProps {
  agents: number;
  incidents: number;
  invariants: number;
  approvedPolicies: number;
}

export default function MetricsGrid({
  agents,
  incidents,
  invariants,
  approvedPolicies,
}: MetricsGridProps) {
  return (
    <section
      aria-label="Security metrics"
      className="grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-4"
    >
      <MetricCard
        label="Registered Agents"
        value={agents}
        description="Agents available for semantic capability mapping."
        icon={Bot}
        accent="cyan"
      />

      <MetricCard
        label="Observed Incidents"
        value={incidents}
        description="Sandboxed security events captured for analysis."
        icon={Activity}
        accent="amber"
      />

      <MetricCard
        label="Extracted Invariants"
        value={invariants}
        description="Reusable security constraints derived from incidents."
        icon={Fingerprint}
        accent="violet"
      />

      <MetricCard
        label="Active Policies"
        value={approvedPolicies}
        description="Human-approved defenses enforced at runtime."
        icon={ShieldCheck}
        accent="emerald"
      />
    </section>
  );
}