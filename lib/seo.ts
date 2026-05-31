import type { Metadata } from "next";
import { languages, normalizePath, type LanguageCode } from "./languages";
import { getLocalizedRoutes, getRouteByPath } from "./url-map";

export const siteUrl = "https://chioshotel.gr";

export type SeoInput = {
  path: string;
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path: string): string {
  if (!path) {
    return siteUrl;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/") {
    return siteUrl;
  }

  return `${siteUrl}${normalizedPath}`;
}

export function getCanonicalUrl(path: string): string {
  const route = getRouteByPath(path);

  if (!route) {
    return absoluteUrl(path);
  }

  return absoluteUrl(route.canonicalPath || route.path);
}

export function getAlternates(path: string): Record<string, string> {
  const localizedRoutes = getLocalizedRoutes(path);

  if (!localizedRoutes.length) {
    return {};
  }

  const alternates: Record<string, string> = {};

  for (const route of localizedRoutes) {
    const language = languages.find((item) => item.code === route.language);

    if (!language) {
      continue;
    }

    alternates[language.hreflang] = absoluteUrl(route.path);
  }

  const englishRoute = localizedRoutes.find((route) => route.language === "en");

  if (englishRoute) {
    alternates["x-default"] = absoluteUrl(englishRoute.path);
  }

  return alternates;
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

export function buildPageMetadata(input: SeoInput): Metadata {
  const canonicalUrl = getCanonicalUrl(input.path);
  const alternates = getAlternates(input.path);
  const imageUrl = input.image ? absoluteUrl(input.image) : absoluteUrl("/og-image.jpg");

  if (input.noIndex) {
    return {
      title: input.title,
      description: input.description,
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: canonicalUrl,
        languages: alternates,
      },
      robots: {
        index: false,
        follow: false,
      },
      openGraph: {
        type: "website",
        url: canonicalUrl,
        siteName: "Voulamandis House",
        title: input.title,
        description: input.description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 675,
            alt: input.title,
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

  return {
    title: input.title,
    description: input.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "Voulamandis House",
      title: input.title,
      description: input.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 675,
          alt: input.title,
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