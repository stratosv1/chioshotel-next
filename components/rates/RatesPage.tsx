import type { ReactNode } from "react";
import type { RatesPageData } from "@/content/rates";

type RatesPageProps = {
  data: RatesPageData;
};

function renderSeoParagraph(text: string, links: RatesPageData["seoCopy"]["links"]): ReactNode[] {
  const parts: ReactNode[] = [text];

  links.forEach((link) => {
    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];

      if (typeof part !== "string" || !part.includes(link.label)) {
        continue;
      }

      const split = part.split(link.label);

      parts.splice(
        index,
        1,
        split[0],
        <a href={link.href} key={`${link.href}-${index}`}>
          {link.label}
        </a>,
        split.slice(1).join(link.label),
      );

      break;
    }
  });

  return parts;
}

export function RatesPage({ data }: RatesPageProps) {
  return (
    <main className="rates-page">
      <section className="rates-hero" aria-labelledby="rates-hero-title">
        <div className="rates-hero-bg" aria-hidden="true">
          <img src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="rates-hero-overlay" />

        <div className="rates-wrap rates-hero-inner">
          <div className="rates-hero-content">
            <span className="rates-kicker rates-kicker--light">{data.hero.kicker}</span>
            <h1 id="rates-hero-title">{data.hero.title}</h1>
            <p>{data.hero.description}</p>
          </div>
        </div>
      </section>

      <section className="rates-section">
        <div className="rates-wrap rates-top-grid">
          <article className="rates-card rates-benefits-card">
            <span className="rates-badge">{data.benefits.kicker}</span>
            <h2>{data.benefits.title}</h2>
            <p>{data.benefits.text}</p>

            <div className="rates-benefits-list">
              {data.benefits.items.map((item) => (
                <div className="rates-benefit-item" key={item.title}>
                  <span aria-hidden="true">{item.icon}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rates-card rates-discount-card">
            <span className="rates-badge rates-badge--flash">⚡ {data.discount.kicker}</span>
            <h2>{data.discount.title}</h2>
            <p>{data.discount.text}</p>

            <div className="rates-discount-highlight">
              <div>
                <strong>{data.discount.value}</strong>
                <span>Exclusive direct booking code</span>
              </div>
              <div className="rates-discount-icon" aria-hidden="true">
                🎁
              </div>
            </div>

            <div className="rates-code-box" aria-label="Direct booking discount code">
              <span>Your discount code</span>
              <strong>{data.discount.code}</strong>
            </div>

            <p className="rates-note">{data.discount.note}</p>
          </article>
        </div>
      </section>

      <section
        className="rates-section rates-section--booking"
        aria-labelledby="rates-booking-title"
      >
        <div className="rates-wrap">
          <article className="rates-card rates-booking-card">
            <header className="rates-booking-head">
              <div>
                <span className="rates-badge">{data.booking.kicker}</span>
                <h2 id="rates-booking-title">{data.booking.title}</h2>
                <p>{data.booking.text}</p>
              </div>

              <a
                className="rates-open-booking"
                href={data.booking.fallbackHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open booking
              </a>
            </header>

            <div className="rates-iframe-shell">
              <iframe
                src={data.booking.iframeSrc}
                className="rates-booking-iframe"
                loading="lazy"
                title={data.booking.iframeTitle}
              />
            </div>

            <article className="rates-seo-copy">
              {data.seoCopy.paragraphs.map((paragraph) => (
                <p key={paragraph}>{renderSeoParagraph(paragraph, data.seoCopy.links)}</p>
              ))}
            </article>
          </article>
        </div>
      </section>
    </main>
  );
}