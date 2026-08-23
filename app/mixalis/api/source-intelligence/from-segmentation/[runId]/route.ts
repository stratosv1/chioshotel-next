import { NextRequest, NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { createAnalysesFromConfirmedSegmentation } from "@/lib/mixalis/source-intelligence";

export const runtime = "nodejs";
export const maxDuration = 60;

const DEFAULT_PHYSICS_ANALYSIS_MODEL = "gpt-5.6";

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

function ensurePhysicsAnalysisModel() {
  if (!process.env.PHYSICS_ANALYSIS_MODEL?.trim()) {
    process.env.PHYSICS_ANALYSIS_MODEL = DEFAULT_PHYSICS_ANALYSIS_MODEL;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return redirectTo(request, "/mixalis/login");

  const { runId } = await params;

  try {
    ensurePhysicsAnalysisModel();
    const analyses = await createAnalysesFromConfirmedSegmentation(runId);
    if (analyses.length === 0) {
      throw new Error("No subchapter analyses were created.");
    }

    return redirectTo(
      request,
      `/mixalis/source-intelligence/${analyses[0].id}`,
    );
  } catch (error) {
    console.error("Mixalis create Source Intelligence failed", error);
    return redirectTo(request, `/mixalis?error=source-intelligence-create`);
  }
}
