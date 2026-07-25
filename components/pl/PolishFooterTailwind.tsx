import Link from "next/link";

export function PolishFooterTailwind() {
  return (
    <footer className="border-t border-stone-200 bg-[#f6f1e8] text-stone-700">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-3 md:px-8">
        <div>
          <p className="text-lg font-black text-stone-900">Voulamandis House</p>
          <p className="mt-3 max-w-md text-sm leading-6">
            Spokojne pokoje i apartamenty w historycznym Kambos na wyspie Chios, blisko miasta, lotniska, portu i plaż.
          </p>
        </div>
        <div>
          <p className="font-bold text-stone-900">Pobyt</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/pl/noclegi-chios/">Noclegi na Chios</Link>
            <Link href="/pl/pokoje-na-chios/">Pokoje na Chios</Link>
            <Link href="/pl/apartamenty-na-chios/">Apartamenty na Chios</Link>
            <Link href="/pl/hotele-chios/">Hotele na Chios</Link>
          </div>
        </div>
        <div>
          <p className="font-bold text-stone-900">Rezerwacja bezpośrednia</p>
          <p className="mt-3 text-sm leading-6">Skontaktuj się bezpośrednio z obiektem i sprawdź dostępność bez pośredników.</p>
          <Link href="/pl/rezerwacja/" className="mt-4 inline-flex rounded-full bg-stone-900 px-5 py-2.5 text-sm font-bold text-white">
            Sprawdź dostępność
          </Link>
        </div>
      </div>
      <div className="border-t border-stone-200 px-5 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Voulamandis House · Kambos, Chios
      </div>
    </footer>
  );
}
