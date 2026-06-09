import type { Metadata } from "next";
import { KamposChiosPage } from "@/components/chios/KamposChiosPage";
import { kamposChiosPageDe } from "@/content/kampos-chios";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageDe.seo.canonicalPath,
  title: kamposChiosPageDe.seo.title,
  description: kamposChiosPageDe.seo.description,
  image: kamposChiosPageDe.seo.ogImage,
});

export default function Page() {
  return <KamposChiosPage data={kamposChiosPageDe} />;
}
