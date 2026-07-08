import Link from "next/link";
import type { ChiosActivitiesPageData } from "@/content/chios-activities";

type ChiosActivitiesPageProps = {
  data: ChiosActivitiesPageData;
};

const activitiesUiCopy = {
  en: {
    cardsKicker: "Activities in Chios",
    cardsText:
      "Explore local traditions, nature, wellness, culture, and seasonal experiences recommended by Voulamandis House.",
    cardBadge: "Chios activity",
    swipeHint: "Swipe to explore more activities",
    galleryKicker: "Gallery",
    galleryTitle: "Moments from this experience",
    finalKicker: "Voulamandis House",
  },
  el: {
    cardsKicker: "Δραστηριότητες στη Χίο",
    cardsText:
      "Ανακαλύψτε τοπικές παραδόσεις, φύση, ευεξία, πολιτισμό και εποχικές εμπειρίες που προτείνει το Voulamandis House.",
    cardBadge: "Δραστηριότητα Χίου",
    swipeHint: "Σύρετε για περισσότερες δραστηριότητες",
    galleryKicker: "Gallery",
    galleryTitle: "Στιγμές από αυτή την εμπειρία",
    finalKicker: "Voulamandis House",
  },
  fr: {
    cardsKicker: "Activités à Chios",
    cardsText:
      "Explorez les traditions locales, la nature, le bien-être, la culture et les expériences saisonnières recommandées par Voulamandis House.",
    cardBadge: "Activité à Chios",
    swipeHint: "Faites glisser pour voir plus d’activités",
    galleryKicker: "Galerie",
    galleryTitle: "Moments de cette expérience",
    finalKicker: "Voulamandis House",
  },
  de: {
    cardsKicker: "Aktivitäten auf Chios",
    cardsText:
      "Entdecken Sie lokale Traditionen, Natur, Wellness, Kultur und saisonale Erlebnisse, empfohlen von Voulamandis House.",
    cardBadge: "Chios-Aktivität",
    swipeHint: "Wischen Sie für weitere Aktivitäten",
    galleryKicker: "Galerie",
    galleryTitle: "Momente aus diesem Erlebnis",
    finalKicker: "Voulamandis House",
  },
  it: {
    cardsKicker: "Attività a Chios",
    cardsText:
      "Scopri tradizioni locali, natura, benessere, cultura ed esperienze stagionali consigliate da Voulamandis House.",
    cardBadge: "Attività a Chios",
    swipeHint: "Scorri per altre attività",
    galleryKicker: "Galleria",
    galleryTitle: "Momenti di questa esperienza",
    finalKicker: "Voulamandis House",
  },
  es: {
    cardsKicker: "Actividades en Chios",
    cardsText:
      "Explora tradiciones locales, naturaleza, bienestar, cultura y experiencias de temporada recomendadas por Voulamandis House.",
    cardBadge: "Actividad en Chios",
    swipeHint: "Desliza para ver más actividades",
    galleryKicker: "Galería",
    galleryTitle: "Momentos de esta experiencia",
    finalKicker: "Voulamandis House",
  },
  tr: {
    cardsKicker: "Sakız Adası aktiviteleri",
    cardsText:
      "Voulamandis House’un önerdiği yerel gelenekleri, doğayı, sağlığı, kültürü ve sezonluk deneyimleri keşfedin.",
    cardBadge: "Sakız aktivitesi",
    swipeHint: "Daha fazla aktivite için kaydırın",
    galleryKicker: "Galeri",
    galleryTitle: "Bu deneyimden anlar",
    finalKicker: "Voulamandis House",
  },
} as const;

export default function ChiosActivitiesPage({ data }: ChiosActivitiesPageProps) {
  const isHub = data.key === "hub";
  const copy = activitiesUiCopy[data.locale] ?? activitiesUiCopy.en;

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
              <p className="chios-activities-eyebrow">{copy.cardsKicker}</p>
              <h2>{data.hero.title}</h2>
              <p>{copy.cardsText}</p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#8e6607] shadow-sm ring-1 ring-[#8e6607]/10 md:hidden">
                {copy.swipeHint} <span aria-hidden="true">→</span>
              </p>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-[38%] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#2f261f]/95 text-xl font-black text-white shadow-xl md:hidden"
              >
                →
              </div>
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-3">
                {data.cards.map((card, index) => (
                  <Link
                    className="group w-[84vw] max-w-[380px] flex-none snap-start overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 transition hover:shadow-xl md:w-auto md:max-w-none md:rounded-[2rem]"
                    href={card.href}
                    key={card.key}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        src={card.image}
                        alt={card.imageAlt}
                        loading={index < 2 ? "eager" : "lazy"}
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-amber-700 px-3 py-1.5 text-xs font-black text-white">
                        {copy.cardBadge}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="break-words font-serif text-2xl font-bold leading-tight text-amber-800">
                        {card.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-600">
                        {card.description}
                      </p>
                      <span className="mt-5 inline-flex rounded-full border border-amber-800/20 px-4 py-2 text-xs font-black uppercase text-amber-800">
                        {card.buttonLabel}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
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
              <p className="chios-activities-eyebrow">{copy.galleryKicker}</p>
              <h2>{copy.galleryTitle}</h2>
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
            <p className="chios-activities-eyebrow">{copy.finalKicker}</p>
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
