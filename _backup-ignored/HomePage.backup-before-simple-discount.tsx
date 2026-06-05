"use client";

import { useEffect, useRef, useState } from "react";
import type { HomePageData } from "@/content/home";
import { LastMinuteDeals } from "@/components/home/LastMinuteDeals";

type HomePageProps = {
  data: HomePageData;
};

function HtmlText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function HomePage({ data }: HomePageProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const reviewsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!reviewsRef.current) {
      return;
    }

    reviewsRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = data.reviews.trustindexLoaderUrl;
    script.async = true;
    script.defer = true;

    reviewsRef.current.appendChild(script);
  }, [data.reviews.trustindexLoaderUrl]);

  function loadMap() {
    setIsMapLoaded(true);
  }

  return (
    <>
      <main className="vh-homepage">
        <section className="hero" aria-label="Rooms and apartments in Chios, Kampos">
          <div className="hero-media" aria-hidden="true">
            <picture>
              <img
                src={data.hero.image}
                alt={data.hero.imageAlt}
                width={1200}
                height={675}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>

          <div className="hero-inner">
            <div className="hero-content-box">
              <div
                className="rating-card"
                aria-label={`Guest rating ${data.hero.rating} from ${data.hero.reviews}`}
              >
                <div>
                  <strong>{data.hero.rating}</strong>
                  <span>{data.hero.reviews}</span>
                </div>
                <div className="stars" aria-hidden="true">
                  ★★★★★
                </div>
              </div>

              <div className="hero-kicker">{data.hero.kicker}</div>

              <h1 className="hero-title">{data.hero.title}</h1>

              <p className="hero-description">
                <HtmlText html={data.hero.descriptionHtml} />
              </p>

              <div className="hero-actions">
                <a className="btn-primary" href={data.hero.primaryCta.href}>
                  <span aria-hidden="true">{data.hero.primaryCta.icon}</span>{" "}
                  {data.hero.primaryCta.label}
                </a>

                <a className="btn-ghost" href={data.hero.secondaryCta.href}>
                  <span aria-hidden="true">{data.hero.secondaryCta.icon}</span>{" "}
                  {data.hero.secondaryCta.label}
                </a>
              </div>

              <a className="hero-quiz-card" href={data.hero.quizCard.href}>
                <span className="hero-quiz-icon" aria-hidden="true">
                  {data.hero.quizCard.icon}
                </span>

                <span className="hero-quiz-copy">
                  <span className="hero-quiz-live">{data.hero.quizCard.liveLabel}</span>
                  <strong>{data.hero.quizCard.title}</strong>
                  <span>{data.hero.quizCard.text}</span>
                </span>

                <span className="hero-quiz-link">{data.hero.quizCard.cta}</span>
              </a>
            </div>
          </div>
        </section>

        <a href={data.announceBar.href} className="vh-hero-announce">
          <span className="vh-hero-announce-icon" aria-hidden="true">
            {data.announceBar.icon}
          </span>
          <span className="vh-hero-announce-text">
            {data.announceBar.text} <strong>{data.announceBar.strongText}</strong>
          </span>
          <span className="vh-hero-announce-arrow" aria-hidden="true">
            β†“
          </span>
        </a>

        <section className="vh-section vh-section--tight" aria-labelledby="vh-intro-title">
          <div className="vh-wrap">
            <div className="vh-intro-grid">
              <article className="vh-panel">
                <span className="vh-kicker">{data.intro.left.kicker}</span>

                <h2 id="vh-intro-title">
                  <span aria-hidden="true" style={{ marginRight: 8 }}>
                    {data.intro.left.icon}
                  </span>
                  {data.intro.left.title}
                </h2>

                <p>
                  <HtmlText html={data.intro.left.bodyHtml} />
                </p>

                <div className="vh-pill-row" aria-label="Key features">
                  {data.intro.left.pills.map((pill) => (
                    <span className="vh-pill" key={pill}>
                      {pill}
                    </span>
                  ))}
                </div>
              </article>

              <article className="vh-panel">
                <span className="vh-kicker">{data.intro.right.kicker}</span>

                <h3>{data.intro.right.title}</h3>

                <div className="vh-unique-grid">
                  {data.intro.right.cards.map((card) => (
                    <div className="vh-unique-card" key={card.title}>
                      <strong>{card.title}</strong>
                      <span>{card.text}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="vh-section vh-section--tight" aria-labelledby="vh-bento-title">
          <div className="vh-wrap">
            <header className="vh-section-head" style={{ textAlign: "center" }}>
              <span className="vh-kicker">{data.location.kicker}</span>
              <h2 className="vh-title" id="vh-bento-title">
                <span aria-hidden="true" style={{ marginRight: 8 }}>
                  {data.location.icon}
                </span>
                {data.location.title}
              </h2>
              <p className="vh-subtitle" style={{ margin: "0 auto" }}>
                {data.location.subtitle}
              </p>
            </header>

            <div className="bento">
              <article className="b-card b7">
                <div
                  className={`map-preview ${isMapLoaded ? "is-hidden" : ""}`}
                  id="mapPreview"
                  role="button"
                  tabIndex={0}
                  aria-controls="mapIframe"
                  aria-label="Show interactive map"
                  onClick={loadMap}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      loadMap();
                    }
                  }}
                >
                  <button
                    className="vh-btn vh-btn--primary"
                    id="mapLoadBtn"
                    type="button"
                    onClick={loadMap}
                  >
                    <span aria-hidden="true">π“</span> {data.location.map.buttonLabel}
                  </button>
                </div>

                <iframe
                  id="mapIframe"
                  className={`map-iframe ${isMapLoaded ? "is-visible" : ""}`}
                  title="Voulamandis House location map"
                  src={isMapLoaded ? data.location.map.iframeSrc : undefined}
                  loading="lazy"
                  allowFullScreen
                />

                <div className="distance-badge">
                  {data.location.distances.map((distance) => (
                    <div key={distance.label}>
                      <span>{distance.label}</span>
                      <strong>{distance.value}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="b-card b5 b-pad">
                <div className="vh-kicker">{data.location.infoCard.kicker}</div>

                <h3
                  style={{
                    fontFamily: "Georgia,serif",
                    fontSize: 26,
                    color: "#8E6607",
                    margin: "10px 0",
                    fontWeight: 700,
                  }}
                >
                  {data.location.infoCard.title}
                </h3>

                <address
                  style={{
                    fontStyle: "normal",
                    fontSize: 15,
                    color: "var(--vh-muted)",
                    lineHeight: 1.8,
                  }}
                >
                  π“ {data.location.infoCard.addressLines[0]}
                  <br />
                  {data.location.infoCard.addressLines[1]}
                  <br />
                  π“ {data.location.infoCard.phoneLabel}{" "}
                  <a
                    href={data.location.infoCard.phoneHref}
                    style={{ color: "#8E6607", fontWeight: 700 }}
                  >
                    {data.location.infoCard.phone}
                  </a>
                  <br />
                  β‰οΈ {data.location.infoCard.emailLabel}{" "}
                  <a
                    href={data.location.infoCard.emailHref}
                    style={{ color: "#8E6607", fontWeight: 700 }}
                  >
                    {data.location.infoCard.email}
                  </a>
                </address>

                <p
                  style={{
                    margin: "18px 0 0",
                    color: "var(--vh-muted)",
                    fontSize: 15,
                    lineHeight: 1.75,
                  }}
                >
                  {data.location.infoCard.text}
                </p>

                <div className="vh-btn-row" style={{ marginTop: 20 }}>
                  <a className="vh-btn vh-btn--primary" href={data.location.infoCard.cta.href}>
                    <span aria-hidden="true">{data.location.infoCard.cta.icon}</span>{" "}
                    {data.location.infoCard.cta.label}
                  </a>
                </div>
              </article>

              <article className="b-card b12 b-pad discount-box">
                <span className="discount-badge">{data.location.discount.badge}</span>

                <h3
                  style={{
                    margin: "14px 0 10px",
                    fontFamily: "Georgia,serif",
                    fontSize: 28,
                    color: "#8E6607",
                    lineHeight: 1.1,
                    fontWeight: 700,
                  }}
                >
                  {data.location.discount.title}
                </h3>

                <p
                  style={{
                    fontSize: 15,
                    color: "var(--vh-muted)",
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {data.location.discount.text}
                </p>

                <ul className="vh-check-list">
                  {data.location.discount.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>

                <div
                  style={{
                    marginTop: 20,
                    borderTop: "1px solid rgba(142,102,7,.1)",
                    paddingTop: 15,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--vh-dark)" }}>
                    {data.location.discount.formIntro}
                  </p>

                  <form id="discountCodeForm" noValidate>
                    <input type="hidden" name="lang" value="en" />

                    <label className="sr-only" htmlFor="dc_email">
                      Your email
                    </label>

                    <div className="vh-honeypot" aria-hidden="true">
                      <label htmlFor="dc_honeypot">Do not fill this field</label>
                      <input
                        type="text"
                        id="dc_honeypot"
                        name="honeypot"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="form-row">
                      <input
                        type="email"
                        id="dc_email"
                        name="email"
                        placeholder={data.location.discount.emailPlaceholder}
                        required
                        className="email-input"
                        inputMode="email"
                        autoComplete="email"
                        aria-label="Your email"
                      />

                      <button type="submit" className="vh-btn vh-btn--primary" id="dc_submitBtn">
                        <span aria-hidden="true">β‰οΈ</span> {data.location.discount.submitLabel}
                      </button>
                    </div>

                    <div className="discount-consent">
                      <label>
                        <input type="checkbox" id="dc_gdpr" required />{" "}
                        {data.location.discount.consent}
                      </label>
                    </div>

                    <div id="discountSuccess" className="discount-success" aria-live="polite">
                      <div id="discountSuccessText">{data.location.discount.successText}</div>
                      <div id="discountCodeValue" className="discount-code-value">
                        {data.location.discount.defaultCode}
                      </div>
                    </div>

                    <div id="discountFeedback" className="discount-error" aria-live="polite" />
                  </form>
                </div>
              </article>
            </div>

            <div className="vh-location-copy">
              <span className="vh-kicker">{data.location.copy.kicker}</span>

              <h2 className="vh-title" style={{ fontSize: "clamp(28px,3vw,44px)", marginBottom: 18 }}>
                {data.location.copy.title}
              </h2>

              {data.location.copy.paragraphsHtml.map((paragraph) => (
                <p key={paragraph}>
                  <HtmlText html={paragraph} />
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="vh-section vh-section--tight" aria-labelledby="vh-rooms-title">
          <div className="vh-wrap">
            <div className="vh-split-highlight">
              <article className="vh-highlight-card">
                <span className="vh-kicker">{data.roomsPreview.kicker}</span>

                <h2
                  className="vh-title"
                  id="vh-rooms-title"
                  style={{ fontSize: "clamp(30px,3.6vw,48px)" }}
                >
                  <span aria-hidden="true" style={{ marginRight: 8 }}>
                    {data.roomsPreview.icon}
                  </span>
                  {data.roomsPreview.title}
                </h2>

                <p>{data.roomsPreview.text}</p>

                <div className="vh-btn-row">
                  <a className="vh-btn vh-btn--primary" href={data.roomsPreview.primaryCta.href}>
                    <span aria-hidden="true">{data.roomsPreview.primaryCta.icon}</span>{" "}
                    {data.roomsPreview.primaryCta.label}
                  </a>

                  <a className="vh-btn vh-btn--secondary" href={data.roomsPreview.secondaryCta.href}>
                    <span aria-hidden="true">{data.roomsPreview.secondaryCta.icon}</span>{" "}
                    {data.roomsPreview.secondaryCta.label}
                  </a>
                </div>
              </article>

              <article className="vh-highlight-card">
                <span className="vh-kicker">{data.roomsPreview.sideCard.kicker}</span>
                <h3>{data.roomsPreview.sideCard.title}</h3>
                <p>{data.roomsPreview.sideCard.text}</p>
              </article>
            </div>

            <div className="vh-room-grid">
              {data.roomsPreview.rooms.map((room) => (
                <a className="vh-room-card" href={room.href} key={room.id}>
                  <div className={`vh-room-image ${room.imageClass}`} aria-hidden="true">
                    <div className="room-offer-stack">
                      <span className="room-live-badge">{room.liveBadge}</span>
                      <span className="room-direct-badge">{room.directBadge}</span>
                    </div>
                    <span className="room-bed-badge">{room.bedBadge}</span>
                  </div>

                  <div className="vh-room-body">
                    <h3>{room.title}</h3>
                    <p>{room.description}</p>

                    <div className="vh-room-meta">
                      {room.meta.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>

                    <div className="vh-room-amenities">
                      {room.amenities.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>

                    <span className="vh-btn vh-btn--secondary">
                      <span aria-hidden="true">π”</span> {room.cta}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <LastMinuteDeals data={data.lastMinute} />

        <section className="vh-section vh-section--tight" aria-labelledby="vh-reviews-title">
          <div className="vh-wrap">
            <div className="vh-reviews-shell">
              <span className="vh-kicker">{data.reviews.kicker}</span>
              <h2 className="vh-title" id="vh-reviews-title">
                <span aria-hidden="true" style={{ marginRight: 8 }}>
                  {data.reviews.icon}
                </span>
                {data.reviews.title}
              </h2>

              <div
                ref={reviewsRef}
                className="vh-reviews-widget"
                style={{ textAlign: "center" }}
              />
            </div>
          </div>
        </section>

        <section className="vh-section vh-section--tight" aria-labelledby="vh-amenities-title">
          <div className="vh-wrap">
            <header className="vh-section-head">
              <span className="vh-kicker">{data.amenities.kicker}</span>
              <h2 className="vh-title" id="vh-amenities-title">
                <span aria-hidden="true" style={{ marginRight: 8 }}>
                  {data.amenities.icon}
                </span>
                {data.amenities.title}
              </h2>
            </header>

            <div className="vh-amenities-grid">
              {data.amenities.items.map((item) => (
                <div className="vh-amenity" key={item.label}>
                  <div className="vh-amenity-icon">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="vh-section vh-section--tight vh-traveler-section"
          aria-labelledby="vh-traveler-title"
        >
          <div className="vh-wrap">
            <header className="vh-section-head" style={{ textAlign: "center" }}>
              <span className="vh-kicker">{data.traveler.kicker}</span>
              <h2 className="vh-title" id="vh-traveler-title">
                <span aria-hidden="true" style={{ marginRight: 8 }}>
                  {data.traveler.icon}
                </span>
                {data.traveler.title}
              </h2>
              <p className="vh-subtitle" style={{ margin: "0 auto", maxWidth: 780 }}>
                {data.traveler.subtitle}
              </p>
            </header>

            <div className="vh-traveler-grid">
              {data.traveler.cards.map((card) => (
                <a
                  href={card.href}
                  className={`vh-traveler-card ${card.className}`}
                  key={card.id}
                >
                  <div className="vh-traveler-overlay" />
                  <div className="vh-traveler-content">
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                    <span className="vh-traveler-link">{card.cta}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="vh-section" aria-labelledby="vh-explore-more-title">
          <div className="vh-wrap">
            <header className="vh-section-head">
              <span className="vh-kicker">{data.chiosGuide.kicker}</span>

              <h2 className="vh-title" id="vh-explore-more-title">
                <span aria-hidden="true" style={{ marginRight: 8 }}>
                  {data.chiosGuide.icon}
                </span>
                {data.chiosGuide.title}
              </h2>

              <p className="vh-subtitle">{data.chiosGuide.subtitle}</p>
            </header>

            <div className="vh-link-grid">
              {data.chiosGuide.cards.map((card) => (
                <a className="vh-link-card" href={card.href} key={card.id}>
                  <div className={`vh-link-image ${card.imageClass}`} aria-hidden="true" />
                  <div className="vh-link-body">
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                    <span className="vh-btn vh-btn--secondary">
                      <span aria-hidden="true">{card.ctaIcon}</span> {card.ctaLabel}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="premium-seo-bar" aria-label="Discover more about Chios">
          <div className="bar-inner">
            <div className="text-wrap">
              <span className="premium-label">{data.quizBar.label}</span>
              <p className="premium-text">{data.quizBar.text}</p>
            </div>

            <div className="cta-wrap">
              <a href={data.quizBar.href} className="premium-btn-quiz">
                {data.quizBar.cta}
              </a>
            </div>
          </div>
        </section>

        <section className="vh-section vh-section--tight" aria-labelledby="vh-faq-title">
          <div className="vh-wrap">
            <header className="vh-section-head" style={{ textAlign: "center" }}>
              <span className="vh-kicker">{data.faq.kicker}</span>

              <h2 className="vh-title" id="vh-faq-title">
                <span aria-hidden="true" style={{ marginRight: 8 }}>
                  {data.faq.icon}
                </span>
                {data.faq.title}
              </h2>
            </header>

            <div className="vh-faq-grid">
              {data.faq.items.map((item) => (
                <details className="vh-faq-item" key={item.question}>
                  <summary>{item.question}</summary>
                  <div className="vh-faq-answer">
                    <HtmlText html={item.answerHtml} />
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="vh-final" aria-labelledby="vh-final-title">
          <div className="vh-wrap">
            <div className="vh-final-shell">
              <span className="vh-kicker" style={{ color: "#f0ddca" }}>
                {data.finalCta.kicker}
              </span>

              <h2 id="vh-final-title">
                <span aria-hidden="true" style={{ marginRight: 8 }}>
                  {data.finalCta.icon}
                </span>
                {data.finalCta.title}
              </h2>

              <p>{data.finalCta.text}</p>

              <div className="vh-btn-row">
                <a className="vh-btn vh-btn--primary" href={data.finalCta.primaryCta.href}>
                  <span aria-hidden="true">{data.finalCta.primaryCta.icon}</span>{" "}
                  {data.finalCta.primaryCta.label}
                </a>

                <a className="vh-btn vh-btn--secondary" href={data.finalCta.secondaryCta.href}>
                  <span aria-hidden="true">{data.finalCta.secondaryCta.icon}</span>{" "}
                  {data.finalCta.secondaryCta.label}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="vh-mobile-sticky" aria-label="Quick communication actions">
        <div className="vh-mobile-sticky__inner">
          <a className="vh-btn vh-btn--secondary" href={data.mobileSticky.call.href}>
            {data.mobileSticky.call.label}
          </a>

          <a className="vh-btn vh-btn--primary" href={data.mobileSticky.viber.href}>
            {data.mobileSticky.viber.label}
          </a>
        </div>
      </div>
    </>
  );
}



