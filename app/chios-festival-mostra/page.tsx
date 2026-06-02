import type { Metadata } from "next";
import ChiosActivitiesPage from "@/components/landing/ChiosActivitiesPage";
import {
  chiosActivityDetailPaths,
  getChiosActivityPageByKey,
} from "@/content/chios-activities";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getChiosActivityPageByKey("mostra", "en");
const paths = chiosActivityDetailPaths.mostra;

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: data.seo.title,
    description: data.seo.description,
    path: data.path,
  }),
  alternates: {
    canonical: absoluteUrl(data.path),
    languages: {
      en: absoluteUrl(paths.en),
      el: absoluteUrl(paths.el),
      fr: absoluteUrl(paths.fr),
      de: absoluteUrl(paths.de),
      it: absoluteUrl(paths.it),
      es: absoluteUrl(paths.es),
      tr: absoluteUrl(paths.tr),
      "x-default": absoluteUrl(paths.en),
    },
  },
};

export default function ChiosFestivalMostraRoute() {
  return <ChiosActivitiesPage data={data} />;
}
