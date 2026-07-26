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
        "Τα Μεστά Χίου βρίσκονται περίπου 35 χλμ. νοτιοδυτικά της πόλης και είναι ένα από τα καλύτερα διατηρημένα μεσαιωνικά Μαστιχοχώρια. Ο οικισμός είναι χτισμένος σαν κάστρο, με μικρά πέτρινα σπίτια ενωμένα μεταξύ τους, στενά σοκάκια και καμάρες. Στην επίσκεψη αξίζει να δείτε τον Μικρό Ταξιάρχη και να δοκιμάσετε το μεστούσικο κρασί ή τη σούμα.",
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
