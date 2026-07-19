import Image from "next/image";
import type { ChiosAccommodationPageData } from "@/content/chios-accommodation";

type Props = {
  data: ChiosAccommodationPageData;
};

const primaryButton =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-[#e8c77f] px-5 py-3 text-center text-xs font-black uppercase tracking-[0.12em] !text-[#2f261f] shadow-lg transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-amber-200/40";
const darkButton =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-[#2f261f] px-5 py-3 text-center text-xs font-black uppercase tracking-[0.12em] !text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-800 focus:outline-none focus:ring-4 focus:ring-amber-700/20";
const lightOutlineButton =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.12em] !text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:!text-[#2f261f] focus:outline-none focus:ring-4 focus:ring-white/25";
const kicker = "text-[11px] font-black uppercase tracking-[0.28em] text-amber-800";

export function ChiosAccommodationPage({ data }: Props) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf6ef] text-[#2f261f]">
      <section className="relative isolate overflow-hidden bg-[#263127] text-white" aria-labelledby="chios-accommodation-title">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(232,199,127,0.24),transparent_30rem),linear-gradient(135deg,#263127,#3c4a3c)]" />
        <div className="mx-auto grid max-w-7xl lg:min-h-[680px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
            <span className="w-fit rounded-full border border-amber-200/25 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-100 sm:text-[11px]">
              {data.hero.kicker}
            </span>
            <h1 id="chios-accommodation-title" className="mt-6 max-w-3xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
              {data.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-white/85 sm:text-lg">
              {data.hero.description}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <a href={data.hero.primaryCta.href} className={primaryButton}>{data.hero.primaryCta.label}</a>
              <a href={data.hero.secondaryCta.href} className={lightOutlineButton}>{data.hero.secondaryCta.label}</a>
              <a href={data.hero.aiCta.href} className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-full border border-amber-200/35 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.12em] !text-amber-100 transition hover:-translate-y-0.5 hover:bg-amber-100 hover:!text-[#2f261f] focus:outline-none focus:ring-4 focus:ring-amber-200/30 sm:col-span-1">
                {data.hero.aiCta.label}
              </a>
            </div>
          </div>
          <div className="relative min-h-[360px] lg:min-h-full">
            <Image src={data.hero.image} alt={data.hero.imageAlt} fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#263127]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#263127]/45 lg:via-transparent lg:to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-[26px] border border-white/20 bg-[#263127]/72 p-5 shadow-2xl backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-8 sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">Voulamandis House • Chios</p>
              <p className="mt-2 text-xl font-black tracking-[-0.025em] text-white sm:text-2xl">Rooms and apartments inside the historic Kambos landscape</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-amber-900/10 bg-white" aria-label="Accommodation highlights">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-amber-900/10 sm:grid-cols-3 lg:grid-cols-6">
          {data.highlights.map((item) => (
            <div key={item.label} className="bg-white px-4 py-5 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-800">{item.label}</p>
              <p className="mt-2 text-sm font-black sm:text-base">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="accommodation-intro-title">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
          <div>
            <p className={kicker}>{data.intro.kicker}</p>
            <h2 id="accommodation-intro-title" className="mt-4 max-w-4xl text-balance text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">{data.intro.title}</h2>
            <div className="mt-7 space-y-5 text-base leading-8 text-[#574b3f] sm:text-lg">
              {data.intro.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <aside className="self-start rounded-[34px] border border-amber-900/10 bg-[#fffdfa] p-6 shadow-[0_24px_70px_rgba(47,38,31,0.10)] sm:p-8">
            <p className={kicker}>{data.intro.factsTitle}</p>
            <ul className="mt-6 space-y-4">
              {data.intro.facts.map((fact) => (
                <li key={fact} className="flex gap-3 text-sm leading-7 text-[#574b3f] sm:text-base">
                  <span aria-hidden="true" className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-900">✓</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-[#f1e7d8] px-4 py-14 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="accommodation-rooms-title">
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto max-w-4xl text-center">
            <p className={kicker}>{data.rooms.kicker}</p>
            <h2 id="accommodation-rooms-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">{data.rooms.title}</h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#574b3f] sm:text-lg">{data.rooms.description}</p>
          </header>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {data.rooms.cards.map((card, index) => (
              <a key={card.id} href={card.href} className="group overflow-hidden rounded-[32px] border border-amber-900/10 bg-white shadow-[0_22px_60px_rgba(47,38,31,0.11)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(47,38,31,0.17)] focus:outline-none focus:ring-4 focus:ring-amber-700/20">
                <article className="grid h-full sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-[250px] bg-stone-200 sm:min-h-full">
                    <Image src={card.image} alt={card.imageAlt} fill priority={index < 2} sizes="(min-width: 768px) 34vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-col p-6 sm:p-7">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-800">{card.eyebrow}</p>
                    <h3 className="mt-3 text-2xl font-black tracking-[-0.035em]">{card.title}</h3>
                    <p className="mt-4 flex-1 text-sm leading-7 text-[#574b3f]">{card.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.facts.map((fact) => <span key={fact} className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-amber-900 ring-1 ring-amber-900/10">{fact}</span>)}
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-amber-800">View accommodation <span aria-hidden="true">→</span></span>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="kambos-location-title">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[38px] bg-[#263127] text-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[360px] lg:min-h-full">
            <Image src={data.location.image} alt={data.location.imageAlt} fill sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#263127]/55 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#263127]/35" />
          </div>
          <div className="p-6 sm:p-9 lg:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200">{data.location.kicker}</p>
            <h2 id="kambos-location-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">{data.location.title}</h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-white/80">
              {data.location.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {data.location.distances.map((item) => (
                <div key={item.label} className="rounded-[22px] border border-white/15 bg-white/8 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-2 text-xs leading-5 text-white/65">{item.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a href={data.location.mapCta.href} target="_blank" rel="noreferrer" className={primaryButton}>{data.location.mapCta.label}</a>
              <a href={data.location.guideCta.href} className={lightOutlineButton}>{data.location.guideCta.label}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="reasons-title">
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto max-w-4xl text-center">
            <p className={kicker}>{data.reasons.kicker}</p>
            <h2 id="reasons-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">{data.reasons.title}</h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#574b3f] sm:text-lg">{data.reasons.description}</p>
          </header>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.reasons.items.map((item) => (
              <article key={item.title} className="rounded-[28px] border border-amber-900/10 bg-[#fffdfa] p-6 shadow-[0_18px_45px_rgba(47,38,31,0.07)]">
                <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                <h3 className="mt-5 text-xl font-black tracking-[-0.025em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#574b3f]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f1e7d8] px-4 py-14 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="traveler-types-title">
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto max-w-4xl text-center">
            <p className={kicker}>{data.travelerTypes.kicker}</p>
            <h2 id="traveler-types-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">{data.travelerTypes.title}</h2>
          </header>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {data.travelerTypes.items.map((item, index) => (
              <article key={item.title} className="rounded-[28px] border border-amber-900/10 bg-white p-6 shadow-[0_18px_45px_rgba(47,38,31,0.08)] sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#263127] text-sm font-black text-amber-200">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3 className="text-xl font-black tracking-[-0.025em]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#574b3f]">{item.text}</p></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="direct-booking-title">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[38px] bg-[#fffdfa] p-6 shadow-[0_26px_80px_rgba(47,38,31,0.12)] ring-1 ring-amber-900/10 sm:p-9 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <p className={kicker}>{data.directBooking.kicker}</p>
            <h2 id="direct-booking-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">{data.directBooking.title}</h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-[#574b3f]">{data.directBooking.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a href={data.directBooking.primaryCta.href} className={darkButton}>{data.directBooking.primaryCta.label}</a>
              <a href={data.directBooking.secondaryCta.href} className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-900/15 bg-amber-50 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.12em] !text-amber-900 transition hover:-translate-y-0.5 hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-700/15">{data.directBooking.secondaryCta.label}</a>
              <a href={data.directBooking.whatsappCta.href} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-800/15 bg-emerald-50 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.12em] !text-emerald-900 transition hover:-translate-y-0.5 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-700/15">{data.directBooking.whatsappCta.label}</a>
            </div>
          </div>
          <aside className="rounded-[30px] bg-[#263127] p-6 text-white sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-amber-200">Direct booking benefits</p>
            <ul className="mt-6 space-y-4">
              {data.directBooking.benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-sm leading-7 text-white/82"><span aria-hidden="true" className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-black text-[#263127]">✓</span><span>{benefit}</span></li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="explore-chios-title">
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto max-w-4xl text-center">
            <p className={kicker}>{data.explore.kicker}</p>
            <h2 id="explore-chios-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">{data.explore.title}</h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#574b3f] sm:text-lg">{data.explore.description}</p>
          </header>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.explore.links.map((link) => (
              <a key={link.href} href={link.href} className="group rounded-[28px] border border-amber-900/10 bg-[#fbf6ef] p-6 shadow-[0_16px_40px_rgba(47,38,31,0.07)] transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_65px_rgba(47,38,31,0.12)] focus:outline-none focus:ring-4 focus:ring-amber-700/15">
                <h3 className="text-xl font-black tracking-[-0.025em]">{link.title}</h3><p className="mt-3 text-sm leading-7 text-[#574b3f]">{link.text}</p><span className="mt-5 inline-flex text-xs font-black uppercase tracking-[0.14em] text-amber-800">Explore <span className="ml-2 transition group-hover:translate-x-1" aria-hidden="true">→</span></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f1e7d8] px-4 py-14 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="accommodation-faq-title">
        <div className="mx-auto max-w-4xl">
          <header className="text-center"><p className={kicker}>{data.faq.kicker}</p><h2 id="accommodation-faq-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">{data.faq.title}</h2></header>
          <div className="mt-10 space-y-3">
            {data.faq.items.map((item) => (
              <details key={item.question} className="group rounded-[24px] border border-amber-900/10 bg-white px-5 py-1 shadow-[0_14px_35px_rgba(47,38,31,0.06)] open:shadow-[0_20px_55px_rgba(47,38,31,0.10)] sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-black sm:text-lg"><span>{item.question}</span><span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg text-amber-900 transition group-open:rotate-45">+</span></summary>
                <p className="border-t border-amber-900/10 pb-5 pt-4 text-sm leading-7 text-[#574b3f] sm:text-base">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#263127] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24" aria-labelledby="accommodation-final-title">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,rgba(232,199,127,0.22),transparent_30rem)]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200">{data.finalCta.kicker}</p>
          <h2 id="accommodation-final-title" className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-6xl">{data.finalCta.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">{data.finalCta.text}</p>
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-3"><a href={data.finalCta.primaryCta.href} className={primaryButton}>{data.finalCta.primaryCta.label}</a><a href={data.finalCta.secondaryCta.href} className={lightOutlineButton}>{data.finalCta.secondaryCta.label}</a></div>
        </div>
      </section>
    </main>
  );
}
