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
}> = {
  en: {
    kicker: "Plan the rest of your Chios stay",
    title: "From island guide to your room at Voulamandis House",
    text: "You have found a place worth visiting. Now discover our quiet base in Kambos, compare the rooms and continue to current direct rates.",
    house: "Explore Chios accommodation",
    rooms: "Explore rooms & apartments",
    rates: "Check direct rates",
  },
  el: {
    kicker: "Οργανώστε την υπόλοιπη διαμονή σας στη Χίο",
    title: "Από τον οδηγό της Χίου στο δωμάτιό σας στο Voulamandis House",
    text: "Βρήκατε ένα μέρος που αξίζει να επισκεφθείτε. Γνωρίστε τη βάση μας στον Κάμπο, δείτε τα δωμάτια και συνεχίστε στις τρέχουσες απευθείας τιμές.",
    house: "Γνωρίστε το Voulamandis House",
    rooms: "Δείτε δωμάτια & διαμερίσματα",
    rates: "Δείτε απευθείας τιμές",
  },
  fr: {
    kicker: "Organisez la suite de votre séjour à Chios",
    title: "Du guide de l’île à votre chambre au Voulamandis House",
    text: "Vous avez trouvé un lieu à visiter. Découvrez maintenant notre adresse paisible à Kambos, comparez les chambres et consultez les tarifs directs.",
    house: "Découvrir Voulamandis House",
    rooms: "Voir chambres et appartements",
    rates: "Voir les tarifs directs",
  },
  de: {
    kicker: "Planen Sie den Rest Ihres Chios-Aufenthalts",
    title: "Vom Inselguide zu Ihrem Zimmer im Voulamandis House",
    text: "Sie haben einen sehenswerten Ort gefunden. Entdecken Sie nun unsere ruhige Basis in Kambos, vergleichen Sie die Zimmer und prüfen Sie die Direktpreise.",
    house: "Voulamandis House entdecken",
    rooms: "Zimmer & Apartments ansehen",
    rates: "Direktpreise prüfen",
  },
  it: {
    kicker: "Organizza il resto del tuo soggiorno a Chios",
    title: "Dalla guida dell’isola alla tua camera al Voulamandis House",
    text: "Hai trovato un luogo da visitare. Ora scopri la nostra base tranquilla a Kambos, confronta camere e appartamenti e consulta le tariffe dirette.",
    house: "Scopri Voulamandis House",
    rooms: "Vedi camere e appartamenti",
    rates: "Vedi tariffe dirette",
  },
  es: {
    kicker: "Planifica el resto de tu estancia en Chios",
    title: "De la guía de la isla a tu habitación en Voulamandis House",
    text: "Has encontrado un lugar que merece una visita. Descubre ahora nuestra tranquila base en Kambos, compara habitaciones y consulta las tarifas directas.",
    house: "Conoce Voulamandis House",
    rooms: "Ver habitaciones y apartamentos",
    rates: "Consultar tarifas directas",
  },
  tr: {
    kicker: "Sakız Adası konaklamanızın devamını planlayın",
    title: "Ada rehberinden Voulamandis House’taki odanıza",
    text: "Görmeye değer bir yer buldunuz. Şimdi Kambos’taki sakin konaklama noktamızı keşfedin, odaları karşılaştırın ve doğrudan fiyatları inceleyin.",
    house: "Voulamandis House’u keşfet",
    rooms: "Oda ve daireleri gör",
    rates: "Doğrudan fiyatları gör",
  },
};

const ROUTES: Record<SiteLanguage, { home: string; rooms: string; rates: string }> = {
  en: { home: "/chios-accommodation/", rooms: "/chios-rooms/", rates: "/chios-hotels-rates/" },
  el: { home: "/el/", rooms: "/el/domatia-xios/", rates: "/el/times-domation-xios/" },
  fr: { home: "/fr/", rooms: "/fr/chambres-a-chios/", rates: "/fr/tarifs-chambres-chios/" },
  de: { home: "/de/", rooms: "/de/chios-zimmer/", rates: "/de/chios-zimmer-preise/" },
  it: { home: "/it/", rooms: "/it/camere-a-chios/", rates: "/it/prezzi-camere-chios/" },
  es: { home: "/es/", rooms: "/es/habitaciones-en-chios/", rates: "/es/precios-habitaciones-chios/" },
  tr: { home: "/tr/", rooms: "/tr/sakiz-adasi-odalari/", rates: "/tr/sakiz-adasi-oda-fiyatlari/" },
};

const CONTENT_MARKERS = [
  "beach", "beaches", "paralia", "paralies", "plage", "plages", "strand", "straende", "spiaggia", "spiagge", "playa", "playas", "plaj",
  "village", "villages", "xoria", "chorio", "köy", "koy", "dorp", "dorf", "villaggio", "pueblo",
  "museum", "museums", "mouseio", "musee", "museo", "muze",
  "activities", "activity", "drastiriotites", "aktivitaeten", "attivita", "actividades", "aktiviteler",
  "chios-island", "chios-el", "sakiz-adasi",
];

function shouldShow(pathname: string) {
  const normalized = pathname.toLowerCase();
  return CONTENT_MARKERS.some((marker) => normalized.includes(marker));
}

function track(destination: "house" | "rooms" | "rates", pathname: string, language: SiteLanguage) {
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
          <h2 id="seo-journey-title" className="mt-4 max-w-[760px] text-3xl font-black leading-tight tracking-[-0.045em] text-white md:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-[720px] text-base leading-8 text-white/80 md:text-lg">{copy.text}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <a onClick={() => track("house", pathname, language)} href={routes.home} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-5 py-3 text-center text-sm font-black !text-white transition hover:bg-white/10">
              {copy.house}
            </a>
            <a onClick={() => track("rooms", pathname, language)} href={routes.rooms} className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 text-center text-sm font-black !text-[#263127] shadow-lg transition hover:-translate-y-0.5">
              {copy.rooms}
            </a>
            <a onClick={() => track("rates", pathname, language)} href={routes.rates} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d8b36a] px-5 py-3 text-center text-sm font-black !text-[#201a10] shadow-lg transition hover:-translate-y-0.5">
              {copy.rates}
            </a>
          </div>
        </div>
        <div className="relative min-h-[280px] md:min-h-full">
          <Image
            src="/images/beaches/voulamandis-house-courtyard-chios.webp"
            alt="Voulamandis House courtyard in Kambos, Chios"
            fill
            sizes="(min-width: 768px) 42vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#263127]/65 via-transparent to-transparent md:bg-gradient-to-r md:from-[#263127]/35 md:via-transparent md:to-transparent" />
        </div>
      </div>
    </section>
  );
}
