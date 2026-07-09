const fs = require("fs");
const path = require("path");

const zeroRoomExtrasBlock = `const ROOM_EXTRA_PER_NIGHT: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
};`;

const targets = [
  {
    label: "LastMinuteDeals",
    filePath: path.join(process.cwd(), "components", "home", "LastMinuteDeals.tsx"),
  },
  {
    label: "FindYourRoomEngine",
    filePath: path.join(process.cwd(), "components", "booking", "FindYourRoomEngine.tsx"),
  },
];

const roomExtrasRegex =
  /const ROOM_EXTRA_PER_NIGHT:\s*Record<number,\s*number>\s*=\s*\{[\s\S]*?\};/m;

for (const target of targets) {
  if (!fs.existsSync(target.filePath)) {
    console.warn(`Skipping ${target.label}: file not found.`);
    continue;
  }

  const source = fs.readFileSync(target.filePath, "utf8");

  if (!source.includes("ROOM_EXTRA_PER_NIGHT")) {
    console.warn(`Skipping ${target.label}: ROOM_EXTRA_PER_NIGHT not found.`);
    continue;
  }

  if (!roomExtrasRegex.test(source)) {
    console.warn(`Skipping ${target.label}: ROOM_EXTRA_PER_NIGHT block format not matched.`);
    continue;
  }

  const nextSource = source.replace(roomExtrasRegex, zeroRoomExtrasBlock);

  if (nextSource !== source) {
    fs.writeFileSync(target.filePath, nextSource, "utf8");
    console.log(`Updated ${target.label}: room extras set to zero.`);
  } else {
    console.log(`No change needed for ${target.label}.`);
  }
}

const consentPath = path.join(process.cwd(), "components", "analytics", "ConsentAnalytics.tsx");

if (fs.existsSync(consentPath)) {
  let source = fs.readFileSync(consentPath, "utf8");
  const wrongImport = 'import { Analytics, track } from "@vercel/analytics/react";';
  const correctImport =
    'import { track } from "@vercel/analytics";\nimport { Analytics } from "@vercel/analytics/react";';

  if (source.includes(wrongImport)) {
    source = source.replace(wrongImport, correctImport);
    fs.writeFileSync(consentPath, source, "utf8");
    console.log("Fixed ConsentAnalytics import.");
  }
}

const villageCategoriesPath = path.join(process.cwd(), "content", "village-categories.ts");

if (fs.existsSync(villageCategoriesPath)) {
  let source = fs.readFileSync(villageCategoriesPath, "utf8");
  const looseVillageSize =
    '      size: index === 0 ? "large" : index === 1 ? "tall" : index === 2 ? "wide" : "normal",';
  const typedVillageSize =
    '      size: (index === 0 ? "large" : index === 1 ? "tall" : index === 2 ? "wide" : "normal") as ChiosVillagesPageData["villages"][number]["size"],';

  if (source.includes(looseVillageSize)) {
    source = source.replace(looseVillageSize, typedVillageSize);
    fs.writeFileSync(villageCategoriesPath, source, "utf8");
    console.log("Fixed village category card size type.");
  }
}

const villagesPagePath = path.join(process.cwd(), "components", "chios", "ChiosVillagesPageTailwind.tsx");

if (fs.existsSync(villagesPagePath)) {
  let source = fs.readFileSync(villagesPagePath, "utf8");

  const plainCategoryCarouselOpening =
    '            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:pr-0">';
  const activeCategoryCarouselOpening =
    '            <div className="relative">\n' +
    '              <div\n' +
    '                aria-hidden="true"\n' +
    '                className="pointer-events-none absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#2f261f]/95 text-xl font-black text-white shadow-xl md:hidden"\n' +
    '              >\n' +
    '                →\n' +
    '              </div>\n' +
    '              <div data-carousel-track="true" className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:pr-0">';

  if (source.includes(plainCategoryCarouselOpening)) {
    source = source.replace(plainCategoryCarouselOpening, activeCategoryCarouselOpening);
    source = source.replace(
      '              ))}\n            </div>\n          </div>\n        </section>\n      ) : null}',
      '              ))}\n              </div>\n            </div>\n          </div>\n        </section>\n      ) : null}',
    );
    fs.writeFileSync(villagesPagePath, source, "utf8");
    console.log("Added active village category carousel arrow.");
  }
}

const nextConfigPath = path.join(process.cwd(), "next.config.ts");

if (fs.existsSync(nextConfigPath)) {
  let source = fs.readFileSync(nextConfigPath, "utf8");
  const redirectMarker = "// gsc-2026-07-turkish-legacy-redirects";

  if (!source.includes(redirectMarker)) {
    const redirectBlock = `${redirectMarker}
  {
    source: "/tr/chios-odalari/sakiz-adasinin-plajlari",
    destination: "/tr/sakiz-adasi-plajlari",
    permanent: true,
  },
  {
    source: "/tr/chios-odalari/pyrgi-sakiz-adasi-koyu",
    destination: "/tr/sakiz-adasi-koyleri/pyrgi-koyu",
    permanent: true,
  },
  {
    source: "/tr/chios-odalari/mesta-koyu-chios",
    destination: "/tr/sakiz-adasi-koyleri/mesta-koyu",
    permanent: true,
  },
  {
    source: "/tr/chios-odalari/vessa-koyu-chios",
    destination: "/tr/sakiz-adasi-koyleri/vessa-koyu",
    permanent: true,
  },
  {
    source: "/tr/chios-odalari/olympoi-koyu-chios",
    destination: "/tr/sakiz-adasi-koyleri/olympoi-koyu",
    permanent: true,
  },
  {
    source: "/tr/chios-odalari/volissos-koyu-chios",
    destination: "/tr/sakiz-adasi-koyleri/volissos-koyu",
    permanent: true,
  },
  {
    source: "/tr/chios-odalari/armolia-koyu-chios",
    destination: "/tr/sakiz-adasi-koyleri/armolia-koyu",
    permanent: true,
  },
  {
    source: "/tr/chios-odalari/lagada-koyu-chios",
    destination: "/tr/sakiz-adasi-koyleri/lagada-koyu",
    permanent: true,
  },
  {
    source: "/tr/chios-odalari/kambos-sakiz-adasi",
    destination: "/tr/sakiz-adasi",
    permanent: true,
  },
`;
    source = source.replace("const legacyRedirects = [", `const legacyRedirects = [\n  ${redirectBlock}`);
    fs.writeFileSync(nextConfigPath, source, "utf8");
    console.log("Added Search Console Turkish legacy redirects.");
  }
}
