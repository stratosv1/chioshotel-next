import type { ChiosVillagesPageData } from "@/content/chios-villages";

type ChiosVillagesPageProps = {
  data: ChiosVillagesPageData;
};

export function ChiosVillagesPage({ data }: ChiosVillagesPageProps) {
  return (
    <main className="chios-villages-page">
      <section className="cv-hero" aria-labelledby="cv-hero-title">
        <div className="cv-hero-media" aria-hidden="true">
          <img src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="cv-hero-overlay" />

        <div className="cv-wrap cv-hero-inner">
          <div className="cv-hero-card">
            <span className="cv-kicker cv-kicker--light">{data.hero.kicker}</span>

            <h1 id="cv-hero-title">{data.hero.title}</h1>

            <p>{data.hero.description}</p>

            <div className="cv-hero-actions">
              <a className="cv-btn cv-btn--primary" href={data.hero.primaryCta.href}>
                {data.hero.primaryCta.label}
              </a>

              <a className="cv-btn cv-btn--secondary" href={data.hero.secondaryCta.href}>
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="cv-section cv-section--intro" aria-labelledby="cv-intro-title">
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
            <span className="cv-kicker">Top Chios villages</span>
            <h2 id="cv-villages-title">A visual guide to local character</h2>
            <p>
              From medieval fortress villages and mastic traditions to seaside food stops,
              these villages show the deeper identity of Chios.
            </p>
          </header>

          <div className="cv-bento-grid">
            {data.villages.map((village, index) => (
              <a
                className={`cv-village-card cv-village-card--${village.size}`}
                href={village.href}
                key={village.id}
              >
                <div className="cv-village-image" aria-hidden="true">
                  <img src={village.image} alt="" loading={index < 2 ? "eager" : "lazy"} />
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

                  <strong>Explore village →</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="cv-section cv-section--planning" aria-labelledby="cv-planning-title">
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

      <section className="cv-section cv-section--stay" aria-labelledby="cv-stay-title">
        <div className="cv-wrap">
          <article className="cv-stay-card">
            <span className="cv-kicker">{data.stay.kicker}</span>
            <h2 id="cv-stay-title">{data.stay.title}</h2>
            <p>{data.stay.text}</p>

            <div className="cv-stay-actions">
              <a className="cv-btn cv-btn--primary" href={data.stay.primaryCta.href}>
                {data.stay.primaryCta.label}
              </a>

              <a className="cv-btn cv-btn--outline" href={data.stay.secondaryCta.href}>
                {data.stay.secondaryCta.label}
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}