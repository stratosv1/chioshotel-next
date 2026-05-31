import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { RoomsCategoryPage } from "@/components/rooms/RoomsCategoryPage";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
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
import {
  economyDoubleRoomsDe,
  economyDoubleRoomsEl,
  economyDoubleRoomsEs,
  economyDoubleRoomsFr,
  economyDoubleRoomsIt,
  economyDoubleRoomsTr,
  familyChiosApartmentsDe,
  familyChiosApartmentsEl,
  familyChiosApartmentsEs,
  familyChiosApartmentsFr,
  familyChiosApartmentsIt,
  familyChiosApartmentsTr,
  standardDoubleRoomDe,
  standardDoubleRoomEl,
  standardDoubleRoomEs,
  standardDoubleRoomFr,
  standardDoubleRoomIt,
  standardDoubleRoomTr,
} from "@/content/room-details";
import type { RoomDetailData } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { buildRoomsCategorySchema } from "@/content/rooms-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
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

function getLocalizedRoomDetailData(path: string): RoomDetailData | undefined {
  switch (path) {
    case "/el/domatia-xios/oikonomiko-diklino-domatio/":
      return economyDoubleRoomsEl;
    case "/fr/chambres-a-chios/chambres-doubles-economiques/":
      return economyDoubleRoomsFr;
    case "/de/zimmer-chios/economy-zimmer-auf-chios/":
      return economyDoubleRoomsDe;
    case "/it/stanze-a-chios/camera-doppia-economica-chios/":
      return economyDoubleRoomsIt;
    case "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/":
      return economyDoubleRoomsEs;
    case "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/":
      return economyDoubleRoomsTr;

    case "/el/domatia-xios/diklina-triklina-domatia/":
      return standardDoubleRoomEl;
    case "/fr/chambres-a-chios/chambres-doubles-standard/":
      return standardDoubleRoomFr;
    case "/de/zimmer-chios/standard-doppelzimmer-auf-chios/":
      return standardDoubleRoomDe;
    case "/it/stanze-a-chios/camere-doppie-standard-chios/":
      return standardDoubleRoomIt;
    case "/es/habitaciones-en-chios/habitaciones-dobles-estandar/":
      return standardDoubleRoomEs;
    case "/tr/chios-odalari/standart-cift-kisilik-odalar/":
      return standardDoubleRoomTr;

    case "/el/domatia-xios/oikogeneiako-diamerisma/":
      return familyChiosApartmentsEl;
    case "/fr/chambres-a-chios/appartements-familiaux-de-chios/":
      return familyChiosApartmentsFr;
    case "/de/zimmer-chios/familienapartments-in-chios/":
      return familyChiosApartmentsDe;
    case "/it/stanze-a-chios/appartamenti-familiari-a-chios/":
      return familyChiosApartmentsIt;
    case "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/":
      return familyChiosApartmentsEs;
    case "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/":
      return familyChiosApartmentsTr;

    default:
      return undefined;
  }
}

function buildLocalizedAlternates(path: string) {
  const route = getRouteByPath(path);

  if (!route) {
    return undefined;
  }

  const relatedRoutes = getRoutesByItemId(route.itemId).filter(
    (item) => item.action === "KEEP",
  );

  const languages = relatedRoutes.reduce<Record<string, string>>(
    (acc, item) => {
      acc[item.language] = absoluteUrl(item.path);
      return acc;
    },
    {},
  );

  const defaultRoute = relatedRoutes.find(
    (item) => item.language === defaultLanguage,
  );

  if (defaultRoute) {
    languages["x-default"] = absoluteUrl(defaultRoute.path);
  }

  return {
    canonical: absoluteUrl(path),
    languages,
  };
}

function buildLocalizedPageMetadata({
  path,
  title,
  description,
  image,
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const metadata = buildPageMetadata({
    path,
    title,
    description,
    image,
  });

  const alternates = buildLocalizedAlternates(path);

  if (!alternates) {
    return metadata;
  }

  return {
    ...metadata,
    alternates,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    return {};
  }

  const requestedPath = getRequestedPath(locale, slug);

  const roomsCategoryData = getLocalizedRoomsCategoryData(requestedPath);

  if (roomsCategoryData) {
    return buildLocalizedPageMetadata({
      path: roomsCategoryData.seo.canonicalPath,
      title: roomsCategoryData.seo.title,
      description: roomsCategoryData.seo.description,
      image: roomsCategoryData.seo.ogImage,
    });
  }

  const roomDetailData = getLocalizedRoomDetailData(requestedPath);

  if (roomDetailData) {
    return buildLocalizedPageMetadata({
      path: roomDetailData.seo.canonicalPath,
      title: roomDetailData.seo.title,
      description: roomDetailData.seo.description,
      image: roomDetailData.seo.ogImage,
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

  const roomDetailData = getLocalizedRoomDetailData(requestedPath);

  if (roomDetailData) {
    return (
      <>
        <JsonLd data={buildRoomDetailSchema(roomDetailData)} />
        <RoomDetailPage data={roomDetailData} />
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