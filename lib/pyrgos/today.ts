import "server-only";
import { getRoomDay, type RoomStay } from "@/lib/crm/room-day";
import { listAttentionBookings } from "@/lib/crm/bookings-board";
import { COMMISSION_RATE, ensureBookingsTable, type PyrgosChannel } from "./bookings";
import { listOpenHolds, type HoldListItem } from "./holds";
import {
  bedsText,
  getExtras,
  getHousekeeping,
  getSql,
  suggestBeds,
  type BedSetup,
  type HousekeepingStatus,
} from "./store";

export type Channel = "Booking" | "Expedia" | "Απευθείας";

export type TodayStay = RoomStay & {
  people: number | null;
  channel: Channel | null;
  price: number | null;
  phone: string | null;
  bedSetup: BedSetup | null;
  bedSuggested: boolean;
  cot: boolean;
  rollaway: boolean;
  other: string;
  bedsText: string;
};

export type TaskKind = "turnover" | "prepare" | "checkout" | "stay";

export type HousekeepingTask = {
  room: number;
  kind: TaskKind;
  status: HousekeepingStatus;
  updatedAt: string | null;
  arrivalTime: string | null;
  people: number | null;
  bedsText: string;
};

export type FeedItem = { time: string; title: string; detail: string; tone: "new" | "cancel" | "change" | "clean" };

export type MissingItem = { bookingIds: string[]; name: string; checkin: string; channel: string; missing: string[] };

export type TodayData = {
  day: string;
  arriving: TodayStay[];
  leaving: TodayStay[];
  staying: TodayStay[];
  free: number[];
  housekeeping: HousekeepingTask[];
  missing: MissingItem[];
  feed: FeedItem[];
  month: { label: string; gross: number; net: number; bookings: number; priced: number };
  // Owner (2026-11-20): next to the month — the season (March–October) and everything from today on.
  season: { label: string; gross: number; net: number; bookings: number; priced: number };
  ahead: { gross: number; net: number; bookings: number; priced: number };
  holds: HoldListItem[];
};

const toNumber = (value: unknown) => {
  const n = Number(String(value ?? "").replace(/[^0-9.\-]/g, ""));
  return String(value ?? "").trim() !== "" && Number.isFinite(n) ? n : null;
};

export const TOTAL_ROOMS = 11;

async function getApt11Day(day: string) {
  await ensureBookingsTable();
  const rows = (await getSql()`
    select p.booking_id, p.first_name, p.last_name, p.adults, p.children,
      to_char(p.checkin, 'YYYY-MM-DD') as checkin, to_char(p.checkout, 'YYYY-MM-DD') as checkout,
      c.arrival_time, c.arrival_details
    from public.pyrgos_bookings p
    left join public.crm_booking_contacts c on c.booking_id = p.booking_id and c.arrival_saved_at is not null
    where p.room_number = 11 and p.status in ('confirmed', 'new')
      and p.checkin <= ${day}::date and p.checkout >= ${day}::date
  `) as any[];
  const toStay = (row: any): RoomStay => ({
    room: 11,
    bookingId: String(row.booking_id),
    name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
    adults: row.adults === null ? null : Number(row.adults),
    children: row.children === null ? null : Number(row.children),
    arrivalTime: row.arrival_time ?? null,
    arrivalDetails: row.arrival_details ?? null,
    checkout: row.checkout,
    sameDayChange: false,
  });
  const arriving = rows.filter((row) => row.checkin === day).map(toStay);
  const leaving = rows.filter((row) => row.checkout === day).map(toStay);
  const staying = rows.filter((row) => row.checkin < day && row.checkout > day).map(toStay);
  if (arriving.length && leaving.length) arriving.forEach((stay) => (stay.sameDayChange = true));
  return { arriving, leaving, staying, occupied: arriving.length + staying.length > 0 };
}

export function channelFromEmail(email: string | null | undefined): Channel {
  return /expedia/i.test(email ?? "") ? "Expedia" : /booking\.com/i.test(email ?? "") ? "Booking" : "Απευθείας";
}

const ORDER: Record<TaskKind, number> = { turnover: 0, prepare: 1, checkout: 2, stay: 3 };

export async function getToday(day: string): Promise<TodayData> {
  const sql = getSql();
  const [inventoryDay, apt11] = await Promise.all([getRoomDay(day), getApt11Day(day)]);
  // Apt 11 is not in the Booking Core inventory (sold only directly), so it comes from pyrgos_bookings.
  const roomDay = {
    ...inventoryDay,
    arriving: [...inventoryDay.arriving, ...apt11.arriving],
    leaving: [...inventoryDay.leaving, ...apt11.leaving],
    staying: [...inventoryDay.staying, ...apt11.staying],
    free: apt11.occupied ? inventoryDay.free : [...inventoryDay.free, 11],
  };
  const all = [...roomDay.arriving, ...roomDay.leaving, ...roomDay.staying];
  const ids = [...new Set(all.map((stay) => stay.bookingId))];
  const month = day.slice(0, 7);
  // Season = March–October. From November on, the coming season is next year's.
  const dayYear = Number(day.slice(0, 4));
  const seasonYear = Number(day.slice(5, 7)) > 10 ? dayYear + 1 : dayYear;
  const seasonFrom = `${seasonYear}-03-01`;
  const seasonTo = `${seasonYear}-11-01`;

  const holdsPromise = listOpenHolds().catch((error) => {
    console.error("[pyrgos] holds failed", error);
    return [] as HoldListItem[];
  });
  const seasonPromise = ensureBookingsTable().then(
    () =>
      sql`select channel, price, commission from public.pyrgos_bookings
        where status in ('confirmed', 'new') and checkin >= ${seasonFrom}::date and checkin < ${seasonTo}::date` as Promise<any[]>,
  );
  const aheadPromise = ensureBookingsTable().then(
    () =>
      sql`select channel, price, commission from public.pyrgos_bookings
        where status in ('confirmed', 'new') and checkin >= ${day}::date` as Promise<any[]>,
  );
  const [bookingRows, extras, housekeeping, attention, monthRows, feedRows] = await Promise.all([
    ids.length
      ? (sql`select booking_id, email, phone, price from public.beds24_bookings where booking_id = any(${ids}::text[])` as Promise<any[]>)
      : Promise.resolve([] as any[]),
    getExtras(ids),
    getHousekeeping(day),
    listAttentionBookings().catch((error) => {
      console.error("[pyrgos] attention list failed", error);
      return [];
    }),
    ensureBookingsTable().then(
      () =>
        sql`select channel, price, commission from public.pyrgos_bookings
          where status in ('confirmed', 'new') and to_char(checkin, 'YYYY-MM') = ${month}` as Promise<any[]>,
    ),
    sql`select booking_id, status, firstname, lastname, room,
          to_char(checkin, 'DD/MM') as checkin, to_char(checkout, 'DD/MM') as checkout, email,
          to_char(updated_at at time zone 'Europe/Athens', 'DD/MM HH24:MI') as time
        from public.beds24_bookings
        where updated_at > now() - interval '3 days'
        order by updated_at desc limit 10` as Promise<any[]>,
  ]);

  const byId = new Map(bookingRows.map((row) => [String(row.booking_id), row]));

  const enrich = (stay: RoomStay): TodayStay => {
    const row = byId.get(stay.bookingId);
    const people = stay.adults === null ? null : stay.adults + (stay.children ?? 0);
    const saved = extras.get(stay.bookingId);
    const suggested = suggestBeds(stay.room, people);
    const bedSetup = saved?.bedSetup ?? suggested;
    const merged = { bedSetup, cot: saved?.cot ?? false, rollaway: saved?.rollaway ?? false, other: saved?.other ?? "" };
    return {
      ...stay,
      people,
      channel: row ? channelFromEmail(row.email) : null,
      price: row ? toNumber(row.price) : null,
      phone: row?.phone ?? null,
      ...merged,
      bedSuggested: !saved?.bedSetup && Boolean(suggested),
      bedsText: bedsText(merged),
    };
  };

  const arriving = roomDay.arriving.map(enrich);
  const leaving = roomDay.leaving.map(enrich);
  const staying = roomDay.staying.map(enrich);

  // Housekeeping tasks: same-day changes first (by arrival time), then rooms that only
  // need beds made for an arrival, then plain check-outs, then stay-overs.
  const arrivingByRoom = new Map(arriving.map((stay) => [stay.room, stay]));
  const leavingRooms = new Set(leaving.map((stay) => stay.room));
  const tasks: HousekeepingTask[] = [];
  const push = (room: number, kind: TaskKind, stay?: TodayStay) => {
    const saved = housekeeping.get(room);
    tasks.push({
      room,
      kind,
      status: saved?.status ?? "pending",
      updatedAt: saved?.time ?? null,
      arrivalTime: stay?.arrivalTime ?? null,
      people: stay?.people ?? null,
      bedsText: stay?.bedsText ?? "",
    });
  };
  for (const room of leavingRooms) {
    const next = arrivingByRoom.get(room);
    push(room, next ? "turnover" : "checkout", next);
  }
  for (const stay of arriving) if (!leavingRooms.has(stay.room)) push(stay.room, "prepare", stay);
  for (const stay of staying) push(stay.room, "stay", stay);
  tasks.sort(
    (a, b) =>
      ORDER[a.kind] - ORDER[b.kind] || (a.arrivalTime ?? "99").localeCompare(b.arrivalTime ?? "99") || a.room - b.room,
  );

  // Missing guest details for arrivals in the next 14 days (from the CRM board).
  const limit = new Date(Date.parse(`${day}T12:00:00Z`) + 14 * 86_400_000).toISOString().slice(0, 10);
  const peopleUnknown = new Set(arriving.filter((stay) => stay.people === null).map((stay) => stay.bookingId));
  const missing: MissingItem[] = attention
    .filter((booking) => booking.checkin >= day && booking.checkin <= limit)
    .map((booking) => ({
      bookingIds: booking.bookingIds,
      name: booking.name || "Χωρίς όνομα",
      checkin: booking.checkin,
      channel: booking.channel,
      missing: [
        booking.emailState !== "real" ? "προσωπικό email" : "",
        !booking.arrivalTime && !booking.arrivalClosed ? "ώρα άφιξης" : "",
        !booking.phone ? "κινητό" : "",
        booking.bookingIds.some((id) => peopleUnknown.has(id)) ? "άτομα" : "",
      ].filter(Boolean),
    }))
    .filter((item) => item.missing.length > 0)
    .slice(0, 8);

  const revenue = (rows: any[]) => ({
    gross: Math.round(rows.reduce((sum, row) => sum + (toNumber(row.price) ?? 0), 0)),
    net: Math.round(rows.reduce((sum, row) => {
      const price = toNumber(row.price) ?? 0;
      const commission = toNumber(row.commission) ?? price * (COMMISSION_RATE[row.channel as PyrgosChannel] ?? 0);
      return sum + price - commission;
    }, 0)),
    bookings: rows.length,
    priced: rows.filter((row) => toNumber(row.price)).length,
  });
  const [seasonRows, aheadRows] = await Promise.all([seasonPromise, aheadPromise]);

  const feed: FeedItem[] = feedRows.map((row) => {
    const cancelled = /cancel/i.test(String(row.status ?? ""));
    const name = `${row.firstname ?? ""} ${row.lastname ?? ""}`.trim() || "Χωρίς όνομα";
    return {
      time: row.time,
      title: cancelled ? `Ακύρωση · ${channelFromEmail(row.email)}` : `Κράτηση / αλλαγή · ${channelFromEmail(row.email)}`,
      detail: `${name} · ${row.room ?? ""} · ${row.checkin}–${row.checkout}`,
      tone: cancelled ? "cancel" : "new",
    };
  });

  const monthLabel = new Intl.DateTimeFormat("el-GR", { month: "long", timeZone: "UTC" }).format(new Date(`${day}T12:00:00Z`));

  return {
    day,
    arriving,
    leaving,
    staying,
    free: roomDay.free,
    housekeeping: tasks,
    missing,
    feed,
    holds: await holdsPromise,
    month: { label: monthLabel, ...revenue(monthRows) },
    season: { label: `03–10/${seasonYear}`, ...revenue(seasonRows) },
    ahead: revenue(aheadRows),
  };
}
