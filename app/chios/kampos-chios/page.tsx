import type { Metadata } from "next";
import { KamposChiosPage } from "@/components/chios/KamposChiosPage";
import { kamposChiosPageEn } from "@/content/kampos-chios";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageEn.seo.canonicalPath,
  title: kamposChiosPageEn.seo.title,
  description: kamposChiosPageEn.seo.description,
  image: kamposChiosPageEn.seo.ogImage,
});

export default function Page() {
  return <KamposChiosPage data={kamposChiosPageEn} />;
}
