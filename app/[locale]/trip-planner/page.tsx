import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TripPlanner } from "@/components/trip-planner/TripPlanner";
import { beaches } from "@/content/trip-planner/beaches";
import { villages } from "@/content/trip-planner/villages";
import { defaultLanguage, isLanguageCode, languages } from "@/lib/languages";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return languages
    .filter((language) => language.code !== defaultLanguage)
    .map((language) => ({ locale: language.code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEl = locale === "el";

  return {
    title: isEl ? "Trip Planner Χίου | Παραλίες & Χωριά" : "Chios Beach Trip Planner",
    description: isEl
      ? "Διάλεξε παραλίες και χωριά της Χίου και δες ποιες στάσεις συνδυάζονται καλύτερα στην ίδια ημερήσια διαδρομή."
      : "Choose Chios beaches and see which ones combine best in the same day route.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (!isLanguageCode(locale) || locale === defaultLanguage) {
    notFound();
  }

  return <TripPlanner beaches={beaches} villages={villages} locale={locale} />;
}
