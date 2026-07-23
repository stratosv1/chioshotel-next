import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePageTailwindV3 } from "@/components/home/HomePageTailwindV3";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  homePageDe,
  homePageEl,
  homePageEn,
  homePageEs,
  homePageFr,
  homePageIt,
  homePageTr,
} from "@/content/home";
import type { HomePageData } from "@/content/home";
import { withUpdatedIntroReasons } from "@/content/homeIntroReasons";
import { buildHomePageSchema } from "@/content/schema";
import { buildPageMetadata } from "@/lib/seo";
import { defaultLanguage, isLanguageCode, languages } from "@/lib/languages";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const localizedLanguages = languages.filter(
  (language) => language.code !== defaultLanguage,
);

function withSeoTitle(data: HomePageData, title: string): HomePageData {
  return withUpdatedIntroReasons({
    ...data,
    seo: {
      ...data.seo,
      title,
    },
  });
}

function withFrenchHomepageCopy(data: HomePageData): HomePageData {
  return {
    ...data,
    hero: {
      ...data.hero,
      title: "Chambres et appartements à Chios, au cœur de Kambos",
      descriptionHtml:
        "Vous recherchez des <strong>chambres à Chios</strong> ou un <strong>appartement à Chios</strong> ? <strong>Voulamandis House</strong> vous accueille à Kambos avec des chambres confortables, des appartements familiaux et une atmosphère paisible.",
      imageAlt:
        "Chambres et appartements à Chios - Voulamandis House à Kambos",
    },
    intro: {
      ...data.intro,
      left: {
        ...data.intro.left,
        bodyHtml:
          "Vous recherchez des <strong>chambres à Chios</strong> ou un <strong>hébergement à Chios</strong> pour un séjour calme et soigné ? Voulamandis House vous accueille dans le quartier historique de Kambos, dans un cadre verdoyant et authentique, avec une hospitalité personnelle.",
      },
    },
    roomsPreview: {
      ...data.roomsPreview,
      sideCard: {
        ...data.roomsPreview.sideCard,
        text: "Si vous recherchez un hébergement à Chios avec une hospitalité plus personnelle, Voulamandis House offre une alternative authentique à Kambos.",
      },
    },
  };
}

function withItalianHomepageCopy(data: HomePageData): HomePageData {
  return {
    ...data,
    hero: {
      ...data.hero,
      title: "Camere e appartamenti a Chios, nel cuore di Kambos",
      descriptionHtml:
        "Cerchi <strong>camere a Chios</strong> o un <strong>appartamento a Chios</strong>? <strong>Voulamandis House</strong> ti accoglie a Kambos con camere confortevoli, appartamenti familiari e un’atmosfera tranquilla.",
      imageAlt:
        "Camere e appartamenti a Chios - Voulamandis House a Kambos",
    },
    intro: {
      ...data.intro,
      left: {
        ...data.intro.left,
        bodyHtml:
          "Cerchi <strong>camere a Chios</strong> o un <strong>alloggio a Chios</strong> per un soggiorno tranquillo e curato? Voulamandis House ti accoglie nella storica zona di Kambos, tra giardini e agrumeti, con un’ospitalità personale e autentica.",
      },
    },
    roomsPreview: {
      ...data.roomsPreview,
      sideCard: {
        ...data.roomsPreview.sideCard,
        text: "Per chi cerca un alloggio a Chios con un’ospitalità più personale, Voulamandis House è una scelta autentica e tranquilla a Kambos.",
      },
    },
  };
}

function getLocalizedHomePageData(locale: string): HomePageData {
  switch (locale) {
    case "el":
      return withSeoTitle(
        homePageEl,
        "Voulamandis House | Δωμάτια & Διαμερίσματα στη Χίο",
      );
    case "fr":
      return withSeoTitle(
        withFrenchHomepageCopy(homePageFr),
        "Voulamandis House | Chambres & Appartements à Chios",
      );
    case "de":
      return withSeoTitle(
        homePageDe,
        "Voulamandis House | Zimmer & Apartments auf Chios",
      );
    case "it":
      return withSeoTitle(
        withItalianHomepageCopy(homePageIt),
        "Voulamandis House | Camere & Appartamenti a Chios",
      );
    case "es":
      return withSeoTitle(
        homePageEs,
        "Voulamandis House | Habitaciones & Apartamentos en Chios",
      );
    case "tr":
      return withSeoTitle(
        homePageTr,
        "Voulamandis House | Sakız Adası Odaları ve Daireleri",
      );
    default:
      return withUpdatedIntroReasons(homePageEn);
  }
}

export function generateStaticParams() {
  return localizedLanguages.map((language) => ({
    locale: language.code,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    return {};
  }

  const data = getLocalizedHomePageData(locale);

  return buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    notFound();
  }

  const data = getLocalizedHomePageData(locale);

  return (
    <>
      <JsonLd data={buildHomePageSchema(data)} />
      <HomePageTailwindV3 data={data} />
    </>
  );
}
