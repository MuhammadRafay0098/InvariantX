import { NextResponse } from "next/server";

import { getIncidentById } from "../../../../lib/services/incident-service";

interface RouteContext {
  params: Promise<{
    incident_id: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { incident_id } = await context.params;

  const incident = await getIncidentById(incident_id);

  if (!incident) {
    return NextResponse.json(
      {
        error: "Incident not found.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data: incident,
  });
}
