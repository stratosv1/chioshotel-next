import "server-only";
import { saveManualArrival } from "@/lib/crm/bookings-board";
import { emailShell, esc, paragraph } from "@/lib/crm/email-design";
import { chooseLanguage, deliverEmail } from "@/lib/crm/guest-emails";
import { postChannelMessage, sendOutreachToBooking } from "@/lib/crm/ota-outreach";
import { normalizePhone, sendBookingSms } from "@/lib/crm/sms";
import { ensureBookingsTable } from "./bookings";
import { ActionError } from "./actions";
import { logHistory } from "./ledger";
import { getSql } from "./store";

// CRM inside the booking panel (owner, 2026-11-18): who the guest is, what is missing,
// everything said to / by them, and sending SMS, email, WhatsApp or an OTA message on the spot.

const RELAY = /guest\.booking\.com|expedia|m\.expediapartnercentral/i;
const text = (v: unknown) => String(v ?? "").trim();

export type TimelineItem = { at: string; sort: string; channel: string; direction: "in" | "out"; title: string; body: string; status: string };

export async function getGuestProfile(bookingId: string) {
  await ensureBookingsTable();
  const sql = getSql();
  const [booking] = (await sql`
    select booking_id, master_id, channel, first_name, last_name, email, phone, country, language, status,
      to_char(checkin, 'YYYY-MM-DD') as checkin
    from public.pyrgos_bookings where booking_id = ${bookingId}
  `) as any[];
  if (!booking) return null;
  const master = booking.master_id || booking.booking_id;
  const groupRows = (await sql`
    select booking_id from public.pyrgos_bookings where booking_id = ${master} or master_id = ${master}
  `) as any[];
  const ids = [...new Set([bookingId, ...groupRows.map((r) => String(r.booking_id))])];

  const [contacts, outreach, emails, replies, comms] = await Promise.all([
    sql`select booking_id, real_email, arrival_time, arrival_details, arrival_saved_at from public.crm_booking_contacts
        where booking_id = any(${ids}::text[])` as Promise<any[]>,
    sql`select status, created_at, reminder_at, sms_at from public.crm_ota_outreach where booking_id = any(${ids}::text[])` as Promise<any[]>,
    sql`select email_type, status, recipient, mode, created_at from public.crm_email_log
        where booking_id = any(${ids}::text[]) order by created_at desc limit 30` as Promise<any[]>,
    sql`select direction, subject, summary, body, sent_at, arrival_time from public.crm_guest_messages
        where booking_ids && ${ids}::text[] order by sent_at desc limit 30` as Promise<any[]>,
    sql`select channel, direction, message_type, subject, message, status, recipient_phone, recipient_email, created_at
        from public.staff_guest_communications where booking_id = any(${ids}::text[]) order by created_at desc limit 40` as Promise<any[]>,
  ]);

  const realEmail = contacts.find((c) => c.real_email)?.real_email ?? (booking.email && !RELAY.test(booking.email) ? booking.email : null);
  const arrival = contacts.find((c) => c.arrival_saved_at || c.arrival_time);
  const phone = text(booking.phone);

  // Earlier stays of the same guest: same real email, same phone, or same full name.
  // Owner contact details are used on staff-entered bookings; they never identify a guest.
  const OWNER = /voulamandis|chioshotel/i;
  const OWNER_PHONES = new Set(["944474226", "944444444"]);
  const matchEmail = realEmail && !OWNER.test(realEmail) ? realEmail : "";
  const rawDigits = phone.replace(/\D/g, "").slice(-9);
  const digits = OWNER_PHONES.has(rawDigits) ? "" : rawDigits;
  const fullName = `${text(booking.first_name)} ${text(booking.last_name)}`.trim().toLowerCase();
  const previous = (await sql`
    select booking_id, room_number, to_char(checkin, 'YYYY-MM-DD') as checkin, nights, channel
    from public.pyrgos_bookings
    where status in ('confirmed', 'new') and not (booking_id = any(${ids}::text[]))
      and checkin < ${booking.checkin}::date
      and (
        (${matchEmail}::text <> '' and lower(email) = lower(${matchEmail}::text))
        or (length(${digits}::text) = 9 and right(regexp_replace(coalesce(phone, ''), '[^0-9]', '', 'g'), 9) = ${digits}::text)
        or (length(${fullName}::text) > 5 and lower(trim(coalesce(first_name, '') || ' ' || coalesce(last_name, ''))) = ${fullName}::text)
      )
    order by checkin desc limit 10
  `) as any[];

  const fmt = (d: any) =>
    d ? new Intl.DateTimeFormat("el-GR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" }).format(new Date(d)) : "";
  const iso = (d: any) => (d ? new Date(d).toISOString() : "");
  const EMAIL_TYPES: Record<string, string> = {
    confirmation: "Επιβεβαίωση κράτησης",
    welcome: "Καλωσόρισμα",
    pre_arrival: "Πριν την άφιξη",
    daily: "Πρόταση ημέρας",
    farewell: "Αποχαιρετισμός",
    review: "Αίτημα κριτικής",
  };
  const timeline: TimelineItem[] = [
    ...emails.map((e) => ({
      at: fmt(e.created_at),
      sort: iso(e.created_at),
      channel: "email",
      direction: "out" as const,
      title: `Αυτόματο email: ${EMAIL_TYPES[e.email_type] ?? e.email_type}`,
      body: e.recipient ?? "",
      status: e.status === "sent" ? (e.mode === "test" ? "δοκιμή" : "στάλθηκε") : e.status,
    })),
    ...replies.map((r) => ({
      at: fmt(r.sent_at),
      sort: iso(r.sent_at),
      channel: "email",
      direction: (r.direction === "outbound" ? "out" : "in") as "in" | "out",
      title: r.direction === "outbound" ? `Email: ${r.subject ?? ""}` : `Απάντηση πελάτη${r.subject ? `: ${r.subject}` : ""}`,
      body: text(r.summary || r.body).slice(0, 400) + (r.arrival_time ? ` · ώρα άφιξης ${r.arrival_time}` : ""),
      status: "",
    })),
    ...comms.map((c) => ({
      at: fmt(c.created_at),
      sort: iso(c.created_at),
      channel: c.channel,
      direction: (c.direction === "inbound" ? "in" : "out") as "in" | "out",
      title: `${({ sms: "SMS", email: "Email", whatsapp: "WhatsApp", ota: "Μήνυμα καναλιού" } as Record<string, string>)[c.channel] ?? c.channel}${c.subject ? `: ${c.subject}` : ""}`,
      body: text(c.message).slice(0, 400),
      status: text(c.status).toLowerCase(),
    })),
    ...outreach.flatMap((o) => [
      { at: fmt(o.created_at), sort: iso(o.created_at), channel: "ota", direction: "out" as const, title: "Αίτημα για email & ώρα άφιξης (κανάλι)", body: "", status: o.status },
      ...(o.reminder_at ? [{ at: fmt(o.reminder_at), sort: iso(o.reminder_at), channel: "ota", direction: "out" as const, title: "Υπενθύμιση για email & ώρα άφιξης", body: "", status: "" }] : []),
      ...(o.sms_at ? [{ at: fmt(o.sms_at), sort: iso(o.sms_at), channel: "sms", direction: "out" as const, title: "SMS για email & ώρα άφιξης", body: "", status: "" }] : []),
    ]),
  ].sort((a, b) => b.sort.localeCompare(a.sort));

  const ota = booking.channel === "Booking" || booking.channel === "Expedia";
  return {
    ids,
    language: chooseLanguage(booking.language, booking.country),
    realEmail,
    phone: normalizePhone(phone) ? phone : "",
    arrivalTime: arrival?.arrival_time ?? null,
    arrivalDetails: arrival?.arrival_details ?? null,
    missing: [!realEmail ? "email" : "", !arrival?.arrival_time ? "ώρα άφιξης" : "", !normalizePhone(phone) ? "κινητό" : ""].filter(Boolean),
    canOtaMessage: ota,
    outreachSent: outreach.some((o) => o.status === "sent"),
    previous: previous.map((p) => ({ id: String(p.booking_id), room: p.room_number, checkin: p.checkin, nights: Number(p.nights), channel: p.channel })),
    timeline: timeline.slice(0, 40),
  };
}

export async function sendGuestMessage(body: any) {
  const id = text(body.id);
  const channel = text(body.channel);
  const message = text(body.message).slice(0, 2000);
  const profile = await getGuestProfile(id);
  if (!profile) throw new ActionError("Η κράτηση δεν βρέθηκε.", 404);
  const sql = getSql();
  const [b] = (await sql`select first_name, last_name, phone from public.pyrgos_bookings where booking_id = ${id}`) as any[];
  const guestName = `${text(b?.first_name)} ${text(b?.last_name)}`.trim();

  if (channel === "whatsapp") {
    // Sent from the owner's own WhatsApp (wa.me); we only keep it in the history.
    await sql`insert into public.staff_guest_communications (booking_id, guest_name, channel, direction, message_type, recipient_phone, message, status, provider, source)
      values (${id}, ${guestName}, 'whatsapp', 'outbound', 'manual', ${normalizePhone(text(b?.phone)) || null}, ${message}, 'opened', 'wa.me', 'pyrgos')`;
    await logHistory(id, "WhatsApp", message.slice(0, 200), "ok");
    return { sent: "whatsapp" };
  }
  if (!message) throw new ActionError("Γράψε το μήνυμα.");

  if (channel === "sms") {
    if (message.length > 918) throw new ActionError("Το SMS είναι πολύ μεγάλο (έως 918 χαρακτήρες).");
    if (!normalizePhone(text(b?.phone))) throw new ActionError("Δεν υπάρχει έγκυρο κινητό.");
    await sendBookingSms({ bookingId: id, guestName, phone: text(b?.phone), message });
    await logHistory(id, "SMS", message.slice(0, 200), "ok");
    return { sent: "sms" };
  }

  if (channel === "email") {
    const to = profile.realEmail;
    if (!to) throw new ActionError("Δεν υπάρχει προσωπικό email του πελάτη.");
    const subject = text(body.subject).slice(0, 150) || (profile.language === "el" ? "Voulamandis House" : "Voulamandis House, Chios");
    const html = emailShell({
      language: profile.language,
      preheader: message.slice(0, 120),
      eyebrow: "Voulamandis House",
      heading: subject,
      body: message
        .split(/\n{2,}/)
        .map((part) => paragraph(esc(part).replace(/\n/g, "<br>")))
        .join(""),
      heroImage: null,
    });
    try {
      await deliverEmail(to, subject, html, message);
    } catch (error) {
      await sql`insert into public.staff_guest_communications (booking_id, guest_name, channel, direction, message_type, recipient_email, subject, message, status, provider, source)
        values (${id}, ${guestName}, 'email', 'outbound', 'manual', ${to}, ${subject}, ${message}, 'failed', 'smtp', 'pyrgos')`;
      throw error;
    }
    await sql`insert into public.staff_guest_communications (booking_id, guest_name, channel, direction, message_type, recipient_email, subject, message, status, provider, source)
      values (${id}, ${guestName}, 'email', 'outbound', 'manual', ${to}, ${subject}, ${message}, 'sent', 'smtp', 'pyrgos')`;
    await logHistory(id, "Email", `${subject} → ${to}`, "ok");
    return { sent: "email" };
  }

  if (channel === "ota") {
    if (!profile.canOtaMessage) throw new ActionError("Μήνυμα καναλιού υπάρχει μόνο για Booking/Expedia.");
    await postChannelMessage(id, message);
    await sql`insert into public.staff_guest_communications (booking_id, guest_name, channel, direction, message_type, message, status, provider, source)
      values (${id}, ${guestName}, 'ota', 'outbound', 'manual', ${message}, 'sent', 'beds24', 'pyrgos')`;
    await logHistory(id, "Μήνυμα καναλιού", message.slice(0, 200), "ok");
    return { sent: "ota" };
  }
  throw new ActionError("Άγνωστο κανάλι.");
}

export async function requestMissingDetails(body: any) {
  const id = text(body.id);
  const outcome = await sendOutreachToBooking(id);
  await logHistory(id, "Αίτημα στοιχείων", "email & ώρα άφιξης μέσω καναλιού", outcome === "sent" ? "ok" : "failed");
  return { outcome };
}

export async function saveArrival(body: any) {
  const id = text(body.id);
  const time = text(body.time);
  const details = text(body.details).replace(/\s+/g, " ").slice(0, 300);
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new ActionError("Μη έγκυρη ώρα (π.χ. 15:30).");
  const profile = await getGuestProfile(id);
  if (!profile) throw new ActionError("Η κράτηση δεν βρέθηκε.", 404);
  const result = await saveManualArrival(profile.ids, time, details);
  await logHistory(id, "Ώρα άφιξης", [time, details].filter(Boolean).join(" · ") || "καθαρίστηκε", "ok");
  return result;
}
