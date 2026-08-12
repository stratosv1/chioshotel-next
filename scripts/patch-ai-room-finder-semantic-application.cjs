const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "app/api/ai-assistant/route.ts");
let source = fs.readFileSync(file, "utf8");

if (!source.includes("function semanticLastAcceptedField")) {
  const anchor = 'function applyDecision(current: SearchState, decision: AiDecision): SearchState {';
  if (!source.includes(anchor)) throw new Error("applyDecision signature not found");

  const helpers = `function semanticLastAcceptedField(value: unknown): SearchField | null {
  if (!value || typeof value !== "object") return null;
  const field = (value as { lastAcceptedField?: unknown }).lastAcceptedField;
  return field === "checkin" || field === "checkout" || field === "guests" ? field : null;
}

function decisionHasReplacement(decision: AiDecision, field: SearchField) {
  if (field === "checkin") return isIsoDate(decision.checkin);
  if (field === "checkout") return isIsoDate(decision.checkout);
  return decision.guests >= 1 && decision.guests <= 5;
}

`;

  source = source.replace(
    anchor,
    `${helpers}function applyDecision(current: SearchState, decision: AiDecision, roomFinderContext?: unknown): SearchState {`,
  );

  const clearAnchor = '  const clearedFields = new Set<SearchField>(decision.clearFields || []);';
  if (!source.includes(clearAnchor)) throw new Error("clearedFields anchor not found");
  source = source.replace(
    clearAnchor,
    `${clearAnchor}

  // The model owns semantic intent. The state machine owns how that intent mutates booking state.
  // If AI says this turn is an edit but omits an explicit replacement value, undo the
  // last accepted booking field from structured conversation context. No user phrase matching.
  const lastAcceptedField = semanticLastAcceptedField(roomFinderContext);
  if (!restarting && decision.intent === "edit_search" && lastAcceptedField && !decisionHasReplacement(decision, lastAcceptedField)) {
    clearedFields.add(lastAcceptedField);
    if (lastAcceptedField === "checkin") clearedFields.add("checkout");
  }`,
  );

  const callAnchor = '    const interpretedSearch = applyDecision(current, decision);';
  if (!source.includes(callAnchor)) throw new Error("applyDecision call not found");
  source = source.replace(
    callAnchor,
    '    const interpretedSearch = applyDecision(current, decision, body?.roomFinderContext);',
  );
}

if (!source.includes('decision.intent === "edit_search" && lastAcceptedField') || !source.includes('body?.roomFinderContext')) {
  throw new Error("Semantic application patch did not apply");
}

fs.writeFileSync(file, source);
console.log("AI edit intent is now applied deterministically from structured Room Finder context");
