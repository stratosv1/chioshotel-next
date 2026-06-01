import type { ChiosMuseumsPageData } from "@/content/chios-museums";

type ChiosMuseumsPageProps = {
  data: ChiosMuseumsPageData;
};

const museumsPageUiCopy = {
  en: {
    museumsKicker: "Top Chios museums",
    museumsTitle: "A visual guide to Chios culture",
    museumsText:
      "From mastic culture and archaeology to Byzantine art, maritime history, rare books and village folklore, these museums reveal the deeper identity of Chios.",
    exploreMuseum: "Explore museum →",
  },
  el: {
    museumsKicker: "Κορυφαία μουσεία της Χίου",
    museumsTitle: "Οπτικός οδηγός στον πολιτισμό της Χίου",
    museumsText:
      "Από την κουλτούρα της μαστίχας και την αρχαιολογία μέχρι τη βυζαντινή τέχνη, τη ναυτική ιστορία, τα σπάνια βιβλία και τη λαογραφία, αυτά τα μουσεία αποκαλύπτουν τη βαθύτερη ταυτότητα της Χίου.",
    exploreMuseum: "Δείτε το μουσείο →",
  },
  fr: {
    museumsKicker: "Musées incontournables de Chios",
    museumsTitle: "Un guide visuel de la culture de Chios",
    museumsText:
      "De la culture du mastic et de l’archéologie à l’art byzantin, l’histoire maritime, les livres rares et le folklore villageois, ces musées révèlent l’identité profonde de Chios.",
    exploreMuseum: "Explorer le musée →",
  },
  de: {
    museumsKicker: "Top-Museen auf Chios",
    museumsTitle: "Ein visueller Guide zur Kultur von Chios",
    museumsText:
      "Von Mastixkultur und Archäologie bis zu byzantinischer Kunst, maritimer Geschichte, seltenen Büchern und dörflicher Volkskunde zeigen diese Museen die tiefere Identität von Chios.",
    exploreMuseum: "Museum ansehen →",
  },
  it: {
    museumsKicker: "I migliori musei di Chios",
    museumsTitle: "Una guida visiva alla cultura di Chios",
    museumsText:
      "Dalla cultura del mastice e l’archeologia all’arte bizantina, la storia marittima, i libri rari e il folklore dei villaggi, questi musei rivelano l’identità più profonda di Chios.",
    exploreMuseum: "Esplora il museo →",
  },
  es: {
    museumsKicker: "Museos imprescindibles de Chios",
    museumsTitle: "Una guía visual de la cultura de Chios",
    museumsText:
      "Desde la cultura de la mastiha y la arqueología hasta el arte bizantino, la historia marítima, los libros raros y el folclore de los pueblos, estos museos revelan la identidad más profunda de Chios.",
    exploreMuseum: "Explorar museo →",
  },
  tr: {
    museumsKicker: "Sakız Adası’nın öne çıkan müzeleri",
    museumsTitle: "Sakız kültürü için görsel bir rehber",
    museumsText:
      "Mastik kültürü ve arkeolojiden Bizans sanatına, denizcilik tarihine, nadir kitaplara ve köy folkloruna kadar bu müzeler Sakız Adası’nın daha derin kimliğini gösterir.",
    exploreMuseum: "Müzeyi keşfet →",
  },
} as const;

type MuseumsPageUiLanguage = keyof typeof museumsPageUiCopy;

function getMuseumsPageLanguage(
  data: ChiosMuseumsPageData,
): MuseumsPageUiLanguage {
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

export function ChiosMuseumsPage({ data }: ChiosMuseumsPageProps) {
  const language = getMuseumsPageLanguage(data);
  const copy = museumsPageUiCopy[language];

  return (
    <main className="chios-museums-page">
      <section className="cm-hero" aria-labelledby="cm-hero-title">
        <div className="cm-hero-media" aria-hidden="true">
          <img src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="cm-hero-overlay" />

        <div className="cm-wrap cm-hero-inner">
          <div className="cm-hero-card">
            <span className="cm-kicker cm-kicker--light">
              {data.hero.kicker}
            </span>

            <h1 id="cm-hero-title">{data.hero.title}</h1>

            <p>{data.hero.description}</p>

            <div className="cm-hero-actions">
              <a
                className="cm-btn cm-btn--primary"
                href={data.hero.primaryCta.href}
              >
                {data.hero.primaryCta.label}
              </a>

              <a
                className="cm-btn cm-btn--secondary"
                href={data.hero.secondaryCta.href}
              >
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="cm-section cm-section--intro"
        aria-labelledby="cm-intro-title"
      >
        <div className="cm-wrap cm-intro-grid">
          <article className="cm-intro-copy">
            <span className="cm-kicker">{data.intro.kicker}</span>
            <h2 id="cm-intro-title">{data.intro.title}</h2>
            <p>{data.intro.description}</p>
          </article>

          <aside className="cm-tip-card">
            <div className="cm-tip-icon" aria-hidden="true">
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
        className="cm-section cm-section--museums"
        id="museums"
        aria-labelledby="cm-museums-title"
      >
        <div className="cm-wrap">
          <header className="cm-section-head">
            <span className="cm-kicker">{copy.museumsKicker}</span>
            <h2 id="cm-museums-title">{copy.museumsTitle}</h2>
            <p>{copy.museumsText}</p>
          </header>

          <div className="cm-bento-grid">
            {data.museums.map((museum, index) => (
              <a
                className={`cm-museum-card cm-museum-card--${museum.size}`}
                href={museum.href}
                key={museum.href}
              >
                <div className="cm-museum-image" aria-hidden="true">
                  <img
                    src={museum.image}
                    alt=""
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>

                <div className="cm-museum-overlay" />

                <div className="cm-museum-content">
                  <div className="cm-museum-meta">
                    <span>{museum.region}</span>
                    <span>{museum.mood}</span>
                  </div>

                  <div className="cm-museum-badges">
                    {museum.badges.map((badge) => (
                      <span key={badge}>{badge}</span>
                    ))}
                  </div>

                  <h3>{museum.title}</h3>
                  <p>{museum.description}</p>

                  <strong>{copy.exploreMuseum}</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className="cm-section cm-section--planning"
        aria-labelledby="cm-planning-title"
      >
        <div className="cm-wrap cm-planning-grid">
          <article>
            <span className="cm-kicker">{data.planning.kicker}</span>
            <h2 id="cm-planning-title">{data.planning.title}</h2>
            <p>{data.planning.description}</p>
          </article>

          <div className="cm-planning-list">
            {data.planning.items.map((item) => (
              <div className="cm-planning-item" key={item.title}>
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
        className="cm-section cm-section--stay"
        aria-labelledby="cm-stay-title"
      >
        <div className="cm-wrap">
          <article className="cm-stay-card">
            <span className="cm-kicker">{data.stay.kicker}</span>
            <h2 id="cm-stay-title">{data.stay.title}</h2>
            <p>{data.stay.text}</p>

            <div className="cm-stay-actions">
              <a
                className="cm-btn cm-btn--primary"
                href={data.stay.primaryCta.href}
              >
                {data.stay.primaryCta.label}
              </a>

              <a
                className="cm-btn cm-btn--outline"
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