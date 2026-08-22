import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { runNextSourceIntelligenceStep } from "@/lib/mixalis/source-intelligence-ai";
import { getSourceAnalysisView } from "@/lib/mixalis/source-intelligence";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ analysisId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { analysisId } = await params;

  try {
    const view = await getSourceAnalysisView(analysisId);
    if (!view) {
      return NextResponse.json({ error: "Source analysis not found." }, { status: 404 });
    }

    return NextResponse.json({ status: view.context.status, view });
  } catch (error) {
    console.error("Mixalis Source Intelligence status failed", error);
    return NextResponse.json(
      {
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Source Intelligence status failed.",
      },
      { status: 500 },
    );
  }
}

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
