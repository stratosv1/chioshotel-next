import type { Metadata } from "next";
import { KamposChiosPage } from "@/components/chios/KamposChiosPage";
import { kamposChiosPageEs } from "@/content/kampos-chios";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageEs.seo.canonicalPath,
  title: kamposChiosPageEs.seo.title,
  description: kamposChiosPageEs.seo.description,
  image: kamposChiosPageEs.seo.ogImage,
});

export default function Page() {
  return <KamposChiosPage data={kamposChiosPageEs} />;
}
