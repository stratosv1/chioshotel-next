import Image from "next/image";
import type { ReactNode } from "react";

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const eyebrow = "text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[#9a7a62] sm:text-xs";
const heading = "text-balance font-serif text-[2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#493a31] sm:text-4xl lg:text-5xl";
const body = "text-[0.96rem] leading-7 text-[#75665b] sm:text-lg sm:leading-8";

const rooms = [
  {
    title: "Ekonomiczne pokoje dwuosobowe",
    subtitle: "Dla 2 gości",
    badge: "Dobra cena",
    image: "/images/rooms/received_1753964631359257.webp",
    href: "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/",
  },
  {
    title: "Pokoje na parterze",
    subtitle: "Dwu- i trzyosobowe",
    badge: "Bez schodów",
    image: "/images/rooms/double-triple-room.jpg",
    href: "/pl/pokoje-na-chios/pokoje-standardowe/",
  },
  {
    title: "Pokoje na piętrze",
    subtitle: "Dwu- i trzyosobowe",
    badge: "Taras i widok",
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
    href: "/pl/pokoje-na-chios/pokoje-standardowe/",
  },
  {
    title: "Apartamenty rodzinne",
    subtitle: "Więcej przestrzeni i kuchnia",
    badge: "Dla rodzin",
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    href: "/pl/apartamenty-na-chios/",
  },
] as const;

const facts = [["1,5 km", "plaża"], ["3 km", "lotnisko"], ["6 km", "miasto i port"], ["Bezpłatny", "parking"]] as const;

function Cta({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return (
    <a href={href} className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-center text-[0.78rem] font-extrabold transition hover:-translate-y-0.5 sm:min-h-12 sm:px-6 sm:text-sm ${secondary ? "border border-[#d8c8b8] bg-[#fffdf9] !text-[#57463b] hover:bg-[#f5ede4]" : "bg-[#6f5949] !text-white shadow-md shadow-[#6f5949]/15 hover:bg-[#5e493c]"}`}>
      {children}
    </a>
  );
}

export function PolishKamposLandingPage() {
  return (
    <main className="overflow-hidden bg-[#f8f4ee] text-[#493a31]">
      <section className="bg-gradient-to-br from-[#fffdf9] via-[#f4ede5] to-[#eadfd4] pt-20 sm:pt-28">
        <div className={`${shell} grid items-center gap-6 pb-8 sm:gap-10 sm:pb-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14`}>
          <div>
            <p className={eyebrow}>Kambos Chios · Voulamandis House</p>
            <h1 className="mt-3 max-w-4xl text-balance font-serif text-[2.4rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#493a31] sm:text-6xl lg:text-7xl">Noclegi w Kambos na Chios</h1>
            <p className={`${body} mt-4 max-w-2xl sm:mt-6`}>Spokojne pokoje i rodzinne apartamenty pośród ogrodów cytrusowych, blisko plaż, lotniska i miasta Chios, a jednocześnie z dala od miejskiego hałasu.</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex"><Cta href="/pl/pokoje-na-chios/">Zobacz pokoje</Cta><Cta href="/pl/rezerwacja/" secondary>Sprawdź ceny</Cta></div>
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:mt-7 sm:grid-cols-4">{facts.map(([value, label]) => <li key={label} className="rounded-2xl border border-[#e4d7cb] bg-[#fffdf9]/90 px-3 py-3 shadow-sm"><strong className="block font-serif text-lg text-[#59473b] sm:text-xl">{value}</strong><span className="block text-[0.7rem] font-semibold text-[#8a7869] sm:text-xs">{label}</span></li>)}</ul>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] shadow-xl shadow-[#6f5949]/12 sm:aspect-[5/4] sm:rounded-[2.5rem] lg:aspect-[4/5]"><Image src="/images/kampos/kambos-chios.jpg" alt="Historyczny Kambos na Chios z kamiennymi rezydencjami i ogrodami cytrusowymi" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 46vw" /></div>
        </div>
      </section>

      <section className={`${shell} py-9 sm:py-16`}><div className="grid items-center gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"><div><p className={eyebrow}>Inny rytm pobytu</p><h2 className={`${heading} mt-3`}>Spokój, charakter i wygodna lokalizacja</h2></div><div className="space-y-4 rounded-3xl border border-[#eadfd4] bg-[#fffdf9] p-5 shadow-sm sm:p-7"><p className={body}>Kambos to jedna z najbardziej charakterystycznych i historycznych części Chios, znana z kamiennych rezydencji, wysokich murów, ogrodów cytrusowych i spokojnych uliczek.</p><p className={body}>Voulamandis House znajduje się właśnie tutaj. Dzięki położeniu blisko miasta i lotniska Kambos jest praktyczną bazą dla gości, którzy chcą zwiedzać wyspę, ale wieczorem wracać do spokojniejszego otoczenia.</p></div></div></section>

      <section className="bg-[#eee6dd] py-9 sm:py-16"><div className={shell}><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Znany z", "Rezydencji i cytrusów"], ["Najlepszy dla", "Par i rodzin"], ["Położenie", "Blisko miasta Chios"], ["Pobyt", "Voulamandis House"]].map(([label, value]) => <article key={label} className="rounded-2xl border border-[#e4d7cb] bg-[#fffdf9] p-4 shadow-sm"><span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#9a7a62]">{label}</span><strong className="mt-2 block font-serif text-lg text-[#4e3d32] sm:text-xl">{value}</strong></article>)}</div></div></section>

      <section className={`${shell} py-9 sm:py-16`}><div className="space-y-8 sm:space-y-12">{[
        ["Rezydencje, ogrody cytrusowe i wysokie kamienne mury", "Historyczne posiadłości Kambos łączą lokalną architekturę z naturą. Za wysokimi murami znajdują się ogrody, dziedzińce, studnie i dawne rezydencje, tworzące jeden z najbardziej rozpoznawalnych krajobrazów Chios.", "/images/kampos/kampos-chios-mansion-garden.webp"],
        ["Żywa część historii Chios", "Kambos rozwijał się przez stulecia jako obszar eleganckich domów i cytrusowych majątków. Kamienne bramy, marmurowe dziedzińce i architektura dawnych posiadłości nadal są częścią codziennego krajobrazu.", "/images/kampos/antouaniko-kampos-chios.webp"],
      ].map(([title, text, image], index) => <article key={title} className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14"><div className={`relative aspect-[16/10] overflow-hidden rounded-[1.6rem] shadow-lg shadow-[#6f5949]/10 sm:aspect-[4/3] ${index % 2 ? "lg:order-2" : ""}`}><Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 48vw" /></div><div><span className={eyebrow}>0{index + 1}</span><h2 className={`${heading} mt-3`}>{title}</h2><p className={`${body} mt-4`}>{text}</p></div></article>)}</div></section>

      <section id="rooms-kambos" className="bg-[#f5eee7] py-9 sm:py-16"><div className={shell}><p className={eyebrow}>Pokoje i apartamenty w Kambos</p><h2 className={`${heading} mt-3 max-w-3xl`}>Wybierz pobyt, który pasuje do Twojej podróży</h2><div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">{rooms.map((room) => <article key={room.title} className="w-[80vw] max-w-[315px] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border border-[#dfd1c4] bg-[#fffdf9] shadow-md shadow-[#6f5949]/8 sm:w-auto sm:max-w-none"><a href={room.href} className="relative block aspect-[16/10] overflow-hidden"><Image src={room.image} alt={room.title} fill className="object-cover transition duration-500 hover:scale-105" sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw" /><span className="absolute left-3 top-3 rounded-full border border-white/60 bg-[#fffdf9]/90 px-3 py-1.5 text-[0.68rem] font-extrabold text-[#57463b]">{room.badge}</span></a><div className="p-4"><p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#9b7d66]">{room.subtitle}</p><h3 className="mt-1.5 font-serif text-[1.45rem] font-semibold leading-tight text-[#4d3c31]">{room.title}</h3><a href={room.href} className="mt-4 inline-flex text-sm font-extrabold !text-[#6f5949]">Zobacz szczegóły →</a></div></article>)}</div><div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-[#dfd1c4] bg-[#fffdf9] p-4 shadow-sm"><p className="text-sm leading-6 text-[#75665b]">Nie wiesz, który pokój będzie najlepszy?</p><Cta href="/pl/pokoje-na-chios/" secondary>Wszystkie pokoje</Cta></div></div></section>

      <section className={`${shell} py-9 sm:py-16`}><div className="grid items-center gap-6 lg:grid-cols-[1fr_0.8fr] lg:gap-14"><div><p className={eyebrow}>Blisko plaż, z dala od tłumu</p><h2 className={`${heading} mt-3`}>Spokojna baza do odkrywania Chios</h2><p className={`${body} mt-4`}>Kambos pozwala wygodnie łączyć miasto Chios, lotnisko, południowe plaże i średniowieczne wioski. To dobry wybór dla podróżnych, którzy chcą codziennie odkrywać inną część wyspy.</p><div className="mt-5 grid grid-cols-2 gap-2.5">{facts.map(([value, label]) => <article key={label} className="rounded-2xl border border-[#e4d7cb] bg-[#fffdf9] p-4 shadow-sm"><strong className="block font-serif text-xl text-[#4f3e33]">{value}</strong><span className="text-xs text-[#897668]">{label}</span></article>)}</div></div><div className="relative hidden aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-xl shadow-[#6f5949]/10 md:block"><Image src="/images/kampos/kampos-chios-stone-mansion.webp" alt="Kamienna rezydencja w Kambos na Chios" fill className="object-cover" sizes="44vw" /></div></div></section>

      <section className={`${shell} pb-9 sm:pb-16`}><div className="rounded-[1.6rem] border border-[#dfd1c4] bg-[#fffdf9] p-5 shadow-sm sm:rounded-[2rem] sm:p-8"><p className={eyebrow}>Przydatne informacje</p><h2 className={`${heading} mt-3`}>Najczęstsze pytania o pobyt w Kambos</h2><div className="mt-6 grid gap-3">{[
        ["Dlaczego warto nocować w Kambos?", "Kambos łączy spokój, historyczny charakter i naturę, pozostając blisko miasta Chios, lotniska oraz dróg prowadzących do plaż i południowych wiosek."],
        ["Czy są pokoje i apartamenty w Kambos?", "Tak. Voulamandis House oferuje pokoje ekonomiczne, pokoje na parterze i piętrze oraz rodzinne apartamenty z kuchnią."],
        ["Czy Kambos jest odpowiedni dla rodzin?", "Tak. Spokojna okolica, ogród, parking i apartamenty rodzinne sprawiają, że jest to praktyczna baza także dla rodzin z dziećmi."],
        ["Jak blisko są plaże?", "Najbliższa plaża znajduje się około 1,5 km od obiektu, a Karfas, Megas Limnionas i plaże południowego Chios są łatwo dostępne samochodem."],
      ].map(([question, answer]) => <details key={question} className="group rounded-2xl border border-[#e4d7cb] bg-white px-4 py-1"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-extrabold text-[#4d3c31] sm:text-base"><span>{question}</span><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eee6dd] transition group-open:rotate-45" aria-hidden="true">+</span></summary><p className="pb-4 text-sm leading-7 text-[#75665b]">{answer}</p></details>)}</div></div></section>

      <section className="px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.6rem] bg-[#493a31] px-5 py-8 text-white sm:rounded-[2.5rem] sm:px-10 sm:py-14"><Image src="/images/kampos/kampos-chios-citrus-estate.webp" alt="Ogród cytrusowy w Kambos na Chios" fill className="object-cover opacity-25" sizes="100vw" /><div className="absolute inset-0 bg-[#493a31]/75" /><div className="relative z-10 max-w-3xl"><p className="text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-amber-200">Voulamandis House · Kambos Chios</p><h2 className="mt-3 font-serif text-[2rem] font-semibold leading-[1.02] text-white sm:text-4xl">Blisko wszystkiego, z dala od pośpiechu</h2><p className="mt-3 text-sm leading-6 text-white/80 sm:text-lg sm:leading-8">Wybierz pokój lub apartament rodzinny i poznawaj Chios z jednej z najbardziej charakterystycznych części wyspy.</p><div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex"><Cta href="/pl/rezerwacja/">Ceny i dostępność</Cta><Cta href="/pl/pokoje-na-chios/" secondary>Zobacz pokoje</Cta></div></div></div></section>
    </main>
  );
}
