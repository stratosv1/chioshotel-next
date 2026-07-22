#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";

const BASE_URL = String(process.env.AI_QA_BASE_URL || "https://chioshotel.gr").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.AI_QA_TIMEOUT_MS || 30000);
const REPORT_DIR = "qa-results";
const REPORT_PATH = `${REPORT_DIR}/ai-concierge-report.json`;
const MAX_TURNS = 8;

const L = {
  el: {
    start: "Θέλω ένα ήσυχο δωμάτιο χωρίς σκάλες.",
    dates: "Από 15 έως 18 Σεπτεμβρίου 2026.",
    guests: "Είμαστε 2 άτομα.",
    correction: "Τελικά είμαστε 4 άτομα και θέλουμε 16 έως 19 Σεπτεμβρίου 2026.",
    contact: "Ναι, στείλε αίτημα στη reception με WhatsApp.",
    general: "Ποια κοντινή παραλία είναι κατάλληλη για παιδιά;",
  },
  en: {
    start: "I need a quiet room without stairs.",
    dates: "From 15 to 18 September 2026.",
    guests: "We are 2 guests.",
    correction: "Actually we are 4 guests and need 16 to 19 September 2026.",
    contact: "Yes, send a request to reception by WhatsApp.",
    general: "Which nearby beach is suitable for children?",
  },
  de: {
    start: "Ich suche ein ruhiges Zimmer ohne Treppen.",
    dates: "Vom 15. bis 18. September 2026.",
    guests: "Wir sind 2 Personen.",
    correction: "Eigentlich sind wir 4 Personen und möchten vom 16. bis 19. September 2026 bleiben.",
    contact: "Ja, senden Sie eine Anfrage per WhatsApp an die Rezeption.",
    general: "Welcher nahe Strand ist für Kinder geeignet?",
  },
  fr: {
    start: "Je cherche une chambre calme sans escaliers.",
    dates: "Du 15 au 18 septembre 2026.",
    guests: "Nous sommes 2 personnes.",
    correction: "Finalement nous sommes 4 personnes, du 16 au 19 septembre 2026.",
    contact: "Oui, envoyez une demande à la réception par WhatsApp.",
    general: "Quelle plage proche convient aux enfants ?",
  },
  it: {
    start: "Cerco una camera tranquilla senza scale.",
    dates: "Dal 15 al 18 settembre 2026.",
    guests: "Siamo 2 persone.",
    correction: "In realtà siamo 4 persone, dal 16 al 19 settembre 2026.",
    contact: "Sì, invia una richiesta alla reception tramite WhatsApp.",
    general: "Quale spiaggia vicina è adatta ai bambini?",
  },
  es: {
    start: "Busco una habitación tranquila sin escaleras.",
    dates: "Del 15 al 18 de septiembre de 2026.",
    guests: "Somos 2 personas.",
    correction: "En realidad somos 4 personas, del 16 al 19 de septiembre de 2026.",
    contact: "Sí, envía una solicitud a recepción por WhatsApp.",
    general: "¿Qué playa cercana es adecuada para niños?",
  },
  tr: {
    start: "Merdivensiz, sakin bir oda arıyorum.",
    dates: "15-18 Eylül 2026 tarihleri arasında.",
    guests: "2 kişiyiz.",
    correction: "Aslında 4 kişiyiz ve 16-19 Eylül 2026 tarihleri arasında kalacağız.",
    contact: "Evet, resepsiyona WhatsApp ile talep gönder.",
    general: "Çocuklar için hangi yakın plaj uygundur?",
  },
};

// High-confidence evidence only. Shared hospitality words such as reception,
// WhatsApp, Email and room numbers are intentionally ignored.
const LANGUAGE_EVIDENCE = {
  el: /[α-ωάέήίόύώϊϋΐΰ]/iu,
  en: /\b(the|your|you|would|please|when|how many|staying|nearby|suitable|check in|check out)\b/i,
  de: /\b(der|die|das|für|möchten|zimmer|gäste|personen|verfügbar|anreise|abreise|bitte|ihnen)\b/i,
  fr: /\b(le|la|les|votre|vous|chambre|personnes|disponible|souhaitez|proche|arrivée|départ)\b/i,
  it: /\b(il|lo|gli|vostro|camera|persone|disponibile|desidera|vicina|arrivo|partenza|soggiorno)\b/i,
  es: /\b(el|los|usted|habitación|personas|disponible|quiere|cercana|llegada|salida|estancia)\b/i,
  tr: /(?:[çğıöşüİ])|\b(merhaba|konakla\w*|hangi|giriş\w*|çıkış\w*|tarih\w*|kişi\w*|oda|müsait|ister\w*|yakın|kal\w*|gönder\w*)\b/iu,
};

const FOREIGN_MARKERS = {
  el: [
    /\b(would you|how many guests|check in|check out|your booking|your stay)\b/i,
    /\b(wie viele|möchten sie|anreise|abreise)\b/i,
    /\b(combien de|souhaitez-vous|arrivée|départ)\b/i,
    /\b(quante persone|desidera|arrivo|partenza)\b/i,
    /\b(cuántas personas|quiere|llegada|salida)\b/i,
    /\b(kaç kişi|ister misiniz|giriş|çıkış)\b/i,
  ],
  en: [/[α-ωάέήίόύώϊϋΐΰ]/iu, /\b(wie viele|möchten sie|anreise|abreise)\b/i, /\b(combien de|souhaitez-vous|arrivée|départ)\b/i, /\b(cuántas personas|llegada|salida)\b/i, /\b(kaç kişi|giriş|çıkış)\b/i],
  de: [/[α-ωάέήίόύώϊϋΐΰ]/iu, /\b(would you|how many guests|check in|check out)\b/i, /\b(combien de|souhaitez-vous|arrivée|départ)\b/i, /\b(cuántas personas|llegada|salida)\b/i, /\b(kaç kişi|giriş|çıkış)\b/i],
  fr: [/[α-ωάέήίόύώϊϋΐΰ]/iu, /\b(would you|how many guests|check in|check out)\b/i, /\b(wie viele|möchten sie|anreise|abreise)\b/i, /\b(cuántas personas|llegada|salida)\b/i, /\b(kaç kişi|giriş|çıkış)\b/i],
  it: [/[α-ωάέήίόύώϊϋΐΰ]/iu, /\b(would you|how many guests|check in|check out)\b/i, /\b(wie viele|möchten sie|anreise|abreise)\b/i, /\b(combien de|souhaitez-vous|arrivée|départ)\b/i, /\b(cuántas personas|llegada|salida)\b/i, /\b(kaç kişi|giriş|çıkış)\b/i],
  es: [/[α-ωάέήίόύώϊϋΐΰ]/iu, /\b(would you|how many guests|check in|check out)\b/i, /\b(wie viele|möchten sie|anreise|abreise)\b/i, /\b(combien de|souhaitez-vous|arrivée|départ)\b/i, /\b(kaç kişi|giriş|çıkış)\b/i],
  tr: [/[α-ωάέήίόύώϊϋΐΰ]/iu, /\b(would you|how many guests|check in|check out)\b/i, /\b(wie viele|möchten sie|anreise|abreise)\b/i, /\b(combien de|souhaitez-vous|arrivée|départ)\b/i, /\b(cuántas personas|llegada|salida)\b/i],
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalize(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function attachDebug(error, details) {
  const err = error instanceof Error ? error : new Error(String(error));
  err.qaDetails = details;
  return err;
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

function assertLanguage(text, expected, turn) {
  const answer = normalize(text);
  assert(answer.length > 0, `turn ${turn}: empty assistant answer`);

  const foreign = (FOREIGN_MARKERS[expected] || []).find((pattern) => pattern.test(answer));
  assert(!foreign, `turn ${turn}: answer contains another language (${foreign}) — "${answer.slice(0, 180)}"`);

  if (answer.length >= 35) {
    assert(LANGUAGE_EVIDENCE[expected].test(answer), `turn ${turn}: answer does not look like ${expected} — "${answer.slice(0, 180)}"`);
  }
}

function fingerprint(text) {
  return normalize(text)
    .toLocaleLowerCase()
    .replace(/[0-9]+/g, "#")
    .replace(/[^\p{L}# ]/gu, "")
    .slice(0, 240);
}

function stateKey(snapshot) {
  const search = snapshot?.search || {};
  return JSON.stringify({
    action: snapshot?.action || null,
    checkin: search.checkin || null,
    checkout: search.checkout || null,
    guests: Number(search.guests) || null,
    offers: Number(snapshot?.offers) || 0,
    handoff: snapshot?.receptionHandoffOffered === true,
    noAvailability: snapshot?.noAvailability === true,
  });
}

function questionState(answer) {
  const a = normalize(answer).toLowerCase();
  if (/(guest|how many|άτομα|επισκέπτ|person|personen|personnes|persone|personas|kişi)/i.test(a)) return "guests";
  if (/(check.?out|departure|αναχώρ|abreise|départ|partenza|salida|çıkış)/i.test(a)) return "checkout";
  if (/(check.?in|arrival|άφιξ|ankunft|arrivée|arrivo|llegada|giriş)/i.test(a)) return "checkin";
  return null;
}

function assertNoLoop(snapshots) {
  const rows = snapshots.map((snapshot) => ({
    ...snapshot,
    fp: fingerprint(snapshot.answer),
    state: stateKey(snapshot),
    question: questionState(snapshot.answer),
  }));

  for (let i = 1; i < rows.length; i += 1) {
    const sameAnswer = rows[i].fp && rows[i].fp === rows[i - 1].fp;
    const sameState = rows[i].state === rows[i - 1].state;
    assert(!(sameAnswer && sameState), `loop detected: identical response with unchanged conversation state at turns ${i} and ${i + 1}`);
  }

  for (let i = 2; i < rows.length; i += 1) {
    const sameQuestion = rows[i].question && rows[i].question === rows[i - 1].question && rows[i].question === rows[i - 2].question;
    const unchangedState = rows[i].state === rows[i - 1].state && rows[i].state === rows[i - 2].state;
    assert(!(sameQuestion && unchangedState), `loop detected: assistant asked for ${rows[i].question} three times without progress`);
  }
}

function validateOffers(offers, guests) {
  const keys = offers.map((offer) => `${offer.roomId}:${offer.unitId}`);
  assert(new Set(keys).size === keys.length, "duplicate offers returned");
  for (const offer of offers) {
    assert(Number(offer.maxGuests) >= guests, `room ${offer.name || offer.roomId} cannot host ${guests} guests`);
    assert(Number(offer.originalTotal) > 0, "offer has invalid originalTotal");
    assert(Number(offer.directTotal) > 0, "offer has invalid directTotal");
    assert(Number(offer.directTotal) <= Number(offer.originalTotal), "direct total exceeds original total");
  }
}

function hasVisibleCTA(payload) {
  const answer = normalize(payload?.answer);
  const offers = Array.isArray(payload?.offers) ? payload.offers : [];
  return (
    offers.length > 0 ||
    payload?.receptionHandoffOffered === true ||
    /\b(whatsapp|email|e-mail|reception|rezeption|réception|recepción|resepsiyon)\b/i.test(answer)
  );
}

function isTerminalAction(payload) {
  const completeSearch = payload?.action === "search_rooms" && payload?.search?.checkin && payload?.search?.checkout && Number(payload?.search?.guests);
  return Boolean(completeSearch && hasVisibleCTA(payload));
}

function nextHumanReply(language, payload, step) {
  const copy = L[language];
  if (step === 0) return copy.start;

  // Behave like a human who remembers what has already been supplied.
  // State takes priority over keywords in an answer that may repeat dates.
  const search = payload?.search || {};
  if (!search.checkin || !search.checkout) return copy.dates;
  if (!Number(search.guests)) return copy.guests;

  const answer = normalize(payload?.answer).toLowerCase();
  if (/(guest|how many|άτομα|επισκέπτ|gäste|personen|personnes|persone|personas|kişi)/i.test(answer)) return copy.guests;
  if (/(date|check.?in|arrival|άφιξ|ημερομην|ankunft|arrivée|arrivo|llegada|tarih|giriş)/i.test(answer)) return copy.dates;
  return copy.contact;
}

async function callAssistant({ language, messages, search = {}, selectedRoom }) {
  const { response, payload, durationMs } = await post("/api/ai-assistant/smart", {
    language,
    messages,
    search,
    selectedRoom,
  });
  assert(response.ok, `HTTP ${response.status}: ${payload?.error || "unknown error"}`);
  assert(payload && typeof payload === "object", "missing JSON payload");
  assert(typeof payload.answer === "string" && payload.answer.trim(), "missing natural-language answer");
  assert(payload.language === language, `language field changed from ${language} to ${payload.language}`);
  return { payload, durationMs };
}

function transcriptAssistant(payload) {
  return {
    role: "assistant",
    content: payload.answer,
    action: payload.action,
    search: payload.search,
    offers: Array.isArray(payload.offers) ? payload.offers.length : 0,
    noAvailability: payload.noAvailability === true,
    receptionHandoffOffered: payload.receptionHandoffOffered === true,
  };
}

function loopSnapshot(payload) {
  return {
    answer: payload.answer,
    action: payload.action,
    search: payload.search,
    offers: Array.isArray(payload.offers) ? payload.offers.length : 0,
    noAvailability: payload.noAvailability === true,
    receptionHandoffOffered: payload.receptionHandoffOffered === true,
  };
}

async function runBookingJourney(language) {
  const messages = [];
  const snapshots = [];
  const transcript = [];
  let search = {};
  let terminalPayload = null;
  let totalDurationMs = 0;

  try {
    for (let step = 0; step < MAX_TURNS; step += 1) {
      const userText = nextHumanReply(language, terminalPayload, step);
      messages.push({ role: "user", content: userText });
      transcript.push({ role: "user", content: userText });

      const { payload, durationMs } = await callAssistant({ language, messages, search });
      totalDurationMs += durationMs;
      search = payload.search || search;
      terminalPayload = payload;

      assertLanguage(payload.answer, language, step + 1);
      snapshots.push(loopSnapshot(payload));
      transcript.push(transcriptAssistant(payload));
      messages.push({ role: "assistant", content: payload.answer });

      if (isTerminalAction(payload)) break;
    }

    assertNoLoop(snapshots);
    assert(terminalPayload, "journey produced no assistant response");
    assert(isTerminalAction(terminalPayload), `journey did not finish with a visible CTA/outcome within ${MAX_TURNS} turns`);

    const offers = Array.isArray(terminalPayload.offers) ? terminalPayload.offers : [];
    if (offers.length) validateOffers(offers, Number(terminalPayload.search.guests));

    return {
      totalDurationMs,
      turns: snapshots.length,
      finalAction: terminalPayload.action,
      finalSearch: terminalPayload.search,
      offers: offers.length,
      noAvailability: terminalPayload.noAvailability === true,
      receptionHandoffOffered: terminalPayload.receptionHandoffOffered === true,
      transcript,
    };
  } catch (error) {
    throw attachDebug(error, {
      totalDurationMs,
      turns: snapshots.length,
      finalAction: terminalPayload?.action,
      finalSearch: terminalPayload?.search,
      transcript,
    });
  }
}

async function runCorrectionJourney(language) {
  const copy = L[language];
  const messages = [{ role: "user", content: `${copy.dates} ${copy.guests}` }];
  const transcript = [...messages];
  const snapshots = [];
  let search = {};
  let totalDurationMs = 0;

  try {
    const first = await callAssistant({ language, messages, search });
    totalDurationMs += first.durationMs;
    assertLanguage(first.payload.answer, language, 1);
    messages.push({ role: "assistant", content: first.payload.answer });
    transcript.push(transcriptAssistant(first.payload));
    snapshots.push(loopSnapshot(first.payload));
    search = first.payload.search || {};

    messages.push({ role: "user", content: copy.correction });
    transcript.push({ role: "user", content: copy.correction });

    const second = await callAssistant({ language, messages, search });
    totalDurationMs += second.durationMs;
    assertLanguage(second.payload.answer, language, 2);
    transcript.push(transcriptAssistant(second.payload));
    snapshots.push(loopSnapshot(second.payload));

    assert(second.payload.action === "search_rooms", `correction did not trigger search_rooms (got ${second.payload.action})`);
    assert(second.payload.search?.checkin === "2026-09-16", `correction checkin not applied: ${second.payload.search?.checkin}`);
    assert(second.payload.search?.checkout === "2026-09-19", `correction checkout not applied: ${second.payload.search?.checkout}`);
    assert(Number(second.payload.search?.guests) === 4, `correction guests not applied: ${second.payload.search?.guests}`);
    assert(isTerminalAction(second.payload), "corrected journey did not end in a visible CTA/outcome");
    assertNoLoop(snapshots);

    const offers = Array.isArray(second.payload.offers) ? second.payload.offers : [];
    if (offers.length) validateOffers(offers, 4);

    return {
      totalDurationMs,
      firstSearch: first.payload.search,
      correctedSearch: second.payload.search,
      finalAction: second.payload.action,
      offers: offers.length,
      receptionHandoffOffered: second.payload.receptionHandoffOffered === true,
      transcript,
    };
  } catch (error) {
    throw attachDebug(error, { totalDurationMs, transcript });
  }
}

async function runGeneralJourney(language) {
  const messages = [{ role: "user", content: L[language].general }];
  const transcript = [...messages];
  let durationMs = 0;

  try {
    const result = await callAssistant({ language, messages });
    durationMs = result.durationMs;
    const { payload } = result;
    transcript.push(transcriptAssistant(payload));
    assertLanguage(payload.answer, language, 1);
    assert(payload.action === "respond", `general question expected respond, got ${payload.action}`);
    assert(!payload.bookingConfirmed, "general response falsely confirmed a booking");
    return { totalDurationMs: durationMs, finalAction: payload.action, answer: payload.answer, transcript };
  } catch (error) {
    throw attachDebug(error, { totalDurationMs: durationMs, transcript });
  }
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

const scenarios = [
  ...Object.keys(L).map((language) => ({ id: `${language}-full-human-booking-flow`, type: "booking", language })),
  ...Object.keys(L).map((language) => ({ id: `${language}-human-correction-flow`, type: "correction", language })),
  ...Object.keys(L).map((language) => ({ id: `${language}-general-answer-language`, type: "general", language })),
  { id: "unsafe-booking-blocked", type: "unsafe" },
];

async function runScenario(scenario) {
  if (scenario.type === "booking") return runBookingJourney(scenario.language);
  if (scenario.type === "correction") return runCorrectionJourney(scenario.language);
  if (scenario.type === "general") return runGeneralJourney(scenario.language);
  return runUnsafeBookingScenario();
}

async function main() {
  console.log(`AI concierge human-journey QA target: ${BASE_URL}`);
  console.log(`Running ${scenarios.length} multi-turn scenarios.`);

  const report = {
    version: 3,
    purpose: "Human-like multi-turn QA: language consistency, visible CTA/action, progress-aware loop detection, corrections and safety",
    target: BASE_URL,
    startedAt: new Date().toISOString(),
    criteria: {
      languageConsistency: "Every assistant answer is inspected; shared hospitality terms do not create false failures",
      terminalAction: "Booking journeys must finish with room offers or a visible reception/Email/WhatsApp handoff",
      loopDetection: `Repeated text is a loop only when conversation state does not progress; completion required within ${MAX_TURNS} turns`,
      correctionHandling: "Changed dates and guests must replace prior values",
      failureEvidence: "Failed scenarios retain the complete transcript and last parsed state",
    },
    total: scenarios.length,
    passed: 0,
    failed: 0,
    results: [],
  };

  for (const scenario of scenarios) {
    const started = Date.now();
    try {
      const details = await runScenario(scenario);
      report.passed += 1;
      report.results.push({ id: scenario.id, type: scenario.type, language: scenario.language, status: "pass", durationMs: Date.now() - started, details });
      console.log(`✓ ${scenario.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      report.failed += 1;
      report.results.push({
        id: scenario.id,
        type: scenario.type,
        language: scenario.language,
        status: "fail",
        durationMs: Date.now() - started,
        error: message,
        details: error?.qaDetails || undefined,
      });
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
