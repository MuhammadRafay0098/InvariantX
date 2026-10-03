import { NextResponse } from "next/server";

import { getDashboardData } from "../../../lib/services/dashboard-service";

export async function GET() {
  const data = await getDashboardData();

  return NextResponse.json({
    data,
  });
}
