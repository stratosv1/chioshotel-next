#!/usr/bin/env node

const BASE_URL = String(process.env.AI_QA_BASE_URL || "https://chioshotel.gr").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.AI_QA_TIMEOUT_MS || 30000);

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
  return actions.find((action) => action?.[key] != null)?.[key];
}

async function exactDateJourney(language) {
  const arrival = await interpret("10/10", { language, currentStep: "checkin" });
  assert(fact(arrival.command.actions, "checkin") === "2026-10-10", `${language}: 10/10 was not resolved as check-in`);

  const departure = await interpret("12/10", {
    language,
    currentStep: "checkout",
    checkin: "2026-10-10",
  });
  assert(fact(departure.command.actions, "checkout") === "2026-10-12", `${language}: 12/10 was not resolved as check-out`);

  // Standalone numeric dates must use the deterministic fast path, not wait on AI.
  assert(arrival.durationMs < 3000, `${language}: numeric check-in fast path took ${arrival.durationMs}ms`);
  assert(departure.durationMs < 3000, `${language}: numeric check-out fast path took ${departure.durationMs}ms`);

  return { arrivalMs: arrival.durationMs, departureMs: departure.durationMs };
}

async function greekFactPersistenceInput() {
  const result = await interpret("Θέλω ένα δωμάτιο για 2 άτομα στον όροφο", {
    language: "el",
    currentStep: "checkin",
  });
  const actions = result.command.actions;
  assert(Number(fact(actions, "roomCount")) === 1, "Greek combined input did not extract roomCount=1");
  assert(Number(fact(actions, "guests")) === 2, "Greek combined input did not extract guests=2");
  assert(actions.some((action) => action?.preferences?.floor === "first"), "Greek combined input did not extract floor=first");
  return { durationMs: result.durationMs };
}

async function main() {
  const languages = ["el", "en", "de", "fr", "it", "es", "tr"];
  console.log(`Room Finder interpreter QA target: ${BASE_URL}`);

  for (const language of languages) {
    const timing = await exactDateJourney(language);
    console.log(`✓ ${language} exact dates (${timing.arrivalMs}ms / ${timing.departureMs}ms)`);
  }

  const combined = await greekFactPersistenceInput();
  console.log(`✓ el combined room/guest/floor facts (${combined.durationMs}ms)`);
}

main().catch((error) => {
  console.error(`✗ Room Finder interpreter QA: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
