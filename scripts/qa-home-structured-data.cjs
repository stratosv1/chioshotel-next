const fs = require("node:fs");

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function section(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);

  assert(start >= 0, `Missing section start: ${startMarker}`);
  assert(end > start, `Missing section end: ${endMarker}`);

  return source.slice(start, end);
}

const homeSchema = read("content/schema.ts");
const sharedSchema = read("lib/structured-data.ts");

const homeItemListBuilder = section(
  homeSchema,
  "function buildHomeRoomsItemListSchema",
  "function buildHomeRoomReferencesSchema",
);
const homeAccommodationBuilder = section(
  homeSchema,
  "function buildHomeRoomReferencesSchema",
  "export function buildHomePageSchema",
);
const sharedItemListBuilder = section(
  sharedSchema,
  "export function buildItemListSchema",
  "export function buildFaqSchema",
);
const sharedAccommodationBuilder = section(
  sharedSchema,
  "export function buildAccommodationSchema",
  "export function buildTouristPlaceSchema",
);
const breadcrumbBuilder = section(
  sharedSchema,
  "export function buildBreadcrumbSchema",
  "export function buildWebPageSchema",
);

assert(
  homeItemListBuilder.includes("return buildItemListSchema({"),
  "Homepage ItemList must use the shared localized builder.",
);
assert(
  !homeItemListBuilder.includes('"@type": "ItemList"'),
  "Homepage ItemList must not be hand-built.",
);
assert(
  homeAccommodationBuilder.includes("buildAccommodationSchema({"),
  "Homepage room references must use the shared localized Accommodation builder.",
);
assert(
  !homeAccommodationBuilder.includes('"@type": "Accommodation"'),
  "Homepage Accommodation nodes must not be hand-built.",
);
assert(
  sharedItemListBuilder.includes("inLanguage: getLanguageForPath(input.path)"),
  "Shared ItemList builder must emit inLanguage.",
);
assert(
  sharedAccommodationBuilder.includes("inLanguage: getLanguageForPath(input.path)"),
  "Shared Accommodation builder must emit inLanguage.",
);
assert(
  breadcrumbBuilder.includes("name: labels.homeName") &&
    breadcrumbBuilder.includes("path: labels.homePath") &&
    breadcrumbBuilder.includes("inLanguage: getLanguageForPath(path)"),
  "Breadcrumb builder must use localized home labels, paths and inLanguage.",
);
assert(
  sharedSchema.includes('homeName: "Αρχική"') &&
    sharedSchema.includes('homePath: "/el/"'),
  "Greek homepage breadcrumb must resolve to Αρχική and /el/.",
);

console.log("Homepage structured-data regression checks passed.");
