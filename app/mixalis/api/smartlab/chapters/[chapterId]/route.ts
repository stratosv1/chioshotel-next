import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chapterId } = await params;
  return NextResponse.json(
    {
      error: "Η chapter-wide δημιουργία SMARTLAB έχει απενεργοποιηθεί. Δημιούργησε LAB χειροκίνητα από το συγκεκριμένο υποκεφάλαιο.",
      chapterId,
      requiredRoute: "/mixalis/api/smartlab/subchapters/[subchapterId]",
    },
    { status: 409 },
  );
}
