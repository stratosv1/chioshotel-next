import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { GreekAccommodationPage } from "@/components/landing/GreekAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { diamoniStiXioPageEl } from "@/content/diamoni-sti-xio";
import { buildDiamoniStiXioSchema } from "@/content/diamoni-sti-xio-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: diamoniStiXioPageEl.seo.canonicalPath,
  title: diamoniStiXioPageEl.seo.title,
  description: diamoniStiXioPageEl.seo.description,
  image: diamoniStiXioPageEl.seo.ogImage,
  imageAlt: diamoniStiXioPageEl.seo.ogImageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(diamoniStiXioPageEl.seo.canonicalPath),
    languages: accommodationLandingLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildDiamoniStiXioSchema(diamoniStiXioPageEl)} />
      <GreekAccommodationPage data={diamoniStiXioPageEl} />
      <AccommodationLandingAnalytics
        language="el"
        pathname={diamoniStiXioPageEl.seo.canonicalPath}
      />
    </>
  );
}
