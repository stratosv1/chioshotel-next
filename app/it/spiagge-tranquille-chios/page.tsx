import type { Metadata } from "next";
import { OrganizedBeachesPage } from "@/components/landing/OrganizedBeachesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getQuietBeachesPageByLocale, quietBeachAlternates } from "@/content/quiet-beaches";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
const data = getQuietBeachesPageByLocale("it");
export const metadata: Metadata = { ...buildPageMetadata({ path: data.seo.canonicalPath, title: data.seo.title, description: data.seo.description, image: data.seo.ogImage }), alternates: { canonical: absoluteUrl(data.seo.canonicalPath), languages: quietBeachAlternates } };
export default function Page() { return <><JsonLd data={buildLandingPageSchema(data)} /><OrganizedBeachesPage data={data} /></>; }
