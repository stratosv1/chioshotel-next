import type { MuseumDetailData } from "@/content/museum-details";
import { localizedMuseumDetails, museumDetails } from "@/content/museum-details";

type MuseumDetailPageProps = {
  museum: MuseumDetailData;
};

const museumUiCopy = {
  en: {
    tagsLabel: "Museum tags",
    detailsLabel: "Museum details",
    storyKicker: "Museum guide",
    routesKicker: "Route ideas",
    localTipLabel: "Voulamandis House local tip",
    relatedKicker: "Chios museum guide",
    exploreMuseum: "Explore museum →",
  },
  el: {
    tagsLabel: "Χαρακτηριστικά μουσείου",
    detailsLabel: "Πληροφορίες μουσείου",
    storyKicker: "Οδηγός μουσείου",
    routesKicker: "Ιδέες διαδρομής",
    localTipLabel: "Τοπική συμβουλή από το Voulamandis House",
    relatedKicker: "Οδηγός μουσείων Χίου",
    exploreMuseum: "Δείτε το μουσείο →",
  },
  fr: {
    tagsLabel: "Caractéristiques du musée",
    detailsLabel: "Détails du musée",
    storyKicker: "Guide du musée",
    routesKicker: "Idées d’itinéraire",
    localTipLabel: "Conseil local de Voulamandis House",
    relatedKicker: "Guide des musées de Chios",
    exploreMuseum: "Explorer le musée →",
  },
  de: {
    tagsLabel: "Museumsmerkmale",
    detailsLabel: "Museumsdetails",
    storyKicker: "Museumsführer",
    routesKicker: "Routenideen",
    localTipLabel: "Lokaler Tipp von Voulamandis House",
    relatedKicker: "Museumsführer für Chios",
    exploreMuseum: "Museum ansehen →",
  },
  it: {
    tagsLabel: "Caratteristiche del museo",
    detailsLabel: "Dettagli del museo",
    storyKicker: "Guida del museo",
    routesKicker: "Idee di itinerario",
    localTipLabel: "Consiglio locale di Voulamandis House",
    relatedKicker: "Guida ai musei di Chios",
    exploreMuseum: "Esplora il museo →",
  },
  es: {
    tagsLabel: "Características del museo",
    detailsLabel: "Detalles del museo",
    storyKicker: "Guía del museo",
    routesKicker: "Ideas de ruta",
    localTipLabel: "Consejo local de Voulamandis House",
    relatedKicker: "Guía de museos de Chios",
    exploreMuseum: "Explorar museo →",
  },
  tr: {
    tagsLabel: "Müze özellikleri",
    detailsLabel: "Müze detayları",
    storyKicker: "Müze rehberi",
    routesKicker: "Rota fikirleri",
    localTipLabel: "Voulamandis House yerel tavsiyesi",
    relatedKicker: "Sakız Adası müze rehberi",
    exploreMuseum: "Müzeyi keşfet →",
  },
} as const;

type MuseumUiLanguage = keyof typeof museumUiCopy;

function getMuseumLanguage(museum: MuseumDetailData): MuseumUiLanguage {
  const path = museum.seo.canonicalPath;

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

function getMuseumCollectionForLanguage(language: MuseumUiLanguage) {
  if (language === "en") {
    return museumDetails;
  }

  return localizedMuseumDetails.filter((relatedMuseum) =>
    relatedMuseum.seo.canonicalPath.startsWith(`/${language}/`),
  );
}

function getRelatedCardSize(index: number) {
  if (index === 0) {
    return "large";
  }

  if (index === 1 || index === 5) {
    return "wide";
  }

  return "normal";
}

function getBadgeFromMuseum(museum: MuseumDetailData) {
  const firstTag = museum.hero.tags[0];

  if (!firstTag) {
    return museum.hero.kicker;
  }

  return firstTag.replace(/^#/, "").replaceAll("_", " ");
}

export function MuseumDetailPage({ museum }: MuseumDetailPageProps) {
  const language = getMuseumLanguage(museum);
  const copy = museumUiCopy[language];

  const relatedMuseums = getMuseumCollectionForLanguage(language).filter(
    (relatedMuseum) =>
      relatedMuseum.seo.canonicalPath !== museum.seo.canonicalPath,
  );

  return (
    <main className="museum-detail-page">
      <section className="md-hero" aria-labelledby="md-hero-title">
        <div className="md-hero-media" aria-hidden="true">
          <img src={museum.hero.image} alt="" loading="eager" />
        </div>

        <div className="md-hero-overlay" />

        <div className="md-wrap md-hero-inner">
          <div className="md-hero-card">
            <span className="md-kicker md-kicker--light">
              {museum.hero.kicker}
            </span>

            <h1 id="md-hero-title">{museum.hero.title}</h1>

            <p>{museum.hero.description}</p>

            <div className="md-tags" aria-label={copy.tagsLabel}>
              {museum.hero.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="md-section md-section--details"
        aria-label={copy.detailsLabel}
      >
        <div className="md-wrap md-detail-grid">
          {museum.details.map((detail) => (
            <article className="md-detail-card" key={detail.title}>
              <div className="md-detail-icon" aria-hidden="true">
                {detail.icon}
              </div>

              <h2>{detail.title}</h2>
              <p>{detail.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="md-section md-section--story"
        aria-labelledby="md-story-title"
      >
        <div className="md-wrap md-story-grid">
          <article className="md-story-card">
            <span className="md-kicker">{copy.storyKicker}</span>
            <h2 id="md-story-title">{museum.experience.title}</h2>

            {museum.experience.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <aside className="md-highlights-card">
            <h2>{museum.highlights.title}</h2>

            <ul>
              {museum.highlights.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section
        className="md-section md-section--routes"
        aria-labelledby="md-routes-title"
      >
        <div className="md-wrap">
          <header className="md-section-head">
            <span className="md-kicker">{copy.routesKicker}</span>
            <h2 id="md-routes-title">{museum.routeIdeas.title}</h2>
          </header>

          <div className="md-route-grid">
            {museum.routeIdeas.items.map((item) => (
              <article className="md-route-card" key={item.title}>
                <div className="md-route-icon" aria-hidden="true">
                  {item.icon}
                </div>

                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="md-section md-section--tip"
        aria-label={copy.localTipLabel}
      >
        <div className="md-wrap">
          <article className="md-base-tip">
            <div className="md-base-tip-icon" aria-hidden="true">
              {museum.baseTip.icon}
            </div>

            <div>
              <h2>{museum.baseTip.title}</h2>
              <p>
                {museum.baseTip.text}{" "}
                <a href={museum.baseTip.href}>{museum.baseTip.linkLabel}</a>
              </p>
            </div>
          </article>
        </div>
      </section>

      <section
        className="md-section md-section--related"
        aria-labelledby="md-related-title"
      >
        <div className="md-wrap">
          <header className="md-section-head">
            <span className="md-kicker">{copy.relatedKicker}</span>
            <h2 id="md-related-title">{museum.relatedTitle}</h2>
            <p>{museum.relatedText}</p>
          </header>

          <div className="md-related-grid">
            {relatedMuseums.map((related, index) => (
              <a
                className={`md-related-card md-related-card--${getRelatedCardSize(
                  index,
                )}`}
                href={related.seo.canonicalPath}
                key={related.seo.canonicalPath}
              >
                <div className="md-related-image" aria-hidden="true">
                  <img
                    src={related.hero.image}
                    alt=""
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>

                <div className="md-related-overlay" />

                <div className="md-related-content">
                  <span>{getBadgeFromMuseum(related)}</span>
                  <h3>{related.hero.title}</h3>
                  <p>{related.seo.description}</p>
                  <strong>{copy.exploreMuseum}</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 
