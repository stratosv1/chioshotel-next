import type { Metadata } from "next";
import { GreekKamposLandingPage } from "@/components/chios/GreekKamposLandingPage";
import { kamposChiosPageEl } from "@/content/kampos-chios";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageEl.seo.canonicalPath,
  title: kamposChiosPageEl.seo.title,
  description: kamposChiosPageEl.seo.description,
  image: kamposChiosPageEl.seo.ogImage,
});

export default function Page() {
  return <GreekKamposLandingPage data={kamposChiosPageEl} />;
}
