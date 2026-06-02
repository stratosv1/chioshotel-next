import type { Metadata } from "next";
import ChiosActivitiesPage from "@/components/landing/ChiosActivitiesPage";
import {
  chiosActivityDetailPaths,
  getChiosActivityPageByKey,
} from "@/content/chios-activities";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getChiosActivityPageByKey("greekCourses", "en");
const paths = chiosActivityDetailPaths.greekCourses;

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

export default function GreekLanguageCoursesChiosRoute() {
  return <ChiosActivitiesPage data={data} />;
}
