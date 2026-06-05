const fs = require("fs");
const path = require("path");

const root = process.cwd();
const scanDirs = ["app", "components", "content", "lib", "schema"].filter((d) =>
  fs.existsSync(path.join(root, d))
);
const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".cjs", ".mjs"]);
const imageRegex = /["'`](\/images\/[^"'`]+\.(?:webp|jpg|jpeg|png|gif|svg))["'`]/gi;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (exts.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

const missing = [];

for (const dir of scanDirs) {
  for (const file of walk(path.join(root, dir))) {
    const rel = path.relative(root, file).replace(/\\/g, "/");
    const text = fs.readFileSync(file, "utf8");
    let match;

    while ((match = imageRegex.exec(text))) {
      const img = match[1];
      const localPath = path.join(root, "public", img);
      if (!fs.existsSync(localPath)) {
        missing.push(`${img} referenced in ${rel}`);
      }
    }
  }
}

if (missing.length === 0) {
  console.log("OK: Missing local images: 0");
} else {
  console.log(`Missing local images: ${missing.length}`);
  for (const item of missing) console.log("MISSING", item);
}
