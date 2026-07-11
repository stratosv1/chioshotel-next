import Link from "next/link";
import type { FamilyTravelPageContent } from "@/content/family-travel";

type FamilyTravelPageProps = {
  data: FamilyTravelPageContent;
};

const buttonBase =
  "inline-flex min-h-[52px] items-center justify-center rounded-full px-6 text-[12px] font-black uppercase tracking-[0.1em] transition hover:-translate-y-0.5";

const primaryButton = `${buttonBase} bg-gradient-to-br from-[#a87842] to-[#8e6607] !text-white shadow-lg shadow-amber-900/20`;
const secondaryButton = `${buttonBase} border border-amber-900/20 bg-white/90 text-amber-900`;
const darkSecondaryButton = `${buttonBase} border border-white/25 bg-white/10 text-white`;

export default function FamilyTravelPage({ data }: FamilyTravelPageProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(168,120,66,.14),transparent_34rem),linear-gradient(180deg,#fffaf4_0%,#f4eadf_55%,#fffaf4_100%)] text-stone-800">
      <section className="relative flex min-h-[640px] items-end overflow-hidden text-white max-md:min-h-[76svh]" aria-labelledby="family-travel-title">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img className="h-full w-full object-cover" src={data.hero.image.src} alt="" loading="eager" />
        </div>
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(32,24,18,.84)_0%,rgba(32,24,18,.56)_48%,rgba(32,24,18,.18)_100%),linear-gradient(0deg,rgba(32,24,18,.72)_0%,transparent_58%)]" />

        <div className="relative z-[2] mx-auto w-[min(1180px,calc(100%-40px))] py-20 pt-28 max-md:w-[calc(100%-24px)] max-md:py-14 max-md:pt-6">
          <div className="w-[min(780px,100%)] rounded-[2.125rem] border border-white/25 bg-white/10 p-[clamp(30px,5vw,56px)] shadow-[0_34px_90px_rgba(0,0,0,.28)] backdrop-blur-xl max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-0">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white drop-shadow-lg before:h-px before:w-8 before:bg-current before:opacity-75">
              {data.hero.eyebrow}
            </p>
            <h1 id="family-travel-title" className="m-0 max-w-[12ch] text-[clamp(42px,7vw,86px)] font-black leading-[0.94] tracking-[-0.06em] text-white drop-shadow-lg">
              {data.hero.title}
            </h1>
            <p className="mt-5 max-w-[680px] text-base leading-7 text-white/95 md:text-lg md:leading-8">{data.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={primaryButton} href={data.hero.primaryCta.href}>{data.hero.primaryCta.label}</Link>
              <Link className={darkSecondaryButton} href={data.hero.secondaryCta.href}>{data.hero.secondaryCta.label}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="family-intro-title">
        <div className="mx-auto max-w-[920px] px-5 md:px-8">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{data.intro.title}</p>
          <p id="family-intro-title" className="text-[clamp(24px,3vw,34px)] font-black leading-tight tracking-[-0.04em] text-stone-800">{data.intro.text}</p>
        </div>
      </section>

      <section className="bg-white/70 py-16 md:py-20" aria-labelledby="family-cards-title">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <header className="mx-auto mb-9 max-w-[820px] text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">Family experiences</p>
            <h2 id="family-cards-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{data.cardsTitle}</h2>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-stone-600">{data.cardsIntro}</p>
          </header>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.cards.map((card, index) => {
              const content = (
                <>
                  <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                    <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={card.image.src} alt={card.image.alt} loading={index < 2 ? "eager" : "lazy"} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-[28px] font-black leading-none tracking-[-0.04em] text-amber-900">{card.title}</h3>
                    <p className="mt-4 text-[15px] leading-7 text-stone-600">{card.text}</p>
                  </div>
                </>
              );

              if (card.href) {
                return (
                  <Link className="group overflow-hidden rounded-[1.875rem] border border-amber-900/10 bg-white shadow-xl shadow-stone-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-900/10" href={card.href} key={card.title}>
                    {content}
                  </Link>
                );
              }

              return (
                <article className="group overflow-hidden rounded-[1.875rem] border border-amber-900/10 bg-white shadow-xl shadow-stone-900/5" key={card.title}>
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="family-day-title">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <header className="mx-auto mb-9 max-w-[820px] text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{data.familyDay.eyebrow}</p>
            <h2 id="family-day-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{data.familyDay.title}</h2>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-stone-600">{data.familyDay.intro}</p>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            {data.familyDay.steps.map((step, index) => (
              <article className="flex items-start gap-4 rounded-[1.5rem] border border-amber-900/10 bg-white/90 p-5 shadow-lg shadow-stone-900/5" key={step.title}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff4df] text-sm font-black text-amber-900 ring-1 ring-amber-900/10">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-black text-stone-800">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-stone-600">{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="family-stay-title">
        <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-stretch gap-7 max-md:w-[calc(100%-24px)] md:grid-cols-2">
          <article className="flex flex-col justify-center rounded-[2rem] bg-gradient-to-br from-stone-900 to-stone-700 p-[clamp(30px,5vw,56px)] text-white shadow-2xl shadow-stone-900/15">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white before:h-px before:w-8 before:bg-current before:opacity-75">{data.stay.eyebrow}</p>
            <h2 id="family-stay-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-white">{data.stay.title}</h2>
            <p className="mt-5 text-base leading-8 text-white/85">{data.stay.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-6 text-[12px] font-black uppercase tracking-[0.1em] text-stone-900" href={data.stay.primaryCta.href}>{data.stay.primaryCta.label}</Link>
              <Link className={darkSecondaryButton} href={data.stay.secondaryCta.href}>{data.stay.secondaryCta.label}</Link>
            </div>
          </article>

          <div className="min-h-[360px] overflow-hidden rounded-[2rem] bg-stone-200 shadow-xl shadow-stone-900/10">
            <img className="h-full min-h-[360px] w-full object-cover" src={data.stay.image.src} alt={data.stay.image.alt} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="family-final-title">
        <div className="mx-auto w-[min(980px,calc(100%-40px))] rounded-[2rem] border border-amber-900/10 bg-white/90 p-[clamp(30px,5vw,56px)] text-center shadow-xl shadow-stone-900/5 max-md:w-[calc(100%-24px)]">
          <h2 id="family-final-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{data.finalCta.title}</h2>
          <p className="mx-auto mt-5 max-w-[700px] text-base leading-8 text-stone-600">{data.finalCta.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className={primaryButton} href={data.finalCta.primaryCta.href}>{data.finalCta.primaryCta.label}</Link>
            <Link className={secondaryButton} href={data.finalCta.secondaryCta.href}>{data.finalCta.secondaryCta.label}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
