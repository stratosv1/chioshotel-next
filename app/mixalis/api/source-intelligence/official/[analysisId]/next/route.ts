import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import {
  getOfficialAnalysisView,
  runOfficialSourceIntelligence,
} from "@/lib/mixalis/official-source-intelligence";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ analysisId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { analysisId } = await params;
  try {
    const view = await getOfficialAnalysisView(analysisId);
    if (!view) {
      return NextResponse.json({ error: "Official source analysis not found." }, { status: 404 });
    }
    return NextResponse.json({ status: view.status, view });
  } catch (error) {
    console.error("Mixalis official source status failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Official source status failed." },
      { status: 500 },
    );
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ analysisId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { analysisId } = await params;
  try {
    const view = await runOfficialSourceIntelligence(analysisId);
    if (!view) {
      return NextResponse.json({ error: "Official source analysis not found." }, { status: 404 });
    }
    return NextResponse.json({ status: view.status, view });
  } catch (error) {
    console.error("Mixalis official source step failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Official source step failed." },
      { status: 500 },
    );
  }
}
