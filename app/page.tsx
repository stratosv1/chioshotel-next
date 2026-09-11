import { HomePageTailwindV3 } from "@/components/home/HomePageTailwindV3";
import { JsonLd } from "@/components/seo/JsonLd";
import { homePageEn } from "@/content/home";
import { buildHomePageSchema } from "@/content/schema";
import { buildHomepageMetadata } from "@/lib/homepage-metadata";
import { withHomepageSeoIntent } from "@/lib/homepage-seo-intent";

export const revalidate = 3600;

const homePageData = withHomepageSeoIntent(homePageEn, "en");

export const metadata = buildHomepageMetadata(homePageData);

export default function Page() {
  return (
    <>
      <JsonLd data={buildHomePageSchema(homePageData)} />
      <HomePageTailwindV3 data={homePageData} />
    </>
  );
}
