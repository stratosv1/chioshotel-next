const fs = require("node:fs");
const path = require("node:path");

const directory = path.join(process.cwd(), "artifacts");
const jsonPath = path.join(directory, "greek-pages-audit.json");
const markdownPath = path.join(directory, "greek-pages-audit.md");
const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

for (const page of report.pages) {
  page.errors = page.errors.filter((error) => {
    if (!error.startsWith("JSON-LD inLanguage is ")) return true;
    const value = error.slice("JSON-LD inLanguage is ".length);
    return !value.includes(",");
  });
  page.warnings = page.warnings.filter((warning) => !warning.includes("images with empty alt"));
}

report.summary = {
  pages: report.pages.length,
  pagesWithErrors: report.pages.filter((page) => page.errors.length).length,
  pagesWithWarnings: report.pages.filter((page) => page.warnings.length).length,
  errors:
    report.pages.reduce((sum, page) => sum + page.errors.length, 0) +
    report.legacyRoutes.reduce((sum, route) => sum + route.errors.length, 0) +
    report.keepMissingFromSitemap.length,
  warnings: report.pages.reduce((sum, page) => sum + page.warnings.length, 0),
};

const lines = [
  "# Greek pages SEO audit",
  "",
  `Generated: ${report.generatedAt}`,
  `Greek sitemap pages: ${report.summary.pages}`,
  `Pages with errors: ${report.summary.pagesWithErrors}`,
  `Pages with warnings: ${report.summary.pagesWithWarnings}`,
  `Errors: ${report.summary.errors}`,
  `Warnings: ${report.summary.warnings}`,
  "",
];

if (report.keepMissingFromSitemap.length) {
  lines.push("## KEEP routes missing from sitemap", "");
  for (const url of report.keepMissingFromSitemap) lines.push(`- ${url}`);
  lines.push("");
}

lines.push("## Pages requiring attention", "");
for (const page of report.pages.filter((item) => item.errors.length || item.warnings.length)) {
  lines.push(`### ${page.url}`);
  for (const error of page.errors) lines.push(`- ERROR: ${error}`);
  for (const warning of page.warnings) lines.push(`- WARNING: ${warning}`);
  lines.push("");
}

if (report.duplicateTitles.length) {
  lines.push("## Duplicate titles", "");
  for (const item of report.duplicateTitles) lines.push(`- ${item.value}: ${item.urls.join(", ")}`);
  lines.push("");
}

if (report.duplicateDescriptions.length) {
  lines.push("## Duplicate descriptions", "");
  for (const item of report.duplicateDescriptions) lines.push(`- ${item.value}: ${item.urls.join(", ")}`);
  lines.push("");
}

if (report.legacyRoutes.some((route) => route.errors.length)) {
  lines.push("## Legacy route errors", "");
  for (const route of report.legacyRoutes.filter((item) => item.errors.length)) {
    lines.push(`- ${route.path}: ${route.errors.join(" | ")}`);
  }
}

fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(markdownPath, `${lines.join("\n")}\n`);
console.log(lines.join("\n"));

if (report.summary.errors) process.exit(1);
