import type { Metadata } from "next";
import { PropertyFaqRoutePage } from "@/components/faq/PropertyFaqRoutePage";
import { getPropertyFaqPage } from "@/content/property-faq";
import { getPropertyFaqPageFromKnowledge } from "@/lib/property-knowledge";
import { buildPropertyFaqMetadata } from "@/lib/property-faq-seo";

const metadataData = getPropertyFaqPage("en");

export const metadata: Metadata = buildPropertyFaqMetadata(metadataData);

export default async function Page() {
  const data = await getPropertyFaqPageFromKnowledge("en");
  return <PropertyFaqRoutePage data={data} />;
}
