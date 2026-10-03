import { NextResponse } from "next/server";

import { analyzeIncidentAndExtractInvariant } from "../../../../../lib/services/incident-analysis-service";

interface RouteContext {
  params: Promise<{
    incident_id: string;
  }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { incident_id } = await context.params;

  try {
    const result = await analyzeIncidentAndExtractInvariant(incident_id);

    return NextResponse.json({
      data: result,
    });
  } catch (error: unknown) {
    console.error("Incident analysis API failed:", error);

    return NextResponse.json(
      {
        error: "Incident analysis failed.",
      },
      { status: 400 },
    );
  }
}
