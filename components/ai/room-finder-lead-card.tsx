"use client";

import { BellRing, MessageCircle, Phone } from "lucide-react";
import { useId, useState } from "react";
import { trackLead } from "@/lib/analytics/lead";
import { getRoomFinderSessionId } from "./room-finder-chat-ui";
import type { RoomFinderLanguage } from "./room-finder-copy";

// Shown under assistant messages that end the automated flow (no
// availability, 4+ rooms, very large groups, interpreter failure), so a guest
// who cannot continue can still leave a phone number or email for reception
// instead of disappearing. It reuses the existing enquiry e-mail endpoint,
// which also links the details to the conversation in the staff inbox.

type LeadCopy = {
  title: string;
  help: string;
  name: string;
  phone: string;
  email: string;
  note: string;
  needContact: string;
  send: string;
  sending: string;
  sent: string;
  error: string;
  call: string;
  whatsapp: string;
};

const LEAD_COPY: Record<RoomFinderLanguage, LeadCopy> = {
  el: {
    title: "Να σας απαντήσει η reception;",
    help: "Αφήστε όνομα και τηλέφωνο ή email. Θα σας απαντήσουμε προσωπικά με διαθεσιμότητα και τιμές.",
    name: "Ονοματεπώνυμο",
    phone: "Τηλέφωνο",
    email: "Email",
    note: "Κάτι ακόμα που θέλετε να ξέρουμε; (προαιρετικό)",
    needContact: "Συμπληρώστε τηλέφωνο ή email.",
    send: "Αποστολή στη reception",
    sending: "Αποστολή…",
    sent: "Ευχαριστούμε! Λάβαμε το αίτημά σας και θα επικοινωνήσουμε μαζί σας σύντομα.",
    error: "Δεν ήταν δυνατή η αποστολή. Καλέστε μας ή στείλτε μας στο WhatsApp.",
    call: "Κλήση",
    whatsapp: "WhatsApp",
  },
  en: {
    title: "Would you like reception to reply?",
    help: "Leave your name and a phone number or email. We’ll reply personally with availability and prices.",
    name: "Full name",
    phone: "Phone",
    email: "Email",
    note: "Anything else we should know? (optional)",
    needContact: "Please add a phone number or email.",
    send: "Send to reception",
    sending: "Sending…",
    sent: "Thank you! We received your request and will contact you shortly.",
    error: "The request could not be sent. Please call us or message us on WhatsApp.",
    call: "Call",
    whatsapp: "WhatsApp",
  },
  de: {
    title: "Soll die Rezeption Ihnen antworten?",
    help: "Hinterlassen Sie Ihren Namen und eine Telefonnummer oder E-Mail. Wir antworten persönlich mit Verfügbarkeit und Preisen.",
    name: "Vor- und Nachname",
    phone: "Telefon",
    email: "E-Mail",
    note: "Sonst noch etwas, das wir wissen sollten? (optional)",
    needContact: "Bitte geben Sie eine Telefonnummer oder E-Mail an.",
    send: "An die Rezeption senden",
    sending: "Wird gesendet…",
    sent: "Vielen Dank! Wir haben Ihre Anfrage erhalten und melden uns in Kürze.",
    error: "Die Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns an oder schreiben Sie uns über WhatsApp.",
    call: "Anrufen",
    whatsapp: "WhatsApp",
  },
  fr: {
    title: "Souhaitez-vous une réponse de la réception ?",
    help: "Laissez votre nom et un numéro de téléphone ou un e-mail. Nous vous répondrons personnellement avec disponibilités et tarifs.",
    name: "Nom et prénom",
    phone: "Téléphone",
    email: "E-mail",
    note: "Autre chose à nous préciser ? (facultatif)",
    needContact: "Indiquez un numéro de téléphone ou un e-mail.",
    send: "Envoyer à la réception",
    sending: "Envoi…",
    sent: "Merci ! Nous avons bien reçu votre demande et vous contacterons rapidement.",
    error: "La demande n’a pas pu être envoyée. Appelez-nous ou écrivez-nous sur WhatsApp.",
    call: "Appeler",
    whatsapp: "WhatsApp",
  },
  it: {
    title: "Volete una risposta dalla reception?",
    help: "Lasciate nome e un numero di telefono o un’email. Vi risponderemo personalmente con disponibilità e prezzi.",
    name: "Nome e cognome",
    phone: "Telefono",
    email: "Email",
    note: "Altro che dovremmo sapere? (facoltativo)",
    needContact: "Inserite un numero di telefono o un’email.",
    send: "Invia alla reception",
    sending: "Invio…",
    sent: "Grazie! Abbiamo ricevuto la richiesta e vi contatteremo a breve.",
    error: "Non è stato possibile inviare la richiesta. Chiamateci o scriveteci su WhatsApp.",
    call: "Chiama",
    whatsapp: "WhatsApp",
  },
  es: {
    title: "¿Quieren que recepción les responda?",
    help: "Dejen su nombre y un teléfono o email. Les responderemos personalmente con disponibilidad y precios.",
    name: "Nombre y apellidos",
    phone: "Teléfono",
    email: "Email",
    note: "¿Algo más que debamos saber? (opcional)",
    needContact: "Indiquen un teléfono o un email.",
    send: "Enviar a recepción",
    sending: "Enviando…",
    sent: "¡Gracias! Hemos recibido su solicitud y les contactaremos en breve.",
    error: "No se pudo enviar la solicitud. Llámennos o escríbannos por WhatsApp.",
    call: "Llamar",
    whatsapp: "WhatsApp",
  },
  tr: {
    title: "Resepsiyonun size dönmesini ister misiniz?",
    help: "Adınızı ve bir telefon numarası ya da e-posta bırakın. Müsaitlik ve fiyatlarla size kişisel olarak dönüş yapalım.",
    name: "Ad soyad",
    phone: "Telefon",
    email: "E-posta",
    note: "Bilmemiz gereken başka bir şey var mı? (isteğe bağlı)",
    needContact: "Lütfen bir telefon numarası veya e-posta ekleyin.",
    send: "Resepsiyona gönder",
    sending: "Gönderiliyor…",
    sent: "Teşekkürler! Talebinizi aldık, kısa süre içinde sizinle iletişime geçeceğiz.",
    error: "Talep gönderilemedi. Lütfen bizi arayın veya WhatsApp’tan yazın.",
    call: "Ara",
    whatsapp: "WhatsApp",
  },
};

// When nothing is available the form opens on request, and the cancellation
// alert is a checkbox in it, so the guest sees one short card, not two forms.
const LEAD_EXTRA: Record<RoomFinderLanguage, {
  open: string;
  watch: string;
  watchNeedsEmail: string;
  watchSent: string;
}> = {
  el: {
    open: "Να σας απαντήσει η reception",
    watch: "Ειδοποιήστε με με email αν ελευθερωθούν αυτές οι ημερομηνίες",
    watchNeedsEmail: "Για την ειδοποίηση χρειάζεται email.",
    watchSent: "Θα σας στείλουμε email αν ελευθερωθούν οι ημερομηνίες σας.",
  },
  en: {
    open: "Have reception reply to me",
    watch: "Email me if these dates become available",
    watchNeedsEmail: "The alert needs an email address.",
    watchSent: "We’ll email you if your dates become available.",
  },
  de: {
    open: "Antwort von der Rezeption",
    watch: "Per E-Mail benachrichtigen, wenn diese Daten frei werden",
    watchNeedsEmail: "Für die Benachrichtigung wird eine E-Mail-Adresse benötigt.",
    watchSent: "Wir schreiben Ihnen, sobald Ihre Daten frei werden.",
  },
  fr: {
    open: "Être recontacté par la réception",
    watch: "Me prévenir par e-mail si ces dates se libèrent",
    watchNeedsEmail: "L’alerte nécessite une adresse e-mail.",
    watchSent: "Nous vous écrirons si vos dates se libèrent.",
  },
  it: {
    open: "Fatevi rispondere dalla reception",
    watch: "Avvisatemi via email se queste date si liberano",
    watchNeedsEmail: "Per l’avviso serve un indirizzo email.",
    watchSent: "Vi scriveremo se le vostre date si liberano.",
  },
  es: {
    open: "Que me responda la recepción",
    watch: "Avisarme por correo si estas fechas quedan libres",
    watchNeedsEmail: "Para el aviso se necesita un correo electrónico.",
    watchSent: "Le escribiremos si sus fechas quedan libres.",
  },
  tr: {
    open: "Resepsiyon bana dönsün",
    watch: "Bu tarihler müsait olursa bana e-posta gönderin",
    watchNeedsEmail: "Bildirim için e-posta adresi gerekir.",
    watchSent: "Tarihleriniz müsait olursa size e-posta göndereceğiz.",
  },
};

export type LeadStatus = "idle" | "sending" | "sent" | "error";

type LeadCardProps = {
  language: RoomFinderLanguage;
  callNumber: string;
  privacyShort: string;
  privacyMore: string;
  privacyNotice: string;
  /** One line per known booking fact, for the reception e-mail. */
  bookingFacts: string[];
  /** What the guest wrote, so reception has the full request. */
  guestMessages: string[];
  reason: string;
  status: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
  onWhatsApp: () => void;
  /** Only the latest lead message shows the form; older ones keep the buttons. */
  showForm: boolean;
  /** The form stays behind a button until the guest asks for it. */
  collapsed?: boolean;
  /** No availability: offer the cancellation alert for these dates in the form. */
  watch?: { checkin: string; checkout: string; groups: number[] } | null;
};

const INPUT_CLASS = "h-12 w-full min-w-0 rounded-2xl border border-[#d8cec1] bg-white px-3.5 text-[16px]";

export function RoomFinderLeadCard({
  language,
  callNumber,
  privacyShort,
  privacyMore,
  privacyNotice,
  bookingFacts,
  guestMessages,
  reason,
  status,
  onStatusChange,
  onWhatsApp,
  showForm,
  collapsed = false,
  watch = null,
}: LeadCardProps) {
  const copy = LEAD_COPY[language];
  const extra = LEAD_EXTRA[language];
  const id = useId();
  const [open, setOpen] = useState(!collapsed);
  const [watchWanted, setWatchWanted] = useState(false);
  const [watchSaved, setWatchSaved] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const hasContact = Boolean(phone.trim() || email.trim());
  const watchMissingEmail = Boolean(watch && watchWanted && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()));
  const canSend = Boolean(name.trim() && hasContact && privacyAccepted && !watchMissingEmail && status !== "sending");

  async function saveWatch(privacyAcceptedAt: string) {
    if (!watch || !watchWanted) return;
    try {
      const response = await fetch("/api/ai-room-finder/availability-watch/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: name.trim().split(/\s+/)[0]?.slice(0, 60) || undefined,
          language,
          checkin: watch.checkin,
          checkout: watch.checkout,
          groups: watch.groups,
          privacyAccepted: true,
          privacyAcceptedAt,
          sessionId: getRoomFinderSessionId(),
        }),
      });
      const payload = await response.json().catch(() => null);
      setWatchSaved(Boolean(response.ok && payload?.ok));
    } catch {
      setWatchSaved(false);
    }
  }

  async function send() {
    if (!canSend) return;
    onStatusChange("sending");
    const privacyAcceptedAt = new Date().toISOString();
    const lines = [
      "Ο επισκέπτης ζήτησε να επικοινωνήσει μαζί του η reception από το AI Room Finder.",
      `Αιτία: ${reason}`,
      "",
      ...(bookingFacts.length ? ["Στοιχεία αναζήτησης:", ...bookingFacts.map(fact => `• ${fact}`), ""] : []),
      ...(guestMessages.length ? ["Τι έγραψε ο επισκέπτης:", ...guestMessages.map(message => `• ${message}`), ""] : []),
      ...(note.trim() ? [`Σημείωση επισκέπτη: ${note.trim()}`, ""] : []),
      ...(watch && watchWanted ? ["Ζήτησε ειδοποίηση με email αν ελευθερωθούν οι ημερομηνίες.", ""] : []),
      `Όνομα: ${name.trim()}`,
      `Τηλέφωνο: ${phone.trim() || "—"}`,
      `Email: ${email.trim() || "—"}`,
      `Γλώσσα: ${language.toUpperCase()}`,
      `Αποδοχή ενημέρωσης προσωπικών δεδομένων: ${privacyAcceptedAt}`,
    ];

    try {
      const response = await fetch("/api/ai-assistant/summary-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "ai-room-finder",
          subject: `AI Room Finder — Επικοινωνία: ${name.trim()}`,
          message: lines.join("\n"),
          guest: {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            privacyAccepted: true,
            privacyAcceptedAt,
          },
        }),
      });
      if (!response.ok) throw new Error(`Lead send failed: ${response.status}`);
      await saveWatch(privacyAcceptedAt);
      onStatusChange("sent");
      trackLead("ai_room_finder_contact", { lead_channel: "email" });
    } catch (error) {
      console.error("Room Finder lead request failed", error);
      onStatusChange("error");
    }
  }

  return (
    <section
      aria-label={copy.title}
      className="msg ml-10 mt-2 overflow-hidden rounded-[22px] border border-[#dfd6ca] bg-white shadow-sm"
    >
      <div className="grid grid-cols-2 gap-2 p-3">
        <a
          href={`tel:${callNumber}`}
          aria-label={`${copy.call} ${callNumber}`}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#c66a34] px-3 font-bold text-white transition hover:bg-[#ad572a] active:scale-[.97]"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          {copy.call}
        </a>
        <button
          type="button"
          onClick={onWhatsApp}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#287d4f] px-3 font-bold text-white transition hover:bg-[#20663f] active:scale-[.97]"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {copy.whatsapp}
        </button>
      </div>

      {showForm && status === "sent" && (
        <p role="status" className="mx-3 mb-3 rounded-2xl bg-[#eef4e7] p-3 text-[14px] font-bold text-[#5f7448]">
          {copy.sent}
          {watchSaved && <span className="mt-1 flex items-start gap-1.5 font-semibold"><BellRing className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{extra.watchSent}</span>}
        </p>
      )}

      {showForm && status !== "sent" && !open && (
        <div className="px-3 pb-3">
          <button
            type="button"
            data-room-finder-lead-open="true"
            onClick={() => setOpen(true)}
            className="min-h-12 w-full rounded-2xl border border-[#d8cec1] bg-[#fcfaf7] px-4 text-[15px] font-bold text-[#4a4339] transition hover:bg-[#fffaf4] active:scale-[.98]"
          >
            {extra.open}
          </button>
        </div>
      )}

      {showForm && status !== "sent" && open && (
        <form
          className="border-t border-[#eee6db] bg-[#fcfaf7] px-4 pb-4 pt-3.5"
          onSubmit={event => {
            event.preventDefault();
            void send();
          }}
        >
          <h3 className="text-[16px] font-black text-[#29251f]">{copy.title}</h3>
          <p className="mt-0.5 text-[13px] leading-[18px] text-[#746b60]">{copy.help}</p>
          <div className="mt-3 space-y-2">
            <div>
              <label htmlFor={`${id}-name`} className="sr-only">{copy.name}</label>
              <input
                id={`${id}-name`}
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={event => setName(event.target.value)}
                placeholder={`${copy.name} *`}
                className={INPUT_CLASS}
              />
            </div>
            <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor={`${id}-phone`} className="sr-only">{copy.phone}</label>
                <input
                  id={`${id}-phone`}
                  name="tel"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={event => setPhone(event.target.value)}
                  placeholder={copy.phone}
                  className={INPUT_CLASS}
                />
              </div>
              <div className="min-w-0">
                <label htmlFor={`${id}-email`} className="sr-only">{copy.email}</label>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder={copy.email}
                  className={INPUT_CLASS}
                />
              </div>
            </div>
            {!hasContact && (name.trim().length > 0) && (
              <p className="px-1 text-[12px] font-semibold text-[#8a6a4e]">{copy.needContact}</p>
            )}
            <div>
              <label htmlFor={`${id}-note`} className="sr-only">{copy.note}</label>
              <textarea
                id={`${id}-note`}
                name="note"
                rows={2}
                maxLength={800}
                value={note}
                onChange={event => setNote(event.target.value)}
                placeholder={copy.note}
                className="w-full min-w-0 resize-none rounded-2xl border border-[#d8cec1] bg-white px-3.5 py-3 text-[16px] leading-6"
              />
            </div>
            {watch && (
              <div className="px-1 pt-1 text-[13px] leading-[18px] text-[#625b52]">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    data-room-finder-lead-watch="true"
                    checked={watchWanted}
                    onChange={event => setWatchWanted(event.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-[#c66a34]"
                  />
                  <span className="flex items-start gap-1.5">
                    <BellRing className="mt-px h-4 w-4 shrink-0 text-[#c66a34]" aria-hidden="true" />
                    {extra.watch}
                  </span>
                </label>
                {watchMissingEmail && (
                  <p className="mt-1 pl-8 text-[12px] font-semibold text-[#8a6a4e]">{extra.watchNeedsEmail}</p>
                )}
              </div>
            )}
            <div className="flex items-start gap-3 px-1 pt-1 text-[13px] leading-[18px] text-[#625b52]">
              <input
                id={`${id}-privacy`}
                type="checkbox"
                required
                checked={privacyAccepted}
                onChange={event => setPrivacyAccepted(event.target.checked)}
                aria-describedby={`${id}-privacy-full`}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[#66714f]"
              />
              <div className="min-w-0">
                <label htmlFor={`${id}-privacy`} className="cursor-pointer">{privacyShort}</label>
                <details className="mt-1">
                  <summary className="w-fit cursor-pointer text-[12px] font-bold text-[#8a6a4e] underline underline-offset-2">{privacyMore}</summary>
                  <p id={`${id}-privacy-full`} className="mt-1.5 text-[12px] leading-[17px] text-[#746b60]">{privacyNotice}</p>
                </details>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={!canSend}
            className="mt-3.5 min-h-12 w-full rounded-full bg-[#66714f] px-5 text-[15px] font-bold text-white transition hover:bg-[#5a6446] active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {status === "sending" ? copy.sending : copy.send}
          </button>
          {status === "error" && (
            <p role="alert" className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{copy.error}</p>
          )}
        </form>
      )}
    </section>
  );
}
