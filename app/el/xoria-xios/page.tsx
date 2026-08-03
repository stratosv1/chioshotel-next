import type { Metadata } from "next";
import { ChiosVillagesPageTailwind } from "@/components/chios/ChiosVillagesPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildChiosVillagesSchema } from "@/content/chios-villages-schema";
import { getLocalizedChiosVillagesPageByPath } from "@/content/chios-villages";
import { buildPageMetadata } from "@/lib/seo";

const PATH = "/el/xoria-xios/";

function getPageData() {
  const source = getLocalizedChiosVillagesPageByPath(PATH);

  if (!source) {
    throw new Error(`Missing villages content for ${PATH}`);
  }

  return {
    ...source,
    seo: {
      ...source.seo,
      title: "Τα ομορφότερα χωριά της Χίου | Οδηγός & διαδρομές",
      description:
        "Ανακαλύψτε τα ομορφότερα χωριά της Χίου, από το Πυργί και τα Μεστά έως τη Βολισσό και τη Λαγκάδα, με αξιοθέατα, διαδρομές και τοπικές συμβουλές.",
    },
    hero: {
      ...source.hero,
      title: "Τα ομορφότερα χωριά της Χίου που αξίζει να δείτε",
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

export default function GreekChiosVillagesPage() {
  const data = getPageData();

  return (
    <>
      <JsonLd data={buildChiosVillagesSchema(data)} />
      <ChiosVillagesPageTailwind data={data} />
    </>
  );
}
