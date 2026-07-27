import type { Metadata } from "next";
import { RomanticStayPage } from "@/components/landing/RomanticStayPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getRomanticStayData } from "@/content/romantic-stay";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { romanticStayLanguages } from "@/lib/romantic-stay-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getRomanticStayData("el");
const baseMetadata = buildPageMetadata({ path: data.path, title: data.seo.title, description: data.seo.description, image: data.seo.ogImage, imageAlt: data.hero.image.alt });

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: { canonical: absoluteUrl(data.path), languages: romanticStayLanguages() },
};

export default function Page() {
  return <><JsonLd data={buildLandingPageSchema(data)} /><RomanticStayPage data={data} /></>;
}
