import type { Metadata } from "next";
import { DealsPage } from "@/components/deals/DealsPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDealsIntentData } from "@/content/deals-intent";
import { buildDealsSchema } from "@/content/deals-schema";
import { buildPageMetadata } from "@/lib/seo";

const data = getDealsIntentData("el");

export const metadata: Metadata = buildPageMetadata({
  path: data.seo.canonicalPath,
  title: data.seo.title,
  description: data.seo.description,
  image: data.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildDealsSchema(data)} />
      <DealsPage data={data} />
    </>
  );
}
