import type { Metadata } from "next";
import { languages, normalizePath, type LanguageCode } from "./languages";
import { seoSnippetOverrides } from "./seo-snippet-overrides";
import { preferredMetadataTitles } from "./seo-title-overrides";
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

const manualLocalizedPathGroups: ReadonlyArray<
  Partial<Record<LanguageCode, string>>
> = [
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

const polishAlternateGroups: ReadonlyArray<{
  pl: string;
  paths: readonly string[];
}> = [
  {
    pl: "/pl/",
    paths: ["/", "/el/", "/fr/", "/de/", "/it/", "/es/", "/tr/"],
  },
  {
    pl: "/pl/noclegi-chios/",
    paths: [
      "/chios-accommodation/",
      "/el/diamoni-sti-xio/",
      "/fr/hebergement-chios/",
      "/de/chios-unterkunft/",
      "/it/alloggio-chios/",
      "/es/alojamiento-chios/",
      "/tr/sakiz-adasi-konaklama/",
    ],
  },
  {
    pl: "/pl/hotele-chios/",
    paths: [
      "/chios-hotels/",
      "/el/xenodoxeia-xios/",
      "/fr/hotels-chios/",
      "/de/hotels-auf-chios/",
      "/it/hotel-chios/",
      "/es/hoteles-chios/",
      "/tr/sakiz-adasi-otelleri/",
    ],
  },
  {
    pl: "/pl/pokoje-na-chios/",
    paths: [
      "/chios-rooms/",
      "/el/domatia-xios/",
      "/fr/chambres-a-chios/",
      "/de/chios-zimmer/",
      "/it/camere-a-chios/",
      "/es/habitaciones-en-chios/",
      "/tr/sakiz-adasi-odalari/",
    ],
  },
  {
    pl: "/pl/apartamenty-na-chios/",
    paths: [
      "/chios-rooms/family-chios-apartments/",
      "/el/domatia-xios/oikogeneiako-diamerisma/",
      "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
      "/de/zimmer-chios/familienapartments-in-chios/",
      "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
      "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
      "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
    ],
  },
  {
    pl: "/pl/rezerwacja/",
    paths: [
      "/chios-hotels-rates/",
      "/el/amesi-kratisi-voulamandis-house/",
      "/fr/tarifs-des-hotels-a-chios/",
      "/de/hotelpreise-auf-der-insel-chios/",
      "/it/prezzi-hotel-chios/",
      "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
      "/tr/sakiz-adasi-rezervasyon/",
    ],
  },
  {
    pl: "/pl/kambos-chios/",
    paths: [
      "/chios/kampos-chios/",
      "/el/chios/kampos-chios/",
      "/fr/chios/kampos-chios/",
      "/de/chios/kampos-chios/",
      "/it/chios/kampos-chios/",
      "/es/chios/kampos-chios/",
      "/tr/chios/kampos-chios/",
    ],
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

function normalizeMetadataTitle(path: string, title: string): string {
  const pathOverride = seoSnippetOverrides.get(normalizePath(path));

  if (pathOverride) {
    return pathOverride.title;
  }

  const duplicateBrandSuffix = ` | ${siteName}`;
  const trimmedTitle = title.trim();
  const unbrandedTitle = trimmedTitle.endsWith(duplicateBrandSuffix)
    ? trimmedTitle.slice(0, -duplicateBrandSuffix.length).trim()
    : trimmedTitle;

  return preferredMetadataTitles.get(unbrandedTitle) || unbrandedTitle;
}

function normalizeMetadataDescription(path: string, description: string): string {
  return (
    seoSnippetOverrides.get(normalizePath(path))?.description || description.trim()
  );
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

function getPolishAlternate(path: string): string | undefined {
  const normalizedPath = normalizePath(path);
  const group = polishAlternateGroups.find((candidate) =>
    candidate.paths.some((candidatePath) => normalizePath(candidatePath) === normalizedPath),
  );

  return group?.pl;
}

function withPolishAlternate(
  path: string,
  alternates: Record<string, string>,
): Record<string, string> {
  const polishPath = getPolishAlternate(path);

  if (polishPath) {
    alternates.pl = absoluteUrl(polishPath);
  }

  return alternates;
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
    return withPolishAlternate(path, getManualAlternates(path));
  }

  const publishedRoutes = localizedRoutes.filter(isIndexableRoute);

  if (!publishedRoutes.length) {
    return withPolishAlternate(path, getManualAlternates(path));
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

  return withPolishAlternate(path, alternates);
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
  const title = normalizeMetadataTitle(input.path, input.title);
  const description = normalizeMetadataDescription(
    input.path,
    input.description,
  );
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
    description,
    alternates: buildAlternates(input.path),
    robots,
    openGraph: {
      type: input.ogType || "website",
      url: canonicalUrl,
      siteName,
      title,
      description,
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
      description,
      images: [imageUrl],
    },
  };
}
