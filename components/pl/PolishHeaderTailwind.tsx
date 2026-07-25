import Link from "next/link";

const languageLinks = [
  ["EN", "/"],
  ["EL", "/el/"],
  ["FR", "/fr/"],
  ["DE", "/de/"],
  ["IT", "/it/"],
  ["ES", "/es/"],
  ["TR", "/tr/"],
  ["PL", "/pl/"],
] as const;

export function PolishHeaderTailwind() {
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

        <div className="hidden items-center gap-1 rounded-full border border-stone-900/10 bg-white/85 p-1 lg:flex">
          {languageLinks.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              hrefLang={label.toLowerCase()}
              className={`flex h-8 min-w-9 items-center justify-center rounded-full px-2 text-[11px] font-black tracking-[0.08em] ${label === "PL" ? "bg-[#fff4df] text-amber-900 ring-1 ring-amber-800/20" : "text-stone-700 hover:bg-amber-50"}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <Link href="/pl/rezerwacja/" className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#a87842] to-[#8e6607] px-4 text-xs font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-amber-900/20 sm:px-5">
          Rezerwuj
        </Link>
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
