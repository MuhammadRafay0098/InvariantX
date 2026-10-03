import { NextResponse } from "next/server";

import { runEmailAgent } from "../../../../../lib/agents/email-agent";

export async function POST() {
  try {
    const result = await runEmailAgent("synthetic_untrusted");

    return NextResponse.json({
      data: result,
    });
  } catch (error: unknown) {
    console.error("Email demo API failed:", error);

    return NextResponse.json(
      {
        error: "Email demo failed.",
      },
      { status: 500 },
    );
  }
}
