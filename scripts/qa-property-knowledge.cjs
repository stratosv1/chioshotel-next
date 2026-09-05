#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = process.cwd();
const seed = JSON.parse(fs.readFileSync(path.join(root, "db/seeds/property-knowledge.json"), "utf8"));
const languages = ["en", "el", "fr", "de", "it", "es", "tr"];
const ids = new Set();

assert(seed.length >= 20, "Property knowledge seed is unexpectedly incomplete");

for (const entry of seed) {
  assert(!ids.has(entry.id), `Duplicate knowledge id: ${entry.id}`);
  ids.add(entry.id);
  assert(entry.status === "published", `${entry.id} is not published`);
  assert(entry.scopes.includes("all"), `${entry.id} is missing the all scope`);
  for (const language of languages) {
    const translation = entry.translations?.[language];
    assert(translation?.question?.trim(), `${entry.id} is missing ${language} question`);
    assert(translation?.answer?.trim(), `${entry.id} is missing ${language} answer`);
    assert(Array.isArray(translation?.keywords) && translation.keywords.length > 0, `${entry.id} is missing ${language} keywords`);
  }
}

const serialized = JSON.stringify(seed);
for (const required of [
  "chioshotel@gmail.com",
  "+30 694 447 4226",
  "+30 694 476 4654",
  "WELCOME10",
  "Kontari",
  "Κονταρίου",
  "8 km",
  "8 χλμ",
  "4–5",
  "14 σκαλοπάτια",
  "12€",
  "15€",
  "2€",
]) {
  assert(serialized.includes(required), `Critical owner-confirmed fact is missing: ${required}`);
}

const faqPages = [
  "app/frequently-asked-questions/page.tsx",
  "app/el/syxnes-erotiseis/page.tsx",
  "app/fr/questions-frequentes/page.tsx",
  "app/de/haeufige-fragen/page.tsx",
  "app/it/domande-frequenti/page.tsx",
  "app/es/preguntas-frecuentes/page.tsx",
  "app/tr/sik-sorulan-sorular/page.tsx",
];
for (const page of faqPages) {
  const source = fs.readFileSync(path.join(root, page), "utf8");
  assert(source.includes("getPropertyFaqPageFromKnowledge"), `${page} is not backed by property knowledge`);
  assert(source.includes("PropertyFaqRoutePage"), `${page} does not share its data with FAQ JSON-LD`);
}

const roomFinder = fs.readFileSync(path.join(root, "components/ai/use-room-finder.ts"), "utf8");
assert(roomFinder.includes("/api/ai-assistant/knowledge"), "AI Room Finder does not query property knowledge");

const legacyRedirects = {
  "app/domande-frequenti-voulamandis-house/route.ts": "/it/domande-frequenti/",
  "app/faq/route.ts": "/frequently-asked-questions/",
  "app/fr/faq-fr-voulamandis/route.ts": "/fr/questions-frequentes/",
  "app/de/faq-de-voulamandis/route.ts": "/de/haeufige-fragen/",
  "app/es/voulamandis-house-faq-es/route.ts": "/es/preguntas-frecuentes/",
  "app/tr/faq-tr-voulamandis/route.ts": "/tr/sik-sorulan-sorular/",
};
for (const [file, target] of Object.entries(legacyRedirects)) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  assert(source.includes(target), `${file} does not redirect to the canonical FAQ page`);
}

console.log(`Property knowledge QA passed: ${seed.length} entries × ${languages.length} languages.`);
