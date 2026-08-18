#!/usr/bin/env node

const BASE_URL = String(process.env.AI_QA_BASE_URL || "https://chioshotel.gr").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.AI_QA_TIMEOUT_MS || 30000);
const ALLOWED_ACTIONS = new Set([
  "set_stay_dates",
  "set_room_count",
  "set_guest_count",
  "set_preferences",
  "restart_search",
  "ask_clarification",
  "no_change",
]);
const ALLOWED_PREFERENCES = new Set([
  "ground_floor",
  "no_stairs",
  "kitchen",
  "balcony",
  "garden",
  "budget",
  "family",
]);

const TEXT_DATE = {
  el: "10 Οκτωβρίου",
  en: "10 October",
  de: "10 Oktober",
  fr: "10 octobre",
  it: "10 ottobre",
  es: "10 octubre",
  tr: "10 Ekim",
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function interpret(message, context) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const started = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/api/ai-assistant/interpret`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null);
    assert(response.ok, `HTTP ${response.status}: ${payload?.code || payload?.error || "unknown error"}`);
    assert(payload?.command?.actions?.length, "missing interpreter actions");
    assert(
      payload.command.actions.every(action => ALLOWED_ACTIONS.has(action?.type)),
      `unsupported action returned: ${payload.command.actions.map(action => action?.type).join(", ")}`,
    );
    for (const action of payload.command.actions) {
      if (action?.type !== "set_preferences") continue;
      assert(Array.isArray(action.preferences), "set_preferences did not return an array");
      assert(action.preferences.every(value => ALLOWED_PREFERENCES.has(value)), `unsupported preference returned: ${action.preferences.join(", ")}`);
    }
    assert(["ai", "deterministic", "deterministic-rescue", undefined].includes(payload.source), `unknown interpreter source: ${payload.source}`);
    return { command: payload.command, source: payload.source, fallback: Boolean(payload.fallback), durationMs: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

function fact(actions, key) {
  return [...actions].reverse().find(action => action?.[key] != null)?.[key];
}

function roomGuest(actions, room) {
  return [...actions].reverse().find(action => action?.type === "set_guest_count" && Number(action?.guestRoom) === room)?.guests;
}

function preferences(actions) {
  return [...actions].reverse().find(action => action?.type === "set_preferences")?.preferences || [];
}

function clarifications(actions) {
  return actions.filter(action => action?.type === "ask_clarification");
}

function assertNoClarification(actions, label) {
  assert(clarifications(actions).length === 0, `${label}: clear input unexpectedly requested clarification`);
}

async function exactDateJourney(language) {
  const arrival = await interpret("10/10", { language, currentStep: "checkin" });
  assert(fact(arrival.command.actions, "checkin") === "2026-10-10", `${language}: 10/10 was not resolved as check-in`);
  assertNoClarification(arrival.command.actions, `${language} numeric check-in`);

  const namedArrival = await interpret(TEXT_DATE[language], { language, currentStep: "checkin" });
  assert(fact(namedArrival.command.actions, "checkin") === "2026-10-10", `${language}: named-month date was not resolved as check-in`);
  assertNoClarification(namedArrival.command.actions, `${language} named check-in`);

  const departure = await interpret("12/10", { language, currentStep: "checkout", checkin: "2026-10-10" });
  assert(fact(departure.command.actions, "checkout") === "2026-10-12", `${language}: 12/10 was not resolved as check-out`);
  assertNoClarification(departure.command.actions, `${language} numeric check-out`);

  return { arrival, namedArrival, departure };
}

async function productionScreenshotRegression() {
  const message = "Θέλω 10–13 Σεπτεμβρίου για 2 άτομα, ένα δωμάτιο, κατά προτίμηση ισόγειο χωρίς σκάλες";
  const result = await interpret(message, { language: "el", currentStep: "checkin", preferences: [] });
  const actions = result.command.actions;
  assert(fact(actions, "checkin") === "2026-09-10", "production screenshot regression lost check-in");
  assert(fact(actions, "checkout") === "2026-09-13", "production screenshot regression lost check-out");
  assert(Number(fact(actions, "roomCount")) === 1, "production screenshot regression lost roomCount=1");
  assert(Number(fact(actions, "totalGuests")) === 2, "production screenshot regression lost totalGuests=2");
  const prefs = preferences(actions);
  assert(prefs.includes("ground_floor") && prefs.includes("no_stairs"), "production screenshot regression lost room preferences");
  assertNoClarification(actions, "production screenshot regression");
  assert(result.source === "deterministic", `production screenshot should use deterministic fast path, got ${result.source || "legacy/unknown"}`);
  return result;
}

async function familyPartyRegression() {
  const result = await interpret("10-13 Σεπτεμβρίου, 1 δωμάτιο, 2 ενήλικες και 1 παιδί", { language: "el", currentStep: "checkin" });
  assert(Number(fact(result.command.actions, "totalGuests")) === 3, "family party did not sum 2 adults + 1 child to 3 guests");
  assert(result.source === "deterministic", `family party should use deterministic fast path, got ${result.source || "legacy/unknown"}`);
  return result;
}

async function nightsRegression() {
  const result = await interpret("10 Σεπτεμβρίου, ένα δωμάτιο, δύο άτομα, για 3 νύχτες", { language: "el", currentStep: "checkin" });
  assert(fact(result.command.actions, "checkin") === "2026-09-10", "nights regression lost check-in");
  assert(Number(fact(result.command.actions, "nights")) === 3, "nights regression did not extract nights=3");
  assert(Number(fact(result.command.actions, "roomCount")) === 1, "nights regression lost room count");
  assert(Number(fact(result.command.actions, "totalGuests")) === 2, "nights regression lost guest count");
  assert(result.source === "deterministic", `nights regression should use deterministic fast path, got ${result.source || "legacy/unknown"}`);
  return result;
}

async function preferenceRegression() {
  const result = await interpret("Θέλω ισόγειο χωρίς σκάλες και αν γίνεται κήπο", {
    language: "el",
    currentStep: "selecting",
    checkin: "2026-10-10",
    checkout: "2026-10-12",
    roomCount: 1,
    totalGuests: 2,
    guestGroups: [2],
    preferences: [],
  });
  const prefs = preferences(result.command.actions);
  assert(prefs.includes("ground_floor") && prefs.includes("no_stairs") && prefs.includes("garden"), "preference update did not return all explicit soft preferences");
  return result;
}

async function preferenceRemovalRegression() {
  const result = await interpret("δεν με νοιάζει πια το οικονομικό", {
    language: "el",
    currentStep: "selecting",
    checkin: "2026-10-10",
    checkout: "2026-10-12",
    roomCount: 1,
    totalGuests: 2,
    guestGroups: [2],
    preferences: ["budget"],
  });
  assert(result.command.actions.some(action => action.type === "set_preferences" && Array.isArray(action.preferences) && action.preferences.length === 0), "preference removal did not clear budget preference");
  return result;
}

async function multiRoomTotalRegression() {
  const result = await interpret("Θέλω 2 δωμάτια για 4 άτομα", { language: "el", currentStep: "rooms" });
  const actions = result.command.actions;
  assert(Number(fact(actions, "roomCount")) === 2, "multi-room total did not extract roomCount=2");
  assert(Number(fact(actions, "totalGuests")) === 4, "multi-room total did not extract totalGuests=4");
  assert(roomGuest(actions, 1) == null && roomGuest(actions, 2) == null, "multi-room total invented a room allocation");
  assertNoClarification(actions, "multi-room total");
  return result;
}

async function explicitRoomAllocationRegression() {
  const result = await interpret("2 άτομα στο κάθε δωμάτιο", {
    language: "el",
    currentStep: "guests",
    roomCount: 2,
    totalGuests: 4,
    guestGroups: [],
    currentRoom: 1,
  });
  const actions = result.command.actions;
  assert(Number(roomGuest(actions, 1)) === 2, "explicit allocation did not set room 1 to 2 guests");
  assert(Number(roomGuest(actions, 2)) === 2, "explicit allocation did not set room 2 to 2 guests");
  assertNoClarification(actions, "explicit two-room allocation");
  return result;
}

async function downstreamCorrectionRegression() {
  const result = await interpret("τελικά 3 άτομα", {
    language: "el",
    currentStep: "selecting",
    checkin: "2026-10-10",
    checkout: "2026-10-12",
    roomCount: 1,
    totalGuests: 2,
    guestGroups: [2],
  });
  assert(Number(fact(result.command.actions, "totalGuests")) === 3, "downstream correction did not extract totalGuests=3");
  assertNoClarification(result.command.actions, "downstream guest correction");
  return result;
}

async function downstreamBareDateClarificationRegression() {
  const result = await interpret("11/10", {
    language: "el",
    currentStep: "selecting",
    checkin: "2026-10-10",
    checkout: "2026-10-12",
    roomCount: 1,
    totalGuests: 2,
    guestGroups: [2],
  });
  const asks = clarifications(result.command.actions);
  assert(asks.length === 1, "bare downstream date did not request exactly one clarification");
  assert(fact(result.command.actions, "checkin") == null && fact(result.command.actions, "checkout") == null, "bare downstream date overwrote an existing date before clarification");
  assert(asks[0]?.missingFields?.includes("checkin") && asks[0]?.missingFields?.includes("checkout"), "bare downstream date clarification is not tied to both date fields");
  return result;
}

async function greekSpecificClarificationRegression() {
  const result = await interpret("Αρχές Οκτωβρίου", { language: "el", currentStep: "checkin" });
  const asks = clarifications(result.command.actions);
  assert(asks.length === 1, "ambiguous Greek date did not produce exactly one clarification");
  const query = String(asks[0]?.query || "");
  assert(asks[0]?.missingFields?.includes("checkin"), "ambiguous Greek date clarification is not tied to check-in");
  assert(/οκτωβρ|check-?in|ημερομην/i.test(query), `clarification is not specific about the ambiguous date: ${query}`);
  return result;
}

async function main() {
  const languages = ["el", "en", "de", "fr", "it", "es", "tr"];
  console.log(`Room Finder interpreter API QA target: ${BASE_URL}`);

  for (const language of languages) {
    const timing = await exactDateJourney(language);
    console.log(`✓ ${language} dates (${timing.arrival.durationMs}ms / ${timing.namedArrival.durationMs}ms / ${timing.departure.durationMs}ms)`);
  }

  const screenshot = await productionScreenshotRegression();
  console.log(`✓ exact mobile production regression (${screenshot.durationMs}ms, ${screenshot.source})`);
  const family = await familyPartyRegression();
  console.log(`✓ adult + child party (${family.durationMs}ms, ${family.source})`);
  const nights = await nightsRegression();
  console.log(`✓ named date + nights (${nights.durationMs}ms, ${nights.source})`);
  const pref = await preferenceRegression();
  console.log(`✓ soft preferences (${pref.durationMs}ms, ${pref.source})`);
  const prefRemoval = await preferenceRemovalRegression();
  console.log(`✓ preference removal (${prefRemoval.durationMs}ms, ${prefRemoval.source})`);
  const multiRoom = await multiRoomTotalRegression();
  console.log(`✓ multi-room total without invented allocation (${multiRoom.durationMs}ms)`);
  const allocation = await explicitRoomAllocationRegression();
  console.log(`✓ explicit per-room allocation (${allocation.durationMs}ms)`);
  const downstream = await downstreamCorrectionRegression();
  console.log(`✓ downstream correction (${downstream.durationMs}ms, ${downstream.source})`);
  const downstreamDate = await downstreamBareDateClarificationRegression();
  console.log(`✓ downstream bare-date clarification (${downstreamDate.durationMs}ms)`);
  const clarification = await greekSpecificClarificationRegression();
  console.log(`✓ ambiguous-date clarification (${clarification.durationMs}ms, ${clarification.source})`);
}

main().catch(error => {
  console.error(`✗ Room Finder interpreter API QA: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
