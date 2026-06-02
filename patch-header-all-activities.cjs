const fs = require("fs");

const file = "components/VoulamandisHeader.tsx";
let s = fs.readFileSync(file, "utf8");

/* 1. Import Chios Activities paths */
if (!s.includes("@/content/chios-activities")) {
  s = s.replace(
    'import { useMemo, useState } from "react";',
    `import { useMemo, useState } from "react";
import {
  chiosActivitiesPaths,
  chiosActivityDetailPaths,
} from "@/content/chios-activities";`
  );
}

/* 2. Create all activity detail path groups */
if (!s.includes("const chiosActivityDetailPathGroups")) {
  s = s.replace(
    "const beachPaths: Record<LanguageCode, string> = {",
    `const chiosActivityDetailPathGroups: Record<LanguageCode, string>[] = [
  chiosActivityDetailPaths.mostra,
  chiosActivityDetailPaths.greekCourses,
  chiosActivityDetailPaths.hiking,
  chiosActivityDetailPaths.thermalBaths,
  chiosActivityDetailPaths.rocketWar,
  chiosActivityDetailPaths.orchids,
];

const beachPaths: Record<LanguageCode, string> = {`
  );
}

/* 3. Match activity detail pages first in language switcher */
if (!s.includes("matchingChiosActivityDetailGroup")) {
  s = s.replace(
    `  const normalizedPath = normalizePath(path);

  const matchingBeachDetailGroup = beachDetailPathGroups.find((group) =>
`,
    `  const normalizedPath = normalizePath(path);

  const matchingChiosActivityDetailGroup = chiosActivityDetailPathGroups.find(
    (group) => Object.values(group).includes(normalizedPath),
  );

  if (matchingChiosActivityDetailGroup) {
    return matchingChiosActivityDetailGroup[language];
  }

  const matchingBeachDetailGroup = beachDetailPathGroups.find((group) =>
`
  );
}

/* 4. Match Chios Activities hub page */
if (!s.includes("isChiosActivitiesPage")) {
  s = s.replace(
    `  const isChiosExplorerPage =
    Object.values(chiosExplorerPaths).includes(normalizedPath);

  const isChiosIslandPage =
`,
    `  const isChiosExplorerPage =
    Object.values(chiosExplorerPaths).includes(normalizedPath);

  const isChiosActivitiesPage =
    Object.values(chiosActivitiesPaths).includes(normalizedPath);

  const isChiosIslandPage =
`
  );
}

/* 5. Return Chios Activities hub translated path */
if (!s.includes("return chiosActivitiesPaths[language];")) {
  s = s.replace(
    `  if (isChiosExplorerPage) {
    return chiosExplorerPaths[language];
  }

  if (isChiosIslandPage) {
`,
    `  if (isChiosExplorerPage) {
    return chiosExplorerPaths[language];
  }

  if (isChiosActivitiesPage) {
    return chiosActivitiesPaths[language];
  }

  if (isChiosIslandPage) {
`
  );
}

/* 6. Add menu label type */
if (!s.includes("chiosActivities: string;")) {
  s = s.replace(
    "    chiosIsland: string;\n    beaches: string;",
    "    chiosIsland: string;\n    chiosActivities: string;\n    beaches: string;"
  );
}

/* 7. Add translated menu labels */
const labels = [
  [
    '    chiosIsland: "Chios Island",\n    beaches: "Beaches",',
    '    chiosIsland: "Chios Island",\n    chiosActivities: "Chios Activities",\n    beaches: "Beaches",'
  ],
  [
    '    chiosIsland: "Χίος",\n    beaches: "Παραλίες",',
    '    chiosIsland: "Χίος",\n    chiosActivities: "Δραστηριότητες",\n    beaches: "Παραλίες",'
  ],
  [
    '    chiosIsland: "Île de Chios",\n    beaches: "Plages",',
    '    chiosIsland: "Île de Chios",\n    chiosActivities: "Activités à Chios",\n    beaches: "Plages",'
  ],
  [
    '    chiosIsland: "Insel Chios",\n    beaches: "Strände",',
    '    chiosIsland: "Insel Chios",\n    chiosActivities: "Aktivitäten",\n    beaches: "Strände",'
  ],
  [
    '    chiosIsland: "Isola di Chios",\n    beaches: "Spiagge",',
    '    chiosIsland: "Isola di Chios",\n    chiosActivities: "Attività a Chios",\n    beaches: "Spiagge",'
  ],
  [
    '    chiosIsland: "Isla de Chios",\n    beaches: "Playas",',
    '    chiosIsland: "Isla de Chios",\n    chiosActivities: "Actividades",\n    beaches: "Playas",'
  ],
  [
    '    chiosIsland: "Sakız Adası",\n    beaches: "Plajlar",',
    '    chiosIsland: "Sakız Adası",\n    chiosActivities: "Aktiviteler",\n    beaches: "Plajlar",'
  ],
];

for (const [from, to] of labels) {
  if (!s.includes(to)) {
    s = s.replace(from, to);
  }
}

/* 8. Add Chios Activities to main navigation */
if (!s.includes("label: copy.chiosActivities")) {
  s = s.replace(
    `    {
      label: copy.chiosIsland,
      href: chiosIslandPaths[language],
    },
    {
      label: copy.beaches,
      href: beachPaths[language],
    },
`,
    `    {
      label: copy.chiosIsland,
      href: chiosIslandPaths[language],
    },
    {
      label: copy.chiosActivities,
      href: chiosActivitiesPaths[language],
    },
    {
      label: copy.beaches,
      href: beachPaths[language],
    },
`
  );
}

fs.writeFileSync(file, s, "utf8");
console.log("Patched all Chios Activities paths in header.");
