import type { Metadata } from "next";
import { ChiosHolidayQuizPage } from "@/components/chios/ChiosHolidayQuizPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildChiosQuizSchema } from "@/content/chios-quiz-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/chios-holidays-quiz/",
  title: "Chios Holiday Quiz | Voulamandis House",
  description:
    "Take the Chios Holiday Quiz by Voulamandis House, discover hidden island secrets and get a special discount code for your stay.",
  image: "/images/voulamandis-house-og.jpg",
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosQuizSchema("en")} />
      <ChiosHolidayQuizPage locale="en" />
    </>
  );
}
