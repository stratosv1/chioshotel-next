"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LanguageCode } from "@/lib/languages";
import { languages, normalizePath } from "@/lib/languages";
import type { HeaderLinks } from "@/lib/header-links";

// All localized hrefs are resolved on the server (lib/header-links) and passed
// in, so the URL registry never ships in this client component's bundle.
type HeaderProps = {
  language?: LanguageCode;
  pathname?: string;
  headerLinks: HeaderLinks;
};

type HeaderMenuLink = {
  label: string;
  href: string;
  text?: string;
};


type HeaderCopy = {
  bookNow: string;
  menu: string;
  close: string;
  nav: string;
  language: string;
  exploreTitle: string;
  directLine: string;
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
    exploreTitle: "Explore Chios",
    directLine: "Direct Booking",
    location: "Kambos, Chios",
    links: { rooms: "Rooms", rates: "Rates", deals: "Deals", chios: "Chios Island", beaches: "Beaches", villages: "Villages", museums: "Museums", activities: "Do in Chios", contact: "Contact" },
    explore: { beaches: "Clear waters", villages: "Mastic villages", museums: "Culture" },
  },
  el: {
    bookNow: "Κράτηση",
    menu: "Μενού",
    close: "Κλείσιμο",
    nav: "Κύρια πλοήγηση",
    language: "Γλώσσα",
    exploreTitle: "Ανακαλύψτε τη Χίο",
    directLine: "Απευθείας κράτηση",
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
    exploreTitle: "Découvrir Chios",
    directLine: "Réservation directe",
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
    exploreTitle: "Chios entdecken",
    directLine: "Direktbuchung",
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
    exploreTitle: "Scopri Chios",
    directLine: "Prenotazione diretta",
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
    exploreTitle: "Descubre Quíos",
    directLine: "Reserva directa",
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
    exploreTitle: "Sakız Adası'nı keşfedin",
    directLine: "Doğrudan rezervasyon",
    location: "Kambos, Sakız Adası",
    links: { rooms: "Odalar", rates: "Fiyatlar", deals: "Fırsatlar", chios: "Sakız Adası", beaches: "Plajlar", villages: "Köyler", museums: "Müzeler", activities: "Ne yapılır", contact: "İletişim" },
    explore: { beaches: "Berrak sular", villages: "Mastik köyleri", museums: "Kültür" },
  },
};

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

function polishLanguageHref(pathname: string) {
  return polishEquivalentPaths[normalizePath(pathname)] || "/pl/";
}

function LanguagePills({ currentLanguage, pathname, languageHrefs, onNavigate, fullWidth = false }: { currentLanguage: LanguageCode; pathname: string; languageHrefs: HeaderLinks["languages"]; onNavigate?: () => void; fullWidth?: boolean }) {
  return (
    <nav aria-label={copyByLanguage[currentLanguage].language} className={`${fullWidth ? "grid grid-cols-8" : "flex flex-nowrap overflow-x-auto"} min-w-0 items-center gap-1 rounded-full border border-stone-900/10 bg-white/85 p-1 shadow-sm shadow-stone-900/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
      {languages.map((item) => {
        const active = item.code === currentLanguage;
        return (
          <a
            key={item.code}
            href={languageHrefs[item.code]}
            hrefLang={item.code}
            lang={item.code}
            aria-current={active ? "page" : undefined}
            title={item.label}
            onClick={onNavigate}
            className={`flex h-11 ${fullWidth ? "min-w-0 px-0" : "min-w-11 px-2"} shrink-0 items-center justify-center rounded-full text-[11px] font-black uppercase tracking-[0.08em] transition lg:h-8 lg:min-w-9 xl:min-w-8 2xl:min-w-9 ${active ? "bg-[#fff4df] text-amber-900 shadow-sm ring-1 ring-amber-800/20" : "text-stone-700 hover:bg-amber-50 hover:text-amber-900"}`}
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
        className={`flex h-11 ${fullWidth ? "min-w-0 px-0" : "min-w-11 px-2"} shrink-0 items-center justify-center rounded-full text-[11px] font-black uppercase tracking-[0.08em] text-stone-700 transition hover:bg-amber-50 hover:text-amber-900 lg:h-8 lg:min-w-9 xl:min-w-8 2xl:min-w-9`}
      >
        PL
      </a>
    </nav>
  );
}

export function VoulamandisHeaderTailwind({ language = "en", pathname = "/", headerLinks }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = copyByLanguage[language] || copyByLanguage.en;

  const links: HeaderMenuLink[] = [
    { label: copy.links.rooms, href: headerLinks.nav.rooms },
    { label: copy.links.deals, href: headerLinks.nav.deals },
    { label: copy.links.chios, href: headerLinks.nav.chios },
    { label: copy.links.activities, href: headerLinks.nav.activities },
    { label: copy.links.contact, href: headerLinks.nav.contact },
  ];
  const exploreLinks: HeaderMenuLink[] = [
    { label: copy.links.beaches, href: headerLinks.nav.beaches, text: copy.explore.beaches },
    { label: copy.links.villages, href: headerLinks.nav.villages, text: copy.explore.villages },
    { label: copy.links.museums, href: headerLinks.nav.museums, text: copy.explore.museums },
  ];
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const currentPath = normalizePath(pathname);
  const isCurrent = (href: string) => normalizePath(href) === currentPath;

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button")).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("keydown", trapFocus);
    const firstItem = panelRef.current?.querySelector<HTMLElement>("a[href], button");
    window.setTimeout(() => firstItem?.focus({ preventScroll: true }), 50);
    const menuButton = menuButtonRef.current;

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("keydown", trapFocus);
      menuButton?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-[#fffaf3]/92 shadow-[0_10px_30px_rgba(41,30,20,0.07)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#fffaf3]/82">
      <div className="mx-auto flex h-[72px] w-full max-w-none items-center gap-3 px-3 sm:px-5 lg:h-[84px] lg:px-6 xl:px-8">
        <a href={headerLinks.nav.home} onClick={closeMenu} className="group flex min-w-0 flex-1 items-center gap-3 lg:max-w-[500px] xl:flex-[0_1_470px] 2xl:flex-[0_1_560px]">
          <span className="relative flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl border border-amber-900/10 bg-white shadow-lg shadow-stone-900/10 lg:h-[58px] lg:w-[58px]">
            <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.95),transparent_55%)]" />
            <Image
              src="/favicon/vh-heart-128.webp"
              alt=""
              width={56}
              height={56}
              sizes="56px"
              className="relative h-[52px] w-[52px] motion-safe:animate-pulse object-contain transition duration-300 group-hover:scale-110 lg:h-[56px] lg:w-[56px]"
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex min-w-0 items-center gap-2">
              <strong className="block min-w-0 truncate text-[21px] font-black leading-none tracking-[-0.035em] text-stone-900 sm:text-[1.34rem] lg:text-[1.46rem] xl:text-[1.3rem] 2xl:text-[1.46rem]">Voulamandis House</strong>
                          </span>
            <span className="mt-1 block truncate text-[10px] font-black uppercase tracking-[0.06em] text-stone-500 sm:text-[11px] sm:tracking-[0.12em] xl:tracking-[0.08em] 2xl:tracking-[0.12em]">
              <span>{copy.location}</span>
              <span className="px-1.5 text-amber-800 max-sm:hidden">·</span>
              <span className="text-amber-800 max-sm:hidden">{copy.directLine}</span>
            </span>
          </span>
        </a>

        <nav aria-label={copy.nav} className="hidden max-w-[650px] flex-[1_1_auto] items-center justify-center gap-0.5 rounded-full border border-stone-900/10 bg-white/66 p-1 shadow-sm shadow-stone-900/5 xl:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="whitespace-nowrap rounded-full px-2 py-2 text-center text-[13px] font-black text-stone-700 2xl:px-3 2xl:text-[13.5px] transition hover:bg-amber-50 hover:text-amber-900">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <LanguagePills currentLanguage={language} pathname={pathname} languageHrefs={headerLinks.languages} />
          <a href={headerLinks.nav.rates} className="inline-flex h-12 min-w-[112px] items-center justify-center rounded-full bg-gradient-to-br from-[#78624d] to-[#735f45] px-5 text-center text-xs font-black uppercase leading-none tracking-[0.1em] !text-white shadow-lg shadow-stone-900/20 transition hover:-translate-y-0.5 hover:from-[#6b5847] hover:to-[#5f4e3f]">
            {copy.bookNow}
          </a>
        </div>

        <button ref={menuButtonRef} type="button" aria-label={isOpen ? copy.close : copy.menu} aria-expanded={isOpen} aria-controls="vh-mobile-menu" onClick={() => setIsOpen((value) => !value)} className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-stone-900/10 bg-white text-stone-900 shadow-sm shadow-stone-900/5 xl:hidden">
          <span className="sr-only">{copy.menu}</span>
          <span className="grid gap-1.5">
            <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

    </header>
      <div className={`fixed inset-0 top-[72px] z-50 [transition-property:visibility] duration-300 lg:top-[84px] xl:hidden ${isOpen ? "visible" : "invisible"}`}>
        <button type="button" tabIndex={-1} aria-label={copy.close} onClick={closeMenu} className={`absolute inset-0 h-full w-full bg-stone-950/45 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} />
        <div
          id="vh-mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={copy.nav}
          className={`absolute bottom-0 right-0 top-0 flex w-[min(88vw,400px)] flex-col overflow-y-auto overscroll-contain bg-[#fffaf3] px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-2xl shadow-stone-950/25 transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <a href={headerLinks.nav.rates} onClick={closeMenu} className="flex min-h-12 items-center justify-center rounded-full bg-gradient-to-br from-[#78624d] to-[#735f45] px-5 text-sm font-black uppercase tracking-[0.1em] !text-white shadow-lg shadow-stone-900/15 transition hover:from-[#6b5847] hover:to-[#5f4e3f] lg:hidden">
            {copy.bookNow}
          </a>

          <div className="mt-3 lg:hidden">
            <LanguagePills currentLanguage={language} pathname={pathname} languageHrefs={headerLinks.languages} onNavigate={closeMenu} fullWidth />
          </div>

          <nav aria-label={copy.nav} className="mt-5 lg:mt-0">
            <ul className="border-t border-stone-900/10">
              {links.map((link) => (
                <li key={link.href} className="border-b border-stone-900/10">
                  <a href={link.href} onClick={closeMenu} aria-current={isCurrent(link.href) ? "page" : undefined} className={`group flex min-h-[54px] items-center justify-between gap-3 py-3 text-[17px] font-bold tracking-[-0.01em] transition hover:text-amber-800 ${isCurrent(link.href) ? "text-amber-800" : "text-stone-900"}`}>
                    <span>{link.label}</span>
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-amber-800" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-6 text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">{copy.exploreTitle}</p>
          <ul className="mt-1">
            {exploreLinks.map((link) => (
              <li key={link.href} className="border-b border-stone-900/10 last:border-b-0">
                <a href={link.href} onClick={closeMenu} aria-current={isCurrent(link.href) ? "page" : undefined} className={`group flex min-h-12 items-center justify-between gap-3 py-2.5 transition hover:text-amber-800 ${isCurrent(link.href) ? "text-amber-800" : "text-stone-800"}`}>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold leading-tight">{link.label}</span>
                    {link.text ? <span className="mt-0.5 block text-[12px] font-medium leading-tight text-stone-500">{link.text}</span> : null}
                  </span>
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-amber-800" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                </a>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </>
  );
}
