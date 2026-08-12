import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime());
}

function number(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0;
}

export async function GET(request: NextRequest) {
  const started = performance.now();
  try {
    const checkin = request.nextUrl.searchParams.get("checkin") || "";
    const checkout = request.nextUrl.searchParams.get("checkout") || "";
    const guests = Number.parseInt(request.nextUrl.searchParams.get("guests") || "2", 10);

    if (!isIsoDate(checkin) || !isIsoDate(checkout) || checkout <= checkin || !Number.isInteger(guests) || guests < 1) {
      return NextResponse.json({ success: false, message: "Invalid availability search." }, { status: 400 });
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is missing");
    const sql = neon(databaseUrl);
    const queryStarted = performance.now();

    const [quoteRows, eligibleRows] = await Promise.all([
      sql`
        select *
        from booking_core.search_availability(${checkin}::date, ${checkout}::date, ${guests})
      `,
      sql`
        select r.room_number, r.room_id::text, r.unit_id::text, r.display_name, r.room_type, r.floor, r.max_guests
        from booking_core.rooms r
        join booking_core.guest_pricing gp
          on gp.room_number = r.room_number
         and gp.guest_count = ${guests}
         and gp.allowed = true
        where r.is_active = true
        order by r.room_number
      `,
    ]);

    const queryMs = Math.round(performance.now() - queryStarted);
    const available = (quoteRows as any[]).map((row) => ({
      roomId: String(row.room_id),
      unitId: String(row.unit_id),
      roomNumber: Number(row.room_number),
      name: String(row.display_name),
      category: String(row.room_type),
      floor: String(row.floor),
      maxGuests: Number(row.max_guests),
      nights: Number(row.nights),
      available: true,
      price: number(row.original_total),
      totalPrice: number(row.original_total),
      roomTotal: number(row.original_total),
      originalTotal: number(row.original_total),
      baseTotal: number(row.base_total),
      guestSupplementTotal: number(row.guest_supplement_total),
      kitchenAdjustmentTotal: number(row.kitchen_adjustment_total),
      directDiscountPercent: number(row.direct_discount_percent),
      directTotal: number(row.direct_total),
      saving: number(row.savings),
      breakfastTotalIfAdded: number(row.breakfast_total_if_added),
      guestNote: row.guest_note ? String(row.guest_note) : null,
      nightlyPrices: row.nightly_prices,
      sourceGeneratedAt: row.source_generated_at,
      syncedAt: row.synced_at,
    }));

    const availableNumbers = new Set(available.map((room) => room.roomNumber));
    const unavailable = (eligibleRows as any[])
      .filter((row) => !availableNumbers.has(Number(row.room_number)))
      .map((row) => ({
        roomId: String(row.room_id),
        unitId: String(row.unit_id),
        roomNumber: Number(row.room_number),
        name: String(row.display_name),
        category: String(row.room_type),
        floor: String(row.floor),
        maxGuests: Number(row.max_guests),
        available: false,
        reason: "UNAVAILABLE",
      }));

    const nights = available[0]?.nights || Math.round((new Date(`${checkout}T12:00:00Z`).getTime() - new Date(`${checkin}T12:00:00Z`).getTime()) / 86400000);
    const totalMs = Math.round(performance.now() - started);

    return NextResponse.json({
      success: true,
      checkin,
      checkout,
      guests,
      nights,
      rooms: { available, unavailable },
      summary: { availableRooms: available.length, unavailableRooms: unavailable.length },
      _booking_engine: {
        source: "neon_booking_core",
        generatedAt: available[0]?.sourceGeneratedAt || null,
        queryMs,
        totalMs,
      },
    }, {
      headers: {
        "Cache-Control": "no-store",
        "Server-Timing": `neon;dur=${queryMs}, total;dur=${totalMs}`,
      },
    });
  } catch (error) {
    const totalMs = Math.round(performance.now() - started);
    const message = error instanceof Error ? error.message : "Booking core search failed";
    console.error("booking_core availability search failed", error);
    return NextResponse.json({
      success: false,
      message,
      _booking_engine: { source: "neon_booking_core_error", totalMs },
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
