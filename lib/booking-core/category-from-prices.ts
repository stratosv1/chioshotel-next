import { unstable_cache } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { BOOKING_CORE_DEALS_CACHE_TAG } from "@/lib/booking-core/cache-tags";

/**
 * Lowest direct nightly price ("from €X / night") per public room category,
 * read from Booking Core. Used by the rooms category page.
 *
 * - 2 guests, the cheapest available night in the next 300 days
 * - includes the 1–2 night direct discount, so it matches what a 1-night
 *   direct quote would show
 * - cached and invalidated together with Live Deals whenever Booking Core
 *   syncs; returns null on any error so the page simply hides prices
 */

export type RoomCategoryId = "economy-double" | "ground-floor" | "first-floor" | "family-apartments";

export type CategoryFromPrices = Partial<Record<RoomCategoryId, number>>;

// Room numbers per category, matching the rooms page cards and FAQ.
export const ROOM_CATEGORY_ROOMS: Record<RoomCategoryId, number[]> = {
  "economy-double": [2, 6],
  "ground-floor": [5, 7],
  "first-floor": [1, 3, 4],
  "family-apartments": [8, 9, 10],
};

const LOOKAHEAD_DAYS = 300;
const PRICE_GUESTS = 2;
// "From" prices are indicative, so they read the stored inventory directly instead of
// booking_core.nightly_quotes, which returns nothing once the last sync is older than
// max_inventory_age_minutes. The Apps Script only pushes when Beds24 changes, so in quiet
// periods (winter) that gate hid prices for hours although the data was still current.
// Bookings and live availability keep the strict freshness check. This guard only hides
// prices if no sync at all succeeded for a long time (e.g. the script stopped running).
const MAX_SYNC_AGE_HOURS = 72;

// Throws on failure so an error is never cached; the exported wrapper turns it into null.
async function loadCategoryFromPrices(): Promise<CategoryFromPrices> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing");

  const sql = neon(databaseUrl);
  const rows = (await sql`
    with cfg as (
      select coalesce(
        (select numeric_value from booking_core.settings where setting_key = 'los_total_discount_1_2_nights'),
        (select numeric_value from booking_core.settings where setting_key = 'direct_discount_percent'),
        10
      ) as discount
    ),
    last_ok as (
      select max(completed_at) as completed_at
      from booking_core.sync_runs
      where status = 'ok'
    )
    select i.room_number,
           round(min(i.base_price + gp.supplement_per_night) * (1 - max(cfg.discount) / 100)) as from_price
    from booking_core.inventory i
    join booking_core.rooms r
      on r.room_number = i.room_number
     and r.is_active = true
     and ${PRICE_GUESTS}::integer between 1 and r.max_guests
    join booking_core.guest_pricing gp
      on gp.room_number = r.room_number
     and gp.guest_count = ${PRICE_GUESTS}::integer
     and gp.allowed = true
    cross join cfg
    cross join last_ok
    where i.stay_date >= (now() at time zone 'Europe/Athens')::date + 1
      and i.stay_date < (now() at time zone 'Europe/Athens')::date + 1 + ${LOOKAHEAD_DAYS}::integer
      and i.available = true
      and i.base_price is not null
      and i.base_price + gp.supplement_per_night > 0
      and last_ok.completed_at >= now() - (${MAX_SYNC_AGE_HOURS}::integer * interval '1 hour')
    group by i.room_number
  `) as Array<{ room_number: number | string; from_price: number | string | null }>;

  const byRoom = new Map<number, number>();
  for (const row of rows) {
    const price = Number(row.from_price);
    if (Number.isFinite(price) && price > 0) byRoom.set(Number(row.room_number), price);
  }

  const result: CategoryFromPrices = {};
  for (const [categoryId, roomNumbers] of Object.entries(ROOM_CATEGORY_ROOMS) as Array<[RoomCategoryId, number[]]>) {
    const prices = roomNumbers.map((room) => byRoom.get(room)).filter((value): value is number => typeof value === "number");
    if (prices.length) result[categoryId] = Math.min(...prices);
  }

  if (!Object.keys(result).length) throw new Error("No available priced nights");
  return result;
}

const cachedCategoryFromPrices = unstable_cache(loadCategoryFromPrices, ["rooms-category-from-prices-v1"], {
  revalidate: 6 * 60 * 60,
  tags: [BOOKING_CORE_DEALS_CACHE_TAG],
});

export async function getCategoryFromPrices(): Promise<CategoryFromPrices | null> {
  try {
    return await cachedCategoryFromPrices();
  } catch (error) {
    console.error("Rooms page could not load category prices from Booking Core", error);
    return null;
  }
}
