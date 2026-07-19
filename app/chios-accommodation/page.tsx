import type { Metadata } from "next";
import { ChiosAccommodationPage } from "@/components/landing/ChiosAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { chiosAccommodationPageEn } from "@/content/chios-accommodation";
import { buildChiosAccommodationSchema } from "@/content/chios-accommodation-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: chiosAccommodationPageEn.seo.canonicalPath,
  title: chiosAccommodationPageEn.seo.title,
  description: chiosAccommodationPageEn.seo.description,
  image: chiosAccommodationPageEn.seo.ogImage,
  imageAlt: chiosAccommodationPageEn.seo.ogImageAlt,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosAccommodationSchema(chiosAccommodationPageEn)} />
      <ChiosAccommodationPage data={chiosAccommodationPageEn} />
    </>
  );
}
