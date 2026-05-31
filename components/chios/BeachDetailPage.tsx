import type { BeachDetailData } from "@/content/beach-details";
import { getRelatedBeachCards } from "@/content/beach-details";

type BeachDetailPageProps = {
  beach: BeachDetailData;
};

export function BeachDetailPage({ beach }: BeachDetailPageProps) {
  const relatedBeaches = getRelatedBeachCards(beach.slug);

  return (
    <main className="beach-detail-page">
      <section className="bd-hero" aria-labelledby="bd-hero-title">
        <div className="bd-hero-media" aria-hidden="true">
          <img src={beach.hero.image} alt="" loading="eager" />
        </div>

        <div className="bd-hero-overlay" />

        <div className="bd-wrap bd-hero-inner">
          <div className="bd-hero-card">
            <span className="bd-kicker bd-kicker--light">{beach.hero.kicker}</span>

            <h1 id="bd-hero-title">{beach.hero.title}</h1>

            <p>{beach.hero.description}</p>

            <div className="bd-tags" aria-label="Beach tags">
              {beach.hero.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bd-section bd-section--details" aria-label="Beach details">
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

      <section className="bd-section bd-section--media" aria-label="Beach video and route">
        <div className="bd-wrap bd-media-grid">
          <article className="bd-media-card">
            <h2>📹 {beach.media.video.title}</h2>

            <div className="bd-video-frame">
              <iframe
                src={beach.media.video.embedUrl}
                title={`${beach.hero.title} video`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p>
              {beach.media.video.creditText}{" "}
              <a href={beach.media.video.creditHref} target="_blank" rel="noopener nofollow">
                {beach.media.video.creditLabel}
              </a>
            </p>
          </article>

          <article className="bd-media-card">
            <h2>🚗 {beach.media.map.title}</h2>

            <div className="bd-map-frame">
              <iframe
                src={beach.media.map.embedUrl}
                title={`${beach.hero.title} route map`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <p>
              Distance: <strong>{beach.media.map.distance}</strong> | Time:{" "}
              <strong>{beach.media.map.time}</strong>
            </p>

            <a className="bd-map-link" href={beach.media.map.gpsHref} target="_blank" rel="noopener">
              📍 Open in GPS
            </a>
          </article>
        </div>
      </section>

      <section className="bd-section bd-section--tip" aria-label="Voulamandis House local tip">
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

      <section className="bd-section bd-section--related" aria-labelledby="bd-related-title">
        <div className="bd-wrap">
          <header className="bd-section-head">
            <span className="bd-kicker">Chios beach guide</span>
            <h2 id="bd-related-title">{beach.relatedTitle}</h2>
            <p>{beach.relatedText}</p>
          </header>

          <div className="bd-related-grid">
            {relatedBeaches.map((related, index) => (
              <a
                className={`bd-related-card bd-related-card--${related.size}`}
                href={related.href}
                key={related.slug}
              >
                <div className="bd-related-image" aria-hidden="true">
                  <img src={related.image} alt="" loading={index < 2 ? "eager" : "lazy"} />
                </div>

                <div className="bd-related-overlay" />

                <div className="bd-related-content">
                  <span>{related.badge}</span>
                  <h3>{related.title}</h3>
                  <p>{related.description}</p>
                  <strong>Explore beach →</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}