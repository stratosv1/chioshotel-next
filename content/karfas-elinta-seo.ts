import type { Metadata } from "next";
import type { BeachDetailData } from "@/content/beach-details";
import type { LocalizedBeachPaths } from "@/content/karfas-elinta-paths";
import { languages } from "@/lib/languages";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export function buildLocalizedBeachMetadata(
  beach: BeachDetailData,
  paths: LocalizedBeachPaths,
): Metadata {
  const languageAlternates = Object.fromEntries(
    languages.map((language) => [
      language.hreflang,
      absoluteUrl(paths[language.code]),
    ]),
  ) as Record<string, string>;

  languageAlternates["x-default"] = absoluteUrl(paths.en);

  return {
    ...buildPageMetadata({
      path: beach.seo.canonicalPath,
      title: beach.seo.title,
      description: beach.seo.description,
      image: beach.seo.ogImage,
    }),
    alternates: {
      canonical: absoluteUrl(beach.seo.canonicalPath),
      languages: languageAlternates,
    },
  };
}
