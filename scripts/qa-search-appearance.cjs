const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function detectRasterFormat(filePath) {
  const bytes = fs.readFileSync(filePath);

  if (bytes.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) {
    return "png";
  }

  if (bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return "jpg";
  }

  if (
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "webp";
  }

  return "unknown";
}

for (const filePath of walk(path.join(root, "public", "images"))) {
  const extension = path.extname(filePath).slice(1).toLowerCase();
  const expectedFormat = extension === "jpeg" ? "jpg" : extension;

  if (!["jpg", "png", "webp"].includes(expectedFormat)) continue;

  const actualFormat = detectRasterFormat(filePath);
  assert(
    actualFormat === expectedFormat,
    `${path.relative(root, filePath)} has a .${extension} extension but contains ${actualFormat} data.`,
  );
}

const rootHome = read("app/page.tsx");
const localizedHome = read("app/[locale]/page.tsx");
const homeContent = read("content/home.ts");
const contactContent = read("content/contact.ts");
const contactSchema = read("content/contact-schema.ts");
const englishContactPage = read(
  "app/voulamandis-house-contact-us-form-fill-in-the-form/page.tsx",
);
const localizedCatchAll = read("app/[locale]/[...slug]/page.tsx");
const seo = read("lib/seo.ts");
const polishSeo = read("lib/seo-pl.ts");
const structuredData = read("lib/structured-data.ts");
const footer = read("components/VoulamandisFooterTailwind.tsx");
const navigation = read("lib/site-navigation.ts");
const agentGuide = read("content/agent-room-guide.ts");
const sitemap = read("app/sitemap.ts");

assert(
  rootHome.includes("buildHomepageMetadata(homePageData)"),
  "The English homepage must use the shared homepage metadata builder.",
);
assert(
  localizedHome.includes("buildHomepageMetadata(data)"),
  "Localized homepages must use the shared homepage metadata builder.",
);
assert(
  !rootHome.includes("languages: {") && !rootHome.includes("openGraph: {"),
  "The English homepage must not carry a second hardcoded metadata implementation.",
);
assert(
  homeContent.includes("ogImage: siteImageAssets.homepageHero.src") &&
    homeContent.includes("image: siteImageAssets.homepageHero.src"),
  "Homepage visible and preferred images must resolve from the same asset record.",
);
assert(
  contactContent.includes("siteImageAssets.propertyExterior.src") &&
    englishContactPage.includes("imageWidth: contactPageEn.seo.ogImageWidth") &&
    localizedCatchAll.includes("imageWidth: contactData.seo.ogImageWidth") &&
    contactSchema.includes("width: data.seo.ogImageWidth"),
  "Every Contact locale must reuse the same verified image asset and dimensions.",
);
assert(
  seo.includes("imageWidth?: number") &&
    !seo.includes("width: 1200,\n          height: 675"),
  "Shared metadata must not invent dimensions for arbitrary images.",
);
assert(
  polishSeo.includes("imageWidth?: number") &&
    !polishSeo.includes("width: 1200, height: 675"),
  "Polish metadata must not invent dimensions for arbitrary images.",
);
assert(
  !structuredData.includes("input.width || 1200") &&
    !structuredData.includes("input.height || 675"),
  "Structured data must not invent image dimensions.",
);
assert(
  structuredData.includes("siteImageAssets.organizationLogo.src"),
  "Organization schema must use the shared logo asset.",
);
assert(
  navigation.includes('contact: "contact"') &&
    navigation.includes("findPublishedLocalizedPath"),
  "Localized navigation must resolve Contact through the canonical route map.",
);
assert(
  footer.includes('getSiteNavigationPath("contact", language)') &&
    !footer.includes("const contactPaths") &&
    !footer.includes("const roomsPaths"),
  "The active footer must not duplicate localized route tables.",
);
assert(
  agentGuide.includes("index: false") && agentGuide.includes("follow: true"),
  "The private B2B guide must remain crawlable for links but excluded from search.",
);
assert(
  !sitemap.includes("agentRoomGuidePaths") &&
    !sitemap.includes("agentRoomRoutes"),
  "Noindex B2B routes must not be advertised in the XML sitemap.",
);

if (failures.length > 0) {
  console.error("Search appearance audit failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Search appearance audit passed.");
