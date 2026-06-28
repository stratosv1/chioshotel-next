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

  return (
    <main className="chios-villages-page">
      <section className="cv-hero" aria-labelledby="cv-hero-title">
        <div className="cv-hero-media" aria-hidden="true">
          <img src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="cv-hero-overlay" />

        <div className="cv-wrap cv-hero-inner">
          <div className="cv-hero-card">
            <span className="cv-kicker cv-kicker--light">
              {data.hero.kicker}
            </span>

            <h1 id="cv-hero-title">{data.hero.title}</h1>

            <p>{data.hero.description}</p>

            <div className="cv-hero-actions">
              <a
                className="cv-btn cv-btn--primary"
                href={data.hero.primaryCta.href}
              >
                {data.hero.primaryCta.label}
              </a>

              <a
                className="cv-btn cv-btn--secondary"
                href={data.hero.secondaryCta.href}
              >
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="cv-section cv-section--intro"
        aria-labelledby="cv-intro-title"
      >
        <div className="cv-wrap cv-intro-grid">
          <article className="cv-intro-copy">
            <span className="cv-kicker">{data.intro.kicker}</span>
            <h2 id="cv-intro-title">{data.intro.title}</h2>
            <p>{data.intro.description}</p>
          </article>

          <aside className="cv-tip-card">
            <div className="cv-tip-icon" aria-hidden="true">
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
        className="cv-section cv-section--villages"
        id="villages"
        aria-labelledby="cv-villages-title"
      >
        <div className="cv-wrap">
          <header className="cv-section-head">
            <span className="cv-kicker">{copy.villagesKicker}</span>
            <h2 id="cv-villages-title">{copy.villagesTitle}</h2>
            <p>{copy.villagesText}</p>
          </header>

          <div className="cv-bento-grid">
            {data.villages.map((village, index) => (
              <a
                className={`cv-village-card cv-village-card--${village.size}`}
                href={village.href}
                key={village.href}
              >
                <div className="cv-village-image" aria-hidden="true">
                  <img
                    src={village.image}
                    alt=""
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>

                <div className="cv-village-overlay" />

                <div className="cv-village-content">
                  <div className="cv-village-meta">
                    <span>{village.region}</span>
                    <span>{village.mood}</span>
                  </div>

                  <div className="cv-village-badges">
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
        className="cv-section cv-section--planning"
        aria-labelledby="cv-planning-title"
      >
        <div className="cv-wrap cv-planning-grid">
          <article>
            <span className="cv-kicker">{data.planning.kicker}</span>
            <h2 id="cv-planning-title">{data.planning.title}</h2>
            <p>{data.planning.description}</p>
          </article>

          <div className="cv-planning-list">
            {data.planning.items.map((item) => (
              <div className="cv-planning-item" key={item.title}>
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
        className="cv-section cv-section--stay"
        aria-labelledby="cv-stay-title"
      >
        <div className="cv-wrap">
          <article className="cv-stay-card">
            <span className="cv-kicker">{data.stay.kicker}</span>
            <h2 id="cv-stay-title">{data.stay.title}</h2>
            <p>{data.stay.text}</p>

            <div className="cv-stay-actions">
              <a
                className="cv-btn cv-btn--primary"
                href={data.stay.primaryCta.href}
              >
                {data.stay.primaryCta.label}
              </a>

              <a
                className="cv-btn cv-btn--outline"
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
