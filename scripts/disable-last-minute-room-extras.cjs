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

const preArrivalPagePath = path.join(process.cwd(), "components", "pre-arrival", "PreArrivalPage.tsx");

if (fs.existsSync(preArrivalPagePath)) {
  let source = fs.readFileSync(preArrivalPagePath, "utf8");
  const replacements = [
    [
      'className="h-full w-[86vw] shrink-0 snap-start rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:w-auto md:p-6"',
      'className="h-full w-[82vw] max-w-[360px] shrink-0 snap-start rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-900/10 md:w-auto md:max-w-none md:p-6"',
    ],
    [
      'className="text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950 md:text-3xl"',
      'className="text-xl font-black leading-tight tracking-[-0.03em] text-slate-950 md:text-3xl"',
    ],
    [
      'className="mt-2 text-base leading-7 text-slate-700"',
      'className="mt-2 text-[15px] leading-6 text-slate-700 md:text-base md:leading-7"',
    ],
    [
      'className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-teal-800 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white hover:bg-teal-900"',
      'className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-teal-800 px-4 text-center text-xs font-black uppercase tracking-[0.06em] !text-white hover:bg-teal-900 md:min-h-[48px] md:px-5 md:text-sm"',
    ],
    [
      'className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-red-700 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white hover:bg-red-800"',
      'className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-red-700 px-4 text-center text-xs font-black uppercase tracking-[0.06em] !text-white hover:bg-red-800 md:min-h-[48px] md:px-5 md:text-sm"',
    ],
    [
      'className="mt-4 rounded-[18px] border border-yellow-300 bg-yellow-50 p-4 text-amber-950"',
      'className="mt-3 rounded-[16px] border border-yellow-300 bg-yellow-50 p-3 text-sm leading-6 text-amber-950 md:mt-4 md:rounded-[18px] md:p-4 md:text-base"',
    ],
    [
      'className="mt-2 leading-7"',
      'className="mt-1.5 leading-6 md:mt-2 md:leading-7"',
    ],
    [
      'className="flex gap-4 rounded-[16px] bg-slate-50 p-3.5 ring-1 ring-slate-900/5"',
      'className="flex gap-3 rounded-[16px] bg-slate-50 p-3 ring-1 ring-slate-900/5 md:gap-4 md:p-3.5"',
    ],
    [
      'className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white"',
      'className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white md:h-9 md:w-9 md:text-sm"',
    ],
    [
      'className="leading-7 text-slate-700"',
      'className="text-sm leading-6 text-slate-700 md:text-base md:leading-7"',
    ],
    [
      'className="relative mt-4 -mx-4 overflow-hidden pl-4 md:mx-0 md:overflow-visible md:pl-0"',
      'className="relative mt-4 -mx-3 overflow-hidden pl-3 md:mx-0 md:overflow-visible md:pl-0"',
    ],
    [
      'className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pr-12 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] md:grid md:overflow-visible md:pr-0 [&::-webkit-scrollbar]:hidden"',
      'className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pr-12 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] md:grid md:gap-4 md:overflow-visible md:pr-0 [&::-webkit-scrollbar]:hidden"',
    ],
    [
      'className="min-h-screen bg-[#eef7f4] px-4 py-4 text-slate-950 md:px-6 md:py-6"',
      'className="min-h-screen bg-[#eef7f4] px-3 py-3 text-slate-950 md:px-6 md:py-6"',
    ],
    [
      'className="mb-4 rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-slate-900/10"',
      'className="mb-3 rounded-[22px] bg-white p-2.5 shadow-sm ring-1 ring-slate-900/10 md:mb-4 md:rounded-[24px] md:p-3"',
    ],
    [
      'className="flex flex-wrap justify-center gap-2 md:justify-start"',
      'className="grid grid-cols-4 gap-1.5 md:flex md:flex-wrap md:justify-start md:gap-2"',
    ],
    [
      'className={`rounded-full px-4 py-2 text-sm font-black transition ${',
      'className={`rounded-full px-2.5 py-2 text-center text-[12px] font-black transition md:px-4 md:text-sm ${',
    ],
    [
      'className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-7"',
      'className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-900/10 md:rounded-[24px] md:p-7"',
    ],
    [
      'className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl"',
      'className="mt-4 text-[2rem] font-black leading-tight tracking-[-0.04em] md:text-5xl"',
    ],
    [
      'className="mt-3 max-w-[780px] text-lg leading-8 text-slate-700"',
      'className="mt-3 max-w-[780px] text-base leading-7 text-slate-700 md:text-lg md:leading-8"',
    ],
    [
      'className="mt-4 rounded-[24px] bg-slate-950 p-5 text-white shadow-sm md:p-7"',
      'className="mt-4 rounded-[22px] bg-slate-950 p-4 text-white shadow-sm md:rounded-[24px] md:p-7"',
    ],
    [
      'className="text-2xl font-black leading-tight tracking-[-0.03em] md:text-3xl"',
      'className="text-xl font-black leading-tight tracking-[-0.03em] md:text-3xl"',
    ],
    [
      'className="mt-3 max-w-[820px] text-base leading-7 text-white/75"',
      'className="mt-2 max-w-[820px] text-[15px] leading-6 text-white/75 md:mt-3 md:text-base md:leading-7"',
    ],
    [
      'className="mt-5 grid gap-3 md:grid-cols-3"',
      'className="mt-4 grid grid-cols-3 gap-2 md:mt-5 md:gap-3"',
    ],
    [
      'className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-slate-950"',
      'className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-white px-2 text-center text-[11px] font-black uppercase tracking-[0.04em] !text-slate-950 md:min-h-[52px] md:px-5 md:text-sm"',
    ],
    [
      'className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/20 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"',
      'className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-white/20 px-2 text-center text-[11px] font-black uppercase tracking-[0.04em] !text-white md:min-h-[52px] md:px-5 md:text-sm"',
    ],
    [
      'className="mt-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-6"',
      'className="mt-4 rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-900/10 md:rounded-[24px] md:p-6"',
    ],
    [
      'className="mt-4 grid gap-3 md:grid-cols-4"',
      'className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3"',
    ],
    [
      'className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-slate-950 px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"',
      'className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-slate-950 px-2 text-center text-[11px] font-black uppercase tracking-[0.04em] !text-white md:min-h-[50px] md:px-4 md:text-sm"',
    ],
    [
      'className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-teal-800 px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"',
      'className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-teal-800 px-2 text-center text-[11px] font-black uppercase tracking-[0.04em] !text-white md:min-h-[50px] md:px-4 md:text-sm"',
    ],
    [
      'className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-slate-950"',
      'className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-200 bg-white px-2 text-center text-[11px] font-black uppercase tracking-[0.04em] !text-slate-950 md:min-h-[50px] md:px-4 md:text-sm"',
    ],
  ];

  for (const [from, to] of replacements) {
    source = source.split(from).join(to);
  }

  fs.writeFileSync(preArrivalPagePath, source, "utf8");
  console.log("Applied mobile-first pre-arrival layout compression.");
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
