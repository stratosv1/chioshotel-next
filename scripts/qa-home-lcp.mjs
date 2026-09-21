import assert from "node:assert/strict";

// Run against a production build: node scripts/qa-home-lcp.mjs http://localhost:3000
// This validates the server-rendered loading contract, not the measured LCP.
const baseUrl = new URL(process.argv[2] || "http://localhost:3000");
const homePaths = ["/", "/el/", "/fr/", "/de/", "/it/", "/es/", "/tr/"];
const variants = [
  { media: "(max-width: 767px)", quality: "50" },
  { media: "(min-width: 768px)", quality: "62" },
];

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, name, value]) => [
      name.toLowerCase(),
      value.replaceAll("&amp;", "&"),
    ]),
  );
}

async function getHtml(path) {
  const response = await fetch(new URL(path, baseUrl), {
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200, `${path}: HTTP status`);
  return response.text();
}

for (const path of homePaths) {
  const html = await getHtml(path);
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  const hero = html.match(/<section\b[^>]*id="home-hero"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
  assert.ok(head, `${path}: server-rendered head`);
  assert.ok(hero, `${path}: server-rendered hero`);

  const imageTags = hero.match(/<img\b[^>]*>/gi) || [];
  assert.equal(imageTags.length, 1, `${path}: one hero image`);
  const image = attributes(imageTags[0]);
  assert.equal(image.loading, "eager", `${path}: no lazy LCP`);
  assert.equal(image.fetchpriority, "high", `${path}: high-priority LCP`);
  assert.ok(image.alt, `${path}: localized alt preserved`);
  assert.ok(Number(image.width) > 0 && Number(image.height) > 0, `${path}: dimensions preserved`);

  const sources = (hero.match(/<source\b[^>]*>/gi) || []).map(attributes);
  const preloads = (head.match(/<link\b[^>]*>/gi) || [])
    .map(attributes)
    .filter((link) => link.rel === "preload" && link.as === "image");
  const heroPreloads = preloads.filter((link) =>
    sources.some((source) => source.srcset === link.imagesrcset),
  );
  assert.equal(heroPreloads.length, 2, `${path}: both responsive hints in initial head`);

  for (const { media, quality } of variants) {
    const source = sources.find((item) => item.media === media);
    const preload = heroPreloads.find((item) => item.media === media);
    assert.ok(source && preload, `${path}: matching ${media} source and preload`);
    assert.equal(preload.imagesrcset, source.srcset, `${path}: identical responsive candidates`);
    assert.equal(preload.imagesizes, "100vw", `${path}: preload sizes`);
    assert.equal(source.sizes, preload.imagesizes, `${path}: matching source sizes`);
    assert.equal(preload.fetchpriority, "high", `${path}: preload priority`);
    for (const candidate of source.srcset.split(", ")) {
      const [url] = candidate.split(" ");
      assert.equal(new URL(url, baseUrl).searchParams.get("q"), quality, `${path}: allowed image quality`);
    }
  }

  assert.equal(image.srcset, sources[1].srcset, `${path}: responsive desktop fallback`);
  const canonical = (head.match(/<link\b[^>]*>/gi) || [])
    .map(attributes).find((link) => link.rel === "canonical");
  assert.equal(canonical?.href, `https://chioshotel.gr${path}`, `${path}: canonical preserved`);
  assert.match(html, /application\/ld\+json/, `${path}: structured data preserved`);
  console.log(`PASS ${path}: matching responsive preloads, eager hero, quality and SEO checks`);
}

// Resource hints must stay scoped to homepages, not leak from the root layout.
const otherPage = await getHtml("/chios-rooms/");
assert.ok(!otherPage.includes('id="home-hero"'), "Room page uses its own hero");
const otherHead = otherPage.split("</head>")[0];
assert.ok(!/imagesrcset="[^"]*%2Fhero%2Fvoulamandis-house/i.test(otherHead), "No homepage hero preload on room page");
console.log("PASS /chios-rooms/: no homepage preload leakage");
