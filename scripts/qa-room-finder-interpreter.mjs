#!/usr/bin/env node

const BASE_URL = String(process.env.AI_QA_BASE_URL || "https://chioshotel.gr").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.AI_QA_TIMEOUT_MS || 30000);
const ALLOWED_ACTIONS = new Set([
  "set_stay_dates",
  "set_room_count",
  "set_guest_count",
  "restart_search",
  "ask_clarification",
  "no_change",
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
    assert(response.ok, `HTTP ${response.status}: ${payload?.error || "unknown error"}`);
    assert(payload?.command?.actions?.length, "missing interpreter actions");
    assert(
      payload.command.actions.every((action) => ALLOWED_ACTIONS.has(action?.type)),
      `unsupported action returned: ${payload.command.actions.map((action) => action?.type).join(", ")}`,
    );
    assert(
      payload.command.actions.every((action) => !("preferences" in action)),
      "Room Finder action unexpectedly contains preferences",
    );
    return { command: payload.command, durationMs: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

function fact(actions, key) {
  return [...actions].reverse().find((action) => action?.[key] != null)?.[key];
}

function roomGuest(actions, room) {
  return [...actions]
    .reverse()
    .find((action) => action?.type === "set_guest_count" && Number(action?.guestRoom) === room)?.guests;
}

function clarifications(actions) {
  return actions.filter((action) => action?.type === "ask_clarification");
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

  const departure = await interpret("12/10", {
    language,
    currentStep: "checkout",
    checkin: "2026-10-10",
  });
  assert(fact(departure.command.actions, "checkout") === "2026-10-12", `${language}: 12/10 was not resolved as check-out`);
  assertNoClarification(departure.command.actions, `${language} numeric check-out`);

  return { arrivalMs: arrival.durationMs, namedArrivalMs: namedArrival.durationMs, departureMs: departure.durationMs };
}

async function greekPreferenceRemovalRegression() {
  const result = await interpret("Θέλω ένα δωμάτιο ,2ατομα , με κουζίνα", {
    language: "el",
    currentStep: "checkin",
  });
  const actions = result.command.actions;
  assert(Number(fact(actions, "roomCount")) === 1, "Greek input did not extract roomCount=1");
  assert(Number(fact(actions, "totalGuests")) === 2, "Greek input did not extract totalGuests=2 from 2ατομα");
  assertNoClarification(actions, "Greek input with removed preference");
  return { durationMs: result.durationMs };
}

async function greekFullSentenceRegression() {
  const result = await interpret("Θέλω ένα δωμάτιο για 2ατομα στον όροφο, άφιξη 10/10 αναχώρηση 12/10", {
    language: "el",
    currentStep: "checkin",
  });
  const actions = result.command.actions;
  assert(fact(actions, "checkin") === "2026-10-10", "Full Greek input did not extract check-in");
  assert(fact(actions, "checkout") === "2026-10-12", "Full Greek input did not extract check-out");
  assert(Number(fact(actions, "roomCount")) === 1, "Full Greek input did not extract roomCount=1");
  assert(Number(fact(actions, "totalGuests")) === 2, "Full Greek input did not extract totalGuests=2");
  assertNoClarification(actions, "Full Greek input");
  return { durationMs: result.durationMs };
}

async function greekShortFollowupRegression() {
  const result = await interpret("2 βράδια 3 άτομα", {
    language: "el",
    currentStep: "checkout",
    checkin: "2026-10-10",
  });
  const actions = result.command.actions;
  assert(Number(fact(actions, "nights")) === 2, "Greek follow-up did not extract nights=2");
  assert(Number(fact(actions, "totalGuests")) === 3, "Greek follow-up did not extract totalGuests=3");
  assertNoClarification(actions, "Greek nights/guests follow-up");
  return { durationMs: result.durationMs };
}

async function multiRoomTotalRegression() {
  const result = await interpret("Θέλω 2 δωμάτια για 4 άτομα", {
    language: "el",
    currentStep: "rooms",
  });
  const actions = result.command.actions;
  assert(Number(fact(actions, "roomCount")) === 2, "Multi-room total did not extract roomCount=2");
  assert(Number(fact(actions, "totalGuests")) === 4, "Multi-room total did not extract totalGuests=4");
  assert(roomGuest(actions, 1) == null && roomGuest(actions, 2) == null, "Multi-room total invented a room allocation");
  assertNoClarification(actions, "Multi-room total");
  return { durationMs: result.durationMs };
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
  assert(Number(roomGuest(actions, 1)) === 2, "Explicit allocation did not set room 1 to 2 guests");
  assert(Number(roomGuest(actions, 2)) === 2, "Explicit allocation did not set room 2 to 2 guests");
  assertNoClarification(actions, "Explicit two-room allocation");
  return { durationMs: result.durationMs };
}

async function specificRoomFollowupRegression() {
  const result = await interpret("2", {
    language: "el",
    currentStep: "guests",
    roomCount: 2,
    totalGuests: 4,
    guestGroups: [2],
    currentRoom: 2,
  });
  const actions = result.command.actions;
  assert(Number(roomGuest(actions, 2)) === 2, "Standalone guest count was not tied to currentRoom=2");
  assertNoClarification(actions, "Specific-room guest follow-up");
  return { durationMs: result.durationMs };
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
  const actions = result.command.actions;
  assert(Number(fact(actions, "totalGuests")) === 3, "Downstream correction did not extract totalGuests=3");
  assertNoClarification(actions, "Downstream guest correction");
  return { durationMs: result.durationMs };
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
  const actions = result.command.actions;
  const asks = clarifications(actions);
  assert(asks.length === 1, "Bare downstream date did not request exactly one clarification");
  assert(fact(actions, "checkin") == null && fact(actions, "checkout") == null, "Bare downstream date overwrote an existing date before clarification");
  assert(asks[0]?.missingFields?.includes("checkin") && asks[0]?.missingFields?.includes("checkout"), "Bare downstream date clarification is not tied to both possible date fields");
  return { durationMs: result.durationMs, query: String(asks[0]?.query || "") };
}

async function greekSpecificClarificationRegression() {
  const result = await interpret("Αρχές Οκτωβρίου", {
    language: "el",
    currentStep: "checkin",
  });
  const asks = clarifications(result.command.actions);
  assert(asks.length === 1, "Ambiguous Greek date did not produce exactly one clarification");
  const query = String(asks[0]?.query || "");
  assert(asks[0]?.missingFields?.includes("checkin"), "Ambiguous Greek date clarification is not tied to checkin");
  assert(/οκτωβρ|check-?in|ημερομην/i.test(query), `Clarification is not specific about the ambiguous date: ${query}`);
  assert(/\d{1,2}[/.\-]\d{1,2}|π\.χ\./i.test(query), `Clarification does not provide a useful example: ${query}`);
  assert(!/δεν.*καταλαβ|πιο συγκεκριμεν/i.test(query.normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase()), `Clarification is generic instead of specific: ${query}`);
  return { durationMs: result.durationMs, query };
}

async function main() {
  const languages = ["el", "en", "de", "fr", "it", "es", "tr"];
  console.log(`Room Finder AI contract QA target: ${BASE_URL}`);

  for (const language of languages) {
    const timing = await exactDateJourney(language);
    console.log(`✓ ${language} AI date understanding (${timing.arrivalMs}ms / ${timing.namedArrivalMs}ms / ${timing.departureMs}ms)`);
  }

  const preferenceRemoval = await greekPreferenceRemovalRegression();
  console.log(`✓ removed preferences do not enter booking contract (${preferenceRemoval.durationMs}ms)`);

  const full = await greekFullSentenceRegression();
  console.log(`✓ el full one-turn booking sentence (${full.durationMs}ms)`);

  const followup = await greekShortFollowupRegression();
  console.log(`✓ el nights + total-guests follow-up (${followup.durationMs}ms)`);

  const multiRoom = await multiRoomTotalRegression();
  console.log(`✓ multi-room total guests stay distinct from allocation (${multiRoom.durationMs}ms)`);

  const allocation = await explicitRoomAllocationRegression();
  console.log(`✓ explicit guest allocation per room (${allocation.durationMs}ms)`);

  const roomFollowup = await specificRoomFollowupRegression();
  console.log(`✓ current-room guest follow-up (${roomFollowup.durationMs}ms)`);

  const downstream = await downstreamCorrectionRegression();
  console.log(`✓ downstream booking correction (${downstream.durationMs}ms)`);

  const downstreamDate = await downstreamBareDateClarificationRegression();
  console.log(`✓ downstream bare-date clarification (${downstreamDate.durationMs}ms): ${downstreamDate.query}`);

  const clarification = await greekSpecificClarificationRegression();
  console.log(`✓ el specific ambiguity clarification (${clarification.durationMs}ms): ${clarification.query}`);
}

main().catch((error) => {
  console.error(`✗ Room Finder AI contract QA: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
