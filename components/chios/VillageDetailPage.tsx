import type { VillageDetailData } from "@/content/village-details";
import { getRelatedVillageCards } from "@/content/village-details";

type VillageDetailPageProps = {
  village: VillageDetailData;
};

export function VillageDetailPage({ village }: VillageDetailPageProps) {
  const relatedVillages = getRelatedVillageCards(village.slug);

  return (
    <main className="village-detail-page">
      <section className="vd-hero" aria-labelledby="vd-hero-title">
        <div className="vd-hero-media" aria-hidden="true">
          <img src={village.hero.image} alt="" loading="eager" />
        </div>

        <div className="vd-hero-overlay" />

        <div className="vd-wrap vd-hero-inner">
          <div className="vd-hero-card">
            <span className="vd-kicker vd-kicker--light">{village.hero.kicker}</span>

            <h1 id="vd-hero-title">{village.hero.title}</h1>

            <p>{village.hero.description}</p>

            <div className="vd-tags" aria-label="Village tags">
              {village.hero.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="vd-section vd-section--details" aria-label="Village details">
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

      <section className="vd-section vd-section--story" aria-labelledby="vd-story-title">
        <div className="vd-wrap vd-story-grid">
          <article className="vd-story-card">
            <span className="vd-kicker">Village guide</span>
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

      <section className="vd-section vd-section--routes" aria-labelledby="vd-routes-title">
        <div className="vd-wrap">
          <header className="vd-section-head">
            <span className="vd-kicker">Route ideas</span>
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

      <section className="vd-section vd-section--tip" aria-label="Voulamandis House local tip">
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

      <section className="vd-section vd-section--related" aria-labelledby="vd-related-title">
        <div className="vd-wrap">
          <header className="vd-section-head">
            <span className="vd-kicker">Chios village guide</span>
            <h2 id="vd-related-title">{village.relatedTitle}</h2>
            <p>{village.relatedText}</p>
          </header>

          <div className="vd-related-grid">
            {relatedVillages.map((related, index) => (
              <a
                className={`vd-related-card vd-related-card--${related.size}`}
                href={related.href}
                key={related.slug}
              >
                <div className="vd-related-image" aria-hidden="true">
                  <img src={related.image} alt="" loading={index < 2 ? "eager" : "lazy"} />
                </div>

                <div className="vd-related-overlay" />

                <div className="vd-related-content">
                  <span>{related.badge}</span>
                  <h3>{related.title}</h3>
                  <p>{related.description}</p>
                  <strong>Explore village →</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}