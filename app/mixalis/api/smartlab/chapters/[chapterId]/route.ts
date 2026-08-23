import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { createSmartLabRevision } from "@/lib/mixalis/smartlab";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chapterId } = await params;
  try {
    const revision = await createSmartLabRevision(chapterId);
    return NextResponse.redirect(
      new URL(`/mixalis/chapters/${chapterId}/lab?revision=${revision.id}`, request.url),
      { status: 303 },
    );
  } catch (error) {
    console.error("Mixalis SMARTLAB revision creation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SMARTLAB revision creation failed." },
      { status: 500 },
    );
  }
}
