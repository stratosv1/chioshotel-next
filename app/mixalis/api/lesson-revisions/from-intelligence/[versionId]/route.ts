import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION } from "@/lib/mixalis/canonical-subchapter-sources";
import { getSubchapterIntelligenceView } from "@/lib/mixalis/subchapter-intelligence";
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
    const intelligence = await getSubchapterIntelligenceView(versionId);
    if (!intelligence) {
      return NextResponse.json({ error: "Subchapter Intelligence version not found." }, { status: 404 });
    }
    if (intelligence.status !== "current") {
      return NextResponse.json(
        { error: "Το START απαιτεί current canonical Subchapter Intelligence." },
        { status: 409 },
      );
    }
    if (intelligence.promptVersion !== CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION) {
      return NextResponse.json(
        {
          error:
            "Αυτή η Intelligence version είναι legacy. Γύρνα στο Physics Pipeline και δημιούργησε τη νέα PDF-only canonical version πριν από το START.",
        },
        { status: 409 },
      );
    }

    const officialCount = intelligence.sources.filter((source) => source.sourceRole === "official").length;
    const depthCount = intelligence.sources.filter((source) => source.sourceRole === "depth").length;
    if (intelligence.sources.length !== 2 || officialCount !== 1 || depthCount !== 1) {
      return NextResponse.json(
        {
          error:
            "Το START απαιτεί ακριβώς 2 canonical πηγές: Official School Book PDF + Savvalas PDF Depth Audit.",
        },
        { status: 409 },
      );
    }

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
