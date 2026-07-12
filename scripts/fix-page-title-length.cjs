const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const scanRoots = ["content", "app"];
const MAX_BASE_TITLE_LENGTH = 38;
const BRAND_SUFFIX = " | Voulamandis House";

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(fullPath);
    return entry.isFile() && /\.(?:ts|tsx)$/.test(fullPath) ? [fullPath] : [];
  });
}

function normalizeBaseTitle(title) {
  let clean = title.replace(/\s*\|\s*Voulamandis House\s*$/u, "").trim();
  if (clean.length <= MAX_BASE_TITLE_LENGTH) return clean;

  const primary = clean.split(/\s+\|\s+/u)[0].trim();
  if (primary && primary.length <= MAX_BASE_TITLE_LENGTH) return primary;

  const clipped = clean.slice(0, MAX_BASE_TITLE_LENGTH + 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return (lastSpace >= 24 ? clipped.slice(0, lastSpace) : clean.slice(0, MAX_BASE_TITLE_LENGTH)).trim();
}

let changedFiles = 0;
let changedTitles = 0;

for (const scanRoot of scanRoots) {
  for (const filePath of listFiles(path.join(root, scanRoot))) {
    const original = fs.readFileSync(filePath, "utf8");

    const next = original.replace(/seo\s*:\s*\{([\s\S]*?)\n\s*\}/g, (seoBlock) =>
      seoBlock.replace(/title\s*:\s*(["'`])([^"'`\r\n]+)\1/g, (match, quote, title) => {
        const normalized = normalizeBaseTitle(title);
        if (normalized === title) return match;
        changedTitles += 1;
        return `title: ${quote}${normalized}${quote}`;
      })
    );

    if (next !== original) {
      fs.writeFileSync(filePath, next, "utf8");
      changedFiles += 1;
      console.log(`[page-title] updated ${path.relative(root, filePath).replace(/\\/g, "/")}`);
    }
  }
}

console.log(`[page-title] ${changedTitles} SEO base titles normalized in ${changedFiles} files`);
console.log(`[page-title] final titles use the global${BRAND_SUFFIX} template`);
