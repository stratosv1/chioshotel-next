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
const kicker =
  "text-[10px] font-black uppercase tracking-[0.24em] text-amber-800 sm:text-[11px] sm:tracking-[0.28em]";
const mobileCarousel =
  "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0";

function SwipeHint() {
  return (
    <p className="mt-5 text-center text-[10px] font-black uppercase tracking-[0.18em] text-amber-800 md:hidden">
      Swipe to explore <span aria-hidden="true">→</span>
    </p>
  );
}

export function ChiosAccommodationPage({ data }: Props) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf6ef] text-[#2f261f]">
      <section
        className="relative isolate overflow-hidden bg-[#263127] text-white"
        aria-labelledby="chios-accommodation-title"
      >
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(232,199,127,0.24),transparent_30rem),linear-gradient(135deg,#263127,#3c4a3c)]" />
        <div className="mx-auto grid max-w-7xl lg:min-h-[680px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-24">
            <span className="w-fit rounded-full border border-amber-200/25 bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-amber-100 sm:px-4 sm:text-[11px] sm:tracking-[0.24em]">
              {data.hero.kicker}
            </span>
            <h1
              id="chios-accommodation-title"
              className="mt-5 max-w-3xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:mt-6 sm:text-5xl lg:text-7xl"
            >
              {data.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-7 text-white/85 sm:mt-6 sm:text-lg sm:leading-8">
              {data.hero.description}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <a href={data.hero.primaryCta.href} className={primaryButton}>
                {data.hero.primaryCta.label}
              </a>
              <a href={data.hero.secondaryCta.href} className={lightOutlineButton}>
                {data.hero.secondaryCta.label}
              </a>
              <a
                href={data.hero.aiCta.href}
                className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-full border border-amber-200/35 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.12em] !text-amber-100 transition hover:-translate-y-0.5 hover:bg-amber-100 hover:!text-[#2f261f] focus:outline-none focus:ring-4 focus:ring-amber-200/30 sm:col-span-1"
              >
                {data.hero.aiCta.label}
              </a>
            </div>
          </div>

          <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-full">
            <Image
              src={data.hero.image}
              alt={data.hero.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#263127]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#263127]/45 lg:via-transparent lg:to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-[22px] border border-white/20 bg-[#263127]/72 p-4 shadow-2xl backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-8 sm:rounded-[26px] sm:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-amber-200 sm:text-[10px] sm:tracking-[0.24em]">
                Voulamandis House • Chios
              </p>
              <p className="mt-2 text-lg font-black tracking-[-0.025em] text-white sm:text-2xl">
                Rooms and apartments inside the historic Kambos landscape
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-b border-amber-900/10 bg-white"
        aria-label="Accommodation highlights"
      >
        <div className="mx-auto flex max-w-7xl snap-x snap-mandatory overflow-x-auto bg-amber-900/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-6 lg:gap-px lg:overflow-visible">
          {data.highlights.map((item) => (
            <div
              key={item.label}
              className="min-w-[44%] snap-start border-r border-amber-900/10 bg-white px-3 py-4 text-center sm:min-w-[30%] sm:px-4 sm:py-5 lg:min-w-0 lg:border-r-0"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-800 sm:text-[10px] sm:tracking-[0.2em]">
                {item.label}
              </p>
              <p className="mt-1.5 text-sm font-black sm:mt-2 sm:text-base">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="px-4 py-11 sm:px-6 sm:py-14 lg:px-8 lg:py-24"
        aria-labelledby="accommodation-intro-title"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
          <div>
            <p className={kicker}>{data.intro.kicker}</p>
            <h2
              id="accommodation-intro-title"
              className="mt-3 max-w-4xl text-balance text-3xl font-black tracking-[-0.04em] sm:mt-4 sm:text-4xl lg:text-5xl"
            >
              {data.intro.title}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-[#574b3f] sm:mt-7 sm:space-y-5 sm:text-lg sm:leading-8">
              {data.intro.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="self-start rounded-[28px] border border-amber-900/10 bg-[#fffdfa] p-5 shadow-[0_24px_70px_rgba(47,38,31,0.10)] sm:rounded-[34px] sm:p-8">
            <p className={kicker}>{data.intro.factsTitle}</p>
            <ul className="mt-5 grid gap-3 sm:mt-6 sm:gap-4">
              {data.intro.facts.map((fact) => (
                <li key={fact} className="flex gap-3 text-sm leading-6 text-[#574b3f] sm:text-base sm:leading-7">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-900 sm:mt-1"
                  >
                    ✓
                  </span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section
        className="bg-[#f1e7d8] px-4 py-11 sm:px-6 sm:py-14 lg:px-8 lg:py-24"
        aria-labelledby="accommodation-rooms-title"
      >
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto max-w-4xl text-center">
            <p className={kicker}>{data.rooms.kicker}</p>
            <h2
              id="accommodation-rooms-title"
              className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] sm:mt-4 sm:text-4xl lg:text-5xl"
            >
              {data.rooms.title}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-7 text-[#574b3f] sm:mt-5 sm:text-lg sm:leading-8">
              {data.rooms.description}
            </p>
          </header>

          <SwipeHint />

          <div className={`${mobileCarousel} mt-7 md:grid-cols-2 md:gap-6 sm:mt-10`}>
            {data.rooms.cards.map((card, index) => (
              <a
                key={card.id}
                href={card.href}
                className="group min-w-[86vw] snap-start overflow-hidden rounded-[28px] border border-amber-900/10 bg-white shadow-[0_22px_60px_rgba(47,38,31,0.11)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(47,38,31,0.17)] focus:outline-none focus:ring-4 focus:ring-amber-700/20 sm:min-w-[72vw] md:min-w-0 md:rounded-[32px]"
              >
                <article className="grid h-full sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-[210px] bg-stone-200 sm:min-h-full">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      priority={index < 2}
                      sizes="(min-width: 768px) 34vw, 86vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-col p-5 sm:p-7">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-800 sm:text-[10px] sm:tracking-[0.22em]">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-2.5 text-xl font-black tracking-[-0.035em] sm:mt-3 sm:text-2xl">
                      {card.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-[#574b3f] sm:mt-4 sm:leading-7">
                      {card.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                      {card.facts.map((fact) => (
                        <span
                          key={fact}
                          className="rounded-full bg-amber-50 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-amber-900 ring-1 ring-amber-900/10 sm:px-3 sm:text-[10px] sm:tracking-[0.1em]"
                        >
                          {fact}
                        </span>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.13em] text-amber-800 sm:mt-6 sm:text-xs sm:tracking-[0.14em]">
                      View accommodation <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 py-11 sm:px-6 sm:py-14 lg:px-8 lg:py-24"
        aria-labelledby="kambos-location-title"
      >
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[30px] bg-[#263127] text-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr] lg:rounded-[38px]">
          <div className="relative min-h-[270px] sm:min-h-[360px] lg:min-h-full">
            <Image
              src="/images/beaches/voulamandis-house-courtyard-chios.webp"
              alt="Voulamandis House courtyard and garden in Kambos, Chios"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#263127]/55 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#263127]/35" />
          </div>

          <div className="p-5 sm:p-9 lg:p-12">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200 sm:text-[11px] sm:tracking-[0.28em]">
              {data.location.kicker}
            </p>
            <h2
              id="kambos-location-title"
              className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] text-white sm:mt-4 sm:text-4xl lg:text-5xl"
            >
              {data.location.title}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-white/80 sm:mt-6 sm:text-base sm:leading-8">
              {data.location.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="-mx-1 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
              {data.location.distances.map((item) => (
                <div
                  key={item.label}
                  className="min-w-[72%] snap-start rounded-[20px] border border-white/15 bg-white/8 p-4 sm:min-w-0 sm:rounded-[22px]"
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-amber-200 sm:text-[10px] sm:tracking-[0.16em]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-2 text-xs leading-5 text-white/65">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <a
                href={data.location.mapCta.href}
                target="_blank"
                rel="noreferrer"
                className={primaryButton}
              >
                {data.location.mapCta.label}
              </a>
              <a href={data.location.guideCta.href} className={lightOutlineButton}>
                {data.location.guideCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-white px-4 py-11 sm:px-6 sm:py-14 lg:px-8 lg:py-24"
        aria-labelledby="reasons-title"
      >
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto max-w-4xl text-center">
            <p className={kicker}>{data.reasons.kicker}</p>
            <h2
              id="reasons-title"
              className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] sm:mt-4 sm:text-4xl lg:text-5xl"
            >
              {data.reasons.title}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-7 text-[#574b3f] sm:mt-5 sm:text-lg sm:leading-8">
              {data.reasons.description}
            </p>
          </header>

          <SwipeHint />

          <div className={`${mobileCarousel} mt-7 md:grid-cols-2 md:gap-5 lg:grid-cols-3 sm:mt-10`}>
            {data.reasons.items.map((item) => (
              <article
                key={item.title}
                className="min-w-[82vw] snap-start rounded-[24px] border border-amber-900/10 bg-[#fffdfa] p-5 shadow-[0_18px_45px_rgba(47,38,31,0.07)] sm:min-w-[58vw] sm:rounded-[28px] sm:p-6 md:min-w-0"
              >
                <span className="text-2xl sm:text-3xl" aria-hidden="true">
                  {item.icon}
                </span>
                <h3 className="mt-4 text-lg font-black tracking-[-0.025em] sm:mt-5 sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#574b3f] sm:leading-7">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-[#f1e7d8] px-4 py-11 sm:px-6 sm:py-14 lg:px-8 lg:py-24"
        aria-labelledby="traveler-types-title"
      >
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto max-w-4xl text-center">
            <p className={kicker}>{data.travelerTypes.kicker}</p>
            <h2
              id="traveler-types-title"
              className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] sm:mt-4 sm:text-4xl lg:text-5xl"
            >
              {data.travelerTypes.title}
            </h2>
          </header>

          <SwipeHint />

          <div className={`${mobileCarousel} mt-7 md:grid-cols-2 md:gap-4 sm:mt-10`}>
            {data.travelerTypes.items.map((item, index) => (
              <article
                key={item.title}
                className="min-w-[84vw] snap-start rounded-[24px] border border-amber-900/10 bg-white p-5 shadow-[0_18px_45px_rgba(47,38,31,0.08)] sm:min-w-[62vw] sm:rounded-[28px] sm:p-7 md:min-w-0"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#263127] text-xs font-black text-amber-200 sm:h-11 sm:w-11 sm:text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-black tracking-[-0.025em] sm:text-xl">{item.title}</h3>
                    <p className="mt-2.5 text-sm leading-6 text-[#574b3f] sm:mt-3 sm:leading-7">
                      {item.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 py-11 sm:px-6 sm:py-14 lg:px-8 lg:py-24"
        aria-labelledby="direct-booking-title"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-6 rounded-[30px] bg-[#fffdfa] p-5 shadow-[0_26px_80px_rgba(47,38,31,0.12)] ring-1 ring-amber-900/10 sm:gap-8 sm:rounded-[38px] sm:p-9 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <p className={kicker}>{data.directBooking.kicker}</p>
            <h2
              id="direct-booking-title"
              className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] sm:mt-4 sm:text-4xl lg:text-5xl"
            >
              {data.directBooking.title}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-[#574b3f] sm:mt-6 sm:text-base sm:leading-8">
              {data.directBooking.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <a href={data.directBooking.primaryCta.href} className={darkButton}>
                {data.directBooking.primaryCta.label}
              </a>
              <a
                href={data.directBooking.secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-900/15 bg-amber-50 px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.1em] !text-amber-900 transition hover:-translate-y-0.5 hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-700/15 sm:px-5 sm:text-xs sm:tracking-[0.12em]"
              >
                {data.directBooking.secondaryCta.label}
              </a>
              <a
                href={data.directBooking.whatsappCta.href}
                target="_blank"
                rel="noreferrer"
                className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-800/15 bg-emerald-50 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.12em] !text-emerald-900 transition hover:-translate-y-0.5 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-700/15 sm:col-span-1"
              >
                {data.directBooking.whatsappCta.label}
              </a>
            </div>
          </div>

          <aside className="h-fit self-start rounded-[26px] bg-[#263127] p-5 text-white sm:rounded-[30px] sm:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200 sm:text-[11px] sm:tracking-[0.26em]">
              Direct booking benefits
            </p>
            <ul className="mt-5 grid gap-3 sm:mt-6 sm:gap-4">
              {data.directBooking.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm leading-6 text-white/82 sm:leading-7">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-black text-[#263127] sm:mt-1"
                  >
                    ✓
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section
        className="bg-white px-4 py-11 sm:px-6 sm:py-14 lg:px-8 lg:py-24"
        aria-labelledby="explore-chios-title"
      >
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto max-w-4xl text-center">
            <p className={kicker}>{data.explore.kicker}</p>
            <h2
              id="explore-chios-title"
              className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] sm:mt-4 sm:text-4xl lg:text-5xl"
            >
              {data.explore.title}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-7 text-[#574b3f] sm:mt-5 sm:text-lg sm:leading-8">
              {data.explore.description}
            </p>
          </header>

          <SwipeHint />

          <div className={`${mobileCarousel} mt-7 md:grid-cols-2 md:gap-4 lg:grid-cols-4 sm:mt-10`}>
            {data.explore.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group min-w-[78vw] snap-start rounded-[24px] border border-amber-900/10 bg-[#fbf6ef] p-5 shadow-[0_16px_40px_rgba(47,38,31,0.07)] transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_65px_rgba(47,38,31,0.12)] focus:outline-none focus:ring-4 focus:ring-amber-700/15 sm:min-w-[52vw] sm:rounded-[28px] sm:p-6 md:min-w-0"
              >
                <h3 className="text-lg font-black tracking-[-0.025em] sm:text-xl">{link.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#574b3f] sm:leading-7">{link.text}</p>
                <span className="mt-4 inline-flex text-[11px] font-black uppercase tracking-[0.13em] text-amber-800 sm:mt-5 sm:text-xs sm:tracking-[0.14em]">
                  Explore
                  <span className="ml-2 transition group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-[#f1e7d8] px-4 py-11 sm:px-6 sm:py-14 lg:px-8 lg:py-24"
        aria-labelledby="accommodation-faq-title"
      >
        <div className="mx-auto max-w-4xl">
          <header className="text-center">
            <p className={kicker}>{data.faq.kicker}</p>
            <h2
              id="accommodation-faq-title"
              className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] sm:mt-4 sm:text-4xl lg:text-5xl"
            >
              {data.faq.title}
            </h2>
          </header>
          <div className="mt-7 space-y-2.5 sm:mt-10 sm:space-y-3">
            {data.faq.items.map((item) => (
              <details
                key={item.question}
                className="group rounded-[20px] border border-amber-900/10 bg-white px-4 py-1 shadow-[0_14px_35px_rgba(47,38,31,0.06)] open:shadow-[0_20px_55px_rgba(47,38,31,0.10)] sm:rounded-[24px] sm:px-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[15px] font-black sm:py-5 sm:text-lg">
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg text-amber-900 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="border-t border-amber-900/10 pb-4 pt-3 text-sm leading-6 text-[#574b3f] sm:pb-5 sm:pt-4 sm:text-base sm:leading-7">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative isolate overflow-hidden bg-[#263127] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-24"
        aria-labelledby="accommodation-final-title"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,rgba(232,199,127,0.22),transparent_30rem)]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200 sm:text-[11px] sm:tracking-[0.28em]">
            {data.finalCta.kicker}
          </p>
          <h2
            id="accommodation-final-title"
            className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] text-white sm:mt-4 sm:text-4xl lg:text-6xl"
          >
            {data.finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-white/80 sm:mt-5 sm:text-lg sm:leading-8">
            {data.finalCta.text}
          </p>
          <div className="mx-auto mt-7 grid max-w-xl grid-cols-2 gap-3 sm:mt-8">
            <a href={data.finalCta.primaryCta.href} className={primaryButton}>
              {data.finalCta.primaryCta.label}
            </a>
            <a href={data.finalCta.secondaryCta.href} className={lightOutlineButton}>
              {data.finalCta.secondaryCta.label}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
