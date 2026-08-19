const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const sitemapPath = path.join(root, "app", "sitemap.ts");

function replaceRequired(source, before, after, label) {
  if (source.includes(after)) return { source, changed: false };
  if (!source.includes(before)) {
    throw new Error(`SEO inventory patch anchor not found: ${label}`);
  }
  return { source: source.replace(before, after), changed: true };
}

function patchSitemap() {
  let source = fs.readFileSync(sitemapPath, "utf8");
  let changed = false;
  let result;

  result = replaceRequired(
    source,
    `import { romanticStayPaths } from "@/content/romantic-stay";\n`,
    `import { romanticStayPaths } from "@/content/romantic-stay";\nimport { kamposChiosPaths } from "@/content/kampos-chios";\n`,
    "sitemap Kambos import",
  );
  source = result.source;
  changed ||= result.changed;

  const routesBefore = `  const polishRoutes: SitemapEntry[] = [\n`;
  const routesAfter = `  const kamposRoutes: SitemapEntry[] = Object.values(kamposChiosPaths).map(\n    (pathname) => ({\n      url: absoluteUrl(pathname),\n      changeFrequency: "monthly",\n      priority: 0.8,\n    }),\n  );\n\n  const polishRoutes: SitemapEntry[] = [\n`;
  result = replaceRequired(source, routesBefore, routesAfter, "Kambos sitemap entries");
  source = result.source;
  changed ||= result.changed;

  result = replaceRequired(
    source,
    `    ...romanticStayRoutes,\n    ...polishRoutes,\n`,
    `    ...romanticStayRoutes,\n    ...kamposRoutes,\n    ...polishRoutes,\n`,
    "Kambos sitemap output",
  );
  source = result.source;
  changed ||= result.changed;

  if (changed) fs.writeFileSync(sitemapPath, source, "utf8");
  return changed;
}

const sitemapChanged = patchSitemap();
console.log(`SEO inventory alignment: sitemap=${sitemapChanged ? "patched" : "already"}`);
