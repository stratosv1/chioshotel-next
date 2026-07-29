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
    "Οικογενειακές διακοπές στη Χίο με παιδιά",
    "Çocuklarla Sakız Adası aile tatili",
  ],
  "Family-travel intent is incomplete",
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
    "Δωρεάν WiFi",
    "Ασύρματη πρόσβαση στο διαδίκτυο για τους επισκέπτες",
    "Ιδιωτικό μπάνιο",
    "Κήπος και βεράντα",
    "Χώρος στάθμευσης διαθέσιμος για τους επισκέπτες",
    "Υπηρεσία καθαριότητας κατά τη διάρκεια της διαμονής",
  ],
  "Greek homepage SEO hardening is incomplete",
);

expectAll(
  "app/[locale]/page.tsx",
  ["hardenGreekHomePageData", "hardenGreekSchema"],
  "Greek homepage hardening must be applied before metadata, schema and rendering",
);

expect(
  "app/staff/seo/page.tsx",
  "getSeoAdvisorWithIntentData",
  "Staff SEO Advisor must use owner-aware intent analysis",
);

expect(
  "lib/gsc/advisor-intents.ts",
  "Δεν δημιουργούμε νέο URL",
  "SEO Advisor must guard against duplicate landing creation",
);

if (failures.length) {
  console.error("SEO architecture QA failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("SEO architecture QA passed: audits #1–#9, owner guardrails, Greek homepage hardening, sitemap and LodgingBusiness schema are in place.");
