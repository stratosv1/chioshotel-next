import type { Metadata } from "next";
import { ChiosVillagesPageTailwind } from "@/components/chios/ChiosVillagesPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildChiosVillagesSchema } from "@/content/chios-villages-schema";
import {
  getVillageCategoryPage,
  villageCategoryAlternates,
} from "@/content/village-categories";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const source = getVillageCategoryPage("medieval", "el");

const data = {
  ...source,
  seo: {
    ...source.seo,
    title: "Μεσαιωνικά χωριά Χίου | Κάστρα, σοκάκια & ιστορία",
    description:
      "Περιηγηθείτε στα καλύτερα διατηρημένα μεσαιωνικά χωριά της Χίου, με πέτρινα σοκάκια, καμάρες, κάστρα και αυθεντική ατμόσφαιρα.",
  },
  hero: {
    ...source.hero,
    title: "Μεσαιωνικά χωριά της Χίου με κάστρα και πέτρινα σοκάκια",
    description:
      "Ανακαλύψτε καστροχώρια με καμάρες, στενά δρομάκια και οχυρωμένη αρχιτεκτονική που διατηρούν ζωντανή τη μεσαιωνική ιστορία της Χίου.",
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
    languages: villageCategoryAlternates.medieval,
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
