import { NextResponse } from "next/server";

import { runRepositoryAgent } from "../../../../../lib/agents/repository-agent";

export async function POST() {
  try {
    const result = await runRepositoryAgent();

    return NextResponse.json({
      data: result,
    });
  } catch (error: unknown) {
    console.error("Repository demo API failed:", error);

    return NextResponse.json(
      {
        error: "Repository demo failed.",
      },
      { status: 500 },
    );
  }
}
