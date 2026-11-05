import "server-only";
import { neon } from "@neondatabase/serverless";
import { fetchBeds24BookingById } from "@/lib/beds24/api-v2-booking";
import { arrivalFromSummary } from "@/lib/crm/bookings-board";

export type RoomStay = {
  room: number;
  bookingId: string;
  name: string;
  adults: number | null;
  children: number | null;
  arrivalTime: string | null;
  arrivalDetails: string | null;
  checkout: string | null;
  sameDayChange: boolean;
};

export type RoomDay = {
  day: string;
  arriving: RoomStay[];
  leaving: RoomStay[];
  staying: RoomStay[];
  free: number[];
};

const ROOM_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const LIVE_STATUSES = ["confirmed", "new", "request"];
// Linked rooms of one group booking are missing from beds24_bookings, so their guests come from Beds24.
const MAX_LIVE_LOOKUPS = 12;

const toCount = (value: unknown) => {
  const number = Number(String(value ?? "").replace(/^'/, ""));
  return String(value ?? "").trim() !== "" && Number.isFinite(number) ? number : null;
};
const fullName = (first: unknown, last: unknown) => `${first ?? ""} ${last ?? ""}`.trim();
const previousDay = (day: string) => new Date(Date.parse(day) - 86_400_000).toISOString().slice(0, 10);

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

/** Rooms come from the inventory, which holds every room of a group booking. */
export async function getRoomDay(day: string): Promise<RoomDay> {
  const sql = getSql();
  const rows = (await sql`
    select i.room_number, i.booking_id, i.stay_date::text as stay_date, b.status, b.firstname, b.lastname,
      to_char(b.checkout, 'YYYY-MM-DD') as checkout,
      coalesce(b.raw_json::jsonb #>> '{api_v2_lookup,num_adult}', b.raw_json::jsonb #>> '{initial_csv,Adults}', b.raw_json::jsonb #>> '{csv,Adults}') as adults,
      coalesce(b.raw_json::jsonb #>> '{api_v2_lookup,num_child}', b.raw_json::jsonb #>> '{initial_csv,Children}', b.raw_json::jsonb #>> '{csv,Children}') as children
    from booking_core.inventory i
    left join public.beds24_bookings b on b.booking_id = i.booking_id
    where i.booking_id is not null and i.stay_date in (${day}::date, ${previousDay(day)}::date)
    order by i.room_number
  `) as any[];

  const live = rows.filter((row) => !row.status || LIVE_STATUSES.includes(String(row.status).toLowerCase()));
  const key = (row: any) => `${row.room_number}:${row.booking_id}`;
  const tonight = new Map(live.filter((row) => row.stay_date === day).map((row) => [key(row), row]));
  const lastNight = new Map(live.filter((row) => row.stay_date !== day).map((row) => [key(row), row]));

  const arrivals = [...tonight].filter(([id]) => !lastNight.has(id)).map(([, row]) => row);
  const departures = [...lastNight].filter(([id]) => !tonight.has(id)).map(([, row]) => row);
  const stays = [...tonight].filter(([id]) => lastNight.has(id)).map(([, row]) => row);

  const incomplete = [...new Set([...arrivals, ...departures, ...stays].filter((row) => !row.status || toCount(row.adults) === null).map((row) => row.booking_id as string))];
  const lookups = new Map(await Promise.all(incomplete.slice(0, MAX_LIVE_LOOKUPS).map(async (id) => [id, (await fetchBeds24BookingById(id)).booking] as const)));

  // A linked room shares the arrival time saved on the main booking of its group.
  const masterOf = (id: string) => {
    const master = String(lookups.get(id)?.masterId ?? "");
    return master && master !== "0" ? master : id;
  };
  const arrivalIds = [...new Set(arrivals.flatMap((row) => [row.booking_id as string, masterOf(row.booking_id)]))];
  const [contacts, messages] = arrivalIds.length ? await Promise.all([
    sql`select booking_id, arrival_time, arrival_details from public.crm_booking_contacts
      where booking_id = any(${arrivalIds}::text[]) and arrival_saved_at is not null`,
    sql`select booking_ids, arrival_time, summary from public.crm_guest_messages
      where booking_ids && ${arrivalIds}::text[] order by sent_at desc`,
  ]) as any[][] : [[], []];

  const arrivalFor = (id: string) => {
    const ids = [id, masterOf(id)];
    const saved = contacts.find((row) => ids.includes(row.booking_id));
    if (saved) return { time: saved.arrival_time as string | null, details: saved.arrival_details as string | null };
    const message = messages.find((row) => row.booking_ids.some((item: string) => ids.includes(item)) && (row.arrival_time || arrivalFromSummary(row.summary)));
    return { time: message ? message.arrival_time || arrivalFromSummary(message.summary) : null, details: null };
  };

  const leavingRooms = new Set(departures.map((row) => row.room_number as number));
  const arrivingRooms = new Set(arrivals.map((row) => row.room_number as number));
  const toStay = (row: any, withArrival = false): RoomStay => {
    const api = lookups.get(row.booking_id);
    const arrival = withArrival ? arrivalFor(row.booking_id) : { time: null, details: null };
    return {
      room: row.room_number,
      bookingId: row.booking_id,
      name: fullName(row.firstname, row.lastname) || fullName(api?.firstName, api?.lastName),
      adults: toCount(row.adults) ?? toCount(api?.numAdult),
      children: toCount(row.children) ?? toCount(api?.numChild),
      arrivalTime: arrival.time,
      arrivalDetails: arrival.details,
      checkout: row.checkout ?? (String(api?.departure ?? "").slice(0, 10) || null),
      sameDayChange: leavingRooms.has(row.room_number) && arrivingRooms.has(row.room_number),
    };
  };

  const byTime = (a: RoomStay, b: RoomStay) => (a.arrivalTime ?? "99").localeCompare(b.arrivalTime ?? "99") || a.room - b.room;
  const occupied = new Set([...tonight.values()].map((row) => row.room_number as number));
  return {
    day,
    arriving: arrivals.map((row) => toStay(row, true)).sort(byTime),
    leaving: departures.map((row) => toStay(row)),
    staying: stays.map((row) => toStay(row)),
    free: ROOM_NUMBERS.filter((room) => !occupied.has(room)),
  };
}
