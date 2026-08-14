import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { localizeRoomOffer } from "@/lib/ai-assistant/room-card-catalog";
import { isStrictIsoDate } from "@/lib/ai-assistant/room-finder-date";
import type { AssistantLanguage } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supported = new Set<AssistantLanguage>(["el", "en", "de", "fr", "it", "es", "tr"]);

function rounded(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0;
}

export async function GET(request: NextRequest) {
  try {
    const checkin = request.nextUrl.searchParams.get("checkin") || "";
    const checkout = request.nextUrl.searchParams.get("checkout") || "";
    const guests = Number.parseInt(request.nextUrl.searchParams.get("guests") || "0", 10);
    const requestedLanguage = request.nextUrl.searchParams.get("lang") as AssistantLanguage | null;
    const language: AssistantLanguage = requestedLanguage && supported.has(requestedLanguage) ? requestedLanguage : "en";

    if (!isStrictIsoDate(checkin) || !isStrictIsoDate(checkout) || checkout <= checkin || !Number.isInteger(guests) || guests < 1 || guests > 5) {
      return NextResponse.json({ success: false, message: "Invalid availability request." }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
    const sql = neon(process.env.DATABASE_URL);
    const statusRows = await sql`select * from booking_core.inventory_status(${checkin}::date, ${checkout}::date)`;
    const status = String((statusRows[0] as any)?.status || "DATA_UNAVAILABLE");
    if (status !== "READY") {
      return NextResponse.json({ success: false, code: status, message: "Booking inventory is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }

    const rows = await sql`select * from booking_core.search_availability(${checkin}::date, ${checkout}::date, ${guests})`;
    const offers = (rows as any[]).map((row) => localizeRoomOffer({
      roomId: String(row.room_id),
      unitId: String(row.unit_id),
      roomNumber: Number(row.room_number),
      name: String(row.display_name),
      category: String(row.room_type),
      floor: String(row.floor),
      maxGuests: Number(row.max_guests),
      nights: Number(row.nights),
      originalTotal: rounded(row.original_total),
      directTotal: rounded(row.direct_total),
      saving: rounded(row.savings),
      guestNote: row.guest_note ? String(row.guest_note) : null,
      sourceGeneratedAt: row.source_generated_at,
      syncedAt: row.synced_at,
    }, language));

    return NextResponse.json({ success: true, checkin, checkout, guests, language, offers }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("AI Room Finder availability failed", error);
    return NextResponse.json({ success: false, message: "Availability search failed." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
