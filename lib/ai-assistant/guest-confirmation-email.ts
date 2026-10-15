import type { AssistantLanguage } from "@/lib/ai-assistant/types";

// Copy of a Room Finder enquiry sent to the guest's own email address, so
// they keep the rooms, dates and direct price they saw on the site.
//
// The address is supplied by the visitor, so the email is built from a fixed
// server-side template. Only the summary lines come from the browser, and
// they are trimmed, link-stripped and escaped so the endpoint cannot be used
// to send arbitrary content.

const SUPPORTED: AssistantLanguage[] = ["el", "en", "de", "fr", "it", "es", "tr"];
const MAX_LINES = 12;
const MAX_LINE_CHARS = 200;
const CALL_NUMBER = "+30 694 476 4654";
const WHATSAPP_NUMBER = "+30 694 447 4226";

// Any URL or domain-like token ("bit.ly/x", "pay-here.xyz"). Dates and prices
// ("10.04.", "283,50 €") are digits, so they never match.
const LINK_PATTERN = /(?:https?:\/\/|www\.)\S*|[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)*\.\p{L}{2,}(?:\/\S*)?/giu;

type Copy = {
  subject: string;
  greeting: (name: string) => string;
  intro: string;
  summaryTitle: string;
  priceNote: string;
  contact: string;
  signature: string;
};

const COPY: Record<AssistantLanguage, Copy> = {
  el: {
    subject: "Το αίτημά σας στο Voulamandis House",
    greeting: name => `Γεια σας ${name},`,
    intro: "Λάβαμε το αίτημά σας για απευθείας κράτηση. Η reception θα επικοινωνήσει μαζί σας σύντομα για να επιβεβαιώσει τη διαθεσιμότητα και την κράτηση.",
    summaryTitle: "Η σύνοψη του αιτήματός σας:",
    priceNote: "Οι τιμές είναι οι τιμές απευθείας κράτησης που είδατε στο site και επιβεβαιώνονται από τη reception. Αυτό το μήνυμα δεν αποτελεί επιβεβαίωση κράτησης.",
    contact: `Για οτιδήποτε χρειαστείτε: τηλέφωνο ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}. Μπορείτε επίσης να απαντήσετε σε αυτό το email.`,
    signature: "Voulamandis House · Κάμπος, Χίος",
  },
  en: {
    subject: "Your request to Voulamandis House",
    greeting: name => `Hello ${name},`,
    intro: "We have received your direct booking request. Our reception will contact you shortly to confirm availability and your booking.",
    summaryTitle: "Summary of your request:",
    priceNote: "Prices are the direct booking prices you saw on our website and are confirmed by reception. This message is not a booking confirmation.",
    contact: `If you need anything: phone ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}. You can also simply reply to this email.`,
    signature: "Voulamandis House · Kambos, Chios",
  },
  de: {
    subject: "Ihre Anfrage an das Voulamandis House",
    greeting: name => `Hallo ${name},`,
    intro: "Wir haben Ihre Direktbuchungsanfrage erhalten. Unsere Rezeption meldet sich in Kürze, um Verfügbarkeit und Buchung zu bestätigen.",
    summaryTitle: "Zusammenfassung Ihrer Anfrage:",
    priceNote: "Die Preise sind die Direktbuchungspreise von unserer Website und werden von der Rezeption bestätigt. Diese Nachricht ist keine Buchungsbestätigung.",
    contact: `Bei Fragen: Telefon ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}. Sie können auch einfach auf diese E-Mail antworten.`,
    signature: "Voulamandis House · Kambos, Chios",
  },
  fr: {
    subject: "Votre demande à Voulamandis House",
    greeting: name => `Bonjour ${name},`,
    intro: "Nous avons bien reçu votre demande de réservation directe. Notre réception vous contactera rapidement pour confirmer la disponibilité et votre réservation.",
    summaryTitle: "Récapitulatif de votre demande :",
    priceNote: "Les prix sont les tarifs de réservation directe affichés sur notre site et sont confirmés par la réception. Ce message n’est pas une confirmation de réservation.",
    contact: `Pour toute question : téléphone ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}. Vous pouvez aussi répondre directement à cet e-mail.`,
    signature: "Voulamandis House · Kambos, Chios",
  },
  it: {
    subject: "La vostra richiesta a Voulamandis House",
    greeting: name => `Gentile ${name},`,
    intro: "Abbiamo ricevuto la vostra richiesta di prenotazione diretta. La nostra reception vi contatterà a breve per confermare disponibilità e prenotazione.",
    summaryTitle: "Riepilogo della richiesta:",
    priceNote: "I prezzi sono le tariffe di prenotazione diretta mostrate sul nostro sito e vengono confermati dalla reception. Questo messaggio non è una conferma di prenotazione.",
    contact: `Per qualsiasi necessità: telefono ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}. Potete anche rispondere a questa email.`,
    signature: "Voulamandis House · Kambos, Chios",
  },
  es: {
    subject: "Su solicitud a Voulamandis House",
    greeting: name => `Hola ${name}:`,
    intro: "Hemos recibido su solicitud de reserva directa. Nuestra recepción se pondrá en contacto con usted en breve para confirmar la disponibilidad y la reserva.",
    summaryTitle: "Resumen de su solicitud:",
    priceNote: "Los precios son las tarifas de reserva directa que vio en nuestra web y los confirma la recepción. Este mensaje no es una confirmación de reserva.",
    contact: `Para cualquier consulta: teléfono ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}. También puede responder a este correo.`,
    signature: "Voulamandis House · Kambos, Quíos",
  },
  tr: {
    subject: "Voulamandis House talebiniz",
    greeting: name => `Merhaba ${name},`,
    intro: "Doğrudan rezervasyon talebinizi aldık. Resepsiyonumuz müsaitliği ve rezervasyonunuzu onaylamak için kısa süre içinde sizinle iletişime geçecek.",
    summaryTitle: "Talebinizin özeti:",
    priceNote: "Fiyatlar web sitemizde gördüğünüz doğrudan rezervasyon fiyatlarıdır ve resepsiyon tarafından onaylanır. Bu mesaj bir rezervasyon onayı değildir.",
    contact: `Her türlü sorunuz için: telefon ${CALL_NUMBER} · WhatsApp ${WHATSAPP_NUMBER}. Bu e-postayı yanıtlayarak da bize ulaşabilirsiniz.`,
    signature: "Voulamandis House · Kambos, Sakız",
  },
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function cleanGuestText(value: unknown, maxChars: number) {
  return String(value ?? "")
    .replace(LINK_PATTERN, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxChars);
}

export function guestLanguage(value: unknown): AssistantLanguage {
  const language = String(value ?? "").toLowerCase() as AssistantLanguage;
  return SUPPORTED.includes(language) ? language : "en";
}

export function buildGuestConfirmationEmail(input: {
  language: AssistantLanguage;
  firstName: unknown;
  lines: unknown;
}) {
  const copy = COPY[input.language] || COPY.en;
  const name = cleanGuestText(input.firstName, 60) || "";
  const lines = (Array.isArray(input.lines) ? input.lines : [])
    .slice(0, MAX_LINES)
    .map(line => cleanGuestText(line, MAX_LINE_CHARS))
    .filter(Boolean);
  if (!lines.length) return null;

  const greeting = name ? copy.greeting(name) : copy.greeting("").replace(/\s+([,:])$/, "$1");
  const text = [
    greeting,
    "",
    copy.intro,
    "",
    copy.summaryTitle,
    ...lines.map(line => `• ${line}`),
    "",
    copy.priceNote,
    "",
    copy.contact,
    "",
    copy.signature,
  ].join("\n");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#29251f;max-width:560px">
      <p>${escapeHtml(greeting)}</p>
      <p>${escapeHtml(copy.intro)}</p>
      <p style="margin-bottom:6px"><strong>${escapeHtml(copy.summaryTitle)}</strong></p>
      <ul style="margin-top:0;padding-left:20px">${lines.map(line => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
      <p style="color:#625b52;font-size:14px">${escapeHtml(copy.priceNote)}</p>
      <p>${escapeHtml(copy.contact)}</p>
      <p style="color:#625b52">${escapeHtml(copy.signature)}</p>
    </div>
  `;

  return { subject: copy.subject, text, html };
}
