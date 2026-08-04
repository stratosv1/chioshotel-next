const fs = require('node:fs');

function replaceRequired(source, before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing target: ${label}`);
  return source.replace(before, after);
}

const accommodationPagePath = 'components/landing/GreekAccommodationPage.tsx';
let accommodationPage = fs.readFileSync(accommodationPagePath, 'utf8');
accommodationPage = replaceRequired(
  accommodationPage,
  'import Image from "next/image";\n',
  'import Image from "next/image";\nimport { SearchImageGallery } from "@/components/seo/SearchImageGallery";\n',
  'accommodation gallery import',
);
accommodationPage = replaceRequired(
  accommodationPage,
  '      </section>\n\n      <section\n        className="px-4 py-11 sm:px-6 sm:py-14 lg:px-8 lg:py-24"\n        aria-labelledby="diamoni-intro-title"',
  '      </section>\n\n      <SearchImageGallery path={data.seo.canonicalPath} />\n\n      <section\n        className="px-4 py-11 sm:px-6 sm:py-14 lg:px-8 lg:py-24"\n        aria-labelledby="diamoni-intro-title"',
  'accommodation gallery placement',
);
fs.writeFileSync(accommodationPagePath, accommodationPage);

const kamposPagePath = 'components/chios/GreekKamposLandingPageElegant.tsx';
let kamposPage = fs.readFileSync(kamposPagePath, 'utf8');
kamposPage = replaceRequired(
  kamposPage,
  'import Image from "next/image";\n',
  'import Image from "next/image";\nimport { SearchImageGallery } from "@/components/seo/SearchImageGallery";\n',
  'kampos gallery import',
);
kamposPage = replaceRequired(
  kamposPage,
  '      </section>\n\n      <section className={`${shell} py-9 sm:py-16`} aria-labelledby="why-kampos">',
  '      </section>\n\n      <SearchImageGallery path={data.seo.canonicalPath} />\n\n      <section className={`${shell} py-9 sm:py-16`} aria-labelledby="why-kampos">',
  'kampos gallery placement',
);
fs.writeFileSync(kamposPagePath, kamposPage);

const diamoniSchemaPath = 'content/diamoni-sti-xio-schema.ts';
let diamoniSchema = fs.readFileSync(diamoniSchemaPath, 'utf8');
diamoniSchema = replaceRequired(
  diamoniSchema,
  'import { absoluteUrl, getCanonicalUrl, siteUrl } from "@/lib/seo";\n',
  'import { absoluteUrl, getCanonicalUrl, siteUrl } from "@/lib/seo";\nimport { buildSeoImageObjectSchemas, getSeoImageReferences } from "@/lib/seo-image-schema";\n',
  'diamoni image schema import',
);
diamoniSchema = replaceRequired(
  diamoniSchema,
  'function buildCollectionPage(data: ChiosAccommodationPageData): SchemaObject {\n  const path = data.seo.canonicalPath;\n\n  return {',
  'function buildCollectionPage(data: ChiosAccommodationPageData): SchemaObject {\n  const path = data.seo.canonicalPath;\n  const galleryImages = getSeoImageReferences(path);\n\n  return {',
  'diamoni gallery refs variable',
);
diamoniSchema = replaceRequired(
  diamoniSchema,
  '    description: data.seo.description,\n    inLanguage: "el",',
  '    description: data.seo.description,\n    image: galleryImages.length ? galleryImages : undefined,\n    inLanguage: "el",',
  'diamoni collection image refs',
);
diamoniSchema = replaceRequired(
  diamoniSchema,
  '    buildCollectionPage(data),',
  '    ...buildSeoImageObjectSchemas(path),\n    buildCollectionPage(data),',
  'diamoni image object graph nodes',
);
fs.writeFileSync(diamoniSchemaPath, diamoniSchema);

const kamposSchemaPath = 'content/kampos-chios-schema.ts';
let kamposSchema = fs.readFileSync(kamposSchemaPath, 'utf8');
kamposSchema = replaceRequired(
  kamposSchema,
  'import type { KamposChiosPageData } from "@/content/kampos-chios";\n',
  'import type { KamposChiosPageData } from "@/content/kampos-chios";\nimport { buildSeoImageObjectSchemas, getSeoImageReferences } from "@/lib/seo-image-schema";\n',
  'kampos image schema import',
);
kamposSchema = replaceRequired(
  kamposSchema,
  'const roomItems = [',
  'function buildKamposWebPageSchema(data: KamposChiosPageData): SchemaObject {\n  const path = data.seo.canonicalPath;\n  const galleryImages = getSeoImageReferences(path);\n  return {\n    ...buildWebPageSchema({\n      path,\n      title: pageTitle,\n      description: pageDescription,\n      image: data.seo.ogImage,\n      breadcrumbs: [\n        { name: "Χίος", path: "/el/chios/" },\n        { name: "Διαμονή στον Κάμπο της Χίου", path },\n      ],\n    }),\n    image: galleryImages.length ? galleryImages : undefined,\n  };\n}\n\nconst roomItems = [',
  'kampos webpage helper',
);
kamposSchema = replaceRequired(
  kamposSchema,
  '    buildWebPageSchema({\n      path,\n      title: pageTitle,\n      description: pageDescription,\n      image: data.seo.ogImage,\n      breadcrumbs: [\n        { name: "Χίος", path: "/el/chios/" },\n        { name: "Διαμονή στον Κάμπο της Χίου", path },\n      ],\n    }),',
  '    ...buildSeoImageObjectSchemas(path),\n    buildKamposWebPageSchema(data),',
  'kampos web page and image graph nodes',
);
fs.writeFileSync(kamposSchemaPath, kamposSchema);

console.log('Applied destination landing image integration.');
