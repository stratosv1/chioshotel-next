import type { Metadata } from "next";
import { ChiosAccommodationPage } from "@/components/landing/ChiosAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { chiosAccommodationPagePl } from "@/content/chios-accommodation-pl";
import { buildChiosAccommodationSchema } from "@/content/chios-accommodation-schema";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata: Metadata = buildPolishPageMetadata({
  path: chiosAccommodationPagePl.seo.canonicalPath,
  title: chiosAccommodationPagePl.seo.title,
  description: chiosAccommodationPagePl.seo.description,
  image: chiosAccommodationPagePl.seo.ogImage,
  imageAlt: chiosAccommodationPagePl.seo.ogImageAlt,
});

export default function PolishAccommodationPage() {
  return (
    <>
      <JsonLd data={buildChiosAccommodationSchema(chiosAccommodationPagePl)} />
      <ChiosAccommodationPage data={chiosAccommodationPagePl} />
    </>
  );
}
