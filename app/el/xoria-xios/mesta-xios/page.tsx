import type { Metadata } from "next";
import { VillageDetailPageTailwind } from "@/components/chios/VillageDetailPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildVillageDetailSchema } from "@/content/village-detail-schema";
import { getLocalizedVillageDetailByPath } from "@/content/village-details";
import { buildPageMetadata } from "@/lib/seo";

const PATH = "/el/xoria-xios/mesta-xios/";

function getPageData() {
  const source = getLocalizedVillageDetailByPath(PATH);
  if (!source) throw new Error(`Missing village content for ${PATH}`);

  return {
    ...source,
    hero: {
      ...source.hero,
      title: "Μεστά Χίου: το αυθεντικό μεσαιωνικό καστροχώρι",
      description:
        "Το καλύτερα διατηρημένο μεσαιωνικό Μαστιχοχώρι της νότιας Χίου, περίπου 35 χλμ. από την πόλη: πέτρινα σοκάκια, καμάρες και η πλατεία του Ταξιάρχη.",
    },
  };
}

export function generateMetadata(): Metadata {
  const data = getPageData();
  return buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  });
}

export default function GreekMestaPage() {
  const data = getPageData();

  return (
    <>
      <JsonLd data={buildVillageDetailSchema(data)} />
      <VillageDetailPageTailwind village={data} />
    </>
  );
}
