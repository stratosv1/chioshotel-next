import type { Metadata } from "next";
import { KamposChiosPage } from "@/components/chios/KamposChiosPage";
import { kamposChiosPageTr } from "@/content/kampos-chios";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageTr.seo.canonicalPath,
  title: kamposChiosPageTr.seo.title,
  description: kamposChiosPageTr.seo.description,
  image: kamposChiosPageTr.seo.ogImage,
});

export default function Page() {
  return <KamposChiosPage data={kamposChiosPageTr} />;
}
