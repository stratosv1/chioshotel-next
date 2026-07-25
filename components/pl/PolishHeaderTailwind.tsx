"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const homepageLanguageLinks = [
  ["EN", "/"],
  ["EL", "/el/"],
  ["FR", "/fr/"],
  ["DE", "/de/"],
  ["IT", "/it/"],
  ["ES", "/es/"],
  ["TR", "/tr/"],
  ["PL", "/pl/"],
] as const;

const localizedPageLinks: Record<string, readonly (readonly [string, string])[]> = {
  "/pl/noclegi-chios/": [
    ["EN", "/chios-accommodation/"], ["EL", "/el/diamoni-sti-xio/"], ["FR", "/fr/hebergement-chios/"], ["DE", "/de/chios-unterkunft/"], ["IT", "/it/alloggio-chios/"], ["ES", "/es/alojamiento-chios/"], ["TR", "/tr/sakiz-adasi-konaklama/"], ["PL", "/pl/noclegi-chios/"],
  ],
  "/pl/hotele-chios/": [
    ["EN", "/chios-hotels/"], ["EL", "/el/xenodoxeia-xios/"], ["FR", "/fr/hotels-chios/"], ["DE", "/de/hotels-auf-chios/"], ["IT", "/it/hotel-chios/"], ["ES", "/es/hoteles-chios/"], ["TR", "/tr/sakiz-adasi-otelleri/"], ["PL", "/pl/hotele-chios/"],
  ],
  "/pl/pokoje-na-chios/": [
    ["EN", "/chios-rooms/"], ["EL", "/el/domatia-xios/"], ["FR", "/fr/chambres-a-chios/"], ["DE", "/de/chios-zimmer/"], ["IT", "/it/camere-a-chios/"], ["ES", "/es/habitaciones-en-chios/"], ["TR", "/tr/sakiz-adasi-odalari/"], ["PL", "/pl/pokoje-na-chios/"],
  ],
  "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/": [
    ["EN", "/chios-rooms/economy-double-rooms/"], ["EL", "/el/domatia-xios/oikonomiko-diklino-domatio/"], ["FR", "/fr/chambres-a-chios/chambres-doubles-economiques/"], ["DE", "/de/zimmer-chios/economy-zimmer-auf-chios/"], ["IT", "/it/stanze-a-chios/camera-doppia-economica-chios/"], ["ES", "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/"], ["TR", "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/"], ["PL", "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/"],
  ],
  "/pl/pokoje-na-chios/pokoje-standardowe/": [
    ["EN", "/chios-rooms/standard-double-room/"], ["EL", "/el/domatia-xios/diklina-triklina-domatia/"], ["FR", "/fr/chambres-a-chios/chambres-doubles-standard/"], ["DE", "/de/zimmer-chios/standard-doppelzimmer-auf-chios/"], ["IT", "/it/stanze-a-chios/camere-doppie-standard-chios/"], ["ES", "/es/habitaciones-en-chios/habitaciones-dobles-estandar/"], ["TR", "/tr/chios-odalari/standart-cift-kisilik-odalar/"], ["PL", "/pl/pokoje-na-chios/pokoje-standardowe/"],
  ],
  "/pl/apartamenty-na-chios/": [
    ["EN", "/chios-rooms/family-chios-apartments/"], ["EL", "/el/domatia-xios/oikogeneiako-diamerisma/"], ["FR", "/fr/chambres-a-chios/appartements-familiaux-de-chios/"], ["DE", "/de/zimmer-chios/familienapartments-in-chios/"], ["IT", "/it/stanze-a-chios/appartamenti-familiari-a-chios/"], ["ES", "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/"], ["TR", "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/"], ["PL", "/pl/apartamenty-na-chios/"],
  ],
  "/pl/kambos-chios/": [
    ["EN", "/chios/kampos-chios/"], ["EL", "/el/chios/kampos-chios/"], ["FR", "/fr/chios/kampos-chios/"], ["DE", "/de/chios/kampos-chios/"], ["IT", "/it/chios/kampos-chios/"], ["ES", "/es/chios/kampos-chios/"], ["TR", "/tr/chios/kampos-chios/"], ["PL", "/pl/kambos-chios/"],
  ],
  "/pl/rezerwacja/": [
    ["EN", "/chios-hotels-rates/"], ["EL", "/el/amesi-kratisi-voulamandis-house/"], ["FR", "/fr/tarifs-des-hotels-a-chios/"], ["DE", "/de/hotelpreise-auf-der-insel-chios/"], ["IT", "/it/prezzi-hotel-chios/"], ["ES", "/es/los-mejores-precios-de-hotel-en-la-isla-chios/"], ["TR", "/tr/sakiz-adasi-rezervasyon/"], ["PL", "/pl/rezerwacja/"],
  ],
};

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function languageLinksForPath(pathname: string) {
  const normalizedPathname = normalizePath(pathname);
  if (normalizedPathname === "/pl/") return homepageLanguageLinks;
  return localizedPageLinks[normalizedPathname] || homepageLanguageLinks;
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
  return { hour: Number(value("hour")), minute: Number(value("minute")), dateLabel: `${value("day")} ${value("month")}` };
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

function LanguagePills({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Język" className="flex min-w-0 flex-nowrap items-center gap-1 overflow-x-auto rounded-full border border-stone-900/10 bg-white/85 p-1 shadow-sm shadow-stone-900/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {languageLinksForPath(pathname).map(([label, href]) => (
        <Link
          key={label}
          href={href}
          hrefLang={label.toLowerCase()}
          lang={label.toLowerCase()}
          aria-current={label === "PL" ? "page" : undefined}
          title={label === "PL" ? "Polski" : label}
          onClick={onNavigate}
          className={`flex h-8 min-w-9 shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-black uppercase tracking-[0.08em] transition ${label === "PL" ? "bg-[#fff4df] text-amber-900 shadow-sm ring-1 ring-amber-800/20" : "text-stone-700 hover:bg-amber-50 hover:text-amber-900"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function PolishHeaderTailwind({ pathname = "/pl/" }: { pathname?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const reception = useReceptionStatus();
  const statusLabel = reception.isOpen ? "OPEN" : "06:00";

  const links = [
    { label: "Pokoje", href: "/pl/pokoje-na-chios/", icon: "🛏️" },
    { label: "Noclegi", href: "/pl/noclegi-chios/", icon: "🏡" },
    { label: "Kambos", href: "/pl/kambos-chios/", icon: "🌿" },
    { label: "Hotele Chios", href: "/pl/hotele-chios/", icon: "✨" },
    { label: "Apartamenty", href: "/pl/apartamenty-na-chios/", icon: "👨‍👩‍👧‍👦" },
  ];

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-[#fffaf3]/92 shadow-[0_10px_30px_rgba(41,30,20,0.07)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#fffaf3]/82">
      <div className="mx-auto flex h-[72px] w-full max-w-none items-center gap-3 px-3 sm:px-5 lg:h-[84px] lg:px-6 xl:px-8">
        <Link href="/pl/" onClick={closeMenu} className="group flex min-w-0 flex-1 items-center gap-3 lg:max-w-[500px] xl:flex-[0_1_470px] 2xl:flex-[0_1_560px]">
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
              <span>Kambos, Chios</span><span className="px-1.5 text-amber-800">·</span><span className="text-amber-800">Rezerwacja bezpośrednia · Najlepsza oferta</span>
            </span>
          </span>
        </Link>

        <nav aria-label="Główna nawigacja" className="hidden max-w-[650px] flex-[1_1_auto] items-center justify-center gap-0.5 rounded-full border border-stone-900/10 bg-white/66 p-1 shadow-sm shadow-stone-900/5 xl:flex">
          {links.slice(0, 4).map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-2.5 py-2 text-center text-[13.5px] font-black text-stone-700 transition hover:bg-amber-50 hover:text-amber-900 2xl:px-3">{link.label}</Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <LanguagePills pathname={pathname} />
          <Link href="/pl/rezerwacja/" className="inline-flex h-12 min-w-[112px] items-center justify-center rounded-full bg-gradient-to-br from-[#a87842] to-[#8e6607] px-5 text-center text-xs font-black uppercase leading-none tracking-[0.1em] !text-white shadow-lg shadow-amber-900/20 transition hover:-translate-y-0.5">Rezerwuj</Link>
        </div>

        <button type="button" aria-label={isOpen ? "Zamknij" : "Menu"} aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)} className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-stone-900/10 bg-white text-stone-900 shadow-sm shadow-stone-900/5 lg:hidden">
          <span className="sr-only">Menu</span>
          <span className="grid gap-1.5">
            <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div className={`fixed inset-0 top-[72px] z-50 bg-stone-950/15 backdrop-blur-[1px] transition lg:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <button type="button" aria-label="Zamknij" onClick={closeMenu} className="absolute inset-0 h-full w-full" />
        <div className={`absolute right-0 top-0 w-[min(92vw,420px)] rounded-l-[1.5rem] bg-[#fffaf3] p-3 pb-5 shadow-2xl shadow-stone-950/18 transition duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="mb-2"><LanguagePills pathname={pathname} onNavigate={closeMenu} /></div>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <Link href="/pl/rezerwacja/" onClick={closeMenu} className="flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-br from-[#b8873f] to-[#8e6607] px-4 text-center text-sm font-black uppercase tracking-[0.08em] !text-white shadow-lg shadow-amber-900/12">Rezerwuj</Link>
            <Link href="/pl/pokoje-na-chios/" onClick={closeMenu} className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-amber-900/15 bg-white px-4 text-center text-sm font-black uppercase tracking-[0.08em] text-amber-900 shadow-sm shadow-stone-900/5"><span aria-hidden="true">🛏️</span>Pokoje</Link>
          </div>
          <section className="rounded-[1.15rem] border border-stone-900/10 bg-white p-2.5 shadow-sm shadow-stone-900/5">
            <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-[0.16em] text-stone-500">Nawigacja</p>
            <div className="grid grid-cols-2 gap-2">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeMenu} className="flex min-h-[54px] items-center gap-2 rounded-2xl bg-gradient-to-br from-white to-[#fff7ea] px-3 py-2 text-stone-800 ring-1 ring-amber-900/10 shadow-sm shadow-stone-900/[0.03]">
                  <span className="text-[19px]" aria-hidden="true">{link.icon}</span><span className="min-w-0"><strong className="block truncate text-[13px] font-black leading-tight">{link.label}</strong></span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </header>
  );
}
