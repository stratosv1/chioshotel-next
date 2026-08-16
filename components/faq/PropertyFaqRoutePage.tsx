import { PropertyFaqPage } from "@/components/faq/PropertyFaqPage";
import { JsonLd } from "@/components/seo/JsonLd";
import type { PropertyFaqPageData } from "@/content/property-faq";
import { buildPropertyFaqSchema } from "@/content/property-faq-schema";

export function PropertyFaqRoutePage({ data }: { data: PropertyFaqPageData }) {
  return (
    <>
      <JsonLd data={buildPropertyFaqSchema(data)} />
      <PropertyFaqPage data={data} />
    </>
  );
}
