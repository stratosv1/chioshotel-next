import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { runNextSourceIntelligenceStep } from "@/lib/mixalis/source-intelligence-ai";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ analysisId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { analysisId } = await params;

  try {
    const result = await runNextSourceIntelligenceStep(analysisId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Mixalis Source Intelligence step failed", error);
    return NextResponse.json(
      {
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Source Intelligence step failed.",
      },
      { status: 500 },
    );
  }
}
