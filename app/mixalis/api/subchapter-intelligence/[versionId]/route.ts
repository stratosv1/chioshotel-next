import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import {
  getSubchapterIntelligenceView,
  runSubchapterIntelligence,
} from "@/lib/mixalis/subchapter-intelligence";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ versionId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { versionId } = await params;
  try {
    const view = await getSubchapterIntelligenceView(versionId);
    if (!view) {
      return NextResponse.json({ error: "Subchapter Intelligence version not found." }, { status: 404 });
    }
    return NextResponse.json({ status: view.status, view });
  } catch (error) {
    console.error("Mixalis subchapter intelligence status failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Subchapter Intelligence status failed." },
      { status: 500 },
    );
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ versionId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { versionId } = await params;
  try {
    const view = await runSubchapterIntelligence(versionId);
    if (!view) {
      return NextResponse.json({ error: "Subchapter Intelligence version not found." }, { status: 404 });
    }
    return NextResponse.json({ status: view.status, view });
  } catch (error) {
    console.error("Mixalis subchapter intelligence synthesis failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Subchapter Intelligence synthesis failed." },
      { status: 500 },
    );
  }
}
