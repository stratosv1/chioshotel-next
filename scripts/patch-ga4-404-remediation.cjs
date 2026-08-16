const fs = require("node:fs");
const path = require("node:path");

const proxyPath = path.join(process.cwd(), "proxy.ts");

const EXACT_REDIRECTS = {
  "/el/βρες-τον-κατάλληλο-τύπου-δωματίου-για": "/el/vres-to-domatio-sou/",
  "/en/chios/chios-orchids": "/chios-orchids/",
  "/el/paralies-xios/paralia-karfas/null": "/el/paralies-xios/paralia-karfas/",
  "/images/family/ChatGPT-Image-Feb-13-2026-08_32_22-PM.png":
    "/images/family/ChatGPT-Image-Feb-13-2026-08_32_22-PM.webp",
  "/favicon.ico": "/favicon/favicon.ico",
  "/sitemap_index.xml": "/sitemap.xml",
  "/page-sitemap.xml": "/sitemap.xml",
  "/category-sitemap.xml": "/sitemap.xml",
  "/local-sitemap.xml": "/sitemap.xml",
  "/video-sitemap.xml": "/sitemap.xml",
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

function patchRscFooterArtifactRedirect(source) {
  if (source.includes("GA4_RSC_FOOTER_ARTIFACT_REDIRECT")) return source;

  const before = "  const target = exactTarget || patternTarget;\n";
  const after = `  // GA4_RSC_FOOTER_ARTIFACT_REDIRECT: some crawlers treated React Server\n  // Component list keys such as \"Soggiorno-/it/camere-a-chios/\" as relative URLs.\n  // Redirect only when the nested suffix resolves to a real KEEP route.\n  let rscFooterArtifactTarget: string | null = null;\n  const nestedRouteMarker = normalizedPathname.indexOf(\"-/\");\n  if (nestedRouteMarker !== -1) {\n    const nestedPath = normalizedPathname.slice(nestedRouteMarker + 1);\n    const nestedRoute = getRouteByPath(nestedPath);\n    if (nestedRoute?.action === \"KEEP\") {\n      rscFooterArtifactTarget = nestedRoute.path;\n    }\n  }\n\n  const target = exactTarget || patternTarget || rscFooterArtifactTarget;\n`;

  if (!source.includes(before)) {
    throw new Error("GSC pattern redirect target anchor not found");
  }

  return source.replace(before, after);
}

let source = fs.readFileSync(proxyPath, "utf8");
const original = source;
source = insertExactRedirects(source);
source = patchRscFooterArtifactRedirect(source);

if (source !== original) {
  fs.writeFileSync(proxyPath, source, "utf8");
  console.log("GA4 404 remediation applied: exact aliases + safe RSC footer artifact routing.");
} else {
  console.log("GA4 404 remediation already applied.");
}
