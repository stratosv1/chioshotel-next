import type { ChiosBeachesPageData } from "@/content/chios-beaches";
import { AnswerFirstSeoBlock } from "@/components/seo/AnswerFirstSeoBlock";

type ChiosBeachesPageProps = {
  data: ChiosBeachesPageData;
};

const beachesPageUiCopy = {
  en: {
    beachesKicker: "Top Chios beaches",
    beachesTitle: "A visual guide to the island’s coast",
    beachesText:
      "From volcanic black pebbles to golden sand and hidden emerald coves, these are the Chios beaches worth planning your days around.",
    swipeHint: "Swipe to explore more beaches",
  },
  el: {
    beachesKicker: "Κορυφαίες παραλίες της Χίου",
    beachesTitle: "Οπτικός οδηγός στις ακτές του νησιού",
    beachesText:
      "Από ηφαιστειακά μαύρα βότσαλα μέχρι χρυσαφένια άμμο και κρυφούς σμαραγδένιους όρμους, αυτές είναι οι παραλίες της Χίου που αξίζει να βάλετε στο πρόγραμμά σας.",
    swipeHint: "Σύρετε για να δείτε περισσότερες παραλίες",
  },
  fr: {
    beachesKicker: "Plus belles plages de Chios",
    beachesTitle: "Un guide visuel du littoral de l’île",
    beachesText:
      "Des galets noirs volcaniques au sable doré et aux criques émeraude cachées, voici les plages de Chios autour desquelles organiser vos journées.",
    swipeHint: "Faites glisser pour voir plus de plages",
  },
  de: {
    beachesKicker: "Top-Strände auf Chios",
    beachesTitle: "Ein visueller Guide zur Küste der Insel",
    beachesText:
      "Von vulkanischen schwarzen Kieseln bis zu goldenem Sand und versteckten smaragdgrünen Buchten: Diese Strände auf Chios lohnen sich für Ihre Tagesplanung.",
    swipeHint: "Wischen Sie, um weitere Strände zu sehen",
  },
  it: {
    beachesKicker: "Le migliori spiagge di Chios",
    beachesTitle: "Una guida visiva alla costa dell’isola",
    beachesText:
      "Dai ciottoli neri vulcanici alla sabbia dorata e alle calette color smeraldo nascoste, queste sono le spiagge di Chios da inserire nel vostro itinerario.",
    swipeHint: "Scorri per vedere altre spiagge",
  },
  es: {
    beachesKicker: "Mejores playas de Chios",
    beachesTitle: "Una guía visual de la costa de la isla",
    beachesText:
      "Desde guijarros negros volcánicos hasta arena dorada y calas escondidas de color esmeralda, estas son las playas de Chios que merece la pena planificar.",
    swipeHint: "Desliza para ver más playas",
  },
  tr: {
    beachesKicker: "Sakız Adası’nın öne çıkan plajları",
    beachesTitle: "Adanın kıyıları için görsel bir rehber",
    beachesText:
      "Volkanik siyah çakıllardan altın kumlara ve gizli zümrüt koylara kadar, günlerinizi planlamaya değer Sakız Adası plajları burada.",
    swipeHint: "Daha fazla plaj görmek için kaydırın",
  },
} as const;

type BeachesPageUiLanguage = keyof typeof beachesPageUiCopy;

function getBeachesPageLanguage(data: ChiosBeachesPageData): BeachesPageUiLanguage {
  const path = data.seo.canonicalPath;

  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";

  return "en";
}

function getExploreBeachLabel(language: BeachesPageUiLanguage, title: string) {
  const beachName = title.split(":")[0].trim();

  if (language === "el") return `Δείτε την ${beachName} →`;
  if (language === "fr") return `Voir ${beachName} →`;
  if (language === "de") return `${beachName} ansehen →`;
  if (language === "it") return `Scopri ${beachName} →`;
  if (language === "es") return `Ver ${beachName} →`;
  if (language === "tr") return `${beachName} plajını keşfet →`;

  return `Explore ${beachName} →`;
}

export function ChiosBeachesPageTailwind({ data }: ChiosBeachesPageProps) {
  const language = getBeachesPageLanguage(data);
  const copy = beachesPageUiCopy[language];

  return (
    <main className="overflow-hidden bg-[#eaf5f3] text-[#102b2d]">
      <section
        className="relative flex min-h-[68svh] items-end overflow-hidden text-white md:min-h-[620px]"
        aria-labelledby="beaches-hero-title"
      >
        <img
          src={data.hero.image}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/45" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-[720px] rounded-[34px] border border-white/25 bg-slate-950/35 p-6 shadow-2xl backdrop-blur-md md:p-10">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/90 before:h-px before:w-8 before:bg-current">
              {data.hero.kicker}
            </span>
            <h1
              id="beaches-hero-title"
              className="max-w-[12ch] text-[42px] font-black leading-[0.95] tracking-[-0.055em] text-white drop-shadow-xl md:text-[clamp(54px,7vw,88px)]"
            >
              {data.hero.title}
            </h1>
            <p className="mt-6 max-w-[650px] text-base font-semibold leading-8 text-white/90 md:text-lg">
              {data.hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-r from-[#0f766e] to-[#115e59] px-7 text-xs font-black uppercase tracking-[0.12em] text-white shadow-xl transition hover:-translate-y-1"
                href={data.hero.primaryCta.href}
              >
                {data.hero.primaryCta.label}
              </a>
              <a
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/40 bg-white/15 px-7 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-1 hover:bg-white/25"
                href={data.hero.secondaryCta.href}
              >
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <AnswerFirstSeoBlock kind="beaches" language={language} />

      <section className="px-4 py-12 md:px-6 md:py-18" aria-labelledby="beaches-intro-title">
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[32px] border border-teal-900/10 bg-white p-6 shadow-xl shadow-black/5 md:p-9">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-800">
              {data.intro.kicker}
            </span>
            <h2
              id="beaches-intro-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#102b2d] md:text-5xl"
            >
              {data.intro.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700 md:text-lg">
              {data.intro.description}
            </p>
          </article>

          <aside className="flex gap-5 rounded-[32px] border border-teal-900/10 bg-white p-6 shadow-xl shadow-black/5 md:p-9">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-3xl shadow"
              aria-hidden="true"
            >
              {data.intro.tip.icon}
            </div>
            <div>
              <h3 className="text-2xl font-black leading-tight tracking-[-0.04em] text-[#102b2d]">
                {data.intro.tip.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-700">
                {data.intro.tip.text}
              </p>
              <a
                className="mt-4 inline-flex text-sm font-black uppercase tracking-[0.1em] text-teal-800"
                href={data.intro.tip.href}
              >
                {data.intro.tip.linkLabel}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-18" id="beaches" aria-labelledby="beaches-list-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-6 max-w-[820px] md:mb-8">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-800">
              {copy.beachesKicker}
            </span>
            <h2
              id="beaches-list-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#102b2d] md:text-5xl"
            >
              {copy.beachesTitle}
            </h2>
            <p className="mt-5 max-w-[760px] text-base leading-8 text-slate-700 md:text-lg">
              {copy.beachesText}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-teal-800 shadow-sm ring-1 ring-teal-900/10 md:hidden">
              {copy.swipeHint} <span aria-hidden="true">→</span>
            </p>
          </header>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-1 top-[42%] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-teal-950 text-2xl font-black text-white shadow-xl md:hidden"
            >
              →
            </div>
            <div className="grid auto-cols-[86%] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain pb-4 pr-12 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid-flow-row md:auto-cols-auto md:grid-cols-2 md:gap-7 md:overflow-visible md:pb-0 md:pr-0 xl:grid-cols-3">
              {data.beaches.map((beach, index) => (
                <a
                  className="group flex min-h-[520px] snap-start flex-col overflow-hidden rounded-[30px] bg-white shadow-xl shadow-black/10 ring-1 ring-teal-900/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl md:min-h-[560px]"
                  href={beach.href}
                  key={beach.href}
                >
                  <div className="h-[245px] w-full shrink-0 overflow-hidden bg-white md:h-[260px]">
                    <img
                      src={beach.image}
                      alt={beach.imageAlt}
                      loading={index < 2 ? "eager" : "lazy"}
                      className="block h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col bg-white p-5 text-[#102b2d] md:p-7">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-teal-900 shadow-sm ring-1 ring-teal-900/15">
                        {beach.region}
                      </span>
                      <span className="rounded-full bg-teal-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-teal-900 ring-1 ring-teal-900/15">
                        {beach.mood}
                      </span>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {beach.badges.map((badge) => (
                        <span
                          className="rounded-full bg-teal-800 px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-white"
                          key={badge}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-black leading-[0.95] tracking-[-0.05em] text-[#102b2d] md:text-3xl">
                      {beach.title}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                      {beach.description}
                    </p>
                    <strong className="mt-auto inline-flex pt-6 text-xs font-black uppercase tracking-[0.12em] text-teal-800">
                      {getExploreBeachLabel(language, beach.title)}
                    </strong>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-18" aria-labelledby="beaches-planning-title">
        <div className="mx-auto grid max-w-[1180px] gap-6 rounded-[34px] border border-teal-900/10 bg-white p-6 shadow-xl shadow-black/5 md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <article>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-800">
              {data.planning.kicker}
            </span>
            <h2
              id="beaches-planning-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#102b2d] md:text-5xl"
            >
              {data.planning.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700 md:text-lg">
              {data.planning.description}
            </p>
          </article>
          <div className="grid gap-4">
            {data.planning.items.map((item) => (
              <div
                className="flex gap-4 rounded-2xl border border-teal-900/10 bg-teal-50/40 p-5"
                key={item.title}
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-lg font-black text-[#102b2d]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-18" aria-labelledby="beaches-stay-title">
        <div className="mx-auto max-w-[1180px]">
          <article className="relative overflow-hidden rounded-[36px] bg-teal-950 p-6 text-white shadow-2xl md:p-12">
            <img
              src="/images/beaches/voulamandis-house-chios-courtyard-hero-desktop.webp"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-teal-950/70" aria-hidden="true" />
            <div className="relative z-10 max-w-[760px]">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/80">
                {data.stay.kicker}
              </span>
              <h2
                id="beaches-stay-title"
                className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-white md:text-5xl"
              >
                {data.stay.title}
              </h2>
              <p className="mt-5 text-base leading-8 text-white/90 md:text-lg">
                {data.stay.text}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-white px-7 text-xs font-black uppercase tracking-[0.12em] text-teal-950 transition hover:-translate-y-1"
                  href={data.stay.primaryCta.href}
                >
                  {data.stay.primaryCta.label}
                </a>
                <a
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/35 px-7 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-1 hover:bg-white/10"
                  href={data.stay.secondaryCta.href}
                >
                  {data.stay.secondaryCta.label}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
