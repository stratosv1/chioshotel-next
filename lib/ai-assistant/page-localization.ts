import type { Metadata, Viewport } from "next";
import type { AssistantLanguage } from "@/lib/ai-assistant/types";
import { ROOM_FINDER_HREFS } from "@/lib/room-finder-cta-routing";
import { absoluteUrl } from "@/lib/seo";
import { siteImageAssets } from "@/lib/site-assets";

type AiAssistantPageCopy = {
  title: string;
  description: string;
};

export const AI_ASSISTANT_LANGUAGES: readonly AssistantLanguage[] = [
  "en",
  "el",
  "fr",
  "de",
  "it",
  "es",
  "tr",
] as const;

export const LOCALIZED_AI_ASSISTANT_LANGUAGES = AI_ASSISTANT_LANGUAGES.filter(
  (language): language is Exclude<AssistantLanguage, "en"> => language !== "en",
);

const AI_ASSISTANT_PAGE_COPY: Record<AssistantLanguage, AiAssistantPageCopy> = {
  en: {
    title: "AI Room Finder | Voulamandis House",
    description: "Check live room availability and send an accommodation enquiry directly to Voulamandis House reception.",
  },
  el: {
    title: "Βρείτε δωμάτιο με AI | Voulamandis House",
    description: "Ελέγξτε ζωντανά τη διαθεσιμότητα δωματίων και στείλτε αίτημα διαμονής απευθείας στη ρεσεψιόν του Voulamandis House.",
  },
  fr: {
    title: "Trouvez votre chambre avec l’IA | Voulamandis House",
    description: "Consultez les chambres disponibles en direct et envoyez votre demande de séjour directement à la réception du Voulamandis House.",
  },
  de: {
    title: "Zimmer mit KI finden | Voulamandis House",
    description: "Prüfen Sie die aktuelle Zimmerverfügbarkeit und senden Sie Ihre Unterkunftsanfrage direkt an die Rezeption des Voulamandis House.",
  },
  it: {
    title: "Trova la tua camera con l’IA | Voulamandis House",
    description: "Controlla in tempo reale le camere disponibili e invia la tua richiesta di soggiorno direttamente alla reception del Voulamandis House.",
  },
  es: {
    title: "Encuentra tu habitación con IA | Voulamandis House",
    description: "Consulta en directo las habitaciones disponibles y envía tu solicitud de alojamiento directamente a la recepción de Voulamandis House.",
  },
  tr: {
    title: "Yapay zekâ ile odanızı bulun | Voulamandis House",
    description: "Güncel oda müsaitliğini kontrol edin ve konaklama talebinizi doğrudan Voulamandis House resepsiyonuna gönderin.",
  },
};

export const aiAssistantViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#a4907c",
};

export function isAiAssistantLanguage(value: string): value is AssistantLanguage {
  return AI_ASSISTANT_LANGUAGES.includes(value as AssistantLanguage);
}

export function isLocalizedAiAssistantLanguage(
  value: string,
): value is Exclude<AssistantLanguage, "en"> {
  return LOCALIZED_AI_ASSISTANT_LANGUAGES.includes(
    value as Exclude<AssistantLanguage, "en">,
  );
}

export function buildAiAssistantMetadata(language: AssistantLanguage): Metadata {
  const copy = AI_ASSISTANT_PAGE_COPY[language];
  const canonicalPath = ROOM_FINDER_HREFS[language];
  const languages = Object.fromEntries(
    AI_ASSISTANT_LANGUAGES.map((code) => [code, absoluteUrl(ROOM_FINDER_HREFS[code])]),
  );

  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
      languages: {
        ...languages,
        "x-default": absoluteUrl(ROOM_FINDER_HREFS.en),
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: absoluteUrl(canonicalPath),
      type: "website",
      images: [
        {
          url: absoluteUrl(siteImageAssets.homepageHero.src),
          width: siteImageAssets.homepageHero.width,
          height: siteImageAssets.homepageHero.height,
          alt: "Voulamandis House in Kambos, Chios - rooms and apartments",
        },
      ],
    },
    // Same Google preview directives as the rest of the site (lib/seo).
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
