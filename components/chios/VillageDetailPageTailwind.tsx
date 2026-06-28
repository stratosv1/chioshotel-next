import type { VillageDetailData } from "@/content/village-details";
import { localizedVillageDetails, villageDetails } from "@/content/village-details";

type VillageDetailPageProps = {
  village: VillageDetailData;
};

const villageUiCopy = {
  en: {
    tagsLabel: "Village tags",
    detailsLabel: "Village details",
    storyKicker: "Village guide",
    routesKicker: "Route ideas",
    localTipLabel: "Voulamandis House local tip",
    relatedKicker: "Chios village guide",
    exploreVillage: "Explore village →",
  },
  el: {
    tagsLabel: "Χαρακτηριστικά χωριού",
    detailsLabel: "Πληροφορίες χωριού",
    storyKicker: "Οδηγός χωριού",
    routesKicker: "Ιδέες διαδρομής",
    localTipLabel: "Τοπική συμβουλή από το Voulamandis House",
    relatedKicker: "Οδηγός χωριών Χίου",
    exploreVillage: "Δείτε το χωριό →",
  },
  fr: {
    tagsLabel: "Caractéristiques du village",
    detailsLabel: "Détails du village",
    storyKicker: "Guide du village",
    routesKicker: "Idées d’itinéraire",
    localTipLabel: "Conseil local de Voulamandis House",
    relatedKicker: "Guide des villages de Chios",
    exploreVillage: "Explorer le village →",
  },
  de: {
    tagsLabel: "Dorfmerkmale",
    detailsLabel: "Dorfdetails",
    storyKicker: "Dorfführer",
    routesKicker: "Routenideen",
    localTipLabel: "Lokaler Tipp von Voulamandis House",
    relatedKicker: "Dorfführer für Chios",
    exploreVillage: "Dorf ansehen →",
  },
  it: {
    tagsLabel: "Caratteristiche del villaggio",
    detailsLabel: "Dettagli del villaggio",
    storyKicker: "Guida del villaggio",
    routesKicker: "Idee di itinerario",
    localTipLabel: "Consiglio locale di Voulamandis House",
    relatedKicker: "Guida ai villaggi di Chios",
    exploreVillage: "Esplora il villaggio →",
  },
  es: {
    tagsLabel: "Características del pueblo",
    detailsLabel: "Detalles del pueblo",
    storyKicker: "Guía del pueblo",
    routesKicker: "Ideas de ruta",
    localTipLabel: "Consejo local de Voulamandis House",
    relatedKicker: "Guía de pueblos de Chios",
    exploreVillage: "Explorar pueblo →",
  },
  tr: {
    tagsLabel: "Köy özellikleri",
    detailsLabel: "Köy detayları",
    storyKicker: "Köy rehberi",
    routesKicker: "Rota fikirleri",
    localTipLabel: "Voulamandis House yerel tavsiyesi",
    relatedKicker: "Sakız Adası köy rehberi",
    exploreVillage: "Köyü keşfet →",
  },
} as const;

type VillageUiLanguage = keyof typeof villageUiCopy;

function getVillageLanguage(village: VillageDetailData): VillageUiLanguage {
  const path = village.seo.canonicalPath;

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

function getVillageCollectionForLanguage(language: VillageUiLanguage) {
  if (language === "en") {
    return villageDetails;
  }

  return localizedVillageDetails.filter((relatedVillage) =>
    relatedVillage.seo.canonicalPath.startsWith(`/${language}/`),
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

function getBadgeFromVillage(village: VillageDetailData) {
  const firstTag = village.hero.tags[0];

  if (!firstTag) {
    return village.hero.kicker;
  }

  return firstTag.replace(/^#/, "").replaceAll("_", " ");
}

export function VillageDetailPageTailwind({ village }: VillageDetailPageProps) {
  const language = getVillageLanguage(village);
  const copy = villageUiCopy[language];

  const relatedVillages = getVillageCollectionForLanguage(language).filter(
    (relatedVillage) =>
      relatedVillage.seo.canonicalPath !== village.seo.canonicalPath,
  );

  return (
    <main className="village-detail-page">
      <section className="vd-hero" aria-labelledby="vd-hero-title">
        <div className="vd-hero-media" aria-hidden="true">
          <img src={village.hero.image} alt="" loading="eager" />
        </div>

        <div className="vd-hero-overlay" />

        <div className="vd-wrap vd-hero-inner">
          <div className="vd-hero-card">
            <span className="vd-kicker vd-kicker--light">
              {village.hero.kicker}
            </span>

            <h1 id="vd-hero-title">{village.hero.title}</h1>

            <p>{village.hero.description}</p>

            <div className="vd-tags" aria-label={copy.tagsLabel}>
              {village.hero.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="vd-section vd-section--details"
        aria-label={copy.detailsLabel}
      >
        <div className="vd-wrap vd-detail-grid">
          {village.details.map((detail) => (
            <article className="vd-detail-card" key={detail.title}>
              <div className="vd-detail-icon" aria-hidden="true">
                {detail.icon}
              </div>

              <h2>{detail.title}</h2>
              <p>{detail.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="vd-section vd-section--story"
        aria-labelledby="vd-story-title"
      >
        <div className="vd-wrap vd-story-grid">
          <article className="vd-story-card">
            <span className="vd-kicker">{copy.storyKicker}</span>
            <h2 id="vd-story-title">{village.experience.title}</h2>

            {village.experience.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <aside className="vd-highlights-card">
            <h2>{village.highlights.title}</h2>

            <ul>
              {village.highlights.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section
        className="vd-section vd-section--routes"
        aria-labelledby="vd-routes-title"
      >
        <div className="vd-wrap">
          <header className="vd-section-head">
            <span className="vd-kicker">{copy.routesKicker}</span>
            <h2 id="vd-routes-title">{village.routeIdeas.title}</h2>
          </header>

          <div className="vd-route-grid">
            {village.routeIdeas.items.map((item) => (
              <article className="vd-route-card" key={item.title}>
                <div className="vd-route-icon" aria-hidden="true">
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
        className="vd-section vd-section--tip"
        aria-label={copy.localTipLabel}
      >
        <div className="vd-wrap">
          <article className="vd-base-tip">
            <div className="vd-base-tip-icon" aria-hidden="true">
              {village.baseTip.icon}
            </div>

            <div>
              <h2>{village.baseTip.title}</h2>
              <p>
                {village.baseTip.text}{" "}
                <a href={village.baseTip.href}>{village.baseTip.linkLabel}</a>
              </p>
            </div>
          </article>
        </div>
      </section>

      <section
        className="vd-section vd-section--related"
        aria-labelledby="vd-related-title"
      >
        <div className="vd-wrap">
          <header className="vd-section-head">
            <span className="vd-kicker">{copy.relatedKicker}</span>
            <h2 id="vd-related-title">{village.relatedTitle}</h2>
            <p>{village.relatedText}</p>
          </header>

          <div className="vd-related-grid">
            {relatedVillages.map((related, index) => (
              <a
                className={`vd-related-card vd-related-card--${getRelatedCardSize(
                  index,
                )}`}
                href={related.seo.canonicalPath}
                key={related.seo.canonicalPath}
              >
                <div className="vd-related-image" aria-hidden="true">
                  <img
                    src={related.hero.image}
                    alt=""
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>

                <div className="vd-related-overlay" />

                <div className="vd-related-content">
                  <span>{getBadgeFromVillage(related)}</span>
                  <h3>{related.hero.title}</h3>
                  <p>{related.seo.description}</p>
                  <strong>{copy.exploreVillage}</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}