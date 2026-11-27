import "server-only";
import { ensureBookingsTable } from "./bookings";
import { ensureLedgerTables, getCharges, getHistory, getMoney, type BookingCharge } from "./ledger";
import { bedsText, getExtras, getSql } from "./store";
import { getHolds, type Hold } from "./holds";
import { listPlanOffers } from "./plan-offers";

export type PlanBooking = {
  id: string;
  masterId: string | null;
  status: string;
  channel: string;
  room: number | null;
  checkin: string;
  checkout: string;
  nights: number;
  adults: number | null;
  children: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  beds24Price: number | null;
  notes: string;
  beds: string;
  bedSetup: string | null;
  cot: boolean;
  rollaway: boolean;
  bedOther: string;
  breakfast: boolean;
  guestNote: string;
  priceMode: "night" | "total" | null;
  nightPrice: number | null;
  totalPrice: number | null;
  deposit: number | null;
  paid: boolean;
  paidAt: string | null;
  charges: BookingCharge[];
  chargesTotal: number;
  hold: Hold | null;
};

export type PlanCell = { room: number; day: string; price: number | null; closed: boolean };

const num = (v: unknown) => (v === null || v === undefined || v === "" ? null : Number(v));

function mapRow(row: any, extras: Map<string, any>, money: Map<string, any>, charges: Map<string, BookingCharge[]>, holds: Map<string, Hold>): PlanBooking {
  const id = String(row.booking_id);
  const ex = extras.get(id);
  const m = money.get(id);
  return {
    id,
    masterId: row.master_id && row.master_id !== id ? String(row.master_id) : null,
    status: row.status,
    channel: row.channel,
    room: row.room_number === null ? null : Number(row.room_number),
    checkin: row.checkin,
    checkout: row.checkout,
    nights: Number(row.nights),
    adults: num(row.adults),
    children: num(row.children),
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    country: row.country ?? "",
    beds24Price: num(row.price),
    notes: row.notes ?? "",
    beds: ex ? bedsText(ex) : "",
    bedSetup: ex?.bedSetup ?? null,
    cot: ex?.cot ?? false,
    rollaway: ex?.rollaway ?? false,
    bedOther: ex?.other ?? "",
    breakfast: ex?.breakfast ?? false,
    guestNote: ex?.guestNote ?? "",
    priceMode: m?.priceMode ?? null,
    nightPrice: m?.nightPrice ?? null,
    totalPrice: m?.totalPrice ?? null,
    deposit: m?.deposit ?? null,
    paid: m?.paid ?? false,
    paidAt: m?.paidAt ?? null,
    charges: charges.get(id) ?? [],
    chargesTotal: Math.round((charges.get(id) ?? []).reduce((sum, c) => sum + c.amount, 0) * 100) / 100,
    hold: holds.get(id) ?? null,
  };
}

const COLUMNS = `booking_id, master_id, status, channel, room_number, to_char(checkin, 'YYYY-MM-DD') as checkin,
  to_char(checkout, 'YYYY-MM-DD') as checkout, nights, adults, children, first_name, last_name, email, phone, country,
  price, notes`;

async function enrich(rows: any[]) {
  const ids = rows.map((row) => String(row.booking_id));
  const [extras, money, charges, holds] = await Promise.all([getExtras(ids), getMoney(ids), getCharges(ids), getHolds(ids)]);
  return rows.map((row) => mapRow(row, extras, money, charges, holds));
}

export async function getPlan(from: string, to: string) {
  await Promise.all([ensureBookingsTable(), ensureLedgerTables()]);
  const sql = getSql();
  const [rows, cells] = await Promise.all([
    sql.query(
      `select ${COLUMNS} from public.pyrgos_bookings
       where status in ('confirmed', 'new', 'request', 'black') and checkin < $2::date and checkout > $1::date
       order by checkin`,
      [from, to],
    ) as Promise<any[]>,
    sql`select room_number, to_char(stay_date, 'YYYY-MM-DD') as day, base_price, reason, booking_id
        from booking_core.inventory where stay_date >= ${from}::date and stay_date < ${to}::date` as Promise<any[]>,
  ]);
  const plan: PlanCell[] = cells
    .filter((cell) => !cell.booking_id)
    .map((cell) => ({
      room: Number(cell.room_number),
      day: cell.day,
      // Closed nights keep their Beds24 rate too: the owner closes rooms to enter bookings himself.
      price: num(cell.base_price),
      closed: cell.reason === "CLOSED",
    }));
  // Offers are extra: if their table fails, the plan still loads.
  const offers = await listPlanOffers(from, to).catch((error) => {
    console.error("[pyrgos] plan offers failed", error);
    return [];
  });
  return { bookings: await enrich(rows), cells: plan, offers };
}

export async function getBookingDetail(id: string) {
  await Promise.all([ensureBookingsTable(), ensureLedgerTables()]);
  const sql = getSql();
  const rows = (await sql.query(`select ${COLUMNS} from public.pyrgos_bookings where booking_id = $1`, [id])) as any[];
  if (!rows.length) return null;
  const [booking] = await enrich(rows);
  const [history, group] = await Promise.all([
    getHistory(id),
    sql.query(
      `select booking_id, room_number from public.pyrgos_bookings
       where status in ('confirmed', 'new', 'request') and (master_id = $1 or booking_id = $1 or ($2::text is not null and (master_id = $2 or booking_id = $2)))
       order by room_number`,
      [id, booking.masterId],
    ) as Promise<any[]>,
  ]);
  return { booking, history, group: group.map((g) => ({ id: String(g.booking_id), room: g.room_number })) };
}

export async function searchBookings(query: string) {
  await ensureBookingsTable();
  const q = `%${query.trim().toLowerCase()}%`;
  const digits = query.replace(/\D/g, "");
  const rows = (await getSql().query(
    `select ${COLUMNS} from public.pyrgos_bookings
     where status in ('confirmed', 'new', 'request')
       and (lower(coalesce(first_name, '') || ' ' || coalesce(last_name, '')) like $1
         or lower(coalesce(email, '')) like $1
         or booking_id = $2
         or ($3 <> '' and length($3) >= 6 and regexp_replace(coalesce(phone, ''), '[^0-9]', '', 'g') like '%' || $3 || '%'))
     order by checkin desc limit 20`,
    [q, query.trim(), digits],
  )) as any[];
  return enrich(rows);
}

/**
 * Free rooms (no live booking) for every night of the stay. Closed rooms count as taken unless
 * `includeClosed`: staff may book a room the owner closed in Beds24 (owner, 2026-11-19).
 */
export async function freeRooms(from: string, to: string, ignoreId?: string, options: { includeClosed?: boolean } = {}) {
  await ensureBookingsTable();
  const sql = getSql();
  const [busy, closed] = await Promise.all([
    sql.query(
      `select distinct room_number from public.pyrgos_bookings
       where status in ('confirmed', 'new', 'request', 'black') and room_number is not null
         and checkin < $2::date and checkout > $1::date and ($3::text is null or booking_id <> $3)`,
      [from, to, ignoreId ?? null],
    ) as Promise<any[]>,
    sql`select distinct room_number from booking_core.inventory
        where stay_date >= ${from}::date and stay_date < ${to}::date and booking_id is null and reason = 'CLOSED'` as Promise<any[]>,
  ]);
  const taken = new Set([...busy, ...(options.includeClosed ? [] : closed)].map((row) => Number(row.room_number)));
  return Array.from({ length: 11 }, (_, i) => i + 1).filter((room) => !taken.has(room));
}

/** Rooms with at least one night closed in Beds24 (no booking) during the stay. */
export async function closedRooms(from: string, to: string) {
  const rows = (await getSql()`
    select distinct room_number from booking_core.inventory
    where stay_date >= ${from}::date and stay_date < ${to}::date and booking_id is null and reason = 'CLOSED'
  `) as any[];
  return rows.map((row) => Number(row.room_number)).sort((x, y) => x - y);
}

/** Suggested night price from the Beds24 rates in Booking Core (average of the stay's nights). */
export async function suggestedNightPrice(room: number, from: string, to: string) {
  const rows = (await getSql()`
    select avg(base_price) as price from booking_core.inventory
    where room_number = ${room} and stay_date >= ${from}::date and stay_date < ${to}::date and booking_id is null
      and reason in ('PRICE_OK', 'CLOSED')
  `) as any[];
  const price = num(rows[0]?.price);
  return price === null ? null : Math.round(price * 100) / 100;
}
