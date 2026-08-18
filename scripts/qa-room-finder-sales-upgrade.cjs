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

const root = process.cwd();
const datePath = path.join(root, "lib/ai-assistant/room-finder-date.ts");
const fallbackPath = path.join(root, "lib/ai-assistant/room-finder-fallback.ts");
const salesPath = path.join(root, "components/ai/room-finder-sales-intelligence.ts");
const offerPlanPath = path.join(root, "components/ai/room-finder-offer-plan.ts");
const hookPath = path.join(root, "components/ai/use-room-finder.ts");
const carouselPath = path.join(root, "components/ai/room-finder-carousel.tsx");
const intentPath = path.join(root, "lib/ai-assistant/room-finder-intent.ts");
const alternativesPath = path.join(root, "app/api/ai-room-finder/alternatives/route.ts");
const tonePath = path.join(root, "components/ai/room-finder-tone.ts");
const catalogPath = path.join(root, "lib/ai-assistant/room-card-catalog.ts");

const dateUtils = executeCommonJs(transpile(datePath));
const fallback = executeCommonJs(transpile(fallbackPath), id => {
  if (id === "./room-finder-date") return dateUtils;
  return require(id);
});
const sales = executeCommonJs(transpile(salesPath));
const offerPlan = executeCommonJs(transpile(offerPlanPath));

const checkin = fallback.fallbackRoomFinderCommand("10/10", {
  language: "el",
  currentStep: "checkin",
});
assert(checkin?.actions?.some(action => action.checkin?.endsWith("-10-10")), "deterministic fallback did not parse a simple European check-in date");

const oneTurn = fallback.fallbackRoomFinderCommand("10/10-12/10, 1 δωμάτιο, 2 άτομα, χωρίς σκάλες", {
  language: "el",
  currentStep: "checkin",
});
assert(oneTurn?.actions?.some(action => action.roomCount === 1), "fallback lost room count");
assert(oneTurn?.actions?.some(action => action.totalGuests === 2), "fallback lost total guest count");
assert(oneTurn?.actions?.some(action => action.preferences?.includes("no_stairs")), "fallback lost no-stairs preference");

const pastDate = fallback.fallbackRoomFinderCommand("10/08/2020", {
  language: "el",
  currentStep: "checkin",
});
assert(!pastDate?.actions?.some(action => action.checkin), "fallback accepted a past check-in date");

const preferenceRemoval = fallback.fallbackRoomFinderCommand("δεν με νοιάζει πια το οικονομικό", {
  language: "el",
  currentStep: "selecting",
  preferences: ["budget"],
});
assert(!preferenceRemoval?.actions?.some(action => action.type === "set_preferences"), "fallback incorrectly treated preference removal as a positive preference");

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

const hookSource = fs.readFileSync(hookPath, "utf8");
assert(hookSource.includes("/api/ai-room-finder/alternatives"), "production hook does not call nearby-date availability fallback");
assert(hookSource.includes("languageRef.current !== language"), "language-change state preservation guard is missing");
assert(hookSource.includes("INVENTORY_UNAVAILABLE[language]"), "technical inventory failure is not separated from no-availability copy");
assert(hookSource.includes("answerRoomQuestion"), "room-feature Q&A is not wired into production hook");

const carouselSource = fs.readFileSync(carouselPath, "utf8");
assert(carouselSource.includes("Recommended for you"), "recommended-room sales badge is missing");
assert(carouselSource.includes("Nearby available dates"), "nearby-date card label is missing");

const intentSource = fs.readFileSync(intentPath, "utf8");
assert(intentSource.includes('"set_preferences"'), "AI interpreter preference action is missing");
assert(intentSource.includes("Preferences are SOFT ranking signals"), "AI prompt does not protect availability from preference filtering");

const alternativesSource = fs.readFileSync(alternativesPath, "utf8");
assert(alternativesSource.includes("nights > 60"), "nearby-date fallback stay limit is inconsistent with the 60-night Room Finder contract");
assert(!alternativesSource.includes("Promise.all(candidates"), "nearby-date fallback still fans out all candidate windows in parallel");
assert(alternativesSource.includes("ALTERNATIVES_DATA_UNAVAILABLE"), "nearby-date fallback can still collapse unverified inventory into false no-availability");

const toneSource = fs.readFileSync(tonePath, "utf8");
assert(!toneSource.includes("no nearby automatic alternative"), "no-availability copy still claims nearby dates were checked in all cases");
assert(!toneSource.includes("ούτε κοντινή αυτόματη εναλλακτική"), "Greek no-availability copy still claims nearby dates were checked in all cases");

const catalogSource = fs.readFileSync(catalogPath, "utf8");
assert(catalogSource.includes('roomNumber: 6') && catalogSource.includes('Garden access'), "canonical room catalog no longer supports the room 6 garden trait QA assumption");

console.log("Room Finder sales upgrade QA passed: rescue safety, factual no-availability, preserved state, soft recommendations, room Q&A and nearby-date fallback are wired safely.");
