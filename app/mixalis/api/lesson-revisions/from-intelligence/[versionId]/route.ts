import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { createLessonRevisionFromIntelligence } from "@/lib/mixalis/start-lesson";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ versionId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { versionId } = await params;
  try {
    const revision = await createLessonRevisionFromIntelligence(versionId);
    return NextResponse.redirect(
      new URL(`/mixalis/lessons/${revision.id}`, request.url),
      { status: 303 },
    );
  } catch (error) {
    console.error("Mixalis lesson revision creation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lesson revision creation failed." },
      { status: 500 },
    );
  }
}
