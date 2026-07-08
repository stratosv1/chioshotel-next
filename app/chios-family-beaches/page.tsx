import type { Metadata } from "next";
import { FamilyBeachesPage } from "@/components/landing/FamilyBeachesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  familyBeachAlternates,
  getFamilyBeachesPageByLocale,
} from "@/content/family-beaches";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getFamilyBeachesPageByLocale("en");

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  }),
  alternates: {
    canonical: absoluteUrl(data.seo.canonicalPath),
    languages: familyBeachAlternates,
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildLandingPageSchema(data)} />
      <FamilyBeachesPage data={data} />
    </>
  );
}
