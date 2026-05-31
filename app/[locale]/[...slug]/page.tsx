import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { RoomsCategoryPage } from "@/components/rooms/RoomsCategoryPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  defaultLanguage,
  isLanguageCode,
  normalizePath,
} from "@/lib/languages";
import {
  roomsCategoryDe,
  roomsCategoryEl,
  roomsCategoryEs,
  roomsCategoryFr,
  roomsCategoryIt,
  roomsCategoryTr,
} from "@/content/rooms";
import type { RoomsCategoryPageData } from "@/content/rooms";
import { buildRoomsCategorySchema } from "@/content/rooms-schema";
import { buildPageMetadata } from "@/lib/seo";
import { getRouteByPath, getRoutesByItemId, routeMap } from "@/lib/url-map";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return routeMap
    .filter((route) => route.action === "KEEP")
    .filter((route) => route.language !== defaultLanguage)
    .filter((route) => route.path !== `/${route.language}/`)
    .map((route) => {
      const parts = route.path.split("/").filter(Boolean);
      const [locale, ...slug] = parts;

      return {
        locale,
        slug,
      };
    });
}

function getRequestedPath(locale: string, slug: string[]) {
  return normalizePath(`/${locale}/${slug.join("/")}/`);
}

function getLocalizedRoomsCategoryData(
  path: string,
): RoomsCategoryPageData | undefined {
  switch (path) {
    case "/el/domatia-xios/":
      return roomsCategoryEl;
    case "/fr/chambres-a-chios/":
      return roomsCategoryFr;
    case "/de/chios-zimmer/":
      return roomsCategoryDe;
    case "/it/camere-a-chios/":
      return roomsCategoryIt;
    case "/es/habitaciones-en-chios/":
      return roomsCategoryEs;
    case "/tr/sakiz-adasi-odalari/":
      return roomsCategoryTr;
    default:
      return undefined;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    return {};
  }

  const requestedPath = getRequestedPath(locale, slug);
  const roomsCategoryData = getLocalizedRoomsCategoryData(requestedPath);

  if (roomsCategoryData) {
    return buildPageMetadata({
      path: roomsCategoryData.seo.canonicalPath,
      title: roomsCategoryData.seo.title,
      description: roomsCategoryData.seo.description,
      image: roomsCategoryData.seo.ogImage,
    });
  }

  return {};
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    notFound();
  }

  const requestedPath = getRequestedPath(locale, slug);
  const roomsCategoryData = getLocalizedRoomsCategoryData(requestedPath);

  if (roomsCategoryData) {
    return (
      <>
        <JsonLd data={buildRoomsCategorySchema(roomsCategoryData)} />
        <RoomsCategoryPage data={roomsCategoryData} />
      </>
    );
  }

  const route = getRouteByPath(requestedPath);

  if (!route || route.action !== "KEEP") {
    notFound();
  }

  const englishRoute = getRoutesByItemId(route.itemId).find(
    (item) => item.language === defaultLanguage && item.action === "KEEP",
  );

  if (!englishRoute) {
    notFound();
  }

  redirect(englishRoute.path);
}