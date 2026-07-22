#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";

const BASE_URL = String(process.env.AI_QA_BASE_URL || "https://chioshotel.gr").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.AI_QA_TIMEOUT_MS || 30000);
const REPORT_DIR = "qa-results";
const REPORT_PATH = `${REPORT_DIR}/ai-concierge-report.json`;

const languages = ["el", "en", "de", "fr", "it", "es", "tr"];

const incompleteQueries = {
  el: "Θέλω δωμάτιο για 2 άτομα χωρίς σκάλες",
  en: "I want a room for 2 guests without stairs",
  de: "Ich möchte ein Zimmer für 2 Gäste ohne Treppen",
  fr: "Je veux une chambre pour 2 personnes sans escaliers",
  it: "Vorrei una camera per 2 persone senza scale",
  es: "Quiero una habitación para 2 personas sin escaleras",
  tr: "2 kişi için merdivensiz bir oda istiyorum",
};

const correctionQueries = {
  el: "Τελικά αλλάζουμε: 15 με 18 Σεπτεμβρίου 2026 και είμαστε 4 άτομα",
  en: "Change of plan: 15 to 18 September 2026 and we are 4 guests",
  de: "Planänderung: 15. bis 18. September 2026 und wir sind 4 Gäste",
  fr: "Changement de programme : du 15 au 18 septembre 2026 pour 4 personnes",
  it: "Cambio di programma: dal 15 al 18 settembre 2026 per 4 persone",
  es: "Cambio de planes: del 15 al 18 de septiembre de 2026 para 4 personas",
  tr: "Plan değişti: 15-18 Eylül 2026 ve 4 kişiyiz",
};

const respondQueries = {
  el: "Ποια παραλία είναι κοντά και κατάλληλη για παιδιά;",
  en: "Which nearby beach is suitable for children?",
  de: "Welcher nahe Strand ist für Kinder geeignet?",
  fr: "Quelle plage proche convient aux enfants ?",
  it: "Quale spiaggia vicina è adatta ai bambini?",
  es: "¿Qué playa cercana es adecuada para niños?",
  tr: "Çocuklar için hangi yakın plaj uygundur?",
};

const scenarios = [
  ...languages.map((language) => ({
    id: `${language}-asks-for-missing-dates`,
    language,
    messages: [{ role: "user", content: incompleteQueries[language] }],
    expect: { action: "ask_user", answer: true },
  })),

  ...languages.map((language) => ({
    id: `${language}-correction-search`,
    language,
    search: { checkin: "2026-09-10", checkout: "2026-09-13", guests: 2 },
    messages: [
      { role: "user", content: "10-13 September 2026, 2 guests" },
      { role: "assistant", content: "I checked the options." },
      { role: "user", content: correctionQueries[language] },
    ],
    expect: {
      action: "search_rooms",
      search: { checkin: "2026-09-15", checkout: "2026-09-18", guests: 4 },
      validateOffers: true,
    },
  })),

  ...languages.map((language) => ({
    id: `${language}-general-response`,
    language,
    messages: [{ role: "user", content: respondQueries[language] }],
    expect: { action: "respond", answer: true },
  })),

  {
    id: "capacity-2-guests",
    language: "en",
    search: { checkin: "2026-09-20", checkout: "2026-09-23", guests: 2 },
    messages: [{ role: "user", content: "Check live availability for these dates for 2 guests" }],
    expect: { action: "search_rooms", minGuests: 2, validateOffers: true },
  },
  {
    id: "capacity-3-guests",
    language: "en",
    search: { checkin: "2026-09-20", checkout: "2026-09-23", guests: 3 },
    messages: [{ role: "user", content: "Check live availability for these dates for 3 guests" }],
    expect: { action: "search_rooms", minGuests: 3, validateOffers: true },
  },
  {
    id: "capacity-4-guests",
    language: "en",
    search: { checkin: "2026-09-20", checkout: "2026-09-23", guests: 4 },
    messages: [{ role: "user", content: "Check live availability for these dates for 4 guests" }],
    expect: { action: "search_rooms", minGuests: 4, validateOffers: true },
  },
  {
    id: "capacity-5-guests",
    language: "en",
    search: { checkin: "2026-09-20", checkout: "2026-09-23", guests: 5 },
    messages: [{ role: "user", content: "Check live availability for these dates for 5 guests" }],
    expect: { action: "search_rooms", minGuests: 5, onlyRoom10WhenAvailable: true, validateOffers: true },
  },
  {
    id: "invalid-past-search-does-not-book",
    language: "en",
    search: { checkin: "2020-01-01", checkout: "2020-01-02", guests: 2 },
    messages: [{ role: "user", content: "Book this now" }],
    expect: { bookingNotConfirmed: true, answer: true },
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

function validateOfferBasics(offers) {
  const keys = offers.map((offer) => `${offer.roomId}:${offer.unitId}`);
  assert(new Set(keys).size === keys.length, "duplicate offers returned");

  for (const offer of offers) {
    assert(Number(offer.maxGuests) >= 1, "offer has invalid maxGuests");
    assert(Number(offer.originalTotal) > 0, "offer has invalid originalTotal");
    assert(Number(offer.directTotal) > 0, "offer has invalid directTotal");
    assert(Number(offer.directTotal) <= Number(offer.originalTotal), "direct total exceeds original total");
  }
}

function validateScenario(scenario, payload) {
  assert(payload && typeof payload === "object", "missing JSON payload");
  assert(typeof payload.answer === "string" && payload.answer.trim(), "missing natural-language answer");

  if (scenario.language) {
    assert(payload.language === scenario.language, `expected language ${scenario.language}, got ${payload.language}`);
  }

  if (scenario.expect?.action) {
    assert(payload.action === scenario.expect.action, `expected action ${scenario.expect.action}, got ${payload.action}`);
  }

  if (scenario.expect?.search) {
    assert(payload.search?.checkin === scenario.expect.search.checkin, `expected checkin ${scenario.expect.search.checkin}, got ${payload.search?.checkin}`);
    assert(payload.search?.checkout === scenario.expect.search.checkout, `expected checkout ${scenario.expect.search.checkout}, got ${payload.search?.checkout}`);
    assert(Number(payload.search?.guests) === scenario.expect.search.guests, `expected guests ${scenario.expect.search.guests}, got ${payload.search?.guests}`);
  }

  const offers = Array.isArray(payload.offers) ? payload.offers : [];

  if (scenario.expect?.validateOffers) {
    validateOfferBasics(offers);
    assert(offers.length > 0 || payload.noAvailability === true || typeof payload.answer === "string", "search returned no actionable outcome");
  }

  if (scenario.expect?.minGuests && offers.length) {
    assert(offers.every((offer) => Number(offer.maxGuests) >= scenario.expect.minGuests), "returned an undersized offer");
  }

  if (scenario.expect?.onlyRoom10WhenAvailable && offers.length) {
    assert(offers.every((offer) => String(offer.roomId) === "265595" && String(offer.unitId) === "3"), "five guests should only receive apartment 10");
  }

  if (scenario.expect?.bookingNotConfirmed) {
    assert(payload.bookingConfirmed !== true, "assistant falsely confirmed a booking");
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
    action: payload.action,
    search: payload.search,
    noAvailability: payload.noAvailability === true,
    receptionHandoffOffered: payload.receptionHandoffOffered === true,
    bookingConfirmed: payload.bookingConfirmed === true,
    offers: Array.isArray(payload.offers)
      ? payload.offers.map((offer) => ({
          roomId: offer.roomId,
          unitId: offer.unitId,
          name: offer.name,
          maxGuests: offer.maxGuests,
          originalTotal: offer.originalTotal,
          directTotal: offer.directTotal,
        }))
      : [],
    rawPayload: payload,
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
  return { durationMs, status: response.status, rawPayload: payload };
}

async function main() {
  console.log(`AI concierge QA target: ${BASE_URL}`);
  console.log(`Running ${scenarios.length} scenarios against the current smart API contract.`);

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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
