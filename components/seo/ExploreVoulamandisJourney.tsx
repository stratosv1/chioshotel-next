"use client";

import Image from "next/image";

type SiteLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type Props = {
  language: SiteLanguage;
  pathname: string;
};

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

const COPY: Record<SiteLanguage, {
  kicker: string;
  title: string;
  text: string;
  house: string;
  rooms: string;
  rates: string;
  hotelsGuide: string;
}> = {
  en: {
    kicker: "Plan the rest of your Chios stay",
    title: "From island guide to your room at Voulamandis House",
    text: "You have found a place worth visiting. Compare where to stay, discover our quiet base in Kambos, explore the rooms and continue to current direct rates.",
    house: "Explore Chios accommodation",
    rooms: "Explore rooms & apartments",
    rates: "Check direct rates",
    hotelsGuide: "Compare Chios hotels & areas",
  },
  el: {
    kicker: "Οργανώστε την υπόλοιπη διαμονή σας στη Χίο",
    title: "Από τον οδηγό της Χίου στο δωμάτιό σας στο Voulamandis House",
    text: "Συγκρίνετε περιοχές και τύπους διαμονής, γνωρίστε τον ήσυχο Κάμπο, δείτε τα δωμάτια και συνεχίστε στις τρέχουσες απευθείας τιμές.",
    house: "Διαμονή στη Χίο",
    rooms: "Δωμάτια & διαμερίσματα",
    rates: "Απευθείας τιμές",
    hotelsGuide: "Σύγκριση ξενοδοχείων & περιοχών",
  },
  fr: {
    kicker: "Organisez la suite de votre séjour à Chios",
    title: "Du guide de l’île à votre hébergement au Voulamandis House",
    text: "Comparez les zones et les types de séjour, découvrez Kambos, consultez les chambres et poursuivez vers les tarifs directs actuels.",
    house: "Hébergement à Chios",
    rooms: "Chambres & appartements",
    rates: "Tarifs directs",
    hotelsGuide: "Comparer hôtels & zones de Chios",
  },
  de: {
    kicker: "Planen Sie den Rest Ihres Chios-Aufenthalts",
    title: "Vom Inselguide zu Ihrer Unterkunft im Voulamandis House",
    text: "Vergleichen Sie Gebiete und Unterkunftsarten, entdecken Sie Kambos, sehen Sie die Zimmer an und prüfen Sie aktuelle Direktpreise.",
    house: "Unterkunft auf Chios",
    rooms: "Zimmer & Apartments",
    rates: "Direktpreise",
    hotelsGuide: "Hotels & Gebiete vergleichen",
  },
  it: {
    kicker: "Organizza il resto del tuo soggiorno a Chios",
    title: "Dalla guida dell’isola al tuo alloggio al Voulamandis House",
    text: "Confronta zone e tipi di soggiorno, scopri Kambos, guarda camere e appartamenti e verifica le tariffe dirette.",
    house: "Alloggio a Chios",
    rooms: "Camere & appartamenti",
    rates: "Tariffe dirette",
    hotelsGuide: "Confronta hotel & zone di Chios",
  },
  es: {
    kicker: "Organice el resto de su estancia en Chios",
    title: "De la guía de la isla a su alojamiento en Voulamandis House",
    text: "Compare zonas y tipos de estancia, descubra Kambos, consulte habitaciones y apartamentos y continúe a las tarifas directas.",
    house: "Alojamiento en Chios",
    rooms: "Habitaciones & apartamentos",
    rates: "Tarifas directas",
    hotelsGuide: "Comparar hoteles & zonas de Chios",
  },
  tr: {
    kicker: "Sakız Adası konaklamanızın devamını planlayın",
    title: "Ada rehberinden Voulamandis House’taki odanıza",
    text: "Bölgeleri ve konaklama türlerini karşılaştırın, Kambos’u keşfedin, oda ve daireleri görün ve doğrudan fiyatlara geçin.",
    house: "Sakız Adası konaklaması",
    rooms: "Oda & daireler",
    rates: "Doğrudan fiyatlar",
    hotelsGuide: "Sakız Adası otelleri & bölgeler",
  },
};

const ROUTES: Record<SiteLanguage, { home: string; rooms: string; rates: string; hotelsGuide: string }> = {
  en: { home: "/chios-accommodation/", rooms: "/chios-rooms/", rates: "/chios-hotels-rates/", hotelsGuide: "/chios-hotels/" },
  el: { home: "/el/diamoni-sti-xio/", rooms: "/el/domatia-xios/", rates: "/el/amesi-kratisi-voulamandis-house/", hotelsGuide: "/el/xenodoxeia-xios/" },
  fr: { home: "/fr/hebergement-chios/", rooms: "/fr/chambres-a-chios/", rates: "/fr/tarifs-des-hotels-a-chios/", hotelsGuide: "/fr/hotels-chios/" },
  de: { home: "/de/chios-unterkunft/", rooms: "/de/chios-zimmer/", rates: "/de/hotelpreise-auf-der-insel-chios/", hotelsGuide: "/de/hotels-auf-chios/" },
  it: { home: "/it/alloggio-chios/", rooms: "/it/camere-a-chios/", rates: "/it/prezzi-hotel-chios/", hotelsGuide: "/it/hotel-chios/" },
  es: { home: "/es/alojamiento-chios/", rooms: "/es/habitaciones-en-chios/", rates: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/", hotelsGuide: "/es/hoteles-chios/" },
  tr: { home: "/tr/sakiz-adasi-konaklama/", rooms: "/tr/sakiz-adasi-odalari/", rates: "/tr/sakiz-adasi-rezervasyon/", hotelsGuide: "/tr/sakiz-adasi-otelleri/" },
};

const CONTENT_MARKERS = [
  "beach", "beaches", "paralia", "paralies", "plage", "plages", "strand", "straende", "spiaggia", "spiagge", "playa", "playas", "plaj",
  "village", "villages", "xoria", "chorio", "köy", "koy", "dorf", "doerfer", "villaggio", "villaggi", "pueblo",
  "museum", "museums", "mouseio", "musee", "museo", "musei", "museen", "muze",
  "activities", "activity", "drastiriotites", "aktivitaeten", "attivita", "actividades", "aktiviteler",
  "chios-island", "chios-insel", "chios-en-grece", "chios-lisola-in-grecia", "chios-en-grecia", "chios-el", "ti-na-do-sti-xio", "sakiz-adasi",
];

const LANDING_PATHS = new Set([
  "/chios-hotels", "/el/xenodoxeia-xios", "/fr/hotels-chios", "/de/hotels-auf-chios", "/it/hotel-chios", "/es/hoteles-chios", "/tr/sakiz-adasi-otelleri",
  "/chios-accommodation", "/el/diamoni-sti-xio", "/fr/hebergement-chios", "/de/chios-unterkunft", "/it/alloggio-chios", "/es/alojamiento-chios", "/tr/sakiz-adasi-konaklama",
]);

function shouldShow(pathname: string) {
  const normalized = pathname.toLowerCase().replace(/\/$/, "");
  if (LANDING_PATHS.has(normalized)) return false;
  return CONTENT_MARKERS.some((marker) => normalized.includes(marker));
}

function trackJourney(destination: "house" | "rooms" | "rates" | "hotels_guide", pathname: string, language: SiteLanguage) {
  const browserWindow = window as GtagWindow;
  browserWindow.gtag?.("event", "seo_journey_click", {
    destination,
    source_page: pathname,
    source_type: "seo_content",
    source_position: "pre_footer_journey",
    language,
  });
}

export function ExploreVoulamandisJourney({ language, pathname }: Props) {
  if (!shouldShow(pathname)) return null;
  const copy = COPY[language];
  const routes = ROUTES[language];

  return (
    <section className="bg-[#f5efe6] px-4 py-12 md:px-6 md:py-20" aria-labelledby="seo-journey-title">
      <div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[34px] bg-[#263127] text-white shadow-2xl md:grid-cols-[1.08fr_0.92fr] md:rounded-[42px]">
        <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-[#e7c98d]">{copy.kicker}</span>
          <h2 id="seo-journey-title" className="mt-4 max-w-[760px] text-3xl font-black leading-tight tracking-[-0.045em] text-white md:text-5xl">{copy.title}</h2>
          <p className="mt-5 max-w-[720px] text-base leading-8 text-white/80 md:text-lg">{copy.text}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <a onClick={() => trackJourney("hotels_guide", pathname, language)} href={routes.hotelsGuide} className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-200/35 bg-amber-100/10 px-5 py-3 text-center text-sm font-black !text-amber-100 transition hover:bg-amber-100 hover:!text-[#263127]">{copy.hotelsGuide}</a>
            <a onClick={() => trackJourney("house", pathname, language)} href={routes.home} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-5 py-3 text-center text-sm font-black !text-white transition hover:bg-white/10">{copy.house}</a>
            <a onClick={() => trackJourney("rooms", pathname, language)} href={routes.rooms} className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 text-center text-sm font-black !text-[#263127] shadow-lg transition hover:-translate-y-0.5">{copy.rooms}</a>
            <a onClick={() => trackJourney("rates", pathname, language)} href={routes.rates} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d8b36a] px-5 py-3 text-center text-sm font-black !text-[#201a10] shadow-lg transition hover:-translate-y-0.5">{copy.rates}</a>
          </div>
        </div>
        <div className="relative min-h-[280px] md:min-h-full">
          <Image src="/images/beaches/voulamandis-house-courtyard-chios.webp" alt="Voulamandis House courtyard in Kambos, Chios" fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#263127]/65 via-transparent to-transparent md:bg-gradient-to-r md:from-[#263127]/35 md:via-transparent md:to-transparent" />
        </div>
      </div>
    </section>
  );
}
