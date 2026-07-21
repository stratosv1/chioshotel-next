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

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function getLocalizedHomePageData(locale: string): HomePageData {
  switch (locale) {
    case "el":
      return withSeoTitle(
        homePageEl,
        "Voulamandis House | Δωμάτια & Διαμερίσματα στη Χίο",
      );
    case "fr":
      return withSeoTitle(
        homePageFr,
        "Voulamandis House | Chambres & Appartements à Chios",
      );
    case "de":
      return withSeoTitle(
        homePageDe,
        "Voulamandis House | Zimmer & Apartments auf Chios",
      );
    case "it":
      return withSeoTitle(
        homePageIt,
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
