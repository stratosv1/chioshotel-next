import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_NIGHTS = 30;
const MAX_GUESTS = 10;
const DIRECT_DISCOUNT_PERCENT = 10;
const SPLIT_REWARD_PERCENT = 10;

const ROOM_NUMBER_BY_KEY: Record<string, number> = {
  "267788:1": 1,
  "268803:1": 2,
  "267788:2": 3,
  "267788:3": 4,
  "626129:1": 5,
  "268803:2": 6,
  "626129:2": 7,
  "265595:1": 8,
  "265595:2": 9,
  "265595:3": 10,
};

type Unit = {
  room_id: string;
  unit_id: string;
  display_name: string;
  category: string;
  floor: string;
  max_guests: number;
};

type Night = { date: string; price: number };

type Segment = {
  roomId: string;
  unitId: string;
  roomNumber: number;
  name: string;
  category: string;
  floor: string;
  checkin: string;
  checkout: string;
  nights: number;
  total: number;
};

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function makeDays(checkin: string, checkout: string) {
  const days: string[] = [];
  const cursor = new Date(`${checkin}T12:00:00Z`);
  const end = new Date(`${checkout}T12:00:00Z`);
  while (cursor < end) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

function roomAllowed(number: number, guests: number) {
  if (guests <= 2) return number >= 1 && number <= 10;
  if (guests === 3) return [1, 3, 4, 5, 7, 8, 9, 10].includes(number);
  if (guests === 4) return [1, 8, 9, 10].includes(number);
  if (guests === 5) return number === 10;
  return false;
}

function money(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : null;
}

export async function GET(request: NextRequest) {
  try {
    const checkin = request.nextUrl.searchParams.get("checkin") || "";
    const checkout = request.nextUrl.searchParams.get("checkout") || "";
    const guests = Number.parseInt(request.nextUrl.searchParams.get("guests") || "2", 10);
    const days = makeDays(checkin, checkout);

    if (!isDate(checkin) || !isDate(checkout) || days.length < 2 || days.length > MAX_NIGHTS || guests < 1 || guests > MAX_GUESTS) {
      return NextResponse.json({ success: false, message: "Invalid split-stay search." }, { status: 400 });
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is missing");
    const sql = neon(databaseUrl);

    const [unitsRows, availabilityRows, rateRows, bookingRows] = await Promise.all([
      sql`
        select room_id::text as room_id, unit_id::text as unit_id, label as display_name,
               room_name as category, location as floor, max_guests
        from staff_units
        where is_active = true
        order by id asc
      `,
      sql`
        select stay_date::text as date, room_id::text as room_id, unit_id::text as unit_id,
               price, available, reason
        from staff_availability_calendar
        where stay_date >= ${checkin}::date and stay_date < ${checkout}::date
      `,
      sql`
        select stay_date::text as date, room_id::text as room_id, price
        from staff_rate_cache
        where stay_date >= ${checkin}::date and stay_date < ${checkout}::date
      `,
      sql`
        select room_id::text as room_id, unit_id::text as unit_id,
               arrival::text as arrival, departure::text as departure, status
        from staff_bookings_snapshot
        where arrival < ${checkout}::date and departure > ${checkin}::date
      `,
    ]);

    const units = (unitsRows as any[])
      .map((row): Unit | null => {
        const key = `${row.room_id}:${row.unit_id}`;
        const number = ROOM_NUMBER_BY_KEY[key];
        if (!number || !roomAllowed(number, guests)) return null;
        return {
          room_id: String(row.room_id),
          unit_id: String(row.unit_id),
          display_name: String(row.display_name || `Room ${number}`),
          category: String(row.category || ""),
          floor: String(row.floor || ""),
          max_guests: Number(row.max_guests || 0),
        };
      })
      .filter((unit): unit is Unit => Boolean(unit));

    const availability = new Map<string, any>();
    for (const row of availabilityRows as any[]) availability.set(`${row.room_id}:${row.unit_id}:${row.date}`, row);

    const rates = new Map<string, number>();
    for (const row of rateRows as any[]) {
      const value = money(row.price);
      if (value !== null) rates.set(`${row.room_id}:${row.date}`, value);
    }

    const bookings = (bookingRows as any[]).filter((row) => {
      const status = String(row.status || "").toLowerCase();
      return !status.includes("cancel") && !status.includes("deleted");
    });

    function nightFor(unit: Unit, date: string): Night | null {
      const key = `${unit.room_id}:${unit.unit_id}`;
      const row = availability.get(`${key}:${date}`);
      if (row?.available === false) return null;
      const isBooked = bookings.some((booking) =>
        String(booking.room_id) === unit.room_id &&
        String(booking.unit_id) === unit.unit_id &&
        String(booking.arrival) <= date &&
        String(booking.departure) > date,
      );
      if (isBooked) return null;
      const price = money(row?.price) ?? rates.get(`${unit.room_id}:${date}`) ?? null;
      return price ? { date, price } : null;
    }

    const matrix = new Map<string, Night[]>();
    for (const unit of units) {
      const key = `${unit.room_id}:${unit.unit_id}`;
      matrix.set(key, days.map((day) => nightFor(unit, day)).filter((night): night is Night => Boolean(night)));
    }

    const options: Array<{ first: Segment; second: Segment; changeDate: string; originalTotal: number; directTotal: number; splitTotal: number; saving: number; directDiscountPercent: number; splitRewardPercent: number }> = [];

    for (let splitIndex = 1; splitIndex < days.length; splitIndex += 1) {
      const firstDays = days.slice(0, splitIndex);
      const secondDays = days.slice(splitIndex);

      for (const firstUnit of units) {
        const firstKey = `${firstUnit.room_id}:${firstUnit.unit_id}`;
        const firstNights = matrix.get(firstKey) || [];
        if (!firstDays.every((day) => firstNights.some((night) => night.date === day))) continue;

        for (const secondUnit of units) {
          const secondKey = `${secondUnit.room_id}:${secondUnit.unit_id}`;

          // Beds24 can only move a booking between units of the same room category.
          // room_id identifies the category; unit_id identifies the physical room.
          if (secondUnit.room_id !== firstUnit.room_id) continue;
          if (secondUnit.unit_id === firstUnit.unit_id) continue;

          const secondNights = matrix.get(secondKey) || [];
          if (!secondDays.every((day) => secondNights.some((night) => night.date === day))) continue;

          const firstTotal = firstDays.reduce((sum, day) => sum + (firstNights.find((night) => night.date === day)?.price || 0), 0);
          const secondTotal = secondDays.reduce((sum, day) => sum + (secondNights.find((night) => night.date === day)?.price || 0), 0);
          const originalTotal = Math.round((firstTotal + secondTotal) * 100) / 100;
          const directTotal = Math.round(originalTotal * (1 - DIRECT_DISCOUNT_PERCENT / 100) * 100) / 100;
          const splitTotal = Math.round(directTotal * (1 - SPLIT_REWARD_PERCENT / 100) * 100) / 100;

          const firstNumber = ROOM_NUMBER_BY_KEY[firstKey];
          const secondNumber = ROOM_NUMBER_BY_KEY[secondKey];
          options.push({
            first: { roomId: firstUnit.room_id, unitId: firstUnit.unit_id, roomNumber: firstNumber, name: firstUnit.display_name, category: firstUnit.category, floor: firstUnit.floor, checkin, checkout: days[splitIndex], nights: firstDays.length, total: Math.round(firstTotal * 100) / 100 },
            second: { roomId: secondUnit.room_id, unitId: secondUnit.unit_id, roomNumber: secondNumber, name: secondUnit.display_name, category: secondUnit.category, floor: secondUnit.floor, checkin: days[splitIndex], checkout, nights: secondDays.length, total: Math.round(secondTotal * 100) / 100 },
            changeDate: days[splitIndex],
            originalTotal,
            directTotal,
            splitTotal,
            saving: Math.round((originalTotal - splitTotal) * 100) / 100,
            directDiscountPercent: DIRECT_DISCOUNT_PERCENT,
            splitRewardPercent: SPLIT_REWARD_PERCENT,
          });
        }
      }
    }

    options.sort((a, b) => a.splitTotal - b.splitTotal || Math.abs(a.first.nights - a.second.nights) - Math.abs(b.first.nights - b.second.nights));

    return NextResponse.json({
      success: true,
      checkin,
      checkout,
      guests,
      nights: days.length,
      splitStays: options.slice(0, 3),
      summary: { count: options.length, sameCategoryOnly: true },
      generatedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Split-stay search error", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Split-stay search failed" }, { status: 503 });
  }
}
