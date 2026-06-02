const fs = require("fs");

const file = "components/landing/ChiosActivitiesPage.tsx";
let text = fs.readFileSync(file, "utf8");
const original = text;

const replacements = [
  [
    ">ACTIVITIES IN CHIOS<",
    ">{data.hero.eyebrow}<"
  ],
  [
    ">Choose your Chios experience<",
    ">{data.hero.title}<"
  ],
  [
    ">Explore local traditions, nature, wellness, culture, and seasonal experiences recommended by Voulamandis House.<",
    ">{data.hero.subtitle}<"
  ],
];

for (const [from, to] of replacements) {
  text = text.replaceAll(from, to);
}

// More flexible fallback replacements in case the text is split across lines.
text = text.replace(
  /ACTIVITIES IN CHIOS/g,
  "{data.hero.eyebrow}"
);

text = text.replace(
  /Choose your Chios experience/g,
  "{data.hero.title}"
);

text = text.replace(
  /Explore local traditions,\s*nature,\s*wellness,\s*culture,\s*and seasonal experiences recommended by\s*Voulamandis House\./g,
  "{data.hero.subtitle}"
);

// Fix accidental double braces if any replacement happened inside JSX expression.
text = text.replaceAll("{{data.hero.eyebrow}}", "{data.hero.eyebrow}");
text = text.replaceAll("{{data.hero.title}}", "{data.hero.title}");
text = text.replaceAll("{{data.hero.subtitle}}", "{data.hero.subtitle}");

fs.writeFileSync(file, text, "utf8");

console.log("");
console.log("Verification:");
console.log("-------------");

const checks = [
  "data.hero.eyebrow",
  "data.hero.title",
  "data.hero.subtitle",
];

let missing = 0;

for (const check of checks) {
  if (text.includes(check)) {
    console.log("FOUND   " + check);
  } else {
    console.log("MISSING " + check);
    missing++;
  }
}

if (text === original) {
  console.log("");
  console.log("NOTE: File did not change. The component may use different text/layout.");
}

if (missing > 0) {
  console.log("");
  console.log("NEEDS REVIEW: Some hero data fields were not found.");
  process.exit(1);
}

console.log("");
console.log("SUCCESS: Chios Activities hero now uses localized data.");
