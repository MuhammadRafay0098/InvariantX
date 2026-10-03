import { NextResponse } from "next/server";

import { approveTransfer } from "../../../../../lib/services/approval-service";

interface RouteContext {
  params: Promise<{
    transfer_id: string;
  }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { transfer_id } = await context.params;

  try {
    const result = await approveTransfer(transfer_id);

    return NextResponse.json({
      data: result,
    });
  } catch (error: unknown) {
    console.error("Transfer approval API failed:", error);

    return NextResponse.json(
      {
        error: "Transfer approval failed.",
      },
      { status: 400 },
    );
  }
}
