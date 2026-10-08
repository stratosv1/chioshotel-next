"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

export type NewsletterLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type NewsletterCopy = {
  newsletterKicker: string;
  newsletterTitle: string;
  newsletterText: string;
  emailPlaceholder: string;
  consent: string;
  subscribe: string;
  subscribed: string;
  errorEmail: string;
  errorConsent: string;
  errorServer: string;
};

const COPY: Record<NewsletterLocale, NewsletterCopy> = {
  en: {
    newsletterKicker: "Newsletter",
    newsletterTitle: "Get our offers first",
    newsletterText: "A few emails a year with new offers and direct-booking codes for Voulamandis House. No spam.",
    emailPlaceholder: "Your email",
    consent: "I agree to receive offers from Voulamandis House by email. I can unsubscribe at any time.",
    subscribe: "Sign up",
    subscribed: "Thank you! You are on the list.",
    errorEmail: "Please enter a valid email.",
    errorConsent: "Please tick the consent box.",
    errorServer: "Something went wrong. Please try again.",
  },
  el: {
    newsletterKicker: "Newsletter",
    newsletterTitle: "Μάθετε πρώτοι τις προσφορές μας",
    newsletterText: "Λίγα email τον χρόνο με νέες προσφορές και κωδικούς απευθείας κράτησης για το Voulamandis House. Χωρίς spam.",
    emailPlaceholder: "Το email σας",
    consent: "Συμφωνώ να λαμβάνω προσφορές από το Voulamandis House με email. Μπορώ να διαγραφώ όποτε θέλω.",
    subscribe: "Εγγραφή",
    subscribed: "Ευχαριστούμε! Είστε στη λίστα.",
    errorEmail: "Γράψτε ένα έγκυρο email.",
    errorConsent: "Τσεκάρετε τη συγκατάθεση.",
    errorServer: "Κάτι πήγε στραβά. Δοκιμάστε ξανά.",
  },
  fr: {
    newsletterKicker: "Newsletter",
    newsletterTitle: "Recevez nos offres en premier",
    newsletterText: "Quelques e-mails par an avec de nouvelles offres et des codes de réservation directe. Pas de spam.",
    emailPlaceholder: "Votre e-mail",
    consent: "J’accepte de recevoir des offres de Voulamandis House par e-mail. Je peux me désinscrire à tout moment.",
    subscribe: "S’inscrire",
    subscribed: "Merci ! Vous êtes inscrit.",
    errorEmail: "Saisissez un e-mail valide.",
    errorConsent: "Cochez la case de consentement.",
    errorServer: "Une erreur s’est produite. Réessayez.",
  },
  de: {
    newsletterKicker: "Newsletter",
    newsletterTitle: "Unsere Angebote zuerst erhalten",
    newsletterText: "Wenige E-Mails im Jahr mit neuen Angeboten und Direktbuchungscodes. Kein Spam.",
    emailPlaceholder: "Ihre E-Mail",
    consent: "Ich möchte Angebote von Voulamandis House per E-Mail erhalten. Ich kann mich jederzeit abmelden.",
    subscribe: "Anmelden",
    subscribed: "Danke! Sie sind angemeldet.",
    errorEmail: "Bitte gültige E-Mail eingeben.",
    errorConsent: "Bitte Einwilligung bestätigen.",
    errorServer: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
  },
  it: {
    newsletterKicker: "Newsletter",
    newsletterTitle: "Ricevi le nostre offerte per primo",
    newsletterText: "Poche email all’anno con nuove offerte e codici di prenotazione diretta. Niente spam.",
    emailPlaceholder: "La tua email",
    consent: "Accetto di ricevere offerte da Voulamandis House via email. Posso cancellarmi in qualsiasi momento.",
    subscribe: "Iscriviti",
    subscribed: "Grazie! Sei iscritto.",
    errorEmail: "Inserisci un’email valida.",
    errorConsent: "Seleziona la casella di consenso.",
    errorServer: "Qualcosa è andato storto. Riprova.",
  },
  es: {
    newsletterKicker: "Newsletter",
    newsletterTitle: "Reciba nuestras ofertas primero",
    newsletterText: "Pocos emails al año con nuevas ofertas y códigos de reserva directa. Sin spam.",
    emailPlaceholder: "Su email",
    consent: "Acepto recibir ofertas de Voulamandis House por email. Puedo darme de baja en cualquier momento.",
    subscribe: "Suscribirme",
    subscribed: "¡Gracias! Ya está en la lista.",
    errorEmail: "Introduzca un email válido.",
    errorConsent: "Marque la casilla de consentimiento.",
    errorServer: "Algo salió mal. Inténtelo de nuevo.",
  },
  tr: {
    newsletterKicker: "Bülten",
    newsletterTitle: "Fırsatlarımızdan ilk siz haberdar olun",
    newsletterText: "Yılda birkaç e-posta: yeni fırsatlar ve doğrudan rezervasyon kodları. Spam yok.",
    emailPlaceholder: "E-posta adresiniz",
    consent: "Voulamandis House’tan e-posta ile fırsat almayı kabul ediyorum. İstediğim zaman abonelikten çıkabilirim.",
    subscribe: "Kaydol",
    subscribed: "Teşekkürler! Listedesiniz.",
    errorEmail: "Geçerli bir e-posta girin.",
    errorConsent: "Lütfen onay kutusunu işaretleyin.",
    errorServer: "Bir sorun oluştu. Tekrar deneyin.",
  },
};

export function newsletterCopy(locale: NewsletterLocale) {
  return COPY[locale] ?? COPY.en;
}

const CONSENT_KEY = "vh_cookie_consent_v1";

function emit(name: string, properties: Record<string, string | undefined>) {
  try {
    if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return;
  } catch {
    return;
  }
  const clean = Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined)) as Record<string, string>;
  track(name, clean);
  (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", name, clean);
}

export function NewsletterSignupForm({
  locale,
  source,
  compact = false,
}: {
  locale: NewsletterLocale;
  source: string;
  compact?: boolean;
}) {
  const labels = COPY[locale] ?? COPY.en;
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError(labels.errorEmail);
    if (!consent) return setError(labels.errorConsent);
    setState("sending");
    try {
      const offer = typeof window !== "undefined" ? window.location.hash.replace(/^#offer-/, "") : "";
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const response = await fetch("/api/newsletter/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          consent,
          consentText: labels.consent,
          language: locale,
          source: params?.get("utm_source") ? `${source}:${params.get("utm_source")}` : source,
          offer: offer && !offer.startsWith("#") ? offer : undefined,
          website,
        }),
      });
      const payload = await response.json().catch(() => ({ ok: false }));
      if (!payload.ok) throw new Error(payload.error || "server");
      setState("done");
      emit("newsletter_signup", { language: locale, source });
    } catch (err) {
      setState("idle");
      const code = err instanceof Error ? err.message : "server";
      setError(code === "email" ? labels.errorEmail : code === "consent" ? labels.errorConsent : labels.errorServer);
    }
  }

  if (state === "done") {
    return <p className="rounded-2xl bg-emerald-50 px-5 py-4 text-center text-base font-black text-emerald-800" role="status">{labels.subscribed}</p>;
  }

  return (
    <form onSubmit={submit} className={compact ? "w-full" : "mx-auto max-w-[560px]"} noValidate>
      <label className="sr-only" htmlFor={`newsletter-email-${source}`}>{labels.emailPlaceholder}</label>
      <div className={compact ? "flex gap-2" : ""}>
        <input
          id={`newsletter-email-${source}`}
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={labels.emailPlaceholder}
          className={`${compact ? "min-h-[48px] min-w-0 flex-1" : "min-h-[52px] w-full"} rounded-full border border-amber-800/25 bg-white px-5 text-base text-stone-900 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-200`}
        />
        {compact ? (
          <button
            type="submit"
            disabled={state === "sending"}
            className="min-h-[48px] shrink-0 rounded-full bg-amber-800 px-6 text-[12px] font-black uppercase tracking-[0.1em] text-white shadow-lg shadow-amber-900/15 disabled:opacity-60"
          >
            {labels.subscribe}
          </button>
        ) : null}
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        className="hidden"
        aria-hidden="true"
      />
      <label className={`${compact ? "mt-3 text-[12px] leading-5" : "mt-4 text-[13px] leading-6"} flex items-start gap-3 text-left text-stone-600`}>
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-amber-800" />
        <span>{labels.consent}</span>
      </label>
      {error ? <p className="mt-3 text-sm font-bold text-red-700" role="alert">{error}</p> : null}
      {compact ? null : (
        <button
          type="submit"
          disabled={state === "sending"}
          className="mt-5 min-h-[52px] w-full rounded-full bg-amber-800 px-7 text-[12px] font-black uppercase tracking-[0.1em] text-white shadow-lg shadow-amber-900/15 disabled:opacity-60 sm:w-auto"
        >
          {labels.subscribe}
        </button>
      )}
    </form>
  );
}


/** Compact card version (heading + inline form), used in the homepage rooms section. */
export function NewsletterSignupCard({ locale, source }: { locale: NewsletterLocale; source: string }) {
  const labels = COPY[locale] ?? COPY.en;
  return (
    <article className="rounded-[2rem] bg-white px-7 py-6 shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10" aria-labelledby={`newsletter-title-${source}`}>
      <p className="break-words text-xs font-black uppercase tracking-[0.20em] text-amber-700">{labels.newsletterKicker}</p>
      <h3 id={`newsletter-title-${source}`} className="mt-2 break-words font-serif text-[1.65rem] font-bold leading-tight text-stone-900">{labels.newsletterTitle}</h3>
      <p className="mb-4 mt-2 text-[15px] leading-6 text-stone-600">{labels.newsletterText}</p>
      <NewsletterSignupForm locale={locale} source={source} compact />
    </article>
  );
}
