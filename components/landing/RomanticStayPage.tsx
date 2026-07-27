import Link from "next/link";
import type { RomanticStayPageData } from "@/content/romantic-stay";

type Props = { data: RomanticStayPageData };

const primary = "inline-flex min-h-[52px] items-center justify-center rounded-full bg-amber-800 px-6 text-[12px] font-black uppercase tracking-[0.1em] !text-white shadow-lg shadow-amber-900/15 transition hover:-translate-y-0.5";
const secondary = "inline-flex min-h-[52px] items-center justify-center rounded-full border border-amber-900/20 bg-white/90 px-6 text-[12px] font-black uppercase tracking-[0.1em] text-amber-900 transition hover:-translate-y-0.5";

export function RomanticStayPage({ data }: Props) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(168,120,66,.14),transparent_34rem),linear-gradient(180deg,#fffaf4_0%,#f4eadf_58%,#fffaf4_100%)] text-stone-800">
      <section className="relative flex min-h-[650px] items-end overflow-hidden text-white max-md:min-h-[78svh]" aria-labelledby="romantic-stay-title">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img src={data.hero.image.src} alt="" className="h-full w-full object-cover" loading="eager" />
        </div>
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(33,24,18,.88)_0%,rgba(33,24,18,.58)_52%,rgba(33,24,18,.16)_100%),linear-gradient(0deg,rgba(33,24,18,.72)_0%,transparent_60%)]" />
        <div className="relative z-[2] mx-auto w-[min(1180px,calc(100%-40px))] py-20 pt-28 max-md:w-[calc(100%-24px)] max-md:py-14 max-md:pt-6">
          <div className="w-[min(780px,100%)] rounded-[2.125rem] border border-white/20 bg-white/10 p-[clamp(30px,5vw,56px)] shadow-[0_34px_90px_rgba(0,0,0,.28)] backdrop-blur-xl max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-0">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white before:h-px before:w-8 before:bg-current before:opacity-75">{data.hero.eyebrow}</p>
            <h1 id="romantic-stay-title" className="m-0 max-w-[12ch] text-[clamp(42px,7vw,82px)] font-black leading-[0.95] tracking-[-0.06em] text-white drop-shadow-lg">{data.hero.title}</h1>
            <p className="mt-5 max-w-[680px] text-base leading-7 text-white/95 md:text-lg md:leading-8">{data.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={primary} href={data.hero.primaryCta.href}>{data.hero.primaryCta.label}</Link>
              <Link className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-[12px] font-black uppercase tracking-[0.1em] !text-white transition hover:bg-white/15" href={data.hero.secondaryCta.href}>{data.hero.secondaryCta.label}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[920px] px-5 text-center md:px-8">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-amber-900">{data.intro.eyebrow}</p>
          <h2 className="text-[clamp(32px,4.5vw,56px)] font-black leading-none tracking-[-0.05em] text-stone-800">{data.intro.title}</h2>
          <p className="mx-auto mt-6 max-w-[800px] text-base leading-8 text-stone-600 md:text-lg">{data.intro.text}</p>
        </div>
      </section>

      <section className="bg-white/70 py-16 md:py-20" aria-labelledby="romantic-reasons-title">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <header className="mx-auto mb-10 max-w-[820px] text-center">
            <h2 id="romantic-reasons-title" className="text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{data.reasons.title}</h2>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-stone-600">{data.reasons.intro}</p>
          </header>
          <div className="grid gap-5 md:grid-cols-2">
            {data.reasons.cards.map((card, index) => (
              <article key={card.title} className="group overflow-hidden rounded-[1.875rem] border border-amber-900/10 bg-white shadow-xl shadow-stone-900/5">
                <div className="aspect-[16/10] overflow-hidden bg-stone-200">
                  <img src={card.image.src} alt={card.image.alt} loading={index < 2 ? "eager" : "lazy"} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-[26px] font-black leading-tight tracking-[-0.04em] text-amber-900">{card.title}</h3>
                  <p className="mt-4 text-[15px] leading-7 text-stone-600">{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="romantic-room-title">
        <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-7 max-md:w-[calc(100%-24px)] md:grid-cols-2 md:items-stretch">
          <div className="min-h-[380px] overflow-hidden rounded-[2rem] bg-stone-200 shadow-xl shadow-stone-900/10">
            <img src={data.stay.image.src} alt={data.stay.image.alt} loading="lazy" className="h-full min-h-[380px] w-full object-cover" />
          </div>
          <article className="flex flex-col justify-center rounded-[2rem] bg-gradient-to-br from-[#263127] to-[#495248] p-[clamp(30px,5vw,56px)] text-white shadow-2xl shadow-stone-900/15">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[#e7c98d]">{data.stay.eyebrow}</p>
            <h2 id="romantic-room-title" className="text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-white">{data.stay.title}</h2>
            <p className="mt-5 text-base leading-8 text-white/85">{data.stay.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-6 text-[12px] font-black uppercase tracking-[0.1em] !text-[#263127]" href={data.stay.primaryCta.href}>{data.stay.primaryCta.label}</Link>
              <Link className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-[12px] font-black uppercase tracking-[0.1em] !text-white" href={data.stay.secondaryCta.href}>{data.stay.secondaryCta.label}</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="pb-20 pt-6 md:pb-24">
        <div className="mx-auto w-[min(980px,calc(100%-40px))] rounded-[2rem] border border-amber-900/10 bg-white/90 p-[clamp(30px,5vw,56px)] text-center shadow-xl shadow-stone-900/5 max-md:w-[calc(100%-24px)]">
          <h2 className="text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{data.finalCta.title}</h2>
          <p className="mx-auto mt-5 max-w-[720px] text-base leading-8 text-stone-600">{data.finalCta.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className={primary} href={data.finalCta.primaryCta.href}>{data.finalCta.primaryCta.label}</Link>
            <Link className={secondary} href={data.finalCta.secondaryCta.href}>{data.finalCta.secondaryCta.label}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
