import "server-only";
import { neon } from "@neondatabase/serverless";

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

// Booking.com / Expedia relay addresses are not real guest emails.
const VIRTUAL_EMAIL = "@([a-z0-9-]+[.])*(booking[.]com|expedia[.]com|expediapartnercentral[.]com)$";

export const normalizeEmail = (value: unknown) => String(value ?? "").trim().toLowerCase();
export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isVirtualEmail = (value: string) => new RegExp(VIRTUAL_EMAIL).test(value);

export type CrmGuest = {
  email: string;
  name: string;
  country: string | null;
  language: string | null;
  phone: string | null;
  stays: number;
  lastCheckin: string | null;
  lastCheckout: string | null;
  lastRoom: string | null;
  unsubscribed: boolean;
};

export async function listGuests(): Promise<CrmGuest[]> {
  const sql = getSql();
  const rows = (await sql`
    with b as (
      select lower(trim(coalesce(nullif(c.real_email, ''), s.email))) as email,
             s.firstname, s.lastname, s.country, s.phone, s.room, s.checkin, s.checkout,
             left(lower(s.guest_language), 2) as language
      from public.beds24_bookings s
      left join public.crm_booking_contacts c using (booking_id)
      where lower(s.status) in ('confirmed', 'new')
    ),
    g as (
      select email,
        (array_agg(trim(concat_ws(' ', firstname, lastname)) order by checkin desc nulls last))[1] as name,
        (array_agg(country order by checkin desc nulls last) filter (where nullif(country, '') is not null))[1] as country,
        (array_agg(language order by checkin desc nulls last) filter (where nullif(language, '') is not null))[1] as language,
        (array_agg(phone order by checkin desc nulls last) filter (where nullif(phone, '') is not null))[1] as phone,
        (array_agg(room order by checkin desc nulls last))[1] as last_room,
        count(*) filter (where checkout < current_date)::int as stays,
        to_char(max(checkin), 'YYYY-MM-DD') as last_checkin,
        to_char(max(checkout), 'YYYY-MM-DD') as last_checkout
      from b
      where nullif(email, '') is not null and email !~ ${VIRTUAL_EMAIL}
      group by email
    )
    select g.email, g.name, coalesce(o.country, g.country) as country,
           coalesce(o.language, g.language) as language, g.phone, g.stays,
           g.last_checkin, g.last_checkout, g.last_room,
           (n.unsubscribed_at is not null) as unsubscribed
    from g
    left join public.crm_guest_overrides o using (email)
    left join public.newsletter_subscribers n on lower(n.email) = g.email
    where not exists (select 1 from public.crm_excluded_emails x where x.email = g.email)
    order by g.last_checkin desc nulls last
  `) as any[];
  return rows.map((row) => ({
    email: row.email,
    name: row.name || "",
    country: row.country,
    language: row.language,
    phone: row.phone,
    stays: row.stays,
    lastCheckin: row.last_checkin,
    lastCheckout: row.last_checkout,
    lastRoom: row.last_room,
    unsubscribed: Boolean(row.unsubscribed),
  }));
}

export type CrmPendingBooking = {
  bookingId: string;
  name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  room: string | null;
  checkin: string | null;
  checkout: string | null;
};

export async function listPendingBookings(scope: "upcoming" | "all"): Promise<CrmPendingBooking[]> {
  const sql = getSql();
  const rows = (await sql`
    select s.booking_id, trim(concat_ws(' ', s.firstname, s.lastname)) as name, s.email, s.phone,
           s.country, s.room, to_char(s.checkin, 'YYYY-MM-DD') as checkin,
           to_char(s.checkout, 'YYYY-MM-DD') as checkout
    from public.beds24_bookings s
    left join public.crm_booking_contacts c using (booking_id)
    where lower(s.status) in ('confirmed', 'new')
      and (nullif(trim(s.email), '') is null or lower(trim(s.email)) ~ ${VIRTUAL_EMAIL})
      and nullif(c.real_email, '') is null
      and coalesce(c.ignored, false) = false
      and (${scope} = 'all' or s.checkout >= current_date)
    order by case when s.checkin >= current_date then 0 else 1 end, s.checkin asc
    limit 1000
  `) as any[];
  return rows.map((row) => ({
    bookingId: row.booking_id,
    name: row.name || "",
    email: row.email,
    phone: row.phone,
    country: row.country,
    room: row.room,
    checkin: row.checkin,
    checkout: row.checkout,
  }));
}

export async function getSummary() {
  const sql = getSql();
  const [row] = (await sql`
    select
      (select count(*)::int from public.beds24_bookings) as bookings,
      (select count(*)::int from public.beds24_bookings where nullif(country, '') is not null) as bookings_with_country,
      (select count(*)::int from public.beds24_bookings where lower(status) in ('confirmed', 'new')
         and checkin between current_date and current_date + 7) as arrivals_7d,
      (select count(*)::int from public.beds24_bookings where lower(status) in ('confirmed', 'new')
         and checkin <= current_date and checkout > current_date) as in_house,
      (select to_char(max(received_at) at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') from public.beds24_bookings) as last_booking_at
  `) as any[];
  const [guests, pending, excluded] = await Promise.all([
    listGuests(),
    listPendingBookings("upcoming"),
    listExclusions(),
  ]);
  const countries = new Map<string, number>();
  const languages = new Map<string, number>();
  for (const guest of guests) {
    const country = guest.country || "?";
    countries.set(country, (countries.get(country) ?? 0) + 1);
    const language = guest.language || "?";
    languages.set(language, (languages.get(language) ?? 0) + 1);
  }
  const sorted = (map: Map<string, number>) =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).map(([key, count]) => ({ key, count }));
  return {
    bookings: row.bookings,
    bookingsWithCountry: row.bookings_with_country,
    arrivals7d: row.arrivals_7d,
    inHouse: row.in_house,
    lastBookingAt: row.last_booking_at,
    guests: guests.length,
    guestsWithCountry: guests.filter((guest) => guest.country).length,
    pendingUpcoming: pending.length,
    excluded: excluded.length,
    countries: sorted(countries),
    languages: sorted(languages),
  };
}

export async function listGuestMessages(email: string) {
  const sql = getSql();
  const rows = (await sql`
    select m.direction, m.subject, m.body, m.summary, m.booking_ids,
      to_char(m.sent_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as sent_at
    from public.crm_guest_messages m
    where m.guest_email = ${email} or m.booking_ids && coalesce((
      select array_agg(b.booking_id) from public.beds24_bookings b
      left join public.crm_booking_contacts c using (booking_id)
      where lower(trim(coalesce(nullif(c.real_email, ''), b.email))) = ${email}
    ), '{}'::text[])
    order by m.sent_at desc
    limit 100
  `) as any[];
  return rows.map((row) => ({
    direction: row.direction as "guest" | "staff",
    subject: row.subject as string | null,
    body: row.body as string,
    summary: row.summary as string | null,
    bookingIds: row.booking_ids as string[],
    sentAt: row.sent_at as string,
  }));
}

export async function listExclusions() {
  const sql = getSql();
  const rows = (await sql`select email, note from public.crm_excluded_emails order by email`) as any[];
  return rows.map((row) => ({ email: row.email as string, note: (row.note ?? "") as string }));
}

export async function addExclusion(email: string, note: string) {
  const sql = getSql();
  await sql`insert into public.crm_excluded_emails (email, note) values (${email}, ${note})
    on conflict (email) do update set note = excluded.note`;
}

export async function removeExclusion(email: string) {
  const sql = getSql();
  await sql`delete from public.crm_excluded_emails where email = ${email}`;
}

export async function saveGuestOverride(email: string, country: string | null, language: string | null) {
  const sql = getSql();
  await sql`insert into public.crm_guest_overrides (email, country, language) values (${email}, ${country}, ${language})
    on conflict (email) do update set country = excluded.country, language = excluded.language, updated_at = now()`;
}

export async function setBookingRealEmail(bookingId: string, email: string) {
  const sql = getSql();
  await sql`insert into public.crm_booking_contacts (booking_id, real_email) values (${bookingId}, ${email})
    on conflict (booking_id) do update set real_email = excluded.real_email, ignored = false, updated_at = now()`;
}

export async function ignoreBooking(bookingId: string) {
  const sql = getSql();
  await sql`insert into public.crm_booking_contacts (booking_id, ignored) values (${bookingId}, true)
    on conflict (booking_id) do update set ignored = true, updated_at = now()`;
}

export type BookingContactUpdate = { id: string; country: string | null; phone: string | null; language: string | null };

// Only fills empty values and skips unchanged rows, so re-runs cost no writes.
export async function applyBookingContacts(updates: BookingContactUpdate[]) {
  if (!updates.length) return 0;
  const sql = getSql();
  const rows = (await sql`
    update public.beds24_bookings b set
      country = coalesce(nullif(b.country, ''), v.country),
      phone = coalesce(nullif(b.phone, ''), v.phone),
      guest_language = coalesce(nullif(b.guest_language, ''), v.language)
    from unnest(
      ${updates.map((u) => u.id)}::text[],
      ${updates.map((u) => u.country)}::text[],
      ${updates.map((u) => u.phone)}::text[],
      ${updates.map((u) => u.language)}::text[]
    ) as v(id, country, phone, language)
    where b.booking_id = v.id and (
      (nullif(b.country, '') is null and v.country is not null)
      or (nullif(b.phone, '') is null and v.phone is not null)
      or (nullif(b.guest_language, '') is null and v.language is not null)
    )
    returning b.booking_id
  `) as any[];
  return rows.length;
}
