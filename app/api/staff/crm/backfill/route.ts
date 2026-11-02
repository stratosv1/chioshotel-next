import { NextRequest, NextResponse } from "next/server";
import { Beds24RateLimitError, fetchMonthContacts } from "@/lib/crm/beds24-contacts";
import { applyBookingContacts } from "@/lib/crm/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).
// Fills country, phone and language on existing bookings, one month per call.
export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  try {
    const { month } = (await request.json()) as { month?: string };
    if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return NextResponse.json({ ok: false, error: "Μη έγκυρος μήνας." }, { status: 400, headers });
    }
    const { updates, contactFields } = await fetchMonthContacts(month);
    const updated = await applyBookingContacts(updates);
    return NextResponse.json({ ok: true, month, scanned: updates.length, updated, contactFields }, { headers });
  } catch (error) {
    if (error instanceof Beds24RateLimitError) {
      return NextResponse.json({ ok: false, rateLimited: true }, { status: 429, headers });
    }
    console.error("staff crm backfill failed", error);
    return NextResponse.json({ ok: false, error: "Η άντληση από το Beds24 απέτυχε." }, { status: 502, headers });
  }
}
