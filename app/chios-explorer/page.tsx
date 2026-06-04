import type { Metadata } from "next";
import ChiosExplorerPage from "@/components/landing/ChiosExplorerPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  chiosExplorerPaths,
  getChiosExplorerPageByLocale,
} from "@/content/chios-explorer";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getChiosExplorerPageByLocale("en");

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: data.seo.title,
    description: data.seo.description,
    path: data.path,
    image: data.hero.image.src,
  }),
  alternates: {
    canonical: absoluteUrl(data.path),
    languages: {
      en: absoluteUrl(chiosExplorerPaths.en),
      el: absoluteUrl(chiosExplorerPaths.el),
      fr: absoluteUrl(chiosExplorerPaths.fr),
      de: absoluteUrl(chiosExplorerPaths.de),
      it: absoluteUrl(chiosExplorerPaths.it),
      es: absoluteUrl(chiosExplorerPaths.es),
      tr: absoluteUrl(chiosExplorerPaths.tr),
      "x-default": absoluteUrl(chiosExplorerPaths.en),
    },
  },
};

export default function ChiosExplorerRoute() {
  return (
    <>
      <JsonLd data={buildLandingPageSchema(data)} />
      <ChiosExplorerPage data={data} />
    </>
  );
}