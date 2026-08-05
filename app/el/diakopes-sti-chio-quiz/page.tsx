import type { Metadata } from "next";
import { ChiosHolidayQuizPage } from "@/components/chios/ChiosHolidayQuizPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildChiosQuizSchema,
  getChiosQuizSchemaPage,
} from "@/content/chios-quiz-schema";
import { buildPageMetadata } from "@/lib/seo";

const page = getChiosQuizSchemaPage("el");

const title = "Quiz διακοπών στη Χίο | Ποια εμπειρία σας ταιριάζει;";
const description =
  "Απαντήστε σε λίγες ερωτήσεις και ανακαλύψτε ποιες παραλίες, χωριά και εμπειρίες της Χίου ταιριάζουν στο δικό σας στιλ διακοπών.";

export const metadata: Metadata = buildPageMetadata({
  path: page.path,
  title,
  description,
  image: "/images/voulamandis-house-og.jpg",
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosQuizSchema("el")} />
      <ChiosHolidayQuizPage locale="el" />
    </>
  );
}
