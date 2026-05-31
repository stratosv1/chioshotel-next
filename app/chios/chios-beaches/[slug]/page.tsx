import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BeachDetailPage } from "@/components/chios/BeachDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBeachDetailSchema } from "@/content/beach-detail-schema";
import { getBeachDetailBySlug, getBeachSlugs } from "@/content/beach-details";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getBeachSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const beach = getBeachDetailBySlug(slug);

  if (!beach) {
    return {};
  }

  return buildPageMetadata({
    path: beach.seo.canonicalPath,
    title: beach.seo.title,
    description: beach.seo.description,
    image: beach.seo.ogImage,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const beach = getBeachDetailBySlug(slug);

  if (!beach) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildBeachDetailSchema(beach)} />
      <BeachDetailPage beach={beach} />
    </>
  );
}