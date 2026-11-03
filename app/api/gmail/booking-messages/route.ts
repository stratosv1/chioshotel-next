import { NextRequest, NextResponse } from "next/server";
import { syncGuestMessages } from "@/lib/crm/ota-outreach";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Called by the Gmail Apps Script every 10 minutes, because Vercel Hobby crons
// cannot run that often. Reads guest messages from Booking.com and Expedia.
export async function POST(request: NextRequest) {
  const secret = process.env.ARRIVAL_NOTES_SECRET?.trim();
  if (!secret) return NextResponse.json({ ok: false, error: "ARRIVAL_NOTES_SECRET is not configured." }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  try {
    return NextResponse.json({ ok: true, ...(await syncGuestMessages()) }, { headers: { "X-Robots-Tag": "noindex, nofollow" } });
  } catch (error) {
    console.error("[booking-messages] sync failed", error);
    return NextResponse.json({ ok: false, error: "Sync failed." }, { status: 502 });
  }
}
