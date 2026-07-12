#!/usr/bin/env node

/**
 * End-to-end QA for the Voulamandis House AI concierge.
 *
 * Usage:
 *   AI_QA_BASE_URL=http://localhost:3000 npm run qa:ai
 *   AI_QA_BASE_URL=https://your-preview.vercel.app npm run qa:ai
 *
 * The suite never submits a real valid booking request. It only checks that
 * invalid/unverified requests are rejected by the booking-request endpoint.
 */

const BASE_URL = String(process.env.AI_QA_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.AI_QA_TIMEOUT_MS || 25000);

const scenarios = [
  {
    id: "el-no-stairs",
    language: "el",
    messages: [{ role: "user", content: "Είμαστε 2 άτομα και θέλω να δω δωμάτιο χωρίς σκάλες" }],
    expect: { action: "recommend_rooms", offers: true, noStairs: true },
  },
  {
    id: "en-family-kitchen",
    language: "en",
    messages: [{ role: "user", content: "We are a family of four and need a ground-floor apartment with a full kitchen" }],
    expect: { action: "recommend_rooms", offers: true, familyCapacity: 4 },
  },
  {
    id: "fr-nearby-beach",
    language: "fr",
    messages: [{ role: "user", content: "Quelle plage proche conseillez-vous avec des enfants ?" }],
    expect: { action: "recommend_beaches", knowledge: true },
  },
  {
    id: "de-villages",
    language: "de",
    messages: [{ role: "user", content: "Welche Mastixdörfer kann ich an einem Tag besuchen?" }],
    expect: { action: "recommend_villages", knowledge: true },
  },
  {
    id: "it-itinerary",
    language: "it",
    messages: [{ role: "user", content: "Preparami un programma rilassato di tre giorni a Chios" }],
    expect: { action: "build_itinerary", knowledge: true },
  },
  {
    id: "es-museum",
    language: "es",
    messages: [{ role: "user", content: "¿Qué museo es mejor para una familia con niños?" }],
    expect: { action: "recommend_museums", knowledge: true },
  },
  {
    id: "tr-room-gallery",
    language: "tr",
    messages: [
      { role: "user", content: "4 kişilik bir aile için oda öner" },
      { role: "assistant", content: "Size uygun seçenekleri buldum." },
      { role: "user", content: "İlk seçeneğin fotoğraflarını göster" },
    ],
    selectedRoom: 8,
    expect: { action: "show_gallery", offers: true },
  },
  {
    id: "el-correction-restarts-search",
    language: "el",
    search: { checkin: "2026-09-10", checkout: "2026-09-13", guests: 2 },
    messages: [
      { role: "user", content: "Θέλω διαθεσιμότητα 10 με 13 Σεπτεμβρίου για 2 άτομα" },
      { role: "assistant", content: "Έλεγξα τις επιλογές." },
      { role: "user", content: "Τελικά αλλάζουμε: 15 με 18 Σεπτεμβρίου και είμαστε 4 άτομα" },
    ],
    expect: { action: "search_availability", correctedGuests: 4 },
  },
  {
    id: "en-five-guests",
    language: "en",
    messages: [{ role: "user", content: "We are five people. Which apartment can work for us?" }],
    expect: { action: "recommend_rooms", offers: true, onlyRoom10: true },
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function post(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null);
    return { response, payload };
  } finally {
    clearTimeout(timer);
  }
}

function actionsOf(payload) {
  return Array.isArray(payload?.command?.actions) ? payload.command.actions : [];
}

function validateScenario(scenario, payload) {
  assert(payload && typeof payload.answer === "string" && payload.answer.trim(), "missing natural-language answer");
  assert(payload.language === scenario.language, `expected language ${scenario.language}, got ${payload.language}`);

  const actions = actionsOf(payload);
  assert(actions.some((action) => action.type === scenario.expect.action), `missing action ${scenario.expect.action}`);

  const offers = Array.isArray(payload.offers) ? payload.offers : [];
  const knowledge = Array.isArray(payload.knowledge) ? payload.knowledge : [];
  if (scenario.expect.offers) assert(offers.length > 0, "expected room offers");
  if (scenario.expect.knowledge) assert(knowledge.length > 0, "expected verified knowledge cards");

  if (scenario.expect.noStairs) {
    assert(offers.every((offer) => /χωρίς σκάλες|no stairs|ground floor|ισόγειο|erdgeschoss|rez-de-chaussée|piano terra|planta baja|zemin kat/i.test(`${offer.floor} ${offer.category} ${(offer.features || []).join(" ")}`)), "returned an offer that does not match the no-stairs request");
  }
  if (scenario.expect.familyCapacity) {
    assert(offers.every((offer) => Number(offer.maxGuests) >= scenario.expect.familyCapacity), "returned an undersized family offer");
  }
  if (scenario.expect.onlyRoom10) {
    assert(offers.length > 0 && offers.every((offer) => String(offer.roomId) === "265595" && String(offer.unitId) === "3"), "five guests should only receive apartment 10");
  }
  if (scenario.expect.correctedGuests) {
    const availability = actions.find((action) => action.type === "search_availability");
    const resultingGuests = availability?.guests ?? payload?.search?.guests;
    assert(Number(resultingGuests) === scenario.expect.correctedGuests, "guest correction was not applied");
  }

  for (const offer of offers) {
    assert(offer.preview === true || (Number(offer.originalTotal) > 0 && Number(offer.directTotal) > 0), "offer is neither a safe preview nor a valid live offer");
    if (offer.preview !== true) assert(Number(offer.directTotal) <= Number(offer.originalTotal), "direct total exceeds original total");
  }
}

async function runScenario(scenario) {
  const { response, payload } = await post("/api/ai-assistant/smart", {
    messages: scenario.messages,
    search: scenario.search || {},
    language: scenario.language,
    selectedRoom: scenario.selectedRoom,
  });
  assert(response.ok, `HTTP ${response.status}: ${payload?.error || "unknown error"}`);
  validateScenario(scenario, payload);
}

async function verifyUnsafeBookingIsBlocked() {
  const { response, payload } = await post("/api/ai-assistant/request", {
    name: "QA Test",
    contact: "qa@example.com",
    checkin: "2020-01-01",
    checkout: "2020-01-02",
    guests: 2,
    roomId: "267788",
    unitId: "1",
    roomName: "Room 1",
    originalTotal: 100,
    directTotal: 90,
    conversation: [],
  });
  assert(response.status === 400 || response.status === 409, `unsafe booking request was not blocked (HTTP ${response.status})`);
  assert(payload?.ok === false, "unsafe booking request did not return ok:false");
}

async function main() {
  console.log(`AI concierge QA target: ${BASE_URL}`);
  let passed = 0;
  const failures = [];

  for (const scenario of scenarios) {
    try {
      await runScenario(scenario);
      passed += 1;
      console.log(`✓ ${scenario.id}`);
    } catch (error) {
      failures.push({ id: scenario.id, error: error instanceof Error ? error.message : String(error) });
      console.error(`✗ ${scenario.id}: ${failures.at(-1).error}`);
    }
  }

  try {
    await verifyUnsafeBookingIsBlocked();
    passed += 1;
    console.log("✓ unsafe-booking-blocked");
  } catch (error) {
    failures.push({ id: "unsafe-booking-blocked", error: error instanceof Error ? error.message : String(error) });
    console.error(`✗ unsafe-booking-blocked: ${failures.at(-1).error}`);
  }

  console.log(`\nResult: ${passed}/${scenarios.length + 1} checks passed`);
  if (failures.length) {
    console.error("\nFailures:");
    for (const failure of failures) console.error(`- ${failure.id}: ${failure.error}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
