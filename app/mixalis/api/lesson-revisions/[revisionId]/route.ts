import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { getLessonRevisionView, runLessonRevision } from "@/lib/mixalis/start-lesson";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ revisionId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { revisionId } = await params;
  try {
    const view = await getLessonRevisionView(revisionId);
    if (!view) return NextResponse.json({ error: "Lesson revision not found." }, { status: 404 });
    return NextResponse.json({ status: view.status, view });
  } catch (error) {
    console.error("Mixalis lesson revision status failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lesson revision status failed." },
      { status: 500 },
    );
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ revisionId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { revisionId } = await params;
  try {
    const view = await runLessonRevision(revisionId);
    return NextResponse.json({ status: view.status, view });
  } catch (error) {
    console.error("Mixalis START lesson generation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "START lesson generation failed." },
      { status: 500 },
    );
  }
}
