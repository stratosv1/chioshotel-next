import type { Metadata } from "next";
import { PropertyFaqRoutePage } from "@/components/faq/PropertyFaqRoutePage";
import { getPropertyFaqPage } from "@/content/property-faq";
import { buildPropertyFaqMetadata } from "@/lib/property-faq-seo";

const data = getPropertyFaqPage("de");

export const metadata: Metadata = buildPropertyFaqMetadata(data);

export default function Page() {
  return <PropertyFaqRoutePage data={data} />;
}
