const fs = require("node:fs");
const path = require("node:path");

const proxyPath = path.join(process.cwd(), "proxy.ts");

const EXACT_REDIRECTS = {
  // Confirmed content/contact aliases from GA4 + production 404 logs.
  "/contact": "/voulamandis-house-contact-us-form-fill-in-the-form/",
  "/contact-us": "/voulamandis-house-contact-us-form-fill-in-the-form/",
  "/epikoinonia": "/el/epikoinonia-voulamandis-house/",

  // FAQ aliases.
  "/el/erotisis-voulamandis-house": "/el/syxnes-erotiseis/",
  "/el/faq-2": "/el/syxnes-erotiseis/",
  "/el/faq-apories-voulamandis-house": "/el/syxnes-erotiseis/",
  "/fr/faq-fr-voulamandis": "/fr/questions-frequentes/",
  "/de/faq-de-voulamandis": "/de/haeufige-fragen/",

  // English/property legacy media pages with no dedicated modern gallery route.
  "/voulamandis-house-photos": "/",
  "/vh-photos/voulamandis-seating-area/voulamandis-house-seating-area-voulamandis-house-chios-hotels": "/",

  // Greek legacy media/attachment pages.
  "/el/vh-φωτογραφίες/voulamandis-house-farm": "/el/",
  "/el/vh-φωτογραφίες/chios-garden": "/el/",
  "/el/vh-φωτογραφίες/vh-seating-room": "/el/",
  "/el/albums": "/el/",
  "/el/domatia-xios/chios-2": "/el/domatia-xios/",
  "/el/domatia-xios/chios-mastic-2": "/el/domatia-xios/",
  "/el/1voulamandis-house-logo4-2": "/el/",

  // French old guide/video/static URLs.
  "/fr/chios-videos": "/fr/chios-en-grece/",
  "/fr/chios.html": "/fr/chios-en-grece/",
  "/fr/ile-de-chios": "/fr/chios-en-grece/",
  "/fr/connaissez-vous-vraiment-chios-relevez-le-defi-du-quiz-insider":
    "/fr/quiz-vacances-a-chios/",

  // Italian malformed legacy beach URL.
  "/it/stanze-a-chios/italiaagia-fotia-beachthe-captivating-beach-of-chios":
    "/it/spiagge-chios/spiaggia-agia-fotia/",

  // Turkish old property/video URLs.
  "/tr/voulamandis-house-photos": "/tr/",
  "/tr/chios-videos-2": "/tr/sakiz-adasi/",

  // Previously verified content/resource fixes.
  "/en/chios/chios-orchids": "/chios-orchids/",
  "/el/paralies-xios/paralia-karfas/null": "/el/paralies-xios/paralia-karfas/",
  "/images/family/ChatGPT-Image-Feb-13-2026-08_32_22-PM.png":
    "/images/family/ChatGPT-Image-Feb-13-2026-08_32_22-PM.webp",
  "/favicon.ico": "/favicon/favicon.ico",
  "/apple-touch-icon.png": "/favicon/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png": "/favicon/apple-touch-icon.png",
  "/sitemap_index.xml": "/sitemap.xml",
  "/page-sitemap.xml": "/sitemap.xml",
  "/category-sitemap.xml": "/sitemap.xml",
  "/local-sitemap.xml": "/sitemap.xml",
  "/video-sitemap.xml": "/sitemap.xml",
};

const DIRECT_AI_ALIASES = {
  "/el/βρες-τον-κατάλληλο-τύπου-δωματίου-για": "el",
  "/de/room-finder-de": "de",
  "/fr/room-wizard-fr": "fr",
  "/it/room-finder-it": "it",
  "/tr/voulamandis-house-find-the-best-room-tr": "tr",
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
    "  // GA4/Vercel 404 audit 2026-08-16: verified one-hop replacements",
    ...missing.map(([from, to]) => `  ${JSON.stringify(from)}: ${JSON.stringify(to)},`),
  ].join("\n");

  return source.slice(0, mapEnd) + block + source.slice(mapEnd);
}

function patchDirectAiAliases(source) {
  const mapStart = source.indexOf(
    "  const directAiLanguage: Record<string, string> = {",
  );
  if (mapStart === -1) {
    throw new Error("directAiLanguage anchor not found; GSC remediation must run first");
  }

  const mapEnd = source.indexOf("\n  };", mapStart);
  if (mapEnd === -1) throw new Error("directAiLanguage closing anchor not found");

  const section = source.slice(mapStart, mapEnd);
  const missing = Object.entries(DIRECT_AI_ALIASES).filter(
    ([from]) => !section.includes(`${JSON.stringify(from)}:`),
  );
  if (!missing.length) return source;

  const block = [
    "",
    "    // GA4 404 audit: obsolete room-finder aliases go directly to AI in one hop",
    ...missing.map(
      ([from, language]) => `    ${JSON.stringify(from)}: ${JSON.stringify(language)},`,
    ),
  ].join("\n");

  return source.slice(0, mapEnd) + block + source.slice(mapEnd);
}

function patchRscFooterArtifactRedirect(source) {
  if (source.includes("GA4_RSC_FOOTER_ARTIFACT_REDIRECT")) return source;

  const before = "  const target = exactTarget || patternTarget;\n";
  const after = `  // GA4_RSC_FOOTER_ARTIFACT_REDIRECT: some crawlers treated React Server\n  // Component list keys such as \"Soggiorno-/it/camere-a-chios/\" as relative URLs.\n  // Redirect only when the nested suffix resolves to a real KEEP route.\n  let rscFooterArtifactTarget: string | null = null;\n  const nestedRouteMarker = normalizedPathname.indexOf(\"-/\");\n  if (nestedRouteMarker !== -1) {\n    const nestedPath = normalizedPathname.slice(nestedRouteMarker + 1);\n    const nestedRoute = getRouteByPath(nestedPath);\n    if (nestedRoute?.action === \"KEEP\") {\n      rscFooterArtifactTarget = nestedRoute.path;\n    }\n  }\n\n  const target = exactTarget || patternTarget || rscFooterArtifactTarget;\n`;

  if (!source.includes(before)) {
    throw new Error("GSC pattern redirect target anchor not found");
  }

  return source.replace(before, after);
}

function patchSafeParentArtifacts(source) {
  if (source.includes("GA4_SAFE_PARENT_ARTIFACT_REDIRECT")) return source;

  const before =
    "  const target = exactTarget || patternTarget || rscFooterArtifactTarget;\n";
  const after = `  // GA4_SAFE_PARENT_ARTIFACT_REDIRECT: crawlers occasionally promote serialized\n  // RSC tokens or null data values into child URLs. Only collapse them when the\n  // parent is a known KEEP route, so arbitrary unknown paths still remain 404.\n  let safeParentArtifactTarget: string | null = null;\n  const artifactSuffixes = [\"/null\", \"/Next.Metadata\", \"/Next.MetadataOutlet\"];\n  const artifactSuffix = artifactSuffixes.find((suffix) =>\n    normalizedPathname.endsWith(suffix),\n  );\n  if (artifactSuffix) {\n    const parentPath = normalizedPathname.slice(0, -artifactSuffix.length) || \"/\";\n    const parentRoute = getRouteByPath(parentPath);\n    if (parentRoute?.action === \"KEEP\") {\n      safeParentArtifactTarget = parentRoute.path;\n    }\n  }\n\n  const target =\n    exactTarget ||\n    patternTarget ||\n    rscFooterArtifactTarget ||\n    safeParentArtifactTarget;\n`;

  if (!source.includes(before)) {
    throw new Error("RSC footer artifact target anchor not found");
  }

  return source.replace(before, after);
}

function patchRootFaviconMatcher(source) {
  const matcherAnchor = "  matcher: [\n";
  if (!source.includes(matcherAnchor)) {
    throw new Error("proxy matcher anchor not found");
  }
  if (source.includes('  matcher: [\n    "/favicon.ico",\n')) return source;

  return source.replace(
    matcherAnchor,
    '  matcher: [\n    "/favicon.ico",\n',
  );
}

let source = fs.readFileSync(proxyPath, "utf8");
const original = source;
source = insertExactRedirects(source);
source = patchDirectAiAliases(source);
source = patchRscFooterArtifactRedirect(source);
source = patchSafeParentArtifacts(source);
source = patchRootFaviconMatcher(source);

if (source !== original) {
  fs.writeFileSync(proxyPath, source, "utf8");
  console.log(
    "GA4 404 remediation applied: verified aliases + direct AI + safe crawler artifact routing.",
  );
} else {
  console.log("GA4 404 remediation already applied.");
}
