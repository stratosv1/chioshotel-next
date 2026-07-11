import Link from "next/link";
import type { ChiosExplorerPageContent } from "@/content/chios-explorer";

type ChiosExplorerPageProps = {
  data: ChiosExplorerPageContent;
};

const buttonBase =
  "inline-flex min-h-[52px] items-center justify-center rounded-full px-6 text-[12px] font-black uppercase tracking-[0.1em] transition hover:-translate-y-0.5";
const primaryButton = `${buttonBase} bg-gradient-to-br from-[#a87842] to-[#8e6607] !text-white shadow-lg shadow-amber-900/20`;
const darkButton = `${buttonBase} border border-white/25 bg-white/10 text-white`;
const lightButton = `${buttonBase} bg-white text-stone-900`;

export default function ChiosExplorerPage({ data }: ChiosExplorerPageProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(168,120,66,.14),transparent_34rem),linear-gradient(180deg,#fbf6ef_0%,#f4eadf_52%,#fbf6ef_100%)] text-stone-800">
      <section className="relative flex min-h-[640px] items-end overflow-hidden text-white max-md:min-h-[76svh]" aria-labelledby="chios-explorer-title">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img className="h-full w-full object-cover" src={data.hero.image.src} alt="" loading="eager" />
        </div>
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(32,24,18,.84)_0%,rgba(32,24,18,.54)_42%,rgba(32,24,18,.18)_100%),linear-gradient(0deg,rgba(32,24,18,.72)_0%,transparent_58%)]" />

        <div className="relative z-[2] mx-auto w-[min(1180px,calc(100%-40px))] py-20 pt-28 max-md:w-[calc(100%-24px)] max-md:py-14 max-md:pt-6">
          <div className="w-[min(780px,100%)] rounded-[2.125rem] border border-white/25 bg-white/10 p-[clamp(30px,5vw,56px)] shadow-[0_34px_90px_rgba(0,0,0,.28)] backdrop-blur-xl max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-0">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white drop-shadow-lg before:h-px before:w-8 before:bg-current before:opacity-75">{data.hero.eyebrow}</p>
            <h1 id="chios-explorer-title" className="m-0 max-w-[12ch] text-[clamp(42px,7vw,86px)] font-black leading-[0.94] tracking-[-0.06em] text-white drop-shadow-lg">{data.hero.title}</h1>
            <p className="mt-5 max-w-[680px] text-base leading-7 text-white/95 md:text-lg md:leading-8">{data.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={primaryButton} href={data.links.booking}>{data.hero.primaryCta}</Link>
              <Link className={darkButton} href={data.links.rooms}>{data.hero.secondaryCta}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="chios-explorer-intro-title">
        <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-start gap-8 max-md:w-[calc(100%-24px)] lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{data.intro.eyebrow}</p>
            <h2 id="chios-explorer-intro-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{data.intro.title}</h2>
          </div>
          <p className="text-base leading-8 text-stone-600 md:text-lg">{data.intro.text}</p>
        </div>
      </section>

      <section className="bg-white/70 py-16 md:py-20" aria-labelledby="chios-explorer-highlights-title">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <header className="mx-auto mb-9 max-w-[820px] text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{data.highlights.eyebrow}</p>
            <h2 id="chios-explorer-highlights-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{data.highlights.title}</h2>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-stone-600">{data.highlights.text}</p>
          </header>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.highlights.items.map((item, index) => (
              <Link className="group overflow-hidden rounded-[1.875rem] border border-amber-900/10 bg-white shadow-xl shadow-stone-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-900/10" href={item.href} key={item.title}>
                <span className="block aspect-[4/3] overflow-hidden bg-stone-200">
                  <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={item.image.src} alt={item.image.alt} loading={index < 2 ? "eager" : "lazy"} />
                </span>
                <span className="block p-6">
                  <span className="block text-[28px] font-black leading-none tracking-[-0.04em] text-amber-900">{item.title}</span>
                  <span className="mt-4 block text-[15px] leading-7 text-stone-600">{item.text}</span>
                  <span className="mt-5 inline-flex rounded-full border border-amber-800/20 px-4 py-2 text-xs font-black uppercase text-amber-800">Explore more</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="chios-explorer-story-title">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <header className="mx-auto mb-9 max-w-[820px] text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{data.story.eyebrow}</p>
            <h2 id="chios-explorer-story-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{data.story.title}</h2>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-stone-600">{data.story.text}</p>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {data.story.steps.map((step, index) => (
              <article className="rounded-[1.75rem] border border-amber-900/10 bg-white/90 p-6 shadow-xl shadow-stone-900/5" key={step.title}>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff4df] text-sm font-black text-amber-900 ring-1 ring-amber-900/10">{index + 1}</div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-900">{step.label}</p>
                <h3 className="mt-3 text-2xl font-black leading-tight text-stone-800">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="chios-explorer-stay-title">
        <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-start gap-7 max-md:w-[calc(100%-24px)] lg:grid-cols-[minmax(0,1fr)_minmax(320px,.8fr)]">
          <article className="rounded-[2rem] border border-amber-900/10 bg-white/90 p-[clamp(30px,5vw,48px)] shadow-xl shadow-stone-900/5">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{data.stay.eyebrow}</p>
            <h2 id="chios-explorer-stay-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{data.stay.title}</h2>
            <p className="mt-5 text-base leading-8 text-stone-600">{data.stay.text}</p>
          </article>

          <aside className="rounded-[2rem] bg-gradient-to-br from-stone-900 to-stone-700 p-[clamp(28px,4vw,44px)] text-white shadow-2xl shadow-stone-900/15">
            <h3 className="text-[clamp(28px,4vw,44px)] font-black leading-none tracking-[-0.045em] text-white">{data.finalCta.title}</h3>
            <p className="mt-4 text-base leading-8 text-white/85">{data.finalCta.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={lightButton} href={data.links.booking}>{data.finalCta.primaryCta}</Link>
              <Link className={darkButton} href={data.links.chiosGuide}>{data.finalCta.secondaryCta}</Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
