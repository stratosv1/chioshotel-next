import Link from "next/link";
import type { BeachLoversPageData } from "@/content/beach-lovers";

type BeachLoversPageProps = {
data: BeachLoversPageData;
};

const beachLoversButtonBase =
"inline-flex items-center justify-center rounded-full px-6 py-[13px] text-sm font-[850] leading-none no-underline transition duration-200 ease-in-out";

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

const beachLoversHero =
"relative overflow-hidden bg-slate-950 text-white";

const beachLoversHeroImage =
"absolute inset-0";

const beachLoversHeroImg =
"h-full w-full object-cover opacity-55";

const beachLoversHeroOverlay =
"absolute inset-0 bg-[linear-gradient(90deg,#020617_0%,rgba(2,6,23,0.82)_48%,rgba(2,6,23,0.25)_100%)]";

const beachLoversContainer =
"relative mx-auto max-w-[1180px] px-5 py-24 md:px-8 md:py-32";

const beachLoversHeroGrid =
"grid items-center gap-9 md:grid-cols-[1.1fr_0.9fr]";

const beachLoversEyebrow =
"mb-[18px] inline-flex rounded-full bg-white/15 px-4 py-2 text-[13px] font-extrabold uppercase tracking-[0.18em] text-cyan-100";

const beachLoversTitle =
"m-0 max-w-[820px] text-[clamp(38px,7vw,70px)] font-[950] leading-[0.96] tracking-[-0.05em]";

const beachLoversSubtitle =
"mt-6 max-w-[700px] text-[19px] leading-[1.75] text-slate-200";

const beachLoversActions =
"mt-8 flex flex-wrap gap-3";

const beachLoversNote =
"rounded-[30px] border border-white/20 bg-white/10 p-7 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-[12px]";

const beachLoversNoteLabel =
"text-[13px] font-[850] uppercase tracking-[0.16em] text-cyan-100";

const beachLoversNoteTitle =
"mt-3 block text-[30px] font-[950] leading-[1.12]";

const beachLoversNoteText =
"mt-4 leading-[1.75] text-slate-200";

const beachLoversSection =
"mx-auto max-w-[1180px] px-5 py-[72px] md:px-8 md:py-[88px]";

const beachLoversNarrow =
"max-w-[900px]";

const beachLoversSectionHead =
"max-w-[780px]";

const beachLoversKicker =
"m-0 text-[13px] font-[950] uppercase tracking-[0.2em] text-cyan-700";

const beachLoversKickerLight =
"m-0 text-[13px] font-[950] uppercase tracking-[0.2em] text-cyan-200";

const beachLoversHeading =
"mt-3 text-[clamp(32px,5vw,52px)] font-[950] leading-none tracking-[-0.04em]";

const beachLoversCopy =
"mt-[30px] grid gap-[18px] text-lg leading-[1.85] text-slate-700";

const beachLoversIntro =
"mt-5 max-w-[760px] text-lg leading-[1.75] text-slate-600";

const beachLoversGrid =
"mt-[42px] grid gap-6 md:grid-cols-2 lg:grid-cols-3";

const beachLoversCard =
"group overflow-hidden rounded-[28px] border border-slate-200 bg-[#fffaf2] text-slate-900 no-underline shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.14)]";

const beachLoversCardImage =
"aspect-[4/3] overflow-hidden bg-slate-200";

const beachLoversCardImg =
"h-full w-full object-cover transition duration-500 ease-in-out group-hover:scale-105";

const beachLoversCardBody =
"p-[22px]";

const beachLoversCardTag =
"m-0 text-xs font-[950] uppercase tracking-[0.16em] text-cyan-700";

const beachLoversCardTitle =
"mt-[9px] text-[26px] font-[950] leading-[1.1]";

const beachLoversCardText =
"mt-[13px] leading-[1.7] text-slate-600";

const beachLoversStay =
beachLoversSection +
" grid items-stretch gap-7 md:grid-cols-2";

const beachLoversStayImage =
"overflow-hidden rounded-[32px] bg-slate-200 shadow-[0_20px_44px_rgba(15,23,42,0.14)]";

const beachLoversStayImg =
"block h-full min-h-[360px] w-full object-cover";

const beachLoversStayBox =
"flex flex-col justify-center rounded-[32px] bg-slate-950 p-[34px] text-white md:p-11";

const beachLoversStayText =
"mt-[22px] text-lg leading-[1.75] text-slate-200";

const beachLoversFinalWrap =
beachLoversSection + " pt-9";

const beachLoversFinal =
"mx-auto max-w-[980px] rounded-[32px] border border-cyan-100 bg-cyan-50 px-6 py-11 text-center md:px-11 md:py-14";

const beachLoversFinalText =
"mx-auto mt-5 max-w-[700px] text-lg leading-[1.75] text-slate-600";

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

return ( <main className="bg-[#fffaf2] text-slate-900"> <section className={beachLoversHero}> <div className={beachLoversHeroImage}> <img
         src={data.hero.image}
         alt={data.hero.title}
         className={beachLoversHeroImg}
       /> <div className={beachLoversHeroOverlay} /> </div>

    <div className={`${beachLoversContainer} ${beachLoversHeroGrid}`}>
      <div>
        <p className={beachLoversEyebrow}>{data.hero.eyebrow}</p>

        <h1 className={beachLoversTitle}>{data.hero.title}</h1>

        <p className={beachLoversSubtitle}>{data.hero.subtitle}</p>

        <div className={beachLoversActions}>
          <Link href={bookingHref} className={beachLoversButtonPrimary}>
            {data.hero.primaryCta}
          </Link>

          <a href="#beaches" className={beachLoversButtonSecondary}>
            {data.hero.secondaryCta}
          </a>
        </div>
      </div>

      <div className={beachLoversNote}>
        <small className={beachLoversNoteLabel}>Voulamandis House</small>
        <strong className={beachLoversNoteTitle}>
          Kampos base + beach days
        </strong>
        <p className={beachLoversNoteText}>
          Peaceful mornings, South Chios beaches, garden evenings and direct
          booking from Voulamandis House.
        </p>
      </div>
    </div>
  </section>

  <section className={`${beachLoversSection} ${beachLoversNarrow}`}>
    <p className={beachLoversKicker}>Beach lover experience</p>

    <h2 className={beachLoversHeading}>{data.intro.title}</h2>

    <div className={beachLoversCopy}>
      {data.intro.paragraphs.map((paragraph) => (
        <p key={paragraph} className="m-0">
          {paragraph}
        </p>
      ))}
    </div>
  </section>

  <section id="beaches" className="bg-white">
    <div className={beachLoversSection}>
      <div className={beachLoversSectionHead}>
        <p className={beachLoversKicker}>Chios beaches</p>

        <h2 className={beachLoversHeading}>{data.beachesTitle}</h2>

        <p className={beachLoversIntro}>{data.beachesIntro}</p>
      </div>

      <div className={beachLoversGrid}>
        {data.beaches.map((beach) => (
          <Link
            key={beach.name}
            href={beach.href}
            className={beachLoversCard}
          >
            <div className={beachLoversCardImage}>
              <img
                src={beach.image}
                alt={beach.name}
                className={beachLoversCardImg}
              />
            </div>

            <div className={beachLoversCardBody}>
              <p className={beachLoversCardTag}>{beach.tag}</p>
              <h3 className={beachLoversCardTitle}>{beach.name}</h3>
              <p className={beachLoversCardText}>{beach.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>

  <section className={beachLoversStay}>
    <div className={beachLoversStayImage}>
      <img
        src={data.stay.image}
        alt={data.stay.title}
        className={beachLoversStayImg}
      />
    </div>

    <div className={beachLoversStayBox}>
      <p className={beachLoversKickerLight}>Stay in Kampos</p>

      <h2 className={beachLoversHeading}>{data.stay.title}</h2>

      <p className={beachLoversStayText}>{data.stay.text}</p>

      <Link href={roomsHref} className={beachLoversStayButton}>
        {data.stay.cta}
      </Link>
    </div>
  </section>

  <section className={beachLoversFinalWrap}>
    <div className={beachLoversFinal}>
      <h2 className={beachLoversHeading}>{data.finalCta.title}</h2>

      <p className={beachLoversFinalText}>{data.finalCta.text}</p>

      <Link href={bookingHref} className={beachLoversButtonDark}>
        {data.finalCta.button}
      </Link>
    </div>
  </section>
</main>

);
}
