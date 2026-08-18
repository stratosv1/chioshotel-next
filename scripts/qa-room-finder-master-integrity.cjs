#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relative) {
  return fs.readFileSync(path.join(process.cwd(), relative), "utf8");
}

const chat = read("components/ai/room-finder-chat-ui.tsx");
const hook = read("components/ai/use-room-finder.ts");
const production = read("components/ai/RoomFinderProduction.tsx");
const copy = read("components/ai/room-finder-copy.ts");
const store = read("lib/ai-assistant/conversation-store.ts");
const conversationRoute = read("app/api/ai-assistant/conversation/route.ts");
const summaryRoute = read("app/api/ai-assistant/summary-email/route.ts");
const publicGuard = read("lib/ai-assistant/public-api-guard.ts");

// Tracking must start a fresh staff conversation for a true new search, while preserving the
// same session during ordinary state transitions / language changes.
assert(chat.includes("export function resetRoomFinderTrackingSession"), "tracking session reset API is missing");
assert(chat.includes("export function trackRoomFinderSnapshot"), "structured Room Finder snapshot tracking is missing");
assert(hook.includes("trackRoomFinderSnapshot({"), "booking state is not persisted to the staff conversation snapshot");
assert(hook.includes("resetRoomFinderTrackingSession();"), "true Room Finder reset does not start a fresh tracking session");

// Staff state merge semantics: omitted fields must not clear old values, but explicit empty/null
// values must be able to clear stale booking state after a correction/back/reset.
assert(store.includes('function hasOwn(input: object, key: string)'), "staff snapshot merge does not distinguish omitted fields from explicit clears");
assert(store.includes('current_step = case when ${hasStep}'), "current step still uses lossy coalesce merge semantics");
assert(store.includes('selected_rooms = case when ${hasSelectedRooms}'), "selected rooms cannot be explicitly cleared");
assert(store.includes('breakfast = case when ${hasBreakfast}'), "message-only tracking can still overwrite breakfast state");
assert(!store.includes("jsonb_array_length(excluded.selected_rooms) > 0"), "old selected-room merge semantics are still present");
assert(store.includes('if (value === null || value === undefined || value === "") return null;'), "nullable staff numeric fields can still become zero via Number(null)");

// Public write/email endpoints must not be unbounded browser-callable amplifiers.
assert(publicGuard.includes("checkPublicAiRateLimit"), "shared distributed public AI rate limiter is missing");
for (const [label, source] of [["conversation", conversationRoute], ["summary-email", summaryRoute]]) {
  assert(source.includes("isAllowedAiBrowserOrigin(request)"), `${label} endpoint has no browser-origin guard`);
  assert(source.includes("requestBodyTooLarge(request"), `${label} endpoint has no body-size guard`);
  assert(source.includes("checkPublicAiRateLimit("), `${label} endpoint has no distributed rate limit`);
  assert(source.includes('headers.set("Cache-Control", "no-store")'), `${label} endpoint response is not explicitly no-store`);
}

// Header status must describe the actual system capability, not imply that a receptionist is online.
assert(!copy.includes('online: "Διαθέσιμοι τώρα"'), "Greek header still implies human reception is currently online");
assert(copy.includes('online: "Live διαθεσιμότητα"'), "Greek header does not describe live inventory accurately");

// Language changes are a presentation change: they must preserve any lead details already typed.
// A true New Search is a new customer search and must clear those local lead/transient fields.
const languageEffect = production.match(/useEffect\(\(\) => \{\s*document\.documentElement\.lang = language;[\s\S]*?\}, \[language\]\);/)?.[0] || "";
assert(languageEffect, "could not locate Room Finder language-change effect");
assert(!languageEffect.includes("setContact("), "language change still clears contact fields");
assert(!languageEffect.includes("setPrivacyAccepted("), "language change still clears privacy acceptance");
assert(production.includes("function startNewSearch()"), "Room Finder has no single true-new-search handler for local + booking state");
assert((production.match(/onClick=\{startNewSearch\}/g) || []).length >= 2, "not all New Search controls use the full reset handler");

console.log("Room Finder master integrity QA passed: tracking lifecycle, staff snapshot semantics, public endpoint guards, truthful status and local reset semantics are verified.");
