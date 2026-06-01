import type { ChiosIslandPageData } from "@/content/chios-island";

type ChiosIslandPageProps = {
  data: ChiosIslandPageData;
};

type ChiosIslandUiText = {
  introKicker: string;
  highlightsAriaLabel: string;
  quizKicker: string;
  quickActionsAriaLabel: string;
  whatsapp: string;
  bookNow: string;
};

const chiosIslandUiByLocale: Record<string, ChiosIslandUiText> = {
  en: {
    introKicker: "Why visit Chios",
    highlightsAriaLabel: "Chios island highlights",
    quizKicker: "Chios quiz",
    quickActionsAriaLabel: "Quick actions",
    whatsapp: "WhatsApp",
    bookNow: "Book now",
  },
  el: {
    introKicker: "Γιατί να επισκεφθείτε τη Χίο",
    highlightsAriaLabel: "Σημαντικά στοιχεία για τη Χίο",
    quizKicker: "Κουίζ για τη Χίο",
    quickActionsAriaLabel: "Γρήγορες ενέργειες",
    whatsapp: "WhatsApp",
    bookNow: "Κάντε κράτηση",
  },
  fr: {
    introKicker: "Pourquoi visiter Chios",
    highlightsAriaLabel: "Points forts de l’île de Chios",
    quizKicker: "Quiz sur Chios",
    quickActionsAriaLabel: "Actions rapides",
    whatsapp: "WhatsApp",
    bookNow: "Réserver",
  },
  de: {
    introKicker: "Warum Chios besuchen",
    highlightsAriaLabel: "Highlights der Insel Chios",
    quizKicker: "Chios-Quiz",
    quickActionsAriaLabel: "Schnellaktionen",
    whatsapp: "WhatsApp",
    bookNow: "Jetzt buchen",
  },
  it: {
    introKicker: "Perché visitare Chios",
    highlightsAriaLabel: "Punti salienti dell’isola di Chios",
    quizKicker: "Quiz su Chios",
    quickActionsAriaLabel: "Azioni rapide",
    whatsapp: "WhatsApp",
    bookNow: "Prenota ora",
  },
  es: {
    introKicker: "Por qué visitar Quíos",
    highlightsAriaLabel: "Aspectos destacados de la isla de Quíos",
    quizKicker: "Quiz sobre Quíos",
    quickActionsAriaLabel: "Acciones rápidas",
    whatsapp: "WhatsApp",
    bookNow: "Reservar ahora",
  },
  tr: {
    introKicker: "Sakız Adası neden ziyaret edilmeli",
    highlightsAriaLabel: "Sakız Adası öne çıkanlar",
    quizKicker: "Sakız Adası testi",
    quickActionsAriaLabel: "Hızlı işlemler",
    whatsapp: "WhatsApp",
    bookNow: "Şimdi rezervasyon yap",
  },
};

function getChiosIslandLocale(path: string) {
  const locale = path.split("/").filter(Boolean)[0];
  return locale && chiosIslandUiByLocale[locale] ? locale : "en";
}

export function ChiosIslandPage({ data }: ChiosIslandPageProps) {
  const ui = chiosIslandUiByLocale[getChiosIslandLocale(data.seo.canonicalPath)];

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
            <span className="ci-kicker">{ui.introKicker}</span>
            <h2 id="ci-intro-title">{data.intro.title}</h2>

            {data.intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <aside className="ci-highlight-panel" aria-label={ui.highlightsAriaLabel}>
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
            <span className="ci-kicker ci-kicker--light">{ui.quizKicker}</span>
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

      <div className="ci-mobile-sticky" aria-label={ui.quickActionsAriaLabel}>
        <a className="ci-btn ci-btn--whatsapp" href={data.sticky.whatsappHref}>
          💬 {ui.whatsapp}
        </a>

        <a className="ci-btn ci-btn--book" href={data.sticky.bookingHref}>
          🏨 {ui.bookNow}
        </a>
      </div>
    </main>
  );
}