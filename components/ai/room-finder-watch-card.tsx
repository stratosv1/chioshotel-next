"use client";

import { BellRing } from "lucide-react";
import { useId, useState } from "react";
import { getRoomFinderSessionId } from "./room-finder-chat-ui";
import type { RoomFinderLanguage } from "./room-finder-copy";

// Shown when the live search found no rooms: the guest leaves an email and is
// notified once if a cancellation opens their exact dates.
// Backed by /api/ai-room-finder/availability-watch.

type WatchCopy = {
  title: string;
  help: string;
  firstName: string;
  email: string;
  submit: string;
  sending: string;
  sent: (email: string) => string;
  limit: string;
  error: string;
};

const WATCH_COPY: Record<RoomFinderLanguage, WatchCopy> = {
  el: {
    title: "Να σας ειδοποιήσουμε αν ανοίξει διαθεσιμότητα;",
    help: "Αν ακυρωθεί κράτηση για τις ημερομηνίες σας, θα σας στείλουμε αμέσως email με την τιμή απευθείας κράτησης. Μία ειδοποίηση, χωρίς διαφημίσεις.",
    firstName: "Όνομα (προαιρετικό)",
    email: "Email",
    submit: "Ειδοποιήστε με",
    sending: "Καταχώριση…",
    sent: email => `Έτοιμο! Θα σας ειδοποιήσουμε στο ${email} μόλις ανοίξει διαθεσιμότητα.`,
    limit: "Έχετε ήδη αρκετές ενεργές ειδοποιήσεις. Καλέστε μας ή στείλτε μας στο WhatsApp.",
    error: "Δεν ήταν δυνατή η καταχώριση. Δοκιμάστε ξανά ή επικοινωνήστε μαζί μας.",
  },
  en: {
    title: "Shall we let you know if these dates open up?",
    help: "If a booking for your dates is cancelled, we’ll email you right away with the direct booking price. One alert, no marketing.",
    firstName: "First name (optional)",
    email: "Email",
    submit: "Notify me",
    sending: "Saving…",
    sent: email => `Done! We’ll email ${email} as soon as your dates become available.`,
    limit: "You already have several active alerts. Please call us or message us on WhatsApp.",
    error: "The alert could not be saved. Please try again or contact us.",
  },
  de: {
    title: "Sollen wir Sie benachrichtigen, wenn Ihre Daten frei werden?",
    help: "Wird eine Buchung für Ihre Daten storniert, senden wir Ihnen sofort eine E-Mail mit dem Direktbuchungspreis. Eine Nachricht, keine Werbung.",
    firstName: "Vorname (optional)",
    email: "E-Mail",
    submit: "Benachrichtigen",
    sending: "Wird gespeichert…",
    sent: email => `Erledigt! Wir schreiben an ${email}, sobald Ihre Daten frei werden.`,
    limit: "Sie haben bereits mehrere aktive Benachrichtigungen. Rufen Sie uns an oder schreiben Sie uns per WhatsApp.",
    error: "Die Benachrichtigung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.",
  },
  fr: {
    title: "Voulez-vous être prévenu si vos dates se libèrent ?",
    help: "Si une réservation est annulée pour vos dates, nous vous enverrons aussitôt un e-mail avec le tarif de réservation directe. Une seule alerte, sans publicité.",
    firstName: "Prénom (facultatif)",
    email: "E-mail",
    submit: "Me prévenir",
    sending: "Enregistrement…",
    sent: email => `C’est noté ! Nous écrirons à ${email} dès que vos dates seront disponibles.`,
    limit: "Vous avez déjà plusieurs alertes actives. Appelez-nous ou écrivez-nous sur WhatsApp.",
    error: "L’alerte n’a pas pu être enregistrée. Réessayez ou contactez-nous.",
  },
  it: {
    title: "Volete essere avvisati se le vostre date si liberano?",
    help: "Se una prenotazione per le vostre date viene cancellata, vi invieremo subito un’email con il prezzo di prenotazione diretta. Un solo avviso, niente pubblicità.",
    firstName: "Nome (facoltativo)",
    email: "Email",
    submit: "Avvisatemi",
    sending: "Salvataggio…",
    sent: email => `Fatto! Scriveremo a ${email} appena le vostre date saranno disponibili.`,
    limit: "Avete già diversi avvisi attivi. Chiamateci o scriveteci su WhatsApp.",
    error: "Non è stato possibile salvare l’avviso. Riprovate o contattateci.",
  },
  es: {
    title: "¿Le avisamos si se liberan sus fechas?",
    help: "Si se cancela una reserva para sus fechas, le enviaremos enseguida un correo con el precio de reserva directa. Un solo aviso, sin publicidad.",
    firstName: "Nombre (opcional)",
    email: "Correo electrónico",
    submit: "Avisarme",
    sending: "Guardando…",
    sent: email => `¡Listo! Escribiremos a ${email} en cuanto sus fechas estén disponibles.`,
    limit: "Ya tiene varios avisos activos. Llámenos o escríbanos por WhatsApp.",
    error: "No se pudo guardar el aviso. Inténtelo de nuevo o contáctenos.",
  },
  tr: {
    title: "Tarihleriniz müsait olursa size haber verelim mi?",
    help: "Tarihleriniz için bir rezervasyon iptal edilirse, doğrudan rezervasyon fiyatıyla hemen size e-posta göndeririz. Tek bildirim, reklam yok.",
    firstName: "Ad (isteğe bağlı)",
    email: "E-posta",
    submit: "Bana haber ver",
    sending: "Kaydediliyor…",
    sent: email => `Tamam! Tarihleriniz müsait olduğunda ${email} adresine yazacağız.`,
    limit: "Zaten birkaç aktif bildiriminiz var. Lütfen bizi arayın veya WhatsApp’tan yazın.",
    error: "Bildirim kaydedilemedi. Lütfen tekrar deneyin veya bizimle iletişime geçin.",
  },
};

const INPUT_CLASS = "min-h-12 w-full min-w-0 rounded-2xl border border-[#d8cec1] bg-white px-3.5 text-[16px]";

type Status = "idle" | "sending" | "sent" | "limit" | "error";

export function RoomFinderWatchCard({
  language,
  checkin,
  checkout,
  groups,
  privacyShort,
  privacyMore,
  privacyNotice,
}: {
  language: RoomFinderLanguage;
  checkin: string;
  checkout: string;
  groups: number[];
  privacyShort: string;
  privacyMore: string;
  privacyNotice: string;
}) {
  const copy = WATCH_COPY[language];
  const id = useId();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const canSend = validEmail && privacyAccepted && status !== "sending";

  async function send() {
    if (!canSend) return;
    setStatus("sending");
    try {
      const response = await fetch("/api/ai-room-finder/availability-watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          language,
          checkin,
          checkout,
          groups,
          privacyAccepted: true,
          sessionId: getRoomFinderSessionId(),
        }),
      });
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.ok) {
        setStatus("sent");
        return;
      }
      setStatus(payload?.code === "TOO_MANY_ALERTS" ? "limit" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="msg ml-10 mt-2 flex items-start gap-2.5 rounded-[22px] border border-[#d9e3cc] bg-[#eef4e7] p-3.5 text-[14px] font-bold leading-5 text-[#5f7448]">
        <BellRing className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{copy.sent(email.trim())}</span>
      </p>
    );
  }

  return (
    <form
      aria-label={copy.title}
      className="msg ml-10 mt-2 rounded-[22px] border border-[#e3cda9] bg-[#fffaf1] px-4 pb-4 pt-3.5 shadow-sm"
      onSubmit={event => {
        event.preventDefault();
        void send();
      }}
    >
      <div className="flex items-start gap-2.5">
        <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-[#c66a34]" aria-hidden="true" />
        <div className="min-w-0">
          <h3 className="text-[16px] font-black leading-5 text-[#29251f]">{copy.title}</h3>
          <p className="mt-1 text-[13px] leading-[18px] text-[#746b60]">{copy.help}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor={`${id}-email`} className="sr-only">{copy.email}</label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder={`${copy.email} *`}
            className={INPUT_CLASS}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor={`${id}-name`} className="sr-only">{copy.firstName}</label>
          <input
            id={`${id}-name`}
            name="given-name"
            autoComplete="given-name"
            maxLength={60}
            value={firstName}
            onChange={event => setFirstName(event.target.value)}
            placeholder={copy.firstName}
            className={INPUT_CLASS}
          />
        </div>
      </div>
      <div className="mt-2.5 flex items-start gap-3 px-1 text-[13px] leading-[18px] text-[#625b52]">
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
      <button
        type="submit"
        disabled={!canSend}
        className="mt-3 min-h-12 w-full rounded-full bg-[#c66a34] px-5 text-[15px] font-bold text-white transition hover:bg-[#ad572a] active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {status === "sending" ? copy.sending : copy.submit}
      </button>
      {(status === "error" || status === "limit") && (
        <p role="alert" className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
          {status === "limit" ? copy.limit : copy.error}
        </p>
      )}
    </form>
  );
}
