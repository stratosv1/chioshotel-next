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

function getLocalizedHomePageData(locale: string): HomePageData {
  switch (locale) {
    case "el": {
      const data = withUpdatedIntroReasons(homePageEl);

      return {
        ...data,
        hero: {
          ...data.hero,
          secondaryCta: {
            label: "Κράτηση",
            href: "/el/amesi-kratisi-voulamandis-house/",
            icon: "📅",
          },
        },
      };
    }
    case "fr":
      return withUpdatedIntroReasons(homePageFr);
    case "de":
      return withUpdatedIntroReasons(homePageDe);
    case "it":
      return withUpdatedIntroReasons(homePageIt);
    case "es":
      return withUpdatedIntroReasons(homePageEs);
    case "tr":
      return withUpdatedIntroReasons(homePageTr);
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
