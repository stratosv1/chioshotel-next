import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { VillageDetailPage } from "@/components/chios/VillageDetailPage";
import { buildVillageDetailSchema } from "@/content/village-detail-schema";
import { getVillageDetailBySlug, getVillageSlugs } from "@/content/village-details";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getVillageSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const village = getVillageDetailBySlug(slug);

  if (!village) {
    return {};
  }

  return buildPageMetadata({
    path: village.seo.canonicalPath,
    title: village.seo.title,
    description: village.seo.description,
    image: village.seo.ogImage,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const village = getVillageDetailBySlug(slug);

  if (!village) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildVillageDetailSchema(village)} />
      <VillageDetailPage village={village} />
    </>
  );
}