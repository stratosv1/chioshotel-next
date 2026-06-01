import type { Metadata } from "next";
import TasteLoverPage from "@/components/landing/TasteLoverPage";
import {
  getTasteLoverPageByLocale,
  tasteLoverPaths,
} from "@/content/taste-lover";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getTasteLoverPageByLocale("en");

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: data.path,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.image,
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
    },
  },
};

export default function TasteLoverEnglishPage() {
  return <TasteLoverPage data={data} />;
}