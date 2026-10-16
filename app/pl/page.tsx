import { HomePageTailwindV3 } from "@/components/home/HomePageTailwindV3";
import { JsonLd } from "@/components/seo/JsonLd";
import { homePagePl } from "@/content/home-pl";
import { buildHomePageSchema } from "@/content/schema";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const revalidate = 3600;

// Same layout, images and metadata shape as the other homepages
// (buildHomepageMetadata), but through the Polish metadata builder so the
// pl_PL Open Graph locale and the /pl/ hreflang group stay correct.
export const metadata = buildPolishPageMetadata({
  path: homePagePl.seo.canonicalPath,
  title: homePagePl.seo.title,
  description: homePagePl.seo.description,
  image: homePagePl.hero.image,
  imageAlt: homePagePl.seo.ogImageAlt,
  imageWidth: homePagePl.hero.imageWidth,
  imageHeight: homePagePl.hero.imageHeight,
});

export default function PolishHomePage() {
  return (
    <>
      <JsonLd data={buildHomePageSchema(homePagePl)} />
      <HomePageTailwindV3 data={homePagePl} />
    </>
  );
}
