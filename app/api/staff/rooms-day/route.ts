import { NextRequest, NextResponse } from "next/server";
import { getRoomDay } from "@/lib/crm/room-day";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  const day = request.nextUrl.searchParams.get("day") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return NextResponse.json({ ok: false, error: "Μη έγκυρη ημέρα." }, { status: 400, headers });
  try {
    return NextResponse.json({ ok: true, rooms: await getRoomDay(day) }, { headers });
  } catch (error) {
    console.error("staff rooms day failed", error);
    return NextResponse.json({ ok: false, error: "Δεν φορτώθηκαν τα δωμάτια." }, { status: 500, headers });
  }
}
