#!/usr/bin/env node

const BASE_URL = String(process.env.AI_QA_BASE_URL || "https://chioshotel.gr").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.AI_QA_TIMEOUT_MS || 30000);

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
    return { command: payload.command, durationMs: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

function fact(actions, key) {
  return [...actions].reverse().find((action) => action?.[key] != null)?.[key];
}

function hasPreference(actions, key, value) {
  return actions.some((action) => action?.preferences?.[key] === value);
}

function assertNoClarification(actions, label) {
  assert(!actions.some((action) => action?.type === "ask_clarification"), `${label}: executable facts were mixed with clarification`);
}

async function exactDateJourney(language) {
  const arrival = await interpret("10/10", { language, currentStep: "checkin" });
  assert(fact(arrival.command.actions, "checkin") === "2026-10-10", `${language}: 10/10 was not resolved as check-in`);

  const namedArrival = await interpret(TEXT_DATE[language], { language, currentStep: "checkin" });
  assert(fact(namedArrival.command.actions, "checkin") === "2026-10-10", `${language}: named-month date was not resolved as check-in`);

  const departure = await interpret("12/10", {
    language,
    currentStep: "checkout",
    checkin: "2026-10-10",
  });
  assert(fact(departure.command.actions, "checkout") === "2026-10-12", `${language}: 12/10 was not resolved as check-out`);

  // Exact dates must use the deterministic fast path, not wait on AI.
  assert(arrival.durationMs < 3000, `${language}: numeric check-in fast path took ${arrival.durationMs}ms`);
  assert(namedArrival.durationMs < 3000, `${language}: named check-in fast path took ${namedArrival.durationMs}ms`);
  assert(departure.durationMs < 3000, `${language}: numeric check-out fast path took ${departure.durationMs}ms`);

  return { arrivalMs: arrival.durationMs, namedArrivalMs: namedArrival.durationMs, departureMs: departure.durationMs };
}

async function greekKitchenRegression() {
  const result = await interpret("Θέλω ένα δωμάτιο ,2ατομα , με κουζίνα", {
    language: "el",
    currentStep: "checkin",
  });
  const actions = result.command.actions;
  assert(Number(fact(actions, "roomCount")) === 1, "Greek kitchen input did not extract roomCount=1");
  assert(Number(fact(actions, "guests")) === 2, "Greek kitchen input did not extract guests=2 from 2ατομα");
  assert(hasPreference(actions, "kitchenette", true), "Greek kitchen input did not extract kitchenette=true");
  assertNoClarification(actions, "Greek kitchen input");
  return { durationMs: result.durationMs };
}

async function greekFloorRegression() {
  const result = await interpret("Θέλω ένα δωμάτιο για 2 άτομα στον όροφο", {
    language: "el",
    currentStep: "checkin",
  });
  const actions = result.command.actions;
  assert(Number(fact(actions, "roomCount")) === 1, "Greek floor input did not extract roomCount=1");
  assert(Number(fact(actions, "guests")) === 2, "Greek floor input did not extract guests=2");
  assert(hasPreference(actions, "floor", "first"), "Greek floor input did not extract floor=first");
  assertNoClarification(actions, "Greek floor input");
  return { durationMs: result.durationMs };
}

async function greekCombinedBookingFacts() {
  const result = await interpret("10/10 για 2 βράδια, 1 δωμάτιο για 2 άτομα", {
    language: "el",
    currentStep: "checkin",
  });
  const actions = result.command.actions;
  assert(fact(actions, "checkin") === "2026-10-10", "Combined Greek input did not preserve check-in");
  assert(Number(fact(actions, "nights")) === 2, "Combined Greek input did not extract nights=2");
  assert(Number(fact(actions, "roomCount")) === 1, "Combined Greek input did not extract roomCount=1");
  assert(Number(fact(actions, "guests")) === 2, "Combined Greek input did not extract guests=2");
  assertNoClarification(actions, "Combined Greek input");
  return { durationMs: result.durationMs };
}

async function main() {
  const languages = ["el", "en", "de", "fr", "it", "es", "tr"];
  console.log(`Room Finder interpreter QA target: ${BASE_URL}`);

  for (const language of languages) {
    const timing = await exactDateJourney(language);
    console.log(`✓ ${language} exact dates (${timing.arrivalMs}ms / ${timing.namedArrivalMs}ms / ${timing.departureMs}ms)`);
  }

  const kitchen = await greekKitchenRegression();
  console.log(`✓ el real kitchen regression (${kitchen.durationMs}ms)`);

  const floor = await greekFloorRegression();
  console.log(`✓ el real floor regression (${floor.durationMs}ms)`);

  const combined = await greekCombinedBookingFacts();
  console.log(`✓ el combined booking facts (${combined.durationMs}ms)`);
}

main().catch((error) => {
  console.error(`✗ Room Finder interpreter QA: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
