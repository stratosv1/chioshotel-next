import type { Metadata } from "next";
import FamilyTravelPage from "@/components/landing/FamilyTravelPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFamilyTravelIntentData } from "@/content/family-travel-intent";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { buildPageMetadata } from "@/lib/seo";

const data = getFamilyTravelIntentData("fr");

export const metadata: Metadata = buildPageMetadata({
  path: data.path,
  title: data.seo.title,
  description: data.seo.description,
  image: data.hero.image.src,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildLandingPageSchema(data)} />
      <FamilyTravelPage data={data} />
    </>
  );
}
