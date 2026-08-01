import type { ContactPageData } from "@/content/contact";
import {
  absoluteUrl,
  getCanonicalUrl,
  getLanguageForPath,
  siteName,
  siteUrl,
} from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildHotelSchema,
  buildImageSchema,
  buildOrganizationSchema,
  buildSchemaGraph,
  buildWebsiteSchema,
  hotelId,
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

type ContactSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

const contactLabelsByLanguage: Record<
  ContactSchemaLanguage,
  { customerService: string; whatsappReservations: string; reservations: string }
> = {
  en: {
    customerService: "Customer service",
    whatsappReservations: "WhatsApp reservations",
    reservations: "Reservations",
  },
  el: {
    customerService: "Εξυπηρέτηση επισκεπτών",
    whatsappReservations: "Κρατήσεις μέσω WhatsApp",
    reservations: "Κρατήσεις",
  },
  de: {
    customerService: "Gästeservice",
    whatsappReservations: "Reservierungen über WhatsApp",
    reservations: "Reservierungen",
  },
  fr: {
    customerService: "Service clients",
    whatsappReservations: "Réservations via WhatsApp",
    reservations: "Réservations",
  },
  it: {
    customerService: "Assistenza ospiti",
    whatsappReservations: "Prenotazioni tramite WhatsApp",
    reservations: "Prenotazioni",
  },
  es: {
    customerService: "Atención al huésped",
    whatsappReservations: "Reservas por WhatsApp",
    reservations: "Reservas",
  },
  tr: {
    customerService: "Misafir hizmetleri",
    whatsappReservations: "WhatsApp üzerinden rezervasyon",
    reservations: "Rezervasyonlar",
  },
};

function getContactLabels(path: string) {
  const language = getLanguageForPath(path) as ContactSchemaLanguage;
  return contactLabelsByLanguage[language] ?? contactLabelsByLanguage.en;
}

function normalizeTelephone(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  if (cleaned.startsWith("30")) {
    return `+${cleaned}`;
  }

  return phone;
}

function buildContactPageSchema(data: ContactPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "ContactPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: data.seo.title,
    headline: data.hero.title,
    description: data.seo.description,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: {
      "@id": hotelId(),
    },
    mainEntity: {
      "@id": hotelId(),
    },
    primaryImageOfPage: {
      "@id": primaryImageId(canonicalPath),
    },
    breadcrumb: {
      "@id": schemaId(canonicalPath, "breadcrumb"),
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

function buildContactPointSchema(data: ContactPageData): SchemaObject[] {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);
  const labels = getContactLabels(canonicalPath);
  const availableLanguage = Array.from(new Set(["en", language]));
  const phoneItems = data.contactInfo.items.filter((item) =>
    item.href.startsWith("tel:"),
  );

  const whatsappPhone = normalizeTelephone(data.form.whatsappPhone);

  const phoneContactPoints = phoneItems.map((item) => ({
    "@type": "ContactPoint",
    telephone: normalizeTelephone(item.href.replace("tel:", "")),
    contactType: labels.customerService,
    areaServed: "GR",
    availableLanguage,
  }));

  return [
    ...phoneContactPoints,
    {
      "@type": "ContactPoint",
      telephone: whatsappPhone,
      contactType: labels.whatsappReservations,
      areaServed: "GR",
      availableLanguage,
    },
    {
      "@type": "ContactPoint",
      email: data.form.email,
      contactType: labels.reservations,
      areaServed: "GR",
      availableLanguage,
    },
  ];
}

function buildContactHotelSchema(data: ContactPageData): SchemaObject {
  return {
    ...buildHotelSchema({ path: data.seo.canonicalPath }),
    email: data.form.email,
    contactPoint: buildContactPointSchema(data),
  };
}

function buildContactActionSchema(data: ContactPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "CommunicateAction",
    "@id": schemaId(canonicalPath, "contact-action"),
    name: data.form.title,
    description: data.form.subtitle,
    inLanguage: getLanguageForPath(canonicalPath),
    target: [
      {
        "@type": "EntryPoint",
        urlTemplate: getCanonicalUrl(canonicalPath),
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      {
        "@type": "EntryPoint",
        urlTemplate: `mailto:${data.form.email}`,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      {
        "@type": "EntryPoint",
        urlTemplate: `https://wa.me/${data.form.whatsappPhone}`,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
    ],
    agent: {
      "@id": hotelId(),
    },
  };
}

export function buildContactSchema(data: ContactPageData) {
  const canonicalPath = data.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildContactHotelSchema(data),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage || data.hero.image,
        alt: data.hero.title,
        caption: `${data.hero.title} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildContactPageSchema(data),
    buildContactActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: data.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}
