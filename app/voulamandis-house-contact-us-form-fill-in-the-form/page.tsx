import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactPageEn } from "@/content/contact";
import { buildContactSchema } from "@/content/contact-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: contactPageEn.seo.canonicalPath,
  title: contactPageEn.seo.title,
  description: contactPageEn.seo.description,
  image: contactPageEn.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildContactSchema(contactPageEn)} />
      <ContactPage data={contactPageEn} />
    </>
  );
}