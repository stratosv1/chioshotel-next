import "server-only";
import { neon } from "@neondatabase/serverless";

// Πύργος ελέγχου (staff control tower), step 1 (2026-11-18).
// Two small tables of our own; bookings themselves stay in beds24_bookings /
// booking_core (Beds24 is written through its API, availability is never touched).

export type HousekeepingStatus = "pending" | "cleaning" | "done";

export type BedSetup = "double" | "twin" | "double_single" | "double_two_singles";

export type BookingExtras = {
  bookingId: string;
  bedSetup: BedSetup | null;
  cot: boolean;
  rollaway: boolean;
  other: string;
};

export function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

let ready = false;

/** Creates the tables the first time they are missing; a read-only check otherwise. */
export async function ensurePyrgosTables() {
  if (ready) return;
  const sql = getSql();
  const rows = (await sql`
    select to_regclass('public.pyrgos_housekeeping') as hk, to_regclass('public.pyrgos_booking_extras') as ex
  `) as { hk: string | null; ex: string | null }[];
  if (!rows[0]?.hk) {
    await sql`create table if not exists public.pyrgos_housekeeping (
      day date not null,
      room int not null,
      status text not null,
      updated_at timestamptz not null default now(),
      primary key (day, room)
    )`;
  }
  if (!rows[0]?.ex) {
    await sql`create table if not exists public.pyrgos_booking_extras (
      booking_id text primary key,
      bed_setup text,
      cot boolean not null default false,
      rollaway boolean not null default false,
      other text,
      updated_at timestamptz not null default now()
    )`;
  }
  ready = true;
}

export async function getHousekeeping(day: string) {
  await ensurePyrgosTables();
  const rows = (await getSql()`
    select room, status, to_char(updated_at at time zone 'Europe/Athens', 'HH24:MI') as time
    from public.pyrgos_housekeeping where day = ${day}::date
  `) as { room: number; status: HousekeepingStatus; time: string }[];
  return new Map(rows.map((row) => [Number(row.room), { status: row.status, time: row.time }]));
}

export async function setHousekeeping(day: string, room: number, status: HousekeepingStatus) {
  await ensurePyrgosTables();
  await getSql()`
    insert into public.pyrgos_housekeeping (day, room, status) values (${day}::date, ${room}, ${status})
    on conflict (day, room) do update set status = excluded.status, updated_at = now()
  `;
}

export async function getExtras(bookingIds: string[]) {
  await ensurePyrgosTables();
  if (!bookingIds.length) return new Map<string, BookingExtras>();
  const rows = (await getSql()`
    select booking_id, bed_setup, cot, rollaway, other from public.pyrgos_booking_extras
    where booking_id = any(${bookingIds}::text[])
  `) as any[];
  return new Map(
    rows.map((row) => [
      String(row.booking_id),
      { bookingId: String(row.booking_id), bedSetup: row.bed_setup, cot: Boolean(row.cot), rollaway: Boolean(row.rollaway), other: row.other ?? "" },
    ]),
  );
}

export async function saveExtras(extras: BookingExtras) {
  await ensurePyrgosTables();
  await getSql()`
    insert into public.pyrgos_booking_extras (booking_id, bed_setup, cot, rollaway, other)
    values (${extras.bookingId}, ${extras.bedSetup}, ${extras.cot}, ${extras.rollaway}, ${extras.other || null})
    on conflict (booking_id) do update set bed_setup = excluded.bed_setup, cot = excluded.cot,
      rollaway = excluded.rollaway, other = excluded.other, updated_at = now()
  `;
}

// ---------- Beds ----------

export const BED_LABELS: Record<BedSetup, string> = {
  double: "διπλό",
  twin: "2 μονά χωριστά",
  double_single: "διπλό + 1 μονό",
  double_two_singles: "διπλό + 2 μονά",
};

/** Family apartments 8, 9, 10 (and Apt 11) have a double plus singles; the other rooms a double bed. */
export function suggestBeds(room: number, people: number | null): BedSetup | null {
  if (people === null) return null;
  if (room >= 8) return people >= 4 ? "double_two_singles" : people === 3 ? "double_single" : "double";
  return "double";
}

export function bedsText(extras: Pick<BookingExtras, "bedSetup" | "cot" | "rollaway" | "other">) {
  return [
    extras.bedSetup ? BED_LABELS[extras.bedSetup] : "",
    extras.cot ? "κούνια" : "",
    extras.rollaway ? "ράντζο" : "",
    extras.other?.trim() ?? "",
  ]
    .filter(Boolean)
    .join(" + ");
}
