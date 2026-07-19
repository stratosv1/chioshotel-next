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
