import Link from "next/link";
import type { FamilyTravelPageContent } from "@/content/family-travel";

type FamilyTravelPageProps = {
  data: FamilyTravelPageContent;
};

export default function FamilyTravelPage({ data }: FamilyTravelPageProps) {
  return (
    <main className="family-travel-page">
      <section className="family-travel-hero">
        <div className="family-travel-hero__media">
          <img src={data.hero.image.src} alt={data.hero.image.alt} />
        </div>

        <div className="family-travel-hero__content">
          <p className="family-travel-eyebrow">{data.hero.eyebrow}</p>
          <h1>{data.hero.title}</h1>
          <p className="family-travel-hero__subtitle">{data.hero.subtitle}</p>

          <div className="family-travel-actions">
            <Link className="family-travel-button family-travel-button--primary" href={data.hero.primaryCta.href}>
              {data.hero.primaryCta.label}
            </Link>
            <Link className="family-travel-button family-travel-button--secondary" href={data.hero.secondaryCta.href}>
              {data.hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="family-travel-intro">
        <div className="family-travel-container family-travel-container--narrow">
          <p className="family-travel-eyebrow">{data.intro.title}</p>
          <p>{data.intro.text}</p>
        </div>
      </section>

      <section className="family-travel-experiences">
        <div className="family-travel-container">
          <div className="family-travel-section-heading">
            <p className="family-travel-eyebrow">Family experiences</p>
            <h2>{data.cardsTitle}</h2>
            <p>{data.cardsIntro}</p>
          </div>

          <div className="family-travel-card-grid">
            {data.cards.map((card) => {
              const content = (
                <>
                  <div className="family-travel-card__image">
                    <img src={card.image.src} alt={card.image.alt} />
                  </div>
                  <div className="family-travel-card__body">
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                </>
              );

              if (card.href) {
                return (
                  <Link className="family-travel-card family-travel-card--link" href={card.href} key={card.title}>
                    {content}
                  </Link>
                );
              }

              return (
                <article className="family-travel-card" key={card.title}>
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="family-travel-day">
        <div className="family-travel-container">
          <div className="family-travel-section-heading family-travel-section-heading--center">
            <p className="family-travel-eyebrow">{data.familyDay.eyebrow}</p>
            <h2>{data.familyDay.title}</h2>
            <p>{data.familyDay.intro}</p>
          </div>

          <div className="family-travel-timeline">
            {data.familyDay.steps.map((step, index) => (
              <article className="family-travel-timeline__item" key={step.title}>
                <span className="family-travel-timeline__number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="family-travel-stay">
        <div className="family-travel-container family-travel-stay__grid">
          <div className="family-travel-stay__content">
            <p className="family-travel-eyebrow">{data.stay.eyebrow}</p>
            <h2>{data.stay.title}</h2>
            <p>{data.stay.text}</p>

            <div className="family-travel-actions">
              <Link className="family-travel-button family-travel-button--primary" href={data.stay.primaryCta.href}>
                {data.stay.primaryCta.label}
              </Link>
              <Link className="family-travel-button family-travel-button--secondary" href={data.stay.secondaryCta.href}>
                {data.stay.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="family-travel-stay__image">
            <img src={data.stay.image.src} alt={data.stay.image.alt} />
          </div>
        </div>
      </section>

      <section className="family-travel-final">
        <div className="family-travel-container family-travel-final__box">
          <h2>{data.finalCta.title}</h2>
          <p>{data.finalCta.text}</p>

          <div className="family-travel-actions family-travel-actions--center">
            <Link className="family-travel-button family-travel-button--primary" href={data.finalCta.primaryCta.href}>
              {data.finalCta.primaryCta.label}
            </Link>
            <Link className="family-travel-button family-travel-button--secondary family-travel-button--light" href={data.finalCta.secondaryCta.href}>
              {data.finalCta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}