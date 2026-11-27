import "server-only";
import { getSql } from "./store";
import { ensureBookingsTable } from "./bookings";
import { OFFER_ROOMS, type PlanOffer } from "./offer-types";

// Πύργος ελέγχου · Προσφορές από το πλάνο (owner, 2026-11-27).
// The owner marks free nights of a room as an offer; it shows on the deals pages until
// the stay has passed or any of its nights gets booked. Guests ask for it on WhatsApp.
// Nothing here touches Beds24 (no prices, no availability).

let ready = false;

async function ensureOffersTable() {
  if (ready) return;
  const sql = getSql();
  const rows = (await sql`select to_regclass('public.pyrgos_plan_offers') as t`) as { t: string | null }[];
  if (!rows[0]?.t) {
    await sql`create table if not exists public.pyrgos_plan_offers (
      id bigserial primary key,
      room int not null,
      date_from date not null,
      date_to date not null,
      discount int not null default 10,
      code text not null default 'DEAL10',
      active boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )`;
  }
  ready = true;
}

export type OfferInput = { room: number; from: string; to: string; discount: number; code: string; active: boolean };

const isDay = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Validates a staff form body; returns an error message (Greek) or the clean input. */
export function parseOfferInput(body: any): OfferInput | string {
  const room = Number(body?.room);
  if (!(OFFER_ROOMS as readonly number[]).includes(room)) return "Διάλεξε δωμάτιο 1–10.";
  if (!isDay(body?.from) || !isDay(body?.to)) return "Βάλε ημερομηνίες.";
  if (body.to <= body.from) return "Η αναχώρηση πρέπει να είναι μετά την άφιξη.";
  if ((Date.parse(body.to) - Date.parse(body.from)) / 86_400_000 > 60) return "Μέγιστο 60 νύχτες.";
  const discount = Math.round(Number(body?.discount));
  if (!Number.isFinite(discount) || discount < 1 || discount > 70) return "Η έκπτωση πρέπει να είναι 1–70%.";
  const code = String(body?.code ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 20);
  if (!code) return "Γράψε κωδικό.";
  return { room, from: body.from, to: body.to, discount, code, active: body?.active !== false };
}

const BOOKED_SQL = `exists (
  select 1 from public.pyrgos_bookings b
  where b.room_number = o.room and b.status in ('confirmed', 'new', 'request', 'black')
    and b.checkin < o.date_to and b.checkout > greatest(o.date_from, (now() at time zone 'Europe/Athens')::date)
)`;

function mapRow(row: any): PlanOffer {
  return {
    id: Number(row.id),
    room: Number(row.room),
    from: row.date_from,
    to: row.date_to,
    discount: Number(row.discount),
    code: row.code,
    active: Boolean(row.active),
    booked: Boolean(row.booked),
  };
}

/** Offers overlapping the plan window (for the staff plan). */
export async function listPlanOffers(from: string, to: string): Promise<PlanOffer[]> {
  await Promise.all([ensureOffersTable(), ensureBookingsTable()]);
  const rows = (await getSql().query(
    `select o.id, o.room, to_char(o.date_from, 'YYYY-MM-DD') as date_from, to_char(o.date_to, 'YYYY-MM-DD') as date_to,
       o.discount, o.code, o.active, ${BOOKED_SQL} as booked
     from public.pyrgos_plan_offers o
     where o.date_from < $2::date and o.date_to > $1::date
     order by o.room, o.date_from`,
    [from, to],
  )) as any[];
  return rows.map(mapRow);
}

export async function addPlanOffer(input: OfferInput) {
  await ensureOffersTable();
  const rows = (await getSql()`
    insert into public.pyrgos_plan_offers (room, date_from, date_to, discount, code, active)
    values (${input.room}, ${input.from}::date, ${input.to}::date, ${input.discount}, ${input.code}, ${input.active})
    returning id`) as { id: string }[];
  return Number(rows[0].id);
}

export async function updatePlanOffer(id: number, input: OfferInput) {
  await ensureOffersTable();
  await getSql()`
    update public.pyrgos_plan_offers set room = ${input.room}, date_from = ${input.from}::date, date_to = ${input.to}::date,
      discount = ${input.discount}, code = ${input.code}, active = ${input.active}, updated_at = now()
    where id = ${id}`;
}

export async function deletePlanOffer(id: number) {
  await ensureOffersTable();
  await getSql()`delete from public.pyrgos_plan_offers where id = ${id}`;
}

export type LivePlanOffer = {
  id: number;
  room: number;
  /** First night still on offer (today at the earliest). */
  from: string;
  to: string;
  nights: number;
  discount: number;
  code: string;
  /** Average Beds24 night rate for those nights, if known. */
  nightPrice: number | null;
};

/** Offers for the public deals pages: active, not yet passed, and with every night still free. */
export async function listLivePlanOffers(): Promise<LivePlanOffer[]> {
  await Promise.all([ensureOffersTable(), ensureBookingsTable()]);
  const rows = (await getSql().query(
    `with live as (
       select o.id, o.room, greatest(o.date_from, (now() at time zone 'Europe/Athens')::date) as d_from, o.date_to as d_to,
              o.discount, o.code
       from public.pyrgos_plan_offers o
       where o.active and o.date_to > (now() at time zone 'Europe/Athens')::date + 0 and not ${BOOKED_SQL}
     )
     select l.id, l.room, to_char(l.d_from, 'YYYY-MM-DD') as date_from, to_char(l.d_to, 'YYYY-MM-DD') as date_to,
            (l.d_to - l.d_from) as nights, l.discount, l.code,
            (select avg(i.base_price) from booking_core.inventory i
              where i.room_number = l.room and i.stay_date >= l.d_from and i.stay_date < l.d_to and i.booking_id is null) as price,
            (select count(*) from booking_core.inventory i
              where i.room_number = l.room and i.stay_date >= l.d_from and i.stay_date < l.d_to and i.booking_id is not null) as taken
     from live l
     where l.d_to > l.d_from
     order by l.d_from, l.room
     limit 24`,
    [],
  )) as any[];
  return rows
    .filter((row) => Number(row.taken) === 0)
    .map((row) => ({
      id: Number(row.id),
      room: Number(row.room),
      from: row.date_from,
      to: row.date_to,
      nights: Number(row.nights),
      discount: Number(row.discount),
      code: row.code,
      nightPrice: row.price === null || row.price === undefined ? null : Math.round(Number(row.price)),
    }));
}
