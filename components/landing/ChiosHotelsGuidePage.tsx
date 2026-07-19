import Image from "next/image";
import { ChiosHotelsLiveSearch } from "@/components/booking/ChiosHotelsLiveSearch";
import type { ChiosHotelsGuideData } from "@/content/chios-hotels-guide";

const primaryButton =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-[#e8c77f] px-5 py-3 text-center text-xs font-black uppercase tracking-[0.08em] !text-[#2f261f] shadow-lg transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-amber-200/40";
const darkButton =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-[#2f261f] px-5 py-3 text-center text-xs font-black uppercase tracking-[0.08em] !text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-900 focus:outline-none focus:ring-4 focus:ring-amber-700/20";
const lightButton =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.08em] !text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:!text-[#2f261f] focus:outline-none focus:ring-4 focus:ring-white/25";
const kicker =
  "text-[10px] font-black uppercase tracking-[0.2em] text-amber-800 sm:text-[11px] sm:tracking-[0.24em]";
const mobileCarousel =
  "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0";

function SectionHeader({
  eyebrow,
  title,
  text,
  id,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  id: string;
}) {
  return (
    <header className="mx-auto max-w-4xl text-center">
      <p className={kicker}>{eyebrow}</p>
      <h2 id={id} className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] sm:mt-4 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {text ? (
        <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-7 text-[#574b3f] sm:mt-5 sm:text-lg sm:leading-8">
          {text}
        </p>
      ) : null}
    </header>
  );
}

function SwipeHint() {
  return (
    <p className="mt-5 text-center text-[10px] font-black uppercase tracking-[0.15em] text-amber-800 md:hidden">
      Swipe to compare <span aria-hidden="true">→</span>
    </p>
  );
}

export function ChiosHotelsGuidePage({ data }: { data: ChiosHotelsGuideData }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf6ef] text-[#2f261f]">
      <section className="relative isolate overflow-hidden bg-[#263127] text-white" aria-labelledby="chios-hotels-title">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(232,199,127,0.25),transparent_32rem),linear-gradient(135deg,#263127,#3b4b3c)]" />
        <div className="mx-auto grid max-w-7xl lg:min-h-[700px] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-24">
            <span className="w-fit rounded-full border border-amber-200/25 bg-white/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-amber-100 sm:px-4 sm:text-[11px] sm:tracking-[0.2em]">
              {data.hero.kicker}
            </span>
            <h1 id="chios-hotels-title" className="mt-5 max-w-4xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:mt-6 sm:text-5xl lg:text-7xl">
              {data.hero.title}
            </h1>
            <p className="mt-5 max-w-3xl text-pretty text-[15px] leading-7 text-white/84 sm:mt-6 sm:text-lg sm:leading-8">
              {data.hero.description}
            </p>
            <div className="mt-6 max-w-3xl rounded-[22px] border border-amber-200/20 bg-[#1f281f]/80 p-4 text-sm font-semibold leading-6 text-amber-50 sm:p-5 sm:text-base sm:leading-7">
              <span className="font-black text-amber-200">Important:</span> {data.hero.disclosure}
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <a href={data.hero.primaryCta.href} className={primaryButton}>{data.hero.primaryCta.label}</a>
              <a href={data.hero.secondaryCta.href} className={lightButton}>{data.hero.secondaryCta.label}</a>
              <a href={data.hero.aiCta.href} className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-full border border-amber-200/35 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.08em] !text-amber-100 transition hover:-translate-y-0.5 hover:bg-amber-100 hover:!text-[#2f261f] focus:outline-none focus:ring-4 focus:ring-amber-200/30 sm:col-span-1">
                {data.hero.aiCta.label}
              </a>
            </div>
          </div>
          <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-full">
            <Image
              src={data.seo.image}
              alt={data.seo.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#263127]/85 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#263127]/45 lg:via-transparent lg:to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-[24px] border border-white/20 bg-[#263127]/76 p-5 shadow-2xl backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-8 sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">LOCAL CHIOS ACCOMMODATION GUIDE</p>
              <p className="mt-2 text-xl font-black tracking-[-0.03em] text-white sm:text-2xl">
                Compare first. Then search real availability in Kambos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-amber-900/10 bg-white" aria-label="Key Chios accommodation information">
        <div className="mx-auto flex max-w-7xl snap-x snap-mandatory overflow-x-auto bg-amber-900/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-6 lg:gap-px lg:overflow-visible">
          {data.trustPoints.map((item) => (
            <div key={item.label} className="min-w-[44%] snap-start border-r border-amber-900/10 bg-white px-3 py-4 text-center sm:min-w-[30%] sm:px-4 sm:py-5 lg:min-w-0 lg:border-r-0">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-amber-800 sm:text-[10px]">{item.label}</p>
              <p className="mt-1.5 text-sm font-black sm:mt-2 sm:text-base">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24" aria-labelledby="chios-hotels-intro-title">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className={kicker}>{data.intro.kicker}</p>
            <h2 id="chios-hotels-intro-title" className="mt-3 max-w-4xl text-balance text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              {data.intro.title}
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-7 text-[#574b3f] sm:mt-7 sm:space-y-5 sm:text-lg sm:leading-8">
              {data.intro.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <aside className="self-start rounded-[30px] border border-amber-900/10 bg-white p-6 shadow-[0_24px_70px_rgba(47,38,31,0.10)] sm:p-8">
            <p className={kicker}>HOW TO USE THIS PAGE</p>
            <ol className="mt-5 grid gap-4">
              {[
                "Compare the main areas of Chios.",
                "Choose hotel, room, guest accommodation or apartment.",
                "Enter your real dates in the live search.",
                "Open the room details or contact reception directly.",
              ].map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-[#574b3f] sm:text-base sm:leading-7">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#263127] text-xs font-black text-amber-200">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <ChiosHotelsLiveSearch />

      <section id="where-to-stay" className="scroll-mt-24 bg-[#f1e7d8] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24" aria-labelledby="where-to-stay-title">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={data.areas.kicker} title={data.areas.title} text={data.areas.description} id="where-to-stay-title" />
          <SwipeHint />
          <div className={`${mobileCarousel} mt-7 md:grid-cols-2 md:gap-5 sm:mt-10`}>
            {data.areas.items.map((area) => (
              <article key={area.id} id={area.id} className="min-w-[86vw] snap-start rounded-[28px] border border-amber-900/10 bg-white p-5 shadow-[0_20px_55px_rgba(47,38,31,0.09)] sm:min-w-[64vw] sm:p-7 md:min-w-0">
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-amber-900">{area.badge}</span>
                <h3 className="mt-5 text-2xl font-black tracking-[-0.035em]">{area.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#574b3f]">{area.text}</p>
                <div className="mt-5 rounded-[20px] bg-[#fbf6ef] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-800">Best for</p>
                  <p className="mt-2 text-sm font-bold leading-6">{area.bestFor}</p>
                </div>
                <a href={area.link} className="mt-5 inline-flex text-xs font-black uppercase tracking-[0.08em] text-amber-800">
                  Explore this area <span className="ml-2" aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24" aria-labelledby="accommodation-types-title">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={data.accommodationTypes.kicker} title={data.accommodationTypes.title} text={data.accommodationTypes.description} id="accommodation-types-title" />
          <div className="mt-8 overflow-hidden rounded-[30px] border border-amber-900/10 bg-white shadow-[0_24px_70px_rgba(47,38,31,0.09)] sm:mt-10">
            <div className="hidden grid-cols-[0.8fr_1fr_1.5fr] bg-[#263127] px-6 py-4 text-xs font-black uppercase tracking-[0.09em] text-amber-100 md:grid">
              <span>Accommodation type</span><span>Best suited to</span><span>Typical characteristics</span>
            </div>
            {data.accommodationTypes.items.map((item) => (
              <article key={item.title} className="grid gap-3 border-b border-amber-900/10 p-5 last:border-b-0 sm:p-6 md:grid-cols-[0.8fr_1fr_1.5fr] md:items-start">
                <h3 className="text-lg font-black">{item.title}</h3>
                <p className="text-sm font-bold leading-6 text-amber-900">{item.idealFor}</p>
                <p className="text-sm leading-6 text-[#574b3f]">{item.features}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-4xl rounded-[22px] border border-amber-900/10 bg-amber-50 p-5 text-center text-sm font-semibold leading-7 text-amber-950">
            {data.accommodationTypes.note}
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24" aria-labelledby="popular-searches-title">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={data.popularSearches.kicker} title={data.popularSearches.title} id="popular-searches-title" />
          <SwipeHint />
          <div className={`${mobileCarousel} mt-7 md:grid-cols-2 md:gap-5 lg:grid-cols-3 sm:mt-10`}>
            {data.popularSearches.items.map((item) => (
              <article key={item.id} id={item.id} className="min-w-[84vw] snap-start rounded-[26px] border border-amber-900/10 bg-[#fbf6ef] p-5 shadow-[0_18px_45px_rgba(47,38,31,0.07)] sm:min-w-[58vw] sm:p-6 md:min-w-0">
                <h3 className="text-xl font-black tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#574b3f]">{item.text}</p>
                <a href={item.href} className="mt-5 inline-flex text-[11px] font-black uppercase tracking-[0.08em] text-amber-800">
                  {item.cta} <span className="ml-2" aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="kambos-alternative" className="scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24" aria-labelledby="kambos-alternative-title">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[32px] bg-[#263127] text-white shadow-2xl lg:grid-cols-[0.9fr_1.1fr] lg:rounded-[42px]">
          <div className="relative min-h-[300px] sm:min-h-[420px] lg:min-h-full">
            <Image src="/images/beaches/voulamandis-house-courtyard-chios.webp" alt="Voulamandis House courtyard and citrus garden in Kambos, Chios" fill sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#263127]/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#263127]/40" />
          </div>
          <div className="p-5 sm:p-9 lg:p-12">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">{data.kambosAlternative.kicker}</p>
            <h2 id="kambos-alternative-title" className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              {data.kambosAlternative.title}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-white/80 sm:mt-6 sm:text-base sm:leading-8">
              {data.kambosAlternative.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {data.kambosAlternative.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm leading-6 text-white/82">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-black text-[#263127]">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <a href={data.kambosAlternative.primaryCta.href} className={primaryButton}>{data.kambosAlternative.primaryCta.label}</a>
              <a href={data.kambosAlternative.secondaryCta.href} className={lightButton}>{data.kambosAlternative.secondaryCta.label}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f1e7d8] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24" aria-labelledby="room-categories-title">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={data.roomCategories.kicker} title={data.roomCategories.title} text={data.roomCategories.description} id="room-categories-title" />
          <SwipeHint />
          <div className={`${mobileCarousel} mt-7 md:grid-cols-2 md:gap-6 sm:mt-10`}>
            {data.roomCategories.items.map((room) => (
              <a key={room.title} href={room.href} className="group min-w-[86vw] snap-start overflow-hidden rounded-[28px] border border-amber-900/10 bg-white shadow-[0_22px_60px_rgba(47,38,31,0.11)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(47,38,31,0.17)] sm:min-w-[72vw] md:min-w-0">
                <article className="grid h-full sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-[220px] bg-stone-200 sm:min-h-full">
                    <Image src={room.image} alt={`${room.title} at Voulamandis House in Chios`} fill sizes="(min-width: 768px) 34vw, 86vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-col p-5 sm:p-7">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-800">{room.label}</p>
                    <h3 className="mt-3 text-2xl font-black tracking-[-0.035em]">{room.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-[#574b3f]">{room.text}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {room.facts.map((fact) => <span key={fact} className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-900 ring-1 ring-amber-900/10">{fact}</span>)}
                    </div>
                    <span className="mt-5 inline-flex text-xs font-black uppercase tracking-[0.08em] text-amber-800">View accommodation <span className="ml-2" aria-hidden="true">→</span></span>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24" aria-labelledby="planning-title">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={data.planning.kicker} title={data.planning.title} text={data.planning.description} id="planning-title" />
          <SwipeHint />
          <div className={`${mobileCarousel} mt-7 md:grid-cols-2 md:gap-4 lg:grid-cols-4 sm:mt-10`}>
            {data.planning.links.map((link) => (
              <a key={link.href} href={link.href} className="group min-w-[78vw] snap-start rounded-[24px] border border-amber-900/10 bg-[#fbf6ef] p-5 shadow-[0_16px_40px_rgba(47,38,31,0.07)] transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_65px_rgba(47,38,31,0.12)] sm:min-w-[52vw] sm:p-6 md:min-w-0">
                <h3 className="text-xl font-black tracking-[-0.03em]">{link.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#574b3f]">{link.text}</p>
                <span className="mt-5 inline-flex text-xs font-black uppercase tracking-[0.08em] text-amber-800">Open guide <span className="ml-2 transition group-hover:translate-x-1" aria-hidden="true">→</span></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f1e7d8] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24" aria-labelledby="chios-hotels-faq-title">
        <div className="mx-auto max-w-4xl">
          <SectionHeader eyebrow={data.faq.kicker} title={data.faq.title} id="chios-hotels-faq-title" />
          <div className="mt-8 space-y-3 sm:mt-10">
            {data.faq.items.map((item) => (
              <details key={item.question} className="group rounded-[22px] border border-amber-900/10 bg-white px-4 py-1 shadow-[0_14px_35px_rgba(47,38,31,0.06)] open:shadow-[0_20px_55px_rgba(47,38,31,0.10)] sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[15px] font-black sm:py-5 sm:text-lg">
                  <span>{item.question}</span>
                  <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg text-amber-900 transition group-open:rotate-45">+</span>
                </summary>
                <p className="border-t border-amber-900/10 pb-4 pt-3 text-sm leading-7 text-[#574b3f] sm:pb-5 sm:pt-4 sm:text-base">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#263127] px-4 py-14 text-white sm:px-6 sm:py-18 lg:px-8 lg:py-24" aria-labelledby="chios-hotels-final-title">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,rgba(232,199,127,0.22),transparent_30rem)]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">{data.finalCta.kicker}</p>
          <h2 id="chios-hotels-final-title" className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-6xl">{data.finalCta.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-white/80 sm:text-lg sm:leading-8">{data.finalCta.text}</p>
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-3">
            <a href={data.finalCta.primaryCta.href} className={primaryButton}>{data.finalCta.primaryCta.label}</a>
            <a href={data.finalCta.secondaryCta.href} className={lightButton}>{data.finalCta.secondaryCta.label}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
