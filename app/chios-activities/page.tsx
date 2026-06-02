import type { Metadata } from "next";
import ChiosActivitiesPage from "@/components/landing/ChiosActivitiesPage";
import {
  chiosActivitiesPaths,
  getChiosActivitiesPageByLocale,
} from "@/content/chios-activities";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getChiosActivitiesPageByLocale("en");

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: data.seo.title,
    description: data.seo.description,
    path: data.path,
  }),
  alternates: {
    canonical: absoluteUrl(data.path),
    languages: {
      en: absoluteUrl(chiosActivitiesPaths.en),
      el: absoluteUrl(chiosActivitiesPaths.el),
      fr: absoluteUrl(chiosActivitiesPaths.fr),
      de: absoluteUrl(chiosActivitiesPaths.de),
      it: absoluteUrl(chiosActivitiesPaths.it),
      es: absoluteUrl(chiosActivitiesPaths.es),
      tr: absoluteUrl(chiosActivitiesPaths.tr),
      "x-default": absoluteUrl(chiosActivitiesPaths.en),
    },
  },
};

export default function ChiosActivitiesRoute() {
  return <ChiosActivitiesPage data={data} />;
}