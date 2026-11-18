import "server-only";
import { getSql } from "./store";

// Ενιαία βάση κρατήσεων του πύργου ελέγχου (2026-11-18).
// One clean row per Beds24 booking. Filled (1) from public.beds24_bookings (old CSV
// export + webhook rows, no prices), (2) month by month from the Beds24 API v2 for
// prices/commission/guests, and (3) kept current by the Beds24 booking webhook.
// Writes happen only when a row really changes (Neon charges for writes).

export type PyrgosChannel = "Booking" | "Expedia" | "Airbnb" | "Alexandria" | "Απευθείας";

// Owner, 2026-11-18: Booking.com 15%, Expedia 20% (used when Beds24 has no commission).
export const COMMISSION_RATE: Record<PyrgosChannel, number> = {
  Booking: 0.15,
  Expedia: 0.2,
  Airbnb: 0,
  Alexandria: 0,
  Απευθείας: 0,
};

// Beds24 room/unit ids → our room numbers (same mapping as /staff/booker).
const UNIT_TO_ROOM: Record<string, number> = {
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

const text = (value: unknown) => String(value ?? "").trim();
const num = (value: unknown) => {
  const n = Number(text(value).replace(/^'/, "").replace(/[^0-9.\-]/g, ""));
  return text(value) !== "" && Number.isFinite(n) ? n : null;
};

export function channelFrom(referer: string | null | undefined, email?: string | null): PyrgosChannel {
  const ref = text(referer).toLowerCase();
  if (ref.includes("booking.com")) return "Booking";
  if (ref.includes("expedia") || ref.includes("hotels.com")) return "Expedia";
  if (ref.includes("airbnb")) return "Airbnb";
  if (ref.includes("andreas") || ref.includes("alexandria")) return "Alexandria";
  if (ref) return "Απευθείας";
  const mail = text(email).toLowerCase();
  if (mail.includes("booking.com")) return "Booking";
  if (mail.includes("expedia")) return "Expedia";
  return "Απευθείας";
}

let ready = false;

export async function ensureBookingsTable() {
  if (ready) return;
  const sql = getSql();
  const rows = (await sql`select to_regclass('public.pyrgos_bookings') as t`) as { t: string | null }[];
  if (!rows[0]?.t) {
    await sql`create table if not exists public.pyrgos_bookings (
      booking_id text primary key,
      master_id text,
      status text not null,
      channel text not null,
      referer text,
      room_number int,
      room_type text,
      checkin date not null,
      checkout date not null,
      nights int not null,
      adults int,
      children int,
      first_name text,
      last_name text,
      email text,
      phone text,
      country text,
      language text,
      price numeric(10,2),
      commission numeric(10,2),
      booked_at timestamptz,
      price_source text,
      updated_at timestamptz not null default now()
    )`;
    await sql`create index if not exists pyrgos_bookings_checkin on public.pyrgos_bookings (checkin)`;
  }
  // Added 2026-11-18 for the plan: Beds24 notes / guest comments shown on the booking bar.
  const cols = (await sql`select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'pyrgos_bookings' and column_name = 'notes'`) as unknown[];
  if (!cols.length) await sql`alter table public.pyrgos_bookings add column if not exists notes text`;
  ready = true;
}

/** Copies 2025–2026 bookings from public.beds24_bookings (keeps any price already filled from Beds24). */
export async function importFromLocal(fromDate = "2025-01-01", toDate = "2026-12-31") {
  await ensureBookingsTable();
  const rows = (await getSql()`
    with src as (
      select coalesce(b.raw_json->'initial_csv', b.raw_json->'csv') as csv,
        b.raw_json->'api_v2_lookup' as api,
        b.*
      from public.beds24_bookings b
      where b.checkin between ${fromDate}::date and ${toDate}::date and b.checkout is not null
    ), norm as (
      select booking_id,
        nullif(nullif(csv->>'Master Id', ''), '0') as master_id,
        lower(coalesce(status, 'unknown')) as status,
        coalesce(nullif(api->>'referer', ''), nullif(csv->>'Referrer', '')) as referer,
        email, phone, country, guest_language as language,
        case
          when (api->>'room_id') is not null and (api->>'unit_id') is not null then
            case (api->>'room_id') || ':' || (api->>'unit_id')
              when '267788:1' then 1 when '268803:1' then 2 when '267788:2' then 3 when '267788:3' then 4
              when '626129:1' then 5 when '268803:2' then 6 when '626129:2' then 7
              when '265595:1' then 8 when '265595:2' then 9 when '265595:3' then 10 end
          when (csv->>'Unit') ~ '^[0-9]{1,2}$' then (csv->>'Unit')::int
        end as room_number,
        coalesce(nullif(room, ''), csv->>'Room') as room_type,
        checkin, checkout, greatest(checkout - checkin, 0) as nights,
        nullif(regexp_replace(coalesce(api->>'num_adult', csv->>'Adults', ''), '[^0-9]', '', 'g'), '')::int as adults,
        nullif(regexp_replace(coalesce(api->>'num_child', csv->>'Children', ''), '[^0-9]', '', 'g'), '')::int as children,
        firstname as first_name, lastname as last_name,
        nullif(regexp_replace(coalesce(price, ''), '[^0-9.]', '', 'g'), '')::numeric as price,
        case
          when (csv->>'Booking Date') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' then (csv->>'Booking Date')::timestamptz
          when (csv->>'Booking Date') ~ '^[A-Za-z]{3} +[0-9]{1,2} [A-Za-z]{3} [0-9]{4}$'
            then to_date(regexp_replace(csv->>'Booking Date', '^[A-Za-z]{3} +', ''), 'DD Mon YYYY')::timestamptz
        end as booked_at
      from src
    )
    insert into public.pyrgos_bookings as p (booking_id, master_id, status, channel, referer, room_number, room_type,
      checkin, checkout, nights, adults, children, first_name, last_name, email, phone, country, language, price,
      commission, booked_at, price_source)
    select booking_id, master_id, status,
      case
        when lower(coalesce(referer, '')) like '%booking.com%' then 'Booking'
        when lower(coalesce(referer, '')) ~ 'expedia|hotels[.]com' then 'Expedia'
        when lower(coalesce(referer, '')) like '%airbnb%' then 'Airbnb'
        when lower(coalesce(referer, '')) ~ 'andreas|alexandria' then 'Alexandria'
        when coalesce(referer, '') <> '' then 'Απευθείας'
        when lower(coalesce(email, '')) like '%booking.com%' then 'Booking'
        when lower(coalesce(email, '')) like '%expedia%' then 'Expedia'
        else 'Απευθείας'
      end,
      referer, room_number, room_type, checkin, checkout, nights, adults, children, first_name, last_name,
      email, phone, country, language, nullif(price, 0), null, booked_at,
      case when nullif(price, 0) is not null then 'beds24_bookings' end
    from norm
    on conflict (booking_id) do update set
      master_id = coalesce(excluded.master_id, p.master_id),
      status = excluded.status,
      referer = coalesce(excluded.referer, p.referer),
      channel = case when excluded.referer is not null then excluded.channel else p.channel end,
      room_number = coalesce(excluded.room_number, p.room_number),
      room_type = coalesce(excluded.room_type, p.room_type),
      checkin = excluded.checkin, checkout = excluded.checkout, nights = excluded.nights,
      adults = coalesce(excluded.adults, p.adults), children = coalesce(excluded.children, p.children),
      first_name = coalesce(nullif(excluded.first_name, ''), p.first_name),
      last_name = coalesce(nullif(excluded.last_name, ''), p.last_name),
      email = coalesce(nullif(excluded.email, ''), p.email),
      phone = coalesce(nullif(excluded.phone, ''), p.phone),
      country = coalesce(nullif(excluded.country, ''), p.country),
      language = coalesce(nullif(excluded.language, ''), p.language),
      price = coalesce(p.price, excluded.price),
      booked_at = coalesce(p.booked_at, excluded.booked_at),
      price_source = coalesce(p.price_source, excluded.price_source),
      updated_at = now()
    where (p.status, p.checkin, p.checkout, p.room_number, p.adults, p.children, p.first_name, p.last_name, p.email, p.phone, p.country, p.referer, p.price)
      is distinct from (excluded.status, excluded.checkin, excluded.checkout, coalesce(excluded.room_number, p.room_number),
        coalesce(excluded.adults, p.adults), coalesce(excluded.children, p.children),
        coalesce(nullif(excluded.first_name, ''), p.first_name), coalesce(nullif(excluded.last_name, ''), p.last_name),
        coalesce(nullif(excluded.email, ''), p.email), coalesce(nullif(excluded.phone, ''), p.phone),
        coalesce(nullif(excluded.country, ''), p.country), coalesce(excluded.referer, p.referer), coalesce(p.price, excluded.price))
    returning p.booking_id
  `) as unknown[];
  return rows.length;
}

// ---------- Beds24 API v2 ----------

export class Beds24RateLimited extends Error {}

type ApiBooking = Record<string, any>;

// Apt 11 is sold only directly (never given to the channel manager): any other room of the
// property that is not one of the four known room types is Apt 11 (owner, 2026-11-18).
const KNOWN_ROOM_IDS = new Set(["267788", "268803", "626129", "265595"]);
const PROPERTY_ID = String(process.env.BEDS24_PROPERTY_ID || "117813");

function roomNumberFromApi(b: ApiBooking) {
  const mapped = UNIT_TO_ROOM[`${text(b.roomId)}:${text(b.unitId)}`];
  if (mapped) return mapped;
  const roomId = text(b.roomId);
  const property = text(b.propertyId);
  if (roomId && !KNOWN_ROOM_IDS.has(roomId) && (!property || property === PROPERTY_ID)) return 11;
  return null;
}

function rowFromApi(b: ApiBooking) {
  const roomNumber = roomNumberFromApi(b);
  const price = num(b.price);
  const commission = num(b.commission);
  const referer = text(b.referer) || text(b.channel) || null;
  const master = text(b.masterId);
  return {
    booking_id: text(b.id),
    master_id: master && master !== "0" ? master : null,
    status: text(b.status).toLowerCase() || "unknown",
    channel: channelFrom(referer, text(b.email)),
    referer,
    room_number: roomNumber,
    checkin: text(b.arrival).slice(0, 10),
    checkout: text(b.departure).slice(0, 10),
    adults: num(b.numAdult),
    children: num(b.numChild),
    first_name: text(b.firstName) || null,
    last_name: text(b.lastName) || null,
    email: text(b.email) || null,
    phone: text(b.mobile) || text(b.phone) || null,
    country: (text(b.country2) || text(b.country)).toUpperCase().slice(0, 40) || null,
    language: text(b.lang) || null,
    price: price && price > 0 ? price : null,
    commission: commission && commission > 0 ? commission : null,
    booked_at: text(b.bookingTime) || null,
    notes: [text(b.notes), text(b.comments)].filter(Boolean).join(" · ").slice(0, 1000) || null,
  };
}

function lastDay(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
}

/** Fetches every booking arriving in `month` (YYYY-MM) from Beds24 and upserts the changed ones. */
export async function importFromBeds24Month(month: string) {
  await ensureBookingsTable();
  const token = process.env.BEDS24_API_TOKEN?.trim();
  if (!token) throw new Error("BEDS24_API_TOKEN is not configured.");

  const first = new URL("https://api.beds24.com/v2/bookings");
  first.searchParams.set("arrivalFrom", `${month}-01`);
  first.searchParams.set("arrivalTo", lastDay(month));
  const withStatus = new URL(first);
  for (const status of ["confirmed", "new", "request", "cancelled", "black", "inquiry"]) withStatus.searchParams.append("status", status);

  const rows: ReturnType<typeof rowFromApi>[] = [];
  let url: string | null = withStatus.toString();
  let pages = 0;
  let triedPlain = false;
  while (url && pages < 10) {
    const response: Response = await fetch(url, {
      headers: { accept: "application/json", token },
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    if (response.status === 429) throw new Beds24RateLimited("rate_limited");
    if (response.status === 400 && pages === 0 && !triedPlain) {
      // Older API behaviour: no multi-status filter; fall back to the default list.
      triedPlain = true;
      url = first.toString();
      continue;
    }
    if (!response.ok) throw new Error(`Beds24 HTTP ${response.status}`);
    const payload = (await response.json()) as any;
    for (const booking of Array.isArray(payload?.data) ? payload.data : []) {
      const row = rowFromApi(booking);
      if (row.booking_id && /^\d{4}-\d{2}-\d{2}$/.test(row.checkin) && /^\d{4}-\d{2}-\d{2}$/.test(row.checkout)) rows.push(row);
    }
    const next = text(payload?.pages?.nextPageLink);
    url = payload?.pages?.nextPageExists && next.startsWith("https://api.beds24.com/") ? next : null;
    pages += 1;
  }
  const changed = await upsertApiRows(rows);
  return { month, fetched: rows.length, changed, priced: rows.filter((r) => r.price !== null).length };
}

export async function upsertApiRows(rows: ReturnType<typeof rowFromApi>[]) {
  if (!rows.length) return 0;
  await ensureBookingsTable();
  const col = <K extends keyof ReturnType<typeof rowFromApi>>(key: K) => rows.map((r) => r[key]);
  const result = (await getSql()`
    insert into public.pyrgos_bookings as p (booking_id, master_id, status, channel, referer, room_number, checkin, checkout,
      nights, adults, children, first_name, last_name, email, phone, country, language, price, commission, booked_at, price_source, notes)
    select v.booking_id, v.master_id, v.status, v.channel, v.referer, v.room_number, v.checkin::date, v.checkout::date,
      greatest(v.checkout::date - v.checkin::date, 0), v.adults, v.children, v.first_name, v.last_name, v.email, v.phone,
      v.country, v.language, v.price, v.commission, v.booked_at::timestamptz, case when v.price is not null then 'beds24_api' end, v.notes
    from unnest(
      ${col("booking_id")}::text[], ${col("master_id")}::text[], ${col("status")}::text[], ${col("channel")}::text[],
      ${col("referer")}::text[], ${col("room_number")}::int[], ${col("checkin")}::text[], ${col("checkout")}::text[],
      ${col("adults")}::int[], ${col("children")}::int[], ${col("first_name")}::text[], ${col("last_name")}::text[],
      ${col("email")}::text[], ${col("phone")}::text[], ${col("country")}::text[], ${col("language")}::text[],
      ${col("price")}::numeric[], ${col("commission")}::numeric[], ${col("booked_at")}::text[], ${col("notes")}::text[]
    ) as v(booking_id, master_id, status, channel, referer, room_number, checkin, checkout, adults, children, first_name,
      last_name, email, phone, country, language, price, commission, booked_at, notes)
    on conflict (booking_id) do update set
      master_id = coalesce(excluded.master_id, p.master_id),
      status = excluded.status, channel = excluded.channel, referer = coalesce(excluded.referer, p.referer),
      room_number = coalesce(excluded.room_number, p.room_number),
      checkin = excluded.checkin, checkout = excluded.checkout, nights = excluded.nights,
      adults = coalesce(excluded.adults, p.adults), children = coalesce(excluded.children, p.children),
      first_name = coalesce(excluded.first_name, p.first_name), last_name = coalesce(excluded.last_name, p.last_name),
      email = coalesce(excluded.email, p.email), phone = coalesce(excluded.phone, p.phone),
      country = coalesce(excluded.country, p.country), language = coalesce(excluded.language, p.language),
      price = coalesce(excluded.price, p.price), commission = coalesce(excluded.commission, p.commission),
      booked_at = coalesce(excluded.booked_at, p.booked_at),
      price_source = case when excluded.price is not null then 'beds24_api' else p.price_source end,
      notes = coalesce(excluded.notes, p.notes),
      updated_at = now()
    where (p.status, p.channel, p.checkin, p.checkout, p.room_number, p.adults, p.children, p.first_name, p.last_name, p.email,
        p.phone, p.country, p.price, p.commission, p.booked_at)
      is distinct from (excluded.status, excluded.channel, excluded.checkin, excluded.checkout,
        coalesce(excluded.room_number, p.room_number), coalesce(excluded.adults, p.adults), coalesce(excluded.children, p.children),
        coalesce(excluded.first_name, p.first_name), coalesce(excluded.last_name, p.last_name), coalesce(excluded.email, p.email),
        coalesce(excluded.phone, p.phone), coalesce(excluded.country, p.country), coalesce(excluded.price, p.price),
        coalesce(excluded.commission, p.commission), coalesce(excluded.booked_at, p.booked_at)) or p.notes is distinct from coalesce(excluded.notes, p.notes)
    returning p.booking_id
  `) as unknown[];
  return result.length;
}

/** Called from the Beds24 booking webhook with the API v2 booking it already looked up. */
export async function upsertFromWebhook(apiBooking: ApiBooking | null | undefined) {
  if (!apiBooking || !text(apiBooking.id)) return 0;
  const row = rowFromApi(apiBooking);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.checkin) || !/^\d{4}-\d{2}-\d{2}$/.test(row.checkout)) return 0;
  return upsertApiRows([row]);
}

export type YearSummary = {
  year: number;
  bookings: number;
  cancelled: number;
  nights: number;
  priced: number;
  gross: number;
  net: number;
};

/** Per-year totals of real stays (no blocks, no cancellations) for the summary card. */
export async function bookingsSummary(): Promise<YearSummary[]> {
  await ensureBookingsTable();
  const rows = (await getSql()`
    select extract(year from checkin)::int as year,
      count(*) filter (where status in ('confirmed', 'new')) as bookings,
      count(*) filter (where status = 'cancelled') as cancelled,
      coalesce(sum(nights) filter (where status in ('confirmed', 'new')), 0) as nights,
      count(*) filter (where status in ('confirmed', 'new') and price is not null) as priced,
      coalesce(sum(price) filter (where status in ('confirmed', 'new')), 0) as gross,
      coalesce(sum(price - coalesce(commission, price * case channel when 'Booking' then 0.15 when 'Expedia' then 0.20 else 0 end))
        filter (where status in ('confirmed', 'new')), 0) as net
    from public.pyrgos_bookings
    group by 1 order by 1
  `) as any[];
  return rows.map((row) => ({
    year: Number(row.year),
    bookings: Number(row.bookings),
    cancelled: Number(row.cancelled),
    nights: Number(row.nights),
    priced: Number(row.priced),
    gross: Math.round(Number(row.gross)),
    net: Math.round(Number(row.net)),
  }));
}
