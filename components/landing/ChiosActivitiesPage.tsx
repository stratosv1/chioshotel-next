import Link from "next/link";
import type { ChiosActivitiesPageData } from "@/content/chios-activities";

type ChiosActivitiesPageProps = {
  data: ChiosActivitiesPageData;
};

export default function ChiosActivitiesPage({ data }: ChiosActivitiesPageProps) {
  const isHub = data.key === "hub";

  return (
    <main className="chios-activities-page">
      <section className="chios-activities-hero">
        <div className="chios-activities-hero__content">
          <p className="chios-activities-eyebrow">{data.hero.eyebrow}</p>
          <h1>{data.hero.title}</h1>
          <p className="chios-activities-hero__subtitle">{data.hero.subtitle}</p>

          <div className="chios-activities-hero__actions">
            <Link className="chios-activities-button" href={data.cta.primaryHref}>
              {data.cta.primaryLabel}
            </Link>

            {data.cta.secondaryHref && data.cta.secondaryLabel ? (
              <Link
                className="chios-activities-button chios-activities-button--ghost"
                href={data.cta.secondaryHref}
              >
                {data.cta.secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>

        {data.hero.image ? (
          <div className="chios-activities-hero__image-wrap">
            <img
              className="chios-activities-hero__image"
              src={data.hero.image}
              alt={data.hero.imageAlt || data.hero.title}
            />
          </div>
        ) : null}
      </section>

      {data.intro ? (
        <section className="chios-activities-section chios-activities-intro">
          <div className="chios-activities-container chios-activities-container--narrow">
            <h2>{data.intro.title}</h2>
            {data.intro.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      {isHub && data.cards ? (
        <section className="chios-activities-section">
          <div className="chios-activities-container">
            <div className="chios-activities-section-heading">
              <p className="chios-activities-eyebrow">Activities in Chios</p>
              <h2>{data.hero.title}</h2>
              <p>
                Explore local traditions, nature, wellness, culture, and seasonal
                experiences recommended by Voulamandis House.
              </p>
            </div>

            <div className="chios-activities-grid">
              {data.cards.map((card) => (
                <article className="chios-activities-card" key={card.key}>
                  <Link href={card.href} className="chios-activities-card__image-link">
                    <img
                      className="chios-activities-card__image"
                      src={card.image}
                      alt={card.imageAlt}
                    />
                  </Link>

                  <div className="chios-activities-card__body">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <Link className="chios-activities-card__link" href={card.href}>
                      {card.buttonLabel}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {data.sections?.length ? (
        <section className="chios-activities-section">
          <div className="chios-activities-container chios-activities-container--narrow">
            <div className="chios-activities-content-stack">
              {data.sections.map((section) => (
                <section className="chios-activities-text-block" key={section.title}>
                  <h2>{section.title}</h2>
                  {section.text.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {data.gallery?.length ? (
        <section className="chios-activities-section chios-activities-gallery-section">
          <div className="chios-activities-container">
            <div className="chios-activities-section-heading">
              <p className="chios-activities-eyebrow">Gallery</p>
              <h2>Moments from this experience</h2>
            </div>

            <div className="chios-activities-gallery">
              {data.gallery.map((image) => (
                <figure className="chios-activities-gallery__item" key={image.src}>
                  <img src={image.src} alt={image.alt} />
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="chios-activities-section chios-activities-final-cta">
        <div className="chios-activities-container chios-activities-final-cta__inner">
          <div className="chios-activities-final-cta__copy">
            <p className="chios-activities-eyebrow">Voulamandis House</p>
            <h2>{data.cta.title}</h2>
            <p>{data.cta.text}</p>

            <div className="chios-activities-final-cta__actions">
              <Link className="chios-activities-button" href={data.cta.primaryHref}>
                {data.cta.primaryLabel}
              </Link>

              {data.cta.secondaryHref && data.cta.secondaryLabel ? (
                <Link
                  className="chios-activities-button chios-activities-button--light"
                  href={data.cta.secondaryHref}
                >
                  {data.cta.secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="chios-activities-final-cta__image-wrap">
            <img
              src="/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp"
              alt="Voulamandis House in Kampos Chios"
              className="chios-activities-final-cta__image"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

