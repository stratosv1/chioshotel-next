import "server-only";
import { getSql } from "./store";

// Money (price per night / total, deposit, paid) and per-booking change history of the
// control tower. Kept in our database; Beds24 gets the total price and a note line.

export type PriceMode = "night" | "total";

export type BookingMoney = {
  bookingId: string;
  priceMode: PriceMode | null;
  nightPrice: number | null;
  totalPrice: number | null;
  deposit: number | null;
  paid: boolean;
  paidAt: string | null;
};

let ready = false;

export async function ensureLedgerTables() {
  if (ready) return;
  const sql = getSql();
  const rows = (await sql`
    select to_regclass('public.pyrgos_booking_money') as m, to_regclass('public.pyrgos_booking_history') as h,
      to_regclass('public.pyrgos_booking_charges') as c
  `) as { m: string | null; h: string | null; c: string | null }[];
  if (!rows[0]?.m) {
    await sql`create table if not exists public.pyrgos_booking_money (
      booking_id text primary key,
      price_mode text,
      night_price numeric(10,2),
      total_price numeric(10,2),
      deposit numeric(10,2),
      paid boolean not null default false,
      paid_at timestamptz,
      updated_at timestamptz not null default now()
    )`;
  }
  if (!rows[0]?.h) {
    await sql`create table if not exists public.pyrgos_booking_history (
      id bigserial primary key,
      booking_id text not null,
      action text not null,
      detail text,
      beds24 text,
      created_at timestamptz not null default now()
    )`;
    await sql`create index if not exists pyrgos_booking_history_booking on public.pyrgos_booking_history (booking_id, created_at desc)`;
  }
  if (!rows[0]?.c) {
    // Extra charges during the stay (owner, 2026-11-19), on the master booking of a group.
    await sql`create table if not exists public.pyrgos_booking_charges (
      id bigserial primary key,
      booking_id text not null,
      description text not null,
      qty numeric(10,2) not null default 1,
      unit_price numeric(10,2) not null,
      beds24 text,
      created_at timestamptz not null default now(),
      deleted_at timestamptz
    )`;
    await sql`create index if not exists pyrgos_booking_charges_booking on public.pyrgos_booking_charges (booking_id) where deleted_at is null`;
  }
  ready = true;
}

export type BookingCharge = { id: string; bookingId: string; description: string; qty: number; unitPrice: number; amount: number; beds24: string | null; at: string };

export async function getCharges(ids: string[]) {
  await ensureLedgerTables();
  const map = new Map<string, BookingCharge[]>();
  if (!ids.length) return map;
  const rows = (await getSql()`
    select id, booking_id, description, qty, unit_price, beds24, to_char(created_at at time zone 'Europe/Athens', 'DD/MM HH24:MI') as at
    from public.pyrgos_booking_charges where booking_id = any(${ids}::text[]) and deleted_at is null order by created_at
  `) as any[];
  for (const row of rows) {
    const charge: BookingCharge = {
      id: String(row.id),
      bookingId: String(row.booking_id),
      description: row.description,
      qty: Number(row.qty),
      unitPrice: Number(row.unit_price),
      amount: Math.round(Number(row.qty) * Number(row.unit_price) * 100) / 100,
      beds24: row.beds24,
      at: row.at,
    };
    map.set(charge.bookingId, [...(map.get(charge.bookingId) ?? []), charge]);
  }
  return map;
}

export async function insertCharge(bookingId: string, description: string, qty: number, unitPrice: number, beds24: string) {
  await ensureLedgerTables();
  const rows = (await getSql()`
    insert into public.pyrgos_booking_charges (booking_id, description, qty, unit_price, beds24)
    values (${bookingId}, ${description}, ${qty}, ${unitPrice}, ${beds24}) returning id
  `) as any[];
  return String(rows[0].id);
}

export async function findCharge(chargeId: string) {
  await ensureLedgerTables();
  const rows = (await getSql()`
    select booking_id, description, qty, unit_price, beds24 from public.pyrgos_booking_charges
    where id = ${Number(chargeId)} and deleted_at is null
  `) as any[];
  return rows[0] ?? null;
}

export async function deleteCharge(chargeId: string) {
  await ensureLedgerTables();
  const rows = (await getSql()`
    update public.pyrgos_booking_charges set deleted_at = now() where id = ${Number(chargeId)} and deleted_at is null
    returning booking_id, description, qty, unit_price
  `) as any[];
  return rows[0] ?? null;
}

export async function getMoney(ids: string[]) {
  await ensureLedgerTables();
  if (!ids.length) return new Map<string, BookingMoney>();
  const rows = (await getSql()`
    select booking_id, price_mode, night_price, total_price, deposit, paid,
      to_char(paid_at at time zone 'Europe/Athens', 'DD/MM HH24:MI') as paid_at
    from public.pyrgos_booking_money where booking_id = any(${ids}::text[])
  `) as any[];
  return new Map(
    rows.map((row) => [
      String(row.booking_id),
      {
        bookingId: String(row.booking_id),
        priceMode: row.price_mode,
        nightPrice: row.night_price === null ? null : Number(row.night_price),
        totalPrice: row.total_price === null ? null : Number(row.total_price),
        deposit: row.deposit === null ? null : Number(row.deposit),
        paid: Boolean(row.paid),
        paidAt: row.paid_at,
      } satisfies BookingMoney,
    ]),
  );
}

export async function saveMoney(money: Omit<BookingMoney, "paidAt">) {
  await ensureLedgerTables();
  await getSql()`
    insert into public.pyrgos_booking_money (booking_id, price_mode, night_price, total_price, deposit, paid, paid_at)
    values (${money.bookingId}, ${money.priceMode}, ${money.nightPrice}, ${money.totalPrice}, ${money.deposit}, ${money.paid},
      ${money.paid ? new Date().toISOString() : null}::timestamptz)
    on conflict (booking_id) do update set price_mode = excluded.price_mode, night_price = excluded.night_price,
      total_price = excluded.total_price, deposit = excluded.deposit, paid = excluded.paid,
      paid_at = case when excluded.paid and not pyrgos_booking_money.paid then now()
                     when excluded.paid then pyrgos_booking_money.paid_at else null end,
      updated_at = now()
  `;
}

export async function logHistory(bookingId: string, action: string, detail: string, beds24: string) {
  await ensureLedgerTables();
  await getSql()`
    insert into public.pyrgos_booking_history (booking_id, action, detail, beds24)
    values (${bookingId}, ${action}, ${detail || null}, ${beds24 || null})
  `;
}

export async function getHistory(bookingId: string) {
  await ensureLedgerTables();
  return (await getSql()`
    select action, detail, beds24, to_char(created_at at time zone 'Europe/Athens', 'DD/MM/YY HH24:MI') as time
    from public.pyrgos_booking_history where booking_id = ${bookingId} order by created_at desc limit 30
  `) as { action: string; detail: string | null; beds24: string | null; time: string }[];
}

/** Night price ↔ total, whichever was typed last wins (owner, 2026-11-18). */
export function resolvePrice(mode: PriceMode | null, nightPrice: number | null, totalPrice: number | null, nights: number) {
  if (nights <= 0) return { nightPrice, totalPrice };
  if (mode === "night" && nightPrice !== null) return { nightPrice, totalPrice: Math.round(nightPrice * nights * 100) / 100 };
  if (mode === "total" && totalPrice !== null) return { nightPrice: Math.round((totalPrice / nights) * 100) / 100, totalPrice };
  return { nightPrice, totalPrice };
}
