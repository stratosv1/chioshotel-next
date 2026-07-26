import type { Metadata } from "next";
import { ChiosBeachesPageTailwind } from "@/components/chios/ChiosBeachesPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocalizedChiosBeachesPageByPath } from "@/content/chios-beaches";
import { buildChiosBeachesSchema } from "@/content/chios-beaches-schema";
import { buildPageMetadata } from "@/lib/seo";

const PATH = "/el/paralies-xios/";
const CTR_TEST_TITLE = "Καλύτερες παραλίες Χίου | Χάρτης & τοπικός οδηγός";

function getPageData() {
  const data = getLocalizedChiosBeachesPageByPath(PATH);
  if (!data) throw new Error(`Missing Chios beaches content for ${PATH}`);
  return data;
}

export function generateMetadata(): Metadata {
  const data = getPageData();
  const base = buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  });

  return {
    ...base,
    title: { absolute: CTR_TEST_TITLE },
    openGraph: base.openGraph
      ? { ...base.openGraph, title: CTR_TEST_TITLE }
      : undefined,
    twitter: base.twitter
      ? { ...base.twitter, title: CTR_TEST_TITLE }
      : undefined,
  };
}

export default function GreekChiosBeachesPage() {
  const data = getPageData();

  return (
    <>
      <JsonLd data={buildChiosBeachesSchema(data)} />
      <ChiosBeachesPageTailwind data={data} />
    </>
  );
}
