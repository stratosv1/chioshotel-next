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

const activityLogic = `

  const matchingChiosActivityDetailGroup = chiosActivityDetailPathGroups.find((group) =>
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

// 1. Add logic right after normalizedPath line, regardless of CRLF/LF.
if (!text.includes("matchingChiosActivityDetailGroup")) {
  const normalizedPathRegex =
    /(function\s+getLanguageHref\s*\(\s*path:\s*string,\s*language:\s*LanguageCode\s*\)\s*\{\s*[\r\n]+\s*const\s+normalizedPath\s*=\s*normalizePath\(path\);\s*)/;

  if (!normalizedPathRegex.test(text)) {
    console.error("ERROR: Could not find getLanguageHref normalizedPath with regex.");
    process.exit(1);
  }

  text = text.replace(normalizedPathRegex, `$1${activityLogic}`);
}

// 2. Add chiosActivities to copy type/interface.
if (!text.includes("chiosActivities: string;")) {
  const typeRegex = /(\s+museums:\s*string;\s*[\r\n]+)/;

  if (!typeRegex.test(text)) {
    console.error("ERROR: Could not find museums: string target.");
    process.exit(1);
  }

  text = text.replace(typeRegex, `$1  chiosActivities: string;\n`);
}

// 3. Add labels inside navigationCopy blocks.
for (const [lang, label] of Object.entries(labels)) {
  const langRegex = new RegExp(`(${lang}\\s*:\\s*\\{[\\s\\S]*?museums\\s*:\\s*"[^"]*",)([\\s\\S]*?\\n\\s*\\},)`);
  const match = text.match(langRegex);

  if (!match) {
    console.error(`ERROR: Could not find language copy block or museums label for: ${lang}`);
    process.exit(1);
  }

  const full = match[0];

  if (!full.includes("chiosActivities:")) {
    const replacement = `${match[1]}\n    chiosActivities: "${label}",${match[2]}`;
    text = text.replace(full, replacement);
  }
}

// 4. Add menu link after museums in getMainLinks.
if (!text.includes("label: copy.chiosActivities")) {
  const menuRegex =
    /(\s*\{\s*[\r\n]+\s*label:\s*copy\.museums,\s*[\r\n]+\s*href:\s*museumPaths\[language\],\s*[\r\n]+\s*\},)/;

  if (!menuRegex.test(text)) {
    console.error("ERROR: Could not find museums link block in getMainLinks.");
    process.exit(1);
  }

  const menuInsert = `$1
    {
      label: copy.chiosActivities,
      href: chiosActivitiesPaths[language],
    },`;

  text = text.replace(menuRegex, menuInsert);
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
