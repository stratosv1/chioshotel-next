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
]);

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

export function getAlternates(path: string): Record<string, string> {
  const localizedRoutes = getLocalizedRoutes(path);

  if (!localizedRoutes.length) {
    return {};
  }

  const publishedRoutes = localizedRoutes.filter(isIndexableRoute);

  if (!publishedRoutes.length) {
    return {};
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
