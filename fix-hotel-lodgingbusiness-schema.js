const fs = require("fs");
const path = require("path");

const root = process.cwd();
const dirs = ["app", "components", "content", "lib", "schema"].filter((dir) =>
  fs.existsSync(path.join(root, dir))
);

const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".cjs", ".mjs"]);

function walk(dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (exts.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

let changedFiles = 0;
let replacements = 0;

for (const dir of dirs) {
  for (const file of walk(path.join(root, dir))) {
    let text = fs.readFileSync(file, "utf8");
    const original = text;

    const patterns = [
      ['"@type": ["Hotel", "LodgingBusiness"]', '"@type": "Hotel"'],
      ['"@type": ["LodgingBusiness", "Hotel"]', '"@type": "Hotel"'],
      ["'@type': ['Hotel', 'LodgingBusiness']", "'@type': 'Hotel'"],
      ["'@type': ['LodgingBusiness', 'Hotel']", "'@type': 'Hotel'"],
    ];

    for (const [oldText, newText] of patterns) {
      const count = text.split(oldText).length - 1;

      if (count > 0) {
        text = text.split(oldText).join(newText);
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
console.log("Changed files:", changedFiles);
console.log("Replacements:", replacements);
