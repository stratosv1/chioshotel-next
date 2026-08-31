import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { runSavvalasSourceIntelligence } from "@/lib/mixalis/savvalas-source-intelligence";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ rangeId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.redirect(new URL("/mixalis/login", request.url), 303);

  const { rangeId } = await params;
  try {
    const result = await runSavvalasSourceIntelligence(rangeId);
    return NextResponse.redirect(
      new URL(`/mixalis/source-intelligence/${result.analysisId}`, request.url),
      303,
    );
  } catch (error) {
    console.error("Mixalis Savvalas PDF audit failed", error);
    const url = new URL("/mixalis/savvalas-audit", request.url);
    url.searchParams.set(
      "message",
      error instanceof Error ? error.message.slice(0, 240) : "Το audit του Σαββάλα απέτυχε.",
    );
    return NextResponse.redirect(url, 303);
  }
}
