import type { Metadata } from "next";
import { ChiosHolidayQuizPage } from "@/components/chios/ChiosHolidayQuizPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildChiosQuizSchema,
  getChiosQuizSchemaPage,
} from "@/content/chios-quiz-schema";
import { buildPageMetadata } from "@/lib/seo";

const page = getChiosQuizSchemaPage("fr");

export const metadata: Metadata = buildPageMetadata({
  path: page.path,
  title: page.title,
  description: page.description,
  image: "/images/voulamandis-house-og.jpg",
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosQuizSchema("fr")} />
      <ChiosHolidayQuizPage locale="fr" />
    </>
  );
}
