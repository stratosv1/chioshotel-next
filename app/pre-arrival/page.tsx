import type { Metadata } from "next";
import { PreArrivalPage } from "@/components/pre-arrival/PreArrivalPage";
import { getPreArrivalPageByLocale } from "@/content/pre-arrival";
import { buildPageMetadata } from "@/lib/seo";

const data = getPreArrivalPageByLocale("en");

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <PreArrivalPage data={data} />;
}
