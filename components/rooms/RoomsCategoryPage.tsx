import Image from "next/image";
import { RoomWizard } from "@/components/rooms/RoomWizard";
import type { RoomsCategoryPageData } from "@/content/rooms";

type RoomsCategoryPageProps = {
  data: RoomsCategoryPageData;
};

function HtmlText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function getWizardLanguage(path: string) {
  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";

  return "en";
}

const heroActionStyle = {
  display: "flex",
  flexWrap: "nowrap",
  gap: 10,
  width: "100%",
} as const;

const heroButtonStyle = {
  flex: "1 1 0",
  width: "auto",
  minWidth: 0,
  paddingInline: 10,
  textAlign: "center",
  whiteSpace: "nowrap",
  letterSpacing: "0.08em",
  fontSize: "clamp(10px, 2.7vw, 12px)",
} as const;

export function RoomsCategoryPage({ data }: RoomsCategoryPageProps) {
  return (
    <main className="rooms-page">
      <section className="rooms-hero" aria-labelledby="rooms-hero-title">
        <div className="rooms-hero__inner">
          <div className="rooms-hero__content">
            <span className="rooms-kicker">{data.hero.kicker}</span>

            <h1 id="rooms-hero-title">
              {data.hero.title} <span>{data.hero.highlightedTitle}</span>
            </h1>

            <p>{data.hero.description}</p>

            <div className="rooms-hero__actions" style={heroActionStyle}>
              <a
                className="rooms-btn rooms-btn--primary"
                href={data.hero.primaryCta.href}
                style={heroButtonStyle}
              >
                {data.hero.primaryCta.label}
              </a>

              <a
                className="rooms-btn rooms-btn--secondary"
                href={data.hero.secondaryCta.href}
                style={heroButtonStyle}
              >
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="v-master-wrapper"
        aria-labelledby="rooms-category-title"
      >
        <header className="v-page-header">
          <span className="rooms-kicker">{data.hero.kicker}</span>

          <h2 id="rooms-category-title">{data.intro.title}</h2>

          <p>{data.intro.description}</p>
        </header>

        <div className="v-rooms-grid" id="rooms-list">
          {data.cards.map((card) => (
            <a href={card.href} className="v-category-card" key={card.id}>
              <div className="v-cat-img">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  width={640}
                  height={420}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <span className="v-card-badge">{card.badge}</span>
              </div>

              <div className="v-card-meta">
                {card.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <h3>{card.title}</h3>

              <p className="v-card-subtitle">{card.subtitle}</p>

              <p>{card.description}</p>

              <div className="v-btn-link">{card.ctaLabel} →</div>
            </a>
          ))}
        </div>

        <div className="v-tip-bar">
          <div className="v-tip-bulb">{data.tip.icon}</div>

          <div className="v-tip-content">
            <h4>{data.tip.title}</h4>
            <p>
              <HtmlText html={data.tip.textHtml} />
            </p>
          </div>
        </div>

        <div className="v-wizard-intro">
          <span className="rooms-kicker">{data.hero.kicker}</span>
          <h2>{data.wizardIntro.title}</h2>
          <p>{data.wizardIntro.description}</p>
        </div>

        <RoomWizard
          rooms={data.wizard.rooms}
          whatsappPhone={data.wizard.whatsappPhone}
          language={getWizardLanguage(data.seo.canonicalPath)}
        />
      </section>
    </main>
  );
}
