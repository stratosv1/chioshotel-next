const fs = require("node:fs");
const path = require("node:path");

const nextConfigPath = path.join(process.cwd(), "next.config.ts");

const GSC_VALIDATION_REDIRECTS = [
  // Search Console: Redirect error / historical 5xx. Keep the final destination
  // canonical so Google never lands on an intermediate legacy alias.
  [
    "/chios/chios-beaches/agia-dynami-beach/",
    "/chios/chios-beaches/agia-dynami-beach-chios/",
  ],
  [
    "/chios/chios-museums/the-kallimasia-folklore-museum/",
    "/chios/chios-museums/kallimasia-folklore-museum/",
  ],
  [
    "/tr/chios-odalari/volissos-koyu-chios/",
    "/tr/sakiz-adasi-koyleri/volissos-koyu/",
  ],

  // Search Console: old Turkish village URLs previously reported as 404.
  [
    "/tr/chios-odalari/armolia-koyu-chios/",
    "/tr/sakiz-adasi-koyleri/armolia-koyu/",
  ],
  [
    "/tr/chios-odalari/lagada-koyu-chios/",
    "/tr/sakiz-adasi-koyleri/lagada-koyu/",
  ],
  [
    "/tr/chios-odalari/mesta-koyu-chios/",
    "/tr/sakiz-adasi-koyleri/mesta-koyu/",
  ],
  [
    "/tr/chios-odalari/vessa-koyu-chios/",
    "/tr/sakiz-adasi-koyleri/vessa-koyu/",
  ],

  // Search Console: legacy Turkish URLs still passing through two redirects in
  // the Crawled - currently not indexed export. Flatten each source directly to
  // its final canonical destination.
  [
    "/tr/chios-odalari/kambos-sakiz-adasi/",
    "/tr/sakiz-adasi/",
  ],
  [
    "/tr/chios-odalari/olympoi-koyu-chios/",
    "/tr/sakiz-adasi-koyleri/olympoi-koyu/",
  ],
  [
    "/tr/chios-odalari/pyrgi-sakiz-adasi-koyu/",
    "/tr/sakiz-adasi-koyleri/pyrgi-koyu/",
  ],

  // Retired Room Finder aliases. The AI application itself intentionally stays
  // noindex, but these historical aliases should redirect instead of returning 404.
  ["/room-finder/", "/ai-assistant/?lang=en"],
  ["/de/room-finder-de/", "/ai-assistant/?lang=de"],
  ["/el/vre-to-domatio-pou-sou-tairiazei/", "/ai-assistant/?lang=el"],
  ["/es/room-finder-es/", "/ai-assistant/?lang=es"],
  ["/fr/room-wizard-fr/", "/ai-assistant/?lang=fr"],
  ["/it/room-finder-it/", "/ai-assistant/?lang=it"],
  ["/tr/voulamandis-house-room-finder-wizard-tr/", "/ai-assistant/?lang=tr"],
  ["/tr/voulamandis-house-find-the-best-room-tr/", "/ai-assistant/?lang=tr"],
];

function formatRedirect([source, destination]) {
  return [
    "  {",
    `    source: ${JSON.stringify(source)},`,
    `    destination: ${JSON.stringify(destination)},`,
    "    permanent: true,",
    "  },",
  ].join("\n");
}

if (!fs.existsSync(nextConfigPath)) {
  throw new Error("next.config.ts not found");
}

let source = fs.readFileSync(nextConfigPath, "utf8");
const anchor = "const legacyRedirects = [\n";
if (!source.includes(anchor)) {
  throw new Error("legacyRedirects array anchor not found in next.config.ts");
}

const missing = GSC_VALIDATION_REDIRECTS.filter(([from]) => {
  const escaped = JSON.stringify(from);
  return !source.includes(`source: ${escaped}`) && !source.includes(`\"source\": ${escaped}`);
});

if (!missing.length) {
  console.log("GSC validation routing: all exact redirects already present.");
  process.exit(0);
}

const block = [
  "  // Exact URL-level remediations from the 2026-08-16 Search Console Pages exports.",
  "  // These are deliberately narrow: no catch-all redirects and no homepage masking.",
  ...missing.map(formatRedirect),
  "",
].join("\n");

source = source.replace(anchor, `${anchor}${block}`);
fs.writeFileSync(nextConfigPath, source, "utf8");
console.log(`GSC validation routing: added ${missing.length} exact redirects.`);
