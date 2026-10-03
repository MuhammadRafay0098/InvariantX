import { NextResponse } from "next/server";

import { resetDemoEnvironment } from "../../../../lib/db/reset";

export async function POST() {
  try {
    await resetDemoEnvironment();

    return NextResponse.json({
      data: {
        reset: true,
      },
    });
  } catch (error: unknown) {
    console.error("Demo reset API failed:", error);

    return NextResponse.json(
      {
        error: "Demo reset failed.",
      },
      { status: 500 },
    );
  }
}
