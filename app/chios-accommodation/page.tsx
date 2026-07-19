import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { ChiosAccommodationPage } from "@/components/landing/ChiosAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { chiosAccommodationPageEn } from "@/content/chios-accommodation";
import { buildChiosAccommodationSchema } from "@/content/chios-accommodation-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: chiosAccommodationPageEn.seo.canonicalPath,
  title: chiosAccommodationPageEn.seo.title,
  description: chiosAccommodationPageEn.seo.description,
  image: chiosAccommodationPageEn.seo.ogImage,
  imageAlt: chiosAccommodationPageEn.seo.ogImageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(chiosAccommodationPageEn.seo.canonicalPath),
    languages: {
      en: absoluteUrl("/chios-accommodation/"),
      el: absoluteUrl("/el/diamoni-sti-xio/"),
      fr: absoluteUrl("/fr/hebergement-chios/"),
      de: absoluteUrl("/de/chios-unterkunft/"),
      it: absoluteUrl("/it/alloggio-chios/"),
      es: absoluteUrl("/es/alojamiento-chios/"),
      tr: absoluteUrl("/tr/sakiz-adasi-konaklama/"),
      "x-default": absoluteUrl("/chios-accommodation/"),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosAccommodationSchema(chiosAccommodationPageEn)} />
      <ChiosAccommodationPage data={chiosAccommodationPageEn} />
      <AccommodationLandingAnalytics
        language="en"
        pathname={chiosAccommodationPageEn.seo.canonicalPath}
      />
    </>
  );
}