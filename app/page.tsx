import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { homePageEn } from "@/content/home";
import { homePageSchema } from "@/content/schema";

export const metadata: Metadata = {
  metadataBase: new URL("https://chioshotel.gr"),
  title: homePageEn.seo.title,
  description: homePageEn.seo.description,
  alternates: {
    canonical: "https://chioshotel.gr/",
    languages: {
      en: "https://chioshotel.gr/",
      el: "https://chioshotel.gr/el/",
      fr: "https://chioshotel.gr/fr/",
      de: "https://chioshotel.gr/de/",
      it: "https://chioshotel.gr/it/",
      es: "https://chioshotel.gr/es/",
      tr: "https://chioshotel.gr/tr/",
      "x-default": "https://chioshotel.gr/",
    },
  },
  openGraph: {
    type: "website",
    url: "https://chioshotel.gr/",
    siteName: "Voulamandis House",
    title: homePageEn.seo.title,
    description: homePageEn.seo.description,
    locale: "en_US",
    alternateLocale: ["el_GR", "fr_FR", "de_DE", "it_IT", "es_ES", "tr_TR"],
    images: [
      {
        url:
          homePageEn.seo.ogImage ||
          "https://chioshotel.gr/images/voulamandis-house-og.jpg",
        width: 1200,
        height: 675,
        alt: homePageEn.seo.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homePageEn.seo.title,
    description: homePageEn.seo.description,
    images: [
      homePageEn.seo.ogImage ||
        "https://chioshotel.gr/images/voulamandis-house-og.jpg",
    ],
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
};

export default function Page() {
  return (
    <>
      <JsonLd data={homePageSchema} />
      <HomePage data={homePageEn} />
    </>
  );
}