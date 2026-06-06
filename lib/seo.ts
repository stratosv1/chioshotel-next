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
    title: input.title,
    description: input.description,
    alternates: buildAlternates(input.path),
    robots,
    openGraph: {
      type: input.ogType || "website",
      url: canonicalUrl,
      siteName,
      title: input.title,
      description: input.description,
      locale,
      alternateLocale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 675,
          alt: input.imageAlt || input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [imageUrl],
    },
  };
}
