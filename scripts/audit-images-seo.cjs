const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = process.cwd();
const imageRoot = path.join(root, "public", "images");
const sourceRoots = ["app", "components", "content", "lib"].map((dir) => path.join(root, dir));
const reportDir = path.join(root, "reports");
const imageExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const textExts = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".css"]);

function walk(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".git", "reports", "backups"].includes(entry.name)) continue;
      files.push(...walk(fullPath, predicate));
      continue;
    }

    if (entry.isFile() && predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function toPublicPath(filePath) {
  return filePath.replace(path.join(root, "public"), "").replace(/\\/g, "/");
}

function escapeCsv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function isLikelyBadFilename(publicPath) {
  const filename = path.basename(publicPath, path.extname(publicPath)).toLowerCase();

  if (/^\d+(-|$)/.test(filename)) return true;
  if (/e\d{10,}/.test(filename)) return true;
  if (/[a-f0-9]{20,}/.test(filename)) return true;
  if (/^(img|image|dsc|screenshot|unnamed|photo)[-_\d]/.test(filename)) return true;
  if (filename.length < 6) return true;

  return false;
}

function getSeoFilenameSuggestion(publicPath) {
  const parts = publicPath.split("/").filter(Boolean);
  const folder = parts.length > 1 ? parts[parts.length - 2] : "image";
  const base = path.basename(publicPath, path.extname(publicPath));

  const cleaned = base
    .toLowerCase()
    .replace(/e\d{10,}/g, "")
    .replace(/[a-f0-9]{20,}/g, "")
    .replace(/\d{3,4}x\d{3,4}/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  const prefix = folder === "images" ? "voulamandis-house" : folder;
  const safeBase = cleaned && cleaned.length > 5 ? cleaned : `${prefix}-chios`;

  return `${safeBase}.webp`;
}

function getAction({ ext, sizeKb, width, height, usedCount, badName }) {
  const actions = [];

  if (usedCount === 0) actions.push("UNUSED_OR_NOT_REFERENCED_IN_CODE");
  if ([".jpg", ".jpeg", ".png"].includes(ext)) actions.push("CONVERT_TO_WEBP_OR_AVIF");
  if (sizeKb >= 180) actions.push("COMPRESS_HIGH_PRIORITY");
  else if (sizeKb >= 90) actions.push("COMPRESS_MEDIUM_PRIORITY");
  if ((width || 0) > 1600) actions.push("CREATE_RESPONSIVE_SIZES");
  if ((width || 0) >= 900 && (height || 0) >= 600 && sizeKb >= 90) actions.push("CHECK_DISPLAY_SIZE");
  if (badName) actions.push("SEO_FILENAME_RENAME_CANDIDATE");

  return actions.length ? actions.join(" | ") : "OK";
}

function findUsage(publicPath, sourceFiles) {
  const escaped = publicPath.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const filename = path.basename(publicPath);
  const filenameEscaped = filename.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const exactRegex = new RegExp(escaped, "g");
  const filenameRegex = new RegExp(filenameEscaped, "g");
  const usedIn = [];

  for (const sourceFile of sourceFiles) {
    const text = fs.readFileSync(sourceFile, "utf8");
    if (exactRegex.test(text) || filenameRegex.test(text)) {
      usedIn.push(path.relative(root, sourceFile).replace(/\\/g, "/"));
    }
  }

  return usedIn;
}

async function main() {
  const imageFiles = walk(imageRoot, (file) => imageExts.has(path.extname(file).toLowerCase()));
  const sourceFiles = sourceRoots.flatMap((dir) =>
    walk(dir, (file) => textExts.has(path.extname(file).toLowerCase())),
  );

  const rows = [];

  for (const file of imageFiles) {
    const ext = path.extname(file).toLowerCase();
    const stat = fs.statSync(file);
    const sizeKb = stat.size / 1024;
    const publicPath = toPublicPath(file);
    const usedIn = findUsage(publicPath, sourceFiles);
    const badName = isLikelyBadFilename(publicPath);

    let width = "";
    let height = "";
    let format = ext.replace(".", "");

    try {
      const metadata = await sharp(file).metadata();
      width = metadata.width || "";
      height = metadata.height || "";
      format = metadata.format || format;
    } catch (error) {
      format = `READ_ERROR: ${error.message}`;
    }

    rows.push({
      publicPath,
      ext,
      format,
      sizeKb: Math.round(sizeKb * 10) / 10,
      width,
      height,
      usedCount: usedIn.length,
      firstUsedIn: usedIn[0] || "",
      usedIn: usedIn.join(" | "),
      badName: badName ? "YES" : "NO",
      suggestedFilename: badName ? getSeoFilenameSuggestion(publicPath) : "",
      action: getAction({ ext, sizeKb, width, height, usedCount: usedIn.length, badName }),
    });
  }

  rows.sort((a, b) => {
    const priorityA = a.action === "OK" ? 0 : 1;
    const priorityB = b.action === "OK" ? 0 : 1;
    return priorityB - priorityA || b.sizeKb - a.sizeKb;
  });

  fs.mkdirSync(reportDir, { recursive: true });

  const csvHeaders = [
    "publicPath",
    "format",
    "sizeKb",
    "width",
    "height",
    "usedCount",
    "firstUsedIn",
    "badSeoFilename",
    "suggestedFilename",
    "action",
    "usedIn",
  ];

  const csv = [
    csvHeaders.join(","),
    ...rows.map((row) =>
      [
        row.publicPath,
        row.format,
        row.sizeKb,
        row.width,
        row.height,
        row.usedCount,
        row.firstUsedIn,
        row.badName,
        row.suggestedFilename,
        row.action,
        row.usedIn,
      ].map(escapeCsv).join(","),
    ),
  ].join("\n");

  fs.writeFileSync(path.join(reportDir, "image-seo-audit.csv"), csv, "utf8");

  const usedRows = rows.filter((row) => row.usedCount > 0);
  const unusedRows = rows.filter((row) => row.usedCount === 0);
  const highPriority = rows.filter((row) => row.action.includes("HIGH_PRIORITY"));
  const renameCandidates = rows.filter((row) => row.badName === "YES");

  const summary = [
    "Image SEO audit summary",
    "=======================",
    `Total images: ${rows.length}`,
    `Referenced in code: ${usedRows.length}`,
    `Not referenced in scanned code: ${unusedRows.length}`,
    `High-priority compression candidates: ${highPriority.length}`,
    `SEO filename rename candidates: ${renameCandidates.length}`,
    "",
    "Top 25 largest images:",
    ...rows
      .slice()
      .sort((a, b) => b.sizeKb - a.sizeKb)
      .slice(0, 25)
      .map((row, index) => `${index + 1}. ${row.publicPath} — ${row.sizeKb} KiB — ${row.width}x${row.height} — ${row.action}`),
    "",
    "Reports:",
    "- reports/image-seo-audit.csv",
  ].join("\n");

  fs.writeFileSync(path.join(reportDir, "image-seo-audit-summary.txt"), summary, "utf8");

  console.log(summary);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
