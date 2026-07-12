const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const targets = [
  "components/chios/ChiosBeachesPageTailwind.tsx",
  "components/chios/ChiosVillagesPageTailwind.tsx",
  "components/chios/ChiosMuseumsPage.tsx",
];

const replacements = [
  {
    label: "localized hero image alt",
    pattern: /src=\{data\.hero\.image\}(\s+)alt=""/g,
    replacement: 'src={data.hero.image}$1alt={data.hero.title}',
  },
  {
    label: "Voulamandis House courtyard alt",
    pattern: /src="\/images\/beaches\/voulamandis-house-courtyard-chios\.webp"(\s+)alt=""/g,
    replacement: 'src="/images/beaches/voulamandis-house-courtyard-chios.webp"$1alt={data.stay.title}',
  },
];

let changedFiles = 0;
let changedImages = 0;

for (const relativePath of targets) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing expected file: ${relativePath}`);
  }

  const original = fs.readFileSync(filePath, "utf8");
  let next = original;

  for (const replacement of replacements) {
    next = next.replace(replacement.pattern, (...args) => {
      changedImages += 1;
      const match = args[0];
      const whitespace = args[1];
      return replacement.replacement.replace("$1", whitespace);
    });
  }

  if (next !== original) {
    fs.writeFileSync(filePath, next, "utf8");
    changedFiles += 1;
    console.log(`[alt-text] updated ${relativePath}`);
  }
}

console.log(`[alt-text] ${changedImages} image alt attributes updated in ${changedFiles} files`);
