import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { confirmSegmentationRun } from "@/lib/mixalis/source-segmentation";

export const runtime = "nodejs";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ runId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { runId } = await params;
  if (!uuidPattern.test(runId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await confirmSegmentationRun(runId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Confirmation failed." },
      { status: 400 },
    );
  }
}
