import Image from "next/image";
import type { HomePageData } from "@/content/home";
import { LastMinuteDeals } from "@/components/home/LastMinuteDeals";
import { HomeMap } from "@/components/home/HomeMap";
import { DiscountReveal } from "@/components/home/DiscountReveal";
import { HomeReviews } from "@/components/home/HomeReviews";

type HomePageProps = {
  data: HomePageData;
};

function HtmlText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function HomePage({ data }: HomePageProps) {
  return (
    <>
      <main className="vh-homepage">
        <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-black text-white max-[767px]:h-[76svh] max-[767px]:min-h-[590px] max-[767px]:max-h-[720px]" aria-label="Rooms and apartments in Chios, Kampos">
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src={data.hero.image}
              alt={data.hero.imageAlt}
              width={1200}
              height={675}
              priority
              fetchPriority="high"
              sizes="100vw"
              quality={62}
              className="h-full w-full object-cover object-center max-[767px]:object-top"
            />
          </div>

                    <div className="pointer-events-none absolute inset-0 z-10 max-[767px]:hidden" style={{ background: "linear-gradient(90deg, rgba(0,0,0,.08) 0%, rgba(0,0,0,.12) 40%, rgba(0,0,0,.58) 100%)" }} />
          <div className="pointer-events-none absolute inset-0 z-10 hidden max-[767px]:block" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.04) 35%, rgba(0,0,0,.40) 68%, rgba(0,0,0,.82) 100%)" }} />

          <div className="relative z-20 mx-auto flex min-h-[88vh] w-[min(1280px,92vw)] items-end justify-end py-[58px] max-[767px]:min-h-full max-[767px]:w-full max-[767px]:p-3 max-[767px]:pb-[18px]">
            <div className="flex w-[590px] max-w-full flex-col items-start gap-4 rounded-[30px] border border-white/15 bg-gradient-to-b from-[rgba(42,28,22,.76)] to-[rgba(18,12,10,.82)] px-7 py-[30px] shadow-[0_18px_42px_rgba(0,0,0,.28)] max-[767px]:w-full max-[767px]:gap-[10px] max-[767px]:rounded-none max-[767px]:border-0 max-[767px]:bg-transparent max-[767px]:p-0 max-[767px]:shadow-none">
              <div
                className="inline-flex items-center gap-3 rounded-full bg-white/95 px-[15px] py-[9px] text-[#333] shadow-[0_10px_24px_rgba(0,0,0,.15)] max-[767px]:absolute max-[767px]:left-3 max-[767px]:top-3 max-[767px]:z-30 max-[767px]:max-w-[calc(100%-24px)] max-[767px]:gap-[10px] max-[767px]:px-3 max-[767px]:py-2"
                aria-label={`Guest rating ${data.hero.rating} from ${data.hero.reviews}`}
              >
                <div>
                  <strong>{data.hero.rating}</strong>
                  <span>{data.hero.reviews}</span>
                </div>
                <div className="text-[13px] leading-none text-[#f1c40f] max-[767px]:text-xs" aria-hidden="true">
                  {"\u2605\u2605\u2605\u2605\u2605"}
                </div>
              </div>

              <div className="text-[11px] font-black uppercase tracking-[.18em] text-white drop-shadow max-[767px]:text-[10px] max-[767px]:tracking-[.16em] max-[767px]:text-white/90">{data.hero.kicker}</div>

              <h1 className="m-0 max-w-[17ch] text-balance text-[clamp(36px,3vw,50px)] font-black leading-[1.08] tracking-[-.02em] text-white drop-shadow-[0_4px_14px_rgba(0,0,0,.4)] max-[767px]:max-w-[12ch] max-[767px]:text-[34px] max-[767px]:leading-[.98] max-[767px]:tracking-[-.035em]">{data.hero.title}</h1>

              <p className="m-0 text-base leading-[1.7] text-white/95 max-[767px]:line-clamp-2 max-[767px]:text-sm max-[767px]:leading-[1.45] max-[767px]:drop-shadow-[0_2px_10px_rgba(0,0,0,.45)]">
                <HtmlText html={data.hero.descriptionHtml} />
              </p>

              <div className="mt-1 grid w-full grid-cols-2 gap-3 max-[767px]:gap-[10px]">
                <a className="inline-flex min-h-[52px] items-center justify-center gap-[10px] rounded-full border border-[#e67e22] bg-[#e67e22] px-[18px] text-center text-xs font-black uppercase text-white shadow-[0_8px_20px_rgba(230,126,34,.32)] transition hover:-translate-y-0.5 hover:bg-[#d35400] max-[767px]:rounded-[18px] max-[767px]:px-[10px] max-[767px]:text-[11px] max-[767px]:leading-[1.15] max-[767px]:tracking-[.06em]" href={data.hero.primaryCta.href}>
                  <span aria-hidden="true">{data.hero.primaryCta.icon}</span>{" "}
                  {data.hero.primaryCta.label}
                </a>

                <a className="inline-flex min-h-[52px] items-center justify-center gap-[10px] rounded-full border border-white/40 bg-white/10 px-[18px] text-center text-xs font-black uppercase text-white backdrop-blur transition hover:-translate-y-0.5 max-[767px]:rounded-[18px] max-[767px]:px-[10px] max-[767px]:text-[11px] max-[767px]:leading-[1.15] max-[767px]:tracking-[.06em]" href={data.hero.secondaryCta.href}>
                  <span aria-hidden="true">{data.hero.secondaryCta.icon}</span>{" "}
                  {data.hero.secondaryCta.label}
                </a>
              </div>

              <a className="relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 overflow-hidden rounded-[20px] border border-white/25 bg-white/15 px-[14px] py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,.22)] backdrop-blur max-[767px]:grid-cols-[auto_1fr] max-[767px]:gap-[10px] max-[767px]:rounded-[18px] max-[767px]:px-3 max-[767px]:py-[11px]" href={data.hero.quizCard.href}>
                <span className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl bg-white/20 text-[22px] max-[767px]:h-[38px] max-[767px]:w-[38px] max-[767px]:rounded-[14px] max-[767px]:text-[19px]" aria-hidden="true">
                  {data.hero.quizCard.icon}
                </span>

                <span className="flex min-w-0 flex-col">
                  <span className="mb-1 inline-flex items-center gap-[5px] text-[10px] font-black uppercase tracking-[.1em] text-[#bbf7d0]">{data.hero.quizCard.liveLabel}</span>
                  <strong className="block text-[13px] font-black uppercase tracking-[.04em] max-[767px]:text-xs">{data.hero.quizCard.title}</strong>
                  <span className="mt-0.5 block text-xs leading-[1.35] text-white/90 max-[767px]:line-clamp-2 max-[767px]:text-[11.5px]">{data.hero.quizCard.text}</span>
                </span>

                <span className="inline-flex min-h-9 items-center justify-center rounded-full bg-white px-3 text-[10px] font-black uppercase tracking-[.08em] text-[#8E6607] max-[767px]:col-span-2 max-[767px]:w-full">{data.hero.quizCard.cta}</span>
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
                <HomeMap
                  buttonLabel={data.location.map.buttonLabel}
                  iframeSrc={data.location.map.iframeSrc}
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
                  {data.location.infoCard.addressLines[0]}
                  <br />
                  {data.location.infoCard.addressLines[1]}
                  <br />
                  {data.location.infoCard.phoneLabel}{" "}
                  <a
                    href={data.location.infoCard.phoneHref}
                    style={{ color: "#8E6607", fontWeight: 700 }}
                  >
                    {data.location.infoCard.phone}
                  </a>
                  <br />
                  {data.location.infoCard.emailLabel}{" "}
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

                  <DiscountReveal
                    submitLabel={data.location.discount.submitLabel}
                    successText={data.location.discount.successText}
                    code={data.location.discount.defaultCode || "WELCOME10"}
                  />
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

                    <span className="vh-btn vh-btn--secondary">{room.cta}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <LastMinuteDeals data={data.lastMinute} canonicalPath={data.seo.canonicalPath} />

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

              <HomeReviews loaderUrl={data.reviews.trustindexLoaderUrl} />
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



