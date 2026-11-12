import "server-only";
import { neon } from "@neondatabase/serverless";
import { guestCountry, guestLanguage, guestPhone } from "@/lib/crm/beds24-contacts";
import {
  buildConfirmationEmail,
  cleanChargeDescription,
  cleanGuestComments,
  DEFAULT_BREAKFAST,
  ROOM_TYPE_NAMES,
  type BankDetails,
  type ConfirmationCharge,
  type ConfirmationData,
  type ConfirmationPayment,
} from "@/lib/crm/booking-confirmation-email";
import type { EmailLanguage } from "@/lib/crm/email-design";
import { deliverEmail } from "@/lib/crm/guest-emails";

const MAX_GROUP_BOOKINGS = 8;
const text = (value: unknown) => String(value ?? "").trim();
const dateOnly = (value: unknown) => text(value).match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? "";

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

export async function getBankDetails(): Promise<BankDetails | null> {
  const sql = getSql();
  const [row] = (await sql`select bank_details from public.crm_email_settings where id`) as any[];
  return row?.bank_details ?? null;
}

export async function listRecentBookings() {
  const sql = getSql();
  const rows = (await sql`
    select b.booking_id, b.firstname, b.lastname, b.email, b.room, b.status,
      to_char(b.checkin, 'YYYY-MM-DD') as checkin, to_char(b.checkout, 'YYYY-MM-DD') as checkout,
      (select to_char(max(l.created_at) at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI')
         from public.crm_email_log l
         where l.email_type = 'confirmation' and l.mode = 'live' and l.booking_id = b.booking_id) as sent_at
    from public.beds24_bookings b
    where lower(b.status) in ('confirmed', 'new', 'request') and b.checkout >= current_date
    order by b.received_at desc
    limit 30
  `) as any[];
  return rows.map((row) => ({
    bookingId: row.booking_id,
    name: `${row.firstname ?? ""} ${row.lastname ?? ""}`.trim(),
    email: row.email,
    room: row.room,
    status: row.status,
    checkin: row.checkin,
    checkout: row.checkout,
    sentAt: row.sent_at,
  }));
}

async function fetchBooking(id: string) {
  const token = process.env.BEDS24_API_TOKEN?.trim();
  if (!token) return null;
  const url = new URL("https://api.beds24.com/v2/bookings");
  url.searchParams.set("id", id);
  url.searchParams.set("includeInvoiceItems", "true");
  url.searchParams.set("includeBookingGroup", "true");
  const response = await fetch(url, {
    headers: { accept: "application/json", token },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as any;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  return rows.find((row: any) => text(row?.id) === id) ?? rows[0] ?? null;
}

const GENERIC_CHANNEL: Record<EmailLanguage, string> = { el: "της πλατφόρμας κράτησης", en: "the booking platform", tr: "rezervasyon platformu" };

function channelName(api: any, stored: any, language: EmailLanguage) {
  const raw = `${text(api?.channel)} ${text(api?.apiSource)} ${text(stored?.raw_json?.api_v2_lookup?.api_source_id) === "19" ? "booking" : ""}`.toLowerCase();
  if (raw.includes("booking")) return "Booking.com";
  if (raw.includes("expedia")) return "Expedia";
  if (raw.includes("airbnb")) return "Airbnb";
  return GENERIC_CHANNEL[language];
}

function pickLanguage(language: string | null, country: string | null): EmailLanguage {
  if (language === "el" || language === "en" || language === "tr") return language;
  if (country === "GR" || country === "CY") return "el";
  if (country === "TR") return "tr";
  return "en";
}

export async function loadConfirmation(bookingId: string): Promise<{ data: ConfirmationData; warnings: string[] } | null> {
  const sql = getSql();
  const warnings: string[] = [];
  const primary = await fetchBooking(bookingId).catch(() => null);
  if (!primary) warnings.push("Δεν ήρθαν στοιχεία από το Beds24. Φορτώθηκαν όσα υπάρχουν στη βάση, έλεγξέ τα.");

  const groupIds: string[] = (Array.isArray(primary?.bookingGroup?.ids) ? primary.bookingGroup.ids : []).map(text);
  const master = text(primary?.masterId);
  const ids = [...new Set([bookingId, ...(master && master !== "0" ? [master] : []), ...groupIds])].slice(0, MAX_GROUP_BOOKINGS);
  const others = await Promise.all(ids.filter((id) => id !== bookingId).map((id) => fetchBooking(id).catch(() => null)));
  const bookings = [primary, ...others].filter(Boolean);

  const stored = (await sql`
    select b.booking_id, b.firstname, b.lastname, b.email, b.phone, b.country, b.guest_language, b.room, b.price, b.raw_json,
      to_char(b.checkin, 'YYYY-MM-DD') as checkin, to_char(b.checkout, 'YYYY-MM-DD') as checkout,
      (select r.display_name from booking_core.rooms r where r.room_id::text = b.raw_json->>'room_id' limit 1) as core_room
    from public.beds24_bookings b where b.booking_id = any(${ids}::text[])
  `) as any[];
  const storedById = new Map(stored.map((row) => [row.booking_id, row]));
  const self = storedById.get(bookingId);
  if (!primary && !self) return null;

  const language = pickLanguage(guestLanguage(primary) ?? self?.guest_language?.slice(0, 2) ?? null, guestCountry(primary) ?? self?.country ?? null);
  const isGroup = bookings.length > 1;
  // For a group, Beds24 stores all room names joined on the first booking ("A, B, B"),
  // so each card takes its own room type from its Beds24 room id instead.
  const roomName = (id: string, api: any) => {
    const row = storedById.get(id);
    const roomId = text(api?.roomId) || text(row?.raw_json?.room_id);
    const typeName = ROOM_TYPE_NAMES[roomId]?.[language];
    if (typeName) return typeName;
    const storedName = text(row?.room);
    if (storedName && !(isGroup && storedName.includes(","))) return storedName;
    return text(api?.roomName) || text(row?.core_room);
  };
  const activeIds = bookings.length ? bookings.map((row: any) => text(row.id)) : [bookingId];
  const rooms = (bookings.length ? bookings : [{ id: bookingId }]).map((row: any) => {
    const local = storedById.get(text(row.id));
    return {
      room: roomName(text(row.id), row),
      checkin: dateOnly(row.arrival) || local?.checkin || "",
      checkout: dateOnly(row.departure) || local?.checkout || "",
    };
  });

  const charges: ConfirmationCharge[] = [];
  const payments: ConfirmationPayment[] = [];
  const seen = new Set<string>();
  bookings.forEach((booking: any, index: number) => {
    const context = rooms[index] ?? rooms[0];
    for (const item of Array.isArray(booking.invoiceItems) ? booking.invoiceItems : []) {
      const key = text(item.id);
      if (key && seen.has(key)) continue;
      if (key) seen.add(key);
      const amount = Number(item.amount) || 0;
      if (/payment/i.test(text(item.type))) payments.push({ description: text(item.description), amount: Math.abs(amount) });
      else charges.push({ description: cleanChargeDescription(text(item.description), language, context), qty: Number(item.qty) || 1, amount });
    }
  });
  if (!charges.length) {
    const price = Number(String(primary?.price ?? self?.price ?? "").replace(/[^\d.]/g, "")) || 0;
    charges.push({ description: rooms[0]?.room || "Accommodation", qty: 1, amount: price });
    warnings.push("Δεν βρέθηκαν γραμμές τιμολογίου. Έλεγξε τα οικονομικά.");
  }

  // Booking.com/Expedia put their own system lines in the guest comments; keep only what the guest wrote.
  const guestComments = cleanGuestComments(text(primary?.comments));
  const prepaidVia = guestComments.prepaid ? channelName(primary, self, language) : "";
  if (prepaidVia) warnings.push(`Η κράτηση είναι προπληρωμένη μέσω ${prepaidVia}: το email δεν θα δείχνει IBAN/τρόπους πληρωμής.`);

  const sum = (key: string) => bookings.reduce((total: number, row: any) => total + (Number(row[key]) || 0), 0);
  const names = [...new Set((bookings.length ? bookings : [self]).map((row: any) => `${text(row.firstName ?? row.firstname)} ${text(row.lastName ?? row.lastname)}`.trim()).filter(Boolean))];

  return {
    warnings,
    data: {
      language,
      bookingIds: activeIds,
      title: text(primary?.title),
      firstName: text(primary?.firstName) || text(self?.firstname),
      lastName: text(primary?.lastName) || text(self?.lastname),
      guestLogin: "",
      bookingDate: dateOnly(primary?.bookingTime),
      guestsNames: names.join(", "),
      rooms,
      adults: sum("numAdult"),
      children: sum("numChild"),
      phone: guestPhone(primary) || text(self?.phone),
      email: text(primary?.email) || text(self?.email),
      breakfast: DEFAULT_BREAKFAST[language],
      charges,
      payments,
      // Only the guest's own comments. Beds24 "notes" are internal and stay out.
      comments: guestComments.comments,
      prepaidVia,
    },
  };
}

export async function sendConfirmation(data: ConfirmationData, recipient: string, mode: "live" | "test") {
  const sql = getSql();
  const email = buildConfirmationEmail(data, await getBankDetails());
  const subject = mode === "test" ? `[ΔΟΚΙΜΗ] ${email.subject}` : email.subject;
  await deliverEmail(recipient, subject, email.html, email.text);
  await sql`insert into public.crm_email_log (dedupe_key, booking_id, email_type, language, recipient, guest_email, mode, status)
    values (${`confirmation:${data.bookingIds[0]}:${Date.now()}`}, ${data.bookingIds[0]}, 'confirmation', ${data.language}, ${recipient}, ${data.email}, ${mode}, 'sent')`;
}
