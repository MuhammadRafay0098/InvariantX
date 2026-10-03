import Link from "next/link";
import { ArrowLeft, Clock3, ShieldAlert } from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";
import type { Incident } from "@/types/incident";

interface IncidentHeaderProps {
  incident: Incident;
}

function formatTimestamp(value: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export default function IncidentHeader({ incident }: IncidentHeaderProps) {
  return (
    <section>
      <Link
        href="/incidents"
        className="mb-5 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-200"
      >
        <ArrowLeft className="size-3.5" />
        All incidents
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge tone="danger">
              {incident.severity.toUpperCase()}
            </StatusBadge>

            <StatusBadge
              tone={incident.status === "analyzed" ? "success" : "warning"}
            >
              {incident.status.toUpperCase()}
            </StatusBadge>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-rose-400/15 bg-rose-400/[0.06]">
              <ShieldAlert className="size-5 text-rose-200" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-rose-200/70">
                Security Incident
              </p>

              <h1 className="mt-1.5 break-all font-mono text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                {incident.id}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
                {incident.originalGoal}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-zinc-600">
          <span>
            Agent{" "}
            <span className="font-mono text-zinc-400">{incident.agentId}</span>
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 className="size-3" />
            {formatTimestamp(incident.createdAt)}
          </span>
        </div>
      </div>
    </section>
  );
}
