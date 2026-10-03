import { NextResponse } from "next/server";

import { getTransferDetails } from "../../../../lib/services/dashboard-service";

interface RouteContext {
  params: Promise<{
    transfer_id: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { transfer_id } = await context.params;

  const data = await getTransferDetails(transfer_id);

  if (!data) {
    return NextResponse.json(
      {
        error: "Transfer not found.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data,
  });
}
