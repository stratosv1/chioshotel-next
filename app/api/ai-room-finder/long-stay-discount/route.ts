import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { daysBetweenIsoDates, isStrictIsoDate } from "@/lib/ai-assistant/room-finder-date";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function numeric(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0;
}

export async function GET(request: NextRequest) {
  try {
    const checkin = request.nextUrl.searchParams.get("checkin") || "";
    const checkout = request.nextUrl.searchParams.get("checkout") || "";

    if (!isStrictIsoDate(checkin) || !isStrictIsoDate(checkout) || checkout <= checkin) {
      return NextResponse.json({ success: false, message: "Invalid stay dates." }, { status: 400 });
    }

    const nights = daysBetweenIsoDates(checkin, checkout);
    if (!Number.isInteger(nights) || nights < 1) {
      return NextResponse.json({ success: false, message: "Invalid stay length." }, { status: 400 });
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is missing");
    const sql = neon(databaseUrl);

    const rows = await sql`
      select setting_key, numeric_value
      from booking_core.settings
      where setting_key in (
        'direct_discount_percent',
        'los_total_discount_1_2_nights',
        'los_total_discount_3_4_nights',
        'los_total_discount_5_6_nights',
        'los_total_discount_7_plus_nights'
      )
    `;

    const values = new Map<string, number>();
    for (const row of rows as any[]) {
      values.set(String(row.setting_key), numeric(row.numeric_value));
    }

    const standardDirectDiscountPercent = values.get("direct_discount_percent") ?? 10;
    const key = nights <= 2
      ? "los_total_discount_1_2_nights"
      : nights <= 4
        ? "los_total_discount_3_4_nights"
        : nights <= 6
          ? "los_total_discount_5_6_nights"
          : "los_total_discount_7_plus_nights";
    const totalDiscountPercent = values.get(key) ?? standardDirectDiscountPercent;

    return NextResponse.json({
      success: true,
      source: "neon_booking_core_settings",
      nights,
      standardDirectDiscountPercent,
      totalDiscountPercent,
      extraDiscountPercent: Math.max(0, Math.round((totalDiscountPercent - standardDirectDiscountPercent) * 100) / 100),
      eligible: totalDiscountPercent > standardDirectDiscountPercent,
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("AI Room Finder long-stay discount lookup failed", error);
    return NextResponse.json({
      success: false,
      message: "Long-stay discount lookup failed.",
    }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
