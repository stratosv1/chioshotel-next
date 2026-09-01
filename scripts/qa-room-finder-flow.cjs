#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function assert(condition, message) {
  if (!condition) throw new Error(message);
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

  const errors = (result.diagnostics || []).filter(
    diagnostic => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  if (errors.length) {
    const text = errors
      .map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
      .join("\n");
    throw new Error(`TypeScript transpile error in ${path.basename(filePath)}:\n${text}`);
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
const flowPath = path.join(root, "components/ai/room-finder-booking-flow.ts");
const offerPlanPath = path.join(root, "components/ai/room-finder-offer-plan.ts");
const productionPath = path.join(root, "components/ai/RoomFinderProduction.tsx");
const copyPath = path.join(root, "components/ai/room-finder-copy.ts");
const flowHelpersPath = path.join(root, "components/ai/room-finder-flow-helpers.ts");
const legacyFlowPath = path.join(root, "components/ai/AiRoomFinderFlow.tsx");

const dateUtils = executeCommonJs(transpile(datePath));
const flow = executeCommonJs(transpile(flowPath), id => {
  if (id === "@/lib/ai-assistant/room-finder-date") return dateUtils;
  return require(id);
});
const offerPlan = executeCommonJs(transpile(offerPlanPath));

const {
  bookingFlowReducer,
  createInitialBookingFlowState,
  nextMissingGuestRoom,
  resolveAssistantTurn,
} = flow;
const { feasibleOffersForGroup, hasDistinctOfferPlan, roomOfferKey } = offerPlan;

function command(actions, replyMode = "execute") {
  return { language: "el", replyMode, actions };
}

function fullDraft(overrides = {}) {
  return {
    checkin: "2026-10-10",
    checkout: "2026-10-12",
    roomCount: 1,
    totalGuests: 2,
    groups: [2],
    ...overrides,
  };
}

function offer(id) {
  return { roomId: `room-${id}`, unitId: `unit-${id}` };
}

function testStrictDates() {
  assert(dateUtils.isStrictIsoDate("2026-10-10"), "valid ISO date rejected");
  assert(!dateUtils.isStrictIsoDate("2026-02-31"), "impossible February date accepted");
  assert(!dateUtils.isStrictIsoDate("2026-02-29"), "non-leap-year February 29 accepted");
  assert(dateUtils.isStrictIsoDate("2028-02-29"), "valid leap-day rejected");
  assert(
    dateUtils.todayInAthensIso(new Date("2026-08-13T21:30:00Z")) === "2026-08-14",
    "Europe/Athens local date is not used across UTC midnight",
  );
}

function testFullOneTurnBooking() {
  const result = resolveAssistantTurn(
    createInitialBookingFlowState(),
    command([
      { type: "set_stay_dates", checkin: "2026-10-10", checkout: "2026-10-12" },
      { type: "set_room_count", roomCount: 1 },
      { type: "set_guest_count", totalGuests: 2 },
    ]),
  );

  assert(result.outcome.kind === "ready", "full one-turn booking did not become ready");
  assert(result.state.step === "searching", "ready booking did not move to searching");
  assert(result.state.draft.groups.length === 1 && result.state.draft.groups[0] === 2, "one-room total guests were not allocated");
  assert(result.state.draft.totalGuests === 2, "one-room total guest count was lost");
  assert(result.changed === true, "full booking was not marked changed");
}

function testMultiRoomTotalIsNotGuessed() {
  const result = resolveAssistantTurn(
    createInitialBookingFlowState(),
    command([
      { type: "set_stay_dates", checkin: "2026-10-10", checkout: "2026-10-12" },
      { type: "set_room_count", roomCount: 2 },
      { type: "set_guest_count", totalGuests: 4 },
    ]),
  );

  assert(result.outcome.kind === "prompt" && result.outcome.field === "guests", "multi-room total did not request room allocation");
  assert(result.outcome.guestRoom === 1, "multi-room allocation did not start at room 1");
  assert(result.state.draft.groups.length === 0, "multi-room total invented a room split");
  assert(result.state.draft.totalGuests === 4, "multi-room totalGuests was not preserved");

  const allocated = resolveAssistantTurn(
    result.state,
    command([{ type: "set_guest_count", guestRoom: 1, guests: 3 }]),
  );
  assert(allocated.outcome.kind === "ready", "known total did not infer the last remaining room allocation");
  assert(allocated.state.draft.groups[0] === 3 && allocated.state.draft.groups[1] === 1, "remaining guest allocation was inferred incorrectly");
}

function testClarificationKeepsClearFacts() {
  const result = resolveAssistantTurn(
    createInitialBookingFlowState(),
    command([
      { type: "set_room_count", roomCount: 1 },
      { type: "set_guest_count", totalGuests: 2 },
      {
        type: "ask_clarification",
        query: "Ποια ακριβώς ημερομηνία θέλετε για check-in; π.χ. 10/10.",
        missingFields: ["checkin"],
      },
    ], "clarify"),
  );

  assert(result.outcome.kind === "clarification", "real ambiguity was not preserved");
  assert(result.state.step === "checkin", "clarification was not bound to check-in");
  assert(result.state.draft.roomCount === 1, "clear room count was lost during clarification");
  assert(result.state.draft.totalGuests === 2 && result.state.draft.groups[0] === 2, "clear guest facts were lost during clarification");
}

function testDownstreamCorrectionAndNoChange() {
  const selecting = { step: "selecting", draft: fullDraft() };
  const corrected = resolveAssistantTurn(
    selecting,
    command([{ type: "set_guest_count", totalGuests: 3 }]),
  );

  assert(corrected.changed === true, "downstream guest correction was not marked changed");
  assert(corrected.outcome.kind === "ready", "complete corrected booking did not request a fresh search");
  assert(corrected.state.draft.groups[0] === 3, "downstream guest correction did not update allocation");

  const unchanged = resolveAssistantTurn(selecting, command([{ type: "no_change" }]));
  assert(unchanged.changed === false, "no_change mutated the booking draft");
  assert(unchanged.outcome.kind === "unchanged", "downstream no_change would trigger a new search");
  assert(unchanged.state.step === "selecting", "downstream no_change changed the active step");
}

function testDownstreamDateClarification() {
  const selecting = { step: "selecting", draft: fullDraft() };
  const result = resolveAssistantTurn(
    selecting,
    command([{
      type: "ask_clarification",
      query: "Το 11/10 είναι το νέο check-in ή το νέο check-out;",
      missingFields: ["checkin", "checkout"],
    }], "clarify"),
  );

  assert(result.outcome.kind === "clarification", "downstream date ambiguity was ignored because old dates existed");
  assert(result.changed === false, "clarification without new facts mutated the draft");
}

function testInvalidDatesAndCheckoutOrder() {
  const impossible = resolveAssistantTurn(
    createInitialBookingFlowState(),
    command([{ type: "set_stay_dates", checkin: "2026-02-31" }]),
  );
  assert(impossible.state.draft.checkin === "", "impossible calendar date entered booking state");
  assert(impossible.outcome.kind === "prompt" && impossible.outcome.field === "checkin", "impossible date did not keep check-in unresolved");

  const backwards = resolveAssistantTurn(
    createInitialBookingFlowState(),
    command([{
      type: "set_stay_dates",
      checkin: "2026-10-12",
      checkout: "2026-10-10",
    }]),
  );
  assert(backwards.outcome.kind === "invalid_checkout", "checkout before check-in was not rejected");
  assert(backwards.state.draft.checkout === "", "invalid checkout was not cleared");
}

function testButtonAllocationPath() {
  let state = {
    step: "rooms",
    draft: {
      checkin: "2026-10-10",
      checkout: "2026-10-12",
      roomCount: null,
      totalGuests: null,
      groups: [],
    },
  };

  state = bookingFlowReducer(state, { type: "choose_rooms", roomCount: 2 });
  assert(state.step === "guests" && nextMissingGuestRoom(state.draft) === 1, "room buttons did not enter guest allocation");

  state = bookingFlowReducer(state, { type: "choose_guests", guests: 3 });
  assert(state.step === "guests" && nextMissingGuestRoom(state.draft) === 2, "first room guest choice skipped room 2");

  state = bookingFlowReducer(state, { type: "choose_guests", guests: 1 });
  assert(state.step === "searching", "completed button allocation did not start search");
  assert(state.draft.totalGuests === 4, "button allocation did not derive total guests");
}

function testDeterministicBackNavigation() {
  const checkoutBack = bookingFlowReducer({
    step: "checkout",
    draft: { checkin: "2026-10-10", checkout: "", roomCount: null, totalGuests: null, groups: [] },
  }, { type: "go_back" });
  assert(checkoutBack.step === "checkin", "checkout back did not target check-in");
  assert(checkoutBack.draft.checkin === "" && checkoutBack.draft.checkout === "", "checkout back did not clear the date dependency");

  const roomsBack = bookingFlowReducer({
    step: "rooms",
    draft: { checkin: "2026-10-10", checkout: "2026-10-12", roomCount: null, totalGuests: null, groups: [] },
  }, { type: "go_back" });
  assert(roomsBack.step === "checkout" && roomsBack.draft.checkout === "", "rooms back did not reopen checkout");
  assert(roomsBack.draft.checkin === "2026-10-10", "rooms back unnecessarily cleared check-in");

  const secondRoomGuestsBack = bookingFlowReducer({
    step: "guests",
    draft: { checkin: "2026-10-10", checkout: "2026-10-12", roomCount: 2, totalGuests: null, groups: [3] },
  }, { type: "go_back" });
  assert(secondRoomGuestsBack.step === "guests", "multi-room guest back left guest allocation");
  assert(nextMissingGuestRoom(secondRoomGuestsBack.draft) === 1, "multi-room guest back did not reopen the previous room");

  const firstRoomGuestsBack = bookingFlowReducer({
    step: "guests",
    draft: { checkin: "2026-10-10", checkout: "2026-10-12", roomCount: 2, totalGuests: 4, groups: [] },
  }, { type: "go_back" });
  assert(firstRoomGuestsBack.step === "rooms", "first guest step did not go back to rooms");
  assert(firstRoomGuestsBack.draft.roomCount === null && firstRoomGuestsBack.draft.groups.length === 0, "rooms back kept incompatible allocation state");

  const selectingBack = bookingFlowReducer({
    step: "selecting",
    draft: { checkin: "2026-10-10", checkout: "2026-10-12", roomCount: 2, totalGuests: 4, groups: [2, 2] },
  }, { type: "go_back" });
  assert(selectingBack.step === "guests", "selecting back did not return to guests");
  assert(nextMissingGuestRoom(selectingBack.draft) === 2, "selecting back did not reopen the last room guest allocation");
  assert(selectingBack.draft.totalGuests === null, "selecting back kept a derived total that could constrain correction");

  const breakfastBack = bookingFlowReducer({ step: "breakfast", draft: fullDraft() }, { type: "go_back" });
  assert(breakfastBack.step === "selecting", "breakfast back did not return to room selection");

  const completeBack = bookingFlowReducer({ step: "complete", draft: fullDraft() }, { type: "go_back" });
  assert(completeBack.step === "breakfast", "complete back did not return to breakfast");

  const unavailable = { step: "unavailable", draft: fullDraft() };
  assert(bookingFlowReducer(unavailable, { type: "go_back" }) === unavailable, "unavailable received an ambiguous generic back transition");

  const searching = { step: "searching", draft: fullDraft() };
  assert(bookingFlowReducer(searching, { type: "go_back" }) === searching, "searching allowed a race-prone back transition");

  const editDates = bookingFlowReducer({ step: "unavailable", draft: fullDraft() }, { type: "edit_dates" });
  assert(editDates.step === "checkin", "edit dates did not reopen check-in");
  assert(editDates.draft.checkin === "" && editDates.draft.checkout === "", "edit dates did not clear both dates");
  assert(editDates.draft.roomCount === 1 && editDates.draft.totalGuests === 2 && editDates.draft.groups[0] === 2, "edit dates lost unrelated booking facts");
}

function testMultiRoomOfferFeasibility() {
  const a = offer("a");
  const b = offer("b");
  const c = offer("c");

  assert(
    !hasDistinctOfferPlan([[a], [a]]),
    "two groups incorrectly accepted the same physical room as a complete plan",
  );
  assert(
    hasDistinctOfferPlan([[a], [a, b]]),
    "valid two-room combination was rejected",
  );
  assert(
    hasDistinctOfferPlan([[a, b], [a], [b, c]]),
    "valid three-room combination was rejected",
  );

  const safeFirstChoices = feasibleOffersForGroup([[a, b], [a]], 0, new Set());
  assert(
    safeFirstChoices.length === 1 && roomOfferKey(safeFirstChoices[0]) === roomOfferKey(b),
    "first-group options include a choice that would dead-end the second group",
  );

  const reserved = new Set([roomOfferKey(a)]);
  const secondChoices = feasibleOffersForGroup([[a, b], [a, b, c]], 1, reserved);
  assert(
    secondChoices.every(candidate => roomOfferKey(candidate) !== roomOfferKey(a)),
    "already selected room remained available to a later group",
  );
}

function testResultsUxCleanup() {
  const production = fs.readFileSync(productionPath, "utf8");
  const copy = fs.readFileSync(copyPath, "utf8");
  const helpers = fs.readFileSync(flowHelpersPath, "utf8");

  assert(!production.includes("FeedbackArea"), "results feedback flow was reintroduced");
  assert(!production.includes("whatsappTurn"), "WhatsApp still uses a synthetic chat turn");
  assert(!production.includes("handoff"), "WhatsApp handoff bubble was reintroduced");
  assert(!copy.includes("RoomFinderFilter"), "removed room filters remain in Room Finder copy contract");
  assert(!copy.includes("feedbackQ"), "removed feedback copy remains in Room Finder copy contract");
  assert(!helpers.includes("matchesRoomFilter"), "removed filter-matching logic remains in flow helpers");
  assert(!fs.existsSync(legacyFlowPath), "unused legacy Room Finder implementation still exists");
  assert(production.includes("finder.canGoBack"), "stable booking-summary back control is missing");
  assert(production.includes('const CALL_NUMBER = "+306944764654"'), "unavailable flow call number is missing or incorrect");
  assert(production.includes('const WHATSAPP_NUMBER = "306944474226"'), "unavailable flow WhatsApp number is missing or incorrect");
  assert(production.includes('href={`tel:${CALL_NUMBER}`}'), "unavailable flow is missing the call action");
  assert(production.includes("openWhatsApp(whatsappContext(copy.whatsappHelp))"), "unavailable flow is missing the WhatsApp action");
  assert(production.includes('role="dialog"') && production.includes('aria-modal="true"'), "room details accessibility dialog semantics are missing");
  assert(production.includes('event.key === "Escape"'), "room details dialog cannot be dismissed with Escape");
}

function main() {
  testStrictDates();
  testFullOneTurnBooking();
  testMultiRoomTotalIsNotGuessed();
  testClarificationKeepsClearFacts();
  testDownstreamCorrectionAndNoChange();
  testDownstreamDateClarification();
  testInvalidDatesAndCheckoutOrder();
  testButtonAllocationPath();
  testDeterministicBackNavigation();
  testMultiRoomOfferFeasibility();
  testResultsUxCleanup();
  console.log("Room Finder deterministic flow QA passed.");
}

try {
  main();
} catch (error) {
  console.error(`Room Finder deterministic flow QA failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}