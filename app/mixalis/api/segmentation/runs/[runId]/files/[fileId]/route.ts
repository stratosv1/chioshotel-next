import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { replaceSegmentationMappings, type SegmentationRelation } from "@/lib/mixalis/source-segmentation";

export const runtime = "nodejs";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const allowedRelations = new Set<SegmentationRelation>(["primary", "related", "boundary"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ runId: string; fileId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { runId, fileId } = await params;
  if (!uuidPattern.test(runId) || !uuidPattern.test(fileId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const rawMappings = Array.isArray(body?.mappings) ? body.mappings : [];
  const mappings = rawMappings.slice(0, 3).map((item: any) => ({
    subchapterId: String(item?.subchapterId ?? ""),
    relation: String(item?.relation ?? "") as SegmentationRelation,
  })).filter((item: { subchapterId: string; relation: SegmentationRelation }) =>
    uuidPattern.test(item.subchapterId) && allowedRelations.has(item.relation),
  );

  if (mappings.length === 0) {
    return NextResponse.json({ error: "At least one valid mapping is required." }, { status: 400 });
  }

  try {
    await replaceSegmentationMappings({ runId, sourceFileId: fileId, mappings });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed." },
      { status: 400 },
    );
  }
}
