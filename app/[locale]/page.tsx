import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/HomePage";
import { homePageEl, homePageEn } from "@/content/home";
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

function getLocalizedHomePageData(locale: string) {
  switch (locale) {
    case "el":
      return homePageEl;
    default:
      return homePageEn;
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

  return <HomePage data={data} />;
}