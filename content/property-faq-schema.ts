import type { PropertyFaqPageData } from "@/content/property-faq";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHotelSchema,
  buildImageSchema,
  buildOrganizationSchema,
  buildSchemaGraph,
  buildWebPageSchema,
  buildWebsiteSchema,
  getLocalizedSchemaLabels,
  type SchemaObject,
} from "@/lib/structured-data";

export function buildPropertyFaqSchema(data: PropertyFaqPageData): SchemaObject {
  const path = data.seo.canonicalPath;
  const labels = getLocalizedSchemaLabels(path);
  const breadcrumbs = [
    { name: labels.homeName, path: labels.homePath },
    { name: data.hero.title, path },
  ];
  const questions = data.categories.flatMap((category) =>
    category.items.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage,
        alt: data.hero.title,
      },
      path,
    ),
    buildBreadcrumbSchema(path, breadcrumbs),
    buildWebPageSchema({
      path,
      title: data.seo.title,
      description: data.seo.description,
      image: data.seo.ogImage,
      breadcrumbs,
    }),
    buildFaqSchema({ path, questions }),
  ]);
}
