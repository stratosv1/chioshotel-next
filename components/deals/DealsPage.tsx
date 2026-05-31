"use client";

import { useEffect, useMemo, useState } from "react";
import type { DealsPageData } from "@/content/deals";

type DealsPageProps = {
  data: DealsPageData;
};

type CountdownState = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
};

function getCountdown(targetIso: string): CountdownState {
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      expired: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    expired: false,
  };
}

function Countdown({ data }: { data: DealsPageData }) {
  const initialCountdown = useMemo(() => getCountdown(data.countdown.targetIso), [data]);
  const [countdown, setCountdown] = useState<CountdownState>(initialCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown(data.countdown.targetIso));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [data.countdown.targetIso]);

  if (countdown.expired) {
    return (
      <div className="deals-countdown deals-countdown--expired" role="status">
        {data.countdown.expiredText}
      </div>
    );
  }

  return (
    <div className="deals-countdown" aria-label={data.countdown.label}>
      <div className="deals-countdown-label">{data.countdown.label}</div>

      <div className="deals-countdown-units">
        <div>
          <strong>{countdown.days}</strong>
          <span>Days</span>
        </div>
        <div>
          <strong>{countdown.hours}</strong>
          <span>Hours</span>
        </div>
        <div>
          <strong>{countdown.minutes}</strong>
          <span>Mins</span>
        </div>
        <div>
          <strong>{countdown.seconds}</strong>
          <span>Secs</span>
        </div>
      </div>
    </div>
  );
}

export function DealsPage({ data }: DealsPageProps) {
  return (
    <main className="deals-page">
      <div className="deals-top-bar">
        <a href={data.hero.phoneHref}>{data.hero.phoneLabel}</a>
      </div>

      <section className="deals-hero" aria-labelledby="deals-hero-title">
        <div className="deals-hero-bg" aria-hidden="true">
          <img src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="deals-hero-overlay" />

        <div className="deals-wrap deals-hero-inner">
          <div className="deals-hero-content">
            <span className="deals-kicker deals-kicker--light">{data.hero.kicker}</span>
            <h1 id="deals-hero-title">{data.hero.title}</h1>
            <p>{data.hero.description}</p>
          </div>
        </div>
      </section>

      <Countdown data={data} />

      <section className="deals-section" aria-labelledby="deals-intro-title">
        <div className="deals-wrap">
          <header className="deals-section-head">
            <span className="deals-kicker">{data.intro.kicker}</span>
            <h2 id="deals-intro-title">{data.intro.title}</h2>
            <p>{data.intro.description}</p>
          </header>

          <div className="deals-grid">
            {data.offers.map((offer) => (
              <article className="deals-card" key={offer.id}>
                <div className="deals-card-image">
                  <img src={offer.image} alt={offer.imageAlt} loading="lazy" />
                </div>

                <div className="deals-card-body">
                  <span className="deals-offer-label">{offer.discountLabel}</span>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>

                  <div className="deals-tags" aria-label={`${offer.title} offer tags`}>
                    {offer.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="deals-tip">
                    <strong>Tip:</strong> {offer.tip}
                  </div>

                  <div className="deals-coupon" aria-label={`${offer.title} coupon code`}>
                    <span>Code</span>
                    <strong>{offer.couponCode}</strong>
                  </div>

                  <div className="deals-actions">
                    <a
                      className="deals-btn deals-btn--primary"
                      href={offer.bookingHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book now
                    </a>

                    <a className="deals-btn deals-btn--secondary" href={offer.roomPageHref}>
                      View room
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}