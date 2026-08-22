import { NextRequest, NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { createPhysicsChapter } from "@/lib/mixalis/db";

export const runtime = "nodejs";

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url), 303);
}

export async function POST(request: NextRequest) {
  const session = await getMixalisSession();
  if (!session) {
    return redirectTo(request, "/mixalis/login");
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (title.length < 2 || title.length > 160) {
    return redirectTo(request, "/mixalis/chapters/new?error=title");
  }

  if (note.length > 1000) {
    return redirectTo(request, "/mixalis/chapters/new?error=note");
  }

  const chapter = await createPhysicsChapter({ title, note });
  return redirectTo(request, `/mixalis/chapters/${chapter.id}`);
}
