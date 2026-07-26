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
import { buildHomePageSchema } from "@/content/schema";
import { buildPageMetadata } from "@/lib/seo";
import { withHomepageSeoIntent } from "@/lib/homepage-seo-intent";
import {
  defaultLanguage,
  isLanguageCode,
  languages,
  type LanguageCode,
} from "@/lib/languages";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const localizedLanguages = languages.filter(
  (language) => language.code !== defaultLanguage,
);

const homePages: Record<LanguageCode, HomePageData> = {
  en: homePageEn,
  el: homePageEl,
  fr: homePageFr,
  de: homePageDe,
  it: homePageIt,
  es: homePageEs,
  tr: homePageTr,
};

function getLocalizedHomePageData(locale: LanguageCode): HomePageData {
  return withHomepageSeoIntent(homePages[locale], locale);
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
