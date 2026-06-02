const fs = require("fs");

const file = "components/VoulamandisHeader.tsx";
let text = fs.readFileSync(file, "utf8");

text = text.replace(
  /const normalizedPath = normalizePath\(path\);\n\s*\n\s*\n\s*const matchingChiosActivityDetailGroup/,
  "const normalizedPath = normalizePath(path);\n\n  const matchingChiosActivityDetailGroup"
);

const oldMainLinksRegex = /function getMainLinks\(language: LanguageCode\) \{\s*const copy = navigationCopy\[language\];\s*return \[[\s\S]*?\n\s*\];\s*\}/;

const newMainLinks = `function getMainLinks(language: LanguageCode) {
  const copy = navigationCopy[language];

  return [
    {
      label: copy.rooms,
      href: roomsCategoryPaths[language],
    },
    {
      label: copy.rates,
      href: ratesPaths[language],
    },
    {
      label: copy.deals,
      href: dealsPaths[language],
    },
    {
      label: copy.chiosIsland,
      href: chiosIslandPaths[language],
    },
    {
      label: copy.chiosActivities,
      href: chiosActivitiesPaths[language],
    },
    {
      label: copy.contact,
      href: contactPaths[language],
    },
  ];
}`;

if (!oldMainLinksRegex.test(text)) {
  console.error("ERROR: Could not find getMainLinks block.");
  process.exit(1);
}

text = text.replace(oldMainLinksRegex, newMainLinks);

const oldExploreLinksRegex = /function getExploreLinks\(language: LanguageCode\) \{\s*const copy = navigationCopy\[language\];\s*return \[[\s\S]*?\n\s*\];\s*\}/;

const newExploreLinks = `function getExploreLinks(language: LanguageCode) {
  const copy = navigationCopy[language];

  return [
    {
      title: copy.exploreCards.beaches.title,
      text: copy.exploreCards.beaches.text,
      href: beachPaths[language],
    },
    {
      title: copy.exploreCards.villages.title,
      text: copy.exploreCards.villages.text,
      href: villagePaths[language],
    },
    {
      title: copy.exploreCards.museums.title,
      text: copy.exploreCards.museums.text,
      href: museumPaths[language],
    },
    {
      title: copy.chiosActivities,
      text: copy.exploreChios,
      href: chiosActivitiesPaths[language],
    },
  ];
}`;

if (!oldExploreLinksRegex.test(text)) {
  console.error("ERROR: Could not find getExploreLinks block.");
  process.exit(1);
}

text = text.replace(oldExploreLinksRegex, newExploreLinks);

fs.writeFileSync(file, text, "utf8");

console.log("SUCCESS: Header menu structure fixed.");
console.log("Desktop menu now uses: Rooms, Rates, Deals, Chios Island, Chios Activities, Contact.");
console.log("Mobile Explore menu now includes Chios Activities.");
