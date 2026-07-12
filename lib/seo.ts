import type { Metadata } from "next";
import { languages, normalizePath, type LanguageCode } from "./languages";
import { getLocalizedRoutes, getRouteByPath } from "./url-map";

export const siteUrl = "https://chioshotel.gr";
export const siteName = "Voulamandis House";
export const defaultOgImage = "/images/voulamandis-house-og.jpg";

export type SeoInput = {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
};

const preferredMetadataTitles = new Map<string, string>([
  ["Chios for Beach Lovers", "Chios Beaches for Sea Lovers | Best Coastal Spots"],
  ["Economy Double Rooms in Chios", "Economy Double Rooms in Chios | Comfortable Stay"],
  ["Top Chios Beaches", "Best Beaches in Chios | Complete Island Guide"],
  ["Mesta Chios", "Mesta Village in Chios | Medieval Mastic Village"],
  ["Book Direct in Chios", "Rooms & Apartments in Chios | Book Direct"],
  ["Chios Villages Guide", "Villages of Chios | Complete Island Guide"],
  ["Family Apartments in Chios", "Family Apartments in Chios | Spacious Island Stay"],
  ["Chios Museums Guide", "Museums in Chios | History, Culture & Mastic"],
  ["Chios Holiday Quiz", "Chios Holiday Quiz | Find Your Ideal Island Experience"],
  ["Komi Beach Chios", "Komi Beach in Chios | Access, Facilities & Tips"],
  ["Rocket War of Chios", "Chios Rocket War | Easter Tradition in Vrontados"],
  ["Chios Hiking Trails", "Hiking in Chios | Trails, Routes & Nature"],
  ["Koraes Library Chios", "Koraes Library in Chios | History & Visitor Guide"],
  ["Organized Beaches in Chios", "Organized Beaches in Chios | Facilities & Access"],
  ["Sheltered Beaches in Chios", "Sheltered Beaches in Chios | Calm Water Guide"],
  ["Sandy Beaches in Chios", "Sandy Beaches in Chios | Complete Beach Guide"],
  ["Olympoi Chios", "Olympoi Village in Chios | Medieval Mastic Village"],
  ["Chios Byzantine Museum", "Chios Byzantine Museum | Art, History & Visitor Guide"],
  ["Chios Maritime Museum", "Chios Maritime Museum | History & Visitor Guide"],
  ["Medieval Villages of Chios", "Medieval Villages of Chios | History & Castles"],
  ["Seaside Villages of Chios", "Seaside Villages of Chios | Coastal Guide & Routes"],
  ["Mastic Villages of Chios", "Mastic Villages of Chios | Culture & Scenic Routes"],
  ["Γεύσεις της Χίου", "Γεύσεις της Χίου | Τοπικά προϊόντα & φαγητό"],
  ["Εξερεύνηση Χίου", "Εξερεύνηση Χίου | Αξιοθέατα & εμπειρίες"],
  ["Quiz Διακοπών στη Χίο 2026", "Quiz διακοπών στη Χίο | Βρες τι σου ταιριάζει"],
  ["Παραλία Λιθί Χίος", "Παραλία Λιθί Χίου | Πρόσβαση & παροχές"],
  ["Saveurs de Chios", "Saveurs de Chios | Cuisine et produits locaux"],
  ["Explorer Chios", "Explorer Chios | Sites, villages et expériences"],
  ["Quiz vacances à Chios 2026", "Quiz vacances à Chios | Trouvez votre séjour idéal"],
  ["Chios für Genießer", "Chios für Genießer | Küche und lokale Produkte"],
  ["Chios Urlaubsquiz 2026", "Chios-Urlaubsquiz | Finden Sie Ihre ideale Reise"],
  ["Agia Dynami Strand Chios", "Agia-Dynami-Strand auf Chios | Anfahrt und Tipps"],
  ["Lithi Strand Chios", "Lithi-Strand auf Chios | Anfahrt und Ausstattung"],
  ["Komi Strand Chios", "Komi-Strand auf Chios | Anfahrt und Ausstattung"],
  ["Agia Fotia Strand Chios", "Agia-Fotia-Strand auf Chios | Anfahrt und Tipps"],
  ["Sapori di Chios", "Sapori di Chios | Cucina e prodotti locali"],
  ["Quiz vacanze a Chios 2026", "Quiz vacanze a Chios | Trova il soggiorno ideale"],
  ["Spiaggia Agia Fotia Chios", "Spiaggia Agia Fotia a Chios | Accesso e consigli"],
  ["Spiaggia di Komi Chios", "Spiaggia di Komi a Chios | Accesso e servizi"],
  ["Sabores de Quíos", "Sabores de Quíos | Cocina y productos locales"],
  ["Playa de Komi Chios", "Playa de Komi en Quíos | Acceso y servicios"],
  ["Sakız Adası Lezzetleri", "Sakız Adası lezzetleri | Yerel yemekler ve ürünler"],
  ["Sakız Adası tatil testi 2026", "Sakız Adası tatil testi | Size uygun rotayı bulun"],
  ["Komi Plajı Sakız Adası", "Komi Plajı, Sakız Adası | Ulaşım ve olanaklar"],
  ["Unterkunft auf Chios", "Unterkunft auf Chios | Ruhige Zimmer & Apartments"],
  ["Hotel en Chios", "Alojamiento en Quíos | Habitaciones y apartamentos"],
  ["Sakız Adası Oteli", "Sakız Adası konaklama | Oda ve daireler"],
  ["Ξενοδοχείο στη Χίο", "Δωμάτια & διαμερίσματα στη Χίο | Ήρεμη διαμονή"],
  ["Hotel a Chios", "Camere e appartamenti a Chios | Soggiorno tranquillo"],
  ["Hôtel à Chios", "Chambres et appartements à Chios | Séjour au calme"],
  ["Camere e appartamenti a Chios", "Camere e appartamenti a Chios | Guida completa"],
  ["Prenota diretto a Chios", "Prenota diretto a Chios | Miglior tariffa disponibile"],
  ["Réservation directe à Chios", "Réservation directe à Chios | Meilleur tarif"],
  ["Άμεση Κράτηση στη Χίο", "Άμεση κράτηση στη Χίο | Καλύτερη διαθέσιμη τιμή"],
  ["Villages de Chios", "Villages de Chios | Guide des plus beaux villages"],
  ["Χωριά της Χίου", "Χωριά της Χίου | Οδηγός για τα ομορφότερα χωριά"],
  ["Sakız Adası Köyleri", "Sakız Adası köyleri | En güzel köyler rehberi"],
  ["Villaggi di Chios", "Villaggi di Chios | Guida ai borghi più belli"],
  ["Chios für Strandliebhaber", "Chios für Strandliebhaber | Die besten Küstenorte"],
  ["Chios per amanti del mare", "Chios per amanti del mare | Spiagge e baie"],
  ["Sakız Adası Aktiviteleri", "Sakız Adası aktiviteleri | Yapılacak en iyi şeyler"],
  ["Δραστηριότητες στη Χίο", "Δραστηριότητες στη Χίο | Τι να κάνετε στο νησί"],
  ["Aktivitäten auf Chios", "Aktivitäten auf Chios | Die besten Erlebnisse"],
  ["Actividades en Quíos", "Actividades en Quíos | Qué hacer en la isla"],
  ["Vacanze in Famiglia a Chios", "Vacanze in famiglia a Chios | Guida per famiglie"],
  ["Vacances en Famille à Chios", "Vacances en famille à Chios | Guide pratique"],
  ["Familienurlaub auf Chios", "Familienurlaub auf Chios | Tipps und Ausflüge"],
  ["Sakız Adası Aile Tatili", "Sakız Adası aile tatili | Aileler için rehber"],
  ["Camera Doppia Economy a Chios", "Camera doppia economy a Chios | Comfort e valore"],
  ["Plages de Chios", "Plages de Chios | Guide complet des plus belles plages"],
  ["Spiagge di Chios", "Spiagge di Chios | Guida completa alle migliori spiagge"],
  ["Παραλίες Χίου", "Παραλίες Χίου | Πλήρης οδηγός για τις καλύτερες ακτές"],
  ["Strände auf Chios", "Strände auf Chios | Kompletter Guide zu den besten Stränden"],
  ["Playas de Chios", "Playas de Quíos | Guía completa de las mejores playas"],
  ["Sakız Adası Plajları", "Sakız Adası plajları | En güzel plajlar rehberi"],
  ["Offres de séjour à Chios 2026", "Offres de séjour à Chios 2026 | Réservez en direct"],
  ["Offerte hotel a Chios 2026", "Offerte soggiorno a Chios 2026 | Prenota diretto"],
  ["Familienapartments auf Chios", "Familienapartments auf Chios | Geräumiger Aufenthalt"],
  ["Museen auf Chios", "Museen auf Chios | Geschichte, Kultur und Mastix"],
  ["Direkt buchen auf Chios", "Direkt buchen auf Chios | Beste verfügbare Rate"],
  ["Dörfer auf Chios", "Dörfer auf Chios | Guide zu den schönsten Orten"],
  ["Orchideen auf Chios", "Orchideen auf Chios | Arten, Saison und Fundorte"],
  ["Reserva directa en Quíos", "Reserva directa en Quíos | Mejor tarifa disponible"],
  ["Orquídeas de Quíos", "Orquídeas de Quíos | Especies, temporada y lugares"],
  ["Pueblos de Chios", "Pueblos de Quíos | Guía de los lugares más bonitos"],
  ["Museos de Chios", "Museos de Quíos | Historia, cultura y mástique"],
  ["Ορχιδέες της Χίου", "Ορχιδέες της Χίου | Είδη, εποχή και τοποθεσίες"],
  ["Orchidées de Chios", "Orchidées de Chios | Espèces, saison et lieux"],
  ["Sakız Adası Orkideleri", "Sakız Adası orkideleri | Türler, sezon ve yerler"],
  ["Orchidee di Chios", "Orchidee di Chios | Specie, stagione e luoghi"],
  ["Sakız Adası Aile Apartları", "Sakız Adası aile daireleri | Geniş ve rahat konaklama"],
  ["Sakız Adası Müzeleri", "Sakız Adası müzeleri | Tarih, kültür ve mastik"],
  ["Musées de Chios", "Musées de Chios | Histoire, culture et mastic"],
  ["Musei di Chios", "Musei di Chios | Storia, cultura e mastice"],
  ["Μουσεία Χίου", "Μουσεία Χίου | Ιστορία, πολιτισμός και μαστίχα"],
  ["Festival Mostra a Chios", "Festival Mostra a Chios | Tradizione di Thymiana"],
  ["Festival Mostra à Chios", "Festival Mostra à Chios | Tradition de Thymiana"],
  ["Mostra Festival auf Chios", "Mostra Festival auf Chios | Tradition in Thymiana"],
  ["Wandern auf Chios", "Wandern auf Chios | Wege, Routen und Natur"],
  ["Ρουκετοπόλεμος Χίου", "Ρουκετοπόλεμος Χίου | Πασχαλινό έθιμο στον Βροντάδο"],
  ["Μόστρα Θυμιανών στη Χίο", "Μόστρα Θυμιανών στη Χίο | Έθιμο και πρόγραμμα"],
  ["Πεζοπορία στη Χίο", "Πεζοπορία στη Χίο | Διαδρομές, μονοπάτια και φύση"],
  ["Sakız Adası Roket Savaşı", "Sakız Adası roket savaşı | Vrontados Paskalya geleneği"],
  ["Sakız Adası Yürüyüş Rotaları", "Sakız Adası yürüyüş rotaları | Parkurlar ve doğa"],
  ["Sakız Adası Mostra Festivali", "Sakız Adası Mostra Festivali | Thymiana geleneği"],
  ["Villaggi sul mare a Chios", "Villaggi sul mare a Chios | Guida costiera e percorsi"],
  ["Villaggi del mastice a Chios", "Villaggi del mastice a Chios | Cultura e itinerari"],
  ["Villaggi medievali di Chios", "Villaggi medievali di Chios | Storia e castelli"],
  ["Sakız Adası Sahil Köyleri", "Sakız Adası sahil köyleri | Kıyı rehberi ve rotalar"],
  ["Sakız Adası Mastik Köyleri", "Sakız Adası mastik köyleri | Kültür ve gezi rotaları"],
  ["Μεσαιωνικά χωριά Χίου", "Μεσαιωνικά χωριά Χίου | Ιστορία, κάστρα και διαδρομές"],
  ["Sakız Adası Orta Çağ Köyleri", "Sakız Adası Orta Çağ köyleri | Tarih ve kaleler"],
  ["Παραθαλάσσια χωριά Χίου", "Παραθαλάσσια χωριά Χίου | Οδηγός ακτών και διαδρομών"],
  ["Μαστιχοχώρια Χίου", "Μαστιχοχώρια Χίου | Πολιτισμός και όμορφες διαδρομές"],
  ["Villages médiévaux de Chios", "Villages médiévaux de Chios | Histoire et châteaux"],
  ["Villages du mastic à Chios", "Villages du mastic à Chios | Culture et itinéraires"],
]);

const manualLocalizedPathGroups: ReadonlyArray<Partial<Record<LanguageCode, string>>> = [
  {
    en: "/chios/kampos-chios/",
    el: "/el/chios/kampos-chios/",
    fr: "/fr/chios/kampos-chios/",
    de: "/de/chios/kampos-chios/",
    it: "/it/chios/kampos-chios/",
    es: "/es/chios/kampos-chios/",
    tr: "/tr/chios/kampos-chios/",
  },
];

function splitPath(path: string) {
  const hashIndex = path.indexOf("#");
  const queryIndex = path.indexOf("?");

  const firstSpecialIndex =
    hashIndex === -1
      ? queryIndex
      : queryIndex === -1
        ? hashIndex
        : Math.min(hashIndex, queryIndex);

  if (firstSpecialIndex === -1) {
    return {
      pathname: path,
      suffix: "",
    };
  }

  return {
    pathname: path.slice(0, firstSpecialIndex),
    suffix: path.slice(firstSpecialIndex),
  };
}

function normalizeMetadataTitle(title: string): string {
  const duplicateBrandSuffix = ` | ${siteName}`;
  const trimmedTitle = title.trim();
  const unbrandedTitle = trimmedTitle.endsWith(duplicateBrandSuffix)
    ? trimmedTitle.slice(0, -duplicateBrandSuffix.length).trim()
    : trimmedTitle;

  return preferredMetadataTitles.get(unbrandedTitle) || unbrandedTitle;
}

function buildMetadataTitle(title: string): Metadata["title"] {
  return {
    absolute: title,
  };
}

export function absoluteUrl(path: string): string {
  if (!path) {
    return `${siteUrl}/`;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("#")) {
    return `${siteUrl}/${path}`;
  }

  const { pathname, suffix } = splitPath(path);
  const normalizedPath = normalizePath(pathname);

  if (normalizedPath === "/") {
    return `${siteUrl}/${suffix}`;
  }

  return `${siteUrl}${normalizedPath}${suffix}`;
}

export function getCanonicalUrl(path: string): string {
  const route = getRouteByPath(path);

  if (!route) {
    return absoluteUrl(path);
  }

  return absoluteUrl(route.canonicalPath || route.path);
}

function isIndexableRoute(route: ReturnType<typeof getLocalizedRoutes>[number]) {
  return route.action === "KEEP";
}

function getManualAlternates(path: string): Record<string, string> {
  const normalizedPath = normalizePath(path);
  const group = manualLocalizedPathGroups.find((candidate) =>
    Object.values(candidate).some((candidatePath) =>
      candidatePath ? normalizePath(candidatePath) === normalizedPath : false,
    ),
  );

  if (!group) {
    return {};
  }

  const alternates: Record<string, string> = {};

  for (const language of languages) {
    const localizedPath = group[language.code];
    if (localizedPath) {
      alternates[language.hreflang] = absoluteUrl(localizedPath);
    }
  }

  if (group.en) {
    alternates["x-default"] = absoluteUrl(group.en);
  }

  return alternates;
}

export function getAlternates(path: string): Record<string, string> {
  const localizedRoutes = getLocalizedRoutes(path);

  if (!localizedRoutes.length) {
    return getManualAlternates(path);
  }

  const publishedRoutes = localizedRoutes.filter(isIndexableRoute);

  if (!publishedRoutes.length) {
    return getManualAlternates(path);
  }

  const alternates: Record<string, string> = {};

  for (const route of publishedRoutes) {
    const language = languages.find((item) => item.code === route.language);

    if (!language) {
      continue;
    }

    alternates[language.hreflang] = absoluteUrl(route.path);
  }

  const englishRoute = publishedRoutes.find((route) => route.language === "en");
  const defaultRoute = englishRoute || publishedRoutes[0];

  if (defaultRoute) {
    alternates["x-default"] = absoluteUrl(defaultRoute.path);
  }

  return alternates;
}

export function buildAlternates(
  path: string,
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: getCanonicalUrl(path),
    languages: getAlternates(path),
  };
}

export function getLanguageForPath(path: string): LanguageCode {
  const route = getRouteByPath(path);

  if (route) {
    return route.language;
  }

  const normalizedPath = normalizePath(path);

  const detectedLanguage = languages.find((language) => {
    if (language.code === "en") {
      return false;
    }

    return (
      normalizedPath === `${language.pathPrefix}/` ||
      normalizedPath.startsWith(`${language.pathPrefix}/`)
    );
  });

  return detectedLanguage?.code || "en";
}

export function getLocaleForPath(path: string): string {
  const languageCode = getLanguageForPath(path);
  const language = languages.find((item) => item.code === languageCode);

  return language?.locale || "en_US";
}

export function getAlternateLocales(path: string): string[] {
  const currentLanguage = getLanguageForPath(path);

  return languages
    .filter((language) => language.code !== currentLanguage)
    .map((language) => language.locale);
}

export function buildPageMetadata(input: SeoInput): Metadata {
  const canonicalUrl = getCanonicalUrl(input.path);
  const imageUrl = input.image
    ? absoluteUrl(input.image)
    : absoluteUrl(defaultOgImage);
  const locale = getLocaleForPath(input.path);
  const alternateLocale = getAlternateLocales(input.path);
  const title = normalizeMetadataTitle(input.title);
  const metadataTitle = buildMetadataTitle(title);

  const robots: Metadata["robots"] = input.noIndex
    ? {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      };

  return {
    metadataBase: new URL(siteUrl),
    title: metadataTitle,
    description: input.description,
    alternates: buildAlternates(input.path),
    robots,
    openGraph: {
      type: input.ogType || "website",
      url: canonicalUrl,
      siteName,
      title,
      description: input.description,
      locale,
      alternateLocale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 675,
          alt: input.imageAlt || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      images: [imageUrl],
    },
  };
}
