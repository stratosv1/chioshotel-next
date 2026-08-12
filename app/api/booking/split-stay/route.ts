import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime());
}

function toIsoDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);

  const raw = String(value ?? "").trim();
  const isoPrefix = raw.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (isoPrefix) return isoPrefix;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) throw new Error("Invalid split-stay change date");
  return parsed.toISOString().slice(0, 10);
}

function number(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0;
}

export async function GET(request: NextRequest) {
  try {
    const checkin = request.nextUrl.searchParams.get("checkin") || "";
    const checkout = request.nextUrl.searchParams.get("checkout") || "";
    const guests = Number.parseInt(request.nextUrl.searchParams.get("guests") || "2", 10);

    if (!isIsoDate(checkin) || !isIsoDate(checkout) || checkout <= checkin || !Number.isInteger(guests) || guests < 1 || guests > 5) {
      return NextResponse.json({ success: false, message: "Invalid split-stay search." }, { status: 400 });
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is missing");
    const sql = neon(databaseUrl);

    const statusRows = await sql`
      select *
      from booking_core.inventory_status(${checkin}::date, ${checkout}::date)
    `;
    const inventoryStatus = statusRows[0] as any;
    const status = String(inventoryStatus?.status || "DATA_UNAVAILABLE");

    if (status !== "READY") {
      return NextResponse.json({
        success: false,
        code: status,
        message: "Booking inventory is temporarily unavailable for this date range.",
        _booking_engine: {
          source: "neon_booking_core",
          inventoryStatus: status,
          expectedRows: Number(inventoryStatus?.expected_rows || 0),
          actualRows: Number(inventoryStatus?.actual_rows || 0),
          freshRows: Number(inventoryStatus?.fresh_rows || 0),
        },
      }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }

    const rows = await sql`
      select
        s.*,
        r1.room_id::text as first_room_id,
        r1.unit_id::text as first_unit_id,
        r1.display_name as first_name,
        r1.room_type as first_category,
        r1.floor as first_floor,
        r1.max_guests as first_max_guests,
        r2.room_id::text as second_room_id,
        r2.unit_id::text as second_unit_id,
        r2.display_name as second_name,
        r2.room_type as second_category,
        r2.floor as second_floor,
        r2.max_guests as second_max_guests
      from booking_core.search_split_stay(${checkin}::date, ${checkout}::date, ${guests}) s
      join booking_core.rooms r1 on r1.room_number = s.first_room_number
      join booking_core.rooms r2 on r2.room_number = s.second_room_number
      order by s.split_total, s.first_room_number, s.second_room_number, s.change_date
      limit 3
    `;

    const splitStays = (rows as any[]).map((row) => {
      const changeDate = toIsoDate(row.change_date);
      return {
        first: {
          roomId: String(row.first_room_id),
          unitId: String(row.first_unit_id),
          roomNumber: Number(row.first_room_number),
          name: String(row.first_name),
          category: String(row.first_category),
          floor: String(row.first_floor),
          maxGuests: Number(row.first_max_guests),
          checkin,
          checkout: changeDate,
          nights: Number(row.first_nights),
          total: number(row.first_total),
          guestNote: row.first_guest_note ? String(row.first_guest_note) : null,
        },
        second: {
          roomId: String(row.second_room_id),
          unitId: String(row.second_unit_id),
          roomNumber: Number(row.second_room_number),
          name: String(row.second_name),
          category: String(row.second_category),
          floor: String(row.second_floor),
          maxGuests: Number(row.second_max_guests),
          checkin: changeDate,
          checkout,
          nights: Number(row.second_nights),
          total: number(row.second_total),
          guestNote: row.second_guest_note ? String(row.second_guest_note) : null,
        },
        changeDate,
        originalTotal: number(row.original_total),
        directDiscountPercent: number(row.direct_discount_percent),
        directTotal: number(row.direct_total),
        splitRewardPercent: number(row.split_extra_discount_percent),
        splitTotal: number(row.split_total),
        saving: number(row.savings),
        breakfastTotalIfAdded: number(row.breakfast_total_if_added),
      };
    });

    const nights = Math.round((new Date(`${checkout}T12:00:00Z`).getTime() - new Date(`${checkin}T12:00:00Z`).getTime()) / 86400000);
    return NextResponse.json({
      success: true,
      checkin,
      checkout,
      guests,
      nights,
      splitStays,
      summary: { count: splitStays.length },
      _booking_engine: { source: "neon_booking_core", inventoryStatus: "READY" },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("booking_core split-stay search failed", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Split-stay search failed",
      _booking_engine: { source: "neon_booking_core_error" },
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
