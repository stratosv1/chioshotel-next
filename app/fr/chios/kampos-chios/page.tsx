import type { Metadata } from "next";
import { KamposChiosPage } from "@/components/chios/KamposChiosPage";
import { kamposChiosPageFr } from "@/content/kampos-chios";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageFr.seo.canonicalPath,
  title: kamposChiosPageFr.seo.title,
  description: kamposChiosPageFr.seo.description,
  image: kamposChiosPageFr.seo.ogImage,
});

export default function Page() {
  return <KamposChiosPage data={kamposChiosPageFr} />;
}
