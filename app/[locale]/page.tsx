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

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const localizedLanguages = languages.filter(
  (language) => language.code !== defaultLanguage,
);

const localizedBookingCta: Record<
  string,
  { label: string; href: string }
> = {
  el: {
    label: "Κράτηση",
    href: "/el/amesi-kratisi-voulamandis-house/",
  },
  fr: {
    label: "Réserver",
    href: "/fr/tarifs-des-hotels-a-chios/",
  },
  de: {
    label: "Buchen",
    href: "/de/hotelpreise-auf-der-insel-chios/",
  },
  it: {
    label: "Prenota",
    href: "/it/prezzi-hotel-chios/",
  },
  es: {
    label: "Reservar",
    href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  },
  tr: {
    label: "Rezervasyon",
    href: "/tr/sakiz-adasi-rezervasyon/",
  },
};

function withBookingHeroCta(
  data: HomePageData,
  locale: string,
): HomePageData {
  const bookingCta = localizedBookingCta[locale];

  if (!bookingCta) {
    return data;
  }

  return {
    ...data,
    hero: {
      ...data.hero,
      secondaryCta: {
        ...bookingCta,
        icon: "📅",
      },
    },
  };
}

function getLocalizedHomePageData(locale: string): HomePageData {
  switch (locale) {
    case "el":
      return withBookingHeroCta(withUpdatedIntroReasons(homePageEl), locale);
    case "fr":
      return withBookingHeroCta(withUpdatedIntroReasons(homePageFr), locale);
    case "de":
      return withBookingHeroCta(withUpdatedIntroReasons(homePageDe), locale);
    case "it":
      return withBookingHeroCta(withUpdatedIntroReasons(homePageIt), locale);
    case "es":
      return withBookingHeroCta(withUpdatedIntroReasons(homePageEs), locale);
    case "tr":
      return withBookingHeroCta(withUpdatedIntroReasons(homePageTr), locale);
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
