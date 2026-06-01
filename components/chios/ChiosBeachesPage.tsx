import type { ChiosBeachesPageData } from "@/content/chios-beaches";

type ChiosBeachesPageProps = {
  data: ChiosBeachesPageData;
};

const beachesPageUiCopy = {
  en: {
    beachesKicker: "Top Chios beaches",
    beachesTitle: "A visual guide to the island’s coast",
    beachesText:
      "From volcanic black pebbles to golden sand and hidden emerald coves, these are the Chios beaches worth planning your days around.",
    exploreBeach: "Explore beach →",
  },
  el: {
    beachesKicker: "Κορυφαίες παραλίες της Χίου",
    beachesTitle: "Οπτικός οδηγός στις ακτές του νησιού",
    beachesText:
      "Από ηφαιστειακά μαύρα βότσαλα μέχρι χρυσαφένια άμμο και κρυφούς σμαραγδένιους όρμους, αυτές είναι οι παραλίες της Χίου που αξίζει να βάλετε στο πρόγραμμά σας.",
    exploreBeach: "Δείτε την παραλία →",
  },
  fr: {
    beachesKicker: "Plus belles plages de Chios",
    beachesTitle: "Un guide visuel du littoral de l’île",
    beachesText:
      "Des galets noirs volcaniques au sable doré et aux criques émeraude cachées, voici les plages de Chios autour desquelles organiser vos journées.",
    exploreBeach: "Explorer la plage →",
  },
  de: {
    beachesKicker: "Top-Strände auf Chios",
    beachesTitle: "Ein visueller Guide zur Küste der Insel",
    beachesText:
      "Von vulkanischen schwarzen Kieseln bis zu goldenem Sand und versteckten smaragdgrünen Buchten: Diese Strände auf Chios lohnen sich für Ihre Tagesplanung.",
    exploreBeach: "Strand ansehen →",
  },
  it: {
    beachesKicker: "Le migliori spiagge di Chios",
    beachesTitle: "Una guida visiva alla costa dell’isola",
    beachesText:
      "Dai ciottoli neri vulcanici alla sabbia dorata e alle calette color smeraldo nascoste, queste sono le spiagge di Chios da inserire nel vostro itinerario.",
    exploreBeach: "Esplora la spiaggia →",
  },
  es: {
    beachesKicker: "Mejores playas de Chios",
    beachesTitle: "Una guía visual de la costa de la isla",
    beachesText:
      "Desde guijarros negros volcánicos hasta arena dorada y calas escondidas de color esmeralda, estas son las playas de Chios que merece la pena planificar.",
    exploreBeach: "Explorar playa →",
  },
  tr: {
    beachesKicker: "Sakız Adası’nın öne çıkan plajları",
    beachesTitle: "Adanın kıyıları için görsel bir rehber",
    beachesText:
      "Volkanik siyah çakıllardan altın kumlara ve gizli zümrüt koylara kadar, günlerinizi planlamaya değer Sakız Adası plajları burada.",
    exploreBeach: "Plajı keşfet →",
  },
} as const;

type BeachesPageUiLanguage = keyof typeof beachesPageUiCopy;

function getBeachesPageLanguage(
  data: ChiosBeachesPageData,
): BeachesPageUiLanguage {
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

export function ChiosBeachesPage({ data }: ChiosBeachesPageProps) {
  const language = getBeachesPageLanguage(data);
  const copy = beachesPageUiCopy[language];

  return (
    <main className="chios-beaches-page">
      <section className="cb-hero" aria-labelledby="cb-hero-title">
        <div className="cb-hero-media" aria-hidden="true">
          <img src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="cb-hero-overlay" />

        <div className="cb-wrap cb-hero-inner">
          <div className="cb-hero-card">
            <span className="cb-kicker cb-kicker--light">
              {data.hero.kicker}
            </span>

            <h1 id="cb-hero-title">{data.hero.title}</h1>

            <p>{data.hero.description}</p>

            <div className="cb-hero-actions">
              <a
                className="cb-btn cb-btn--primary"
                href={data.hero.primaryCta.href}
              >
                {data.hero.primaryCta.label}
              </a>

              <a
                className="cb-btn cb-btn--secondary"
                href={data.hero.secondaryCta.href}
              >
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="cb-section cb-section--intro"
        aria-labelledby="cb-intro-title"
      >
        <div className="cb-wrap cb-intro-grid">
          <article className="cb-intro-copy">
            <span className="cb-kicker">{data.intro.kicker}</span>
            <h2 id="cb-intro-title">{data.intro.title}</h2>
            <p>{data.intro.description}</p>
          </article>

          <aside className="cb-tip-card">
            <div className="cb-tip-icon" aria-hidden="true">
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
        className="cb-section cb-section--beaches"
        id="beaches"
        aria-labelledby="cb-beaches-title"
      >
        <div className="cb-wrap">
          <header className="cb-section-head">
            <span className="cb-kicker">{copy.beachesKicker}</span>
            <h2 id="cb-beaches-title">{copy.beachesTitle}</h2>
            <p>{copy.beachesText}</p>
          </header>

          <div className="cb-bento-grid">
            {data.beaches.map((beach, index) => (
              <a
                className={`cb-beach-card cb-beach-card--${beach.size}`}
                href={beach.href}
                key={beach.href}
              >
                <div className="cb-beach-image" aria-hidden="true">
                  <img
                    src={beach.image}
                    alt=""
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>

                <div className="cb-beach-overlay" />

                <div className="cb-beach-content">
                  <div className="cb-beach-meta">
                    <span>{beach.region}</span>
                    <span>{beach.mood}</span>
                  </div>

                  <div className="cb-beach-badges">
                    {beach.badges.map((badge) => (
                      <span key={badge}>{badge}</span>
                    ))}
                  </div>

                  <h3>{beach.title}</h3>
                  <p>{beach.description}</p>

                  <strong>{copy.exploreBeach}</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className="cb-section cb-section--planning"
        aria-labelledby="cb-planning-title"
      >
        <div className="cb-wrap cb-planning-grid">
          <article>
            <span className="cb-kicker">{data.planning.kicker}</span>
            <h2 id="cb-planning-title">{data.planning.title}</h2>
            <p>{data.planning.description}</p>
          </article>

          <div className="cb-planning-list">
            {data.planning.items.map((item) => (
              <div className="cb-planning-item" key={item.title}>
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
        className="cb-section cb-section--stay"
        aria-labelledby="cb-stay-title"
      >
        <div className="cb-wrap">
          <article className="cb-stay-card">
            <span className="cb-kicker">{data.stay.kicker}</span>
            <h2 id="cb-stay-title">{data.stay.title}</h2>
            <p>{data.stay.text}</p>

            <div className="cb-stay-actions">
              <a
                className="cb-btn cb-btn--primary"
                href={data.stay.primaryCta.href}
              >
                {data.stay.primaryCta.label}
              </a>

              <a
                className="cb-btn cb-btn--outline"
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