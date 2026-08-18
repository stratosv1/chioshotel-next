#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function occurrences(text, value) {
  return text.split(value).length - 1;
}

function transpile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const result = ts.transpileModule(source, {
    fileName: filePath,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  });
  const errors = (result.diagnostics || []).filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error);
  if (errors.length) {
    throw new Error(errors.map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")).join("\n"));
  }
  return result.outputText;
}

function executeCommonJs(outputText, localRequire = require) {
  const module = { exports: {} };
  const fn = new Function("exports", "module", "require", outputText);
  fn(module.exports, module, localRequire);
  return module.exports;
}

function fact(actions, key) {
  return [...actions].reverse().find(action => action?.[key] != null)?.[key];
}

const root = process.cwd();
const datePath = path.join(root, "lib/ai-assistant/room-finder-date.ts");
const fallbackPath = path.join(root, "lib/ai-assistant/room-finder-fallback.ts");
const flowPath = path.join(root, "components/ai/room-finder-booking-flow.ts");
const salesPath = path.join(root, "components/ai/room-finder-sales-intelligence.ts");
const offerPlanPath = path.join(root, "components/ai/room-finder-offer-plan.ts");
const nearbyPath = path.join(root, "components/ai/room-finder-nearby.ts");
const hookPath = path.join(root, "components/ai/use-room-finder.ts");
const productionPath = path.join(root, "components/ai/RoomFinderProduction.tsx");
const carouselPath = path.join(root, "components/ai/room-finder-carousel.tsx");
const intentPath = path.join(root, "lib/ai-assistant/room-finder-intent.ts");
const interpretRoutePath = path.join(root, "app/api/ai-assistant/interpret/route.ts");
const alternativesPath = path.join(root, "app/api/ai-room-finder/alternatives/route.ts");
const tonePath = path.join(root, "components/ai/room-finder-tone.ts");
const catalogPath = path.join(root, "lib/ai-assistant/room-card-catalog.ts");

const dateUtils = executeCommonJs(transpile(datePath));
const fallback = executeCommonJs(transpile(fallbackPath), id => {
  if (id === "./room-finder-date") return dateUtils;
  return require(id);
});
const flow = executeCommonJs(transpile(flowPath), id => {
  if (id === "@/lib/ai-assistant/room-finder-date") return dateUtils;
  return require(id);
});
const sales = executeCommonJs(transpile(salesPath));
const offerPlan = executeCommonJs(transpile(offerPlanPath));
const nearby = executeCommonJs(transpile(nearbyPath));

function commandFor(message, context) {
  const command = fallback.fallbackRoomFinderCommand(message, context);
  assert(command?.actions?.length, `deterministic parser returned no actions for: ${message}`);
  return command;
}

const checkin = commandFor("10/10", { language: "el", currentStep: "checkin" });
assert(checkin.actions.some(action => action.checkin?.endsWith("-10-10")), "simple European check-in date failed");

const screenshotMessage = "Θέλω 10–13 Σεπτεμβρίου για 2 άτομα, ένα δωμάτιο, κατά προτίμηση ισόγειο χωρίς σκάλες";
const screenshotContext = { language: "el", currentStep: "checkin", preferences: [] };
const screenshotCommand = commandFor(screenshotMessage, screenshotContext);
assert(String(fact(screenshotCommand.actions, "checkin")).endsWith("-09-10"), "screenshot regression lost named-month check-in");
assert(String(fact(screenshotCommand.actions, "checkout")).endsWith("-09-13"), "screenshot regression lost named-month check-out");
assert(Number(fact(screenshotCommand.actions, "roomCount")) === 1, "screenshot regression lost written room count");
assert(Number(fact(screenshotCommand.actions, "totalGuests")) === 2, "screenshot regression lost guest count");
const screenshotPreferences = [...screenshotCommand.actions].reverse().find(action => action.type === "set_preferences")?.preferences || [];
assert(screenshotPreferences.includes("ground_floor") && screenshotPreferences.includes("no_stairs"), "screenshot regression lost ground-floor/no-stairs preferences");
assert(
  fallback.canUseDeterministicCommandDirectly(screenshotMessage, screenshotContext, screenshotCommand),
  "screenshot regression would still wait for the AI interpreter instead of using the safe fast path",
);

const screenshotResolution = flow.resolveAssistantTurn(
  flow.createInitialBookingFlowState(),
  screenshotCommand,
);
assert(screenshotResolution.outcome.kind === "ready", "screenshot regression did not become a ready booking search");
assert(screenshotResolution.state.step === "searching", "screenshot regression did not move directly to searching");
assert(screenshotResolution.state.draft.groups[0] === 2, "screenshot regression did not allocate 2 guests to the one room");

const namedRangeCases = [
  ["el", "10 έως 13 Σεπτεμβρίου, ένα δωμάτιο, δύο άτομα"],
  ["en", "September 10-13, one room, two people"],
  ["de", "10-13 September, ein Zimmer, zwei Personen"],
  ["fr", "10 au 13 septembre, une chambre, deux personnes"],
  ["it", "10 al 13 settembre, una camera, due persone"],
  ["es", "10 al 13 septiembre, una habitación, dos personas"],
  ["tr", "10-13 Eylül, bir oda, iki kişi"],
];

for (const [language, message] of namedRangeCases) {
  const context = { language, currentStep: "checkin" };
  const command = commandFor(message, context);
  assert(String(fact(command.actions, "checkin")).endsWith("-09-10"), `${language}: named range check-in failed`);
  assert(String(fact(command.actions, "checkout")).endsWith("-09-13"), `${language}: named range check-out failed`);
  assert(Number(fact(command.actions, "roomCount")) === 1, `${language}: written one-room count failed`);
  assert(Number(fact(command.actions, "totalGuests")) === 2, `${language}: written two-guests count failed`);
  assert(fallback.canUseDeterministicCommandDirectly(message, context, command), `${language}: safe deterministic fast path was rejected`);
}

const pastDate = fallback.fallbackRoomFinderCommand("10/08/2020", {
  language: "el",
  currentStep: "checkin",
});
assert(!pastDate?.actions?.some(action => action.checkin), "deterministic parser accepted a past check-in date");

const preferenceRemoval = commandFor("δεν με νοιάζει πια το οικονομικό", {
  language: "el",
  currentStep: "selecting",
  preferences: ["budget"],
});
const removalAction = preferenceRemoval.actions.find(action => action.type === "set_preferences");
assert(removalAction && Array.isArray(removalAction.preferences) && removalAction.preferences.length === 0, "preference removal did not clear the existing budget preference");

const ambiguousPreferenceRemoval = fallback.fallbackRoomFinderCommand(
  "θέλω ισόγειο χωρίς σκάλες, η τιμή δεν με νοιάζει",
  { language: "el", currentStep: "selecting", preferences: ["budget"] },
);
assert(
  !ambiguousPreferenceRemoval?.actions?.some(action => action.type === "set_preferences"),
  "conservative fallback guessed a mixed preference-removal instruction instead of deferring to AI",
);

const pureRoomQuestion = fallback.fallbackRoomFinderCommand("Ποιο έχει κήπο;", {
  language: "el",
  currentStep: "selecting",
  preferences: [],
});
assert(!pureRoomQuestion, "pure room-feature question was incorrectly converted into a preference mutation");

const correctionPlusQuestion = commandFor("τελικά 3 άτομα, ποιο έχει κήπο;", {
  language: "el",
  currentStep: "selecting",
  roomCount: 1,
  totalGuests: 2,
  guestGroups: [2],
});
assert(Number(fact(correctionPlusQuestion.actions, "totalGuests")) === 3, "combined correction + room question lost the booking correction");

const ambiguousDownstreamDate = fallback.fallbackRoomFinderCommand("11/10", {
  language: "el",
  currentStep: "selecting",
  checkin: "2026-10-10",
  checkout: "2026-10-12",
});
assert(!ambiguousDownstreamDate?.actions?.some(action => action.checkin || action.checkout), "bare downstream date was deterministically assigned instead of being left for AI clarification");

const ambiguousNamedDate = commandFor("Αρχές Οκτωβρίου, 2 άτομα", {
  language: "el",
  currentStep: "checkin",
});
assert(Number(fact(ambiguousNamedDate.actions, "totalGuests")) === 2, "clear guest fact was lost beside an ambiguous named date");
assert(
  !fallback.canUseDeterministicCommandDirectly("Αρχές Οκτωβρίου, 2 άτομα", { language: "el", currentStep: "checkin" }, ambiguousNamedDate),
  "ambiguous named date incorrectly bypasses the AI clarification path",
);

const roomFiveScore = sales.roomPreferenceScore(5, ["no_stairs", "ground_floor"]);
const roomOneScore = sales.roomPreferenceScore(1, ["no_stairs", "ground_floor"]);
assert(roomFiveScore > roomOneScore, "preference ranking does not prioritize a factual no-stairs ground-floor room");
assert(sales.roomPreferenceScore(6, ["garden"]) > 0, "room 6 garden access is missing from sales traits");

const answer = sales.answerRoomQuestion("Ποιο είναι χωρίς σκάλες;", "el", [
  { roomNumber: 1, name: "Δωμάτιο 1" },
  { roomNumber: 5, name: "Δωμάτιο 5" },
]);
assert(answer && answer.includes("Δωμάτιο 5") && !answer.includes("Δωμάτιο 1,"), "room-feature Q&A did not answer from deterministic room traits");

const gardenAnswer = sales.answerRoomQuestion("Ποιο έχει κήπο;", "el", [
  { roomNumber: 6, name: "Δωμάτιο 6" },
  { roomNumber: 6, name: "Δωμάτιο 6" },
  { roomNumber: 7, name: "Δωμάτιο 7" },
  { roomNumber: 0, name: "Split stay" },
]);
assert(gardenAnswer?.includes("Δωμάτιο 6") && gardenAnswer?.includes("Δωμάτιο 7"), "garden Q&A omitted a factual available room");
assert(occurrences(gardenAnswer || "", "Δωμάτιο 6") === 1, "room Q&A duplicated the same physical room");
assert(!gardenAnswer?.includes("Split stay"), "room Q&A treated a composite split-stay offer as a physical room");
assert(sales.answerRoomQuestion("Έχει κουζίνα;", "el", [{ roomNumber: 0, name: "Split stay" }]) === null, "room Q&A invented traits for a split-stay composite");

const alternativeA = { roomId: "267788", unitId: "1", alternativeCheckin: "2026-10-09" };
const alternativeB = { roomId: "267788", unitId: "1", alternativeCheckin: "2026-10-11" };
assert(offerPlan.roomOfferKey(alternativeA) !== offerPlan.roomOfferKey(alternativeB), "nearby-date offers for the same physical room collapse to one identity");

const nearbySuccess = nearby.classifyNearbyPayload(true, { success: true, alternatives: [] });
assert(nearbySuccess.status === "ok", "valid empty nearby result is not distinguished from a technical failure");
const nearbyFailure = nearby.classifyNearbyPayload(false, { success: false, code: "ALTERNATIVES_DATA_UNAVAILABLE" });
assert(nearbyFailure.status === "unavailable" && nearbyFailure.code === "ALTERNATIVES_DATA_UNAVAILABLE", "technical nearby failure collapses into an empty no-availability result");

const hookSource = fs.readFileSync(hookPath, "utf8");
assert(hookSource.includes("classifyNearbyPayload"), "production hook does not use typed nearby-result classification");
assert(hookSource.includes('nearby.status === "unavailable"'), "production hook does not separate nearby technical failure from genuine no availability");
assert(!hookSource.includes("for (let attempt = 0; attempt < 2"), "production hook still performs a second long AI retry per user turn");
assert(hookSource.includes("fallbackRoomFinderCommand(value, conversationContext(current))"), "production hook does not protect booking corrections from room-Q&A interception");

const productionSource = fs.readFileSync(productionPath, "utf8");
assert(productionSource.includes('if (finder.typing || finder.step === "searching") return;'), "language changes are not guarded while an active Room Finder turn is running");
assert(productionSource.includes('disabled={finder.typing || finder.step === "searching"}'), "language selector is not disabled during active Room Finder turns");

const carouselSource = fs.readFileSync(carouselPath, "utf8");
assert(carouselSource.includes("Recommended for you"), "recommended-room sales badge is missing");
assert(carouselSource.includes("Nearby available dates"), "nearby-date card label is missing");

const intentSource = fs.readFileSync(intentPath, "utf8");
assert(intentSource.includes('"set_preferences"'), "AI interpreter preference action is missing");
assert(intentSource.includes("Preferences are SOFT ranking signals"), "AI prompt does not protect availability from preference filtering");

const routeSource = fs.readFileSync(interpretRoutePath, "utf8");
const deterministicIndex = routeSource.indexOf("canUseDeterministicCommandDirectly");
const aiIndex = routeSource.lastIndexOf("interpretRoomFinderMessage(message, context)");
assert(deterministicIndex >= 0 && aiIndex > deterministicIndex, "interpret route does not attempt the deterministic fast path before the AI call");
assert(routeSource.includes('source: "deterministic-rescue"'), "interpret route no longer identifies deterministic rescue separately");

const alternativesSource = fs.readFileSync(alternativesPath, "utf8");
assert(alternativesSource.includes("nights > 60"), "nearby-date fallback stay limit is inconsistent with the 60-night Room Finder contract");
assert(!alternativesSource.includes("Promise.all(candidates"), "nearby-date fallback still fans out all candidate windows in parallel");
assert(alternativesSource.includes("ALTERNATIVES_DATA_UNAVAILABLE"), "nearby-date endpoint can still collapse unverified inventory into false no-availability");

const toneSource = fs.readFileSync(tonePath, "utf8");
assert(!toneSource.includes("no nearby automatic alternative"), "no-availability copy still claims nearby dates were checked in all cases");
assert(!toneSource.includes("ούτε κοντινή αυτόματη εναλλακτική"), "Greek no-availability copy still claims nearby dates were checked in all cases");

const catalogSource = fs.readFileSync(catalogPath, "utf8");
assert(catalogSource.includes('roomNumber: 6') && catalogSource.includes('Garden access'), "canonical room catalog no longer supports the room 6 garden trait QA assumption");

console.log("Room Finder master sales QA passed: screenshot regression, multilingual deterministic parsing, parser→state integration, preference safety, Q&A priority and nearby technical-state separation are verified.");
