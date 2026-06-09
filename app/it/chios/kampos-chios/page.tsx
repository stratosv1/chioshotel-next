import type { Metadata } from "next";
import { KamposChiosPage } from "@/components/chios/KamposChiosPage";
import { kamposChiosPageIt } from "@/content/kampos-chios";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageIt.seo.canonicalPath,
  title: kamposChiosPageIt.seo.title,
  description: kamposChiosPageIt.seo.description,
  image: kamposChiosPageIt.seo.ogImage,
});

export default function Page() {
  return <KamposChiosPage data={kamposChiosPageIt} />;
}
