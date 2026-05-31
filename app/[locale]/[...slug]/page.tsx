import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { RoomsCategoryPage } from "@/components/rooms/RoomsCategoryPage";
import {
  defaultLanguage,
  isLanguageCode,
  normalizePath,
} from "@/lib/languages";
import { roomsCategoryEl } from "@/content/rooms";
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

function isGreekRoomsCategoryPath(path: string) {
  return path === "/el/domatia-xios/";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    return {};
  }

  const requestedPath = getRequestedPath(locale, slug);

  if (isGreekRoomsCategoryPath(requestedPath)) {
    return buildPageMetadata({
      path: roomsCategoryEl.seo.canonicalPath,
      title: roomsCategoryEl.seo.title,
      description: roomsCategoryEl.seo.description,
      image: roomsCategoryEl.seo.ogImage,
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

  if (isGreekRoomsCategoryPath(requestedPath)) {
    return <RoomsCategoryPage data={roomsCategoryEl} />;
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