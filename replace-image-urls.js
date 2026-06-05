const fs = require("fs");
const path = require("path");

const root = process.cwd();
const mapPath = path.join(root, "image-url-map.json");

if (!fs.existsSync(mapPath)) {
  console.error("Missing image-url-map.json");
  process.exit(1);
}

const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));

const scanDirs = ["app", "components", "content", "lib", "schema"].filter((d) =>
  fs.existsSync(path.join(root, d))
);

const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".cjs", ".mjs"]);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (exts.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

let changedFiles = 0;
let replacements = 0;

for (const dir of scanDirs) {
  for (const file of walk(path.join(root, dir))) {
    let text = fs.readFileSync(file, "utf8");
    const original = text;

    for (const item of map) {
      if (text.includes(item.old)) {
        const count = text.split(item.old).length - 1;
        text = text.split(item.old).join(item.local);
        replacements += count;
      }
    }

    if (text !== original) {
      fs.writeFileSync(file, text, "utf8");
      changedFiles++;
      console.log("UPDATED", path.relative(root, file));
    }
  }
}

console.log("");
console.log(`Changed files: ${changedFiles}`);
console.log(`Replacements: ${replacements}`);
