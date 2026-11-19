import { NextRequest, NextResponse } from "next/server";
import { Beds24RateLimited, syncRecentFromBeds24 } from "@/lib/pyrgos/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };

// One shared result per warm instance for 60 s, so several open tabs do not each call Beds24.
let last: { at: number; minutes: number; result: unknown } | null = null;

export async function POST(request: NextRequest) {
  const minutes = Math.min(Math.max(Number(request.nextUrl.searchParams.get("minutes")) || 30, 5), 7 * 24 * 60);
  if (last && Date.now() - last.at < 60_000 && last.minutes >= minutes) {
    return NextResponse.json({ ok: true, cached: true, ...(last.result as object), changed: 0 }, { headers });
  }
  try {
    const result = await syncRecentFromBeds24(minutes);
    last = { at: Date.now(), minutes, result };
    return NextResponse.json({ ok: true, ...result }, { headers });
  } catch (error) {
    if (error instanceof Beds24RateLimited) return NextResponse.json({ ok: false, rateLimited: true }, { status: 429, headers });
    console.error("[pyrgos] sync failed", error);
    return NextResponse.json({ ok: false, error: "Ο συγχρονισμός με το Beds24 απέτυχε." }, { status: 502, headers });
  }
}
