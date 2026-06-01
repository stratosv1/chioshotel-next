import type { BeachDetailData } from "@/content/beach-details";
import {
  chiosBeachesPageDe,
  chiosBeachesPageEl,
  chiosBeachesPageEn,
  chiosBeachesPageEs,
  chiosBeachesPageFr,
  chiosBeachesPageIt,
  chiosBeachesPageTr,
  type ChiosBeachesPageData,
} from "@/content/chios-beaches";

type BeachDetailPageProps = {
  beach: BeachDetailData;
};

const beachUiCopy = {
  en: {
    tagsLabel: "Beach tags",
    detailsLabel: "Beach details",
    mediaLabel: "Beach video and route",
    videoTitle: "video",
    routeMapTitle: "route map",
    distance: "Distance",
    time: "Time",
    openGps: "Open in GPS",
    localTipLabel: "Voulamandis House local tip",
    relatedKicker: "Chios beach guide",
    exploreBeach: "Explore beach →",
  },
  el: {
    tagsLabel: "Χαρακτηριστικά παραλίας",
    detailsLabel: "Πληροφορίες παραλίας",
    mediaLabel: "Βίντεο και διαδρομή παραλίας",
    videoTitle: "βίντεο",
    routeMapTitle: "χάρτης διαδρομής",
    distance: "Απόσταση",
    time: "Χρόνος",
    openGps: "Άνοιγμα στο GPS",
    localTipLabel: "Τοπική συμβουλή από το Voulamandis House",
    relatedKicker: "Οδηγός παραλιών Χίου",
    exploreBeach: "Δείτε την παραλία →",
  },
  fr: {
    tagsLabel: "Caractéristiques de la plage",
    detailsLabel: "Détails de la plage",
    mediaLabel: "Vidéo et itinéraire de la plage",
    videoTitle: "vidéo",
    routeMapTitle: "carte d’itinéraire",
    distance: "Distance",
    time: "Temps",
    openGps: "Ouvrir dans le GPS",
    localTipLabel: "Conseil local de Voulamandis House",
    relatedKicker: "Guide des plages de Chios",
    exploreBeach: "Explorer la plage →",
  },
  de: {
    tagsLabel: "Strandmerkmale",
    detailsLabel: "Stranddetails",
    mediaLabel: "Strandvideo und Route",
    videoTitle: "Video",
    routeMapTitle: "Routenkarte",
    distance: "Entfernung",
    time: "Zeit",
    openGps: "Im GPS öffnen",
    localTipLabel: "Lokaler Tipp von Voulamandis House",
    relatedKicker: "Strandführer für Chios",
    exploreBeach: "Strand ansehen →",
  },
  it: {
    tagsLabel: "Caratteristiche della spiaggia",
    detailsLabel: "Dettagli della spiaggia",
    mediaLabel: "Video e percorso della spiaggia",
    videoTitle: "video",
    routeMapTitle: "mappa del percorso",
    distance: "Distanza",
    time: "Tempo",
    openGps: "Apri nel GPS",
    localTipLabel: "Consiglio locale di Voulamandis House",
    relatedKicker: "Guida alle spiagge di Chios",
    exploreBeach: "Esplora la spiaggia →",
  },
  es: {
    tagsLabel: "Características de la playa",
    detailsLabel: "Detalles de la playa",
    mediaLabel: "Vídeo y ruta de la playa",
    videoTitle: "vídeo",
    routeMapTitle: "mapa de ruta",
    distance: "Distancia",
    time: "Tiempo",
    openGps: "Abrir en GPS",
    localTipLabel: "Consejo local de Voulamandis House",
    relatedKicker: "Guía de playas de Chios",
    exploreBeach: "Explorar playa →",
  },
  tr: {
    tagsLabel: "Plaj özellikleri",
    detailsLabel: "Plaj detayları",
    mediaLabel: "Plaj videosu ve rota",
    videoTitle: "video",
    routeMapTitle: "rota haritası",
    distance: "Mesafe",
    time: "Süre",
    openGps: "GPS’te aç",
    localTipLabel: "Voulamandis House yerel tavsiyesi",
    relatedKicker: "Sakız Adası plaj rehberi",
    exploreBeach: "Plajı keşfet →",
  },
} as const;

type BeachUiLanguage = keyof typeof beachUiCopy;

function getBeachLanguage(beach: BeachDetailData): BeachUiLanguage {
  const path = beach.seo.canonicalPath;

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

function getChiosBeachesPageForLanguage(
  language: BeachUiLanguage,
): ChiosBeachesPageData {
  switch (language) {
    case "el":
      return chiosBeachesPageEl;
    case "fr":
      return chiosBeachesPageFr;
    case "de":
      return chiosBeachesPageDe;
    case "it":
      return chiosBeachesPageIt;
    case "es":
      return chiosBeachesPageEs;
    case "tr":
      return chiosBeachesPageTr;
    case "en":
    default:
      return chiosBeachesPageEn;
  }
}

export function BeachDetailPage({ beach }: BeachDetailPageProps) {
  const language = getBeachLanguage(beach);
  const copy = beachUiCopy[language];
  const chiosBeachesPage = getChiosBeachesPageForLanguage(language);
  const relatedBeaches = chiosBeachesPage.beaches.filter(
    (related) => related.href !== beach.seo.canonicalPath,
  );

  return (
    <main className="beach-detail-page">
      <section className="bd-hero" aria-labelledby="bd-hero-title">
        <div className="bd-hero-media" aria-hidden="true">
          <img src={beach.hero.image} alt="" loading="eager" />
        </div>

        <div className="bd-hero-overlay" />

        <div className="bd-wrap bd-hero-inner">
          <div className="bd-hero-card">
            <span className="bd-kicker bd-kicker--light">
              {beach.hero.kicker}
            </span>

            <h1 id="bd-hero-title">{beach.hero.title}</h1>

            <p>{beach.hero.description}</p>

            <div className="bd-tags" aria-label={copy.tagsLabel}>
              {beach.hero.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="bd-section bd-section--details"
        aria-label={copy.detailsLabel}
      >
        <div className="bd-wrap bd-detail-grid">
          {beach.details.map((detail) => (
            <article className="bd-detail-card" key={detail.title}>
              <div className="bd-detail-icon" aria-hidden="true">
                {detail.icon}
              </div>

              <h2>{detail.title}</h2>
              <p>{detail.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="bd-section bd-section--media"
        aria-label={copy.mediaLabel}
      >
        <div className="bd-wrap bd-media-grid">
          <article className="bd-media-card">
            <h2>📹 {beach.media.video.title}</h2>

            <div className="bd-video-frame">
              <iframe
                src={beach.media.video.embedUrl}
                title={`${beach.hero.title} ${copy.videoTitle}`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p>
              {beach.media.video.creditText}{" "}
              <a
                href={beach.media.video.creditHref}
                target="_blank"
                rel="noopener nofollow"
              >
                {beach.media.video.creditLabel}
              </a>
            </p>
          </article>

          <article className="bd-media-card">
            <h2>🚗 {beach.media.map.title}</h2>

            <div className="bd-map-frame">
              <iframe
                src={beach.media.map.embedUrl}
                title={`${beach.hero.title} ${copy.routeMapTitle}`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <p>
              {copy.distance}: <strong>{beach.media.map.distance}</strong> |{" "}
              {copy.time}: <strong>{beach.media.map.time}</strong>
            </p>

            <a
              className="bd-map-link"
              href={beach.media.map.gpsHref}
              target="_blank"
              rel="noopener"
            >
              📍 {copy.openGps}
            </a>
          </article>
        </div>
      </section>

      <section
        className="bd-section bd-section--tip"
        aria-label={copy.localTipLabel}
      >
        <div className="bd-wrap">
          <article className="bd-base-tip">
            <div className="bd-base-tip-icon" aria-hidden="true">
              {beach.baseTip.icon}
            </div>

            <div>
              <h2>{beach.baseTip.title}</h2>
              <p>
                {beach.baseTip.text}{" "}
                <a href={beach.baseTip.href}>{beach.baseTip.linkLabel}</a>
              </p>
            </div>
          </article>
        </div>
      </section>

      <section
        className="bd-section bd-section--related"
        aria-labelledby="bd-related-title"
      >
        <div className="bd-wrap">
          <header className="bd-section-head">
            <span className="bd-kicker">{copy.relatedKicker}</span>
            <h2 id="bd-related-title">{beach.relatedTitle}</h2>
            <p>{beach.relatedText}</p>
          </header>

          <div className="bd-related-grid">
            {relatedBeaches.map((related, index) => (
              <a
                className={`bd-related-card bd-related-card--${related.size}`}
                href={related.href}
                key={related.href}
              >
                <div className="bd-related-image" aria-hidden="true">
                  <img
                    src={related.image}
                    alt=""
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>

                <div className="bd-related-overlay" />

                <div className="bd-related-content">
                  <span>{related.badges[0]}</span>
                  <h3>{related.name}</h3>
                  <p>{related.description}</p>
                  <strong>{copy.exploreBeach}</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}