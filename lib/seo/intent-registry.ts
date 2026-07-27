import type { LanguageCode } from "@/lib/languages";
import { normalizePath } from "@/lib/languages";

export type SeoIntentOwnerPaths = Record<LanguageCode, string>;

export type SeoIntentTarget = {
  key: string;
  label: string;
  ownerPaths: SeoIntentOwnerPaths;
  queryTerms: readonly string[];
  note?: string;
};

export type SeoAuditDefinition = {
  audit: number;
  label: string;
  strategy: "dedicated-owner" | "split-owner" | "shared-owner";
  targets: readonly SeoIntentTarget[];
};

const accommodationOwners: SeoIntentOwnerPaths = {
  en: "/chios-accommodation/",
  el: "/el/diamoni-sti-xio/",
  fr: "/fr/hebergement-chios/",
  de: "/de/chios-unterkunft/",
  it: "/it/alloggio-chios/",
  es: "/es/alojamiento-chios/",
  tr: "/tr/sakiz-adasi-konaklama/",
};

export const SEO_AUDITS: readonly SeoAuditDefinition[] = [
  {
    audit: 1,
    label: "Accommodation / Διαμονή στη Χίο",
    strategy: "dedicated-owner",
    targets: [
      {
        key: "accommodation",
        label: "Γενική διαμονή",
        ownerPaths: accommodationOwners,
        queryTerms: [
          "chios accommodation",
          "accommodation in chios",
          "διαμονη στη χιο",
          "διαμονη χιος",
          "hebergement chios",
          "unterkunft chios",
          "unterkunft auf chios",
          "alloggio chios",
          "alojamiento chios",
          "alojamiento quios",
          "sakiz adasi konaklama",
        ],
      },
    ],
  },
  {
    audit: 2,
    label: "Rooms / Δωμάτια Χίος",
    strategy: "dedicated-owner",
    targets: [
      {
        key: "rooms",
        label: "Δωμάτια",
        ownerPaths: {
          en: "/chios-rooms/",
          el: "/el/domatia-xios/",
          fr: "/fr/chambres-a-chios/",
          de: "/de/chios-zimmer/",
          it: "/it/camere-a-chios/",
          es: "/es/habitaciones-en-chios/",
          tr: "/tr/sakiz-adasi-odalari/",
        },
        queryTerms: [
          "chios rooms",
          "rooms in chios",
          "δωματια χιος",
          "δωματια στη χιο",
          "ενοικιαζομενα δωματια χιος",
          "chambres chios",
          "chambres a chios",
          "zimmer chios",
          "zimmer auf chios",
          "camere chios",
          "camere a chios",
          "habitaciones chios",
          "habitaciones en quios",
          "sakiz adasi odalari",
          "sakiz odalari",
        ],
      },
    ],
  },
  {
    audit: 3,
    label: "Kambos / Κάμπος Χίου",
    strategy: "dedicated-owner",
    targets: [
      {
        key: "kambos",
        label: "Διαμονή στον Κάμπο",
        ownerPaths: {
          en: "/chios/kampos-chios/",
          el: "/el/chios/kampos-chios/",
          fr: "/fr/chios/kampos-chios/",
          de: "/de/chios/kampos-chios/",
          it: "/it/chios/kampos-chios/",
          es: "/es/chios/kampos-chios/",
          tr: "/tr/chios/kampos-chios/",
        },
        queryTerms: [
          "kambos chios accommodation",
          "kampos chios accommodation",
          "stay in kambos chios",
          "διαμονη καμπος χιου",
          "διαμονη στον καμπο χιου",
          "δωματια καμπος χιου",
          "hebergement kambos chios",
          "unterkunft kambos chios",
          "alloggio kambos chios",
          "alojamiento kambos chios",
          "kambos sakiz adasi konaklama",
        ],
      },
    ],
  },
  {
    audit: 4,
    label: "Hotels / Ξενοδοχεία Χίος",
    strategy: "dedicated-owner",
    targets: [
      {
        key: "hotels",
        label: "Hotel-search intent",
        ownerPaths: {
          en: "/chios-hotels/",
          el: "/el/xenodoxeia-xios/",
          fr: "/fr/hotels-chios/",
          de: "/de/hotels-auf-chios/",
          it: "/it/hotel-chios/",
          es: "/es/hoteles-chios/",
          tr: "/tr/sakiz-adasi-otelleri/",
        },
        queryTerms: [
          "chios hotels",
          "hotels in chios",
          "ξενοδοχεια χιος",
          "ξενοδοχεια στη χιο",
          "hotel chios",
          "hotels chios",
          "hotels auf chios",
          "hotel a chios",
          "hoteles chios",
          "hoteles en quios",
          "sakiz adasi otelleri",
          "sakiz otelleri",
        ],
        note: "Ο όρος hotel στοχεύεται ως search intent. Το Voulamandis House δεν χαρακτηρίζεται ως ξενοδοχείο.",
      },
    ],
  },
  {
    audit: 5,
    label: "Direct booking & Deals",
    strategy: "split-owner",
    targets: [
      {
        key: "direct-booking",
        label: "Άμεση κράτηση / τιμές / διαθεσιμότητα",
        ownerPaths: {
          en: "/chios-hotels-rates/",
          el: "/el/amesi-kratisi-voulamandis-house/",
          fr: "/fr/tarifs-des-hotels-a-chios/",
          de: "/de/hotelpreise-auf-der-insel-chios/",
          it: "/it/prezzi-hotel-chios/",
          es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
          tr: "/tr/sakiz-adasi-rezervasyon/",
        },
        queryTerms: [
          "chios direct booking",
          "book chios accommodation",
          "chios room rates",
          "αμεση κρατηση χιος",
          "κρατηση χιος",
          "τιμες διαμονης χιος",
          "reservation directe chios",
          "tarifs chios",
          "direktbuchung chios",
          "preise chios unterkunft",
          "prenotazione diretta chios",
          "prezzi soggiorno chios",
          "reserva directa quios",
          "precios alojamiento quios",
          "sakiz adasi rezervasyon",
          "direkt rezervasyon sakiz",
        ],
      },
      {
        key: "deals",
        label: "Προσφορές διαμονής / πακέτα / κωδικοί",
        ownerPaths: {
          en: "/best-chios-travel-deals-for-chios-hotels/",
          el: "/el/crazy-travel-deals-for-chios-hotels/",
          fr: "/fr/offres-de-voyage-pour-les-hotels-a-chios/",
          de: "/de/beste-reiseangebote-fur-chios-hotels-auf-chios/",
          it: "/it/offerte-di-viaggio-hotels-chios/",
          es: "/es/mejores-ofertas-de-viaje-a-quios-para-hoteles-en-quios/",
          tr: "/tr/sakiz-adasi-otel-firsatlari/",
        },
        queryTerms: [
          "chios accommodation deals",
          "chios travel deals",
          "chios offers",
          "προσφορες διαμονης χιος",
          "προσφορες χιος",
          "πακετα διαμονης χιος",
          "offres sejour chios",
          "offres chios",
          "unterkunftsangebote chios",
          "chios angebote",
          "offerte soggiorno chios",
          "offerte chios",
          "ofertas alojamiento quios",
          "ofertas quios",
          "sakiz adasi konaklama firsatlari",
          "sakiz firsatlari",
        ],
        note: "Τα legacy slugs διατηρούνται. Η ορατή στόχευση είναι offers/deals, όχι hotels.",
      },
    ],
  },
  {
    audit: 6,
    label: "Apartments / Διαμερίσματα Χίος",
    strategy: "dedicated-owner",
    targets: [
      {
        key: "apartments",
        label: "Διαμερίσματα / οικογενειακά διαμερίσματα",
        ownerPaths: {
          en: "/chios-rooms/family-chios-apartments/",
          el: "/el/domatia-xios/oikogeneiako-diamerisma/",
          fr: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
          de: "/de/zimmer-chios/familienapartments-in-chios/",
          it: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
          es: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
          tr: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
        },
        queryTerms: [
          "apartments in chios",
          "chios apartments",
          "family apartments chios",
          "διαμερισματα χιος",
          "διαμερισματα στη χιο",
          "οικογενειακα διαμερισματα χιος",
          "appartements chios",
          "appartements a chios",
          "apartments chios",
          "ferienwohnung chios",
          "appartamenti chios",
          "appartamenti a chios",
          "apartamentos quios",
          "apartamentos en quios",
          "sakiz adasi daireleri",
          "aile daireleri sakiz",
        ],
      },
    ],
  },
  {
    audit: 7,
    label: "Family travel / Χίος με παιδιά",
    strategy: "dedicated-owner",
    targets: [
      {
        key: "family-travel",
        label: "Οικογενειακές διακοπές / ταξίδι με παιδιά",
        ownerPaths: {
          en: "/family-travel-in-chios/",
          el: "/el/oikogeneiakes-diakopes-sti-xio/",
          fr: "/fr/vacances-en-famille-a-chios/",
          de: "/de/familienurlaub-auf-chios/",
          it: "/it/vacanze-in-famiglia-a-chios/",
          es: "/es/vacaciones-en-familia-en-quios/",
          tr: "/tr/sakiz-adasi-aile-tatili/",
        },
        queryTerms: [
          "family holidays chios",
          "chios with kids",
          "chios with children",
          "οικογενειακες διακοπες χιος",
          "χιος με παιδια",
          "διακοπες χιος με παιδια",
          "vacances famille chios",
          "chios avec enfants",
          "familienurlaub chios",
          "chios mit kindern",
          "vacanze famiglia chios",
          "chios con bambini",
          "vacaciones familia quios",
          "quios con ninos",
          "sakiz adasi aile tatili",
          "sakiz adasi cocuklarla",
        ],
      },
    ],
  },
  {
    audit: 8,
    label: "Romantic stay / Διαμονή για ζευγάρια",
    strategy: "dedicated-owner",
    targets: [
      {
        key: "romantic-stay",
        label: "Ρομαντική διαμονή / couples stay",
        ownerPaths: {
          en: "/romantic-stay-in-chios/",
          el: "/el/romantiki-diamoni-sti-xio/",
          fr: "/fr/sejour-romantique-chios/",
          de: "/de/romantischer-aufenthalt-auf-chios/",
          it: "/it/soggiorno-romantico-chios/",
          es: "/es/estancia-romantica-quios/",
          tr: "/tr/sakiz-adasi-romantik-konaklama/",
        },
        queryTerms: [
          "romantic stay chios",
          "chios for couples",
          "couples stay chios",
          "ρομαντικη διαμονη χιος",
          "διαμονη για ζευγαρια χιος",
          "ρομαντικες διακοπες χιος",
          "sejour romantique chios",
          "chios en couple",
          "romantischer aufenthalt chios",
          "chios fur paare",
          "soggiorno romantico chios",
          "chios per coppie",
          "estancia romantica quios",
          "quios para parejas",
          "sakiz adasi romantik konaklama",
          "sakiz adasi ciftler",
        ],
      },
    ],
  },
  {
    audit: 9,
    label: "Guest house / Παραδοσιακή διαμονή",
    strategy: "shared-owner",
    targets: [
      {
        key: "traditional-accommodation",
        label: "Guest house / ξενώνας / παραδοσιακό κατάλυμα",
        ownerPaths: accommodationOwners,
        queryTerms: [
          "chios guest house",
          "guesthouse chios",
          "traditional accommodation chios",
          "ξενωνας χιος",
          "παραδοσιακο καταλυμα χιος",
          "παραδοσιακη διαμονη χιος",
          "maison d hotes chios",
          "hebergement traditionnel chios",
          "gastehaus chios",
          "traditionelle unterkunft chios",
          "guest house chios",
          "alloggio tradizionale chios",
          "casa de huespedes quios",
          "alojamiento tradicional quios",
          "sakiz adasi pansiyon",
          "geleneksel konaklama sakiz",
        ],
        note: "Το #9 ενισχύει τον owner του #1. Δεν δημιουργείται νέα landing page.",
      },
    ],
  },
] as const;

export type SeoIntentMatch = {
  audit: number;
  auditLabel: string;
  target: SeoIntentTarget;
  locale: LanguageCode;
  ownerPath: string;
  pagePath: string;
  isOwner: boolean;
  matchedBy: "query" | "page";
};

const QUERY_MATCH_ORDER = [
  "traditional-accommodation",
  "romantic-stay",
  "family-travel",
  "apartments",
  "deals",
  "direct-booking",
  "hotels",
  "kambos",
  "rooms",
  "accommodation",
] as const;

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘`]/g, "'")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9α-ωάέήίόύώϊϋΐΰçğıöşüñ\s'-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function localeFromPath(path: string): LanguageCode {
  const normalized = normalizePath(path);
  if (normalized.startsWith("/el/")) return "el";
  if (normalized.startsWith("/fr/")) return "fr";
  if (normalized.startsWith("/de/")) return "de";
  if (normalized.startsWith("/it/")) return "it";
  if (normalized.startsWith("/es/")) return "es";
  if (normalized.startsWith("/tr/")) return "tr";
  return "en";
}

function allTargets() {
  return SEO_AUDITS.flatMap((audit) =>
    audit.targets.map((target) => ({ audit, target })),
  );
}

export function findSeoIntentByOwnerPath(pageUrlOrPath: string) {
  const pagePath = normalizePath(
    pageUrlOrPath.replace(/^https?:\/\/[^/]+/i, "") || "/",
  );

  for (const audit of SEO_AUDITS) {
    if (audit.audit === 9) continue;
    for (const target of audit.targets) {
      if (
        Object.values(target.ownerPaths).some(
          (ownerPath) => normalizePath(ownerPath) === pagePath,
        )
      ) {
        return { audit, target };
      }
    }
  }

  return undefined;
}

export function matchSeoIntentQuery(query: string) {
  const normalizedQuery = fold(query);
  if (!normalizedQuery) return undefined;

  const targets = allTargets();
  for (const key of QUERY_MATCH_ORDER) {
    const candidate = targets.find(({ target }) => target.key === key);
    if (!candidate) continue;

    const matches = candidate.target.queryTerms.some((term) =>
      normalizedQuery.includes(fold(term)),
    );
    if (matches) return candidate;
  }

  return undefined;
}

export function getSeoIntentMatch(query: string | undefined, pageUrlOrPath: string | undefined): SeoIntentMatch | undefined {
  if (!pageUrlOrPath) return undefined;

  const pagePath = normalizePath(
    pageUrlOrPath.replace(/^https?:\/\/[^/]+/i, "") || "/",
  );
  const locale = localeFromPath(pagePath);
  const queryMatch = query ? matchSeoIntentQuery(query) : undefined;
  const pageMatch = findSeoIntentByOwnerPath(pagePath);
  const selected = queryMatch || pageMatch;

  if (!selected) return undefined;

  const ownerPath = normalizePath(selected.target.ownerPaths[locale]);
  return {
    audit: selected.audit.audit,
    auditLabel: selected.audit.label,
    target: selected.target,
    locale,
    ownerPath,
    pagePath,
    isOwner: ownerPath === pagePath,
    matchedBy: queryMatch ? "query" : "page",
  };
}

export function getSeoAuditOwnerSummary(locale: LanguageCode = "el") {
  return SEO_AUDITS.map((audit) => ({
    audit: audit.audit,
    label: audit.label,
    strategy: audit.strategy,
    owners: audit.targets.map((target) => ({
      key: target.key,
      label: target.label,
      path: target.ownerPaths[locale],
      note: target.note,
    })),
  }));
}
