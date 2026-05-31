import type { ChiosIslandPageData } from "@/content/chios-island";

type ChiosIslandPageProps = {
  data: ChiosIslandPageData;
};

export function ChiosIslandPage({ data }: ChiosIslandPageProps) {
  return (
    <main className="chios-island-page">
      <section className="ci-hero" aria-labelledby="ci-hero-title">
        <div className="ci-hero-media" aria-hidden="true">
          <img src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="ci-hero-overlay" />

        <div className="ci-wrap ci-hero-inner">
          <div className="ci-hero-card">
            <span className="ci-kicker ci-kicker--light">{data.hero.kicker}</span>

            <h1 id="ci-hero-title">{data.hero.title}</h1>

            <p>{data.hero.description}</p>

            <div className="ci-hero-actions">
              <a className="ci-btn ci-btn--primary" href={data.hero.primaryCta.href}>
                {data.hero.primaryCta.label}
              </a>

              <a className="ci-btn ci-btn--secondary" href={data.hero.secondaryCta.href}>
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="ci-section ci-section--intro" aria-labelledby="ci-intro-title">
        <div className="ci-wrap ci-intro-grid">
          <article className="ci-intro-copy">
            <span className="ci-kicker">Why visit Chios</span>
            <h2 id="ci-intro-title">{data.intro.title}</h2>

            {data.intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <aside className="ci-highlight-panel" aria-label="Chios island highlights">
            {data.intro.highlights.map((highlight) => (
              <div className="ci-highlight-item" key={highlight.label}>
                <span>{highlight.label}</span>
                <strong>{highlight.value}</strong>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="ci-section" id="discover" aria-labelledby="ci-experiences-title">
        <div className="ci-wrap">
          <header className="ci-section-head">
            <span className="ci-kicker">{data.experiences.kicker}</span>
            <h2 id="ci-experiences-title">{data.experiences.title}</h2>
            <p>{data.experiences.description}</p>
          </header>

          <div className="ci-experience-grid">
            {data.experiences.items.map((item) => (
              <article className="ci-experience-card" key={item.title}>
                <div className="ci-experience-image">
                  <img src={item.image} alt={item.imageAlt} loading="lazy" />
                </div>

                <div className="ci-experience-body">
                  <div className="ci-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  <a className="ci-card-link" href={item.href}>
                    {item.ctaLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ci-section ci-section--quiz" aria-labelledby="ci-quiz-title">
        <div className="ci-wrap">
          <article className="ci-quiz-card">
            <span className="ci-kicker ci-kicker--light">Chios quiz</span>
            <h2 id="ci-quiz-title">{data.quiz.title}</h2>
            <p>{data.quiz.text}</p>

            <a className="ci-btn ci-btn--secondary" href={data.quiz.href}>
              {data.quiz.ctaLabel}
            </a>
          </article>
        </div>
      </section>

      <section className="ci-section ci-section--stay" aria-labelledby="ci-stay-title">
        <div className="ci-wrap">
          <article className="ci-stay-card">
            <span className="ci-kicker">{data.stay.kicker}</span>
            <h2 id="ci-stay-title">{data.stay.title}</h2>
            <p>{data.stay.text}</p>

            <div className="ci-stay-actions">
              <a className="ci-btn ci-btn--primary" href={data.stay.primaryCta.href}>
                {data.stay.primaryCta.label}
              </a>

              <a className="ci-btn ci-btn--outline" href={data.stay.secondaryCta.href}>
                {data.stay.secondaryCta.label}
              </a>
            </div>
          </article>
        </div>
      </section>

      <div className="ci-mobile-sticky" aria-label="Quick actions">
        <a className="ci-btn ci-btn--whatsapp" href={data.sticky.whatsappHref}>
          💬 WhatsApp
        </a>

        <a className="ci-btn ci-btn--book" href={data.sticky.bookingHref}>
          🏨 Book now
        </a>
      </div>
    </main>
  );
}