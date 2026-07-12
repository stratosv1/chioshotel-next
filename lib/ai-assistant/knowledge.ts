import type { AssistantLanguage, AssistantPreferences } from "./types";

export type KnowledgeKind =
  | "property"
  | "room"
  | "pricing"
  | "booking"
  | "beach"
  | "village"
  | "museum"
  | "activity"
  | "family"
  | "transport";

export type LocalizedLinks = Partial<Record<AssistantLanguage, string>>;

export type KnowledgeItem = {
  id: string;
  kind: KnowledgeKind;
  title: string;
  summary: string;
  facts: string[];
  tags: string[];
  image?: string;
  links?: LocalizedLinks;
  attributes?: {
    nearby?: boolean;
    quiet?: boolean;
    familyFriendly?: boolean;
    suitableForChildren?: boolean;
    sandy?: boolean;
    organized?: boolean;
    sheltered?: boolean;
    noStairs?: boolean;
    groundFloor?: boolean;
    firstFloor?: boolean;
    kitchenette?: boolean;
    fullKitchen?: boolean;
  };
};

export const SALES_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "property-voulamandis-house",
    kind: "property",
    title: "Voulamandis House",
    summary: "A rooms-and-apartments property in the historic Kambos area of Chios, set in a peaceful citrus estate and used as a calm base for exploring the island.",
    facts: [
      "The property is in Kambos, Chios.",
      "It offers rooms and independent family apartments rather than operating as a conventional hotel.",
      "Guests can ask reception for local recommendations during their stay.",
      "A car or taxi is useful for easier beach days and island exploration.",
    ],
    tags: ["voulamandis house", "property", "kambos", "garden", "citrus", "quiet stay", "chios accommodation"],
    image: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
    links: {
      en: "/",
      el: "/el/",
      fr: "/fr/",
      de: "/de/",
      it: "/it/",
      es: "/es/",
      tr: "/tr/",
    },
    attributes: { quiet: true, familyFriendly: true },
  },
  {
    id: "rooms-economy",
    kind: "room",
    title: "Economy double rooms 2 and 6",
    summary: "The lowest-priced room category for up to two guests, with one double bed in each room.",
    facts: [
      "Room 2 is on the first floor and is reached by stairs.",
      "Room 6 is on the ground floor without stairs and has garden access or view.",
      "Both rooms accommodate up to two guests.",
      "Live prices and availability must always come from the booking availability service.",
    ],
    tags: ["economy", "cheap", "budget", "double room", "room 2", "room 6", "two guests"],
    links: {
      en: "/chios-rooms/economy-double-rooms/",
      el: "/el/domatia-xios/oikonomiko-diklino-domatio/",
      fr: "/fr/chambres-a-chios/chambres-doubles-economiques/",
      de: "/de/zimmer-chios/economy-zimmer-auf-chios/",
      it: "/it/stanze-a-chios/camera-doppia-economica-chios/",
      es: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
      tr: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
    },
    attributes: { familyFriendly: false },
  },
  {
    id: "rooms-standard-ground",
    kind: "room",
    title: "Ground-floor standard rooms 5 and 7",
    summary: "Standard ground-floor rooms with no stairs and direct access to the courtyard or garden.",
    facts: [
      "Rooms 5 and 7 are on the ground floor.",
      "They are suitable for guests who prefer to avoid stairs.",
      "They can accommodate up to three guests depending on the room layout.",
    ],
    tags: ["ground floor", "no stairs", "room 5", "room 7", "garden access", "three guests"],
    links: {
      en: "/chios-rooms/standard-double-room/",
      el: "/el/domatia-xios/diklina-triklina-domatia/",
    },
    attributes: { noStairs: true, groundFloor: true, familyFriendly: true },
  },
  {
    id: "rooms-standard-first",
    kind: "room",
    title: "First-floor standard rooms 1, 3 and 4",
    summary: "First-floor standard rooms for couples, friends or small families, reached by stairs.",
    facts: [
      "Room 1 can accommodate up to four guests.",
      "Rooms 3 and 4 can accommodate up to three guests.",
      "Rooms 3 and 4 include a kitchenette.",
      "Room 1 and room 4 have private balcony features.",
    ],
    tags: ["first floor", "stairs", "room 1", "room 3", "room 4", "kitchenette", "balcony"],
    links: {
      en: "/chios-rooms/standard-double-room/",
      el: "/el/domatia-xios/diklina-triklina-domatia/",
    },
    attributes: { firstFloor: true, kitchenette: true, familyFriendly: true },
  },
  {
    id: "rooms-family-apartments",
    kind: "room",
    title: "Family apartments 8, 9 and 10",
    summary: "Independent ground-floor family apartments with a full kitchen, separate spaces and garden setting.",
    facts: [
      "Apartments 8 and 9 accommodate up to four guests.",
      "Apartment 10 can host five guests only under specific conditions, with a more limited space and an additional bed usually placed in the parents' room.",
      "The apartments are on the ground floor with independent entrances.",
      "They include a full kitchen and are practical for families or longer stays.",
    ],
    tags: ["family apartment", "room 8", "room 9", "room 10", "full kitchen", "ground floor", "long stay", "children"],
    links: {
      en: "/chios-rooms/family-chios-apartments/",
      el: "/el/domatia-xios/oikogeneiako-diamerisma/",
      fr: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
      de: "/de/zimmer-chios/familienapartments-in-chios/",
      it: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
      es: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
      tr: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
    },
    attributes: { groundFloor: true, noStairs: true, fullKitchen: true, familyFriendly: true, suitableForChildren: true },
  },
  {
    id: "pricing-live",
    kind: "pricing",
    title: "Live prices and direct-booking offer",
    summary: "Prices and availability are dynamic and must be retrieved live for the selected dates and guest count.",
    facts: [
      "The assistant must never invent a price or availability result.",
      "The live booking search is the source of truth for room availability and totals.",
      "The direct assistant flow currently applies a 10% direct-booking discount and does not stack it with another offer.",
      "A booking is confirmed only by reception; submitting a request does not automatically charge or confirm the stay.",
    ],
    tags: ["price", "availability", "discount", "direct booking", "offer", "booking request"],
  },
  {
    id: "nearby-beaches",
    kind: "beach",
    title: "Nearby beaches from Voulamandis House",
    summary: "Karfas, Glari Beach, Agia Fotia and Daskalopetra are practical beach choices when guests want an easier route and less driving from Kambos.",
    facts: [
      "Nearby beaches are useful for half-day swimming or arrival and departure days.",
      "A car or taxi is recommended from Kambos.",
      "Reception can suggest the most suitable nearby option depending on wind, timing and the guest's preferred atmosphere.",
    ],
    tags: ["nearby beach", "karfas", "glari", "agia fotia", "daskalopetra", "less driving", "half day"],
    image: "/images/beaches/agia-fotia-beach-chios.webp",
    links: {
      en: "/beaches-near-voulamandis-house/",
      el: "/el/kontines-paralies-voulamandis-house/",
      fr: "/fr/plages-proches-voulamandis-house/",
      de: "/de/straende-nahe-voulamandis-house/",
      it: "/it/spiagge-vicine-voulamandis-house/",
      es: "/es/playas-cerca-voulamandis-house/",
      tr: "/tr/voulamandis-house-yakin-plajlar/",
    },
    attributes: { nearby: true, familyFriendly: true },
  },
  {
    id: "family-holidays",
    kind: "family",
    title: "Family holidays in Chios",
    summary: "The site presents a family-focused combination of beaches, cultural stops, outdoor activities and family apartments at Voulamandis House.",
    facts: [
      "Komi is presented as a relaxed sandy-beach option for families.",
      "The Chios Mastic Museum and Korais Library are included among cultural family suggestions.",
      "Daskalopetra playground and simple outdoor activities are included among ideas for children.",
      "Family apartments are the strongest accommodation match when guests need a kitchen and more space.",
    ],
    tags: ["family holiday", "children", "komi", "mastic museum", "korais library", "playground", "family apartment"],
    image: "/images/family/ChatGPT-Image-Feb-13-2026-08_32_22-PM.webp",
    links: {
      en: "/family-holidays-chios/",
      el: "/el/oikogeneiakes-diakopes-xios/",
    },
    attributes: { familyFriendly: true, suitableForChildren: true },
  },
];

function normalize(value: string) {
  return value
    .toLocaleLowerCase("en")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function preferenceScore(item: KnowledgeItem, preferences?: AssistantPreferences) {
  if (!preferences) return 0;
  const attributes = item.attributes || {};
  let score = 0;
  for (const [key, value] of Object.entries(preferences)) {
    if (value === true && attributes[key as keyof typeof attributes] === true) score += 5;
    if (key === "floor" && value === "ground" && attributes.groundFloor) score += 5;
    if (key === "floor" && value === "first" && attributes.firstFloor) score += 5;
    if (key === "budget" && value === "lowest" && item.id === "rooms-economy") score += 6;
    if (key === "budget" && value === "family" && item.id === "rooms-family-apartments") score += 6;
  }
  return score;
}

export function searchSalesKnowledge(input: {
  query: string;
  language?: AssistantLanguage;
  kinds?: KnowledgeKind[];
  preferences?: AssistantPreferences;
  limit?: number;
}) {
  const query = normalize(input.query);
  const terms = query.split(" ").filter((term) => term.length > 1);
  const limit = Math.max(1, Math.min(input.limit || 5, 10));

  return SALES_KNOWLEDGE
    .filter((item) => !input.kinds?.length || input.kinds.includes(item.kind))
    .map((item) => {
      const haystack = normalize([item.title, item.summary, ...item.facts, ...item.tags].join(" "));
      const lexical = terms.reduce((score, term) => score + (haystack.includes(term) ? 2 : 0), 0);
      const exactTag = item.tags.some((tag) => query.includes(normalize(tag))) ? 5 : 0;
      return { item, score: lexical + exactTag + preferenceScore(item, input.preferences) };
    })
    .filter((result) => result.score > 0 || Boolean(input.preferences))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item, score }) => ({
      ...item,
      score,
      url: item.links?.[input.language || "en"] || item.links?.en,
    }));
}
