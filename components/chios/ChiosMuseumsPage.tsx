import type { ChiosMuseumsPageData } from "@/content/chios-museums";

type ChiosMuseumsPageProps = {
  data: ChiosMuseumsPageData;
};

export function ChiosMuseumsPage({ data }: ChiosMuseumsPageProps) {
  return (
    <main className="chios-museums-page">
      <section className="cm-hero" aria-labelledby="cm-hero-title">
        <div className="cm-hero-media" aria-hidden="true">
          <img src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="cm-hero-overlay" />

        <div className="cm-wrap cm-hero-inner">
          <div className="cm-hero-card">
            <span className="cm-kicker cm-kicker--light">{data.hero.kicker}</span>

            <h1 id="cm-hero-title">{data.hero.title}</h1>

            <p>{data.hero.description}</p>

            <div className="cm-hero-actions">
              <a className="cm-btn cm-btn--primary" href={data.hero.primaryCta.href}>
                {data.hero.primaryCta.label}
              </a>

              <a className="cm-btn cm-btn--secondary" href={data.hero.secondaryCta.href}>
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="cm-section cm-section--intro" aria-labelledby="cm-intro-title">
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
            <span className="cm-kicker">Top Chios museums</span>
            <h2 id="cm-museums-title">A visual guide to culture and history</h2>
            <p>
              From archaeology and Byzantine art to mastic culture, maritime heritage,
              rare books and folklore, these museums reveal the deeper identity of Chios.
            </p>
          </header>

          <div className="cm-bento-grid">
            {data.museums.map((museum, index) => (
              <a
                className={`cm-museum-card cm-museum-card--${museum.size}`}
                href={museum.href}
                key={museum.id}
              >
                <div className="cm-museum-image" aria-hidden="true">
                  <img src={museum.image} alt="" loading={index < 2 ? "eager" : "lazy"} />
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

                  <strong>Explore museum →</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="cm-section cm-section--planning" aria-labelledby="cm-planning-title">
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

      <section className="cm-section cm-section--stay" aria-labelledby="cm-stay-title">
        <div className="cm-wrap">
          <article className="cm-stay-card">
            <span className="cm-kicker">{data.stay.kicker}</span>
            <h2 id="cm-stay-title">{data.stay.title}</h2>
            <p>{data.stay.text}</p>

            <div className="cm-stay-actions">
              <a className="cm-btn cm-btn--primary" href={data.stay.primaryCta.href}>
                {data.stay.primaryCta.label}
              </a>

              <a className="cm-btn cm-btn--outline" href={data.stay.secondaryCta.href}>
                {data.stay.secondaryCta.label}
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}