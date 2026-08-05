import type { Metadata } from "next";
import { ChiosVillagesPageTailwind } from "@/components/chios/ChiosVillagesPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildChiosVillagesSchema } from "@/content/chios-villages-schema";
import {
  getVillageCategoryPage,
  villageCategoryAlternates,
} from "@/content/village-categories";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const source = getVillageCategoryPage("seaside", "el");

const data = {
  ...source,
  seo: {
    ...source.seo,
    title: "Παραθαλάσσια χωριά Χίου | Λιμανάκια, φαγητό & βόλτες",
    description:
      "Ανακαλύψτε παραθαλάσσια χωριά της Χίου με γραφικά λιμανάκια, ψαροταβέρνες, κοντινές παραλίες και ιδέες για χαλαρές εκδρομές.",
  },
  hero: {
    ...source.hero,
    title: "Παραθαλάσσια χωριά της Χίου για βόλτα και φαγητό",
    description:
      "Γνωρίστε γραφικά λιμανάκια, ψαροταβέρνες και χωριά δίπλα στη θάλασσα που συνδυάζονται εύκολα με μπάνιο και χαλαρή ημερήσια εκδρομή.",
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
    languages: villageCategoryAlternates.seaside,
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
