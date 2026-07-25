import type { Metadata } from "next";
import { absoluteUrl, defaultOgImage, siteName, siteUrl } from "./seo";

type PolishSeoInput = {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

const homepageAlternates: Record<string, string> = {
  en: absoluteUrl("/"),
  el: absoluteUrl("/el/"),
  fr: absoluteUrl("/fr/"),
  de: absoluteUrl("/de/"),
  it: absoluteUrl("/it/"),
  es: absoluteUrl("/es/"),
  tr: absoluteUrl("/tr/"),
  pl: absoluteUrl("/pl/"),
  "x-default": absoluteUrl("/"),
};

export function buildPolishPageMetadata(input: PolishSeoInput): Metadata {
  const canonical = absoluteUrl(input.path);
  const image = absoluteUrl(input.image || defaultOgImage);
  const languages = input.path === "/pl/" ? homepageAlternates : { pl: canonical };

  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: input.title },
    description: input.description,
    alternates: {
      canonical,
      languages,
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
      url: canonical,
      siteName,
      title: input.title,
      description: input.description,
      locale: "pl_PL",
      alternateLocale: ["en_US", "el_GR", "fr_FR", "de_DE", "it_IT", "es_ES", "tr_TR"],
      images: [
        {
          url: image,
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
      images: [image],
    },
  };
}
