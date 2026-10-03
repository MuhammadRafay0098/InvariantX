import { NextResponse } from "next/server";

import { validateTransfer } from "../../../../../lib/services/validation-orchestration-service";

interface RouteContext {
  params: Promise<{
    transfer_id: string;
  }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { transfer_id } = await context.params;

  try {
    const result = await validateTransfer(transfer_id);

    return NextResponse.json({
      data: result,
    });
  } catch (error: unknown) {
    console.error("Transfer validation API failed:", error);

    return NextResponse.json(
      {
        error: "Transfer validation failed.",
      },
      { status: 400 },
    );
  }
}
