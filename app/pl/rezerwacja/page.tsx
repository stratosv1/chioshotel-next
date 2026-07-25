import type { Metadata } from "next";
import { RatesPage } from "@/components/rates/RatesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { ratesPagePl } from "@/content/rates-pl";
import { buildRatesSchema } from "@/content/rates-schema";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata: Metadata = buildPolishPageMetadata({
  path: ratesPagePl.seo.canonicalPath,
  title: ratesPagePl.seo.title,
  description: ratesPagePl.seo.description,
  image: ratesPagePl.seo.ogImage,
});

export default function PolishBookingPage() {
  return (
    <>
      <JsonLd data={buildRatesSchema(ratesPagePl)} />
      <RatesPage data={ratesPagePl} />
    </>
  );
}
