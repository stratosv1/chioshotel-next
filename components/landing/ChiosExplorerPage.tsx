import Link from "next/link";
import type { ChiosExplorerPageContent } from "@/content/chios-explorer";

type ChiosExplorerPageProps = {
  data: ChiosExplorerPageContent;
};

export default function ChiosExplorerPage({ data }: ChiosExplorerPageProps) {
  return (
    <main className="chios-explorer-page">
      <section className="chios-explorer-hero">
        <div className="chios-explorer-hero__image-wrap">
          <img
            src={data.hero.image.src}
            alt={data.hero.image.alt}
            className="chios-explorer-hero__image"
          />
          <div className="chios-explorer-hero__overlay" />
        </div>

        <div className="chios-explorer-hero__content">
          <p className="chios-explorer-eyebrow">{data.hero.eyebrow}</p>
          <h1>{data.hero.title}</h1>
          <p>{data.hero.subtitle}</p>

          <div className="chios-explorer-actions">
            <Link className="chios-explorer-btn chios-explorer-btn--primary" href={data.links.booking}>
              {data.hero.primaryCta}
            </Link>
            <Link className="chios-explorer-btn chios-explorer-btn--secondary" href={data.links.rooms}>
              {data.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="chios-explorer-section chios-explorer-intro">
        <div className="chios-explorer-container chios-explorer-intro__grid">
          <div>
            <p className="chios-explorer-eyebrow">{data.intro.eyebrow}</p>
            <h2>{data.intro.title}</h2>
          </div>
          <p>{data.intro.text}</p>
        </div>
      </section>

      <section className="chios-explorer-section chios-explorer-highlights">
        <div className="chios-explorer-container">
          <div className="chios-explorer-section-head">
            <p className="chios-explorer-eyebrow">{data.highlights.eyebrow}</p>
            <h2>{data.highlights.title}</h2>
            <p>{data.highlights.text}</p>
          </div>

          <div className="chios-explorer-card-grid">
            {data.highlights.items.map((item) => (
              <Link className="chios-explorer-card" href={item.href} key={item.title}>
                <span className="chios-explorer-card__image-wrap">
                  <img src={item.image.src} alt={item.image.alt} className="chios-explorer-card__image" />
                </span>
                <span className="chios-explorer-card__body">
                  <span className="chios-explorer-card__title">{item.title}</span>
                  <span className="chios-explorer-card__text">{item.text}</span>
                  <span className="chios-explorer-card__link">Explore more</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="chios-explorer-section chios-explorer-story">
        <div className="chios-explorer-container">
          <div className="chios-explorer-section-head">
            <p className="chios-explorer-eyebrow">{data.story.eyebrow}</p>
            <h2>{data.story.title}</h2>
            <p>{data.story.text}</p>
          </div>

          <div className="chios-explorer-timeline">
            {data.story.steps.map((step, index) => (
              <div className="chios-explorer-timeline__item" key={step.title}>
                <div className="chios-explorer-timeline__marker">
                  <span>{index + 1}</span>
                </div>
                <div className="chios-explorer-timeline__content">
                  <p>{step.label}</p>
                  <h3>{step.title}</h3>
                  <span>{step.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="chios-explorer-section chios-explorer-stay">
        <div className="chios-explorer-container chios-explorer-stay__grid">
          <div>
            <p className="chios-explorer-eyebrow">{data.stay.eyebrow}</p>
            <h2>{data.stay.title}</h2>
            <p>{data.stay.text}</p>
          </div>

          <div className="chios-explorer-stay__panel">
            <h3>{data.finalCta.title}</h3>
            <p>{data.finalCta.text}</p>
            <div className="chios-explorer-actions">
              <Link className="chios-explorer-btn chios-explorer-btn--primary" href={data.links.booking}>
                {data.finalCta.primaryCta}
              </Link>
              <Link className="chios-explorer-btn chios-explorer-btn--secondary" href={data.links.chiosGuide}>
                {data.finalCta.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}