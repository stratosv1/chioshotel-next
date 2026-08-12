import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function athensToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function money(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0;
}

export async function GET(request: NextRequest) {
  try {
    const guests = Number.parseInt(request.nextUrl.searchParams.get("guests") || "2", 10);
    if (!Number.isInteger(guests) || guests < 1 || guests > 5) {
      return NextResponse.json({ ok: false, error: "Invalid guest count" }, { status: 400 });
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is missing");
    const sql = neon(databaseUrl);
    const today = athensToday();
    const firstDate = addDays(today, 1);
    const lastCheckout = addDays(today, 8);

    const [roomRows, quoteRows] = await Promise.all([
      sql`
        select r.room_number, r.room_id::text as room_id, r.unit_id::text as unit_id,
               r.display_name, r.room_type, r.floor, r.max_guests
        from booking_core.rooms r
        join booking_core.guest_pricing gp
          on gp.room_number = r.room_number
         and gp.guest_count = ${guests}
         and gp.allowed = true
        where r.is_active = true
        order by r.room_number
      `,
      sql`
        with dates as (
          select gs::date as stay_date
          from generate_series(${firstDate}::date, (${lastCheckout}::date - 1), interval '1 day') gs
        )
        select d.stay_date::text as checkin, q.*
        from dates d
        cross join lateral booking_core.search_availability(d.stay_date, d.stay_date + 1, ${guests}) q
        order by d.stay_date, q.room_number
      `,
    ]);

    const rooms = (roomRows as any[]).map((row) => ({
      id: Number(row.room_number),
      roomId: Number(row.room_id),
      unitId: Number(row.unit_id),
      displayName: String(row.display_name),
      type: String(row.room_type),
      location: String(row.floor),
      maxGuests: Number(row.max_guests),
    }));

    const quoteMap = new Map<string, any>();
    for (const row of quoteRows as any[]) {
      quoteMap.set(`${String(row.checkin).slice(0, 10)}:${row.room_id}:${row.unit_id}`, row);
    }

    const days = Array.from({ length: 7 }, (_, index) => {
      const checkin = addDays(today, index + 1);
      const results: Record<string, unknown> = {};
      for (const room of rooms) {
        const row = quoteMap.get(`${checkin}:${room.roomId}:${room.unitId}`);
        const key = `${room.roomId}_${room.unitId}`;
        results[key] = row ? {
          available: true,
          originalTotal: money(row.original_total),
          directTotal: money(row.direct_total),
          directDiscountPercent: money(row.direct_discount_percent),
          saving: money(row.savings),
          baseTotal: money(row.base_total),
          guestSupplementTotal: money(row.guest_supplement_total),
          kitchenAdjustmentTotal: money(row.kitchen_adjustment_total),
          guestNote: row.guest_note ? String(row.guest_note) : null,
          sourceGeneratedAt: row.source_generated_at,
          syncedAt: row.synced_at,
        } : { available: false };
      }
      return { checkin, results };
    });

    const freshness = (quoteRows as any[])
      .map((row) => row.source_generated_at)
      .filter(Boolean)
      .sort()
      .at(-1) || null;

    return NextResponse.json({
      ok: true,
      source: "neon_booking_core",
      guests,
      rooms,
      days,
      updatedAt: freshness,
      servedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking core deals query failed";
    console.error("booking_core deals failed", error);
    return NextResponse.json({ ok: false, error: message, source: "neon_booking_core_error" }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
