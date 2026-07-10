const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = process.cwd();
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = path.join(root, "backups", `beach-images-batch1-${timestamp}`);
const reportDir = path.join(root, "reports");

const mappings = [
  {
    oldPath: "/images/beaches/paralia-ton-glaron-4.jpg",
    newPath: "/images/beaches/paralia-glaron-beach-chios.webp",
    width: 900,
    quality: 72,
  },
  {
    oldPath: "/images/beaches/kato-fana-3.jpg",
    newPath: "/images/beaches/kato-fana-beach-chios.webp",
    width: 900,
    quality: 72,
  },
  {
    oldPath: "/images/beaches/agia-fotia.jpg",
    newPath: "/images/beaches/agia-fotia-beach-chios.webp",
    width: 800,
    quality: 72,
  },
  {
    oldPath: "/images/beaches/daskalopetra-beach-chios.jpg",
    newPath: "/images/beaches/daskalopetra-beach-chios.webp",
    width: 900,
    quality: 72,
  },
  {
    oldPath: "/images/beaches/sakiz-adasi-chios-greece-komi-be-2.jpg",
    newPath: "/images/beaches/komi-beach-chios.webp",
    width: 900,
    quality: 72,
  },
  {
    oldPath: "/images/beaches/karfas-beach-chios.jpg",
    newPath: "/images/beaches/karfas-beach-chios.webp",
    width: 900,
    quality: 72,
  },
  {
    oldPath: "/images/beaches/691-e1645969589226.webp",
    newPath: "/images/beaches/agia-dynami-beach-chios.webp",
    width: 800,
    quality: 70,
  },
  {
    oldPath: "/images/beaches/2017-06-28-1024x768.webp",
    newPath: "/images/beaches/lithi-beach-chios.webp",
    width: 850,
    quality: 70,
  },
  {
    oldPath: "/images/beaches/salagona-e1645969502155.webp",
    newPath: "/images/beaches/salagona-beach-chios.webp",
    width: 850,
    quality: 70,
  },
  {
    oldPath: "/images/beaches/nagos-e1645969566121.webp",
    newPath: "/images/beaches/nagos-beach-chios.webp",
    width: 850,
    quality: 70,
  },
  {
    oldPath: "/images/beaches/emporios3-e1702727598897.webp",
    newPath: "/images/beaches/mavra-volia-beach-chios.webp",
    width: 800,
    quality: 72,
  },
  {
    oldPath: "/images/beaches/42ba5ae2ff96d99dfb12b1e06fa90b45-e1703437426681.webp",
    newPath: "/images/beaches/komi-sandy-beach-chios.webp",
    width: 800,
    quality: 72,
  },
  {
    oldPath: "/images/beaches/voulamandis-house-chios-courtyard-hero-desktop.webp",
    newPath: "/images/beaches/voulamandis-house-courtyard-chios.webp",
    width: 1100,
    quality: 72,
  },
];

const sourceRoots = ["app", "components", "content", "lib"].map((dir) => path.join(root, dir));
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

function publicToFile(publicPath) {
  return path.join(root, "public", publicPath.replace(/^\//, ""));
}

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyBackup(filePath) {
  if (!fs.existsSync(filePath)) return;

  const relative = path.relative(root, filePath);
  const backupPath = path.join(backupDir, relative);
  ensureParentDir(backupPath);
  fs.copyFileSync(filePath, backupPath);
}

function sizeKb(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  return Math.round((fs.statSync(filePath).size / 1024) * 10) / 10;
}

async function optimizeImage(mapping) {
  const sourceFile = publicToFile(mapping.oldPath);
  const targetFile = publicToFile(mapping.newPath);

  if (!fs.existsSync(sourceFile)) {
    return {
      ...mapping,
      status: "MISSING_SOURCE",
      beforeKb: 0,
      afterKb: 0,
      savingsKb: 0,
    };
  }

  copyBackup(sourceFile);
  if (fs.existsSync(targetFile)) copyBackup(targetFile);
  ensureParentDir(targetFile);

  await sharp(sourceFile)
    .rotate()
    .resize({ width: mapping.width, withoutEnlargement: true })
    .webp({ quality: mapping.quality, effort: 6 })
    .toFile(targetFile);

  const beforeKb = sizeKb(sourceFile);
  const afterKb = sizeKb(targetFile);

  return {
    ...mapping,
    status: "OK",
    beforeKb,
    afterKb,
    savingsKb: Math.round((beforeKb - afterKb) * 10) / 10,
  };
}

function replaceReferences() {
  const files = sourceRoots.flatMap((dir) =>
    walk(dir, (file) => textExts.has(path.extname(file).toLowerCase())),
  );
  const changedFiles = [];

  for (const file of files) {
    let text = fs.readFileSync(file, "utf8");
    let changed = false;

    for (const mapping of mappings) {
      if (text.includes(mapping.oldPath)) {
        text = text.split(mapping.oldPath).join(mapping.newPath);
        changed = true;
      }
    }

    if (changed) {
      copyBackup(file);
      fs.writeFileSync(file, text, "utf8");
      changedFiles.push(path.relative(root, file).replace(/\\/g, "/"));
    }
  }

  return changedFiles;
}

function escapeCsv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

async function main() {
  fs.mkdirSync(backupDir, { recursive: true });
  fs.mkdirSync(reportDir, { recursive: true });

  const results = [];

  for (const mapping of mappings) {
    results.push(await optimizeImage(mapping));
  }

  const changedFiles = replaceReferences();

  const csv = [
    "oldPath,newPath,status,beforeKb,afterKb,savingsKb,width,quality",
    ...results.map((row) =>
      [
        row.oldPath,
        row.newPath,
        row.status,
        row.beforeKb,
        row.afterKb,
        row.savingsKb,
        row.width,
        row.quality,
      ].map(escapeCsv).join(","),
    ),
  ].join("\n");

  fs.writeFileSync(path.join(reportDir, "beach-images-batch1-optimization.csv"), csv, "utf8");

  const totalBefore = Math.round(results.reduce((sum, row) => sum + row.beforeKb, 0) * 10) / 10;
  const totalAfter = Math.round(results.reduce((sum, row) => sum + row.afterKb, 0) * 10) / 10;
  const totalSavings = Math.round((totalBefore - totalAfter) * 10) / 10;

  const summary = [
    "Beach image optimization batch 1",
    "================================",
    `Images processed: ${results.length}`,
    `Original total: ${totalBefore} KiB`,
    `Optimized total: ${totalAfter} KiB`,
    `Estimated savings: ${totalSavings} KiB`,
    `Backup folder: ${path.relative(root, backupDir).replace(/\\/g, "/")}`,
    "",
    "Changed reference files:",
    ...(changedFiles.length ? changedFiles.map((file) => `- ${file}`) : ["- none"]),
    "",
    "Generated images:",
    ...results.map((row) => `- ${row.newPath}: ${row.afterKb} KiB (${row.status})`),
    "",
    "Report:",
    "- reports/beach-images-batch1-optimization.csv",
  ].join("\n");

  fs.writeFileSync(path.join(reportDir, "beach-images-batch1-optimization-summary.txt"), summary, "utf8");
  console.log(summary);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
