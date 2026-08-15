#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const policy = read("lib/room-finder-cta-routing.ts");
const router = read("components/navigation/RoomFinderCtaRouter.tsx");
const layout = read("app/layout.tsx");

const languages = ["en", "el", "fr", "de", "it", "es", "tr"];
for (const language of languages) {
  assert(
    policy.includes(`${language}: \"/ai-assistant/?lang=${language}\"`),
    `Missing AI Room Finder destination for ${language}`,
  );
}

const discoveryGuards = [
  "room finder",
  "room wizard",
  "find your room",
  "availability",
  "διαθεσιμοτητα",
  "disponibilite",
  "verfugbarkeit",
  "disponibilita",
  "disponibilidad",
  "odani bul",
  "musaitlik",
  "uygunluk",
];
for (const guard of discoveryGuards) {
  assert(policy.includes(`\"${guard}\"`), `Missing discovery CTA guard: ${guard}`);
}

const bookingGuards = [
  "book now",
  "booking",
  "κρατηση",
  "reserver",
  "buchen",
  "prenota",
  "reservar",
  "rezervasyon",
];
for (const guard of bookingGuards) {
  assert(policy.includes(`\"${guard}\"`), `Missing booking CTA exclusion: ${guard}`);
}

assert(router.includes("isRoomFinderDiscoveryLabel"), "CTA router is not using the semantic discovery policy");
assert(router.includes('anchor.dataset.bookingCta === "true"'), "Explicit booking CTA escape hatch is missing");
assert(router.includes("url.origin !== window.location.origin"), "CTA router must not rewrite external links");
assert(router.includes("MutationObserver"), "Dynamic CTA routing coverage is missing");
assert(router.includes("pointerdown"), "Immediate CTA routing fallback is missing");
assert(layout.includes("<RoomFinderCtaRouter />"), "Room Finder CTA router is not mounted globally");
assert(layout.includes("!isPolishPath && !excludeAnalytics"), "CTA router should stay out of Polish and staff surfaces");

const redirects = {
  "app/find-your-room/page.tsx": "en",
  "app/el/vres-to-domatio-sou/page.tsx": "el",
  "app/fr/trouvez-votre-chambre/page.tsx": "fr",
  "app/de/finde-dein-zimmer/page.tsx": "de",
  "app/it/trova-la-tua-camera/page.tsx": "it",
  "app/es/encuentra-tu-habitacion/page.tsx": "es",
  "app/tr/odani-bul/page.tsx": "tr",
};

for (const [file, language] of Object.entries(redirects)) {
  const source = read(file);
  assert(source.includes("permanentRedirect"), `${file} must be a server-side redirect`);
  assert(
    source.includes(`/ai-assistant/?lang=${language}`),
    `${file} does not redirect to the correct AI Room Finder language`,
  );
}

// Transactional label+href objects must never point to the AI Room Finder.
const sourceRoots = ["app", "components", "content", "lib"];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
const bookingWords = [
  "book now",
  "direct booking",
  "κρατηση",
  "réserver",
  "reservation",
  "buchen",
  "buchung",
  "prenota",
  "prenotazione",
  "reservar",
  "reserva directa",
  "rezervasyon",
];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(full);
    return extensions.has(path.extname(entry.name)) ? [full] : [];
  });
}

const ctaObjectPattern = /\{[^{}]{0,500}?label\s*:\s*["'`]([^"'`]+)["'`][^{}]{0,500}?href\s*:\s*["'`]([^"'`]+)["'`][^{}]{0,200}?\}/gis;

for (const root of sourceRoots) {
  for (const file of walk(path.join(process.cwd(), root))) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(ctaObjectPattern)) {
      const label = match[1].toLocaleLowerCase();
      const href = match[2];
      if (!href.includes("/ai-assistant")) continue;
      assert(
        !bookingWords.some((word) => label.includes(word)),
        `Transactional CTA \"${match[1]}\" must not point to AI Room Finder in ${path.relative(process.cwd(), file)}`,
      );
    }
  }
}

console.log("Room Finder CTA routing QA passed: discovery → AI, booking → Beds24 semantics preserved.");
