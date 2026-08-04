const fs = require('node:fs');

function replaceRequired(source, before, after, label) {
  if (!source.includes(before)) {
    throw new Error(`Missing target: ${label}`);
  }
  return source.replace(before, after);
}

const seoPath = 'lib/seo.ts';
let seo = fs.readFileSync(seoPath, 'utf8');
seo = replaceRequired(
  seo,
  'import { preferredMetadataTitles } from "./seo-title-overrides";\n',
  'import { preferredMetadataTitles } from "./seo-title-overrides";\nimport { resolveSeoDynamicTokens } from "./seo-dynamic-tokens";\n',
  'dynamic token import',
);
seo = replaceRequired(
  seo,
  '  if (pathOverride) {\n    return pathOverride.title;\n  }',
  '  if (pathOverride) {\n    return resolveSeoDynamicTokens(pathOverride.title, path);\n  }',
  'title override token resolution',
);
seo = replaceRequired(
  seo,
  '  return preferredMetadataTitles.get(unbrandedTitle) || unbrandedTitle;\n}',
  '  return resolveSeoDynamicTokens(\n    preferredMetadataTitles.get(unbrandedTitle) || unbrandedTitle,\n    path,\n  );\n}',
  'base title token resolution',
);
seo = replaceRequired(
  seo,
  'function normalizeMetadataDescription(path: string, description: string): string {\n  return (\n    seoSnippetOverrides.get(normalizePath(path))?.description || description.trim()\n  );\n}',
  'function normalizeMetadataDescription(path: string, description: string): string {\n  return resolveSeoDynamicTokens(\n    seoSnippetOverrides.get(normalizePath(path))?.description || description.trim(),\n    path,\n  );\n}',
  'description token resolution',
);
fs.writeFileSync(seoPath, seo);

const roomsCategoryPath = 'components/rooms/RoomsCategoryPage.tsx';
let roomsCategory = fs.readFileSync(roomsCategoryPath, 'utf8');
roomsCategory = replaceRequired(
  roomsCategory,
  'import { TopicBadges } from "@/components/seo/TopicBadges";\n',
  'import { TopicBadges } from "@/components/seo/TopicBadges";\nimport { SearchImageGallery } from "@/components/seo/SearchImageGallery";\n',
  'rooms category gallery import',
);
roomsCategory = replaceRequired(
  roomsCategory,
  '      <TopicBadges locale={language} context="rooms-category" className="border-b border-amber-900/10" />\n\n      <section',
  '      <TopicBadges locale={language} context="rooms-category" className="border-b border-amber-900/10" />\n      <SearchImageGallery path={ownerData.seo.canonicalPath} />\n\n      <section',
  'rooms category gallery placement',
);
fs.writeFileSync(roomsCategoryPath, roomsCategory);

const roomDetailPath = 'components/rooms/RoomDetailPage.tsx';
let roomDetail = fs.readFileSync(roomDetailPath, 'utf8');
roomDetail = replaceRequired(
  roomDetail,
  'import { TopicBadges } from "@/components/seo/TopicBadges";\n',
  'import { TopicBadges } from "@/components/seo/TopicBadges";\nimport { SearchImageGallery } from "@/components/seo/SearchImageGallery";\n',
  'room detail gallery import',
);
roomDetail = replaceRequired(
  roomDetail,
  '      <TopicBadges locale={language} context="room-detail" className="border-b border-amber-900/10" />\n\n      <section',
  '      <TopicBadges locale={language} context="room-detail" className="border-b border-amber-900/10" />\n      <SearchImageGallery path={data.seo.canonicalPath} />\n\n      <section',
  'room detail gallery placement',
);
fs.writeFileSync(roomDetailPath, roomDetail);

const overridePath = 'lib/seo-snippet-overrides.ts';
let overrides = fs.readFileSync(overridePath, 'utf8');
overrides = replaceRequired(
  overrides,
  '      title: "Προσφορές διαμονής στη Χίο | Κωδικοί άμεσης κράτησης",',
  '      title: "Προσφορές διαμονής στη Χίο {{currentYear}} | Άμεση κράτηση",',
  'dynamic year for Greek deals title',
);
fs.writeFileSync(overridePath, overrides);

console.log('Applied phase one SEO image and dynamic metadata integration.');
