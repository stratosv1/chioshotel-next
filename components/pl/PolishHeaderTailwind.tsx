import Link from "next/link";

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
    ["EN", "/chios-accommodation/"], ["EL", "/el/diamoni-sti-xio/"],
    ["FR", "/fr/hebergement-chios/"], ["DE", "/de/chios-unterkunft/"],
    ["IT", "/it/alloggio-chios/"], ["ES", "/es/alojamiento-chios/"],
    ["TR", "/tr/sakiz-adasi-konaklama/"], ["PL", "/pl/noclegi-chios/"],
  ],
  "/pl/hotele-chios/": [
    ["EN", "/chios-hotels/"], ["EL", "/el/xenodoxeia-xios/"],
    ["FR", "/fr/hotels-chios/"], ["DE", "/de/hotels-auf-chios/"],
    ["IT", "/it/hotel-chios/"], ["ES", "/es/hoteles-chios/"],
    ["TR", "/tr/sakiz-adasi-otelleri/"], ["PL", "/pl/hotele-chios/"],
  ],
  "/pl/pokoje-na-chios/": [
    ["EN", "/chios-rooms/"], ["EL", "/el/domatia-xios/"],
    ["FR", "/fr/chambres-a-chios/"], ["DE", "/de/chios-zimmer/"],
    ["IT", "/it/camere-a-chios/"], ["ES", "/es/habitaciones-en-chios/"],
    ["TR", "/tr/sakiz-adasi-odalari/"], ["PL", "/pl/pokoje-na-chios/"],
  ],
  "/pl/apartamenty-na-chios/": [
    ["EN", "/chios-rooms/family-chios-apartments/"], ["EL", "/el/domatia-xios/oikogeneiako-diamerisma/"],
    ["FR", "/fr/chambres-a-chios/appartements-familiaux-de-chios/"], ["DE", "/de/zimmer-chios/familienapartments-in-chios/"],
    ["IT", "/it/stanze-a-chios/appartamenti-familiari-a-chios/"], ["ES", "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/"],
    ["TR", "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/"], ["PL", "/pl/apartamenty-na-chios/"],
  ],
  "/pl/kambos-chios/": [
    ["EN", "/chios/kampos-chios/"], ["EL", "/el/chios/kampos-chios/"],
    ["FR", "/fr/chios/kampos-chios/"], ["DE", "/de/chios/kampos-chios/"],
    ["IT", "/it/chios/kampos-chios/"], ["ES", "/es/chios/kampos-chios/"],
    ["TR", "/tr/chios/kampos-chios/"], ["PL", "/pl/kambos-chios/"],
  ],
  "/pl/rezerwacja/": [
    ["EN", "/chios-hotels-rates/"], ["EL", "/el/amesi-kratisi-voulamandis-house/"],
    ["FR", "/fr/tarifs-des-hotels-a-chios/"], ["DE", "/de/hotelpreise-auf-der-insel-chios/"],
    ["IT", "/it/prezzi-hotel-chios/"], ["ES", "/es/los-mejores-precios-de-hotel-en-la-isla-chios/"],
    ["TR", "/tr/sakiz-adasi-rezervasyon/"], ["PL", "/pl/rezerwacja/"],
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

function LanguagePills({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Język" className="flex min-w-0 flex-nowrap items-center gap-1 overflow-x-auto rounded-full border border-stone-900/10 bg-white/85 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {languageLinksForPath(pathname).map(([label, href]) => (
        <Link
          key={label}
          href={href}
          hrefLang={label.toLowerCase()}
          lang={label.toLowerCase()}
          aria-current={label === "PL" ? "page" : undefined}
          className={`flex h-8 min-w-9 shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-black tracking-[0.08em] ${label === "PL" ? "bg-[#fff4df] text-amber-900 ring-1 ring-amber-800/20" : "text-stone-700 hover:bg-amber-50"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function PolishHeaderTailwind({ pathname = "/pl/" }: { pathname?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-[#fffaf3]/95 shadow-[0_10px_30px_rgba(41,30,20,0.07)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center gap-3 px-3 sm:px-5 lg:min-h-[84px] lg:px-8">
        <Link href="/pl/" className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-900/10 bg-white shadow-sm">
            <img src="/favicon/vh-heart-128.webp" alt="" className="h-11 w-11 object-contain" />
          </span>
          <span className="min-w-0">
            <strong className="block truncate text-lg font-black tracking-[-0.04em] text-stone-900 sm:text-xl">Voulamandis House</strong>
            <span className="mt-1 block truncate text-[10px] font-black uppercase tracking-[0.12em] text-stone-500">Kambos, Chios · Rezerwacja bezpośrednia</span>
          </span>
        </Link>

        <nav aria-label="Główna nawigacja" className="hidden items-center gap-1 xl:flex">
          <Link href="/pl/pokoje-na-chios/" className="rounded-full px-3 py-2 text-sm font-black text-stone-700 hover:bg-amber-50 hover:text-amber-900">Pokoje</Link>
          <Link href="/pl/apartamenty-na-chios/" className="rounded-full px-3 py-2 text-sm font-black text-stone-700 hover:bg-amber-50 hover:text-amber-900">Apartamenty</Link>
          <Link href="/pl/noclegi-chios/" className="rounded-full px-3 py-2 text-sm font-black text-stone-700 hover:bg-amber-50 hover:text-amber-900">Noclegi</Link>
          <Link href="/pl/hotele-chios/" className="rounded-full px-3 py-2 text-sm font-black text-stone-700 hover:bg-amber-50 hover:text-amber-900">Hotele Chios</Link>
        </nav>

        <div className="hidden lg:block">
          <LanguagePills pathname={pathname} />
        </div>

        <Link href="/pl/rezerwacja/" className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#a87842] to-[#8e6607] px-4 text-xs font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-amber-900/20 sm:px-5">
          Rezerwuj
        </Link>
      </div>

      <div className="border-t border-stone-900/5 px-3 py-2 lg:hidden">
        <LanguagePills pathname={pathname} />
      </div>
      <div className="flex gap-2 overflow-x-auto border-t border-stone-900/5 px-3 py-2 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link href="/pl/pokoje-na-chios/" className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-stone-700">Pokoje</Link>
        <Link href="/pl/apartamenty-na-chios/" className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-stone-700">Apartamenty</Link>
        <Link href="/pl/noclegi-chios/" className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-stone-700">Noclegi</Link>
        <Link href="/pl/hotele-chios/" className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-stone-700">Hotele Chios</Link>
      </div>
    </header>
  );
}
