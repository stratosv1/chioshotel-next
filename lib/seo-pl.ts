import type { Metadata } from "next";
import { absoluteUrl, defaultOgImage, siteName, siteUrl } from "./seo";

type PolishSeoInput = {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

type AlternatePathGroup = Record<string, string>;

const alternatePathGroups: Record<string, AlternatePathGroup> = {
  "/pl/": {
    en: "/",
    el: "/el/",
    fr: "/fr/",
    de: "/de/",
    it: "/it/",
    es: "/es/",
    tr: "/tr/",
    pl: "/pl/",
  },
  "/pl/noclegi-chios/": {
    en: "/chios-accommodation/",
    el: "/el/diamoni-sti-xio/",
    fr: "/fr/hebergement-chios/",
    de: "/de/chios-unterkunft/",
    it: "/it/alloggio-chios/",
    es: "/es/alojamiento-chios/",
    tr: "/tr/sakiz-adasi-konaklama/",
    pl: "/pl/noclegi-chios/",
  },
  "/pl/hotele-chios/": {
    en: "/chios-hotels/",
    el: "/el/xenodoxeia-xios/",
    fr: "/fr/hotels-chios/",
    de: "/de/hotels-auf-chios/",
    it: "/it/hotel-chios/",
    es: "/es/hoteles-chios/",
    tr: "/tr/sakiz-adasi-otelleri/",
    pl: "/pl/hotele-chios/",
  },
  "/pl/pokoje-na-chios/": {
    en: "/chios-rooms/",
    el: "/el/domatia-xios/",
    fr: "/fr/chambres-a-chios/",
    de: "/de/chios-zimmer/",
    it: "/it/camere-a-chios/",
    es: "/es/habitaciones-en-chios/",
    tr: "/tr/sakiz-adasi-odalari/",
    pl: "/pl/pokoje-na-chios/",
  },
  "/pl/apartamenty-na-chios/": {
    en: "/chios-rooms/family-chios-apartments/",
    el: "/el/domatia-xios/oikogeneiako-diamerisma/",
    fr: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
    de: "/de/zimmer-chios/familienapartments-in-chios/",
    it: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
    es: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
    tr: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
    pl: "/pl/apartamenty-na-chios/",
  },
  "/pl/kambos-chios/": {
    en: "/chios/kampos-chios/",
    el: "/el/chios/kampos-chios/",
    fr: "/fr/chios/kampos-chios/",
    de: "/de/chios/kampos-chios/",
    it: "/it/chios/kampos-chios/",
    es: "/es/chios/kampos-chios/",
    tr: "/tr/chios/kampos-chios/",
    pl: "/pl/kambos-chios/",
  },
  "/pl/rezerwacja/": {
    en: "/chios-hotels-rates/",
    el: "/el/amesi-kratisi-voulamandis-house/",
    fr: "/fr/tarifs-des-hotels-a-chios/",
    de: "/de/hotelpreise-auf-der-insel-chios/",
    it: "/it/prezzi-hotel-chios/",
    es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    tr: "/tr/sakiz-adasi-rezervasyon/",
    pl: "/pl/rezerwacja/",
  },
};

function buildLanguages(path: string, canonical: string): Record<string, string> {
  const group = alternatePathGroups[path];

  if (!group) {
    return { pl: canonical };
  }

  const languages = Object.fromEntries(
    Object.entries(group).map(([language, localizedPath]) => [
      language,
      absoluteUrl(localizedPath),
    ]),
  );

  languages["x-default"] = absoluteUrl(group.en || "/");
  return languages;
}

export function buildPolishPageMetadata(input: PolishSeoInput): Metadata {
  const canonical = absoluteUrl(input.path);
  const image = absoluteUrl(input.image || defaultOgImage);
  const languages = buildLanguages(input.path, canonical);

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
