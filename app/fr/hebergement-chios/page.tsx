import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { FrenchAccommodationPage } from "@/components/landing/FrenchAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { hebergementChiosPageFr } from "@/content/hebergement-chios";
import { buildHebergementChiosSchema } from "@/content/hebergement-chios-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: hebergementChiosPageFr.seo.canonicalPath,
  title: hebergementChiosPageFr.seo.title,
  description: hebergementChiosPageFr.seo.description,
  image: hebergementChiosPageFr.seo.ogImage,
  imageAlt: hebergementChiosPageFr.seo.ogImageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(hebergementChiosPageFr.seo.canonicalPath),
    languages: accommodationLandingLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildHebergementChiosSchema(hebergementChiosPageFr)} />
      <FrenchAccommodationPage data={hebergementChiosPageFr} />
      <AccommodationLandingAnalytics
        language="fr"
        pathname={hebergementChiosPageFr.seo.canonicalPath}
      />
    </>
  );
}
