import { NextResponse } from "next/server";

import { getAgents } from "../../../lib/services/dashboard-service";

export async function GET() {
  const data = await getAgents();

  return NextResponse.json({
    data,
  });
}
