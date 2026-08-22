import { NextRequest, NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import {
  createMaterialBatch,
  getPhysicsChapter,
  isMaterialSourceType,
} from "@/lib/mixalis/db";

export const runtime = "nodejs";

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getMixalisSession();
  if (!session) {
    return redirectTo(request, "/mixalis/login");
  }

  const { id } = await params;
  const chapter = await getPhysicsChapter(id);
  if (!chapter) {
    return redirectTo(request, "/mixalis");
  }

  const formData = await request.formData();
  const sourceType = String(formData.get("sourceType") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const lessonDate = String(formData.get("lessonDate") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!isMaterialSourceType(sourceType)) {
    return redirectTo(request, `/mixalis/chapters/${id}?error=source`);
  }

  if (label.length > 160 || notes.length > 1000) {
    return redirectTo(request, `/mixalis/chapters/${id}?error=length`);
  }

  if (lessonDate && !/^\d{4}-\d{2}-\d{2}$/.test(lessonDate)) {
    return redirectTo(request, `/mixalis/chapters/${id}?error=date`);
  }

  await createMaterialBatch({
    chapterId: id,
    sourceType,
    label,
    lessonDate,
    notes,
  });

  return redirectTo(request, `/mixalis/chapters/${id}?created=batch`);
}
