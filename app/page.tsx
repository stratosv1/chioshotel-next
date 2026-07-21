import type { Metadata } from "next";
import { HomePageTailwindV3 } from "@/components/home/HomePageTailwindV3";
import { JsonLd } from "@/components/seo/JsonLd";
import { homePageEn } from "@/content/home";
import { withUpdatedIntroReasons } from "@/content/homeIntroReasons";
import { buildHomePageSchema } from "@/content/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const homePageData = withUpdatedIntroReasons({
  ...homePageEn,
  seo: {
    ...homePageEn.seo,
    title: "Voulamandis House | Rooms & Apartments in Chios",
  },
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chioshotel.gr"),
  title: homePageData.seo.title,
  description: homePageData.seo.description,
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
    title: homePageData.seo.title,
    description: homePageData.seo.description,
    locale: "en_US",
    alternateLocale: ["el_GR", "fr_FR", "de_DE", "it_IT", "es_ES", "tr_TR"],
    images: [
      {
        url:
          homePageData.seo.ogImage ||
          "https://chioshotel.gr/images/voulamandis-house-og.jpg",
        width: 1200,
        height: 675,
        alt: homePageData.seo.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homePageData.seo.title,
    description: homePageData.seo.description,
    images: [
      homePageData.seo.ogImage ||
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
      <JsonLd data={buildHomePageSchema(homePageData)} />
      <HomePageTailwindV3 data={homePageData} />
    </>
  );
}
