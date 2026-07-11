import type { Metadata } from "next";
import { RatesPage } from "@/components/rates/RatesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { ratesPageEn } from "@/content/rates";
import { buildRatesSchema } from "@/content/rates-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: ratesPageEn.seo.canonicalPath,
  title: ratesPageEn.seo.title,
  description: ratesPageEn.seo.description,
  image: ratesPageEn.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildRatesSchema(ratesPageEn)} />
      <style>{`
        iframe[src*="beds24.com/booking2.php"] {
          height: 980px !important;
          min-height: 980px !important;
          display: block !important;
        }

        @media (max-width: 767px) {
          iframe[src*="beds24.com/booking2.php"] {
            height: 820px !important;
            min-height: 820px !important;
          }
        }
      `}</style>
      <RatesPage data={ratesPageEn} />
    </>
  );
}
