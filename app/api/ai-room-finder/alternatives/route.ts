import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { localizeRoomOffer } from "@/lib/ai-assistant/room-card-catalog";
import { daysBetweenIsoDates, isStrictIsoDate, parseStrictIsoDate, todayInAthensIso } from "@/lib/ai-assistant/room-finder-date";
import type { AssistantLanguage } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supported = new Set<AssistantLanguage>(["el", "en", "de", "fr", "it", "es", "tr"]);
const SHIFTS = [-1, 1, -2, 2, -3, 3] as const;
const MAX_WINDOWS = 3;
const MAX_OFFERS_PER_WINDOW = 4;

function shiftIsoDate(value: string, days: number) {
  const date = parseStrictIsoDate(value);
  if (!date) return "";
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

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

    if (
      !isStrictIsoDate(checkin)
      || !isStrictIsoDate(checkout)
      || checkout <= checkin
      || !Number.isInteger(guests)
      || guests < 1
      || guests > 5
    ) {
      return NextResponse.json(
        { success: false, code: "INVALID_REQUEST", message: "Invalid nearby-date request." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const nights = daysBetweenIsoDates(checkin, checkout);
    if (!Number.isInteger(nights) || nights < 1 || nights > 60) {
      return NextResponse.json(
        { success: false, code: "INVALID_STAY", message: "Unsupported stay length." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
    const sql = neon(process.env.DATABASE_URL);
    const today = todayInAthensIso();

    const candidates = SHIFTS
      .map(shift => ({
        shift,
        checkin: shiftIsoDate(checkin, shift),
        checkout: shiftIsoDate(checkout, shift),
      }))
      .filter(candidate => candidate.checkin && candidate.checkout && candidate.checkin >= today);

    const alternatives: Array<{
      checkin: string;
      checkout: string;
      shiftDays: number;
      offers: any[];
    }> = [];
    let unverifiedWindows = 0;

    // Check nearest windows first and stop once enough useful periods are found.
    // This avoids the previous 6-way parallel fan-out against Neon on every fallback request.
    for (const candidate of candidates) {
      const statusRows = await sql`select * from booking_core.inventory_status(${candidate.checkin}::date, ${candidate.checkout}::date)`;
      const status = String((statusRows[0] as any)?.status || "DATA_UNAVAILABLE");
      if (status !== "READY") {
        unverifiedWindows += 1;
        continue;
      }

      const rows = await sql`select * from booking_core.search_availability(${candidate.checkin}::date, ${candidate.checkout}::date, ${guests})`;
      const offers = (rows as any[])
        .map(row => localizeRoomOffer({
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
          breakfastTotalIfAdded: rounded(row.breakfast_total_if_added),
          guestNote: row.guest_note ? String(row.guest_note) : null,
          sourceGeneratedAt: row.source_generated_at,
          syncedAt: row.synced_at,
        }, language))
        .sort((left: any, right: any) => Number(left.directTotal) - Number(right.directTotal))
        .slice(0, MAX_OFFERS_PER_WINDOW);

      if (offers.length > 0) {
        alternatives.push({
          checkin: candidate.checkin,
          checkout: candidate.checkout,
          shiftDays: candidate.shift,
          offers,
        });
      }

      if (alternatives.length >= MAX_WINDOWS) break;
    }

    if (alternatives.length === 0 && unverifiedWindows > 0) {
      return NextResponse.json(
        {
          success: false,
          code: "ALTERNATIVES_DATA_UNAVAILABLE",
          message: "Nearby dates could not all be verified from live inventory.",
        },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { success: true, requested: { checkin, checkout, guests }, language, alternatives },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("AI Room Finder nearby-date search failed", error);
    return NextResponse.json(
      { success: false, code: "ALTERNATIVES_UNAVAILABLE", message: "Nearby-date search failed." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
