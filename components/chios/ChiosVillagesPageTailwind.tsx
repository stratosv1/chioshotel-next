import type { ChiosVillagesPageData } from "@/content/chios-villages";

type ChiosVillagesPageProps = {
  data: ChiosVillagesPageData;
};

const villagesPageUiCopy = {
  en: {
    villagesKicker: "Top Chios villages",
    villagesTitle: "A visual guide to local character",
    villagesText:
      "From medieval fortress villages and mastic traditions to seaside food stops, these villages show the deeper identity of Chios.",
    exploreVillage: "Explore village \u2192",
  },
  el: {
    villagesKicker: "\u039a\u03bf\u03c1\u03c5\u03c6\u03b1\u03af\u03b1 \u03c7\u03c9\u03c1\u03b9\u03ac \u03c4\u03b7\u03c2 \u03a7\u03af\u03bf\u03c5",
    villagesTitle: "\u0388\u03bd\u03b1\u03c2 \u03bf\u03c0\u03c4\u03b9\u03ba\u03cc\u03c2 \u03bf\u03b4\u03b7\u03b3\u03cc\u03c2 \u03c3\u03c4\u03bf\u03bd \u03c4\u03bf\u03c0\u03b9\u03ba\u03cc \u03c7\u03b1\u03c1\u03b1\u03ba\u03c4\u03ae\u03c1\u03b1",
    villagesText:
      "\u0391\u03c0\u03cc \u03bc\u03b5\u03c3\u03b1\u03b9\u03c9\u03bd\u03b9\u03ba\u03ac \u03ba\u03b1\u03c3\u03c4\u03c1\u03bf\u03c7\u03ce\u03c1\u03b9\u03b1 \u03ba\u03b1\u03b9 \u03c0\u03b1\u03c1\u03b1\u03b4\u03cc\u03c3\u03b5\u03b9\u03c2 \u03bc\u03b1\u03c3\u03c4\u03af\u03c7\u03b1\u03c2 \u03bc\u03ad\u03c7\u03c1\u03b9 \u03c0\u03b1\u03c1\u03b1\u03b8\u03b1\u03bb\u03ac\u03c3\u03c3\u03b9\u03b5\u03c2 \u03c3\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2 \u03b3\u03b9\u03b1 \u03c6\u03b1\u03b3\u03b7\u03c4\u03cc, \u03b1\u03c5\u03c4\u03ac \u03c4\u03b1 \u03c7\u03c9\u03c1\u03b9\u03ac \u03b4\u03b5\u03af\u03c7\u03bd\u03bf\u03c5\u03bd \u03c4\u03b7 \u03b2\u03b1\u03b8\u03cd\u03c4\u03b5\u03c1\u03b7 \u03c4\u03b1\u03c5\u03c4\u03cc\u03c4\u03b7\u03c4\u03b1 \u03c4\u03b7\u03c2 \u03a7\u03af\u03bf\u03c5.",
    exploreVillage: "\u0394\u03b5\u03af\u03c4\u03b5 \u03c4\u03bf \u03c7\u03c9\u03c1\u03b9\u03cc \u2192",
  },
  fr: {
    villagesKicker: "Villages incontournables de Chios",
    villagesTitle: "Un guide visuel du caract\u00e8re local",
    villagesText:
      "Des villages fortifi\u00e9s m\u00e9di\u00e9vaux et des traditions du mastic aux haltes gourmandes en bord de mer, ces villages r\u00e9v\u00e8lent l\u2019identit\u00e9 profonde de Chios.",
    exploreVillage: "Explorer le village \u2192",
  },
  de: {
    villagesKicker: "Top-D\u00f6rfer auf Chios",
    villagesTitle: "Ein visueller Guide zum lokalen Charakter",
    villagesText:
      "Von mittelalterlichen Wehrd\u00f6rfern und Mastixtraditionen bis zu Essensstopps am Meer zeigen diese D\u00f6rfer die tiefere Identit\u00e4t von Chios.",
    exploreVillage: "Dorf ansehen \u2192",
  },
  it: {
    villagesKicker: "I migliori villaggi di Chios",
    villagesTitle: "Una guida visiva al carattere locale",
    villagesText:
      "Dai villaggi fortificati medievali e le tradizioni del mastice alle soste gastronomiche sul mare, questi villaggi mostrano l\u2019identit\u00e0 pi\u00f9 profonda di Chios.",
    exploreVillage: "Esplora il villaggio \u2192",
  },
  es: {
    villagesKicker: "Pueblos imprescindibles de Chios",
    villagesTitle: "Una gu\u00eda visual del car\u00e1cter local",
    villagesText:
      "Desde pueblos fortaleza medievales y tradiciones del mastiha hasta paradas gastron\u00f3micas junto al mar, estos pueblos muestran la identidad m\u00e1s profunda de Chios.",
    exploreVillage: "Explorar pueblo \u2192",
  },
  tr: {
    villagesKicker: "Sak\u0131z Adas\u0131\u2019n\u0131n \u00f6ne \u00e7\u0131kan k\u00f6yleri",
    villagesTitle: "Yerel karakter i\u00e7in g\u00f6rsel bir rehber",
    villagesText:
      "Orta \u00c7a\u011f kale k\u00f6ylerinden mastika geleneklerine ve deniz kenar\u0131ndaki lezzet duraklar\u0131na kadar bu k\u00f6yler, Sak\u0131z Adas\u0131\u2019n\u0131n daha derin kimli\u011fini g\u00f6sterir.",
    exploreVillage: "K\u00f6y\u00fc ke\u015ffet \u2192",
  },
} as const;

type VillagesPageUiLanguage = keyof typeof villagesPageUiCopy;

function getVillagesPageLanguage(
  data: ChiosVillagesPageData,
): VillagesPageUiLanguage {
  const path = data.seo.canonicalPath;

  if (path.startsWith("/el/")) {
    return "el";
  }

  if (path.startsWith("/fr/")) {
    return "fr";
  }

  if (path.startsWith("/de/")) {
    return "de";
  }

  if (path.startsWith("/it/")) {
    return "it";
  }

  if (path.startsWith("/es/")) {
    return "es";
  }

  if (path.startsWith("/tr/")) {
    return "tr";
  }

  return "en";
}

export function ChiosVillagesPageTailwind({ data }: ChiosVillagesPageProps) {
  const language = getVillagesPageLanguage(data);
  const copy = villagesPageUiCopy[language];

  const getVillageCardClassName = (size: string) => {
    const base =
      "group relative flex min-h-[340px] overflow-hidden rounded-[30px] bg-slate-900 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl";

    if (size === "large") {
      return base + " md:col-span-6 md:row-span-2 md:min-h-[520px]";
    }

    if (size === "wide") {
      return base + " md:col-span-6 md:min-h-[340px]";
    }

    if (size === "tall") {
      return base + " md:col-span-3 md:row-span-2 md:min-h-[520px]";
    }

    return base + " md:col-span-3 md:min-h-[340px]";
  };


  return (
    <main className="overflow-hidden bg-[#f7efe5] text-[#2f261f]">
      <section className="relative flex min-h-[68svh] items-end overflow-hidden text-white md:min-h-[620px]" aria-labelledby="cv-hero-title">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={data.hero.image} alt="" loading="eager" className="h-full w-full object-cover" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-[720px] rounded-[34px] border border-white/25 bg-white/15 p-6 shadow-2xl backdrop-blur-md md:p-12">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/90 before:h-px before:w-8 before:bg-current">
              {data.hero.kicker}
            </span>

            <h1 id="cv-hero-title">{data.hero.title}</h1>

            <p>{data.hero.description}</p>

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

      <section
        className="px-4 py-14 md:px-6 md:py-24"
        aria-labelledby="cv-intro-title"
      >
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[32px] border border-[#8e6607]/15 bg-white/90 p-6 shadow-xl shadow-black/5 md:p-9">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">{data.intro.kicker}</span>
            <h2 id="cv-intro-title">{data.intro.title}</h2>
            <p>{data.intro.description}</p>
          </article>

          <aside className="flex gap-5 rounded-[32px] border border-[#8e6607]/15 bg-[#fffdfa] p-6 shadow-xl shadow-black/5 md:p-9">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-3xl shadow" aria-hidden="true">
              {data.intro.tip.icon}
            </div>

            <div>
              <h3>{data.intro.tip.title}</h3>
              <p>{data.intro.tip.text}</p>
              <a href={data.intro.tip.href}>{data.intro.tip.linkLabel}</a>
            </div>
          </aside>
        </div>
      </section>

      <section
        className="px-4 py-14 md:px-6 md:py-24"
        id="villages"
        aria-labelledby="cv-villages-title"
      >
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-8 max-w-[860px]">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">{copy.villagesKicker}</span>
            <h2 id="cv-villages-title">{copy.villagesTitle}</h2>
            <p>{copy.villagesText}</p>
          </header>

          <div className="grid auto-rows-[minmax(320px,auto)] gap-4 md:grid-cols-12 md:gap-5">
            {data.villages.map((village, index) => (
              <a
                className={getVillageCardClassName(village.size)}
                href={village.href}
                key={village.href}
              >
                <div className="absolute inset-0" aria-hidden="true">
                  <img
                    src={village.image}
                    alt=""
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" aria-hidden="true" />

                <div className="relative z-10 mt-auto w-full p-5 text-white md:p-7">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span>{village.region}</span>
                    <span>{village.mood}</span>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {village.badges.map((badge) => (
                      <span key={badge}>{badge}</span>
                    ))}
                  </div>

                  <h3>{village.title}</h3>
                  <p>{village.description}</p>

                  <strong>{copy.exploreVillage}</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 py-14 md:px-6 md:py-24"
        aria-labelledby="cv-planning-title"
      >
        <div className="mx-auto grid max-w-[1180px] gap-6 rounded-[34px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5 md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <article>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">{data.planning.kicker}</span>
            <h2 id="cv-planning-title">{data.planning.title}</h2>
            <p>{data.planning.description}</p>
          </article>

          <div className="grid gap-4">
            {data.planning.items.map((item) => (
              <div className="flex gap-4 rounded-2xl border border-[#8e6607]/10 bg-[#fffdfa] p-5" key={item.title}>
                <span aria-hidden="true">{item.icon}</span>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 py-14 md:px-6 md:py-24"
        aria-labelledby="cv-stay-title"
      >
        <div className="mx-auto max-w-[1180px]">
          <article className="rounded-[36px] bg-gradient-to-r from-[#2f261f] to-[#8e6607] p-6 text-white shadow-2xl md:p-12">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-white/80">{data.stay.kicker}</span>
            <h2 id="cv-stay-title">{data.stay.title}</h2>
            <p>{data.stay.text}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-r from-[#a87842] to-[#8e6607] px-7 text-xs font-black uppercase tracking-[0.12em] text-white shadow-xl transition hover:-translate-y-1"
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
          </article>
        </div>
      </section>
    </main>
  );
}
