import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is missing");
    const sql = neon(databaseUrl);
    const today = athensToday();
    const firstDate = addDays(today, 1);
    const lastDate = addDays(today, 7);

    const [inventoryRows, roomRows, quoteRows] = await Promise.all([
      sql`
        select * from booking_core.inventory_status(${firstDate}::date, ${addDays(lastDate, 1)}::date)
      `,
      sql`
        select room_number, room_id::text as room_id, unit_id::text as unit_id,
               display_name, room_type, floor, max_guests
        from booking_core.rooms
        where is_active = true
        order by room_number
      `,
      sql`
        with dates as (
          select gs::date as stay_date
          from generate_series(${firstDate}::date, ${lastDate}::date, interval '1 day') gs
        ), guest_counts as (
          select generate_series(1, 5)::integer as guests
        )
        select d.stay_date::text as checkin, g.guests, q.*
        from dates d
        cross join guest_counts g
        cross join lateral booking_core.search_availability(d.stay_date, d.stay_date + 1, g.guests) q
        order by d.stay_date, g.guests, q.room_number
      `,
    ]);

    const inventory = (inventoryRows as any[])?.[0];
    if (!inventory || String(inventory.status) !== "READY") {
      throw new Error(`Booking inventory is not ready: ${String(inventory?.status || "DATA_UNAVAILABLE")}`);
    }

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
      quoteMap.set(`${String(row.checkin).slice(0, 10)}:${row.room_id}:${row.unit_id}:${row.guests}`, row);
    }

    const days = Array.from({ length: 7 }, (_, index) => {
      const checkin = addDays(today, index + 1);
      const results: Record<string, unknown> = {};
      for (const room of rooms) {
        const byGuests: Record<string, unknown> = {};
        for (let guests = 1; guests <= 5; guests += 1) {
          const row = quoteMap.get(`${checkin}:${room.roomId}:${room.unitId}:${guests}`);
          byGuests[String(guests)] = row ? {
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
        results[`${room.roomId}_${room.unitId}`] = { byGuests };
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
