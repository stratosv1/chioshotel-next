import type { Metadata } from "next";
import TasteLoverPage from "@/components/landing/TasteLoverPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getTasteLoverPageByLocale,
  tasteLoverPaths,
} from "@/content/taste-lover";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getTasteLoverPageByLocale("en");

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
      en: absoluteUrl(tasteLoverPaths.en),
      el: absoluteUrl(tasteLoverPaths.el),
      fr: absoluteUrl(tasteLoverPaths.fr),
      de: absoluteUrl(tasteLoverPaths.de),
      it: absoluteUrl(tasteLoverPaths.it),
      es: absoluteUrl(tasteLoverPaths.es),
      tr: absoluteUrl(tasteLoverPaths.tr),
      "x-default": absoluteUrl(tasteLoverPaths.en),
    },
  },
};

export default function TasteLoverChiosRoute() {
  return (
    <>
      <JsonLd data={buildLandingPageSchema(data)} />
      <TasteLoverPage data={data} />
    </>
  );
}