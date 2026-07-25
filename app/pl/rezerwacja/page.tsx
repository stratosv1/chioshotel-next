import type { Metadata } from "next";
import { RatesPage } from "@/components/rates/RatesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { localizePolishCommercialSchema } from "@/content/commercial-schema-pl";
import { ratesPagePl } from "@/content/rates-pl";
import { buildRatesSchema } from "@/content/rates-schema";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata: Metadata = buildPolishPageMetadata({
  path: ratesPagePl.seo.canonicalPath,
  title: ratesPagePl.seo.title,
  description: ratesPagePl.seo.description,
  image: ratesPagePl.seo.ogImage,
});

const schema = localizePolishCommercialSchema(buildRatesSchema(ratesPagePl), {
  breadcrumbs: [
    { name: "Strona główna", path: "/pl/" },
    { name: "Rezerwacja bezpośrednia", path: "/pl/rezerwacja/" },
  ],
});

export default function PolishBookingPage() {
  return (
    <>
      <JsonLd data={schema} />
      <RatesPage data={ratesPagePl} />
    </>
  );
}
