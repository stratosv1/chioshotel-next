const fs = require("fs");
const path = require("path");

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];

function expect(file, needle, message) {
  const text = read(file);
  if (!text.includes(needle)) failures.push(`${message} (${file})`);
}

function expectAll(file, needles, message) {
  const text = read(file);
  for (const needle of needles) {
    if (!text.includes(needle)) failures.push(`${message}: missing ${needle} (${file})`);
  }
}

function expectNone(file, needles, message) {
  const text = read(file);
  for (const needle of needles) {
    if (text.includes(needle)) failures.push(`${message}: found ${needle} (${file})`);
  }
}

expectAll(
  "lib/seo/intent-registry.ts",
  [
    "audit: 1",
    "audit: 2",
    "audit: 3",
    "audit: 4",
    "audit: 5",
    "audit: 6",
    "audit: 7",
    "audit: 8",
    "audit: 9",
    'tr: "/tr/sakiz-adasi-konaklama/"',
    'el: "/el/romantiki-diamoni-sti-xio/"',
    'key: "traditional-accommodation"',
  ],
  "SEO intent registry is incomplete",
);

expect(
  "lib/seo/intent-registry.ts",
  "Το #9 ενισχύει τον owner του #1",
  "Audit #9 must intentionally share the Audit #1 owner",
);

expectAll(
  "content/deals-intent.ts",
  [
    "Προσφορές διαμονής στη Χίο 2026",
    "Offres de séjour à Chios 2026",
    "Unterkunftsangebote auf Chios 2026",
    "Offerte di soggiorno a Chios 2026",
    "Ofertas de alojamiento en Quíos 2026",
    "Sakız Adası Konaklama Fırsatları 2026",
  ],
  "Deals intent cleanup is incomplete",
);

expectAll(
  "content/apartment-intent.ts",
  [
    'heroTitle: "Apartments in Chios"',
    'heroTitle: "Διαμερίσματα στη Χίο"',
    'heroTitle: "Appartements à Chios"',
  ],
  "Apartment owner intent is incomplete",
);

expectAll(
  "content/family-travel-intent.ts",
  [
    "Family holidays in Chios with kids",
    "family accommodation in Kambos",
    "Οικογενειακές διακοπές στη Χίο με παιδιά",
    "οικογενειακή διαμονή στη Χίο",
    "Çocuklarla Sakız Adası aile tatili",
  ],
  "Family-travel intent is incomplete",
);

expectAll(
  "content/economy-room-intent.ts",
  [
    "Budget Rooms in Chios",
    "Οικονομικά Δωμάτια στη Χίο",
    "Günstige Zimmer auf Chios",
    "Camere economiche a Chios",
    "Habitaciones económicas en Quíos",
    "Sakız Adası Ekonomik Odalar",
  ],
  "Economy-room commercial intent is incomplete",
);

const economyOwnerPages = [
  "app/chios-rooms/economy-double-rooms/page.tsx",
  "app/el/domatia-xios/oikonomiko-diklino-domatio/page.tsx",
  "app/fr/chambres-a-chios/chambres-doubles-economiques/page.tsx",
  "app/de/zimmer-chios/economy-zimmer-auf-chios/page.tsx",
  "app/it/stanze-a-chios/camera-doppia-economica-chios/page.tsx",
  "app/es/habitaciones-en-chios/economicas-habitaciones-en-chios/page.tsx",
  "app/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/page.tsx",
];

for (const file of economyOwnerPages) {
  expectAll(
    file,
    ["withEconomyRoomIntent", "buildRoomDetailSchema(data)", "data.seo.title", "data.seo.description"],
    "Economy owner metadata/schema must use the centralized intent data",
  );
}

expectAll(
  "content/accommodation-traditional-intent.ts",
  [
    "accommodation near Chios Airport",
    "διαμονή ή δωμάτια κοντά στο αεροδρόμιο Χίου",
    "hébergement près de l’aéroport de Chios",
    "Unterkunft nahe dem Flughafen Chios",
    "alloggio vicino all’aeroporto di Chios",
    "alojamiento cerca del aeropuerto de Quíos",
    "Sakız Havalimanı’na yakın konaklama",
    "8 χλμ.",
  ],
  "Airport-proximity accommodation intent is incomplete",
);

expectAll(
  "content/romantic-stay.ts",
  [
    'en: "/romantic-stay-in-chios/"',
    'el: "/el/romantiki-diamoni-sti-xio/"',
    'tr: "/tr/sakiz-adasi-romantik-konaklama/"',
  ],
  "Romantic-stay hreflang cluster is incomplete",
);

expect(
  "app/sitemap.ts",
  "romanticStayPaths",
  "Romantic-stay cluster must be present in sitemap",
);

expect(
  "lib/structured-data.ts",
  '"@type": "LodgingBusiness"',
  "Global lodging schema must use LodgingBusiness",
);

expectAll(
  "lib/structured-data.ts",
  [
    'homeName: "Αρχική"',
    'homePath: "/el/"',
    'name: "Δωρεάν WiFi"',
    'description: "Ασύρματη πρόσβαση στο διαδίκτυο για τους επισκέπτες"',
    'name: "Ιδιωτικό μπάνιο"',
    'name: "Κήπος και βεράντα"',
    'name: "Διαθέσιμος χώρος στάθμευσης"',
    'description: "Υπηρεσία καθαριότητας κατά τη διάρκεια της διαμονής"',
    '"Ταξιδιώτες αναψυχής"',
    '"Ταξιδιώτες πολιτισμού"',
    "getLocalizedSchemaLabels",
    "inLanguage: getLanguageForPath(input.path)",
  ],
  "Localized structured data source is incomplete",
);

expectNone(
  "lib/structured-data.ts",
  [
    'name: "ωρεάν WiFi"',
    'description: "σύρματη πρόσβαση στο διαδίκτυο για τους επισκέπτες"',
    'name: "λιματισμός"',
    'name: "διωτικό μπάνιο"',
    'name: "ηλεόραση επίπεδης οθόνης"',
    'name: "ήπος και βεράντα"',
    'name: "ιαθέσιμος χώρος στάθμευσης"',
    'name: "πηρεσία καθαριότητας"',
  ],
  "Malformed Greek structured data must not remain in the source",
);

expectNone(
  "components/seo/JsonLd.tsx",
  ["schemaStringCorrections", "greekSchemaReplacements"],
  "JSON-LD rendering must not patch content strings",
);

expectAll(
  "lib/homepage-seo-intent.ts",
  [
    'href="/el/domatia-xios/"',
    'href="/el/chios/kampos-chios/"',
    'href="/el/xenodoxeia-xios/"',
  ],
  "Greek homepage must keep its intent-owner links",
);

expect(
  "components/home/HomePageTailwindV3.tsx",
  'href: "/el/diamoni-sti-xio/"',
  "Greek homepage must link to the accommodation intent owner",
);

expectAll(
  "lib/greek-home-seo-hardening.ts",
  [
    "Καλή σχέση ποιότητας–τιμής",
    "Βρες το δωμάτιό σου",
    "Προσφορές τελευταίας στιγμής",
    "Ανακάλυψε τη Χίο",
    "Στάθμευση",
    "Οικονομικό",
    "Καθαρά νερά",
    "Μαστιχοχώρια",
    "Πολιτισμός",
  ],
  "Greek homepage UI hardening is incomplete",
);

expect(
  "app/[locale]/page.tsx",
  "hardenGreekHomePageData",
  "Greek homepage content hardening must be applied before metadata, schema and rendering",
);

expectNone(
  "app/[locale]/page.tsx",
  ["hardenGreekSchema"],
  "Greek homepage schema must be built directly from corrected source data",
);

expectAll(
  "components/rooms/RoomsCategoryPage.tsx",
  [
    "Δωμάτια & διαμερίσματα • Voulamandis House",
    "Δείτε οικονομικά δίκλινα δωμάτια",
    "Οικονομική επιλογή για 2 άτομα",
    "Συμβουλή για απευθείας κράτηση",
    "GreekRoomWizardTailwind",
  ],
  "Greek rooms owner page localization is incomplete",
);

expectNone(
  "components/rooms/RoomsCategoryPage.tsx",
  ["Δείτε economy double rooms"],
  "Greek rooms owner page must not regress to mixed English CTA copy",
);

expectAll(
  "components/rooms/GreekRoomWizardTailwind.tsx",
  ["RoomWizardTailwind", 'language="el"'],
  "Greek rooms AI Room Finder wrapper is incomplete",
);

expectAll(
  "components/rooms/RoomWizardTailwind.tsx",
  [
    "Βρείτε το συγκεκριμένο δωμάτιο που σας ταιριάζει",
    "Βρείτε το δωμάτιό σας με AI",
    "Online κράτηση",
    "Κράτηση τώρα",
    'data-booking-cta="true"',
  ],
  "Greek rooms AI Room Finder CTA localization is incomplete",
);

expectNone(
  "components/rooms/RoomWizardTailwind.tsx",
  ["<form", 'type="date"', "Οικονομική κατηγορία", "Καναπές-κρεβάτι"],
  "Retired Room Wizard questionnaire must not return to room-category pages",
);

expectAll(
  "content/rooms-schema.ts",
  [
    'el: { breadcrumbName: "Δωμάτια και διαμερίσματα στη Χίο" }',
    "hardenGreekRoomsSchemaData",
    "Οικονομική επιλογή για 2 άτομα",
    "Οικονομικό",
  ],
  "Greek rooms structured data hardening is incomplete",
);

expectAll(
  "lib/greek-seo-content-hardening.ts",
  [
    "3 χλμ.",
    "8 χλμ.",
    "Ψυγείο & κλιματισμός",
    "βοηθό εύρεσης δωματίου AI",
    "πιθανή διαμονή σε δύο δωμάτια",
    "ενός ξενοδοχείου ή θερέτρου",
  ],
  "Greek SEO content hardening is incomplete",
);

expectAll(
  "components/chios/LocalizedKamposLandingPage.tsx",
  ['["8 km", t.town]'],
  "Localized Kambos distance must use 8 km",
);

expectAll(
  "components/chios/GreekKamposLandingPageElegant.tsx",
  ['["8 χλμ.", "πόλη & λιμάνι"]'],
  "Greek Kambos distance must use 8 km",
);

expect(
  "app/el/diamoni-sti-xio/page.tsx",
  "hardenGreekSeoContent",
  "Greek accommodation owner page must harden content before metadata, schema and rendering",
);

expect(
  "app/el/xenodoxeia-xios/page.tsx",
  "hardenGreekSeoContent",
  "Greek hotels-intent guide must harden content before metadata, schema and rendering",
);

expectAll(
  "components/seo/ExploreVoulamandisJourney.tsx",
  ["IMAGE_ALT", "Αυλή του Voulamandis House στον Κάμπο της Χίου", "alt={IMAGE_ALT[language]}"],
  "SEO journey image alt text must remain localized",
);

if (failures.length) {
  console.error("SEO architecture QA failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("SEO architecture QA passed: audits #1–#9, owner guardrails, economy, airport and family intent refinements, 8 km Kambos distance, localized SEO content, sitemap and LodgingBusiness schema are in place.");
