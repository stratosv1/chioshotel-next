import type { ReactNode } from "react";

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
  es: { pill: "Solicitud instantánea a recepción", subtitle: "Envíe una solicitud instantánea a recepción y reciba la mejor oferta directa.", guests: "Huéspedes" },
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
          <h2 id={headingId} className="max-w-[640px] font-serif text-[2.35rem] font-bold leading-[0.98] tracking-[-0.04em] text-[#17351f] md:text-5xl xl:text-6xl">
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
export function LiveDirectBodySkeleton({ includeFinderLink = true }: { includeFinderLink?: boolean }) {
  return (
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
      {/* Heights measured from the loaded widget at 360–1280px. */}
      <Block className="mt-3 h-[175px] min-[380px]:h-[165px] sm:h-[104px] md:h-[132px] lg:h-[92px]" />
      <Block className="mt-3 h-[104px] md:h-12" />
      {includeFinderLink ? (
        <>
          <Block className="mt-3 h-[60px] sm:h-[68px] md:h-[60px] lg:h-11" />
          <div className="mt-3 hidden h-5 sm:block md:h-4" />
        </>
      ) : null}
    </div>
  );
}
