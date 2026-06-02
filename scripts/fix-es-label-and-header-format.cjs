const fs = require("fs");

const file = "components/VoulamandisHeader.tsx";
let text = fs.readFileSync(file, "utf8");

// Fix indentation in the copy type if needed.
text = text.replace(
  /\n\s*chiosActivities: string;\n\s*contact: string;/,
  "\n    chiosActivities: string;\n    contact: string;"
);

// Add Spanish chiosActivities label inside the es block if missing.
const esStart = text.indexOf("  es: {");

if (esStart === -1) {
  console.error("ERROR: Could not find Spanish es block.");
  process.exit(1);
}

const esEnd = text.indexOf("\n  },", esStart);

if (esEnd === -1) {
  console.error("ERROR: Could not find end of Spanish es block.");
  process.exit(1);
}

let esBlock = text.slice(esStart, esEnd);

if (!esBlock.includes("chiosActivities:")) {
  esBlock = esBlock.replace(
    /(\n\s*museums:\s*"[^"]*",)/,
    '$1\n    chiosActivities: "Actividades en Quíos",'
  );

  if (!esBlock.includes('chiosActivities: "Actividades en Quíos",')) {
    console.error("ERROR: Could not insert Spanish chiosActivities label.");
    process.exit(1);
  }

  text = text.slice(0, esStart) + esBlock + text.slice(esEnd);
} else {
  esBlock = esBlock.replace(
    /chiosActivities:\s*"[^"]*",/,
    'chiosActivities: "Actividades en Quíos",'
  );

  text = text.slice(0, esStart) + esBlock + text.slice(esEnd);
}

// Fix formatting after Chios Activities language-switcher block if it got glued.
text = text.replace(
  /\n\s*}\nconst matchingBeachDetailGroup/g,
  "\n  }\n\n  const matchingBeachDetailGroup"
);

fs.writeFileSync(file, text, "utf8");

const checks = [
  'chiosActivities: "Actividades en Quíos",',
  "matchingChiosActivityDetailGroup",
  "isChiosActivitiesPage",
  "label: copy.chiosActivities",
  "href: chiosActivitiesPaths[language]",
  "  const matchingBeachDetailGroup",
];

console.log("");
console.log("Verification:");
console.log("-------------");

let missing = 0;

for (const check of checks) {
  if (text.includes(check)) {
    console.log("FOUND   " + check);
  } else {
    console.log("MISSING " + check);
    missing++;
  }
}

console.log("");

if (missing > 0) {
  console.log("NEEDS REVIEW: Some checks are still missing.");
  process.exit(1);
}

console.log("SUCCESS: Spanish label and formatting fixed.");
