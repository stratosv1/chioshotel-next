import type { Metadata } from "next";
import type { PropertyFaqPageData } from "@/content/property-faq";
import { propertyFaqPaths } from "@/content/property-faq";
import { languages } from "@/lib/languages";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export function buildPropertyFaqMetadata(data: PropertyFaqPageData): Metadata {
  const metadata = buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  });

  const localizedLanguages = languages.reduce<Record<string, string>>((acc, language) => {
    acc[language.hreflang] = absoluteUrl(propertyFaqPaths[language.code]);
    return acc;
  }, {});

  localizedLanguages["x-default"] = absoluteUrl(propertyFaqPaths.en);

  return {
    ...metadata,
    alternates: {
      canonical: absoluteUrl(data.seo.canonicalPath),
      languages: localizedLanguages,
    },
  };
}
