import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TripPlanner } from "@/components/trip-planner/TripPlanner";
import { TripPlannerSeoContent } from "@/components/trip-planner/TripPlannerSeoContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { beaches } from "@/content/trip-planner/beaches";
import { applyTripPlannerMedia } from "@/content/trip-planner/media";
import { villages } from "@/content/trip-planner/villages";
import { defaultLanguage, isLanguageCode, languages } from "@/lib/languages";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const GREEK_PATH = "/el/trip-planner/";
const PLANNER_IMAGE = "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp";

export function generateStaticParams() {
  return languages
    .filter((language) => language.code !== defaultLanguage)
    .map((language) => ({ locale: language.code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEl = locale === "el";
  const path = `/${locale}/trip-planner/`;

  return buildPageMetadata({
    path,
    title: isEl
      ? "Trip Planner Χίου | Πρόγραμμα με παραλίες & χωριά"
      : "Chios Trip Planner | Beaches & day routes",
    description: isEl
      ? "Φτιάξε το δικό σου πρόγραμμα διακοπών στη Χίο. Συνδύασε παραλίες και χωριά ανά ημέρα, με αποστάσεις, χρόνους οδήγησης και έτοιμες διαδρομές."
      : "Plan Chios beach days and routes. This localized version is still being completed.",
    image: PLANNER_IMAGE,
    imageAlt: isEl
      ? "Chios Trip Planner για παραλίες και χωριά της Χίου"
      : "Chios Trip Planner",
    noIndex: !isEl,
  });
}

function buildTripPlannerSchema() {
  const pageUrl = absoluteUrl(GREEK_PATH);
  const homeUrl = absoluteUrl("/el/");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Trip Planner Χίου | Πρόγραμμα με παραλίες & χωριά",
        description:
          "Διαδραστικό εργαλείο για οργάνωση παραλιών και χωριών της Χίου ανά ημέρα, με ενδεικτικές αποστάσεις και χρόνους οδήγησης.",
        inLanguage: "el-GR",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${absoluteUrl("/")}#website`,
          url: absoluteUrl("/"),
          name: "Voulamandis House",
        },
        about: {
          "@type": "Place",
          name: "Χίος",
        },
        provider: {
          "@type": "LodgingBusiness",
          name: "Voulamandis House",
          url: homeUrl,
        },
        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Voulamandis House",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Chios Trip Planner",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    notFound();
  }

  const isEl = locale === "el";
  const plannerMedia = applyTripPlannerMedia(beaches, villages);

  return (
    <>
      {isEl && <JsonLd data={buildTripPlannerSchema()} />}
      <TripPlanner beaches={plannerMedia.beaches} villages={plannerMedia.villages} locale={locale} />
      {isEl && <TripPlannerSeoContent />}
    </>
  );
}
