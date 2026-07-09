import type { Metadata } from "next";
import { ChiosVillagesPageTailwind } from "@/components/chios/ChiosVillagesPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildChiosVillagesSchema } from "@/content/chios-villages-schema";
import { getVillageCategoryPage, villageCategoryAlternates } from "@/content/village-categories";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data = getVillageCategoryPage("medieval", "fr");

export const metadata: Metadata = { ...buildPageMetadata({ path: data.seo.canonicalPath, title: data.seo.title, description: data.seo.description, image: data.seo.ogImage }), alternates: { canonical: absoluteUrl(data.seo.canonicalPath), languages: villageCategoryAlternates.medieval } };

export default function Page() { return <><JsonLd data={buildChiosVillagesSchema(data)} /><ChiosVillagesPageTailwind data={data} /></>; }
