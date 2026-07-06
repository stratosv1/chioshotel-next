import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WelcomePage } from "@/components/welcome/WelcomePage";
import { getWelcomeCopy } from "@/content/welcome";
import { buildPageMetadata } from "@/lib/seo";
import { defaultLanguage, isLanguageCode, languages } from "@/lib/languages";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return languages
    .filter((language) => language.code !== defaultLanguage)
    .map((language) => ({
      locale: language.code,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    return {};
  }

  const data = getWelcomeCopy(locale);

  return {
    ...buildPageMetadata({
      path: data.seo.canonicalPath,
      title: data.seo.title,
      description: data.seo.description,
      image: data.seo.ogImage,
    }),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    notFound();
  }

  const data = getWelcomeCopy(locale);

  return <WelcomePage data={data} />;
}
