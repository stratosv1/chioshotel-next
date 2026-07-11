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
        <a
          className="font-black text-amber-800 underline decoration-amber-800/30 underline-offset-4"
          href={link.href}
          key={`${link.href}-${index}`}
        >
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
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#fcfaf8] to-[#f5f0ea] text-stone-800">
      <section className="relative flex min-h-[460px] items-end overflow-hidden text-white md:min-h-[560px]" aria-labelledby="rates-hero-title">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img className="h-full w-full object-cover" src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(46,35,27,.86)_0%,rgba(92,65,42,.58)_58%,rgba(46,35,27,.28)_100%),linear-gradient(0deg,rgba(46,35,27,.76)_0%,transparent_60%)]" />

        <div className="relative z-[2] mx-auto w-[min(1220px,calc(100%-40px))] py-16 pt-28 md:py-20 md:pt-32">
          <div className="max-w-[820px] rounded-[2rem] border border-white/20 bg-white/10 p-[clamp(30px,5vw,52px)] shadow-[0_34px_90px_rgba(0,0,0,.24)] backdrop-blur-xl max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-0">
            <span className="mb-5 inline-flex min-h-8 items-center rounded-full border border-white/25 bg-white/15 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-white">
              {data.hero.kicker}
            </span>
            <h1 id="rates-hero-title" className="m-0 max-w-[12ch] text-[clamp(42px,7vw,78px)] font-black leading-[0.96] tracking-[-0.055em] text-white drop-shadow-lg">
              {data.hero.title}
            </h1>
            <p className="mt-5 max-w-[720px] text-base leading-7 text-white/95 md:text-lg md:leading-8">
              {data.hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="mx-auto grid w-[min(1220px,calc(100%-40px))] gap-7 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-stone-200 bg-white p-[clamp(26px,4vw,38px)] shadow-xl shadow-stone-900/5">
            <span className="mb-5 inline-flex min-h-8 items-center rounded-full bg-[#efe6d8] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#a15d33]">
              {data.benefits.kicker}
            </span>
            <h2 className="m-0 text-[clamp(30px,4vw,46px)] font-black leading-none tracking-[-0.05em] text-stone-800">
              {data.benefits.title}
            </h2>
            <p className="mt-4 text-[15.5px] leading-7 text-stone-600">{data.benefits.text}</p>

            <div className="mt-6 grid gap-3">
              {data.benefits.items.map((item) => (
                <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-[#fcfaf8] p-4" key={item.title}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c47646]/10 text-lg" aria-hidden="true">
                    {item.icon}
                  </span>
                  <div>
                    <strong className="block text-[15px] font-black text-stone-800">{item.title}</strong>
                    <p className="mt-1 text-[13.5px] leading-6 text-stone-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-[radial-gradient(circle_at_top_right,rgba(196,118,70,.15),transparent_18rem),linear-gradient(180deg,#fff,#f4eadf)] p-[clamp(26px,4vw,38px)] shadow-xl shadow-stone-900/5">
            <span className="mb-5 inline-flex min-h-8 items-center rounded-full border border-amber-200 bg-amber-50 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-amber-800">
              ⚡ {data.discount.kicker}
            </span>
            <h2 className="m-0 text-[clamp(30px,4vw,46px)] font-black leading-none tracking-[-0.05em] text-stone-800">
              {data.discount.title}
            </h2>
            <p className="mt-4 text-[15.5px] leading-7 text-stone-600">{data.discount.text}</p>

            <div className="mt-6 flex items-center justify-between gap-5 rounded-[1.5rem] bg-gradient-to-br from-[#c47646] to-[#a15d33] p-6 text-white shadow-lg shadow-[#c47646]/25">
              <div>
                <strong className="block text-4xl font-black leading-none tracking-[-0.04em]">{data.discount.value}</strong>
                <span className="mt-2 block text-[11px] font-black uppercase tracking-[0.11em] text-white/95">{ui.directBookingCode}</span>
              </div>
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-white/20 text-3xl" aria-hidden="true">
                🎁
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-emerald-700/40 bg-emerald-50 p-5 text-center" aria-label={ui.discountCodeAriaLabel}>
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-emerald-800">{ui.yourDiscountCode}</span>
              <strong className="block font-mono text-3xl font-black leading-none tracking-[0.05em] text-emerald-800 md:text-4xl">{data.discount.code}</strong>
            </div>

            <p className="mt-4 text-sm italic leading-6 text-stone-600">{data.discount.note}</p>
          </article>
        </div>
      </section>

      <section className="pb-16 md:pb-20" aria-labelledby="rates-booking-title">
        <div className="mx-auto w-[min(1220px,calc(100%-40px))]">
          <article className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-xl shadow-stone-900/5">
            <header className="flex flex-col gap-5 p-5 md:flex-row md:items-start md:justify-between md:p-6">
              <div className="max-w-[820px]">
                <span className="mb-4 inline-flex min-h-8 items-center rounded-full bg-[#efe6d8] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#a15d33]">
                  {data.booking.kicker}
                </span>
                <h2 id="rates-booking-title" className="m-0 text-[clamp(30px,4vw,46px)] font-black leading-none tracking-[-0.05em] text-stone-800">
                  {data.booking.title}
                </h2>
                <p className="mt-4 text-[15.5px] leading-7 text-stone-600">{data.booking.text}</p>
              </div>

              <a
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-[#efe6d8] px-5 text-[11px] font-black uppercase tracking-[0.1em] text-[#a15d33]"
                href={data.booking.fallbackHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ui.openBooking}
              </a>
            </header>

            <div className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-stone-50">
              <iframe
                src={data.booking.iframeSrc}
                className="block h-[1100px] w-full border-0 max-md:h-[1450px]"
                loading="eager"
                title={data.booking.iframeTitle}
              />
            </div>

            <article className="mx-auto max-w-[920px] px-5 py-8 text-[15px] leading-7 text-stone-600 md:px-8">
              {data.seoCopy.paragraphs.map((paragraph) => (
                <p className="mt-4 first:mt-0" key={paragraph}>{renderSeoParagraph(paragraph, data.seoCopy.links)}</p>
              ))}
            </article>
          </article>
        </div>
      </section>
    </main>
  );
}
