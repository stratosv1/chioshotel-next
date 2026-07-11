"use client";

import { useState } from "react";
import type { LanguageCode } from "@/lib/languages";
import { languages, normalizePath } from "@/lib/languages";
import { getRouteByPath, getRoutesByItemId } from "@/lib/url-map";

type HeaderProps = {
  language?: LanguageCode;
  pathname?: string;
};

type HeaderCopy = {
  bookNow: string;
  menu: string;
  close: string;
  stay: string;
  explore: string;
  direct: string;
  nav: string;
  language: string;
  links: {
    rooms: string;
    findRoom: string;
    deals: string;
    chios: string;
    beaches: string;
    villages: string;
    museums: string;
    activities: string;
    contact: string;
  };
};

const copyByLanguage: Record<LanguageCode, HeaderCopy> = {
  en: {
    bookNow: "Book Now",
    menu: "Menu",
    close: "Close",
    stay: "Stay",
    explore: "Explore Chios",
    direct: "Direct availability",
    nav: "Main navigation",
    language: "Language",
    links: { rooms: "Rooms", findRoom: "Find your room", deals: "Deals", chios: "Chios Island", beaches: "Beaches", villages: "Villages", museums: "Museums", activities: "Activities", contact: "Contact" },
  },
  el: {
    bookNow: "Κράτηση",
    menu: "Μενού",
    close: "Κλείσιμο",
    stay: "Διαμονή",
    explore: "Ανακαλύψτε τη Χίο",
    direct: "Άμεση διαθεσιμότητα",
    nav: "Κύρια πλοήγηση",
    language: "Γλώσσα",
    links: { rooms: "Δωμάτια", findRoom: "Βρες δωμάτιο", deals: "Προσφορές", chios: "Χίος", beaches: "Παραλίες", villages: "Χωριά", museums: "Μουσεία", activities: "Δραστηριότητες", contact: "Επικοινωνία" },
  },
  fr: {
    bookNow: "Réserver",
    menu: "Menu",
    close: "Fermer",
    stay: "Séjour",
    explore: "Explorer Chios",
    direct: "Disponibilité directe",
    nav: "Navigation principale",
    language: "Langue",
    links: { rooms: "Chambres", findRoom: "Trouver une chambre", deals: "Offres", chios: "Île de Chios", beaches: "Plages", villages: "Villages", museums: "Musées", activities: "Activités", contact: "Contact" },
  },
  de: {
    bookNow: "Buchen",
    menu: "Menü",
    close: "Schließen",
    stay: "Aufenthalt",
    explore: "Chios entdecken",
    direct: "Direkte Verfügbarkeit",
    nav: "Hauptnavigation",
    language: "Sprache",
    links: { rooms: "Zimmer", findRoom: "Zimmer finden", deals: "Angebote", chios: "Insel Chios", beaches: "Strände", villages: "Dörfer", museums: "Museen", activities: "Aktivitäten", contact: "Kontakt" },
  },
  it: {
    bookNow: "Prenota",
    menu: "Menu",
    close: "Chiudi",
    stay: "Soggiorno",
    explore: "Esplora Chios",
    direct: "Disponibilità diretta",
    nav: "Navigazione principale",
    language: "Lingua",
    links: { rooms: "Camere", findRoom: "Trova camera", deals: "Offerte", chios: "Isola di Chios", beaches: "Spiagge", villages: "Villaggi", museums: "Musei", activities: "Attività", contact: "Contatti" },
  },
  es: {
    bookNow: "Reservar",
    menu: "Menú",
    close: "Cerrar",
    stay: "Estancia",
    explore: "Explorar Chios",
    direct: "Disponibilidad directa",
    nav: "Navegación principal",
    language: "Idioma",
    links: { rooms: "Habitaciones", findRoom: "Encuentra habitación", deals: "Ofertas", chios: "Isla de Chios", beaches: "Playas", villages: "Pueblos", museums: "Museos", activities: "Actividades", contact: "Contacto" },
  },
  tr: {
    bookNow: "Rezervasyon",
    menu: "Menü",
    close: "Kapat",
    stay: "Konaklama",
    explore: "Sakız’ı keşfet",
    direct: "Direkt müsaitlik",
    nav: "Ana gezinme",
    language: "Dil",
    links: { rooms: "Odalar", findRoom: "Odanı bul", deals: "Fırsatlar", chios: "Sakız Adası", beaches: "Plajlar", villages: "Köyler", museums: "Müzeler", activities: "Aktiviteler", contact: "İletişim" },
  },
};

const routeIds = {
  home: "home",
  rooms: "rooms-category",
  findRoom: "find-your-room",
  deals: "deals",
  chios: "chios-index",
  beaches: "beaches-index",
  villages: "villages-index",
  museums: "museums-index",
  activities: "chios-activities-hub",
  contact: "contact",
} as const;

function pathFor(itemId: string, language: LanguageCode) {
  return getRoutesByItemId(itemId).find((route) => route.language === language && route.action === "KEEP")?.path || "/";
}

function languageHref(pathname: string, language: LanguageCode) {
  const route = getRouteByPath(normalizePath(pathname));

  if (!route) {
    return pathFor(routeIds.home, language);
  }

  return getRoutesByItemId(route.itemId).find((item) => item.language === language && item.action === "KEEP")?.path || pathFor(routeIds.home, language);
}

function LanguagePills({ currentLanguage, pathname, onNavigate }: { currentLanguage: LanguageCode; pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label={copyByLanguage[currentLanguage].language} className="flex min-w-0 flex-nowrap items-center gap-1 overflow-x-auto rounded-full border border-stone-900/10 bg-white/85 p-1 shadow-sm shadow-stone-900/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {languages.map((item) => {
        const active = item.code === currentLanguage;
        return (
          <a key={item.code} href={languageHref(pathname, item.code)} hrefLang={item.code} lang={item.code} aria-current={active ? "page" : undefined} title={item.label} onClick={onNavigate} className={`flex h-8 min-w-9 items-center justify-center rounded-full px-2 text-[11px] font-black uppercase tracking-[0.08em] transition ${active ? "bg-stone-900 text-white shadow-sm" : "text-stone-700 hover:bg-stone-100"}`}>
            {item.code.toUpperCase()}
          </a>
        );
      })}
    </nav>
  );
}

export function VoulamandisHeaderTailwind({ language = "en", pathname = "/" }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = copyByLanguage[language] || copyByLanguage.en;
  const links = [
    { label: copy.links.rooms, href: pathFor(routeIds.rooms, language), icon: "🛏️" },
    { label: copy.links.findRoom, href: pathFor(routeIds.findRoom, language), icon: "🔎" },
    { label: copy.links.deals, href: pathFor(routeIds.deals, language), icon: "🔥" },
    { label: copy.links.chios, href: pathFor(routeIds.chios, language), icon: "🏝️" },
    { label: copy.links.activities, href: pathFor(routeIds.activities, language), icon: "✨" },
    { label: copy.links.contact, href: pathFor(routeIds.contact, language), icon: "💬" },
  ];
  const exploreLinks = [
    { label: copy.links.beaches, href: pathFor(routeIds.beaches, language), text: "Clear waters", icon: "🌊" },
    { label: copy.links.villages, href: pathFor(routeIds.villages, language), text: "Mastic villages", icon: "🏘️" },
    { label: copy.links.museums, href: pathFor(routeIds.museums, language), text: "Culture", icon: "🏛️" },
    { label: copy.links.activities, href: pathFor(routeIds.activities, language), text: "Local moments", icon: "🌿" },
  ];

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-[#fffaf3]/90 shadow-[0_10px_30px_rgba(41,30,20,0.07)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#fffaf3]/78">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center gap-3 px-3 sm:px-5 lg:h-[84px] lg:px-8">
        <a href={pathFor(routeIds.home, language)} onClick={closeMenu} className="group flex min-w-0 flex-1 items-center gap-3 lg:flex-none">
          <span className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-amber-900/10 bg-white shadow-lg shadow-stone-900/10 lg:h-14 lg:w-14">
            <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.95),transparent_55%)]" />
            <img src="/favicon/vh-heart-128.webp" alt="" className="relative h-11 w-11 object-contain transition duration-300 group-hover:scale-110" />
          </span>
          <span className="min-w-0">
            <strong className="block truncate text-[1.08rem] font-black leading-none tracking-[-0.055em] text-stone-900 sm:text-[1.28rem] lg:text-[1.45rem]">Voulamandis House</strong>
            <span className="mt-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-stone-500 sm:text-[11px]">
              <span>Kampos, Chios</span>
              <span className="hidden h-1.5 w-1.5 rounded-full bg-emerald-500 sm:block" />
              <span className="hidden text-emerald-700 sm:inline">{copy.direct}</span>
            </span>
          </span>
        </a>

        <nav aria-label={copy.nav} className="hidden flex-1 items-center justify-center gap-1 rounded-full border border-stone-900/10 bg-white/62 p-1.5 shadow-sm shadow-stone-900/5 xl:flex">
          {links.slice(0, 5).map((link) => (
            <a key={link.href} href={link.href} className="rounded-full px-3.5 py-2 text-[13px] font-black text-stone-700 transition hover:bg-stone-900 hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguagePills currentLanguage={language} pathname={pathname} />
          <a href={pathFor(routeIds.findRoom, language)} className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-br from-[#a87842] to-[#8e6607] px-5 text-xs font-black uppercase tracking-[0.1em] !text-white shadow-lg shadow-amber-900/20 transition hover:-translate-y-0.5">
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

      <div className={`fixed inset-0 top-[72px] z-50 bg-stone-950/25 backdrop-blur-[2px] transition lg:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <button type="button" aria-label={copy.close} onClick={closeMenu} className="absolute inset-0 h-full w-full" />
        <div className={`absolute right-0 top-0 h-[calc(100svh-72px)] w-[min(92vw,420px)] overflow-y-auto rounded-l-[1.5rem] bg-[#fffaf3] p-4 pb-28 shadow-2xl shadow-stone-950/20 transition duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="mb-3 flex items-center justify-between gap-4 rounded-[1.35rem] border border-amber-900/10 bg-white p-4 shadow-sm shadow-stone-900/5">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-800/70">{copy.menu}</span>
              <h2 className="mt-1 text-[1.45rem] font-black leading-none tracking-[-0.045em] text-stone-900">Voulamandis House</h2>
            </div>
            <button type="button" onClick={closeMenu} className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-2xl text-white">×</button>
          </div>

          <div className="mb-3">
            <p className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">{copy.language}</p>
            <LanguagePills currentLanguage={language} pathname={pathname} onNavigate={closeMenu} />
          </div>

          <a href={pathFor(routeIds.findRoom, language)} onClick={closeMenu} className="mb-3 flex min-h-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#b8873f] to-[#8e6607] px-5 text-sm font-black uppercase tracking-[0.1em] !text-white shadow-lg shadow-amber-900/15">
            {copy.bookNow}
          </a>

          <section className="mb-4 rounded-[1.35rem] border border-stone-900/10 bg-white p-3 shadow-sm shadow-stone-900/5">
            <p className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">{copy.stay}</p>
            <div className="grid grid-cols-2 gap-2">
              {links.map((link) => (
                <a key={link.href} href={link.href} onClick={closeMenu} className="flex min-h-[74px] flex-col justify-center rounded-2xl bg-[#fff7ea] px-3 py-3 text-stone-800 ring-1 ring-amber-900/10">
                  <span className="mb-1 text-xl" aria-hidden="true">{link.icon}</span>
                  <strong className="text-sm font-black leading-tight">{link.label}</strong>
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-[1.35rem] border border-stone-900/10 bg-white p-3 shadow-sm shadow-stone-900/5">
            <p className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">{copy.explore}</p>
            <div className="grid grid-cols-2 gap-2">
              {exploreLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={closeMenu} className="flex min-h-[84px] flex-col justify-between rounded-2xl bg-gradient-to-br from-white to-[#fff4df] p-3 text-stone-800 ring-1 ring-amber-900/10 shadow-sm shadow-stone-900/5">
                  <span className="text-2xl" aria-hidden="true">{link.icon}</span>
                  <span>
                    <strong className="block text-sm font-black leading-tight">{link.label}</strong>
                    <small className="mt-1 block text-[10px] font-black uppercase tracking-[0.12em] text-amber-800/70">{link.text}</small>
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
