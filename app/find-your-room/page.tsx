import type { Metadata } from "next";
import FindYourRoomPage from "@/components/booking/FindYourRoomPage";
import { getFindYourRoomPageByLanguage } from "@/content/find-your-room";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { getRoutesByItemId } from "@/lib/url-map";

const data = getFindYourRoomPageByLanguage("en");

function buildFindYourRoomAlternates() {
  const relatedRoutes = getRoutesByItemId("find-your-room").filter(
    (route) => route.action === "KEEP",
  );

  const languages = relatedRoutes.reduce<Record<string, string>>((acc, route) => {
    acc[route.language] = absoluteUrl(route.path);
    return acc;
  }, {});

  languages["x-default"] = absoluteUrl(data.path);

  return {
    canonical: absoluteUrl(data.path),
    languages,
  };
}

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  }),
  alternates: buildFindYourRoomAlternates(),
};

export default function Page() {
  return <FindYourRoomPage data={data} />;
}