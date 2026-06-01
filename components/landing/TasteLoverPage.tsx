import Link from "next/link";
import type { TasteLoverPageContent } from "@/content/taste-lover";

type TasteLoverPageProps = {
  data: TasteLoverPageContent;
};

export default function TasteLoverPage({ data }: TasteLoverPageProps) {
  return (
    <main className="taste-lover-page">
      <section className="taste-lover-hero">
        <div className="taste-lover-hero__media">
          <img src={data.hero.image.src} alt={data.hero.image.alt} />
          <div className="taste-lover-hero__overlay" />
        </div>

        <div className="taste-lover-container taste-lover-hero__content">
          <p className="taste-lover-eyebrow">{data.hero.eyebrow}</p>
          <h1>{data.hero.title}</h1>
          <p className="taste-lover-hero__subtitle">{data.hero.subtitle}</p>

          <div className="taste-lover-actions">
            <Link className="taste-lover-button taste-lover-button--primary" href={data.links.booking}>
              {data.hero.primaryCta}
            </Link>
            <Link className="taste-lover-button taste-lover-button--secondary" href={data.links.rooms}>
              {data.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="taste-lover-section taste-lover-intro">
        <div className="taste-lover-container taste-lover-intro__grid">
          <div>
            <p className="taste-lover-kicker">{data.hero.eyebrow}</p>
            <h2>{data.intro.title}</h2>
          </div>
          <p>{data.intro.text}</p>
        </div>
      </section>

      <section className="taste-lover-section">
        <div className="taste-lover-container">
          <div className="taste-lover-section-heading">
            <p className="taste-lover-kicker">{data.hero.eyebrow}</p>
            <h2>{data.highlights.title}</h2>
            <p>{data.highlights.subtitle}</p>
          </div>

          <div className="taste-lover-card-grid">
            {data.highlights.cards.map((card) => (
              <article className="taste-lover-card" key={card.title}>
                <img src={card.image.src} alt={card.image.alt} />
                <div className="taste-lover-card__body">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="taste-lover-section taste-lover-section--warm">
        <div className="taste-lover-container">
          <div className="taste-lover-section-heading">
            <p className="taste-lover-kicker">{data.hero.eyebrow}</p>
            <h2>{data.experiences.title}</h2>
            <p>{data.experiences.subtitle}</p>
          </div>

          <div className="taste-lover-experience-grid">
            {data.experiences.cards.map((card) => (
              <article className="taste-lover-experience" key={card.title}>
                <div className="taste-lover-experience__image">
                  <img src={card.image.src} alt={card.image.alt} />
                </div>
                <div className="taste-lover-experience__content">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="taste-lover-section taste-lover-day">
        <div className="taste-lover-container">
          <div className="taste-lover-section-heading">
            <p className="taste-lover-kicker">{data.hero.eyebrow}</p>
            <h2>{data.day.title}</h2>
            <p>{data.day.subtitle}</p>
          </div>

          <div className="taste-lover-timeline">
            {data.day.steps.map((step) => (
              <article className="taste-lover-timeline__item" key={`${step.time}-${step.title}`}>
                <div className="taste-lover-timeline__time">{step.time}</div>
                <div className="taste-lover-timeline__content">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="taste-lover-section taste-lover-stay">
        <div className="taste-lover-container taste-lover-stay__grid">
          <div>
            <p className="taste-lover-kicker">Voulamandis House</p>
            <h2>{data.stay.title}</h2>
            <p>{data.stay.text}</p>
          </div>

          <div className="taste-lover-stay__panel">
            <h3>{data.finalCta.title}</h3>
            <p>{data.finalCta.text}</p>
            <div className="taste-lover-actions">
              <Link className="taste-lover-button taste-lover-button--primary" href={data.links.booking}>
                {data.finalCta.primaryCta}
              </Link>
              <Link className="taste-lover-button taste-lover-button--light" href={data.links.rooms}>
                {data.finalCta.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}