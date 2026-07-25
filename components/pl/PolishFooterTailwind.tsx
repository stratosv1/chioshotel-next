import Link from "next/link";

export function PolishFooterTailwind() {
  const year = new Date().getFullYear();
  const groups = [
    {
      title: "Pobyt",
      links: [
        { label: "Pokoje", href: "/pl/pokoje-na-chios/" },
        { label: "Apartamenty rodzinne", href: "/pl/apartamenty-na-chios/" },
        { label: "Noclegi na Chios", href: "/pl/noclegi-chios/" },
        { label: "Rezerwacja i dostępność", href: "/pl/rezerwacja/" },
      ],
    },
    {
      title: "Odkryj Chios",
      links: [
        { label: "Kambos na Chios", href: "/pl/kambos-chios/" },
        { label: "Hotele na Chios", href: "/pl/hotele-chios/" },
        { label: "Pokoje Economy", href: "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/" },
        { label: "Pokoje standardowe", href: "/pl/pokoje-na-chios/pokoje-standardowe/" },
      ],
    },
    {
      title: "Popularne",
      links: [
        { label: "Gdzie nocować na Chios", href: "/pl/noclegi-chios/" },
        { label: "Pokoje dla par", href: "/pl/pokoje-na-chios/" },
        { label: "Apartament dla rodziny", href: "/pl/apartamenty-na-chios/" },
        { label: "Sprawdź dostępność", href: "/pl/rezerwacja/" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-stone-950 pb-24 text-white md:pb-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(168,120,66,.2),transparent_28rem),radial-gradient(circle_at_85%_30%,rgba(255,255,255,.08),transparent_24rem)]" />
      <div className="relative mx-auto grid max-w-7xl gap-4 px-4 py-7 sm:px-6 md:gap-10 md:py-14 lg:grid-cols-[0.92fr_1.65fr] lg:px-8 lg:py-20">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/15 backdrop-blur md:rounded-[2rem] md:p-8 md:shadow-2xl">
          <Link href="/pl/" className="flex items-center gap-3 md:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-stone-900 shadow-lg shadow-black/20 md:h-14 md:w-14 md:text-lg">VH</span>
            <span className="min-w-0">
              <strong className="block truncate text-xl font-black leading-none tracking-[-0.055em] text-white md:text-2xl">Voulamandis House</strong>
              <small className="mt-1 block text-[10px] font-black uppercase tracking-[0.16em] text-white/50 md:mt-2 md:text-xs">Kambos, Chios</small>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-white/70 md:mt-6 md:max-w-xl md:text-base md:leading-8">
            Spokojne pokoje i apartamenty w historycznym Kambos na Chios, z wygodnym dojazdem do miasta, lotniska, portu i południowych plaż.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 md:mt-7 md:grid-cols-2 lg:flex lg:flex-wrap">
            <Link href="/pl/rezerwacja/" aria-label="Rezerwacja" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-3 text-[11px] font-black uppercase tracking-[0.08em] text-stone-900 shadow-lg shadow-black/10 lg:px-5"><span aria-hidden="true">📅</span><span>Rezerwuj</span></Link>
            <a href="https://wa.me/306944474226" target="_blank" rel="noopener" aria-label="WhatsApp" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 text-[11px] font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-[#25D366]/25 transition hover:bg-[#1ebe5d] lg:px-5"><span aria-hidden="true">💬</span><span>WhatsApp</span></a>
            <a href="https://www.instagram.com/chioshotels/" target="_blank" rel="noopener" aria-label="Instagram" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 text-[11px] font-black uppercase tracking-[0.08em] text-white lg:px-5"><span aria-hidden="true">◎</span><span>Instagram</span></a>
            <a href="https://www.facebook.com/people/Voulamandis-House/100063584320703/" target="_blank" rel="noopener" aria-label="Facebook" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 text-[11px] font-black uppercase tracking-[0.08em] text-white lg:px-5"><span aria-hidden="true">f</span><span>Facebook</span></a>
          </div>
        </section>

        <nav aria-label="Nawigacja w stopce" className="grid gap-3 md:gap-4 sm:grid-cols-3">
          {groups.map((group) => (
            <section key={group.title} className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-3 backdrop-blur md:rounded-[1.75rem] md:p-5">
              <h2 className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-200 md:text-sm">{group.title}</h2>
              <ul className="mt-3 grid grid-cols-1 gap-1.5 md:mt-5 md:gap-3">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}`}>
                    <Link href={link.href} className="group flex min-h-9 items-center justify-between rounded-2xl bg-white/[0.04] px-3 py-2 text-[12px] font-bold text-white/75 ring-1 ring-white/5 transition hover:bg-white/10 hover:text-white md:bg-transparent md:text-sm md:ring-0">
                      <span className="truncate">{link.label}</span><span className="hidden opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100 md:inline">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>
      <div className="relative border-t border-white/10 px-4 py-4 md:py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white/42 sm:flex-row sm:items-center sm:justify-between md:text-xs md:tracking-[0.12em]">
          <p>© {year} Voulamandis House. Wszelkie prawa zastrzeżone.</p>
          <p>Pokoje i apartamenty na Chios · Rezerwacja bezpośrednia</p>
        </div>
      </div>
    </footer>
  );
}
