import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    {
      error: "AI assistant logic is temporarily disabled while the new assistant is being rebuilt.",
      answer: "Ο AI Assistant ανακατασκευάζεται αυτή τη στιγμή.",
      search: {},
      offers: [],
    },
    { status: 503 },
  );
}
