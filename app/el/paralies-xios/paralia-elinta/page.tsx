import type { Metadata } from "next";
import { BeachDetailPageTailwind } from "@/components/chios/BeachDetailPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBeachDetailSchema } from "@/content/beach-detail-schema";
import { elintaBeachEl } from "@/content/elinta-beach-el";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const path = elintaBeachEl.seo.canonicalPath;

export const metadata: Metadata = {
  ...buildPageMetadata({
    path,
    title: elintaBeachEl.seo.title,
    description: elintaBeachEl.seo.description,
    image: elintaBeachEl.seo.ogImage,
  }),
  alternates: {
    canonical: absoluteUrl(path),
    languages: {
      el: absoluteUrl(path),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildBeachDetailSchema(elintaBeachEl)} />
      <BeachDetailPageTailwind beach={elintaBeachEl} />
    </>
  );
}
