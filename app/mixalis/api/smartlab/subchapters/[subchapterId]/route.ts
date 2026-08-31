import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { createSingleSmartLabRevision } from "@/lib/mixalis/smartlab-single";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ subchapterId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subchapterId } = await params;
  try {
    const revision = await createSingleSmartLabRevision(subchapterId);
    const url = new URL(`/mixalis/chapters/${revision.chapterId}/lab`, request.url);
    url.searchParams.set("subchapter", subchapterId);
    url.searchParams.set("revision", revision.id);
    return NextResponse.redirect(url, { status: 303 });
  } catch (error) {
    console.error("Mixalis per-subchapter SMARTLAB creation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SMARTLAB creation failed." },
      { status: 500 },
    );
  }
}
