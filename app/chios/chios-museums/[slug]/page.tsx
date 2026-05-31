import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MuseumDetailPage } from "@/components/chios/MuseumDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMuseumDetailSchema } from "@/content/museum-detail-schema";
import { getMuseumDetailBySlug, getMuseumSlugs } from "@/content/museum-details";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getMuseumSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const museum = getMuseumDetailBySlug(slug);

  if (!museum) {
    return {};
  }

  return buildPageMetadata({
    path: museum.seo.canonicalPath,
    title: museum.seo.title,
    description: museum.seo.description,
    image: museum.seo.ogImage,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const museum = getMuseumDetailBySlug(slug);

  if (!museum) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildMuseumDetailSchema(museum)} />
      <MuseumDetailPage museum={museum} />
    </>
  );
}