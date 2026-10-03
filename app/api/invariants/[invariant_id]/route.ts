import { NextResponse } from "next/server";

import { getInvariantById } from "../../../../lib/services/invariant-service";

interface RouteContext {
  params: Promise<{
    invariant_id: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { invariant_id } = await context.params;

  const invariant = await getInvariantById(invariant_id);

  if (!invariant) {
    return NextResponse.json(
      {
        error: "Invariant not found.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data: invariant,
  });
}
