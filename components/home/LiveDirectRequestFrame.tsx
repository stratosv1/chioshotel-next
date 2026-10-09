import type { ReactNode } from "react";
import { roomFinderHrefForLanguage } from "@/lib/room-finder-cta-routing";

// Shared shell for the homepage Live Deals widget. The lazy placeholder, the
// loading state and the loaded widget all render the same header and reserve
// the same body size, so the page does not jump when availability arrives
// (e.g. after the hero "Offers" link jumps to #vh-lastminute-title).

export type LiveRequestLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

export const LIVE_HEADER_COPY: Record<LiveRequestLocale, { pill: string; subtitle: string; guests: string }> = {
  en: { pill: "Instant request to reception", subtitle: "Send an instant request to reception and get the best direct offer.", guests: "Guests" },
  el: { pill: "Άμεσο αίτημα στη ρεσεψιόν", subtitle: "Στείλτε άμεσο αίτημα στη ρεσεψιόν και λάβετε την καλύτερη απευθείας προσφορά.", guests: "Επισκέπτες" },
  fr: { pill: "Demande instantanée à la réception", subtitle: "Envoyez une demande instantanée à la réception et recevez la meilleure offre directe.", guests: "Voyageurs" },
  de: { pill: "Sofortanfrage an die Rezeption", subtitle: "Senden Sie eine Sofortanfrage an die Rezeption und erhalten Sie das beste Direktangebot.", guests: "Gäste" },
  it: { pill: "Richiesta immediata alla reception", subtitle: "Invia una richiesta immediata alla reception e ricevi la migliore offerta diretta.", guests: "Ospiti" },
  es: { pill: "Solicitud instantánea a recepción", subtitle: "Envía una solicitud instantánea a recepción y recibe la mejor oferta directa.", guests: "Huéspedes" },
  tr: { pill: "Resepsiyona anında talep", subtitle: "Resepsiyona anında talep gönderin ve en iyi doğrudan teklifi alın.", guests: "Misafirler" },
};

export function liveRequestLocale(canonicalPath: string): LiveRequestLocale {
  if (canonicalPath.startsWith("/el")) return "el";
  if (canonicalPath.startsWith("/fr")) return "fr";
  if (canonicalPath.startsWith("/de")) return "de";
  if (canonicalPath.startsWith("/it")) return "it";
  if (canonicalPath.startsWith("/es")) return "es";
  if (canonicalPath.startsWith("/tr")) return "tr";
  return "en";
}

export const LIVE_SECTION_CLASS = "px-4 pb-2 pt-6 md:px-8 md:pb-5 md:pt-10";
export const LIVE_CARD_CLASS = "mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-amber-900/10 bg-[#fffaf3] shadow-2xl shadow-stone-900/10 md:rounded-[2.5rem]";

// Fixed heights shared by the real widget and the skeleton.
export const ROOM_CARD_HEIGHT_CLASS = "h-[300px] md:h-[278px]";
export const DATE_CHIP_HEIGHT_CLASS = "h-[88px]";
export const SUMMARY_MIN_HEIGHT_CLASS = "min-h-[112px]";

export function LiveDirectHeader({
  locale,
  title,
  headingId,
  guestsControl,
}: {
  locale: LiveRequestLocale;
  title: string;
  headingId: string;
  guestsControl: ReactNode;
}) {
  const copy = LIVE_HEADER_COPY[locale];
  return (
    <>
      <div className="mb-4 flex justify-center rounded-full bg-amber-100/90 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] text-amber-800 ring-1 ring-amber-900/10 md:inline-flex md:justify-start">
        <span className="mr-2" aria-hidden="true">⚡</span>
        {copy.pill}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_250px] xl:items-end">
        <div>
          <h2 id={headingId} className="max-w-[640px] text-[2.35rem] font-extrabold leading-[0.98] tracking-[-0.04em] text-[#17351f] md:text-5xl xl:text-6xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-stone-700 md:text-lg md:leading-8">{copy.subtitle}</p>
        </div>
        <label className="block">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-stone-500 md:text-xs">{copy.guests}</span>
          {guestsControl}
        </label>
      </div>
    </>
  );
}

export const GUESTS_SELECT_CLASS = "h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-base font-black text-stone-900 shadow-sm outline-none ring-amber-700/20 transition focus:ring-4 md:h-14";

function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-[1.25rem] bg-stone-200/50 ${className}`} />;
}

/** Placeholder with the same footprint as the loaded widget body. */
export function LiveDirectBodySkeleton({ locale, includeFinderLink = true }: { locale: LiveRequestLocale; includeFinderLink?: boolean }) {
  return (
    <>
      <div aria-hidden="true">
        <div className="mt-5 -mx-4 flex gap-3 overflow-hidden px-4 pb-4 md:mx-0 md:gap-4 md:px-2 xl:gap-5">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className={`w-[78vw] max-w-[300px] flex-none overflow-hidden rounded-[1.35rem] bg-white ring-1 ring-stone-200/80 md:w-[245px] xl:w-[270px] ${ROOM_CARD_HEIGHT_CLASS}`}>
              <div className="h-[170px] animate-pulse bg-stone-200/60 md:h-[150px]" />
            </div>
          ))}
        </div>
        <Block className="mt-1 hidden h-[171px] md:block lg:h-[181px]" />
        <div className="mt-3 flex gap-2 overflow-hidden pb-2 pt-2 md:grid md:grid-cols-7 md:gap-3">
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <Block key={index} className={`w-[76px] flex-none md:w-auto ${DATE_CHIP_HEIGHT_CLASS}`} />
          ))}
        </div>
        <Block className={`mt-2 ${SUMMARY_MIN_HEIGHT_CLASS}`} />
      </div>
      {/* Real text, so its language-dependent height matches the loaded widget. */}
      <LiveTrustGrid locale={locale} />
      <div aria-hidden="true">
        <Block className="mt-3 h-[104px] md:h-12" />
      </div>
      {includeFinderLink ? <LiveFinderFooter locale={locale} /> : null}
    </>
  );
}

type TrustIconType = "tag" | "chat" | "bed" | "card";

// Trust grid and finder link are rendered with real text in the placeholder
// too, so their height (which depends on how each language wraps) is identical
// before and after the widget loads.
export const LIVE_FOOTER_COPY: Record<LiveRequestLocale, {
  differentDates: string;
  checkAvailability: string;
  footer: string;
  trustItems: { icon: TrustIconType; title: string; text: string }[];
}> = {
  en: {
    differentDates: "Different dates?",
    checkAvailability: "Check all dates with the AI Room Finder",
    footer: "Your instant request at chioshotel.gr",
    trustItems: [
      { icon: "tag", title: "Best direct offer", text: "Best available rate" },
      { icon: "chat", title: "Direct reply", text: "Reception response" },
      { icon: "bed", title: "Choose room", text: "Pick what suits you" },
      { icon: "card", title: "No card needed", text: "No payment now" },
    ],
  },
  el: {
    differentDates: "Έχετε διαφορετικές ημερομηνίες;",
    checkAvailability: "Ελέγξτε όλες τις ημερομηνίες με τον βοηθό AI",
    footer: "Το άμεσο αίτημά σας στο chioshotel.gr",
    trustItems: [
      { icon: "tag", title: "Καλύτερη απευθείας προσφορά", text: "Καλύτερη διαθέσιμη τιμή" },
      { icon: "chat", title: "Άμεση απάντηση", text: "Απάντηση από τη ρεσεψιόν" },
      { icon: "bed", title: "Επιλογή δωματίου", text: "Διαλέξτε αυτό που σας ταιριάζει" },
      { icon: "card", title: "Χωρίς κάρτα", text: "Καμία πληρωμή τώρα" },
    ],
  },
  fr: {
    differentDates: "D’autres dates ?",
    checkAvailability: "Vérifiez toutes les dates avec notre assistant IA",
    footer: "Votre demande instantanée sur chioshotel.gr",
    trustItems: [
      { icon: "tag", title: "Meilleure offre directe", text: "Meilleur tarif disponible" },
      { icon: "chat", title: "Réponse directe", text: "Réponse de la réception" },
      { icon: "bed", title: "Choisir la chambre", text: "Choisissez ce qui vous convient" },
      { icon: "card", title: "Sans carte bancaire", text: "Aucun paiement maintenant" },
    ],
  },
  de: {
    differentDates: "Andere Reisedaten?",
    checkAvailability: "Alle Termine mit unserem KI-Assistenten prüfen",
    footer: "Ihre Sofortanfrage auf chioshotel.gr",
    trustItems: [
      { icon: "tag", title: "Bestes Direktangebot", text: "Bester verfügbarer Preis" },
      { icon: "chat", title: "Direkte Antwort", text: "Antwort der Rezeption" },
      { icon: "bed", title: "Zimmer wählen", text: "Wählen Sie, was passt" },
      { icon: "card", title: "Keine Karte nötig", text: "Keine Zahlung jetzt" },
    ],
  },
  it: {
    differentDates: "Date diverse?",
    checkAvailability: "Controlla tutte le date con il nostro assistente AI",
    footer: "La tua richiesta immediata su chioshotel.gr",
    trustItems: [
      { icon: "tag", title: "Migliore offerta diretta", text: "Miglior prezzo disponibile" },
      { icon: "chat", title: "Risposta diretta", text: "Risposta dalla reception" },
      { icon: "bed", title: "Scegli camera", text: "Scegli ciò che fa per te" },
      { icon: "card", title: "Senza carta", text: "Nessun pagamento ora" },
    ],
  },
  es: {
    differentDates: "¿Otras fechas?",
    checkAvailability: "Consulta todas las fechas con nuestro asistente de IA",
    footer: "Su solicitud instantánea en chioshotel.gr",
    trustItems: [
      { icon: "tag", title: "Mejor oferta directa", text: "Mejor tarifa disponible" },
      { icon: "chat", title: "Respuesta directa", text: "Respuesta de recepción" },
      { icon: "bed", title: "Elige habitación", text: "Elige lo que te conviene" },
      { icon: "card", title: "Sin tarjeta", text: "Sin pago ahora" },
    ],
  },
  tr: {
    differentDates: "Farklı tarihler mi?",
    checkAvailability: "Tüm tarihleri yapay zekâ asistanımızla kontrol edin",
    footer: "chioshotel.gr üzerinden anında talebiniz",
    trustItems: [
      { icon: "tag", title: "En iyi doğrudan teklif", text: "En iyi mevcut fiyat" },
      { icon: "chat", title: "Doğrudan yanıt", text: "Resepsiyondan yanıt" },
      { icon: "bed", title: "Oda seçin", text: "Size uygun olanı seçin" },
      { icon: "card", title: "Kart gerekmez", text: "Şimdi ödeme yok" },
    ],
  },
};

function TrustIcon({ type }: { type: TrustIconType }) {
  const common = "h-5 w-5 text-amber-700 md:h-6 md:w-6";

  if (type === "tag") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
        <path d="M20 13.2 13.2 20a2.4 2.4 0 0 1-3.4 0L4 14.2V4h10.2L20 9.8a2.4 2.4 0 0 1 0 3.4Z" />
        <path d="M8.3 8.3h.01" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
        <path d="M5 17.5 3.8 21l3.8-1.1A9.5 9.5 0 1 0 4.5 17.5Z" />
        <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "bed") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
        <path d="M4 19V8.5A2.5 2.5 0 0 1 6.5 6H10a2 2 0 0 1 2 2v2h5.5A2.5 2.5 0 0 1 20 12.5V19" />
        <path d="M4 14h16M7 19v-2M17 19v-2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
      <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
      <path d="M3.5 10h17M7 14.5h4" />
    </svg>
  );
}


export function LiveTrustGrid({ locale }: { locale: LiveRequestLocale }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-0 rounded-[1.25rem] bg-white p-2.5 text-center shadow-sm ring-1 ring-amber-900/10 sm:grid-cols-4 md:rounded-[1.4rem] md:p-3">
      {LIVE_FOOTER_COPY[locale].trustItems.map((item, index) => (
        <div key={item.title} className={`${index < 2 ? "border-b pb-2" : "pt-2"} ${index % 2 === 0 ? "border-r" : ""} border-stone-200 px-2 text-[12px] font-semibold leading-4 text-stone-800 sm:border-b-0 sm:border-r sm:px-1 sm:py-0 sm:last:border-r-0 md:text-xs md:leading-5`}>
          <span className="mb-1 flex justify-center" aria-hidden="true"><TrustIcon type={item.icon} /></span>
          <strong className="block font-black">{item.title}</strong>
          <span className="hidden text-stone-500 md:block">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

export function LiveFinderFooter({ locale }: { locale: LiveRequestLocale }) {
  const copy = LIVE_FOOTER_COPY[locale];
  return (
    <>
      <a
        href={roomFinderHrefForLanguage(locale)}
        aria-label={`${copy.differentDates} ${copy.checkAvailability}`}
        className="mt-3 flex min-h-11 items-center justify-between gap-3 rounded-xl bg-amber-50/80 px-4 py-2.5 text-amber-800 ring-1 ring-amber-900/10 transition hover:bg-amber-100"
      >
        <span className="hidden text-sm font-bold text-stone-700 sm:inline">{copy.differentDates}</span>
        <span className="text-xs font-black leading-tight sm:text-sm">{copy.checkAvailability}</span>
        <span className="ml-auto text-base font-black" aria-hidden="true">→</span>
      </a>
      <p className="mt-3 hidden text-center text-xs font-semibold text-stone-500 sm:block">{copy.footer}</p>
    </>
  );
}
