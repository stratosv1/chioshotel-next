const fs = require("fs");

const file = "components/VoulamandisHeader.tsx";
let text = fs.readFileSync(file, "utf8");

const labels = {
  en: "Chios Activities",
  el: "Δραστηριότητες στη Χίο",
  fr: "Activités à Chios",
  de: "Aktivitäten auf Chios",
  it: "Attività a Chios",
  es: "Actividades en Quíos",
  tr: "Sakız Adası Aktiviteleri",
};

const activityLogic = `  const matchingChiosActivityDetailGroup = chiosActivityDetailPathGroups.find((group) =>
    Object.values(group).includes(normalizedPath),
  );

  if (matchingChiosActivityDetailGroup) {
    return matchingChiosActivityDetailGroup[language];
  }

  const isChiosActivitiesPage = Object.values(chiosActivitiesPaths).includes(normalizedPath);

  if (isChiosActivitiesPage) {
    return chiosActivitiesPaths[language];
  }

`;

if (!text.includes("matchingChiosActivityDetailGroup")) {
  const target = `function getLanguageHref(path: string, language: LanguageCode) {
  const normalizedPath = normalizePath(path);

`;

  if (!text.includes(target)) {
    console.error("ERROR: Could not find getLanguageHref target.");
    process.exit(1);
  }

  text = text.replace(target, target + activityLogic);
}

if (!text.includes("chiosActivities: string;")) {
  const target = "  museums: string;\n";

  if (!text.includes(target)) {
    console.error("ERROR: Could not find museums: string target.");
    process.exit(1);
  }

  text = text.replace(target, target + "  chiosActivities: string;\n");
}

for (const [lang, label] of Object.entries(labels)) {
  const start = text.indexOf(`${lang}: {`);
  if (start === -1) {
    console.error(`ERROR: Could not find language block: ${lang}`);
    process.exit(1);
  }

  const end = text.indexOf("\n  },", start);
  if (end === -1) {
    console.error(`ERROR: Could not find end of language block: ${lang}`);
    process.exit(1);
  }

  const block = text.slice(start, end);

  if (!block.includes("chiosActivities:")) {
    const updatedBlock = block.replace(
      /(\n\s*museums:\s*"[^"]*",)/,
      `$1\n    chiosActivities: "${label}",`
    );

    if (updatedBlock === block) {
      console.error(`ERROR: Could not add chiosActivities label in block: ${lang}`);
      process.exit(1);
    }

    text = text.slice(0, start) + updatedBlock + text.slice(end);
  }
}

if (!text.includes("label: copy.chiosActivities")) {
  const target = `    {
      label: copy.museums,
      href: museumPaths[language],
    },
`;

  const insert = target + `    {
      label: copy.chiosActivities,
      href: chiosActivitiesPaths[language],
    },
`;

  if (!text.includes(target)) {
    console.error("ERROR: Could not find museums link block in getMainLinks.");
    process.exit(1);
  }

  text = text.replace(target, insert);
}

fs.writeFileSync(file, text, "utf8");

const checks = [
  "matchingChiosActivityDetailGroup",
  "isChiosActivitiesPage",
  "chiosActivities: string;",
  "copy.chiosActivities",
  "label: copy.chiosActivities",
  "href: chiosActivitiesPaths[language]",
  "Chios Activities",
  "Δραστηριότητες στη Χίο",
  "Activités à Chios",
  "Aktivitäten auf Chios",
  "Attività a Chios",
  "Actividades en Quíos",
  "Sakız Adası Aktiviteleri",
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

console.log("SUCCESS: Chios Activities header patch is complete.");
