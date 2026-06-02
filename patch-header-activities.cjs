const fs = require("fs");

const file = "components/VoulamandisHeader.tsx";
let s = fs.readFileSync(file, "utf8");

const pathsBlock = `const chiosActivitiesPaths: Record<LanguageCode, string> = {
  en: "/chios-activities/",
  el: "/el/drastiriotites-sti-xio/",
  fr: "/fr/activites-a-chios/",
  de: "/de/aktivitaeten-auf-chios/",
  it: "/it/attivita-a-chios/",
  es: "/es/actividades-en-quios/",
  tr: "/tr/sakiz-adasi-aktiviteleri/",
};

const chiosActivityDetailPathGroups: Record<LanguageCode, string>[] = [
  {
    en: "/chios-festival-mostra/",
    el: "/el/festival-mostra-thymiana-xios/",
    fr: "/fr/festival-mostra-chios/",
    de: "/de/mostra-festival-chios/",
    it: "/it/festival-mostra-chios/",
    es: "/es/festival-mostra-quios/",
    tr: "/tr/sakiz-adasi-mostra-festivali/",
  },
  {
    en: "/greek-language-courses-chios/",
    el: "/el/mathimata-ellinikon-sti-xio/",
    fr: "/fr/cours-de-grec-a-chios/",
    de: "/de/griechischkurse-auf-chios/",
    it: "/it/corsi-di-greco-a-chios/",
    es: "/es/cursos-de-griego-en-quios/",
    tr: "/tr/sakiz-adasi-yunanca-kurslari/",
  },
  {
    en: "/chios-hiking/",
    el: "/el/pezoporia-sti-xio/",
    fr: "/fr/randonnee-a-chios/",
    de: "/de/wandern-auf-chios/",
    it: "/it/trekking-a-chios/",
    es: "/es/senderismo-en-quios/",
    tr: "/tr/sakiz-adasi-yuruyus-rotalari/",
  },
  {
    en: "/chios-thermal-baths/",
    el: "/el/iamatika-loutra-xiou/",
    fr: "/fr/sources-thermales-de-chios/",
    de: "/de/thermalquellen-auf-chios/",
    it: "/it/terme-di-chios/",
    es: "/es/banos-termales-de-quios/",
    tr: "/tr/sakiz-adasi-termal-kaplicalari/",
  },
  {
    en: "/rocket-war-chios/",
    el: "/el/rouketopolemos-xios/",
    fr: "/fr/guerre-des-fusees-chios/",
    de: "/de/raketenkrieg-chios/",
    it: "/it/guerra-dei-razzi-chios/",
    es: "/es/guerra-de-cohetes-quios/",
    tr: "/tr/sakiz-adasi-roket-savasi/",
  },
  {
    en: "/chios-orchids/",
    el: "/el/orchidees-xiou/",
    fr: "/fr/orchidees-de-chios/",
    de: "/de/orchideen-auf-chios/",
    it: "/it/orchidee-di-chios/",
    es: "/es/orquideas-de-quios/",
    tr: "/tr/sakiz-adasi-orkideleri/",
  },
];
`;

if (!s.includes("const chiosActivitiesPaths")) {
  s = s.replace(
`const chiosExplorerPaths: Record<LanguageCode, string> = {
  en: "/chios-explorer/",
  el: "/el/exerevnisi-xiou/",
  fr: "/fr/explorer-chios/",
  de: "/de/chios-entdecken/",
  it: "/it/esplora-chios/",
  es: "/es/explorar-quios/",
  tr: "/tr/sakiz-adasi-kesif/",
};
`,
`const chiosExplorerPaths: Record<LanguageCode, string> = {
  en: "/chios-explorer/",
  el: "/el/exerevnisi-xiou/",
  fr: "/fr/explorer-chios/",
  de: "/de/chios-entdecken/",
  it: "/it/esplora-chios/",
  es: "/es/explorar-quios/",
  tr: "/tr/sakiz-adasi-kesif/",
};

${pathsBlock}`
  );
}

if (!s.includes("chiosActivities: string;")) {
  s = s.replace(
    "    chiosIsland: string;\n    beaches: string;",
    "    chiosIsland: string;\n    chiosActivities: string;\n    beaches: string;"
  );
}

const labelPatches = [
  ['    chiosIsland: "Chios Island",\n    beaches: "Beaches",', '    chiosIsland: "Chios Island",\n    chiosActivities: "Chios Activities",\n    beaches: "Beaches",'],
  ['    chiosIsland: "????",\n    beaches: "????????",', '    chiosIsland: "????",\n    chiosActivities: "??????????????",\n    beaches: "????????",'],
  ['    chiosIsland: "?le de Chios",\n    beaches: "Plages",', '    chiosIsland: "?le de Chios",\n    chiosActivities: "Activit?s ? Chios",\n    beaches: "Plages",'],
  ['    chiosIsland: "Insel Chios",\n    beaches: "Str?nde",', '    chiosIsland: "Insel Chios",\n    chiosActivities: "Aktivit?ten",\n    beaches: "Str?nde",'],
  ['    chiosIsland: "Isola di Chios",\n    beaches: "Spiagge",', '    chiosIsland: "Isola di Chios",\n    chiosActivities: "Attivit? a Chios",\n    beaches: "Spiagge",'],
  ['    chiosIsland: "Isla de Chios",\n    beaches: "Playas",', '    chiosIsland: "Isla de Chios",\n    chiosActivities: "Actividades",\n    beaches: "Playas",'],
  ['    chiosIsland: "Sak?z Adas?",\n    beaches: "Plajlar",', '    chiosIsland: "Sak?z Adas?",\n    chiosActivities: "Aktiviteler",\n    beaches: "Plajlar",'],
];

for (const [from, to] of labelPatches) {
  if (!s.includes(to)) {
    s = s.replace(from, to);
  }
}

if (!s.includes("matchingChiosActivityDetailGroup")) {
  s = s.replace(
`  const matchingBeachDetailGroup = beachDetailPathGroups.find((group) =>
    Object.values(group).includes(normalizedPath),
  );
`,
`  const matchingChiosActivityDetailGroup = chiosActivityDetailPathGroups.find(
    (group) => Object.values(group).includes(normalizedPath),
  );

  if (matchingChiosActivityDetailGroup) {
    return matchingChiosActivityDetailGroup[language];
  }

  const matchingBeachDetailGroup = beachDetailPathGroups.find((group) =>
    Object.values(group).includes(normalizedPath),
  );
`
  );
}

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
console.log("Header Chios Activities language switcher patched safely.");
