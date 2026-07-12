import type { AssistantLanguage, AssistantPreferences } from "./types";
import type { KnowledgeItem, KnowledgeKind } from "./knowledge";

const EXTRA_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "property-breakfast",
    kind: "property",
    title: "Breakfast at Voulamandis House",
    summary: "Breakfast is available as an optional service for guests who prefer an easier start to the day.",
    facts: [
      "Breakfast is optional and costs 12 € per person.",
      "It is not automatically included in every accommodation price.",
      "Guests should confirm arrangements with reception.",
    ],
    tags: ["breakfast", "12 euro", "morning", "food", "optional breakfast"],
    attributes: { familyFriendly: true },
  },
  {
    id: "property-setting",
    kind: "property",
    title: "Historic Kambos setting and citrus estate",
    summary: "Voulamandis House is set in the historic Kambos area, within a peaceful citrus estate that offers a calm atmosphere close to Chios Town.",
    facts: [
      "The property is located in Kambos, an area known for traditional estates, stone walls and citrus gardens.",
      "The garden setting is one of the strongest reasons to choose the property for a quiet stay.",
      "The property works well as a base for exploring southern and central Chios.",
    ],
    tags: ["kambos", "citrus estate", "garden", "quiet", "traditional", "location"],
    image: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
    attributes: { quiet: true, familyFriendly: true },
  },
  {
    id: "transport-arrival",
    kind: "transport",
    title: "Arrival and local transport",
    summary: "Voulamandis House is in Kambos; a car or taxi makes transfers and island exploration easier.",
    facts: [
      "Guests can reach the property from Chios Airport or Chios Port.",
      "A car or taxi is recommended for easier access to beaches, villages and attractions.",
      "Reception can provide practical arrival guidance before the stay.",
    ],
    tags: ["airport", "port", "arrival", "taxi", "car", "directions", "transport"],
    links: {
      en: "/pre-arrival/", el: "/el/pre-arrival/", fr: "/fr/pre-arrival/", de: "/de/pre-arrival/", it: "/it/pre-arrival/", es: "/es/pre-arrival/", tr: "/tr/pre-arrival/",
    },
  },
  {
    id: "beach-komi",
    kind: "beach",
    title: "Komi Beach",
    summary: "Komi is a sandy beach in southern Chios that is often a practical choice for families and visitors who want an easy full beach day.",
    facts: [
      "Komi is presented on the site as a relaxed sandy beach option.",
      "It is suitable for combining swimming with food or a longer family outing.",
      "Driving is recommended from Kambos.",
    ],
    tags: ["komi", "sandy", "family beach", "children", "south chios", "organized"],
    image: "/images/beaches/komi-sandy-beach-chios.webp",
    links: {
      en: "/chios/chios-beaches/komi-beach/", el: "/el/paralies-xios/paralia-komi/", fr: "/fr/plages-de-chios/plage-komi/", de: "/de/straende-chios/komi-strand/", it: "/it/spiagge-chios/spiaggia-komi/", es: "/es/playas-chios/playa-komi/",
    },
    attributes: { sandy: true, organized: true, familyFriendly: true, suitableForChildren: true },
  },
  {
    id: "beach-karfas",
    kind: "beach",
    title: "Karfas Beach",
    summary: "Karfas is one of the more practical nearby beach choices from Kambos when guests want less driving and an easy day by the sea.",
    facts: [
      "Karfas is included among the practical beaches near Voulamandis House.",
      "It can work well for a shorter beach day or for families seeking convenience.",
      "A car or taxi is recommended.",
    ],
    tags: ["karfas", "nearby", "family", "easy beach", "less driving"],
    image: "/images/beaches/karfas-beach-chios.webp",
    attributes: { nearby: true, familyFriendly: true, suitableForChildren: true },
  },
  {
    id: "museum-mastic",
    kind: "museum",
    title: "Chios Mastic Museum",
    summary: "The Chios Mastic Museum is one of the island's strongest cultural visits, explaining the history and production of mastic in southern Chios.",
    facts: [
      "The museum is a good cultural stop for adults and families.",
      "It helps visitors understand the mastic villages and the island's most distinctive product.",
      "Opening hours and ticket prices should be checked from the official museum source before visiting.",
    ],
    tags: ["mastic museum", "masticha", "culture", "family", "south chios", "history"],
    image: "/images/family/moysio-mastixas-1-Copy.webp",
    links: {
      en: "/chios/chios-museums/the-mastic-museum-chios/", el: "/el/mouseia-xios/mouseio-mastichas-xios/", fr: "/fr/musees-de-chios/musee-du-mastic-chios/", de: "/de/museen-chios/mastix-museum-chios/", it: "/it/musei-chios/museo-del-mastice-chios/", es: "/es/museos-chios/museo-mastiha-chios/",
    },
    attributes: { familyFriendly: true, suitableForChildren: true },
  },
  {
    id: "museum-korais",
    kind: "museum",
    title: "Korais Library",
    summary: "Korais Library is an important cultural stop in Chios Town for visitors interested in books, local history and heritage.",
    facts: [
      "The library is included in the site's family and cultural suggestions.",
      "It can be combined with a walk in Chios Town.",
      "Visitors should verify current visiting hours before going.",
    ],
    tags: ["korais library", "chios town", "culture", "books", "history"],
    image: "/images/museums/vivlitothiki-korai-1.webp",
    links: {
      en: "/chios/chios-museums/koraes-library-chios/", el: "/el/mouseia-xios/vivliothiki-korai-xios/", fr: "/fr/musees-de-chios/bibliotheque-korais-chios/", de: "/de/museen-chios/korais-bibliothek-chios/", it: "/it/musei-chios/biblioteca-korais-chios/", es: "/es/museos-chios/biblioteca-korais-chios/",
    },
    attributes: { familyFriendly: true },
  },
  {
    id: "villages-mastic",
    kind: "village",
    title: "Mastic villages of southern Chios",
    summary: "The mastic villages are among the most distinctive parts of Chios and combine medieval architecture, local history and traditional village life.",
    facts: [
      "Southern Chios is known for its mastic villages.",
      "A village route can be combined with the Chios Mastic Museum and a southern beach.",
      "A car is the most practical way to explore several villages in one day.",
    ],
    tags: ["mastic villages", "pyrgi", "mesta", "olympoi", "south chios", "medieval villages"],
    links: {
      en: "/chios/chios-villages/", el: "/el/xoria-xios/", fr: "/fr/villages-de-chios/", de: "/de/doerfer-chios/", it: "/it/villaggi-chios/", es: "/es/pueblos-chios/",
    },
    attributes: { familyFriendly: true },
  },
  {
    id: "activity-family-outdoors",
    kind: "activity",
    title: "Outdoor activities for families",
    summary: "The site suggests simple outdoor activities, playground time and selected activities for families travelling with children.",
    facts: [
      "Daskalopetra playground is included among family suggestions.",
      "Outdoor plans can be combined with a nearby beach or a short visit to Chios Town.",
      "Paintball is more appropriate for older children and should be checked directly with the operator.",
    ],
    tags: ["children", "family activities", "playground", "daskalopetra", "outdoor", "paintball"],
    image: "/images/family/paidiki_xara_daskalopetras_210222_2.webp",
    attributes: { familyFriendly: true, suitableForChildren: true },
  },
  {
    id: "itinerary-family-day",
    kind: "family",
    title: "Practical family day in Chios",
    summary: "A balanced family day can combine one cultural stop, a relaxed meal and a child-friendly beach without overloading the schedule.",
    facts: [
      "A practical option is the Mastic Museum followed by a southern beach such as Komi.",
      "For a lighter day, choose a nearby beach and a short activity or walk.",
      "Families generally benefit from keeping driving and the number of stops limited.",
    ],
    tags: ["family itinerary", "children", "one day", "museum and beach", "relaxed plan"],
    attributes: { familyFriendly: true, suitableForChildren: true },
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
    if (key === "floor" && value === "ground" && attrs.groundFloor) score += 5;
    if (key === "floor" && value === "first" && attrs.firstFloor) score += 5;
  }
  return score;
}

export function searchExtraKnowledge(input: {
  query: string;
  language?: AssistantLanguage;
  kinds?: KnowledgeKind[];
  preferences?: AssistantPreferences;
  limit?: number;
}) {
  const query = normalize(input.query);
  const terms = query.split(" ").filter((term) => term.length > 1);
  const limit = Math.max(1, Math.min(input.limit || 5, 10));
  return EXTRA_KNOWLEDGE
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
