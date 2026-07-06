import type { Metadata } from "next";
import { WelcomePage } from "@/components/welcome/WelcomePage";
import { getWelcomePageByLocale } from "@/content/welcome";
import { buildPageMetadata } from "@/lib/seo";

const data = getWelcomePageByLocale("en");

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
  return <WelcomePage data={data} />;
}
