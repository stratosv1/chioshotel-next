import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { createSubchapterIntelligenceVersion } from "@/lib/mixalis/subchapter-intelligence";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ subchapterId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subchapterId } = await params;
  try {
    const version = await createSubchapterIntelligenceVersion(subchapterId);
    return NextResponse.redirect(
      new URL(`/mixalis/subchapter-intelligence/${version.id}`, request.url),
      303,
    );
  } catch (error) {
    console.error("Mixalis subchapter intelligence creation failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Subchapter Intelligence creation failed.",
      },
      { status: 500 },
    );
  }
}
