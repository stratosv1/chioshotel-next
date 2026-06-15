import Link from "next/link";
import type { BeachLoversPageData } from "@/content/beach-lovers";

type BeachLoversPageProps = {
  data: BeachLoversPageData;
};

const beachLoversButtonBase =
  "inline-flex items-center justify-center rounded-full px-6 py-[13px] text-sm font-[850] leading-none transition duration-200 ease-in-out";

const beachLoversButtonPrimary =
  beachLoversButtonBase +
  " bg-cyan-400 text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,0.25)] hover:-translate-y-px hover:bg-cyan-300";

const beachLoversButtonSecondary =
  beachLoversButtonBase +
  " border border-white/45 text-white hover:bg-white/10";

const beachLoversButtonDark =
  beachLoversButtonBase +
  " mt-[30px] bg-slate-950 !text-white hover:-translate-y-px hover:bg-slate-800";

const beachLoversStayButton =
  beachLoversButtonPrimary + " mt-[30px] w-fit";

function getBookingHref(locale: BeachLoversPageData["locale"]) {
  switch (locale) {
    case "el":
      return "/el/amesi-kratisi-voulamandis-house/";
    case "fr":
      return "/fr/tarifs-des-hotels-a-chios/";
    case "de":
      return "/de/hotelpreise-auf-der-insel-chios/";
    case "it":
      return "/it/prezzi-hotel-chios/";
    case "es":
      return "/es/los-mejores-precios-de-hotel-en-la-isla-chios/";
    case "tr":
      return "/tr/sakiz-adasi-rezervasyon/";
    case "en":
    default:
      return "/chios-hotels-rates/";
  }
}

function getRoomsHref(locale: BeachLoversPageData["locale"]) {
  switch (locale) {
    case "el":
      return "/el/domatia-xios/";
    case "fr":
      return "/fr/chambres-a-chios/";
    case "de":
      return "/de/chios-zimmer/";
    case "it":
      return "/it/camere-a-chios/";
    case "es":
      return "/es/habitaciones-en-chios/";
    case "tr":
      return "/tr/sakiz-adasi-odalari/";
    case "en":
    default:
      return "/chios-rooms/";
  }
}

export function BeachLoversPage({ data }: BeachLoversPageProps) {
  const bookingHref = getBookingHref(data.locale);
  const roomsHref = getRoomsHref(data.locale);

  return (
    <main className="beach-lovers-page">
      <section className="beach-lovers-hero">
        <div className="beach-lovers-hero-image">
          <img src={data.hero.image} alt={data.hero.title} />
          <div className="beach-lovers-hero-overlay" />
        </div>

        <div className="beach-lovers-container beach-lovers-hero-grid">
          <div>
            <p className="beach-lovers-eyebrow">{data.hero.eyebrow}</p>

            <h1 className="beach-lovers-title">{data.hero.title}</h1>

            <p className="beach-lovers-subtitle">{data.hero.subtitle}</p>

            <div className="beach-lovers-actions">
              <Link href={bookingHref} className={beachLoversButtonPrimary}>
                {data.hero.primaryCta}
              </Link>

              <a href="#beaches" className={beachLoversButtonSecondary}>
                {data.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="beach-lovers-note">
            <small>Voulamandis House</small>
            <strong>Kampos base + beach days</strong>
            <p>
              Peaceful mornings, South Chios beaches, garden evenings and direct
              booking from Voulamandis House.
            </p>
          </div>
        </div>
      </section>

      <section className="beach-lovers-section beach-lovers-narrow">
        <p className="beach-lovers-kicker">Beach lover experience</p>

        <h2 className="beach-lovers-heading">{data.intro.title}</h2>

        <div className="beach-lovers-copy">
          {data.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section id="beaches" className="beach-lovers-white">
        <div className="beach-lovers-section">
          <div className="beach-lovers-section-head">
            <p className="beach-lovers-kicker">Chios beaches</p>

            <h2 className="beach-lovers-heading">{data.beachesTitle}</h2>

            <p className="beach-lovers-intro">{data.beachesIntro}</p>
          </div>

          <div className="beach-lovers-grid">
            {data.beaches.map((beach) => (
              <Link
                key={beach.name}
                href={beach.href}
                className="beach-lovers-card"
              >
                <div className="beach-lovers-card-image">
                  <img src={beach.image} alt={beach.name} />
                </div>

                <div className="beach-lovers-card-body">
                  <p className="beach-lovers-card-tag">{beach.tag}</p>
                  <h3>{beach.name}</h3>
                  <p>{beach.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="beach-lovers-section beach-lovers-stay">
        <div className="beach-lovers-stay-image">
          <img src={data.stay.image} alt={data.stay.title} />
        </div>

        <div className="beach-lovers-stay-box">
          <p className="beach-lovers-kicker beach-lovers-kicker-light">
            Stay in Kampos
          </p>

          <h2 className="beach-lovers-heading">{data.stay.title}</h2>

          <p>{data.stay.text}</p>

          <Link href={roomsHref} className={beachLoversStayButton}>
            {data.stay.cta}
          </Link>
        </div>
      </section>

      <section className="beach-lovers-section beach-lovers-final-wrap">
        <div className="beach-lovers-final">
          <h2 className="beach-lovers-heading">{data.finalCta.title}</h2>

          <p>{data.finalCta.text}</p>

          <Link href={bookingHref} className={beachLoversButtonDark}>
            {data.finalCta.button}
          </Link>
        </div>
      </section>
    </main>
  );
}
