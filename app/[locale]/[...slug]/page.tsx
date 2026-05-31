import { notFound, redirect } from "next/navigation";
import {
  defaultLanguage,
  isLanguageCode,
  normalizePath,
} from "@/lib/languages";
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

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    notFound();
  }

  const requestedPath = normalizePath(`/${locale}/${slug.join("/")}/`);
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