import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { GermanAccommodationPage } from "@/components/landing/GermanAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { chiosUnterkunftPageDe } from "@/content/chios-unterkunft";
import { buildChiosUnterkunftSchema } from "@/content/chios-unterkunft-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: chiosUnterkunftPageDe.seo.canonicalPath,
  title: chiosUnterkunftPageDe.seo.title,
  description: chiosUnterkunftPageDe.seo.description,
  image: chiosUnterkunftPageDe.seo.ogImage,
  imageAlt: chiosUnterkunftPageDe.seo.ogImageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(chiosUnterkunftPageDe.seo.canonicalPath),
    languages: accommodationLandingLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosUnterkunftSchema(chiosUnterkunftPageDe)} />
      <GermanAccommodationPage data={chiosUnterkunftPageDe} />
      <AccommodationLandingAnalytics
        language="de"
        pathname={chiosUnterkunftPageDe.seo.canonicalPath}
      />
    </>
  );
}
