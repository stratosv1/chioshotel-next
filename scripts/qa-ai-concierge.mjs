#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";

const BASE_URL = String(process.env.AI_QA_BASE_URL || "https://chioshotel.gr").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.AI_QA_TIMEOUT_MS || 25000);
const REPORT_DIR = "qa-results";
const REPORT_PATH = `${REPORT_DIR}/ai-concierge-report.json`;

const languages = ["el", "en", "de", "fr", "it", "es", "tr"];
const roomQueries = {
  el: "Είμαστε 2 άτομα και θέλουμε δωμάτιο χωρίς σκάλες",
  en: "We are 2 guests and want a room without stairs",
  de: "Wir sind 2 Gäste und möchten ein Zimmer ohne Treppen",
  fr: "Nous sommes 2 personnes et souhaitons une chambre sans escaliers",
  it: "Siamo 2 persone e desideriamo una camera senza scale",
  es: "Somos 2 personas y queremos una habitación sin escaleras",
  tr: "2 kişiyiz ve merdivensiz bir oda istiyoruz",
};
const correctionQueries = {
  el: "Τελικά αλλάζουμε: 15 με 18 Σεπτεμβρίου και είμαστε 4 άτομα",
  en: "Change of plan: 15 to 18 September and we are 4 guests",
  de: "Planänderung: 15. bis 18. September und wir sind 4 Gäste",
  fr: "Changement de programme : du 15 au 18 septembre pour 4 personnes",
  it: "Cambio di programma: dal 15 al 18 settembre per 4 persone",
  es: "Cambio de planes: del 15 al 18 de septiembre para 4 personas",
  tr: "Plan değişti: 15-18 Eylül ve 4 kişiyiz",
};
const galleryQueries = {
  el: "Δείξε μου τις φωτογραφίες της πρώτης επιλογής",
  en: "Show me the photos of the first option",
  de: "Zeigen Sie mir die Fotos der ersten Option",
  fr: "Montrez-moi les photos de la première option",
  it: "Mostrami le foto della prima opzione",
  es: "Muéstrame las fotos de la primera opción",
  tr: "İlk seçeneğin fotoğraflarını göster",
};

const scenarios = [
  ...languages.map((language) => ({
    id: `${language}-room-no-stairs`,
    language,
    messages: [{ role: "user", content: roomQueries[language] }],
    expect: { action: "recommend_rooms", offers: true, noStairs: true },
  })),
  ...languages.map((language) => ({
    id: `${language}-correction-flow`,
    language,
    search: { checkin: "2026-09-10", checkout: "2026-09-13", guests: 2 },
    messages: [
      { role: "user", content: "10-13 September, 2 guests" },
      { role: "assistant", content: "I checked the options." },
      { role: "user", content: correctionQueries[language] },
    ],
    expect: { action: "search_availability", correctedGuests: 4 },
  })),
  ...languages.map((language) => ({
    id: `${language}-gallery-flow`,
    language,
    selectedRoom: 8,
    messages: [
      { role: "user", content: roomQueries[language] },
      { role: "assistant", content: "I found suitable options." },
      { role: "user", content: galleryQueries[language] },
    ],
    expect: { action: "show_gallery", offers: true },
  })),
  {
    id: "capacity-2-guests",
    language: "en",
    search: { checkin: "2026-09-20", checkout: "2026-09-23", guests: 2 },
    messages: [{ role: "user", content: "Check availability for 2 guests" }],
    expect: { action: "search_availability", offers: true, maxGuestsAtLeast: 2 },
  },
  {
    id: "capacity-3-guests",
    language: "en",
    search: { checkin: "2026-09-20", checkout: "2026-09-23", guests: 3 },
    messages: [{ role: "user", content: "Check availability for 3 guests" }],
    expect: { action: "search_availability", offers: true, maxGuestsAtLeast: 3 },
  },
  {
    id: "capacity-4-guests",
    language: "en",
    search: { checkin: "2026-09-20", checkout: "2026-09-23", guests: 4 },
    messages: [{ role: "user", content: "Check availability for 4 guests" }],
    expect: { action: "search_availability", offers: true, maxGuestsAtLeast: 4 },
  },
  {
    id: "capacity-5-guests",
    language: "en",
    search: { checkin: "2026-09-20", checkout: "2026-09-23", guests: 5 },
    messages: [{ role: "user", content: "Check availability for 5 guests" }],
    expect: { action: "search_availability", offers: true, onlyRoom10: true },
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
    id: "unsafe-booking-blocked",
    special: "unsafe-booking",
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function post(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const started = Date.now();
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null);
    return { response, payload, durationMs: Date.now() - started };
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
    assert(
      offers.every((offer) => /χωρίς σκάλες|no stairs|ground floor|ισόγειο|erdgeschoss|rez-de-chaussée|piano terra|planta baja|zemin kat/i.test(`${offer.floor} ${offer.category} ${(offer.features || []).join(" ")}`)),
      "returned an offer that does not match the no-stairs request",
    );
  }
  if (scenario.expect.maxGuestsAtLeast) {
    assert(offers.every((offer) => Number(offer.maxGuests) >= scenario.expect.maxGuestsAtLeast), "returned an undersized offer");
  }
  if (scenario.expect.onlyRoom10) {
    assert(offers.length > 0 && offers.every((offer) => String(offer.roomId) === "265595" && String(offer.unitId) === "3"), "five guests should only receive apartment 10");
  }
  if (scenario.expect.correctedGuests) {
    const availability = actions.find((action) => action.type === "search_availability");
    const resultingGuests = availability?.guests ?? payload?.search?.guests;
    assert(Number(resultingGuests) === scenario.expect.correctedGuests, "guest correction was not applied");
  }

  const keys = offers.map((offer) => `${offer.roomId}:${offer.unitId}`);
  assert(new Set(keys).size === keys.length, "duplicate offers returned");

  for (const offer of offers) {
    assert(offer.preview === true || (Number(offer.originalTotal) > 0 && Number(offer.directTotal) > 0), "offer is neither a safe preview nor a valid live offer");
    if (offer.preview !== true) assert(Number(offer.directTotal) <= Number(offer.originalTotal), "direct total exceeds original total");
  }
}

async function runNormalScenario(scenario) {
  const { response, payload, durationMs } = await post("/api/ai-assistant/smart", {
    messages: scenario.messages,
    search: scenario.search || {},
    language: scenario.language,
    selectedRoom: scenario.selectedRoom,
  });
  assert(response.ok, `HTTP ${response.status}: ${payload?.error || "unknown error"}`);
  validateScenario(scenario, payload);
  return {
    durationMs,
    answer: payload.answer,
    language: payload.language,
    actionTypes: actionsOf(payload).map((action) => action.type),
    offers: Array.isArray(payload.offers) ? payload.offers.map((offer) => ({
      roomId: offer.roomId,
      unitId: offer.unitId,
      name: offer.name,
      maxGuests: offer.maxGuests,
      originalTotal: offer.originalTotal,
      directTotal: offer.directTotal,
    })) : [],
  };
}

async function runUnsafeBookingScenario() {
  const { response, payload, durationMs } = await post("/api/ai-assistant/request", {
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
  return { durationMs, status: response.status };
}

async function main() {
  console.log(`AI concierge QA target: ${BASE_URL}`);
  const report = {
    target: BASE_URL,
    startedAt: new Date().toISOString(),
    total: scenarios.length,
    passed: 0,
    failed: 0,
    results: [],
  };

  for (const scenario of scenarios) {
    const started = Date.now();
    try {
      const details = scenario.special === "unsafe-booking" ? await runUnsafeBookingScenario() : await runNormalScenario(scenario);
      report.passed += 1;
      report.results.push({ id: scenario.id, status: "pass", durationMs: Date.now() - started, details });
      console.log(`✓ ${scenario.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      report.failed += 1;
      report.results.push({ id: scenario.id, status: "fail", durationMs: Date.now() - started, error: message });
      console.error(`✗ ${scenario.id}: ${message}`);
    }
  }

  report.finishedAt = new Date().toISOString();
  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`\nResult: ${report.passed}/${report.total} scenarios passed`);
  console.log(`Report: ${REPORT_PATH}`);
  if (report.failed) process.exitCode = 1;
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});
