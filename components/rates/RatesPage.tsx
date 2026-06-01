import type { ReactNode } from "react";
import type { RatesPageData } from "@/content/rates";

type RatesPageProps = {
  data: RatesPageData;
};

type RatesUiText = {
  directBookingCode: string;
  discountCodeAriaLabel: string;
  yourDiscountCode: string;
  openBooking: string;
};

const ratesUiByLocale: Record<string, RatesUiText> = {
  en: {
    directBookingCode: "Exclusive direct booking code",
    discountCodeAriaLabel: "Direct booking discount code",
    yourDiscountCode: "Your discount code",
    openBooking: "Open booking",
  },
  el: {
    directBookingCode: "Αποκλειστικός κωδικός απευθείας κράτησης",
    discountCodeAriaLabel: "Κωδικός έκπτωσης για απευθείας κράτηση",
    yourDiscountCode: "Ο κωδικός έκπτωσής σας",
    openBooking: "Άνοιγμα κράτησης",
  },
  fr: {
    directBookingCode: "Code exclusif pour réservation directe",
    discountCodeAriaLabel: "Code de réduction pour réservation directe",
    yourDiscountCode: "Votre code de réduction",
    openBooking: "Ouvrir la réservation",
  },
  de: {
    directBookingCode: "Exklusiver Code für Direktbuchungen",
    discountCodeAriaLabel: "Rabattcode für Direktbuchungen",
    yourDiscountCode: "Ihr Rabattcode",
    openBooking: "Buchung öffnen",
  },
  it: {
    directBookingCode: "Codice esclusivo per prenotazione diretta",
    discountCodeAriaLabel: "Codice sconto per prenotazione diretta",
    yourDiscountCode: "Il tuo codice sconto",
    openBooking: "Apri prenotazione",
  },
  es: {
    directBookingCode: "Código exclusivo para reserva directa",
    discountCodeAriaLabel: "Código de descuento para reserva directa",
    yourDiscountCode: "Tu código de descuento",
    openBooking: "Abrir reserva",
  },
  tr: {
    directBookingCode: "Doğrudan rezervasyon için özel kod",
    discountCodeAriaLabel: "Doğrudan rezervasyon indirim kodu",
    yourDiscountCode: "İndirim kodunuz",
    openBooking: "Rezervasyonu aç",
  },
};

function getRatesLocale(path: string) {
  const locale = path.split("/").filter(Boolean)[0];
  return locale && ratesUiByLocale[locale] ? locale : "en";
}

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
  const ui = ratesUiByLocale[getRatesLocale(data.seo.canonicalPath)];

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
                <span>{ui.directBookingCode}</span>
              </div>
              <div className="rates-discount-icon" aria-hidden="true">
                🎁
              </div>
            </div>

            <div className="rates-code-box" aria-label={ui.discountCodeAriaLabel}>
              <span>{ui.yourDiscountCode}</span>
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
                {ui.openBooking}
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