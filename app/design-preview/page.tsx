import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Design Preview | Voulamandis House",
  description: "Private design direction preview.",
  robots: { index: false, follow: false },
};

const stays = [
  {
    eyebrow: "ROOMS 01—07",
    title: "Quiet rooms among the citrus trees",
    text: "Simple, comfortable rooms for couples and small families who value calm, character and an authentic sense of place.",
    image: "/images/rooms/double-triple-room-v2.webp",
    href: "/chios-rooms/",
    stats: ["2–4 guests", "Ground & first floor", "Direct rate"],
  },
  {
    eyebrow: "APARTMENTS 08—10",
    title: "More space. The same slow rhythm.",
    text: "Family apartments with kitchenette and room to settle in, surrounded by the historic landscape of Kampos.",
    image: "/images/rooms/chios-hotels-family-apartments.webp",
    href: "/chios-rooms/",
    stats: ["Up to 5 guests", "Kitchenette", "Family stay"],
  },
];

export default function DesignPreviewPage() {
  return (
    <main className="min-h-screen bg-[#f2eee6] text-[#201d19]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#171714]/70 text-white backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-10">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.25em]">Voulamandis House</Link>
          <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.2em] md:flex">
            <a href="#stay">Stay</a><a href="#place">Kampos</a><a href="#story">Our story</a>
          </nav>
          <Link href="/book-direct/" className="border border-white/50 px-4 py-2 text-xs uppercase tracking-[0.18em] transition hover:bg-white hover:text-black">Book direct</Link>
        </div>
      </header>

      <section className="relative flex min-h-[96svh] items-end overflow-hidden bg-[#171714] text-white">
        <img src="/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp" alt="Voulamandis House in Kampos, Chios" className="absolute inset-0 h-full w-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
        <div className="relative mx-auto grid w-full max-w-[1500px] gap-10 px-5 pb-12 pt-32 md:grid-cols-[1fr_320px] md:px-10 md:pb-16">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.28em] text-white/75">Kampos, Chios · Since 1990</p>
            <h1 className="max-w-5xl text-[clamp(3.2rem,8.8vw,9rem)] font-medium leading-[0.86] tracking-[-0.055em]">Stay inside<br />the story.</h1>
          </div>
          <div className="self-end border-t border-white/40 pt-5 text-sm leading-6 text-white/80">
            A historic family house among citrus orchards. Quiet rooms, warm hospitality and direct access to the real Chios.
            <a href="#stay" className="mt-7 flex items-center justify-between border-b border-white/40 pb-3 text-xs uppercase tracking-[0.22em] text-white">Explore the stay <span>↘</span></a>
          </div>
        </div>
      </section>

      <section id="story" className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-12 md:grid-cols-[220px_1fr]">
          <p className="text-xs uppercase tracking-[0.24em]">01 — The house</p>
          <div>
            <h2 className="max-w-5xl text-[clamp(2.7rem,6vw,6.7rem)] leading-[0.95] tracking-[-0.045em]">Not another hotel.<br />A place with roots.</h2>
            <div className="mt-12 grid gap-8 border-t border-black/25 pt-8 md:grid-cols-3">
              <p className="text-sm leading-6 text-black/65">Voulamandis House is a family-run guesthouse in the historic Kampos area, six kilometres from Chios town.</p>
              <p className="text-sm leading-6 text-black/65">Behind the stone walls, citrus trees, old wells and shaded courtyards shape a slower way of staying.</p>
              <p className="text-sm leading-6 text-black/65">The experience is deliberately simple: genuine hospitality, restful rooms and honest direct prices.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="stay" className="bg-[#1d201b] text-white">
        {stays.map((stay, index) => (
          <article key={stay.title} className="border-b border-white/15">
            <div className="mx-auto grid max-w-[1500px] gap-0 md:grid-cols-2">
              <div className={`relative min-h-[58svh] overflow-hidden ${index % 2 ? "md:order-2" : ""}`}>
                <img src={stay.image} alt={stay.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-[1.025]" />
              </div>
              <div className="flex min-h-[58svh] flex-col justify-between px-5 py-10 md:px-12 md:py-14">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">{stay.eyebrow}</p>
                <div className="py-16">
                  <h3 className="max-w-xl text-[clamp(2.5rem,5vw,5.4rem)] leading-[0.94] tracking-[-0.045em]">{stay.title}</h3>
                  <p className="mt-8 max-w-lg text-base leading-7 text-white/65">{stay.text}</p>
                </div>
                <div>
                  <div className="grid grid-cols-3 border-y border-white/20 py-5 text-xs uppercase tracking-[0.12em] text-white/70">
                    {stay.stats.map((stat) => <span key={stat}>{stat}</span>)}
                  </div>
                  <Link href={stay.href} className="mt-8 flex items-center justify-between text-xs uppercase tracking-[0.22em]">View rooms <span>→</span></Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section id="place" className="relative min-h-[85svh] overflow-hidden text-white">
        <img src="/images/villages/lagada_3-v2.webp" alt="Chios landscape" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-[85svh] max-w-[1500px] flex-col justify-between px-5 py-12 md:px-10 md:py-16">
          <p className="text-xs uppercase tracking-[0.24em]">02 — Explore Chios</p>
          <div className="grid gap-10 md:grid-cols-[1fr_340px] md:items-end">
            <h2 className="text-[clamp(3.5rem,9vw,9rem)] leading-[0.86] tracking-[-0.055em]">Island days.<br />Kampos nights.</h2>
            <div className="text-sm leading-6 text-white/75">Beaches, medieval villages and local food are close. At the end of the day, return to the quiet of the orchard.<Link href="/chios-island/" className="mt-7 flex items-center justify-between border-b border-white/50 pb-3 text-xs uppercase tracking-[0.22em] text-white">Discover Chios <span>↗</span></Link></div>
          </div>
        </div>
      </section>

      <section className="bg-[#d8d0c1] px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-xs uppercase tracking-[0.24em]">Direct booking</p>
          <div className="mt-10 grid gap-12 md:grid-cols-[1fr_300px] md:items-end">
            <h2 className="text-[clamp(3.3rem,8vw,8.5rem)] leading-[0.88] tracking-[-0.055em]">Come stay<br />with us.</h2>
            <div><p className="mb-8 text-sm leading-6 text-black/65">Book directly for our best available rate, clear communication and a personal reply from reception.</p><Link href="/book-direct/" className="flex items-center justify-between border-y border-black/35 py-5 text-xs uppercase tracking-[0.22em]">Check availability <span>→</span></Link></div>
          </div>
        </div>
      </section>

      <footer className="bg-[#171714] px-5 py-10 text-white md:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-6 border-t border-white/20 pt-8 text-xs uppercase tracking-[0.18em] text-white/55 md:flex-row"><span>Voulamandis House · Kampos, Chios</span><span>Experimental design preview · Noindex</span></div>
      </footer>
    </main>
  );
}
