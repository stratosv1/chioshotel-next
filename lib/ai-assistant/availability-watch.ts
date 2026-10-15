import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import nodemailer, { type Transporter } from "nodemailer";
import { checkGlobalHourlyLimit } from "@/lib/ai-assistant/public-rate-limit";
import { daysBetweenIsoDates, isStrictIsoDate, todayInAthensIso } from "@/lib/ai-assistant/room-finder-date";
import type { AssistantLanguage } from "@/lib/ai-assistant/types";
import { ROOM_FINDER_HREFS } from "@/lib/room-finder-cta-routing";
import { siteUrl } from "@/lib/site-url";

// "Notify me if these dates open up" for the AI Room Finder.
//
// A guest who finds no availability leaves an email. Whenever live inventory
// is refreshed (after every Booking Core sync, plus a daily cron), active
// watches are checked against booking_core.search_availability for their
// exact dates and party. When rooms are free, the guest gets ONE email with
// the direct price and a link back to the Room Finder; reception gets a copy
// so they can follow up by phone.

export const WATCH_MAX_STAY_NIGHTS = 30; // booking_core.settings.max_stay_nights
const MAX_ACTIVE_WATCHES_PER_EMAIL = 5;
const MAX_NOTIFICATIONS_PER_RUN = 25;
const MAX_WATCHES_PER_RUN = 300;
const RETENTION_DAYS_AFTER_CHECKOUT = 60;
const WATCH_CONFIRMATIONS_PER_HOUR = 20;
const STAFF_WATCH_ALERTS_PER_HOUR = 30;
const CALL_NUMBER = "+30 694 476 4654";
const WHATSAPP_NUMBER = "+30 694 447 4226";
const SUPPORTED: AssistantLanguage[] = ["el", "en", "de", "fr", "it", "es", "tr"];

export class WatchLimitError extends Error {
  constructor() {
    super("Too many active availability alerts for this email.");
    this.name = "WatchLimitError";
  }
}

type WatchRow = {
  id: number;
  language: string;
  email: string;
  first_name: string | null;
  checkin: string | Date;
  checkout: string | Date;
  guest_groups: unknown;
  total_guests: number;
  cancel_token: string;
  session_id: string | null;
};

type Copy = {
  nights: (count: number) => string;
  guests: (count: number) => string;
  rooms: (count: number) => string;
  greeting: (name: string) => string;
  confirmSubject: string;
  confirmBody: (stay: string) => string;
  confirmNothingElse: string;
  notifySubject: string;
  notifyBody: (stay: string) => string;
  notifyPrice: (price: string) => string;
  notifyHurry: string;
  notifyButton: string;
  notifyOnce: string;
  cancelLine: string;
  cancelButton: string;
  contact: string;
  signature: string;
  cancelPageTitle: string;
  cancelPageText: string;
  cancelledPageText: string;
  inactivePageText: string;
};

const COPY: Record<AssistantLanguage, Copy> = {
  el: {
    nights: n => `${n} ${n === 1 ? "νύχτα" : "νύχτες"}`,
    guests: n => `${n} ${n === 1 ? "άτομο" : "άτομα"}`,
    rooms: n => `${n} ${n === 1 ? "δωμάτιο" : "δωμάτια"}`,
    greeting: name => name ? `Γεια σας ${name},` : "Γεια σας,",
    confirmSubject: "Θα σας ειδοποιήσουμε αν ανοίξει διαθεσιμότητα",
    confirmBody: stay => `Καταχωρήσαμε το αίτημά σας. Αν ανοίξει διαθεσιμότητα στο Voulamandis House για ${stay}, θα σας στείλουμε αμέσως email με την τιμή απευθείας κράτησης.`,
    confirmNothingElse: "Δεν χρειάζεται να κάνετε τίποτα άλλο.",
    notifySubject: "Άνοιξε διαθεσιμότητα για τις ημερομηνίες σας",
    notifyBody: stay => `Καλά νέα: υπάρχει τώρα διαθεσιμότητα στο Voulamandis House για ${stay}.`,
    notifyPrice: price => `Τιμή απευθείας κράτησης: από ${price} για όλη τη διαμονή.`,
    notifyHurry: "Η διαθεσιμότητα αλλάζει γρήγορα, γι’ αυτό σας προτείνουμε να κάνετε την κράτηση σύντομα.",
    notifyButton: "Δείτε τα διαθέσιμα δωμάτια",
    notifyOnce: "Αυτή είναι η μοναδική ειδοποίηση για αυτό το αίτημα.",
    cancelLine: "Αν δεν θέλετε πλέον ειδοποίηση για αυτές τις ημερομηνίες:",
    cancelButton: "Ακύρωση ειδοποίησης",
    contact: `Τηλέφωνο ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}`,
    signature: "Voulamandis House · Κάμπος, Χίος",
    cancelPageTitle: "Ακύρωση ειδοποίησης",
    cancelPageText: "Θέλετε να σταματήσετε την ειδοποίηση διαθεσιμότητας για αυτές τις ημερομηνίες;",
    cancelledPageText: "Η ειδοποίηση ακυρώθηκε. Δεν θα λάβετε άλλο email για αυτό το αίτημα.",
    inactivePageText: "Αυτή η ειδοποίηση δεν είναι πλέον ενεργή.",
  },
  en: {
    nights: n => `${n} ${n === 1 ? "night" : "nights"}`,
    guests: n => `${n} ${n === 1 ? "guest" : "guests"}`,
    rooms: n => `${n} ${n === 1 ? "room" : "rooms"}`,
    greeting: name => name ? `Hello ${name},` : "Hello,",
    confirmSubject: "We’ll let you know if your dates open up",
    confirmBody: stay => `Your alert is set. If rooms become available at Voulamandis House for ${stay}, we’ll email you straight away with the direct booking price.`,
    confirmNothingElse: "There is nothing else you need to do.",
    notifySubject: "Rooms are now available for your dates",
    notifyBody: stay => `Good news: Voulamandis House now has availability for ${stay}.`,
    notifyPrice: price => `Direct booking price: from ${price} for the whole stay.`,
    notifyHurry: "Availability changes quickly, so we recommend booking soon.",
    notifyButton: "See available rooms",
    notifyOnce: "This is the only alert for this request.",
    cancelLine: "If you no longer want an alert for these dates:",
    cancelButton: "Cancel alert",
    contact: `Phone ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}`,
    signature: "Voulamandis House · Kambos, Chios",
    cancelPageTitle: "Cancel alert",
    cancelPageText: "Do you want to stop the availability alert for these dates?",
    cancelledPageText: "The alert has been cancelled. You won’t receive any more emails for this request.",
    inactivePageText: "This alert is no longer active.",
  },
  de: {
    nights: n => `${n} ${n === 1 ? "Nacht" : "Nächte"}`,
    guests: n => `${n} ${n === 1 ? "Gast" : "Gäste"}`,
    rooms: n => `${n} ${n === 1 ? "Zimmer" : "Zimmer"}`,
    greeting: name => name ? `Hallo ${name},` : "Hallo,",
    confirmSubject: "Wir benachrichtigen Sie, wenn Ihre Daten frei werden",
    confirmBody: stay => `Ihre Benachrichtigung ist aktiv. Sobald im Voulamandis House Zimmer für ${stay} frei werden, senden wir Ihnen sofort eine E-Mail mit dem Direktbuchungspreis.`,
    confirmNothingElse: "Sie müssen nichts weiter tun.",
    notifySubject: "Für Ihre Daten sind jetzt Zimmer frei",
    notifyBody: stay => `Gute Nachrichten: Im Voulamandis House ist jetzt etwas frei für ${stay}.`,
    notifyPrice: price => `Direktbuchungspreis: ab ${price} für den gesamten Aufenthalt.`,
    notifyHurry: "Die Verfügbarkeit ändert sich schnell – wir empfehlen, bald zu buchen.",
    notifyButton: "Freie Zimmer ansehen",
    notifyOnce: "Dies ist die einzige Benachrichtigung zu dieser Anfrage.",
    cancelLine: "Wenn Sie keine Benachrichtigung mehr für diese Daten möchten:",
    cancelButton: "Benachrichtigung abbestellen",
    contact: `Telefon ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}`,
    signature: "Voulamandis House · Kambos, Chios",
    cancelPageTitle: "Benachrichtigung abbestellen",
    cancelPageText: "Möchten Sie die Verfügbarkeitsbenachrichtigung für diese Daten beenden?",
    cancelledPageText: "Die Benachrichtigung wurde abbestellt. Sie erhalten zu dieser Anfrage keine E-Mails mehr.",
    inactivePageText: "Diese Benachrichtigung ist nicht mehr aktiv.",
  },
  fr: {
    nights: n => `${n} ${n === 1 ? "nuit" : "nuits"}`,
    guests: n => `${n} ${n === 1 ? "personne" : "personnes"}`,
    rooms: n => `${n} ${n === 1 ? "chambre" : "chambres"}`,
    greeting: name => name ? `Bonjour ${name},` : "Bonjour,",
    confirmSubject: "Nous vous préviendrons si vos dates se libèrent",
    confirmBody: stay => `Votre alerte est enregistrée. Si des chambres se libèrent à Voulamandis House pour ${stay}, nous vous enverrons aussitôt un e-mail avec le tarif de réservation directe.`,
    confirmNothingElse: "Vous n’avez rien d’autre à faire.",
    notifySubject: "Des chambres sont disponibles pour vos dates",
    notifyBody: stay => `Bonne nouvelle : Voulamandis House a maintenant des disponibilités pour ${stay}.`,
    notifyPrice: price => `Tarif de réservation directe : à partir de ${price} pour tout le séjour.`,
    notifyHurry: "Les disponibilités évoluent vite, nous vous conseillons de réserver rapidement.",
    notifyButton: "Voir les chambres disponibles",
    notifyOnce: "C’est la seule alerte pour cette demande.",
    cancelLine: "Si vous ne souhaitez plus d’alerte pour ces dates :",
    cancelButton: "Annuler l’alerte",
    contact: `Téléphone ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}`,
    signature: "Voulamandis House · Kambos, Chios",
    cancelPageTitle: "Annuler l’alerte",
    cancelPageText: "Voulez-vous arrêter l’alerte de disponibilité pour ces dates ?",
    cancelledPageText: "L’alerte a été annulée. Vous ne recevrez plus d’e-mail pour cette demande.",
    inactivePageText: "Cette alerte n’est plus active.",
  },
  it: {
    nights: n => `${n} ${n === 1 ? "notte" : "notti"}`,
    guests: n => `${n} ${n === 1 ? "ospite" : "ospiti"}`,
    rooms: n => `${n} ${n === 1 ? "camera" : "camere"}`,
    greeting: name => name ? `Gentile ${name},` : "Buongiorno,",
    confirmSubject: "Vi avviseremo se le vostre date si liberano",
    confirmBody: stay => `Il vostro avviso è attivo. Se a Voulamandis House si liberano camere per ${stay}, vi invieremo subito un’email con il prezzo di prenotazione diretta.`,
    confirmNothingElse: "Non dovete fare nient’altro.",
    notifySubject: "Ci sono camere disponibili per le vostre date",
    notifyBody: stay => `Buone notizie: Voulamandis House ha ora disponibilità per ${stay}.`,
    notifyPrice: price => `Prezzo di prenotazione diretta: da ${price} per l’intero soggiorno.`,
    notifyHurry: "La disponibilità cambia rapidamente, vi consigliamo di prenotare presto.",
    notifyButton: "Vedi le camere disponibili",
    notifyOnce: "Questo è l’unico avviso per questa richiesta.",
    cancelLine: "Se non desiderate più l’avviso per queste date:",
    cancelButton: "Annulla avviso",
    contact: `Telefono ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}`,
    signature: "Voulamandis House · Kambos, Chios",
    cancelPageTitle: "Annulla avviso",
    cancelPageText: "Volete interrompere l’avviso di disponibilità per queste date?",
    cancelledPageText: "L’avviso è stato annullato. Non riceverete altre email per questa richiesta.",
    inactivePageText: "Questo avviso non è più attivo.",
  },
  es: {
    nights: n => `${n} ${n === 1 ? "noche" : "noches"}`,
    guests: n => `${n} ${n === 1 ? "huésped" : "huéspedes"}`,
    rooms: n => `${n} ${n === 1 ? "habitación" : "habitaciones"}`,
    greeting: name => name ? `Hola ${name}:` : "Hola:",
    confirmSubject: "Le avisaremos si se liberan sus fechas",
    confirmBody: stay => `Su aviso está activo. Si se libera disponibilidad en Voulamandis House para ${stay}, le enviaremos enseguida un correo con el precio de reserva directa.`,
    confirmNothingElse: "No tiene que hacer nada más.",
    notifySubject: "Hay habitaciones disponibles para sus fechas",
    notifyBody: stay => `Buenas noticias: Voulamandis House tiene ahora disponibilidad para ${stay}.`,
    notifyPrice: price => `Precio de reserva directa: desde ${price} por toda la estancia.`,
    notifyHurry: "La disponibilidad cambia rápido, le recomendamos reservar pronto.",
    notifyButton: "Ver habitaciones disponibles",
    notifyOnce: "Este es el único aviso para esta solicitud.",
    cancelLine: "Si ya no desea el aviso para estas fechas:",
    cancelButton: "Cancelar aviso",
    contact: `Teléfono ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}`,
    signature: "Voulamandis House · Kambos, Quíos",
    cancelPageTitle: "Cancelar aviso",
    cancelPageText: "¿Desea detener el aviso de disponibilidad para estas fechas?",
    cancelledPageText: "El aviso se ha cancelado. No recibirá más correos sobre esta solicitud.",
    inactivePageText: "Este aviso ya no está activo.",
  },
  tr: {
    nights: n => `${n} gece`,
    guests: n => `${n} kişi`,
    rooms: n => `${n} oda`,
    greeting: name => name ? `Merhaba ${name},` : "Merhaba,",
    confirmSubject: "Tarihleriniz müsait olursa size haber vereceğiz",
    confirmBody: stay => `Bildiriminiz kaydedildi. Voulamandis House’ta ${stay} için yer açılırsa, doğrudan rezervasyon fiyatıyla hemen size e-posta göndereceğiz.`,
    confirmNothingElse: "Başka bir şey yapmanıza gerek yok.",
    notifySubject: "Tarihleriniz için müsait oda var",
    notifyBody: stay => `İyi haber: Voulamandis House’ta artık ${stay} için müsaitlik var.`,
    notifyPrice: price => `Doğrudan rezervasyon fiyatı: tüm konaklama için ${price}’dan başlayan fiyatlarla.`,
    notifyHurry: "Müsaitlik hızla değişir, kısa süre içinde rezervasyon yapmanızı öneririz.",
    notifyButton: "Müsait odaları görün",
    notifyOnce: "Bu talep için gönderilen tek bildirim budur.",
    cancelLine: "Bu tarihler için artık bildirim istemiyorsanız:",
    cancelButton: "Bildirimi iptal et",
    contact: `Telefon ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}`,
    signature: "Voulamandis House · Kambos, Sakız",
    cancelPageTitle: "Bildirimi iptal et",
    cancelPageText: "Bu tarihler için müsaitlik bildirimini durdurmak istiyor musunuz?",
    cancelledPageText: "Bildirim iptal edildi. Bu talep için artık e-posta almayacaksınız.",
    inactivePageText: "Bu bildirim artık aktif değil.",
  },
};

const LOCALE: Record<AssistantLanguage, string> = {
  el: "el-GR", en: "en-GB", de: "de-DE", fr: "fr-FR", it: "it-IT", es: "es-ES", tr: "tr-TR",
};

export function watchLanguage(value: unknown): AssistantLanguage {
  const language = String(value ?? "").toLowerCase() as AssistantLanguage;
  return SUPPORTED.includes(language) ? language : "en";
}

export function watchCopy(language: AssistantLanguage) {
  return COPY[language] || COPY.en;
}

function getSql() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

function isoDate(value: string | Date) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function numericDate(iso: string, language: AssistantLanguage) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(LOCALE[language], { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

function money(value: number, language: AssistantLanguage) {
  return new Intl.NumberFormat(LOCALE[language], { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(value);
}

function parseGroups(value: unknown): number[] {
  const raw = Array.isArray(value) ? value : [];
  return raw.map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= 5).slice(0, 3);
}

export function describeStay(input: { checkin: string; checkout: string; groups: number[]; language: AssistantLanguage }) {
  const copy = watchCopy(input.language);
  const nights = daysBetweenIsoDates(input.checkin, input.checkout);
  const total = input.groups.reduce((sum, guests) => sum + guests, 0);
  const party = input.groups.length > 1
    ? `${copy.rooms(input.groups.length)} · ${copy.guests(total)}`
    : copy.guests(total);
  return `${numericDate(input.checkin, input.language)} – ${numericDate(input.checkout, input.language)} (${copy.nights(nights)}, ${party})`;
}

function cancelUrl(token: string) {
  return `${siteUrl}/api/ai-room-finder/availability-watch/cancel/?token=${encodeURIComponent(token)}`;
}

function emailShell(paragraphs: string[], button?: { href: string; label: string }, footer: string[] = []) {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#29251f;max-width:560px">
      ${paragraphs.map(text => `<p>${text}</p>`).join("")}
      ${button ? `<p style="margin:22px 0"><a href="${escapeHtml(button.href)}" style="display:inline-block;background:#c66a34;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">${escapeHtml(button.label)}</a></p>` : ""}
      ${footer.map(text => `<p style="color:#746b60;font-size:13px">${text}</p>`).join("")}
    </div>
  `;
}

function smtpConfig() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const port = Number(process.env.SMTP_PORT || "465");
  if (!smtpUser || !smtpPass || !smtpFrom) throw new Error("SMTP is not configured.");
  return {
    from: smtpFrom,
    reception: process.env.CONTACT_TO || "chioshotel@gmail.com",
    staffAlerts: process.env.AI_ROOM_FINDER_ALERT_TO || process.env.CONTACT_TO || "chioshotel@gmail.com",
    transport: () => nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user: smtpUser, pass: smtpPass },
    }),
  };
}

function cleanName(value: unknown) {
  return String(value ?? "")
    .replace(/(?:https?:\/\/|www\.)\S*|[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)*\.\p{L}{2,}(?:\/\S*)?/giu, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

export function isValidWatchEmail(value: string) {
  return value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(value);
}

export type CreateWatchInput = {
  email: string;
  firstName?: string;
  language: AssistantLanguage;
  checkin: string;
  checkout: string;
  groups: number[];
  sessionId?: string;
};

export function validateWatchInput(input: CreateWatchInput): string | null {
  if (!isValidWatchEmail(input.email)) return "INVALID_EMAIL";
  if (!isStrictIsoDate(input.checkin) || !isStrictIsoDate(input.checkout) || input.checkout <= input.checkin) return "INVALID_DATES";
  if (input.checkin < todayInAthensIso()) return "INVALID_DATES";
  const nights = daysBetweenIsoDates(input.checkin, input.checkout);
  if (!Number.isInteger(nights) || nights < 1 || nights > WATCH_MAX_STAY_NIGHTS) return "INVALID_DATES";
  if (!input.groups.length || input.groups.length > 3 || input.groups.some(g => !Number.isInteger(g) || g < 1 || g > 5)) return "INVALID_GUESTS";
  return null;
}

/**
 * Stores an alert (or returns the identical active one) and sends the guest a
 * confirmation with a cancel link, plus a lead alert to reception.
 */
export async function createAvailabilityWatch(input: CreateWatchInput) {
  const sql = getSql();
  const email = input.email.trim().toLowerCase();
  const firstName = cleanName(input.firstName);
  const groups = parseGroups(input.groups);
  const groupsJson = JSON.stringify(groups);

  const existing = await sql`
    select id from ai_room_finder_watches
    where lower(email) = ${email}
      and checkin = ${input.checkin}::date
      and checkout = ${input.checkout}::date
      and guest_groups = ${groupsJson}::jsonb
      and status = 'active'
    limit 1
  `;
  if (existing.length) return { created: false };

  const activeRows = await sql`
    select count(*)::int as active from ai_room_finder_watches
    where lower(email) = ${email} and status = 'active'
  `;
  if (Number((activeRows[0] as Record<string, unknown>)?.active || 0) >= MAX_ACTIVE_WATCHES_PER_EMAIL) {
    throw new WatchLimitError();
  }

  const token = randomBytes(24).toString("base64url");
  const sessionId = String(input.sessionId || "").replace(/[^A-Za-z0-9._:-]/g, "").slice(0, 128) || null;
  await sql`
    insert into ai_room_finder_watches (
      session_id, language, email, first_name, checkin, checkout,
      guest_groups, total_guests, cancel_token, privacy_accepted_at
    ) values (
      ${sessionId}, ${input.language}, ${email}, ${firstName || null},
      ${input.checkin}::date, ${input.checkout}::date, ${groupsJson}::jsonb,
      ${groups.reduce((sum, g) => sum + g, 0)}, ${token}, now()
    )
  `;

  // Emails are best effort: the alert itself is stored either way.
  try {
    const smtp = smtpConfig();
    const transporter = smtp.transport();
    const copy = watchCopy(input.language);
    const stay = describeStay({ checkin: input.checkin, checkout: input.checkout, groups, language: input.language });

    if (await checkGlobalHourlyLimit("room-finder:watch-confirmation", WATCH_CONFIRMATIONS_PER_HOUR)) {
      await transporter.sendMail({
        from: `"Voulamandis House" <${smtp.from}>`,
        to: email,
        replyTo: smtp.reception,
        subject: copy.confirmSubject,
        text: [copy.greeting(firstName), "", copy.confirmBody(stay), copy.confirmNothingElse, "", `${copy.cancelLine} ${cancelUrl(token)}`, "", copy.contact, copy.signature].join("\n"),
        html: emailShell(
          [escapeHtml(copy.greeting(firstName)), escapeHtml(copy.confirmBody(stay)), escapeHtml(copy.confirmNothingElse)],
          undefined,
          [`${escapeHtml(copy.cancelLine)} <a href="${escapeHtml(cancelUrl(token))}">${escapeHtml(copy.cancelButton)}</a>`, escapeHtml(copy.contact), escapeHtml(copy.signature)],
        ),
      });
    }

    if (await checkGlobalHourlyLimit("room-finder:watch-staff-alert", STAFF_WATCH_ALERTS_PER_HOUR)) {
      const staffStay = describeStay({ checkin: input.checkin, checkout: input.checkout, groups, language: "el" });
      await transporter.sendMail({
        from: `"Voulamandis House AI Room Finder" <${smtp.from}>`,
        to: smtp.staffAlerts,
        replyTo: email,
        subject: `Ειδοποίηση διαθεσιμότητας: ${staffStay}`,
        text: [
          "Πελάτης δεν βρήκε διαθεσιμότητα και ζήτησε να ειδοποιηθεί αν ανοίξει.",
          `Διαμονή: ${staffStay}`,
          `Email: ${email}`,
          firstName ? `Όνομα: ${firstName}` : "",
          `Γλώσσα: ${input.language.toUpperCase()}`,
          sessionId ? `Συνομιλία: ${siteUrl}/staff/ai-room-finder?session=${encodeURIComponent(sessionId)}` : "",
          "",
          "Το σύστημα θα του στείλει αυτόματα email μόλις υπάρξει διαθεσιμότητα.",
        ].filter(Boolean).join("\n"),
      });
    }
  } catch (error) {
    console.error("AI Room Finder availability watch emails failed", error);
  }

  return { created: true };
}

/** Cheapest assignment of distinct rooms to every guest group, or null. */
function cheapestAssignment(groups: number[], offersByGuests: Map<number, Array<{ room: number; total: number }>>) {
  let best: number | null = null;
  const walk = (index: number, used: Set<number>, sum: number) => {
    if (index === groups.length) {
      if (best === null || sum < best) best = sum;
      return;
    }
    for (const offer of offersByGuests.get(groups[index]) || []) {
      if (used.has(offer.room)) continue;
      used.add(offer.room);
      walk(index + 1, used, sum + offer.total);
      used.delete(offer.room);
    }
  };
  walk(0, new Set(), 0);
  return best === null ? null : Math.round(best * 100) / 100;
}

export type WatchCheckResult = {
  checked: number;
  available: number;
  notified: number;
  expired: number;
  deleted: number;
  skippedNotReady: number;
};

/**
 * Checks every active alert against live inventory and emails guests whose
 * dates opened up. Safe to run concurrently: each alert is claimed atomically
 * before its email is sent, so nobody is notified twice.
 */
export async function runAvailabilityWatchCheck(): Promise<WatchCheckResult> {
  const sql = getSql();
  const today = todayInAthensIso();
  const result: WatchCheckResult = { checked: 0, available: 0, notified: 0, expired: 0, deleted: 0, skippedNotReady: 0 };

  const expired = await sql`
    update ai_room_finder_watches set status = 'expired', updated_at = now()
    where status = 'active' and checkin < ${today}::date
    returning id
  `;
  result.expired = expired.length;

  const deleted = await sql`
    delete from ai_room_finder_watches
    where checkout < ${today}::date - ${RETENTION_DAYS_AFTER_CHECKOUT}::int
    returning id
  `;
  result.deleted = deleted.length;

  // A checker that died mid-send leaves an alert in 'notifying'; release it.
  await sql`
    update ai_room_finder_watches set status = 'active', updated_at = now()
    where status = 'notifying' and updated_at < now() - interval '30 minutes'
  `;

  const watches = await sql`
    select id, language, email, first_name, checkin, checkout, guest_groups, total_guests, cancel_token, session_id
    from ai_room_finder_watches
    where status = 'active'
    order by checkin, id
    limit ${MAX_WATCHES_PER_RUN}
  ` as unknown as WatchRow[];
  if (!watches.length) return result;

  const readiness = new Map<string, boolean>();
  const offersCache = new Map<string, Array<{ room: number; total: number }>>();
  let smtp: ReturnType<typeof smtpConfig> | null = null;
  let transporter: Transporter | null = null;
  const checkedIds: number[] = [];

  for (const watch of watches) {
    const checkin = isoDate(watch.checkin);
    const checkout = isoDate(watch.checkout);
    const groups = parseGroups(watch.guest_groups);
    if (!groups.length) continue;
    const stayKey = `${checkin}:${checkout}`;

    if (!readiness.has(stayKey)) {
      const statusRows = await sql`select * from booking_core.inventory_status(${checkin}::date, ${checkout}::date)`;
      readiness.set(stayKey, String((statusRows[0] as Record<string, unknown>)?.status || "") === "READY");
    }
    if (!readiness.get(stayKey)) {
      result.skippedNotReady += 1;
      continue;
    }

    const offersByGuests = new Map<number, Array<{ room: number; total: number }>>();
    for (const guests of new Set(groups)) {
      const key = `${stayKey}:${guests}`;
      if (!offersCache.has(key)) {
        const rows = await sql`select room_number, direct_total from booking_core.search_availability(${checkin}::date, ${checkout}::date, ${guests})`;
        offersCache.set(key, (rows as Array<Record<string, unknown>>).map(row => ({
          room: Number(row.room_number),
          total: Number(row.direct_total),
        })));
      }
      offersByGuests.set(guests, offersCache.get(key) || []);
    }

    result.checked += 1;
    checkedIds.push(watch.id);
    const total = cheapestAssignment(groups, offersByGuests);
    if (total === null) continue;
    result.available += 1;
    if (result.notified >= MAX_NOTIFICATIONS_PER_RUN) continue;

    const claimed = await sql`
      update ai_room_finder_watches set status = 'notifying', updated_at = now()
      where id = ${watch.id} and status = 'active'
      returning id
    `;
    if (!claimed.length) continue;

    try {
      smtp ||= smtpConfig();
      transporter ||= smtp.transport();
      const language = watchLanguage(watch.language);
      const copy = watchCopy(language);
      const stay = describeStay({ checkin, checkout, groups, language });
      const price = money(total, language);
      const roomFinderUrl = `${siteUrl}${ROOM_FINDER_HREFS[language]}`;
      const firstName = cleanName(watch.first_name);

      const info = await transporter.sendMail({
        from: `"Voulamandis House" <${smtp.from}>`,
        to: watch.email,
        replyTo: smtp.reception,
        subject: copy.notifySubject,
        text: [
          copy.greeting(firstName), "", copy.notifyBody(stay), copy.notifyPrice(price), copy.notifyHurry, "",
          `${copy.notifyButton}: ${roomFinderUrl}`, copy.contact, "", copy.notifyOnce, "", copy.signature,
        ].join("\n"),
        html: emailShell(
          [escapeHtml(copy.greeting(firstName)), escapeHtml(copy.notifyBody(stay)), `<strong>${escapeHtml(copy.notifyPrice(price))}</strong>`, escapeHtml(copy.notifyHurry)],
          { href: roomFinderUrl, label: copy.notifyButton },
          [escapeHtml(copy.contact), escapeHtml(copy.notifyOnce), escapeHtml(copy.signature)],
        ),
      });
      const accepted = (info.accepted || []).map(String).map(value => value.toLowerCase());
      if (!accepted.includes(watch.email.toLowerCase())) throw new Error("Guest address was not accepted by SMTP.");

      await sql`
        update ai_room_finder_watches
        set status = 'notified', notified_at = now(), notified_total = ${total}, last_checked_at = now(), updated_at = now()
        where id = ${watch.id}
      `;
      result.notified += 1;

      try {
        const staffStay = describeStay({ checkin, checkout, groups, language: "el" });
        await transporter.sendMail({
          from: `"Voulamandis House AI Room Finder" <${smtp.from}>`,
          to: smtp.staffAlerts,
          replyTo: watch.email,
          subject: `Άνοιξε διαθεσιμότητα — ειδοποιήθηκε ${watch.email}`,
          text: [
            "Ο πελάτης είχε ζητήσει ειδοποίηση και μόλις του στάλθηκε email ότι άνοιξε διαθεσιμότητα.",
            `Διαμονή: ${staffStay}`,
            `Τιμή απευθείας από: ${money(total, "el")}`,
            `Email: ${watch.email}`,
            firstName ? `Όνομα: ${firstName}` : "",
            watch.session_id ? `Συνομιλία: ${siteUrl}/staff/ai-room-finder?session=${encodeURIComponent(watch.session_id)}` : "",
            "",
            "Αξίζει ένα τηλεφώνημα ή μήνυμα για να κλείσει η κράτηση.",
          ].filter(Boolean).join("\n"),
        });
      } catch (error) {
        console.error("AI Room Finder watch staff alert failed", error);
      }
    } catch (error) {
      console.error("AI Room Finder availability alert email failed", error);
      await sql`update ai_room_finder_watches set status = 'active', updated_at = now() where id = ${watch.id} and status = 'notifying'`;
    }
  }

  if (checkedIds.length) {
    await sql`update ai_room_finder_watches set last_checked_at = now() where id = any(${checkedIds}::bigint[]) and status = 'active'`;
  }

  return result;
}

export async function getWatchByToken(token: string) {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return null;
  const rows = await getSql()`
    select status, language, checkin, checkout, guest_groups from ai_room_finder_watches
    where cancel_token = ${token} limit 1
  `;
  const row = rows[0] as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    status: String(row.status),
    language: watchLanguage(row.language),
    checkin: isoDate(row.checkin as string | Date),
    checkout: isoDate(row.checkout as string | Date),
    groups: parseGroups(row.guest_groups),
  };
}

export async function cancelWatchByToken(token: string) {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return false;
  const rows = await getSql()`
    update ai_room_finder_watches set status = 'cancelled', updated_at = now()
    where cancel_token = ${token} and status in ('active', 'notifying')
    returning id
  `;
  return rows.length > 0;
}
