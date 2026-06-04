import type { Metadata } from "next";
import ChiosActivitiesPage from "@/components/landing/ChiosActivitiesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  chiosActivityDetailPaths,
  getChiosActivityPageByKey,
} from "@/content/chios-activities";
import { buildChiosActivitiesSchema } from "@/content/chios-activities-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getChiosActivityPageByKey("orchids", "en");
const paths = chiosActivityDetailPaths.orchids;

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: data.seo.title,
    description: data.seo.description,
    path: data.path,
    image: data.hero.image,
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

export default function ChiosOrchidsRoute() {
  return (
    <>
      <JsonLd data={buildChiosActivitiesSchema(data)} />
      <ChiosActivitiesPage data={data} />
    </>
  );
}
