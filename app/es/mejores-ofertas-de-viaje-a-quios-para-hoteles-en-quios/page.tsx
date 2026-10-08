import type { Metadata } from "next";
import { DealsPage } from "@/components/deals/DealsPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDealsIntentData } from "@/content/deals-intent";
import { buildDealsSchema } from "@/content/deals-schema";
import { getLiveDealsPage } from "@/lib/offers/deals-page-data";
import { buildPageMetadata } from "@/lib/seo";

// Offers are managed from /staff/offers; saving there refreshes this page immediately,
// and expired offers drop off on the next refresh (at most 5 minutes).
export const revalidate = 300;

const seo = getDealsIntentData("es").seo;

export const metadata: Metadata = buildPageMetadata({
  path: seo.canonicalPath,
  title: seo.title,
  description: seo.description,
  image: seo.ogImage,
});

export default async function Page() {
  const { data, lastMinute } = await getLiveDealsPage("es");
  return (
    <>
      <JsonLd data={buildDealsSchema(data)} />
      <DealsPage data={data} lastMinute={lastMinute} />
    </>
  );
}
