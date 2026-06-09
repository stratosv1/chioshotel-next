import type { Metadata } from "next";
import { KamposChiosPage } from "@/components/chios/KamposChiosPage";
import { kamposChiosPageEl } from "@/content/kampos-chios";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageEl.seo.canonicalPath,
  title: kamposChiosPageEl.seo.title,
  description: kamposChiosPageEl.seo.description,
  image: kamposChiosPageEl.seo.ogImage,
});

export default function Page() {
  return <KamposChiosPage data={kamposChiosPageEl} />;
}
