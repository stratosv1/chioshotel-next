import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { ItalianAccommodationPage } from "@/components/landing/ItalianAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { alloggioChiosPageIt } from "@/content/alloggio-chios";
import { buildAlloggioChiosSchema } from "@/content/alloggio-chios-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: alloggioChiosPageIt.seo.canonicalPath,
  title: alloggioChiosPageIt.seo.title,
  description: alloggioChiosPageIt.seo.description,
  image: alloggioChiosPageIt.seo.ogImage,
  imageAlt: alloggioChiosPageIt.seo.ogImageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(alloggioChiosPageIt.seo.canonicalPath),
    languages: accommodationLandingLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildAlloggioChiosSchema(alloggioChiosPageIt)} />
      <ItalianAccommodationPage data={alloggioChiosPageIt} />
      <AccommodationLandingAnalytics
        language="it"
        pathname={alloggioChiosPageIt.seo.canonicalPath}
      />
    </>
  );
}
