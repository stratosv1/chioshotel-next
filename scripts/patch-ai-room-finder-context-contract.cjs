const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "app/api/ai-assistant/route.ts");
let source = fs.readFileSync(file, "utf8");

function replaceOnce(from, to, label) {
  if (source.includes(to)) return;
  if (!source.includes(from)) throw new Error(`${label} anchor not found`);
  source = source.replace(from, to);
}

// The model, not phrase matching, tells us whether the user explicitly targeted a booking field.
// This lets the deterministic state machine distinguish a bare answer to the current question
// from an explicit request to edit another field.
replaceOnce(
  '  nights: number;\n  clearFields: SearchField[];',
  '  nights: number;\n  targetField: "checkin" | "checkout" | "guests" | "nights" | "none";\n  clearFields: SearchField[];',
  'AiDecision targetField',
);

const promptAnchor = '                "For a bare or natural date, roomFinderContext.currentStep is authoritative when present: checkin means the date is check-in; checkout means the date is check-out, unless the latest message semantically says it is correcting another field.",';
if (!source.includes('"targetField describes whether the latest message explicitly names')) {
  if (!source.includes(promptAnchor)) throw new Error("contextual date prompt anchor not found");
  source = source.replace(
    promptAnchor,
    `${promptAnchor}\n                "targetField describes whether the latest message explicitly names or unambiguously targets checkin, checkout, guests or nights. Use none when the user merely supplies a value in response to the active question without explicitly targeting another field.",\n                "When targetField is none and roomFinderContext.currentStep is checkin or checkout, extract a date into that current step. Chronological validity is NOT an interpretation task; the server validates date order afterwards.",\n                "Never reinterpret an otherwise understandable checkout answer as a check-in correction merely because it is before the current check-in, too far away, or otherwise invalid. Preserve the user's intended field and let deterministic validation reject it.",\n                "For partial dates without a year, resolve the calendar date naturally from today and the user's wording. Do not move the year forward solely to make a checkout valid relative to the current check-in.",`,
  );
}

replaceOnce(
  '                nights: { type: "integer", minimum: 0, maximum: 30 },\n                clearFields:',
  '                nights: { type: "integer", minimum: 0, maximum: 30 },\n                targetField: { type: "string", enum: ["checkin", "checkout", "guests", "nights", "none"] },\n                clearFields:',
  'schema targetField',
);

replaceOnce(
  '              required: ["intent", "language", "checkin", "checkout", "guests", "nights", "clearFields", "answer"],',
  '              required: ["intent", "language", "checkin", "checkout", "guests", "nights", "targetField", "clearFields", "answer"],',
  'schema required targetField',
);

if (!source.includes('function normalizeDecisionForRoomFinderContext')) {
  const anchor = 'function applyDecision(current: SearchState, decision: AiDecision, roomFinderContext?: unknown): SearchState {';
  if (!source.includes(anchor)) throw new Error("semantic applyDecision anchor not found");
  const helper = `function currentDateStep(value: unknown): "checkin" | "checkout" | null {
  if (!value || typeof value !== "object") return null;
  const step = (value as { currentStep?: unknown }).currentStep;
  return step === "checkin" || step === "checkout" ? step : null;
}

function normalizeDecisionForRoomFinderContext(decision: AiDecision, roomFinderContext?: unknown): AiDecision {
  const step = currentDateStep(roomFinderContext);
  if (!step || decision.targetField !== "none") return decision;

  // If the user simply answered the active date question, the active UI step owns the field.
  // We rely only on the model's structured semantics and the state machine context — never on
  // matching user wording. This also prevents invalid checkout dates from erasing check-in.
  const date = step === "checkin"
    ? (isIsoDate(decision.checkin) ? decision.checkin : isIsoDate(decision.checkout) ? decision.checkout : "")
    : (isIsoDate(decision.checkout) ? decision.checkout : isIsoDate(decision.checkin) ? decision.checkin : "");

  if (!date) return decision;

  return {
    ...decision,
    intent: "booking_input",
    checkin: step === "checkin" ? date : "",
    checkout: step === "checkout" ? date : "",
    clearFields: (decision.clearFields || []).filter(field => field !== "checkin" && field !== "checkout"),
  };
}

`;
  source = source.replace(anchor, `${helper}${anchor}`);
}

replaceOnce(
  '    const decision = await askAiToDecide(messages, current, body?.language, body?.roomFinderContext);',
  '    const rawDecision = await askAiToDecide(messages, current, body?.language, body?.roomFinderContext);\n    const decision = normalizeDecisionForRoomFinderContext(rawDecision, body?.roomFinderContext);',
  'normalize structured decision',
);

// Date validation owns chronology. When it rejects a date, remove any duration calculated
// from that rejected pair so later turns never inherit stale or negative nights.
replaceOnce(
  '  if (!isIsoDate(next.checkin) || next.checkin < todayIso()) {\n    next.checkin = null;\n    return { action: "ask_user", answer: copy.invalidCheckin, search: next };\n  }',
  '  if (!isIsoDate(next.checkin) || next.checkin < todayIso()) {\n    next.checkin = null;\n    next.checkout = null;\n    next.nights = null;\n    return { action: "ask_user", answer: copy.invalidCheckin, search: next };\n  }',
  'invalid checkin state cleanup',
);

replaceOnce(
  '  if (!isIsoDate(next.checkout) || next.checkout <= next.checkin) {\n    next.checkout = null;\n    return { action: "ask_user", answer: copy.invalidCheckout, search: next };\n  }',
  '  if (!isIsoDate(next.checkout) || next.checkout <= next.checkin) {\n    next.checkout = null;\n    next.nights = null;\n    return { action: "ask_user", answer: copy.invalidCheckout, search: next };\n  }',
  'invalid checkout state cleanup',
);

replaceOnce(
  '  if (nights > MAX_NIGHTS) {\n    next.checkout = null;\n    return { action: "ask_user", answer: copy.stayTooLong, search: next };\n  }',
  '  if (nights > MAX_NIGHTS) {\n    next.checkout = null;\n    next.nights = null;\n    return { action: "ask_user", answer: copy.stayTooLong, search: next };\n  }',
  'long stay state cleanup',
);

if (!source.includes('targetField: { type: "string"') || !source.includes('normalizeDecisionForRoomFinderContext(rawDecision') || !source.includes('next.nights = null;')) {
  throw new Error("Room Finder contextual semantic contract did not apply");
}

fs.writeFileSync(file, source);
console.log("AI Room Finder contextual date contract applied: semantic target + deterministic validation");
