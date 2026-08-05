import type { Metadata } from "next";
import { ChiosVillagesPageTailwind } from "@/components/chios/ChiosVillagesPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildChiosVillagesSchema } from "@/content/chios-villages-schema";
import {
  getVillageCategoryPage,
  villageCategoryAlternates,
} from "@/content/village-categories";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const source = getVillageCategoryPage("mastic", "el");

const data = {
  ...source,
  seo: {
    ...source.seo,
    title: "Μαστιχοχώρια Χίου | Τα χωριά που αξίζει να δείτε",
    description:
      "Ανακαλύψτε Πυργί, Μεστά, Ολύμπους και τα ιστορικά Μαστιχοχώρια της Χίου, με μεσαιωνικά σοκάκια, μαστίχα και ιδέες για ημερήσια διαδρομή.",
  },
  hero: {
    ...source.hero,
    title: "Μαστιχοχώρια Χίου που αξίζει να επισκεφθείτε",
    description:
      "Γνωρίστε το Πυργί, τα Μεστά, τους Ολύμπους και άλλα χωριά της μαστίχας μέσα από μεσαιωνικά σοκάκια, ξεχωριστή αρχιτεκτονική και τοπική παράδοση.",
  },
};

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  }),
  alternates: {
    canonical: absoluteUrl(data.seo.canonicalPath),
    languages: villageCategoryAlternates.mastic,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosVillagesSchema(data)} />
      <ChiosVillagesPageTailwind data={data} />
    </>
  );
}
