#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

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
  "step-free access",
  "χωρίς σκαλοπάτια",
  "14 σκαλοπάτια",
  "12€",
  "15€",
  "2€",
]) {
  assert(serialized.includes(required), `Critical owner-confirmed fact is missing: ${required}`);
}

assert(!serialized.includes("4–5"), "Superseded 4–5-step claim is still present");

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
assert(roomFinder.includes('action.type === "answer_property_question"'), "AI Room Finder does not render grounded property knowledge actions");
assert(!roomFinder.includes("propertyKnowledgeAnswer"), "AI Room Finder still uses the old no-change knowledge fallback");

const intent = fs.readFileSync(path.join(root, "lib/ai-assistant/room-finder-intent.ts"), "utf8");
assert(intent.includes("getPublishedPropertyKnowledge"), "OpenAI interpreter is not supplied with the complete verified property corpus");
assert(intent.includes("verifiedPropertyKnowledge"), "OpenAI interpreter prompt is missing verified property knowledge");
assert(intent.includes("knowledgeIds"), "OpenAI interpreter cannot select exact supporting knowledge records");
assert(intent.includes("request_live_availability"), "dynamic price and availability questions are not routed to live inventory");

const propertyKnowledge = fs.readFileSync(path.join(root, "lib/property-knowledge.ts"), "utf8");
assert(propertyKnowledge.includes("isDynamicRoomPriceKnowledgeQuery"), "dynamic room-price queries are not guarded from static FAQ answers");
assert(propertyKnowledge.includes("if (requiresLiveRoomInventory(input.query)) return []"), "static knowledge search can still answer a live price or availability query");

const transpiledPropertyKnowledge = ts.transpileModule(propertyKnowledge, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    esModuleInterop: true,
  },
}).outputText;
const propertyKnowledgeModule = { exports: {} };
const propertyKnowledgeRequire = (id) => {
  if (id === "next/cache") return { unstable_cache: (fn) => fn };
  if (id === "@neondatabase/serverless") return { neon: () => null };
  if (id === "@/content/property-faq") {
    return {
      buildPropertyFaqPageFromItems: () => null,
      buildRelatedLink: () => undefined,
      getPropertyFaqItems: () => [],
      getPropertyFaqPage: () => null,
    };
  }
  if (id === "@/lib/languages") return {};
  return require(id);
};
new Function("exports", "module", "require", transpiledPropertyKnowledge)(
  propertyKnowledgeModule.exports,
  propertyKnowledgeModule,
  propertyKnowledgeRequire,
);
const { requiresLiveRoomInventory } = propertyKnowledgeModule.exports;
for (const query of [
  "Υπάρχει διαθεσιμότητα;",
  "Do you have availability?",
  "Gibt es Verfügbarkeit?",
  "Avez-vous des disponibilités ?",
  "C'è disponibilità?",
  "¿Hay disponibilidad?",
  "Müsaitlik var mı?",
  "Πόσο κοστίζει ένα δωμάτιο ανά βραδιά;",
]) {
  assert(requiresLiveRoomInventory(query), `Live inventory query was not guarded: ${query}`);
}
assert(!requiresLiveRoomInventory("Πόσο κοστίζει το πρωινό;"), "breakfast price was incorrectly routed to room inventory");
assert(!requiresLiveRoomInventory("Is parking available?"), "static parking information was incorrectly routed to room inventory");

const contextSource = fs.readFileSync(path.join(root, "content/property-faq-context.ts"), "utf8");
for (const requiredId of [
  "first-floor-rooms",
  "ground-floor-rooms",
  "apartments-8-10",
  "direct-booking",
  "payment-confirmation",
  "distances-transfer",
  "beach-nearby-walk",
]) {
  assert(ids.has(requiredId), `Contextual FAQ references missing owner-confirmed entry: ${requiredId}`);
  assert(contextSource.includes(`"${requiredId}"`), `Contextual FAQ does not expose owner-confirmed entry: ${requiredId}`);
}

const roomCatalogRoute = fs.readFileSync(path.join(root, "app/api/ai-assistant/room-catalog/route.ts"), "utf8");
assert(roomCatalogRoute.includes("livePricingRequired: true"), "room catalog does not explicitly require live pricing");
assert(!roomCatalogRoute.includes("100 + index * 10"), "room catalog still creates synthetic prices");

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
