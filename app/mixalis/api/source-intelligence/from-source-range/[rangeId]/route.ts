import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { createOfficialAnalysisFromRange } from "@/lib/mixalis/official-source-intelligence";

export const runtime = "nodejs";

async function openOfficialAnalysis(request: Request, rangeId: string) {
  const session = await getMixalisSession();
  if (!session) {
    return NextResponse.redirect(new URL("/mixalis/login", request.url), 303);
  }

  try {
    const { analysisId } = await createOfficialAnalysisFromRange(rangeId);
    return NextResponse.redirect(
      new URL(`/mixalis/source-intelligence/official/${analysisId}`, request.url),
      303,
    );
  } catch (error) {
    console.error("Mixalis official source analysis creation failed", error);
    const message = error instanceof Error ? error.message : "Official source analysis failed.";
    return NextResponse.redirect(
      new URL(`/mixalis?error=${encodeURIComponent(message)}`, request.url),
      303,
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ rangeId: string }> },
) {
  const { rangeId } = await params;
  return openOfficialAnalysis(request, rangeId);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ rangeId: string }> },
) {
  const { rangeId } = await params;
  return openOfficialAnalysis(request, rangeId);
}
