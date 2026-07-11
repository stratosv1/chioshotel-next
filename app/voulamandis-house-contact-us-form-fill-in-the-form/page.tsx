import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactPageEn } from "@/content/contact";
import { buildContactSchema } from "@/content/contact-schema";
import { buildPageMetadata } from "@/lib/seo";

const contactEmail = "chioshotel@gmail.com";
const contactPageData = {
  ...contactPageEn,
  form: {
    ...contactPageEn.form,
    email: contactEmail,
  },
  contactInfo: {
    ...contactPageEn.contactInfo,
    items: contactPageEn.contactInfo.items.map((item) =>
      item.label === "Email"
        ? { ...item, value: contactEmail, href: `mailto:${contactEmail}` }
        : item,
    ),
  },
};

export const metadata: Metadata = buildPageMetadata({
  path: contactPageData.seo.canonicalPath,
  title: contactPageData.seo.title,
  description: contactPageData.seo.description,
  image: contactPageData.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildContactSchema(contactPageData)} />
      <ContactPage data={contactPageData} />
    </>
  );
}
