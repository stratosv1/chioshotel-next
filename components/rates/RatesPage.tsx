import type { ReactNode } from "react";
import { PropertyFaqSection } from "@/components/faq/PropertyFaqSection";
import type { RatesPageData } from "@/content/rates";
import { isLanguageCode } from "@/lib/languages";

type RatesPageProps = {
  data: RatesPageData;
};

type RatesUiText = {
  directBookingCode: string;
  discountCodeAriaLabel: string;
  yourDiscountCode: string;
  openBooking: string;
};

type MobileBookingText = {
  eyebrow: string;
  title: string;
  text: string;
  categoryNote: string;
  checkin: string;
  nights: string;
  adults: string;
  children: string;
  submit: string;
  secureNote: string;
  categories: Array<[string, string]>;
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
  pl: {
    directBookingCode: "Kod do rezerwacji bezpośredniej",
    discountCodeAriaLabel: "Kod rabatowy do rezerwacji bezpośredniej",
    yourDiscountCode: "Twój kod rabatowy",
    openBooking: "Otwórz rezerwację",
  },
};

const mobileBookingByLocale: Record<string, MobileBookingText> = {
  en: {
    eyebrow: "Secure booking by Beds24",
    title: "Choose your stay details",
    text: "On the next step you choose a room category, not a fixed room number.",
    categoryNote: "A specific room can be requested and is subject to availability.",
    checkin: "Check-in",
    nights: "Nights",
    adults: "Adults",
    children: "Children",
    submit: "Check availability & book",
    secureNote: "Continues securely on Beds24 in this tab.",
    categories: [["Economy", "Rooms 2, 6"], ["Ground Floor", "Rooms 5, 7"], ["First Floor", "Rooms 1, 3, 4"], ["Family Apartments", "8, 9, 10"]],
  },
  el: {
    eyebrow: "Ασφαλής κράτηση μέσω Beds24",
    title: "Επιλέξτε τα στοιχεία διαμονής",
    text: "Στο επόμενο βήμα επιλέγετε κατηγορία δωματίου και όχι συγκεκριμένο αριθμό.",
    categoryNote: "Μπορείτε να ζητήσετε συγκεκριμένο δωμάτιο, ανάλογα με τη διαθεσιμότητα.",
    checkin: "Άφιξη",
    nights: "Νύχτες",
    adults: "Ενήλικες",
    children: "Παιδιά",
    submit: "Διαθεσιμότητα & κράτηση",
    secureNote: "Η ασφαλής κράτηση συνεχίζεται στο Beds24 στο ίδιο tab.",
    categories: [["Economy", "Δωμάτια 2, 6"], ["Ισόγειο", "Δωμάτια 5, 7"], ["1ος όροφος", "Δωμάτια 1, 3, 4"], ["Οικογενειακά διαμερίσματα", "8, 9, 10"]],
  },
  fr: {
    eyebrow: "Réservation sécurisée via Beds24",
    title: "Choisissez les détails du séjour",
    text: "À l’étape suivante, vous choisissez une catégorie et non un numéro de chambre précis.",
    categoryNote: "Une chambre précise peut être demandée selon disponibilité.",
    checkin: "Arrivée",
    nights: "Nuits",
    adults: "Adultes",
    children: "Enfants",
    submit: "Voir les disponibilités",
    secureNote: "La réservation sécurisée continue sur Beds24 dans le même onglet.",
    categories: [["Economy", "Chambres 2, 6"], ["Rez-de-chaussée", "Chambres 5, 7"], ["1er étage", "Chambres 1, 3, 4"], ["Appartements familiaux", "8, 9, 10"]],
  },
  de: {
    eyebrow: "Sichere Buchung über Beds24",
    title: "Aufenthaltsdaten wählen",
    text: "Im nächsten Schritt buchen Sie eine Zimmerkategorie, keine feste Zimmernummer.",
    categoryNote: "Ein bestimmtes Zimmer kann je nach Verfügbarkeit angefragt werden.",
    checkin: "Anreise",
    nights: "Nächte",
    adults: "Erwachsene",
    children: "Kinder",
    submit: "Verfügbarkeit prüfen",
    secureNote: "Die sichere Buchung wird im selben Tab bei Beds24 fortgesetzt.",
    categories: [["Economy", "Zimmer 2, 6"], ["Erdgeschoss", "Zimmer 5, 7"], ["1. Etage", "Zimmer 1, 3, 4"], ["Familienapartments", "8, 9, 10"]],
  },
  it: {
    eyebrow: "Prenotazione sicura con Beds24",
    title: "Scegli i dettagli del soggiorno",
    text: "Nel passaggio successivo scegli una categoria, non un numero di camera specifico.",
    categoryNote: "Puoi richiedere una camera specifica, secondo disponibilità.",
    checkin: "Arrivo",
    nights: "Notti",
    adults: "Adulti",
    children: "Bambini",
    submit: "Verifica disponibilità",
    secureNote: "La prenotazione sicura continua su Beds24 nella stessa scheda.",
    categories: [["Economy", "Camere 2, 6"], ["Piano terra", "Camere 5, 7"], ["Primo piano", "Camere 1, 3, 4"], ["Appartamenti familiari", "8, 9, 10"]],
  },
  es: {
    eyebrow: "Reserva segura con Beds24",
    title: "Elige los datos de tu estancia",
    text: "En el siguiente paso eliges una categoría, no un número de habitación concreto.",
    categoryNote: "Puedes solicitar una habitación concreta, según disponibilidad.",
    checkin: "Entrada",
    nights: "Noches",
    adults: "Adultos",
    children: "Niños",
    submit: "Ver disponibilidad",
    secureNote: "La reserva segura continúa en Beds24 en la misma pestaña.",
    categories: [["Economy", "Habitaciones 2, 6"], ["Planta baja", "Habitaciones 5, 7"], ["Primera planta", "Habitaciones 1, 3, 4"], ["Apartamentos familiares", "8, 9, 10"]],
  },
  tr: {
    eyebrow: "Beds24 ile güvenli rezervasyon",
    title: "Konaklama bilgilerinizi seçin",
    text: "Sonraki adımda belirli bir oda numarası değil, oda kategorisi seçersiniz.",
    categoryNote: "Belirli bir oda talep edilebilir; müsaitliğe bağlıdır.",
    checkin: "Giriş",
    nights: "Gece",
    adults: "Yetişkin",
    children: "Çocuk",
    submit: "Müsaitliği kontrol et",
    secureNote: "Güvenli rezervasyon aynı sekmede Beds24 üzerinde devam eder.",
    categories: [["Economy", "Odalar 2, 6"], ["Zemin kat", "Odalar 5, 7"], ["1. kat", "Odalar 1, 3, 4"], ["Aile daireleri", "8, 9, 10"]],
  },
  pl: {
    eyebrow: "Bezpieczna rezerwacja przez Beds24",
    title: "Wybierz szczegóły pobytu",
    text: "W kolejnym kroku wybierasz kategorię, a nie konkretny numer pokoju.",
    categoryNote: "Możesz poprosić o konkretny pokój, zależnie od dostępności.",
    checkin: "Przyjazd",
    nights: "Noce",
    adults: "Dorośli",
    children: "Dzieci",
    submit: "Sprawdź dostępność",
    secureNote: "Bezpieczna rezerwacja jest kontynuowana w Beds24 w tej samej karcie.",
    categories: [["Economy", "Pokoje 2, 6"], ["Parter", "Pokoje 5, 7"], ["Piętro", "Pokoje 1, 3, 4"], ["Apartamenty rodzinne", "8, 9, 10"]],
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
  const locale = getRatesLocale(data.seo.canonicalPath);
  const ui = ratesUiByLocale[locale];
  const mobileBooking = mobileBookingByLocale[locale];
  const beds24Url = new URL(data.booking.iframeSrc);
  const beds24Action = `${beds24Url.origin}${beds24Url.pathname}`;
  const beds24PropId = beds24Url.searchParams.get("propid") ?? "";
  const faqLanguage = isLanguageCode(locale) ? locale : null;

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
          <article className="min-w-0 rounded-[2rem] border border-stone-200 bg-white p-[clamp(26px,4vw,38px)] shadow-xl shadow-stone-900/5">
            <span className="mb-5 inline-flex min-h-8 items-center rounded-full bg-[#efe6d8] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#a15d33]">
              {data.benefits.kicker}
            </span>
            <h2 className="m-0 text-[clamp(30px,4vw,46px)] font-black leading-none tracking-[-0.05em] text-stone-800">
              {data.benefits.title}
            </h2>
            <p className="mt-4 text-[15.5px] leading-7 text-stone-600">{data.benefits.text}</p>

            <div className="-mx-3 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0">
              {data.benefits.items.map((item) => (
                <div
                  className="flex min-w-[86%] snap-start items-start gap-4 rounded-2xl border border-stone-200 bg-[#fcfaf8] p-4 shadow-sm md:min-w-0"
                  key={item.title}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c47646]/10 text-lg" aria-hidden="true">
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
        <div className="mx-auto w-full md:w-[min(1220px,calc(100%-40px))]">
          <article className="bg-white md:rounded-[2rem] md:border md:border-stone-200 md:p-4 md:shadow-xl md:shadow-stone-900/5">
            <header className="flex flex-col gap-5 px-5 py-7 md:flex-row md:items-start md:justify-between md:p-6">
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
                className="hidden min-h-12 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-[#efe6d8] px-5 text-[11px] font-black uppercase tracking-[0.1em] text-[#a15d33] md:inline-flex"
                href={data.booking.fallbackHref}
              >
                {ui.openBooking}
              </a>
            </header>

            <section className="mx-4 mb-5 rounded-[1.75rem] border border-stone-200 bg-[#fffaf5] p-4 shadow-sm md:hidden" aria-label={mobileBooking.title}>
              <span className="inline-flex min-h-7 items-center rounded-full bg-[#efe6d8] px-3 text-[10px] font-black uppercase tracking-[0.11em] text-[#a15d33]">
                {mobileBooking.eyebrow}
              </span>
              <h3 className="mt-3 text-xl font-black tracking-[-0.03em] text-stone-900">{mobileBooking.title}</h3>
              <p className="mt-1 text-sm leading-6 text-stone-600">{mobileBooking.text}</p>

              <div className="-mx-1 mt-3 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {mobileBooking.categories.map(([name, rooms]) => (
                  <div key={name} className="min-w-[57%] snap-start rounded-2xl border border-stone-200 bg-white px-3 py-2.5">
                    <strong className="block text-sm font-black text-stone-800">{name}</strong>
                    <span className="mt-0.5 block text-xs font-semibold text-stone-500">{rooms}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-stone-500">{mobileBooking.categoryNote}</p>

              <form method="get" action={beds24Action} className="mt-4 grid grid-cols-2 gap-3">
                <input type="hidden" name="propid" value={beds24PropId} />
                <input type="hidden" name="referer" value="website-mobile" />
                <input type="hidden" name="mobile" value="1" />
                <input type="hidden" name="lang" value={locale} />

                <label className="col-span-2 grid gap-1.5 text-xs font-black uppercase tracking-[0.06em] text-stone-600">
                  {mobileBooking.checkin}
                  <input
                    type="date"
                    name="checkin"
                    required
                    className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base font-semibold normal-case tracking-normal text-stone-800 outline-none focus:border-[#a15d33] focus:ring-2 focus:ring-[#a15d33]/15"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-black uppercase tracking-[0.06em] text-stone-600">
                  {mobileBooking.nights}
                  <select name="numnight" defaultValue="2" className="min-h-12 rounded-xl border border-stone-300 bg-white px-3 text-base font-semibold normal-case tracking-normal text-stone-800 outline-none focus:border-[#a15d33]">
                    {Array.from({ length: 14 }, (_, index) => index + 1).map((night) => <option key={night} value={night}>{night}</option>)}
                  </select>
                </label>

                <label className="grid gap-1.5 text-xs font-black uppercase tracking-[0.06em] text-stone-600">
                  {mobileBooking.adults}
                  <select name="numadult" defaultValue="2" className="min-h-12 rounded-xl border border-stone-300 bg-white px-3 text-base font-semibold normal-case tracking-normal text-stone-800 outline-none focus:border-[#a15d33]">
                    {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}</option>)}
                  </select>
                </label>

                <label className="col-span-2 grid gap-1.5 text-xs font-black uppercase tracking-[0.06em] text-stone-600">
                  {mobileBooking.children}
                  <select name="numchild" defaultValue="0" className="min-h-12 rounded-xl border border-stone-300 bg-white px-3 text-base font-semibold normal-case tracking-normal text-stone-800 outline-none focus:border-[#a15d33]">
                    {[0, 1, 2, 3, 4].map((count) => <option key={count} value={count}>{count}</option>)}
                  </select>
                </label>

                <button type="submit" className="col-span-2 min-h-14 rounded-2xl bg-[#a15d33] px-5 text-sm font-black uppercase tracking-[0.07em] text-white shadow-lg shadow-[#a15d33]/20 active:scale-[0.99]">
                  {mobileBooking.submit}
                </button>
              </form>

              <p className="mt-2 text-center text-[11px] font-semibold leading-5 text-stone-500">{mobileBooking.secureNote}</p>
            </section>

            <div className="hidden w-full bg-stone-50 md:block md:rounded-[1.5rem] md:border md:border-stone-200">
              <iframe
                src={data.booking.iframeSrc}
                className="block h-[5600px] w-full border-0 xl:h-[5200px]"
                style={{ minHeight: "5200px" }}
                scrolling="yes"
                loading="lazy"
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

      {faqLanguage ? <PropertyFaqSection language={faqLanguage} context="rates" /> : null}
    </main>
  );
}
