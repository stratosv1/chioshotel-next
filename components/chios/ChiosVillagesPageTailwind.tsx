import type { ChiosVillagesPageData } from "@/content/chios-villages";
import { AnswerFirstSeoBlock } from "@/components/seo/AnswerFirstSeoBlock";

type ChiosVillagesPageProps = {
  data: ChiosVillagesPageData;
};

const villagesPageUiCopy = {
  en: {
    villagesKicker: "Top Chios villages",
    villagesTitle: "A visual guide to local character",
    villagesText:
      "From medieval fortress villages and mastic traditions to seaside food stops, these villages show the deeper identity of Chios.",
    swipeHint: "Swipe to explore more villages",
  },
  el: {
    villagesKicker: "Κορυφαία χωριά της Χίου",
    villagesTitle: "Ένας οπτικός οδηγός στον τοπικό χαρακτήρα",
    villagesText:
      "Από μεσαιωνικά καστροχώρια και παραδόσεις μαστίχας μέχρι παραθαλάσσιες στάσεις για φαγητό, αυτά τα χωριά δείχνουν τη βαθύτερη ταυτότητα της Χίου.",
    swipeHint: "Σύρετε για να δείτε περισσότερα χωριά",
  },
  fr: {
    villagesKicker: "Villages incontournables de Chios",
    villagesTitle: "Un guide visuel du caractère local",
    villagesText:
      "Des villages fortifiés médiévaux et des traditions du mastic aux haltes gourmandes en bord de mer, ces villages révèlent l’identité profonde de Chios.",
    swipeHint: "Faites glisser pour voir plus de villages",
  },
  de: {
    villagesKicker: "Top-Dörfer auf Chios",
    villagesTitle: "Ein visueller Guide zum lokalen Charakter",
    villagesText:
      "Von mittelalterlichen Wehrdörfern und Mastixtraditionen bis zu Essensstopps am Meer zeigen diese Dörfer die tiefere Identität von Chios.",
    swipeHint: "Wischen Sie, um weitere Dörfer zu sehen",
  },
  it: {
    villagesKicker: "I migliori villaggi di Chios",
    villagesTitle: "Una guida visiva al carattere locale",
    villagesText:
      "Dai villaggi fortificati medievali e le tradizioni del mastice alle soste gastronomiche sul mare, questi villaggi mostrano l’identità più profonda di Chios.",
    swipeHint: "Scorri per vedere altri villaggi",
  },
  es: {
    villagesKicker: "Pueblos imprescindibles de Chios",
    villagesTitle: "Una guía visual del carácter local",
    villagesText:
      "Desde pueblos fortaleza medievales y tradiciones del mastiha hasta paradas gastronómicas junto al mar, estos pueblos muestran la identidad más profunda de Chios.",
    swipeHint: "Desliza para ver más pueblos",
  },
  tr: {
    villagesKicker: "Sakız Adası’nın öne çıkan köyleri",
    villagesTitle: "Yerel karakter için görsel bir rehber",
    villagesText:
      "Orta Çağ kale köylerinden mastika geleneklerine ve deniz kenarındaki lezzet duraklarına kadar bu köyler, Sakız Adası’nın daha derin kimliğini gösterir.",
    swipeHint: "Daha fazla köy görmek için kaydırın",
  },
} as const;

type VillagesPageUiLanguage = keyof typeof villagesPageUiCopy;

function getVillagesPageLanguage(
  data: ChiosVillagesPageData,
): VillagesPageUiLanguage {
  const path = data.seo.canonicalPath;

  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";

  return "en";
}

function getExploreVillageLabel(language: VillagesPageUiLanguage, title: string) {
  const villageName = title.split(":")[0].trim();

  if (language === "el") return `Δείτε το ${villageName} →`;
  if (language === "fr") return `Voir ${villageName} →`;
  if (language === "de") return `${villageName} ansehen →`;
  if (language === "it") return `Scopri ${villageName} →`;
  if (language === "es") return `Ver ${villageName} →`;
  if (language === "tr") return `${villageName} köyünü keşfet →`;

  return `Explore ${villageName} →`;
}

export function ChiosVillagesPageTailwind({ data }: ChiosVillagesPageProps) {
  const language = getVillagesPageLanguage(data);
  const copy = villagesPageUiCopy[language];

  return (
    <main className="overflow-hidden bg-[#f7efe5] text-[#2f261f]">
      <section
        className="relative flex min-h-[68svh] items-end overflow-hidden text-white md:min-h-[620px]"
        aria-labelledby="villages-hero-title"
      >
        <img
          src={data.hero.image}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-[720px] rounded-[34px] border border-white/25 bg-black/35 p-6 shadow-2xl backdrop-blur-md md:p-10">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/90 before:h-px before:w-8 before:bg-current">
              {data.hero.kicker}
            </span>
            <h1
              id="villages-hero-title"
              className="max-w-[12ch] text-[42px] font-black leading-[0.95] tracking-[-0.055em] text-white drop-shadow-xl md:text-[clamp(54px,7vw,88px)]"
            >
              {data.hero.title}
            </h1>
            <p className="mt-6 max-w-[650px] text-base font-semibold leading-8 text-white/90 md:text-lg">
              {data.hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-r from-[#a87842] to-[#8e6607] px-7 text-xs font-black uppercase tracking-[0.12em] text-white shadow-xl transition hover:-translate-y-1"
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

      <AnswerFirstSeoBlock kind="villages" language={language} />

      <section className="px-4 py-12 md:px-6 md:py-18" aria-labelledby="villages-intro-title">
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[32px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5 md:p-9">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
              {data.intro.kicker}
            </span>
            <h2
              id="villages-intro-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl"
            >
              {data.intro.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#574b3f] md:text-lg">
              {data.intro.description}
            </p>
          </article>

          <aside className="flex gap-5 rounded-[32px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5 md:p-9">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-3xl shadow"
              aria-hidden="true"
            >
              {data.intro.tip.icon}
            </div>
            <div>
              <h3 className="text-2xl font-black leading-tight tracking-[-0.04em] text-[#2f261f]">
                {data.intro.tip.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[#574b3f]">
                {data.intro.tip.text}
              </p>
              <a
                className="mt-4 inline-flex text-sm font-black uppercase tracking-[0.1em] text-[#8e6607]"
                href={data.intro.tip.href}
              >
                {data.intro.tip.linkLabel}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-18" id="villages" aria-labelledby="villages-list-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-6 max-w-[820px] md:mb-8">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
              {copy.villagesKicker}
            </span>
            <h2
              id="villages-list-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl"
            >
              {copy.villagesTitle}
            </h2>
            <p className="mt-5 max-w-[760px] text-base leading-8 text-[#574b3f] md:text-lg">
              {copy.villagesText}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#8e6607] shadow-sm ring-1 ring-[#8e6607]/10 md:hidden">
              {copy.swipeHint} <span aria-hidden="true">→</span>
            </p>
          </header>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-1 top-[42%] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[#2f261f] text-2xl font-black text-white shadow-xl md:hidden"
            >
              →
            </div>
            <div className="grid auto-cols-[86%] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain pb-4 pr-12 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid-flow-row md:auto-cols-auto md:grid-cols-2 md:gap-7 md:overflow-visible md:pb-0 md:pr-0 xl:grid-cols-3">
              {data.villages.map((village, index) => (
                <a
                  className="group flex min-h-[520px] snap-start flex-col overflow-hidden rounded-[30px] bg-white shadow-xl shadow-black/10 ring-1 ring-[#8e6607]/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl md:min-h-[560px]"
                  href={village.href}
                  key={village.href}
                >
                  <div className="h-[245px] w-full shrink-0 overflow-hidden bg-white md:h-[260px]">
                    <img
                      src={village.image}
                      alt={village.imageAlt}
                      loading={index < 2 ? "eager" : "lazy"}
                      className="block h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col bg-white p-5 text-[#2f261f] md:p-7">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-[#6a4b00] shadow-sm ring-1 ring-[#8e6607]/15">
                        {village.region}
                      </span>
                      <span className="rounded-full bg-[#fff4df] px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-[#6a4b00] ring-1 ring-[#8e6607]/20">
                        {village.mood}
                      </span>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {village.badges.map((badge) => (
                        <span
                          className="rounded-full bg-[#8e6607] px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-white"
                          key={badge}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-black leading-[0.95] tracking-[-0.05em] text-[#2f261f] md:text-3xl">
                      {village.title}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-[#574b3f]">
                      {village.description}
                    </p>
                    <strong className="mt-auto inline-flex pt-6 text-xs font-black uppercase tracking-[0.12em] text-[#8e6607]">
                      {getExploreVillageLabel(language, village.title)}
                    </strong>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-18" aria-labelledby="villages-planning-title">
        <div className="mx-auto grid max-w-[1180px] gap-6 rounded-[34px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5 md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <article>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
              {data.planning.kicker}
            </span>
            <h2
              id="villages-planning-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl"
            >
              {data.planning.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#574b3f] md:text-lg">
              {data.planning.description}
            </p>
          </article>
          <div className="grid gap-4">
            {data.planning.items.map((item) => (
              <div
                className="flex gap-4 rounded-2xl border border-[#8e6607]/10 bg-[#fffdfa] p-5"
                key={item.title}
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-2xl"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-lg font-black text-[#2f261f]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#574b3f]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-18" aria-labelledby="villages-stay-title">
        <div className="mx-auto max-w-[1180px]">
          <article className="relative overflow-hidden rounded-[36px] bg-[#2f261f] p-6 text-white shadow-2xl md:p-12">
            <img
              src="/images/beaches/voulamandis-house-chios-courtyard-hero-desktop.webp"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
            <div className="relative z-10 max-w-[760px]">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/80">
                {data.stay.kicker}
              </span>
              <h2
                id="villages-stay-title"
                className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-white md:text-5xl"
              >
                {data.stay.title}
              </h2>
              <p className="mt-5 text-base leading-8 text-white/90 md:text-lg">
                {data.stay.text}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-white px-7 text-xs font-black uppercase tracking-[0.12em] text-[#2f261f] transition hover:-translate-y-1"
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
