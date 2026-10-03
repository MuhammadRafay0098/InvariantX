import { notFound } from "next/navigation";

import IncidentAnalysisPanel from "@/components/incidents/IncidentAnalysisPanel";
import IncidentEvidence from "@/components/incidents/IncidentEvidence";
import IncidentHeader from "@/components/incidents/IncidentHeader";
import AppShell from "@/components/layout/AppShell";
import { getIncidentById } from "@/lib/services/incident-service";

export const dynamic = "force-dynamic";

interface IncidentPageProps {
  params: Promise<{
    incident_id: string;
  }>;
}

export default async function IncidentPage({ params }: IncidentPageProps) {
  const { incident_id } = await params;

  const incident = await getIncidentById(incident_id);

  if (!incident) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <IncidentHeader incident={incident} />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <IncidentEvidence incident={incident} />

          <IncidentAnalysisPanel
            incidentId={incident.id}
            alreadyAnalyzed={incident.status === "analyzed"}
          />
        </div>
      </div>
    </AppShell>
  );
}
