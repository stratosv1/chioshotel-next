"use client";

import { useEffect, useState } from "react";
import { getGroupedLanguagePath } from "@/lib/accommodation-landing-i18n";
import type { LanguageCode } from "@/lib/languages";
import { languages, normalizePath } from "@/lib/languages";
import { getRouteByPath, getRoutesByItemId } from "@/lib/url-map";
import { kamposChiosPaths } from "@/content/kampos-chios";

type HeaderProps = {
  language?: LanguageCode;
  pathname?: string;
};

type HeaderMenuLink = {
  label: string;
  href: string;
  icon: string;
  text?: string;
};

type HeaderCopy = {
  bookNow: string;
  menu: string;
  close: string;
  nav: string;
  language: string;
  directLine: string;
  openNow: string;
  location: string;
  links: {
    rooms: string;
    rates: string;
    deals: string;
    chios: string;
    beaches: string;
    villages: string;
    museums: string;
    activities: string;
    contact: string;
  };
  explore: {
    beaches: string;
    villages: string;
    museums: string;
  };
};

const copyByLanguage: Record<LanguageCode, HeaderCopy> = {
  en: {
    bookNow: "Book Now",
    menu: "Menu",
    close: "Close",
    nav: "Main navigation",
    language: "Language",
    directLine: "Direct Booking · Best Rates",
    openNow: "OPEN",
    location: "Kampos, Chios",
    links: { rooms: "Rooms", rates: "Rates", deals: "Deals", chios: "Chios Island", beaches: "Beaches", villages: "Villages", museums: "Museums", activities: "Do in Chios", contact: "Contact" },
    explore: { beaches: "Clear waters", villages: "Mastic villages", museums: "Culture" },
  },
  el: {
    bookNow: "Κράτηση",
    menu: "Μενού",
    close: "Κλείσιμο",
    nav: "Κύρια πλοήγηση",
    language: "Γλώσσα",
    directLine: "Απευθείας κράτηση · Καλύτερες τιμές",
    openNow: "ΑΝΟΙΧΤΑ",
    location: "Κάμπος, Χίος",
    links: { rooms: "Δωμάτια", rates: "Τιμές", deals: "Προσφορές", chios: "Χίος", beaches: "Παραλίες", villages: "Χωριά", museums: "Μουσεία", activities: "Τι να κάνεις", contact: "Επικοινωνία" },
    explore: { beaches: "Καθαρά νερά", villages: "Μαστιχοχώρια", museums: "Πολιτισμός" },
  },
  fr: {
    bookNow: "Réserver",
    menu: "Menu",
    close: "Fermer",
    nav: "Navigation principale",
    language: "Langue",
    directLine: "Réservation directe · Meilleurs tarifs",
    openNow: "OUVERT",
    location: "Kambos, Chios",
    links: { rooms: "Chambres", rates: "Tarifs", deals: "Offres", chios: "Île de Chios", beaches: "Plages", villages: "Villages", museums: "Musées", activities: "À faire", contact: "Contact" },
    explore: { beaches: "Eaux cristallines", villages: "Villages du mastic", museums: "Culture" },
  },
  de: {
    bookNow: "Buchen",
    menu: "Menü",
    close: "Schließen",
    nav: "Hauptnavigation",
    language: "Sprache",
    directLine: "Direktbuchung · Beste Preise",
    openNow: "OFFEN",
    location: "Kambos, Chios",
    links: { rooms: "Zimmer", rates: "Preise", deals: "Angebote", chios: "Insel Chios", beaches: "Strände", villages: "Dörfer", museums: "Museen", activities: "Aktivitäten", contact: "Kontakt" },
    explore: { beaches: "Klares Wasser", villages: "Mastixdörfer", museums: "Kultur" },
  },
  it: {
    bookNow: "Prenota",
    menu: "Menu",
    close: "Chiudi",
    nav: "Navigazione principale",
    language: "Lingua",
    directLine: "Prenotazione diretta · Migliori tariffe",
    openNow: "APERTO",
    location: "Kambos, Chios",
    links: { rooms: "Camere", rates: "Prezzi", deals: "Offerte", chios: "Isola di Chios", beaches: "Spiagge", villages: "Villaggi", museums: "Musei", activities: "Cosa fare", contact: "Contatti" },
    explore: { beaches: "Acque cristalline", villages: "Villaggi del mastice", museums: "Cultura" },
  },
  es: {
    bookNow: "Reservar",
    menu: "Menú",
    close: "Cerrar",
    nav: "Navegación principal",
    language: "Idioma",
    directLine: "Reserva directa · Mejores tarifas",
    openNow: "ABIERTO",
    location: "Kambos, Quíos",
    links: { rooms: "Habitaciones", rates: "Precios", deals: "Ofertas", chios: "Isla de Chios", beaches: "Playas", villages: "Pueblos", museums: "Museos", activities: "Qué hacer", contact: "Contacto" },
    explore: { beaches: "Aguas cristalinas", villages: "Pueblos del mástique", museums: "Cultura" },
  },
  tr: {
    bookNow: "Rezervasyon",
    menu: "Menü",
    close: "Kapat",
    nav: "Ana gezinme",
    language: "Dil",
    directLine: "Doğrudan rezervasyon · En iyi fiyatlar",
    openNow: "AÇIK",
    location: "Kambos, Sakız Adası",
    links: { rooms: "Odalar", rates: "Fiyatlar", deals: "Fırsatlar", chios: "Sakız Adası", beaches: "Plajlar", villages: "Köyler", museums: "Müzeler", activities: "Ne yapılır", contact: "İletişim" },
    explore: { beaches: "Berrak sular", villages: "Mastik köyleri", museums: "Kültür" },
  },
};

const routeIds = {
  home: "home",
  rooms: "rooms-index",
  rates: "booking",
  deals: "deals",
  chios: "chios-index",
  beaches: "beaches-index",
  villages: "villages-index",
  museums: "museums-index",
  activities: "chios-activities-hub",
  contact: "contact",
} as const;

const polishEquivalentPaths: Record<string, string> = {
  "/": "/pl/",
  "/el/": "/pl/",
  "/fr/": "/pl/",
  "/de/": "/pl/",
  "/it/": "/pl/",
  "/es/": "/pl/",
  "/tr/": "/pl/",
  "/chios-accommodation/": "/pl/noclegi-chios/",
  "/el/diamoni-sti-xio/": "/pl/noclegi-chios/",
  "/fr/hebergement-chios/": "/pl/noclegi-chios/",
  "/de/chios-unterkunft/": "/pl/noclegi-chios/",
  "/it/alloggio-chios/": "/pl/noclegi-chios/",
  "/es/alojamiento-chios/": "/pl/noclegi-chios/",
  "/tr/sakiz-adasi-konaklama/": "/pl/noclegi-chios/",
  "/chios-hotels/": "/pl/hotele-chios/",
  "/el/xenodoxeia-xios/": "/pl/hotele-chios/",
  "/fr/hotels-chios/": "/pl/hotele-chios/",
  "/de/hotels-auf-chios/": "/pl/hotele-chios/",
  "/it/hotel-chios/": "/pl/hotele-chios/",
  "/es/hoteles-chios/": "/pl/hotele-chios/",
  "/tr/sakiz-adasi-otelleri/": "/pl/hotele-chios/",
  "/chios-rooms/": "/pl/pokoje-na-chios/",
  "/el/domatia-xios/": "/pl/pokoje-na-chios/",
  "/fr/chambres-a-chios/": "/pl/pokoje-na-chios/",
  "/de/chios-zimmer/": "/pl/pokoje-na-chios/",
  "/it/camere-a-chios/": "/pl/pokoje-na-chios/",
  "/es/habitaciones-en-chios/": "/pl/pokoje-na-chios/",
  "/tr/sakiz-adasi-odalari/": "/pl/pokoje-na-chios/",
  "/chios-rooms/family-chios-apartments/": "/pl/apartamenty-na-chios/",
  "/el/domatia-xios/oikogeneiako-diamerisma/": "/pl/apartamenty-na-chios/",
  "/fr/chambres-a-chios/appartements-familiaux-de-chios/": "/pl/apartamenty-na-chios/",
  "/de/zimmer-chios/familienapartments-in-chios/": "/pl/apartamenty-na-chios/",
  "/it/stanze-a-chios/appartamenti-familiari-a-chios/": "/pl/apartamenty-na-chios/",
  "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/": "/pl/apartamenty-na-chios/",
  "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/": "/pl/apartamenty-na-chios/",
  "/chios-hotels-rates/": "/pl/rezerwacja/",
  "/el/amesi-kratisi-voulamandis-house/": "/pl/rezerwacja/",
  "/fr/tarifs-des-hotels-a-chios/": "/pl/rezerwacja/",
  "/de/hotelpreise-auf-der-insel-chios/": "/pl/rezerwacja/",
  "/it/prezzi-hotel-chios/": "/pl/rezerwacja/",
  "/es/los-mejores-precios-de-hotel-en-la-isla-chios/": "/pl/rezerwacja/",
  "/tr/sakiz-adasi-rezervasyon/": "/pl/rezerwacja/",
  "/chios/kampos-chios/": "/pl/kambos-chios/",
  "/el/chios/kampos-chios/": "/pl/kambos-chios/",
  "/fr/chios/kampos-chios/": "/pl/kambos-chios/",
  "/de/chios/kampos-chios/": "/pl/kambos-chios/",
  "/it/chios/kampos-chios/": "/pl/kambos-chios/",
  "/es/chios/kampos-chios/": "/pl/kambos-chios/",
  "/tr/chios/kampos-chios/": "/pl/kambos-chios/",
};

function pathFor(itemId: string, language: LanguageCode) {
  return getRoutesByItemId(itemId).find((route) => route.language === language && route.action === "KEEP")?.path || "/";
}

function languageHref(pathname: string, language: LanguageCode) {
  const normalizedPathname = normalizePath(pathname);
  const isKamposPage = (Object.values(kamposChiosPaths) as string[]).some(
    (path) => normalizePath(path) === normalizedPathname,
  );

  if (isKamposPage) {
    return kamposChiosPaths[language];
  }

  const groupedPath = getGroupedLanguagePath(pathname, language);
  if (groupedPath) return groupedPath;

  const route = getRouteByPath(normalizedPathname);
  if (!route) return pathFor(routeIds.home, language);
  return getRoutesByItemId(route.itemId).find((item) => item.language === language && item.action === "KEEP")?.path || pathFor(routeIds.home, language);
}

function polishLanguageHref(pathname: string) {
  return polishEquivalentPaths[normalizePath(pathname)] || "/pl/";
}

function getAthensNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Athens",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
    hour12: false,
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value || "";
  const hour = Number(value("hour"));
  const minute = Number(value("minute"));
  return { hour, minute, dateLabel: `${value("day")} ${value("month")}` };
}

function useReceptionStatus() {
  const [status, setStatus] = useState(() => ({ isOpen: true, dateLabel: "" }));

  useEffect(() => {
    function updateStatus() {
      const now = getAthensNow();
      const minutes = now.hour * 60 + now.minute;
      setStatus({ isOpen: minutes >= 6 * 60 && minutes < 24 * 60, dateLabel: now.dateLabel });
    }

    updateStatus();
    const interval = window.setInterval(updateStatus, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return status;
}

function LanguagePills({ currentLanguage, pathname, onNavigate }: { currentLanguage: LanguageCode; pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label={copyByLanguage[currentLanguage].language} className="flex min-w-0 flex-nowrap items-center gap-1 overflow-x-auto rounded-full border border-stone-900/10 bg-white/85 p-1 shadow-sm shadow-stone-900/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {languages.map((item) => {
        const active = item.code === currentLanguage;
        return (
          <a
            key={item.code}
            href={languageHref(pathname, item.code)}
            hrefLang={item.code}
            lang={item.code}
            aria-current={active ? "page" : undefined}
            title={item.label}
            onClick={onNavigate}
            className={`flex h-8 min-w-9 shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-black uppercase tracking-[0.08em] transition ${active ? "bg-[#fff4df] text-amber-900 shadow-sm ring-1 ring-amber-800/20" : "text-stone-700 hover:bg-amber-50 hover:text-amber-900"}`}
          >
            {item.code.toUpperCase()}
          </a>
        );
      })}
      <a
        href={polishLanguageHref(pathname)}
        hrefLang="pl"
        lang="pl"
        title="Polski"
        onClick={onNavigate}
        className="flex h-8 min-w-9 shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-black uppercase tracking-[0.08em] text-stone-700 transition hover:bg-amber-50 hover:text-amber-900"
      >
        PL
      </a>
    </nav>
  );
}

export function VoulamandisHeaderTailwind({ language = "en", pathname = "/" }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = copyByLanguage[language] || copyByLanguage.en;
  const reception = useReceptionStatus();
  const statusLabel = reception.isOpen ? copy.openNow : "06:00";

  const links: HeaderMenuLink[] = [
    { label: copy.links.rooms, href: pathFor(routeIds.rooms, language), icon: "🛏️" },
    { label: copy.links.deals, href: pathFor(routeIds.deals, language), icon: "🔥" },
    { label: copy.links.chios, href: pathFor(routeIds.chios, language), icon: "🏝️" },
    { label: copy.links.activities, href: pathFor(routeIds.activities, language), icon: "✨" },
    { label: copy.links.contact, href: pathFor(routeIds.contact, language), icon: "💬" },
  ];
  const exploreLinks: HeaderMenuLink[] = [
    { label: copy.links.beaches, href: pathFor(routeIds.beaches, language), text: copy.explore.beaches, icon: "🌊" },
    { label: copy.links.villages, href: pathFor(routeIds.villages, language), text: copy.explore.villages, icon: "🏘️" },
    { label: copy.links.museums, href: pathFor(routeIds.museums, language), text: copy.explore.museums, icon: "🏛️" },
  ];
  const mobileLinks: HeaderMenuLink[] = [...links, ...exploreLinks];

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-[#fffaf3]/92 shadow-[0_10px_30px_rgba(41,30,20,0.07)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#fffaf3]/82">
      <div className="mx-auto flex h-[72px] w-full max-w-none items-center gap-3 px-3 sm:px-5 lg:h-[84px] lg:px-6 xl:px-8">
        <a href={pathFor(routeIds.home, language)} onClick={closeMenu} className="group flex min-w-0 flex-1 items-center gap-3 lg:max-w-[500px] xl:flex-[0_1_470px] 2xl:flex-[0_1_560px]">
          <span className="relative flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl border border-amber-900/10 bg-white shadow-lg shadow-stone-900/10 lg:h-[58px] lg:w-[58px]">
            <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.95),transparent_55%)]" />
            <img src="/favicon/vh-heart-128.webp" alt="" className="relative h-[52px] w-[52px] animate-pulse object-contain transition duration-300 group-hover:scale-110 lg:h-[56px] lg:w-[56px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex min-w-0 items-center gap-2">
              <strong className="block min-w-0 truncate text-[1.08rem] font-black leading-none tracking-[-0.055em] text-stone-900 sm:text-[1.28rem] lg:text-[1.42rem]">Voulamandis House</strong>
              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-700/10">{statusLabel}<span className="ml-1.5 text-emerald-700/70">{reception.dateLabel}</span></span>
            </span>
            <span className="mt-1 block truncate text-[10px] font-black uppercase tracking-[0.12em] text-stone-500 sm:text-[11px]">
              <span>{copy.location}</span>
              <span className="px-1.5 text-amber-800">·</span>
              <span className="text-amber-800">{copy.directLine}</span>
            </span>
          </span>
        </a>

        <nav aria-label={copy.nav} className="hidden max-w-[650px] flex-[1_1_auto] items-center justify-center gap-0.5 rounded-full border border-stone-900/10 bg-white/66 p-1 shadow-sm shadow-stone-900/5 xl:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="rounded-full px-2.5 py-2 text-center text-[13.5px] font-black text-stone-700 transition hover:bg-amber-50 hover:text-amber-900 2xl:px-3">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <LanguagePills currentLanguage={language} pathname={pathname} />
          <a href={pathFor(routeIds.rates, language)} className="inline-flex h-12 min-w-[112px] items-center justify-center rounded-full bg-gradient-to-br from-[#a87842] to-[#8e6607] px-5 text-center text-xs font-black uppercase leading-none tracking-[0.1em] !text-white shadow-lg shadow-amber-900/20 transition hover:-translate-y-0.5">
            {copy.bookNow}
          </a>
        </div>

        <button type="button" aria-label={isOpen ? copy.close : copy.menu} aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)} className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-stone-900/10 bg-white text-stone-900 shadow-sm shadow-stone-900/5 lg:hidden">
          <span className="sr-only">{copy.menu}</span>
          <span className="grid gap-1.5">
            <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div className={`fixed inset-0 top-[72px] z-50 bg-stone-950/15 backdrop-blur-[1px] transition lg:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <button type="button" aria-label={copy.close} onClick={closeMenu} className="absolute inset-0 h-full w-full" />
        <div className={`absolute right-0 top-0 w-[min(92vw,420px)] rounded-l-[1.5rem] bg-[#fffaf3] p-3 pb-5 shadow-2xl shadow-stone-950/18 transition duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="mb-2"><LanguagePills currentLanguage={language} pathname={pathname} onNavigate={closeMenu} /></div>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <a href={pathFor(routeIds.rates, language)} onClick={closeMenu} className="flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-br from-[#b8873f] to-[#8e6607] px-4 text-center text-sm font-black uppercase tracking-[0.08em] !text-white shadow-lg shadow-amber-900/12">
              {copy.bookNow}
            </a>
            <a href={pathFor(routeIds.rates, language)} onClick={closeMenu} className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-amber-900/15 bg-white px-4 text-center text-sm font-black uppercase tracking-[0.08em] text-amber-900 shadow-sm shadow-stone-900/5">
              <span aria-hidden="true">💶</span>
              {copy.links.rates}
            </a>
          </div>
          <section className="rounded-[1.15rem] border border-stone-900/10 bg-white p-2.5 shadow-sm shadow-stone-900/5">
            <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-[0.16em] text-stone-500">{copy.nav}</p>
            <div className="grid grid-cols-2 gap-2">
              {mobileLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={closeMenu} className="flex min-h-[54px] items-center gap-2 rounded-2xl bg-gradient-to-br from-white to-[#fff7ea] px-3 py-2 text-stone-800 ring-1 ring-amber-900/10 shadow-sm shadow-stone-900/[0.03]">
                  <span className="text-[19px]" aria-hidden="true">{link.icon}</span>
                  <span className="min-w-0">
                    <strong className="block truncate text-[13px] font-black leading-tight">{link.label}</strong>
                    {link.text ? <small className="mt-0.5 block truncate text-[9px] font-black uppercase tracking-[0.1em] text-amber-800/70">{link.text}</small> : null}
                  </span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </header>
  );
}
