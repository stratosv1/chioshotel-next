import type { MuseumDetailData } from "@/content/museum-details";
import { getRelatedMuseumCards } from "@/content/museum-details";

type MuseumDetailPageProps = {
  museum: MuseumDetailData;
};

export function MuseumDetailPage({ museum }: MuseumDetailPageProps) {
  const relatedMuseums = getRelatedMuseumCards(museum.slug);

  return (
    <main className="museum-detail-page">
      <section className="md-hero" aria-labelledby="md-hero-title">
        <div className="md-hero-media" aria-hidden="true">
          <img src={museum.hero.image} alt="" loading="eager" />
        </div>

        <div className="md-hero-overlay" />

        <div className="md-wrap md-hero-inner">
          <div className="md-hero-card">
            <span className="md-kicker md-kicker--light">{museum.hero.kicker}</span>

            <h1 id="md-hero-title">{museum.hero.title}</h1>

            <p>{museum.hero.description}</p>

            <div className="md-tags" aria-label="Museum tags">
              {museum.hero.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="md-section md-section--details" aria-label="Museum details">
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

      <section className="md-section md-section--story" aria-labelledby="md-story-title">
        <div className="md-wrap md-story-grid">
          <article className="md-story-card">
            <span className="md-kicker">Museum guide</span>
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

      <section className="md-section md-section--routes" aria-labelledby="md-routes-title">
        <div className="md-wrap">
          <header className="md-section-head">
            <span className="md-kicker">Route ideas</span>
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

      <section className="md-section md-section--tip" aria-label="Voulamandis House local tip">
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

      <section className="md-section md-section--related" aria-labelledby="md-related-title">
        <div className="md-wrap">
          <header className="md-section-head">
            <span className="md-kicker">Chios museum guide</span>
            <h2 id="md-related-title">{museum.relatedTitle}</h2>
            <p>{museum.relatedText}</p>
          </header>

          <div className="md-related-grid">
            {relatedMuseums.map((related, index) => (
              <a
                className={`md-related-card md-related-card--${related.size}`}
                href={related.href}
                key={related.slug}
              >
                <div className="md-related-image" aria-hidden="true">
                  <img src={related.image} alt="" loading={index < 2 ? "eager" : "lazy"} />
                </div>

                <div className="md-related-overlay" />

                <div className="md-related-content">
                  <span>{related.badge}</span>
                  <h3>{related.title}</h3>
                  <p>{related.description}</p>
                  <strong>Explore museum →</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}