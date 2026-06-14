import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ChiosIslandPage } from "@/components/chios/ChiosIslandPage";
import { ChiosBeachesPage } from "@/components/chios/ChiosBeachesPage";
import { ChiosVillagesPage } from "@/components/chios/ChiosVillagesPage";
import { ChiosMuseumsPage } from "@/components/chios/ChiosMuseumsPage";
import { ChiosHolidayQuizPage } from "@/components/chios/ChiosHolidayQuizPage";
import { BeachDetailPage } from "@/components/chios/BeachDetailPage";
import { VillageDetailPage } from "@/components/chios/VillageDetailPage";
import { MuseumDetailPage } from "@/components/chios/MuseumDetailPage";
import { BeachLoversPage } from "@/components/landing/BeachLoversPage";
import ChiosExplorerPage from "@/components/landing/ChiosExplorerPage";
import FamilyTravelPage from "@/components/landing/FamilyTravelPage";
import TasteLoverPage from "@/components/landing/TasteLoverPage";
import ChiosActivitiesPage from "@/components/landing/ChiosActivitiesPage";
import FindYourRoomPage from "@/components/booking/FindYourRoomPage";
import { RoomsCategoryPage } from "@/components/rooms/RoomsCategoryPage";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { DealsPage } from "@/components/deals/DealsPage";
import { ContactPage } from "@/components/contact/ContactPage";
import { RatesPage } from "@/components/rates/RatesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  defaultLanguage,
  isLanguageCode,
  normalizePath,
} from "@/lib/languages";
import { getLocalizedChiosIslandPageByPath } from "@/content/chios-island";
import { getLocalizedDealsPageByPath } from "@/content/deals";
import { getLocalizedContactPageByPath } from "@/content/contact";
import { getLocalizedRatesPageByPath } from "@/content/rates";
import { getLocalizedChiosBeachesPageByPath } from "@/content/chios-beaches";
import { buildChiosBeachesSchema } from "@/content/chios-beaches-schema";
import { getLocalizedChiosVillagesPageByPath } from "@/content/chios-villages";
import { buildChiosVillagesSchema } from "@/content/chios-villages-schema";
import { getLocalizedChiosMuseumsPageByPath } from "@/content/chios-museums";
import { buildChiosMuseumsSchema } from "@/content/chios-museums-schema";
import { getBeachLoversPageByPath } from "@/content/beach-lovers";
import { getChiosExplorerPageByPath } from "@/content/chios-explorer";
import { getFamilyTravelPageByPath } from "@/content/family-travel";
import { getTasteLoverPageByPath } from "@/content/taste-lover";
import { getChiosActivitiesPageByPath } from "@/content/chios-activities";
import { getFindYourRoomPageByPath } from "@/content/find-your-room";
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
import { buildBeachDetailSchema } from "@/content/beach-detail-schema";
import { getLocalizedBeachDetailByPath } from "@/content/beach-details";
import { buildVillageDetailSchema } from "@/content/village-detail-schema";
import { getLocalizedVillageDetailByPath } from "@/content/village-details";
import { buildMuseumDetailSchema } from "@/content/museum-detail-schema";
import { getLocalizedMuseumDetailByPath } from "@/content/museum-details";
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

export const dynamicParams = true;

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

  const chiosIslandData = getLocalizedChiosIslandPageByPath(requestedPath);

  if (chiosIslandData) {
    return buildLocalizedPageMetadata({
      path: chiosIslandData.seo.canonicalPath,
      title: chiosIslandData.seo.title,
      description: chiosIslandData.seo.description,
      image: chiosIslandData.seo.ogImage,
    });
  }

  const dealsData = getLocalizedDealsPageByPath(requestedPath);

  if (dealsData) {
    return buildLocalizedPageMetadata({
      path: dealsData.seo.canonicalPath,
      title: dealsData.seo.title,
      description: dealsData.seo.description,
      image: dealsData.seo.ogImage,
    });
  }

  const contactData = getLocalizedContactPageByPath(requestedPath);

  if (contactData) {
    return buildLocalizedPageMetadata({
      path: contactData.seo.canonicalPath,
      title: contactData.seo.title,
      description: contactData.seo.description,
      image: contactData.seo.ogImage,
    });
  }

  const ratesData = getLocalizedRatesPageByPath(requestedPath);

  if (ratesData) {
    return buildLocalizedPageMetadata({
      path: ratesData.seo.canonicalPath,
      title: ratesData.seo.title,
      description: ratesData.seo.description,
      image: ratesData.seo.ogImage,
    });
  }

  const chiosBeachesData = getLocalizedChiosBeachesPageByPath(requestedPath);

  if (chiosBeachesData) {
    return buildLocalizedPageMetadata({
      path: chiosBeachesData.seo.canonicalPath,
      title: chiosBeachesData.seo.title,
      description: chiosBeachesData.seo.description,
      image: chiosBeachesData.seo.ogImage,
    });
  }

  const chiosVillagesData = getLocalizedChiosVillagesPageByPath(requestedPath);

  if (chiosVillagesData) {
    return buildLocalizedPageMetadata({
      path: chiosVillagesData.seo.canonicalPath,
      title: chiosVillagesData.seo.title,
      description: chiosVillagesData.seo.description,
      image: chiosVillagesData.seo.ogImage,
    });
  }

  const chiosMuseumsData = getLocalizedChiosMuseumsPageByPath(requestedPath);

  if (chiosMuseumsData) {
    return buildLocalizedPageMetadata({
      path: chiosMuseumsData.seo.canonicalPath,
      title: chiosMuseumsData.seo.title,
      description: chiosMuseumsData.seo.description,
      image: chiosMuseumsData.seo.ogImage,
    });
  }

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

  const beachDetailData = getLocalizedBeachDetailByPath(requestedPath);

  if (beachDetailData) {
    return buildLocalizedPageMetadata({
      path: beachDetailData.seo.canonicalPath,
      title: beachDetailData.seo.title,
      description: beachDetailData.seo.description,
      image: beachDetailData.seo.ogImage,
    });
  }

  const villageDetailData = getLocalizedVillageDetailByPath(requestedPath);

  if (villageDetailData) {
    return buildLocalizedPageMetadata({
      path: villageDetailData.seo.canonicalPath,
      title: villageDetailData.seo.title,
      description: villageDetailData.seo.description,
      image: villageDetailData.seo.ogImage,
    });
  }

  const museumDetailData = getLocalizedMuseumDetailByPath(requestedPath);

  if (museumDetailData) {
    return buildLocalizedPageMetadata({
      path: museumDetailData.seo.canonicalPath,
      title: museumDetailData.seo.title,
      description: museumDetailData.seo.description,
      image: museumDetailData.seo.ogImage,
    });
  }

  const beachLoversData = getBeachLoversPageByPath(requestedPath);

  if (beachLoversData) {
    return buildLocalizedPageMetadata({
      path: beachLoversData.seo.canonicalPath,
      title: beachLoversData.seo.title,
      description: beachLoversData.seo.description,
      image: beachLoversData.seo.ogImage,
    });
  }

  const familyTravelData = getFamilyTravelPageByPath(requestedPath);

  if (familyTravelData) {
    return buildLocalizedPageMetadata({
      path: familyTravelData.path,
      title: familyTravelData.seo.title,
      description: familyTravelData.seo.description,
      image: familyTravelData.hero.image.src,
    });
  }

  const tasteLoverData = getTasteLoverPageByPath(requestedPath);

  if (tasteLoverData) {
    return buildLocalizedPageMetadata({
      path: tasteLoverData.path,
      title: tasteLoverData.seo.title,
      description: tasteLoverData.seo.description,
      image: tasteLoverData.seo.image,
    });
  }

  const chiosExplorerData = getChiosExplorerPageByPath(requestedPath);

  if (chiosExplorerData) {
    return buildLocalizedPageMetadata({
      path: chiosExplorerData.path,
      title: chiosExplorerData.seo.title,
      description: chiosExplorerData.seo.description,
      image: chiosExplorerData.hero.image.src,
    });
  }

  const chiosActivitiesData = getChiosActivitiesPageByPath(requestedPath);

  if (chiosActivitiesData) {
    return buildLocalizedPageMetadata({
      path: chiosActivitiesData.path,
      title: chiosActivitiesData.seo.title,
      description: chiosActivitiesData.seo.description,
      image: chiosActivitiesData.hero.image,
    });
  }

  const findYourRoomData = getFindYourRoomPageByPath(requestedPath);

  if (findYourRoomData) {
    return buildLocalizedPageMetadata({
      path: findYourRoomData.seo.canonicalPath,
      title: findYourRoomData.seo.title,
      description: findYourRoomData.seo.description,
      image: findYourRoomData.seo.ogImage,
    });
  }

  const route = getRouteByPath(requestedPath);

  if (route?.itemId === "chios-quiz" && route.action === "KEEP") {
    const quizMetadata =
      route.language === "el"
        ? {
            title: "Quiz Διακοπών στη Χίο 2026",
            description:
              "Κάντε το quiz διακοπών στη Χίο, ανακαλύψτε ποια εμπειρία σας ταιριάζει και πάρτε ειδικό κωδικό έκπτωσης για τη διαμονή σας.",
          }
        : {
            title: "Chios Holiday Quiz",
            description:
              "Take the Chios Holiday Quiz by Voulamandis House, discover hidden island secrets and get a special discount code for your stay.",
          };

    return buildLocalizedPageMetadata({
      path: route.path,
      title: quizMetadata.title,
      description: quizMetadata.description,
      image: "/images/voulamandis-house-og.jpg",
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

  const chiosIslandData = getLocalizedChiosIslandPageByPath(requestedPath);

  if (chiosIslandData) {
    return <ChiosIslandPage data={chiosIslandData} />;
  }

  const dealsData = getLocalizedDealsPageByPath(requestedPath);

  if (dealsData) {
    return <DealsPage data={dealsData} />;
  }

  const contactData = getLocalizedContactPageByPath(requestedPath);

  if (contactData) {
    return <ContactPage data={contactData} />;
  }

  const ratesData = getLocalizedRatesPageByPath(requestedPath);

  if (ratesData) {
    return <RatesPage data={ratesData} />;
  }

  const chiosBeachesData = getLocalizedChiosBeachesPageByPath(requestedPath);

  if (chiosBeachesData) {
    return (
      <>
        <JsonLd data={buildChiosBeachesSchema(chiosBeachesData)} />
        <ChiosBeachesPage data={chiosBeachesData} />
      </>
    );
  }

  const chiosVillagesData = getLocalizedChiosVillagesPageByPath(requestedPath);

  if (chiosVillagesData) {
    return (
      <>
        <JsonLd data={buildChiosVillagesSchema(chiosVillagesData)} />
        <ChiosVillagesPage data={chiosVillagesData} />
      </>
    );
  }

  const chiosMuseumsData = getLocalizedChiosMuseumsPageByPath(requestedPath);

  if (chiosMuseumsData) {
    return (
      <>
        <JsonLd data={buildChiosMuseumsSchema(chiosMuseumsData)} />
        <ChiosMuseumsPage data={chiosMuseumsData} />
      </>
    );
  }

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

  const beachDetailData = getLocalizedBeachDetailByPath(requestedPath);

  if (beachDetailData) {
    return (
      <>
        <JsonLd data={buildBeachDetailSchema(beachDetailData)} />
        <BeachDetailPage beach={beachDetailData} />
      </>
    );
  }

  const villageDetailData = getLocalizedVillageDetailByPath(requestedPath);

  if (villageDetailData) {
    return (
      <>
        <JsonLd data={buildVillageDetailSchema(villageDetailData)} />
        <VillageDetailPage village={villageDetailData} />
      </>
    );
  }

  const museumDetailData = getLocalizedMuseumDetailByPath(requestedPath);

  if (museumDetailData) {
    return (
      <>
        <JsonLd data={buildMuseumDetailSchema(museumDetailData)} />
        <MuseumDetailPage museum={museumDetailData} />
      </>
    );
  }

  const beachLoversData = getBeachLoversPageByPath(requestedPath);

  if (beachLoversData) {
    return <BeachLoversPage data={beachLoversData} />;
  }

  const familyTravelData = getFamilyTravelPageByPath(requestedPath);

  if (familyTravelData) {
    return <FamilyTravelPage data={familyTravelData} />;
  }

  const tasteLoverData = getTasteLoverPageByPath(requestedPath);

  if (tasteLoverData) {
    return <TasteLoverPage data={tasteLoverData} />;
  }

  const chiosExplorerData = getChiosExplorerPageByPath(requestedPath);

  if (chiosExplorerData) {
    return <ChiosExplorerPage data={chiosExplorerData} />;
  }

  const chiosActivitiesData = getChiosActivitiesPageByPath(requestedPath);

  if (chiosActivitiesData) {
    return <ChiosActivitiesPage data={chiosActivitiesData} />;
  }

  const findYourRoomData = getFindYourRoomPageByPath(requestedPath);

  if (findYourRoomData) {
    return <FindYourRoomPage data={findYourRoomData} />;
  }

  const route = getRouteByPath(requestedPath);

  if (!route || route.action !== "KEEP") {
    notFound();
  }

  if (route.itemId === "chios-quiz") {
    return <ChiosHolidayQuizPage locale={locale} />;
  }

  const englishRoute = getRoutesByItemId(route.itemId).find(
    (item) => item.language === defaultLanguage && item.action === "KEEP",
  );

  if (!englishRoute) {
    notFound();
  }

  redirect(englishRoute.path);
}