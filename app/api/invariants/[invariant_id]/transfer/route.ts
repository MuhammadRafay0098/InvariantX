import { NextResponse } from "next/server";
import { z } from "zod";

import { createSemanticTransferWithPolicy } from "../../../../../lib/services/transfer-orchestration-service";

const transferRequestSchema = z.object({
  sourceAgentId: z.string().min(1),
  targetAgentId: z.string().min(1),
});

interface RouteContext {
  params: Promise<{
    invariant_id: string;
  }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { invariant_id } = await context.params;

    const body: unknown = await request.json();

    const parsed = transferRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid transfer request.",
          issues: parsed.error.issues,
        },
        {
          status: 400,
        },
      );
    }

    const result = await createSemanticTransferWithPolicy(
      invariant_id,
      parsed.data.sourceAgentId,
      parsed.data.targetAgentId,
    );

    return NextResponse.json({
      data: result,
    });
  } catch (error: unknown) {
    console.error("Invariant transfer API failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invariant transfer failed.",
      },
      {
        status: 400,
      },
    );
  }
}
