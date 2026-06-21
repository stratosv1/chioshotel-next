import {
  absoluteUrl,
  getCanonicalUrl,
} from "@/lib/seo";
import {
  breadcrumbId,
  buildOrganizationSchema,
  buildSchemaGraph,
  buildWebsiteSchema,
  organizationId,
  schemaId,
  type SchemaObject,
  webPageId,
  websiteId,
} from "@/lib/structured-data";

export type ChiosQuizLocale = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

type ChiosQuizSchemaPage = {
  locale: ChiosQuizLocale;
  path: string;
  title: string;
  description: string;
  homeLabel: string;
  breadcrumbLabel: string;
};

export const chiosQuizSchemaPages: Record<ChiosQuizLocale, ChiosQuizSchemaPage> = {
  en: {
    locale: "en",
    path: "/chios-holidays-quiz/",
    title: "Chios Holiday Quiz | Voulamandis House",
    description:
      "Take the Chios Holiday Quiz by Voulamandis House, discover hidden island secrets and get a special discount code for your stay.",
    homeLabel: "Home",
    breadcrumbLabel: "Chios Holiday Quiz",
  },
  el: {
    locale: "el",
    path: "/el/diakopes-sti-chio-quiz/",
    title: "Quiz Διακοπών στη Χίο 2026",
    description:
      "Κάντε το quiz διακοπών στη Χίο, ανακαλύψτε ποια εμπειρία σας ταιριάζει και πάρτε ειδικό κωδικό έκπτωσης για τη διαμονή σας.",
    homeLabel: "Αρχική",
    breadcrumbLabel: "Quiz Διακοπών στη Χίο",
  },
  de: {
    locale: "de",
    path: "/de/chios-urlaubsquiz/",
    title: "Chios Urlaubsquiz 2026",
    description:
      "Machen Sie das Chios Urlaubsquiz, entdecken Sie, welches Erlebnis zu Ihnen passt, und erhalten Sie einen speziellen Rabattcode für Ihren Aufenthalt.",
    homeLabel: "Startseite",
    breadcrumbLabel: "Chios Urlaubsquiz",
  },
  fr: {
    locale: "fr",
    path: "/fr/quiz-vacances-a-chios/",
    title: "Quiz vacances à Chios 2026",
    description:
      "Faites le quiz vacances à Chios, découvrez l’expérience qui vous correspond et obtenez un code de réduction spécial pour votre séjour.",
    homeLabel: "Accueil",
    breadcrumbLabel: "Quiz vacances à Chios",
  },
  it: {
    locale: "it",
    path: "/it/quiz-vacanze-a-chios/",
    title: "Quiz vacanze a Chios 2026",
    description:
      "Fai il quiz vacanze a Chios, scopri quale esperienza fa per te e ottieni un codice sconto speciale per il tuo soggiorno.",
    homeLabel: "Home",
    breadcrumbLabel: "Quiz vacanze a Chios",
  },
  es: {
    locale: "es",
    path: "/es/quiz-vacaciones-en-quios/",
    title: "Quiz de vacaciones en Chios 2026",
    description:
      "Haz el quiz de vacaciones en Chios, descubre qué experiencia encaja contigo y consigue un código de descuento especial para tu estancia.",
    homeLabel: "Inicio",
    breadcrumbLabel: "Quiz de vacaciones en Chios",
  },
  tr: {
    locale: "tr",
    path: "/tr/sakiz-adasi-tatil-testi/",
    title: "Sakız Adası tatil testi 2026",
    description:
      "Sakız Adası tatil testini yapın, size en uygun deneyimi keşfedin ve konaklamanız için özel indirim kodu alın.",
    homeLabel: "Ana sayfa",
    breadcrumbLabel: "Sakız Adası tatil testi",
  },
};

export function getChiosQuizSchemaPage(locale: ChiosQuizLocale) {
  return chiosQuizSchemaPages[locale];
}

export function buildChiosQuizAlternates() {
  const languages = Object.fromEntries(
    Object.values(chiosQuizSchemaPages).map((page) => [
      page.locale,
      absoluteUrl(page.path),
    ]),
  );

  return {
    canonical: absoluteUrl(chiosQuizSchemaPages.en.path),
    languages: {
      ...languages,
      "x-default": absoluteUrl(chiosQuizSchemaPages.en.path),
    },
  };
}

function buildLocalizedQuizBreadcrumbSchema(page: ChiosQuizSchemaPage): SchemaObject {
  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId(page.path),
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: page.homeLabel,
        item: absoluteUrl(page.locale === "en" ? "/" : `/${page.locale}/`),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.breadcrumbLabel,
        item: absoluteUrl(page.path),
      },
    ],
  };
}

function buildChiosQuizWebPageSchema(page: ChiosQuizSchemaPage): SchemaObject {
  return {
    "@type": "WebPage",
    "@id": webPageId(page.path),
    url: getCanonicalUrl(page.path),
    name: page.title,
    headline: page.breadcrumbLabel,
    description: page.description,
    inLanguage: page.locale,
    isPartOf: {
      "@id": websiteId(),
    },
    about: {
      "@id": organizationId(),
    },
    mainEntity: {
      "@id": schemaId(page.path, "chios-holiday-quiz"),
    },
    breadcrumb: {
      "@id": breadcrumbId(page.path),
    },
    publisher: {
      "@id": organizationId(),
    },
  };
}

function buildChiosQuizEntitySchema(page: ChiosQuizSchemaPage): SchemaObject {
  return {
    "@type": "CreativeWork",
    "@id": schemaId(page.path, "chios-holiday-quiz"),
    name: page.breadcrumbLabel,
    description: page.description,
    inLanguage: page.locale,
    isPartOf: {
      "@id": webPageId(page.path),
    },
    provider: {
      "@id": organizationId(),
    },
  };
}

export function buildChiosQuizSchema(locale: ChiosQuizLocale) {
  const page = getChiosQuizSchemaPage(locale);

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildWebsiteSchema(),
    buildChiosQuizWebPageSchema(page),
    buildChiosQuizEntitySchema(page),
    buildLocalizedQuizBreadcrumbSchema(page),
  ]);
}
