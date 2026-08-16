const fs = require("node:fs");
const path = require("node:path");

const proxyPath = path.join(process.cwd(), "proxy.ts");

const EXACT_REDIRECTS = {
  "/de/uncategorized-de/museen-von-chios": "/de/museen-chios/",
  "/de/uncategorized-de/orchideen-von-chios": "/de/orchideen-auf-chios/",

  "/es/uncategorized-es/apartamentos-familiares-en-chios":
    "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
  "/es/uncategorized-es/habitaciones-dobles-en-la-isla-de-chios":
    "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
  "/es/uncategorized-es/museos-en-la-isla-de-chios": "/es/museos-chios/",
  "/es/uncategorized-es/playas-de-chios-2": "/es/playas-chios/",

  "/fr/uncategorized-fr/appartements-familiaux-de-chios":
    "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
  "/fr/uncategorized-fr/chambres-doubles-economiques":
    "/fr/chambres-a-chios/chambres-doubles-economiques/",
  "/fr/uncategorized-fr/chambres-doubles-standard":
    "/fr/chambres-a-chios/chambres-doubles-standard/",
  "/fr/uncategorized-fr/fr-chios-kambos": "/fr/chios/kampos-chios/",

  "/it/uncategorized-it/appartamenti-familiari-a-chios":
    "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
  "/it/uncategorized-it/camera-doppia-economica-chios":
    "/it/stanze-a-chios/camera-doppia-economica-chios/",
  "/it/uncategorized-it/camere-doppie-standard-chios":
    "/it/stanze-a-chios/camere-doppie-standard-chios/",
  "/it/uncategorized-it/la-bellezza-delle-orchidee-di-chios":
    "/it/orchidee-di-chios/",
  "/it/uncategorized-it/spiagge-di-chios": "/it/spiagge-chios/",

  "/tr/uncategorized-tr/chiosun-orkidelerinin-guzelligi":
    "/tr/sakiz-adasi-orkideleri/",
  "/tr/uncategorized-tr/sakiz-adasinda-buyuk-aile-daireleri":
    "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
  "/tr/uncategorized-tr/sakiz-adasindaki-ekonomi-cift-kisilik-oda":
    "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
  "/tr/uncategorized-tr/sakiz-adasinin-plajlari": "/tr/sakiz-adasi-plajlari/",
  "/tr/uncategorized-tr/standart-cift-kisilik-odalar-sakiz-adasi":
    "/tr/chios-odalari/standart-cift-kisilik-odalar/",

  "/el/chios-el/paralies-tis-xiou": "/el/paralies-xios/",
  "/chios-el/chios-activities-el/chios-springs": "/el/iamatika-loutra-xiou/",
  "/el/chios-el/chios-beaches-2": "/el/paralies-xios/",
  "/el/chios-el/chios-hiking-2": "/el/pezoporia-sti-xio/",
  "/el/chios-el/chios-springs": "/el/iamatika-loutra-xiou/",
  "/el/chios-el/chios-villages-2": "/el/xoria-xios/",

  "/tr/chios-el/chios-activities-el/chios-hiking-2":
    "/tr/sakiz-adasi-yuruyus-rotalari/",
  "/tr/chios-el/chios-activities-el/chios-orchids-2":
    "/tr/sakiz-adasi-orkideleri/",
  "/tr/chios-el/chios-activities-el/chios-springs":
    "/tr/sakiz-adasi-termal-kaplicalari/",
  "/tr/chios-el/chios-activities-el/greek-language-2":
    "/tr/sakiz-adasi-yunanca-kurslari/",
  "/tr/chios-el/chios-beaches-el/chios-beach-agia-fotia":
    "/tr/sakiz-adasi-plajlari/agia-fotia-plaji/",
  "/tr/chios-el/chios-beaches-el/chios-beach-nagos":
    "/tr/sakiz-adasi-plajlari/nagos-plaji/",
  "/tr/chios-el/chios-beaches-el/komi-beach-2":
    "/tr/sakiz-adasi-plajlari/komi-plaji/",
  "/tr/chios-el/chios-beaches-el/mavra-volia-2":
    "/tr/sakiz-adasi-plajlari/mavra-volia-plaji/",
  "/tr/chios-el/chios-museums-el/chios-byzantine":
    "/tr/sakiz-adasi-muzeleri/bizans-muzesi-sakiz/",
  "/tr/chios-el/chios-museums-el/chios-korais-library":
    "/tr/sakiz-adasi-muzeleri/korais-kutuphanesi-sakiz/",

  "/de/chios-zimmer-preise": "/de/hotelpreise-auf-der-insel-chios/",
  "/el/times-domation-xios": "/el/amesi-kratisi-voulamandis-house/",
  "/fr/tarifs-chambres-chios": "/fr/tarifs-des-hotels-a-chios/",
  "/it/prezzi-camere-chios": "/it/prezzi-hotel-chios/",
  "/tr/sakiz-adasi-oda-fiyatlari": "/tr/sakiz-adasi-rezervasyon/",

  "/es/chios-holidays-quiz": "/es/quiz-vacaciones-en-quios/",
  "/fr/chios-holidays-quiz": "/fr/quiz-vacances-a-chios/",
  "/it/quanto-conosci-chio-quiz": "/it/quiz-vacanze-a-chios/",
  "/tr/chios-adasini-ne-kadar-iyi-taniyorsun": "/tr/sakiz-adasi-tatil-testi/",

  "/el/taste-lover-el-gastronomiko-taxidi-xios": "/el/geuseis-tis-xiou/",
  "/it/esperienza-per-amanti-del-gusto-a-chio-sapori-autentici-dellisola":
    "/it/sapori-di-chios/",

  "/el/xenodoxeio-chios-diamoni-kampos": "/el/chios/kampos-chios/",
  "/fr/chios/chios-kambos": "/fr/chios/kampos-chios/",

  "/es/habitaciones-en-chios/olympi-quios": "/es/pueblos-chios/pueblo-olympoi/",
  "/it/chios-it/chios-villages-it/chios-pyrgi-village":
    "/it/villaggi-chios/villaggio-pyrgi/",

  "/it/le-migliori-spiagge-di-chio": "/it/spiagge-chios/",

  "/es/chios-hotels-rates": "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  "/fr/chios/plages-de-chios": "/fr/plages-de-chios/",
  "/it/isola-di-chios": "/it/chios-lisola-in-grecia/",
  "/it/le-migliori-camere-a-chios-hotel-a-chios-camere-a-chios": "/it/camere-a-chios/",
  "/tr/chios-odalari": "/tr/sakiz-adasi-odalari/",
  "/tr/crazy-travel-deals-for-chios-hotels": "/tr/sakiz-adasi-otel-firsatlari/",
};

const DIRECT_GONE_PREFIXES = [
  "/post-sitemap.xml",
  "/flio-box",
  "/platform-voulamandis",
  "/test-2",
];

const DIRECT_AI_LANGUAGES = {
  "/best-room-selection-wizard": "en",
  "/reservations": "en",
  "/de/uncategorized-de/zimmer-suchassistent": "de",
  "/el/best room selection wizard": "el",
  "/en/chios-ai-chatbox": "en",
};

function insertExactRedirects(source) {
  const functionIndex = source.indexOf("function normalizeLegacyPathname");
  if (functionIndex === -1) throw new Error("normalizeLegacyPathname anchor not found");

  const mapEnd = source.lastIndexOf("\n};", functionIndex);
  if (mapEnd === -1) throw new Error("legacyRedirects closing anchor not found");

  const mapSection = source.slice(0, mapEnd);
  const missing = Object.entries(EXACT_REDIRECTS).filter(
    ([from]) => !mapSection.includes(`${JSON.stringify(from)}:`),
  );
  if (!missing.length) return source;

  const block = [
    "",
    "  // GSC Full Audit run 44: exact, independently matched legacy replacements",
    ...missing.map(([from, to]) => `  ${JSON.stringify(from)}: ${JSON.stringify(to)},`),
  ].join("\n");

  return source.slice(0, mapEnd) + block + source.slice(mapEnd);
}

function insertGonePrefixes(source) {
  const start = source.indexOf("const wordpressGonePrefixes = [");
  if (start === -1) throw new Error("wordpressGonePrefixes anchor not found");
  const end = source.indexOf("\n];", start);
  if (end === -1) throw new Error("wordpressGonePrefixes closing anchor not found");

  const section = source.slice(start, end);
  const missing = DIRECT_GONE_PREFIXES.filter(
    (prefix) => !section.includes(JSON.stringify(prefix)),
  );
  if (!missing.length) return source;

  const block = [
    "",
    "  // Explicitly retired legacy/test resources from GSC Full Audit run 44",
    ...missing.map((prefix) => `  ${JSON.stringify(prefix)},`),
  ].join("\n");

  return source.slice(0, end) + block + source.slice(end);
}

function patchPatternRedirects(source) {
  if (source.includes("GSC_RUN44_PATTERN_REDIRECTS")) return source;

  const before = `  const target = legacyRedirects[normalizedPathname] || null;\n\n  if (!target) {\n    return null;\n  }\n`;
  const after = `  const exactTarget = legacyRedirects[normalizedPathname] || null;\n\n  // GSC_RUN44_PATTERN_REDIRECTS: malformed/double-encoded legacy paths where\n  // the content identity is still deterministic from the final slug.\n  let patternTarget: string | null = null;\n  if (normalizedPathname.startsWith("/de/chios-insel/")) {\n    if (normalizedPathname.endsWith("/agia-dynami-strand")) {\n      patternTarget = "/de/straende-chios/agia-dynami-strand/";\n    } else if (normalizedPathname.endsWith("/agia-fotia-strand")) {\n      patternTarget = "/de/straende-chios/agia-fotia-strand/";\n    } else if (normalizedPathname.endsWith("/avlonia-strand")) {\n      patternTarget = "/de/straende-chios/avlonia-strand/";\n    }\n  } else if (normalizedPathname.startsWith("/el/chios-el/chios-villages-el/armolia-xios/")) {\n    patternTarget = "/el/xoria-xios/armolia-xios/";\n  }\n\n  const target = exactTarget || patternTarget;\n  if (!target) {\n    return null;\n  }\n`;

  if (!source.includes(before)) {
    throw new Error("getLegacyRedirectTarget patch anchor not found");
  }
  return source.replace(before, after);
}

function patchDirectAiRedirects(source) {
  if (source.includes("const directAiLanguage: Record<string, string>")) return source;

  const before = `  if (\n    normalizedPathname === "/best-room-selection-wizard" ||\n    normalizedPathname === "/reservations"\n  ) {\n    const url = request.nextUrl.clone();\n    url.protocol = "https:";\n    url.hostname = "chioshotel.gr";\n    url.pathname = "/ai-assistant/";\n    url.search = "?lang=en";\n    return NextResponse.redirect(url, 301);\n  }\n`;

  const entries = Object.entries(DIRECT_AI_LANGUAGES)
    .map(([from, language]) => `    ${JSON.stringify(from)}: ${JSON.stringify(language)},`)
    .join("\n");

  const after = `  const directAiLanguage: Record<string, string> = {\n${entries}\n  };\n  const aiLanguage = directAiLanguage[normalizedPathname];\n  if (aiLanguage) {\n    const url = request.nextUrl.clone();\n    url.protocol = "https:";\n    url.hostname = "chioshotel.gr";\n    url.pathname = "/ai-assistant/";\n    url.search = \`?lang=\${aiLanguage}\`;\n    return NextResponse.redirect(url, 301);\n  }\n`;

  if (!source.includes(before)) {
    throw new Error("direct AI redirect patch anchor not found; redirect-chain hardening must run first");
  }
  return source.replace(before, after);
}

let source = fs.readFileSync(proxyPath, "utf8");
const original = source;
source = insertExactRedirects(source);
source = insertGonePrefixes(source);
source = patchPatternRedirects(source);
source = patchDirectAiRedirects(source);

if (source !== original) {
  fs.writeFileSync(proxyPath, source, "utf8");
  console.log("GSC run 44 not-found remediation applied: 66 exact/pattern redirects, 4 Gone resources.");
} else {
  console.log("GSC run 44 not-found remediation already applied.");
}
