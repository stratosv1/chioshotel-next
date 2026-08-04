const fs = require('node:fs');

function replaceRequired(source, before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing target: ${label}`);
  return source.replace(before, after);
}

const roomsPath = 'content/rooms-schema.ts';
let rooms = fs.readFileSync(roomsPath, 'utf8');
rooms = replaceRequired(
  rooms,
  'import {\n  buildBreadcrumbSchema,',
  'import { buildSeoImageObjectSchemas, getSeoImageReferences } from "@/lib/seo-image-schema";\nimport {\n  buildBreadcrumbSchema,',
  'rooms image schema import',
);
rooms = replaceRequired(
  rooms,
  'function buildRoomsCollectionPageSchema(data: RoomsCategoryPageData): SchemaObject {\n  const canonicalPath = data.seo.canonicalPath;\n  const language = getLanguageForPath(canonicalPath);',
  'function buildRoomsCollectionPageSchema(data: RoomsCategoryPageData): SchemaObject {\n  const canonicalPath = data.seo.canonicalPath;\n  const language = getLanguageForPath(canonicalPath);\n  const galleryImages = getSeoImageReferences(canonicalPath);',
  'rooms gallery image refs variable',
);
rooms = replaceRequired(
  rooms,
  '    description: data.seo.description,\n    inLanguage: language,',
  '    description: data.seo.description,\n    image: galleryImages.length ? galleryImages : undefined,\n    inLanguage: language,',
  'rooms collection image refs',
);
rooms = replaceRequired(
  rooms,
  '    buildRoomsCollectionPageSchema(safeData),',
  '    ...buildSeoImageObjectSchemas(canonicalPath),\n    buildRoomsCollectionPageSchema(safeData),',
  'rooms image object graph nodes',
);
fs.writeFileSync(roomsPath, rooms);

const detailPath = 'content/room-detail-schema.ts';
let detail = fs.readFileSync(detailPath, 'utf8');
detail = replaceRequired(
  detail,
  'import {\n  buildBreadcrumbSchema,',
  'import {\n  buildSeoImageObjectSchemas,\n  getSeoImageReferences,\n  getSeoImageUrls,\n} from "@/lib/seo-image-schema";\nimport {\n  buildBreadcrumbSchema,',
  'room detail image schema import',
);
detail = replaceRequired(
  detail,
  '  const maxGuests = getMaxGuests(data);\n  const allImages = getRoomDetailImages(data);',
  '  const maxGuests = getMaxGuests(data);\n  const allImages = uniqueItems([\n    ...getRoomDetailImages(data),\n    ...getSeoImageUrls(canonicalPath),\n  ]);',
  'room detail merged image urls',
);
detail = replaceRequired(
  detail,
  'function buildRoomWebPageSchema(data: RoomDetailData): SchemaObject {\n  const canonicalPath = data.seo.canonicalPath;\n  const language = getLanguageForPath(canonicalPath);',
  'function buildRoomWebPageSchema(data: RoomDetailData): SchemaObject {\n  const canonicalPath = data.seo.canonicalPath;\n  const language = getLanguageForPath(canonicalPath);\n  const galleryImages = getSeoImageReferences(canonicalPath);',
  'room web page image refs variable',
);
detail = replaceRequired(
  detail,
  '    description: data.seo.description,\n    inLanguage: language,',
  '    description: data.seo.description,\n    image: galleryImages.length ? galleryImages : undefined,\n    inLanguage: language,',
  'room web page image refs',
);
detail = replaceRequired(
  detail,
  '    buildRoomWebPageSchema(data),',
  '    ...buildSeoImageObjectSchemas(canonicalPath),\n    buildRoomWebPageSchema(data),',
  'room detail image object graph nodes',
);
fs.writeFileSync(detailPath, detail);

console.log('Applied phase two SEO image schema integration.');
