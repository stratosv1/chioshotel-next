import type { Metadata } from "next";
import { OrganizedBeachesPage } from "@/components/landing/OrganizedBeachesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNearbyBeachesPageByLocale, nearbyBeachAlternates } from "@/content/nearby-beaches";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
const data = getNearbyBeachesPageByLocale("en");
export const metadata: Metadata = { ...buildPageMetadata({ path: data.seo.canonicalPath, title: data.seo.title, description: data.seo.description, image: data.seo.ogImage }), alternates: { canonical: absoluteUrl(data.seo.canonicalPath), languages: nearbyBeachAlternates } };
export default function Page() { return <><JsonLd data={buildLandingPageSchema(data)} /><OrganizedBeachesPage data={data} /></>; }
