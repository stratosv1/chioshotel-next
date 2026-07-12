import type { AssistantLanguage, AssistantPreferences } from "./types";
import type { KnowledgeItem, KnowledgeKind } from "./knowledge";

const BEACHES_LINKS = {
  en: "/chios/chios-beaches/", el: "/el/paralies-xios/", fr: "/fr/plages-de-chios/", de: "/de/straende-chios/", it: "/it/spiagge-chios/", es: "/es/playas-chios/", tr: "/tr/sakiz-adasi-plajlari/",
};
const VILLAGES_LINKS = {
  en: "/chios/chios-villages/", el: "/el/xoria-xios/", fr: "/fr/villages-de-chios/", de: "/de/doerfer-chios/", it: "/it/villaggi-chios/", es: "/es/pueblos-chios/", tr: "/tr/sakiz-adasi-koyleri/",
};
const MUSEUMS_LINKS = {
  en: "/chios/chios-museums/", el: "/el/mouseia-xios/", fr: "/fr/musees-de-chios/", de: "/de/museen-chios/", it: "/it/musei-chios/", es: "/es/museos-chios/", tr: "/tr/sakiz-adasi-muzeleri/",
};

const EXPANDED_CHIOS_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "beach-glari",
    kind: "beach",
    title: "Glari Beach",
    summary: "Glari is included in the site's practical nearby-beach guide for guests staying in Kambos who want a simpler beach outing.",
    facts: [
      "It is grouped with the practical nearby options from Voulamandis House.",
      "It works well for a lighter or half-day beach plan.",
      "A car or taxi is recommended from Kambos.",
    ],
    tags: ["glari", "glari beach", "nearby beach", "half day", "easy beach", "kambos"],
    image: "/images/beaches/paralia-glaron-beach-chios.webp",
    links: BEACHES_LINKS,
    attributes: { nearby: true, familyFriendly: true },
  },
  {
    id: "beach-agia-fotia",
    kind: "beach",
    title: "Agia Fotia Beach",
    summary: "Agia Fotia is one of the nearby practical beach choices presented by the site for guests who want an easier route from Kambos.",
    facts: [
      "It is featured in the nearby-beaches guide of Voulamandis House.",
      "It can suit a shorter beach day or an arrival/departure day.",
      "A car or taxi is recommended.",
    ],
    tags: ["agia fotia", "nearby", "beach", "short beach day", "kambos"],
    image: "/images/beaches/agia-fotia-beach-chios.webp",
    links: {
      en: "/chios/chios-beaches/agia-fotia-beach/", el: "/el/paralies-xios/paralia-agia-fotia/", fr: "/fr/plages-de-chios/plage-agia-fotia/", de: "/de/straende-chios/agia-fotia-strand/", it: "/it/spiagge-chios/spiaggia-agia-fotia/", es: "/es/playas-chios/playa-agia-fotia/", tr: "/tr/sakiz-adasi-plajlari/agia-fotia-plaji/",
    },
    attributes: { nearby: true, familyFriendly: true },
  },
  {
    id: "beach-daskalopetra",
    kind: "beach",
    title: "Daskalopetra",
    summary: "Daskalopetra appears in the site's nearby-beach and family suggestions and can be combined with a simple outdoor family plan.",
    facts: [
      "It is included among the practical nearby beach options.",
      "The area can be paired with playground time for families.",
      "It is useful when guests prefer a lighter day rather than a long island route.",
    ],
    tags: ["daskalopetra", "nearby beach", "family", "playground", "children"],
    image: "/images/beaches/daskalopetra-beach-chios.webp",
    links: BEACHES_LINKS,
    attributes: { nearby: true, familyFriendly: true, suitableForChildren: true },
  },
  {
    id: "beach-nearby-plan",
    kind: "beach",
    title: "Nearby beach plan from Kambos",
    summary: "Karfas, Glari, Agia Fotia and Daskalopetra are the site's first practical choices when guests want less driving from Voulamandis House.",
    facts: [
      "Nearby beaches are especially useful for half-day swimming.",
      "They are practical on arrival or departure days.",
      "Reception can suggest the best nearby option according to the day's wind and the guest's preferred style.",
    ],
    tags: ["nearby beaches", "karfas", "glari", "agia fotia", "daskalopetra", "half day", "less driving"],
    image: "/images/beaches/agia-fotia-beach-chios.webp",
    links: {
      en: "/beaches-near-voulamandis-house/", el: "/el/kontines-paralies-voulamandis-house/", fr: "/fr/plages-proches-voulamandis-house/", de: "/de/straende-nahe-voulamandis-house/", it: "/it/spiagge-vicine-voulamandis-house/", es: "/es/playas-cerca-voulamandis-house/", tr: "/tr/voulamandis-house-yakin-plajlar/",
    },
    attributes: { nearby: true, familyFriendly: true },
  },
  {
    id: "village-pyrgi",
    kind: "village",
    title: "Pyrgi",
    summary: "Pyrgi is one of the best-known mastic villages and a strong stop for guests interested in the distinctive architecture and traditions of southern Chios.",
    facts: [
      "It belongs to the mastic-village route of southern Chios.",
      "It can be combined with another southern village, the Mastic Museum or a beach.",
      "A car is the practical choice for a multi-stop route.",
    ],
    tags: ["pyrgi", "mastic village", "south chios", "architecture", "village route"],
    links: VILLAGES_LINKS,
    attributes: { familyFriendly: true },
  },
  {
    id: "village-mesta",
    kind: "village",
    title: "Mesta",
    summary: "Mesta is a medieval mastic village and a suitable choice for visitors who want a slow walk through traditional stone-built village streets.",
    facts: [
      "It is part of the southern mastic-village experience.",
      "It fits well in a cultural day with one or two stops rather than an overloaded itinerary.",
      "A car is recommended from Kambos.",
    ],
    tags: ["mesta", "medieval village", "mastic village", "stone village", "south chios"],
    links: VILLAGES_LINKS,
    attributes: { quiet: true, familyFriendly: true },
  },
  {
    id: "village-olympoi",
    kind: "village",
    title: "Olympoi",
    summary: "Olympoi is another southern mastic village that can be included in a focused route through the island's medieval settlements.",
    facts: [
      "It is part of the wider mastic-village region.",
      "It can be paired with Pyrgi, Mesta or the Mastic Museum.",
      "Keeping the route to two or three main stops makes the day more comfortable.",
    ],
    tags: ["olympoi", "mastic village", "medieval", "south chios", "route"],
    links: VILLAGES_LINKS,
    attributes: { familyFriendly: true },
  },
  {
    id: "village-route-south",
    kind: "village",
    title: "Southern Chios village route",
    summary: "A practical southern route can combine one or two mastic villages with the Mastic Museum and, when time allows, a beach such as Komi.",
    facts: [
      "Pyrgi, Mesta and Olympoi are central names in the mastic-village route.",
      "The Mastic Museum gives useful context before or after the village visits.",
      "A car is recommended and the number of stops should match the available time.",
    ],
    tags: ["south chios itinerary", "pyrgi", "mesta", "olympoi", "mastic museum", "komi"],
    links: VILLAGES_LINKS,
    attributes: { familyFriendly: true },
  },
  {
    id: "activity-kambos-walk",
    kind: "activity",
    title: "Explore historic Kambos",
    summary: "A relaxed exploration of Kambos is a natural low-driving activity for guests staying at Voulamandis House.",
    facts: [
      "Kambos is known for traditional estates, stone walls and citrus gardens.",
      "It is suitable for a calm first or last day on the island.",
      "It can be combined with Chios Town or a nearby beach.",
    ],
    tags: ["kambos", "walk", "citrus", "historic estates", "quiet activity", "nearby"],
    image: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
    attributes: { nearby: true, quiet: true, familyFriendly: true },
  },
  {
    id: "activity-chios-town",
    kind: "activity",
    title: "Chios Town cultural walk",
    summary: "A town day can combine a walk, local history and a cultural stop such as Korais Library without requiring a full island excursion.",
    facts: [
      "Korais Library can be combined with a walk in Chios Town.",
      "This is a practical lighter-day option from Kambos.",
      "Current opening hours for cultural sites should be checked before visiting.",
    ],
    tags: ["chios town", "town walk", "korais library", "culture", "light day"],
    links: MUSEUMS_LINKS,
    attributes: { nearby: true, familyFriendly: true },
  },
  {
    id: "itinerary-arrival-day",
    kind: "family",
    title: "Easy arrival-day plan",
    summary: "For arrival day, a calm Kambos plan or a nearby beach is usually more practical than a long island route.",
    facts: [
      "Choose a nearby beach such as Karfas, Glari, Agia Fotia or Daskalopetra when time allows.",
      "Alternatively, stay close and explore the Kambos setting.",
      "Keep the schedule flexible around check-in and transfer time.",
    ],
    tags: ["arrival day", "easy itinerary", "nearby beach", "kambos", "short plan"],
    attributes: { nearby: true, familyFriendly: true },
  },
  {
    id: "itinerary-culture-beach",
    kind: "family",
    title: "Culture and beach day",
    summary: "A balanced day can combine one cultural stop with one beach, avoiding too many transfers and giving guests enough time at each place.",
    facts: [
      "One strong option is the Mastic Museum followed by Komi Beach.",
      "Another lighter option is Chios Town with a nearby beach.",
      "Families benefit from limiting the day to two main activities.",
    ],
    tags: ["culture and beach", "mastic museum", "komi", "family day", "balanced itinerary"],
    attributes: { familyFriendly: true, suitableForChildren: true },
  },
  {
    id: "itinerary-three-days",
    kind: "family",
    title: "Three-day Chios outline",
    summary: "A practical three-day outline mixes nearby discovery, southern Chios and a flexible beach or town day.",
    facts: [
      "Day 1: Kambos, Chios Town or a nearby beach.",
      "Day 2: Mastic Museum and one or two southern mastic villages.",
      "Day 3: choose a relaxed beach day according to driving preference and weather.",
    ],
    tags: ["three day itinerary", "3 days", "kambos", "mastic villages", "museum", "beach"],
    attributes: { familyFriendly: true },
  },
  {
    id: "itinerary-five-days",
    kind: "family",
    title: "Five-day Chios outline",
    summary: "A five-day stay allows guests to alternate cultural routes with easier beach days and avoid rushing across the island.",
    facts: [
      "Include one Kambos and Chios Town day.",
      "Include one southern mastic-village and Mastic Museum day.",
      "Use the remaining days for nearby beaches, a longer beach outing and a flexible rest day.",
    ],
    tags: ["five day itinerary", "5 days", "slow travel", "villages", "beaches", "culture"],
    attributes: { familyFriendly: true, quiet: true },
  },
];

function normalize(value: string) {
  return value.toLocaleLowerCase("en").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

function preferenceScore(item: KnowledgeItem, preferences?: AssistantPreferences) {
  if (!preferences) return 0;
  const attrs = item.attributes || {};
  let score = 0;
  for (const [key, value] of Object.entries(preferences)) {
    if (value === true && attrs[key as keyof typeof attrs] === true) score += 5;
  }
  return score;
}

export function searchExpandedChiosKnowledge(input: {
  query: string;
  language?: AssistantLanguage;
  kinds?: KnowledgeKind[];
  preferences?: AssistantPreferences;
  limit?: number;
}) {
  const query = normalize(input.query);
  const terms = query.split(" ").filter((term) => term.length > 1);
  const limit = Math.max(1, Math.min(input.limit || 5, 10));
  return EXPANDED_CHIOS_KNOWLEDGE
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
    .map(({ item, score }) => ({ ...item, score, url: item.links?.[input.language || "en"] || item.links?.en }));
}
