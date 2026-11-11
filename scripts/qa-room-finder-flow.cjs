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
const offerTrackingPath = path.join(root, "lib/ai-assistant/room-finder-offer-tracking.ts");
const fallbackPath = path.join(root, "lib/ai-assistant/room-finder-fallback.ts");
const hookPath = path.join(root, "components/ai/use-room-finder.ts");
const productionPath = path.join(root, "components/ai/RoomFinderProduction.tsx");
const copyPath = path.join(root, "components/ai/room-finder-copy.ts");
const carouselPath = path.join(root, "components/ai/room-finder-carousel.tsx");
const flowHelpersPath = path.join(root, "components/ai/room-finder-flow-helpers.ts");
const legacyFlowPath = path.join(root, "components/ai/AiRoomFinderFlow.tsx");
const interpretRoutePath = path.join(root, "app/api/ai-assistant/interpret/route.ts");
const roomInfoIntentPath = path.join(root, "lib/ai-assistant/room-info-intent.ts");
const repeatGuardPath = path.join(root, "components/ai/room-finder-repeat-guard.ts");
const earlyArrivalPath = path.join(root, "lib/ai-assistant/early-arrival.ts");
const arrivalTimePath = path.join(root, "lib/ai-assistant/arrival-time.ts");
const supportIntentPath = path.join(root, "lib/ai-assistant/support-intent.ts");
const childrenPath = path.join(root, "lib/ai-assistant/children.ts");
const smallTalkPath = path.join(root, "lib/ai-assistant/small-talk.ts");
const salesIntelligencePath = path.join(root, "components/ai/room-finder-sales-intelligence.ts");
const preferenceAckPath = path.join(root, "components/ai/room-finder-preference-ack.ts");
const persistPath = path.join(root, "components/ai/room-finder-persist.ts");
const notedPath = path.join(root, "components/ai/room-finder-noted.ts");

const dateUtils = executeCommonJs(transpile(datePath));
const flow = executeCommonJs(transpile(flowPath), id => {
  if (id === "@/lib/ai-assistant/room-finder-date") return dateUtils;
  return require(id);
});
const offerPlan = executeCommonJs(transpile(offerPlanPath));
const offerTracking = executeCommonJs(transpile(offerTrackingPath));
const fallback = executeCommonJs(transpile(fallbackPath), id => {
  if (id === "./room-finder-date") return dateUtils;
  return require(id);
});

const {
  bookingFlowReducer,
  createInitialBookingFlowState,
  nextMissingGuestRoom,
  resolveAssistantTurn,
} = flow;
const { feasibleOffersForGroup, hasDistinctOfferPlan, roomOfferKey } = offerPlan;
const { fallbackRoomFinderCommand } = fallback;
const { detectRoomInfoRequest } = executeCommonJs(transpile(roomInfoIntentPath));
const { avoidRepeatedQuestion } = executeCommonJs(transpile(repeatGuardPath));
const { mentionsEarlyMorningArrival, nightBefore } = executeCommonJs(transpile(earlyArrivalPath));
const { extractArrivalTime } = executeCommonJs(transpile(arrivalTimePath));
const { detectSupportIntent } = executeCommonJs(transpile(supportIntentPath));
const { extractChildren } = executeCommonJs(transpile(childrenPath));
const { detectSmallTalk, stripCorrectionNo } = executeCommonJs(transpile(smallTalkPath));
const salesIntelligence = executeCommonJs(transpile(salesIntelligencePath));
const { preferenceAckMessage, mentionsEveryRoomAmenity } = executeCommonJs(transpile(preferenceAckPath), id => {
  if (id === "./room-finder-sales-intelligence") return salesIntelligence;
  return require(id);
});

function command(actions, replyMode = "execute") {
  return { language: "el", replyMode, actions };
}

function fullDraft(overrides = {}) {
  return {
    stayDestination: "",
    destinationKind: null,
    checkin: "2030-10-10",
    checkout: "2030-10-12",
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
  assert(dateUtils.isStrictIsoDate("2030-10-10"), "valid ISO date rejected");
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
      { type: "set_stay_dates", checkin: "2030-10-10", checkout: "2030-10-12" },
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

function testRoomInterestContinuesMissingFieldFlow() {
  const result = resolveAssistantTurn(
    createInitialBookingFlowState(),
    command([{ type: "set_room_interest", roomNumber: 8 }]),
  );
  assert(result.changed === false, "specific room interest incorrectly changed booking facts");
  assert(
    result.outcome.kind === "prompt" && result.outcome.field === "checkin",
    "specific room interest did not continue with the next missing booking field",
  );
}

function testDestinationMismatchPreservesBookingFacts() {
  const examples = [
    ["el", "Καλησπέρα σας! Ενδιαφερόμαστε να μείνουμε στη στα Μεστά για 4 ημέρες, 13 έως 16 Αυγούστου 2027"],
    ["en", "We would like to stay in Mesta from 13 to 16 August 2027"],
    ["de", "Wir möchten vom 13. bis 16. August 2027 in Mesta übernachten"],
    ["fr", "Nous souhaitons séjourner à Mesta du 13 au 16 août 2027"],
    ["it", "Vorremmo soggiornare a Mesta dal 13 al 16 agosto 2027"],
    ["es", "Queremos alojarnos en Mesta del 13 al 16 de agosto de 2027"],
    ["tr", "13-16 Ağustos 2027 tarihleri arasında Mesta'da kalmak istiyoruz"],
  ];

  for (const [language, message] of examples) {
    const interpreted = fallbackRoomFinderCommand(message, { language, currentStep: "checkin" });
    assert(interpreted, `${language}: timeout fallback returned no command`);
    const destination = interpreted.actions.find(action => action.type === "set_stay_destination");
    const dates = interpreted.actions.find(action => action.type === "set_stay_dates");
    assert(destination?.destinationKind === "other", `${language}: Mesta was not classified as another stay destination`);
    assert(dates?.checkin === "2027-08-13", `${language}: named check-in date was not preserved`);
    assert(dates?.checkout === "2027-08-16", `${language}: named check-out date was not preserved`);
  }

  const screenshotCommand = fallbackRoomFinderCommand(examples[0][1], {
    language: "el",
    currentStep: "checkin",
  });
  const result = resolveAssistantTurn(createInitialBookingFlowState(), screenshotCommand);
  assert(result.outcome.kind === "destination_mismatch", "different stay destination did not pause the booking flow");
  assert(result.state.step === "destination", "destination mismatch did not enter confirmation state");
  assert(result.state.draft.checkin === "2027-08-13" && result.state.draft.checkout === "2027-08-16", "destination clarification lost parsed dates");

  const propertyConfirmation = fallbackRoomFinderCommand("Ναι, στον Κάμπο", {
    language: "el",
    currentStep: "destination",
  });
  const confirmedDestination = propertyConfirmation.actions.find(action => action.type === "set_stay_destination");
  assert(confirmedDestination?.destinationKind === "property", "Kampos confirmation was not understood by the timeout fallback");

  const confirmed = resolveAssistantTurn(result.state, propertyConfirmation);
  assert(confirmed.outcome.kind === "prompt" && confirmed.outcome.field === "rooms", "Kampos confirmation did not resume at the next missing booking field");
}

function testGroupEasterEnquiryKeepsEveryFact() {
  // Regression: the 7-8 person Easter enquiry that previously ended in an error.
  const message = "Καλησπέρα, είμαστε μια παρέα 7-8 άτομα, ενδιαφερόμαστε για το προσεχές Πάσχα, 7 διανυκτερεύσεις, πιθανώς 3 ή 4 δωμάτια. Επειδή κάποιοι θα έρθουν από το εξωτερικό, θα θέλαμε κάποιες πληροφορίες...";
  const rescued = fallbackRoomFinderCommand(message, { language: "el", currentStep: "checkin" });
  assert(rescued, "group Easter enquiry produced no fallback command");
  assert(rescued.actions.some(action => action.totalGuests === 8), "guest range 7-8 was not read as 8");
  assert(rescued.actions.some(action => action.nights === 7), "7 nights were lost");
  assert(!rescued.actions.some(action => action.checkin), "count range 7-8 was misread as a date");
  assert(!rescued.actions.some(action => action.roomCount), "room alternative 3 or 4 was turned into a fixed room count");
  const easter = rescued.actions.find(action => action.type === "ask_clarification");
  assert(easter && /\d{1,2}\/\d{1,2}/.test(easter.query) && easter.missingFields.includes("checkin"), "Easter did not produce a dated arrival question");

  const first = resolveAssistantTurn(createInitialBookingFlowState(), rescued);
  assert(first.outcome.kind === "clarification" && first.state.step === "checkin", "Easter enquiry did not ask for the arrival day");
  assert(first.state.draft.totalGuests === 8 && first.state.draft.statedNights === 7, "group size or stay length was dropped while asking for arrival");

  const arrival = resolveAssistantTurn(first.state, command([{ type: "set_stay_dates", checkin: "2027-04-29" }]));
  assert(arrival.state.draft.checkout === "2027-05-06", "stated nights did not produce the checkout once arrival was known");
  assert(arrival.outcome.kind === "prompt" && arrival.outcome.field === "rooms", "group flow did not continue to the room question");

  const tooFewRooms = resolveAssistantTurn(arrival.state, command([{ type: "set_room_count", roomCount: 1 }]));
  assert(tooFewRooms.outcome.kind === "capacity" && tooFewRooms.outcome.minimumRooms === 2, "1 room for 8 guests was accepted");
  assert(tooFewRooms.state.step === "rooms" && tooFewRooms.state.draft.roomCount === null, "capacity problem did not return to the room question");
  assert(tooFewRooms.state.draft.totalGuests === 8, "capacity check lost the guest total");

  const buttonTooFew = bookingFlowReducer(arrival.state, { type: "choose_rooms", roomCount: 1 });
  assert(buttonTooFew.step === "rooms" && buttonTooFew.draft.roomCount === null, "room button allowed 1 room for 8 guests");

  const moved = resolveAssistantTurn(
    { step: "selecting", draft: { ...arrival.state.draft, roomCount: 2, groups: [4, 4] } },
    command([{ type: "set_stay_dates", checkin: "2027-04-30" }]),
  );
  assert(moved.state.draft.checkout === "2027-05-07", "a corrected arrival silently changed the stated stay length");
}

function testDateFactsAreOrderIndependent() {
  const result = resolveAssistantTurn(
    createInitialBookingFlowState(),
    command([
      { type: "set_stay_dates", nights: 3 },
      { type: "set_stay_dates", checkin: "2030-10-10" },
    ]),
  );
  assert(result.state.draft.checkout === "2030-10-13", "nights listed before check-in were dropped");
}

function testFrontDeskRoutesOfferLeadCapture() {
  const rooms = resolveAssistantTurn(createInitialBookingFlowState(), command([{ type: "set_room_count", roomCount: 4 }]));
  assert(rooms.outcome.kind === "clarification" && rooms.outcome.lead === true, "4+ rooms did not offer the lead form");
  const group = resolveAssistantTurn(createInitialBookingFlowState(), command([{ type: "set_guest_count", totalGuests: 20 }]));
  assert(group.outcome.kind === "clarification" && group.outcome.lead === true, "groups above 15 did not offer the lead form");
  assert(group.state.step === "unavailable", "large group continued into an impossible automated search");
}

function testMultiRoomTotalIsNotGuessed() {
  const result = resolveAssistantTurn(
    createInitialBookingFlowState(),
    command([
      { type: "set_stay_dates", checkin: "2030-10-10", checkout: "2030-10-12" },
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
      checkin: "2030-10-12",
      checkout: "2030-10-10",
    }]),
  );
  assert(backwards.outcome.kind === "invalid_checkout", "checkout before check-in was not rejected");
  assert(backwards.state.draft.checkout === "", "invalid checkout was not cleared");
}

function testButtonAllocationPath() {
  let state = {
    step: "rooms",
    draft: {
      checkin: "2030-10-10",
      checkout: "2030-10-12",
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
    draft: { checkin: "2030-10-10", checkout: "", roomCount: null, totalGuests: null, groups: [] },
  }, { type: "go_back" });
  assert(checkoutBack.step === "checkin", "checkout back did not target check-in");
  assert(checkoutBack.draft.checkin === "" && checkoutBack.draft.checkout === "", "checkout back did not clear the date dependency");

  const roomsBack = bookingFlowReducer({
    step: "rooms",
    draft: { checkin: "2030-10-10", checkout: "2030-10-12", roomCount: null, totalGuests: null, groups: [] },
  }, { type: "go_back" });
  assert(roomsBack.step === "checkout" && roomsBack.draft.checkout === "", "rooms back did not reopen checkout");
  assert(roomsBack.draft.checkin === "2030-10-10", "rooms back unnecessarily cleared check-in");

  const secondRoomGuestsBack = bookingFlowReducer({
    step: "guests",
    draft: { checkin: "2030-10-10", checkout: "2030-10-12", roomCount: 2, totalGuests: null, groups: [3] },
  }, { type: "go_back" });
  assert(secondRoomGuestsBack.step === "guests", "multi-room guest back left guest allocation");
  assert(nextMissingGuestRoom(secondRoomGuestsBack.draft) === 1, "multi-room guest back did not reopen the previous room");

  const firstRoomGuestsBack = bookingFlowReducer({
    step: "guests",
    draft: { checkin: "2030-10-10", checkout: "2030-10-12", roomCount: 2, totalGuests: 4, groups: [] },
  }, { type: "go_back" });
  assert(firstRoomGuestsBack.step === "rooms", "first guest step did not go back to rooms");
  assert(firstRoomGuestsBack.draft.roomCount === null && firstRoomGuestsBack.draft.groups.length === 0, "rooms back kept incompatible allocation state");

  const selectingBack = bookingFlowReducer({
    step: "selecting",
    draft: { checkin: "2030-10-10", checkout: "2030-10-12", roomCount: 2, totalGuests: 4, groups: [2, 2] },
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

function testThreeRoomLiveShape() {
  const liveRooms = [
    { roomId: "268803", unitId: "2" },
    { roomId: "626129", unitId: "1" },
    { roomId: "626129", unitId: "2" },
    { roomId: "267788", unitId: "1" },
    { roomId: "267788", unitId: "2" },
    { roomId: "267788", unitId: "3" },
    { roomId: "265595", unitId: "1" },
    { roomId: "265595", unitId: "2" },
    { roomId: "265595", unitId: "3" },
  ];
  const groups = [liveRooms, liveRooms, liveRooms];

  assert(hasDistinctOfferPlan(groups), "2-2-1 three-room live result shape was rejected");

  const firstChoices = feasibleOffersForGroup(groups, 0, new Set());
  assert(firstChoices.length === liveRooms.length, "first group received no visible room cards");

  const firstKey = roomOfferKey(firstChoices[0]);
  const secondChoices = feasibleOffersForGroup(groups, 1, new Set([firstKey]));
  assert(secondChoices.length === liveRooms.length - 1, "second group did not exclude only the selected physical room");

  const secondKey = roomOfferKey(secondChoices[0]);
  const thirdChoices = feasibleOffersForGroup(groups, 2, new Set([firstKey, secondKey]));
  assert(thirdChoices.length === liveRooms.length - 2, "third group could not receive a distinct room choice");
}

function testStaffOfferSnapshotRoundTrip() {
  const snapshot = {
    version: 1,
    groups: [{
      groupNumber: 1,
      guests: 2,
      offers: [{
        roomNumber: 6,
        name: "Chambre double économique",
        checkin: "2026-09-11",
        checkout: "2026-09-13",
        originalTotal: 200,
        directTotal: 180,
        saving: 20,
      }],
    }],
  };
  const message = "Des disponibilités proches ont été trouvées.";
  const encoded = offerTracking.encodeRoomFinderOfferSnapshot(message, snapshot);
  const decoded = offerTracking.decodeRoomFinderOfferSnapshot(encoded);

  assert(decoded.content === message, "staff offer snapshot changed the customer-facing message");
  assert(decoded.snapshot?.groups[0]?.offers[0]?.roomNumber === 6, "staff offer snapshot lost the room number");
  assert(decoded.snapshot?.groups[0]?.offers[0]?.directTotal === 180, "staff offer snapshot lost the direct price");

  const malformed = offerTracking.decodeRoomFinderOfferSnapshot(
    `${message}${offerTracking.ROOM_FINDER_OFFER_SNAPSHOT_MARKER}{`,
  );
  assert(malformed.content === message && malformed.snapshot === null, "malformed staff snapshot was not handled safely");
}

function testResultsUxCleanup() {
  const hook = fs.readFileSync(hookPath, "utf8");
  const production = fs.readFileSync(productionPath, "utf8");
  const copy = fs.readFileSync(copyPath, "utf8");
  const carousel = fs.readFileSync(carouselPath, "utf8");
  const helpers = fs.readFileSync(flowHelpersPath, "utf8");
  const interpretRoute = fs.readFileSync(interpretRoutePath, "utf8");

  assert(!production.includes("FeedbackArea"), "results feedback flow was reintroduced");
  assert(!production.includes("whatsappTurn"), "WhatsApp still uses a synthetic chat turn");
  assert(!production.includes("handoff"), "WhatsApp handoff bubble was reintroduced");
  assert(!copy.includes("RoomFinderFilter"), "removed room filters remain in Room Finder copy contract");
  assert(!copy.includes("feedbackQ"), "removed feedback copy remains in Room Finder copy contract");
  assert(!helpers.includes("matchesRoomFilter"), "removed filter-matching logic remains in flow helpers");
  assert(!fs.existsSync(legacyFlowPath), "unused legacy Room Finder implementation still exists");
  assert(!interpretRoute.includes("deterministicFastPath"), "simple first answers still bypass the OpenAI interpreter");
  // The deterministic parser is a rescue path only: it runs after the AI
  // interpreter fails and its turns are marked as degraded for staff.
  const fallbackCall = interpretRoute.indexOf("fallbackRoomFinderCommand(message, context)");
  assert(fallbackCall > interpretRoute.indexOf("ai_room_finder_interpret_failed"), "deterministic fallback runs before the AI interpreter has failed");
  assert(interpretRoute.includes("degraded: true"), "fallback interpreter turns are not marked as degraded");
  assert(
    hook.includes('action.type === "answer_property_question"') && !hook.includes("propertyKnowledgeAnswer"),
    "grounded knowledge is not handled as an explicit OpenAI action",
  );
  assert(
    hook.includes("setInput(currentValue => currentValue || value)"),
    "failed OpenAI turns do not restore the user input for a safe retry",
  );
  assert(
    hook.includes("commitOfferSelection(matchingOffer)"),
    "a typed specific-room selection cannot execute the matching live offer",
  );
  assert(
    hook.includes('state: { step: "selecting", draft: searchDraft }'),
    "availability results no longer commit the selecting step and searched draft atomically",
  );
  assert(
    production.includes('finder.step === "searching" || finder.step === "selecting"'),
    "available room cards can disappear while the selecting-state update settles",
  );
  assert(production.includes("{roomResultsVisible && ("), "room cards are not guarded by the resilient results state");
  assert(
    production.includes("{message.id === resultsAnchorMessageId && roomResults}"),
    "room cards are not rendered under the latest results message, so later messages appear above them",
  );
  assert(
    production.includes("conversationAfterResults"),
    "the feed does not follow the conversation down after the guest writes below the results",
  );
  assert(production.includes('data-room-selection-context="true"'), "multi-room results are missing the prominent room selection context");
  assert(production.includes("selectionGuests={multiRoomSelectionVisible ? finder.groups[finder.activeGroup]"), "room cards do not receive the active choice guest context");
  assert(production.includes("[finder.activeGroup, finder.step, finder.visibleOffers.length, finder.extensionPending]"), "each room transition no longer returns the user to the active selection context");
  assert(carousel.includes("copy.selectForGuests(selectionGuests)"), "room selection CTA does not say which guests it is for");
  assert(!fs.readFileSync(path.join(root, "components/ai/room-finder-tone.ts"), "utf8").includes("for group ${group}"), "result messages still describe requested rooms as groups");
  assert(production.includes("finder.canGoBack"), "stable booking-summary back control is missing");
  assert(production.includes('const CALL_NUMBER = "+306944764654"'), "unavailable flow call number is missing or incorrect");
  assert(production.includes('const WHATSAPP_NUMBER = "306944474226"'), "unavailable flow WhatsApp number is missing or incorrect");
  assert(production.includes('href={`tel:${CALL_NUMBER}`}'), "unavailable flow is missing the call action");
  assert(production.includes("openWhatsApp(whatsappContext(copy.whatsappHelp))"), "unavailable flow is missing the WhatsApp action");
  assert(production.includes('role="dialog"') && production.includes('aria-modal="true"'), "room details accessibility dialog semantics are missing");
  assert(production.includes('event.key === "Escape"'), "room details dialog cannot be dismissed with Escape");
}

// Ref 1: "don't know" and general room questions show the room types even
// when the AI interpreter is down; a dated question never does.
function testNoDatesFallbackShowsRoomTypes() {
  const cases = [
    ["en", "Don’t know"],
    ["en", "dont know yet"],
    ["en", "Which rooms are generally available? With bathroom and kitchen"],
    ["el", "Θέλω πληροφορίες για τα δωμάτια"],
    ["el", "τι ξέρεις για τα δωμάτια ?"],
    ["el", "δεν ξέρω ακόμα"],
    ["de", "Ich weiß noch nicht"],
  ];
  for (const [language, message] of cases) {
    const interpreted = fallbackRoomFinderCommand(message, { language, currentStep: "checkin" });
    assert(
      interpreted?.actions.some(action => action.type === "browse_rooms"),
      `${language} "${message}" did not show the room types`,
    );
  }
  const dated = fallbackRoomFinderCommand("which rooms do you have on 10/10", { language: "en", currentStep: "checkin" });
  assert(
    !dated?.actions.some(action => action.type === "browse_rooms"),
    "a dated question was routed to the room types",
  );

  // The room types never change the booking draft or skip a step.
  const state = createInitialBookingFlowState();
  const result = resolveAssistantTurn(state, command([{ type: "browse_rooms" }]));
  assert(result.changed === false, "room types changed the booking draft");
  assert(result.state.step === "checkin", "room types moved the flow away from check-in");
}

// Ref 2: questions about one room are answered from the room catalog at any
// step; booking messages that mention a room still go to the interpreter.
function testRoomInfoQuestions() {
  const rooms = [
    ["Details for room 3", 3],
    ["μπορείς να μου δώσεις λεπτομέρεις για το δωμάτιο 5", 5],
    ["room #11 pictures and facilities", 11],
    ["i eant to view room #11 pictures and facilities", 11],
    ["Φωτογραφίες από το διαμέρισμα 8;", 8],
    ["What does apartment 10 look like?", 10],
    ["Zeig mir Bilder von Zimmer 4", 4],
  ];
  for (const [message, roomNumber] of rooms) {
    const request = detectRoomInfoRequest(message);
    assert(request?.roomNumber === roomNumber, `"${message}" was not answered as room ${roomNumber}`);
  }
  assert(detectRoomInfoRequest("room #11 pictures").exists === false, "room 11 was treated as a real room");
  for (const message of [
    "Θέλω το δωμάτιο 8",
    "Ενδιαφέρομαι για το δωμάτιο 8",
    "room 5 for 2 people 10/10 photos",
    "2 rooms",
    "Θέλω πληροφορίες για τα δωμάτια",
  ]) {
    assert(detectRoomInfoRequest(message) === null, `"${message}" was wrongly answered as room info`);
  }
}

// Ref 4: "How many guests in room 2?" → "2" must fill room 2, even when the
// interpreter reads the bare number as a booking total (real sessions 31/8, 4/10).
function testPerRoomGuestAnswerNeverLoops() {
  const state = {
    step: "guests",
    draft: fullDraft({ roomCount: 2, totalGuests: null, groups: [2] }),
  };
  const asTotal = resolveAssistantTurn(state, command([{ type: "set_guest_count", totalGuests: 2 }]));
  assert(asTotal.state.draft.groups[1] === 2, "room 2 answer read as a total was not assigned to room 2");
  assert(asTotal.outcome.kind === "ready", "per-room answer read as a total asked the same question again");

  const firstRoom = resolveAssistantTurn(
    { step: "guests", draft: fullDraft({ roomCount: 2, totalGuests: null, groups: [] }) },
    command([{ type: "set_guest_count", totalGuests: 1 }]),
  );
  assert(firstRoom.state.draft.groups[0] === 1, "room 1 answer read as a total was not assigned to room 1");
  assert(
    firstRoom.outcome.kind === "prompt" && firstRoom.outcome.guestRoom === 2,
    "after room 1 the flow did not move on to room 2",
  );

  // A real total that covers the remaining room is still a total.
  const realTotal = resolveAssistantTurn(state, command([{ type: "set_guest_count", totalGuests: 5 }]));
  assert(realTotal.state.draft.totalGuests === 5, "a real booking total was not kept as the total");

  // Typed bare numbers at the rooms/guests steps never reach the AI.
  const hook = fs.readFileSync(hookPath, "utf8");
  assert(
    /current === "guests" && number >= 1 && number <= 5[\s\S]{0,80}chooseGuests\(number, value\)/.test(hook),
    "typed guest numbers are not handled like the guest buttons",
  );
  assert(
    /current === "rooms" && number >= 1 && number <= 3[\s\S]{0,80}chooseRooms\(number, value\)/.test(hook),
    "typed room numbers are not handled like the room buttons",
  );
}

// Ref 6: the same question is never sent twice in a row; the third time the
// guest also gets the call/WhatsApp buttons.
function testNeverTheSameQuestionTwice() {
  const ask = "When would you like to check in?";
  const welcome = `Welcome to Voulamandis House 👋 ${ask}`;
  const history = [
    { role: "assistant", content: welcome },
    { role: "user", content: "hmm" },
  ];
  const first = avoidRepeatedQuestion(history, ask, "checkin", "en");
  assert(first && first.content !== ask, "the check-in question was repeated after the welcome");
  assert(!first.withContact, "the first rephrase already pushed the guest to reception");

  history.push({ role: "assistant", content: first.content, ...first.info }, { role: "user", content: "?" });
  const second = avoidRepeatedQuestion(history, ask, "checkin", "en");
  assert(second && second.withContact, "the third identical question did not offer call/WhatsApp");
  assert(second.content !== first.content || second.withContact, "the rephrase did not change");

  // Keep going: every message differs from the one right before it.
  let previousContent = second.content;
  history.push({ role: "assistant", content: second.content, ...second.info }, { role: "user", content: "." });
  for (let round = 0; round < 4; round += 1) {
    const next = avoidRepeatedQuestion(history, ask, "checkin", "en");
    assert(next && next.content !== previousContent, `repeat ${round + 3} sent the same message twice in a row`);
    history.push({ role: "assistant", content: next.content, ...next.info }, { role: "user", content: "." });
    previousContent = next.content;
  }

  const greek = avoidRepeatedQuestion(
    [{ role: "assistant", content: "Πόσα δωμάτια χρειάζεστε;" }, { role: "user", content: "xx" }],
    "Πόσα δωμάτια χρειάζεστε;",
    "rooms",
    "el",
  );
  assert(greek && /1–3/.test(greek.content), "the Greek rooms question was not rephrased with the buttons hint");

  assert(
    avoidRepeatedQuestion([{ role: "assistant", content: "How many guests will stay in room 1?" }], "How many guests will stay in room 2?", "guests", "en") === null,
    "a different question was treated as a repeat",
  );

  const hook = fs.readFileSync(hookPath, "utf8");
  assert(/avoidRepeatedQuestion\(current, content, promptType, language\)/.test(hook), "the chat does not use the repeat guard");
}

// Ref 3: a stated preference is confirmed with the rooms that have it, and
// "bathroom" gets the every-room answer (real session 28/10).
function testPreferencesAreConfirmed() {
  const kitchen = preferenceAckMessage("en", [], ["kitchen"], true);
  assert(/Noted: kitchen/.test(kitchen), "the kitchen preference was not confirmed");
  assert(/rooms 3, 4, 8, 9, 10/.test(kitchen), "the kitchen confirmation did not list rooms 3, 4, 8, 9, 10");
  assert(/private bathroom/.test(kitchen), "the bathroom question was not answered");
  assert(!/available\b(?! for your dates)/i.test(kitchen.replace("If they are available for your dates", "")), "the confirmation claimed availability");

  const stairs = preferenceAckMessage("el", ["kitchen"], ["kitchen", "no_stairs"], false);
  assert(/Σημείωσα: χωρίς σκάλες/.test(stairs) && /5, 6, 7/.test(stairs), "only the new Greek preference should be confirmed with rooms 5, 6, 7");
  assert(!/κουζίνα/.test(stairs), "an already confirmed preference was confirmed again");

  assert(preferenceAckMessage("en", ["kitchen"], ["kitchen"], false) === "", "an unchanged preference was confirmed again");
  assert(mentionsEveryRoomAmenity("With bathroom and kitchen"), "bathroom was not recognised");
  assert(!mentionsEveryRoomAmenity("With kitchen"), "kitchen alone was treated as an every-room amenity");

  const hook = fs.readFileSync(hookPath, "utf8");
  assert(/applyCommand\(result\.command, value\)/.test(hook), "the guest text does not reach the preference confirmation");
}

// Ref 5: a calendar button under the check-in / check-out question; the
// picked date uses the same flow as a typed date, never the AI.
function testCalendarButton() {
  const production = fs.readFileSync(productionPath, "utf8");
  const hook = fs.readFileSync(hookPath, "utf8");
  const picker = fs.readFileSync(path.join(root, "components/ai/room-finder-date-pick.tsx"), "utf8");
  assert(/<DatePickReply[\s\S]{0,900}finder\.chooseDate\(iso\)/.test(production), "the calendar button is not shown in the chat");
  assert(/finder\.step === "checkin" \|\| \(finder\.step === "checkout" && finder\.checkin\)/.test(production), "the calendar button is not limited to the date questions");
  assert(/addDaysToIsoDate\(finder\.checkin, 1\)/.test(production), "check-out can be picked on or before check-in");
  assert(/type: "set_stay_dates", \[field\]: iso/.test(hook), "a picked date does not use the normal booking flow");
  assert(/type="date"/.test(picker) && /showPicker/.test(picker), "the calendar button does not open the native date picker");

  // The picked dates flow through the deterministic booking flow.
  const picked = resolveAssistantTurn(createInitialBookingFlowState(), command([{ type: "set_stay_dates", checkin: "2030-06-10" }]));
  assert(picked.outcome.kind === "prompt" && picked.outcome.field === "checkout", "a picked check-in did not move on to check-out");
  const pickedOut = resolveAssistantTurn(picked.state, command([{ type: "set_stay_dates", checkout: "2030-06-13" }]));
  assert(pickedOut.outcome.kind === "prompt" && pickedOut.outcome.field === "rooms", "a picked check-out did not move on to rooms");
}

// Refs 9, 10, 13 from the second audit (real guest messages).
function testSecondAuditScenarios() {
  const { asksRoomPrice, asksRoomOverview, mentionsBreakfast } = fallback;

  // 9: room price without dates → room types with "from" prices, never breakfast.
  for (const message of ["Τιμή?", "Ποσο κοστιζει το δωματιο ανά διανυκτερευση", "Πόσα κοστίζει ένα δωμάτιο ;", "how much per night?"]) {
    assert(asksRoomPrice(message), `"${message}" was not recognised as a room price question`);
    const parsed = fallbackRoomFinderCommand(message, { language: "el", currentStep: "checkin" });
    assert(parsed?.actions.some(action => action.type === "request_live_availability"), `"${message}" did not ask for live prices in the fallback`);
  }
  assert(!asksRoomPrice("Έχει πρωινό; Πόσο κοστίζει;"), "a breakfast price question was treated as a room price question");
  assert(mentionsBreakfast("Πρωινό ?"), "breakfast was not recognised");
  const hook = fs.readFileSync(hookPath, "utf8");
  assert(/ids\.includes\("breakfast"\) && !mentionsBreakfast\(guestText\)/.test(hook), "the breakfast answer can still reach a room price question");
  assert(/showRoomTypes\(!flow\.draft\.checkin, priceWithoutDates\)/.test(hook), "price questions without dates do not show the from-prices");

  // 10: general room questions → the 4 room types, not one floor's description.
  for (const message of ["Πόσα δωμάτια έχει ?", "θελω να δω και τα δωματια και να μου πεισ", "θελω φοτογραφιεσ", "How many rooms do you have?"]) {
    assert(asksRoomOverview(message), `"${message}" was not answered with the room types`);
  }
  assert(!asksRoomOverview("2 δωμάτια για 4 άτομα"), "a booking request was treated as a room overview");
  assert(/if \(staysElsewhere\) return false/.test(hook), "a stay elsewhere can still get Voulamandis House room facts");

  // 13: early-morning arrival asks about the night before.
  for (const message of ["Ξημερώματα Τρίτης 08/09/2026", "arriving 8/9 at 3:30", "we land at 5am on the 8th", "Ankunft 04:15 am 8.9."]) {
    assert(mentionsEarlyMorningArrival(message), `"${message}" was not recognised as an early-morning arrival`);
  }
  for (const message of ["Άφιξη 11/9/26 22:30 το βράδυ", "08/09 2 nights", "10.10 για 2 βράδια", "arrive at 14:00"]) {
    assert(!mentionsEarlyMorningArrival(message), `"${message}" was wrongly treated as an early-morning arrival`);
  }
  assert(nightBefore("2027-09-08") === "2027-09-07", "the night before was not computed");
  assert(nightBefore("2027-03-01") === "2027-02-28", "the night before did not cross the month");
  assert(/mentionsEarlyMorningArrival\(guestText\)[\s\S]{0,500}earlyArrivalMessage/.test(hook), "the chat does not ask about early-morning arrivals");
}

// Ref 12: the arrival time the guest mentions reaches reception.
function testArrivalTimeReachesReception() {
  const cases = [
    ["Άφιξη 11/9/26 22:30 το βράδυ και αναχώρηση 13/9/26 το πρωί.", "22:30"],
    ["φτάνουμε στις 10 το βράδυ", "22:00"],
    ["we land at 10pm", "22:00"],
    ["η πτήση μας φτάνει 18.45", "18:45"],
    ["Ankunft um 17 Uhr", "17:00"],
    ["arrivée vers 20h30", "20:30"],
    ["llegamos a las 3 de la tarde", "15:00"],
    ["9 μ.μ.", "21:00"],
  ];
  for (const [message, time] of cases) {
    assert(extractArrivalTime(message) === time, `"${message}" did not give arrival time ${time}`);
  }
  for (const message of ["10/10 για 2 βράδια", "11.9 με 13.9", "2 nights 1 room 2 guests", "Ξημερώματα Τρίτης 08/09/2026", "15 με 22.9.26"]) {
    assert(extractArrivalTime(message) === "", `"${message}" was wrongly read as an arrival time`);
  }
  const hook = fs.readFileSync(hookPath, "utf8");
  const production = fs.readFileSync(productionPath, "utf8");
  assert(/\[staff\] Ώρα άφιξης: \$\{statedArrivalTime\}/.test(hook), "the arrival time is not marked for staff in the conversation");
  assert(/arrivalTimeLabel\(language\)\}: \$\{finder\.arrivalTime\}/.test(production), "the arrival time is not in the request sent to reception");
  assert((production.match(/finder\.arrivalTime \?/g) || []).length >= 2, "the arrival time is missing from one of the two reception requests");
}

// Ref 18: an existing booking / a person / a better price is never a new search.
function testSupportRequestsAreNotSearches() {
  const cases = [
    ["Έχω ήδη κράτηση και θέλω να αλλάξω ημερομηνίες", "existing_booking"],
    ["θέλω να ακυρώσω την κράτησή μου", "existing_booking"],
    ["I have a booking for June, can we add a night?", "existing_booking"],
    ["Ich möchte meine Buchung stornieren", "existing_booking"],
    ["θέλω να μιλήσω με κάποιον", "human"],
    ["Can I speak to a real person?", "human"],
    ["μπορείτε να μου κάνετε καλύτερη τιμή;", "better_price"],
    ["any discount?", "better_price"],
  ];
  for (const [message, intent] of cases) {
    assert(detectSupportIntent(message) === intent, `"${message}" was not recognised as ${intent}`);
  }
  for (const message of [
    "Ποια είναι η πολιτική ακύρωσης;",
    "Is there free cancellation?",
    "10/6 για 2 βράδια, έχετε έκπτωση;",
    "Θέλω δωμάτιο για 2 άτομα",
    "Details for room 3",
  ]) {
    assert(detectSupportIntent(message) === null, `"${message}" was wrongly taken out of the booking flow`);
  }
  const hook = fs.readFileSync(hookPath, "utf8");
  assert(/const supportIntent = detectSupportIntent\(value\)/.test(hook), "support requests are not checked before the AI");
  assert(/supportIntent === "better_price" \? "normal" : "contact"/.test(hook), "existing booking / person do not show the call and WhatsApp buttons");
}

// Ref 15: a past date with the wrong year is offered one year later.
function testWrongYearIsOfferedNextYear() {
  const today = new Date();
  const lastYear = today.getUTCFullYear() - 1;
  // A date about two months from now, typed with last year's year.
  const soon = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 2, 10));
  const mm = String(soon.getUTCMonth() + 1).padStart(2, "0");
  const typedYear = soon.getUTCFullYear() - 1;
  const past = `${typedYear}-${mm}-10`;
  const result = resolveAssistantTurn(createInitialBookingFlowState(), command([
    { type: "set_stay_dates", checkin: past, checkout: `${typedYear}-${mm}-12` },
  ]));
  assert(result.outcome.kind === "clarification", "a past date was not questioned");
  assert(result.outcome.suggestion?.checkin === `${soon.getUTCFullYear()}-${mm}-10`, "the next-year check-in was not suggested");
  assert(result.outcome.suggestion?.checkout === `${soon.getUTCFullYear()}-${mm}-12`, "the next-year check-out was not suggested");
  assert(/ναι/.test(result.outcome.query), "the guest was not asked to confirm with yes");

  // Yesterday is not a wrong year: no suggestion a year away.
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const yesterday = resolveAssistantTurn(createInitialBookingFlowState(), command([{ type: "set_stay_dates", checkin: y }]));
  assert(yesterday.outcome.kind === "clarification", "yesterday was accepted");
  assert(!yesterday.outcome.suggestion || yesterday.outcome.suggestion.checkin > y, "yesterday got a wrong suggestion");
  void lastYear;

  const hook = fs.readFileSync(hookPath, "utf8");
  assert(/pendingYearFix && current === "checkin"[\s\S]{0,200}YES_WORDS\.test\(value\)/.test(hook), "yes does not apply the suggested year");
}

// Refs 14, 16, 17 (real guest messages where available).
function testChildrenThanksAndCorrections() {
  // 14: children and ages reach reception; the cot rule for babies.
  const family = extractChildren("1 δωματιο για 4 ατομα, 2 ενηλικες κ 2 παιδια ηλικίας 4 κ 6 ετων");
  assert(family && family.count === 2 && family.ages.join(",") === "4,6", "the real 6/11 family message lost the children's ages");
  const baby = extractChildren("we are 2 adults with a baby of 10 months");
  assert(baby?.infant, "a baby was not recognised for the cot rule");
  assert(extractChildren("2 Erwachsene, 1 Kind (5)")?.ages.join(",") === "5", "German child age was not read");
  for (const message of ["10/10 για 2 βράδια", "οικογενειακό διαμέρισμα", "2 adults 1 room"]) {
    assert(extractChildren(message) === null, `"${message}" was wrongly read as children`);
  }
  const hook = fs.readFileSync(hookPath, "utf8");
  const production = fs.readFileSync(productionPath, "utf8");
  assert(/\[staff\] Παιδιά:/.test(hook), "children are not marked for staff in the conversation");
  assert((production.match(/finder\.childrenNote \?/g) || []).length >= 2, "children are missing from a reception request");

  // 16: thanks / greeting / goodbye get a natural reply, not "nothing changed".
  assert(detectSmallTalk("ευχαριστώ πολύ") === "thanks", "the real 4/9 'ευχαριστώ πολύ' was not recognised");
  assert(detectSmallTalk("Thank you!") === "thanks", "thank you was not recognised");
  assert(detectSmallTalk("Καλησπέρα σας") === "greeting", "a Greek greeting was not recognised");
  assert(detectSmallTalk("Hallo") === "greeting", "the real 21/8 'Hallo' was not recognised");
  assert(detectSmallTalk("αντίο") === "goodbye", "goodbye was not recognised");
  assert(detectSmallTalk("ευχαριστώ, θέλω 2 δωμάτια") === null, "a booking message was swallowed as thanks");
  assert(detectSmallTalk("Καλησπέρα, θέλω δωμάτιο 10/10") === null, "a booking message was swallowed as a greeting");
  assert(/const smallTalk = detectSmallTalk\(value\)/.test(hook), "small talk is not handled before the AI");

  // 17: "Όχι 11/9 με 13/9. 2 άτομα" (real 3/9) is a correction.
  assert(stripCorrectionNo("Όχι 11/9 με 13/9. 2 άτομα") === "11/9 με 13/9. 2 άτομα", "the real 3/9 correction was not cleaned");
  assert(stripCorrectionNo("no, 10/6 to 13/6") === "10/6 to 13/6", "an English correction was not cleaned");
  assert(stripCorrectionNo("όχι 13/9, 14/9") === "όχι 13/9, 14/9", "an ambiguous edit was changed");
  assert(stripCorrectionNo("όχι, 3 άτομα") === "όχι, 3 άτομα", "a non-range correction was changed");
  assert(/interpret\(stripCorrectionNo\(value\), current\)/.test(hook), "corrections do not reach the interpreter cleaned");
}

// Ref 19: the conversation is saved per tab and comes back after a reload.
function testConversationSurvivesReload() {
  const persist = executeCommonJs(transpile(persistPath));
  const memory = new Map();
  const store = {
    getItem: key => (memory.has(key) ? memory.get(key) : null),
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: key => memory.delete(key),
  };
  const state = { flow: { step: "rooms", draft: {} }, messages: [{ id: "u1", role: "user", content: "15/6" }] };
  persist.saveRoomFinderSnapshot({ language: "el", sessionId: "rf-1", state }, store, 1_000);
  const loaded = persist.loadRoomFinderSnapshot(store, 2_000);
  assert(loaded && loaded.language === "el" && loaded.sessionId === "rf-1", "saved conversation is not restored");
  assert(loaded.state.messages[0].content === "15/6", "restored conversation lost its messages");
  assert(
    persist.loadRoomFinderSnapshot(store, 1_000 + persist.ROOM_FINDER_SNAPSHOT_MAX_AGE_MS + 1) === null,
    "a conversation older than 24 hours is restored",
  );
  assert(!memory.size, "an expired conversation is not removed");
  memory.set(persist.ROOM_FINDER_SNAPSHOT_KEY, "{broken");
  assert(persist.loadRoomFinderSnapshot(store, 2_000) === null, "broken saved data breaks the chat");
  persist.clearRoomFinderSnapshot(store);
  assert(persist.loadRoomFinderSnapshot(null) === null, "missing storage breaks the chat");

  const hook = fs.readFileSync(hookPath, "utf8");
  const production = fs.readFileSync(productionPath, "utf8");
  const chatUi = fs.readFileSync(path.join(root, "components/ai/room-finder-chat-ui.tsx"), "utf8");
  assert(hook.includes("if (typing || !messages.some(message => message.role === \"user\")) return;"), "the conversation is saved mid-turn or before the guest wrote");
  assert(hook.includes("saved.language !== language"), "a conversation is restored in another language");
  assert(production.includes("finder.restoreSaved()"), "the page does not restore the saved conversation");
  assert(production.includes("pendingRoomFocus.current || pendingCategoryFocus.current"), "a room-page link does not start a fresh conversation");
  assert(chatUi.includes("restoreRoomFinderTracking"), "a restored conversation starts a new staff-inbox session");
  assert(chatUi.includes("trackedRoomFinderMessages.get(message.id)"), "restored messages are sent to the staff inbox again");
}

// Ref 20: "New search" wipes nothing for good: it can be undone.
function testNewSearchCanBeUndone() {
  const production = fs.readFileSync(productionPath, "utf8");
  assert(production.includes("const snapshot = finder.takeSnapshot();"), "new search does not keep the conversation for undo");
  assert(production.includes("finder.forgetSaved();"), "new search leaves the old conversation to come back on reload");
  assert(production.includes('data-room-finder-undo="true"'), "new search has no undo");
  assert(production.includes("finder.restoreSnapshot(undoSnapshot)"), "undo does not bring the conversation back");
}

// Ref 21: a detail given ahead of the question is confirmed, not ignored.
function testDetailsGivenEarlyAreConfirmed() {
  const { notedDetails, withNotedDetails } = executeCommonJs(transpile(notedPath));
  const none = { totalGuests: null, roomCount: null };
  assert(
    notedDetails("el", "rooms", none, { totalGuests: 2, roomCount: null }) === "Σημείωσα 2 άτομα.",
    "guests given while rooms are asked are not confirmed",
  );
  assert(notedDetails("el", "guests", none, { totalGuests: 2, roomCount: null }) === "", "the answered question is confirmed twice");
  assert(notedDetails("el", "rooms", none, { totalGuests: null, roomCount: 1 }) === "", "the rooms answer is confirmed twice");
  assert(
    notedDetails("en", "checkout", none, { totalGuests: 1, roomCount: 1 }) === "Noted: 1 guest and 1 room.",
    "early guests and rooms are not confirmed together",
  );
  assert(
    notedDetails("el", "rooms", { totalGuests: 2, roomCount: null }, { totalGuests: 2, roomCount: null }) === "",
    "an unchanged detail is confirmed again",
  );
  for (const language of ["el", "en", "de", "fr", "it", "es", "tr"]) {
    assert(notedDetails(language, "rooms", none, { totalGuests: 3, roomCount: null }).includes("3"), `${language} note misses the number`);
  }
  assert(withNotedDetails("", "Q?") === "Q?" && withNotedDetails("N.", "Q?") === "N.\n\nQ?", "note is not put before the question");
  const hook = fs.readFileSync(hookPath, "utf8");
  assert(hook.includes("const noted = notedDetails(language, step, flow.draft, resolution.state.draft);"), "prompts do not confirm early details");
}

// No availability: change dates/guests first, then one contact card whose
// form opens on request and carries the cancellation alert (no second form).
function testNoAvailabilityIsOneShortCard() {
  const production = fs.readFileSync(productionPath, "utf8");
  const lead = fs.readFileSync(path.join(root, "components/ai/room-finder-lead-card.tsx"), "utf8");
  assert(!production.includes("RoomFinderWatchCard"), "no-availability still shows a separate alert form");
  assert(production.includes("resultActions(Boolean(finder.checkin && finder.checkout), false)"), "no-availability repeats New search");
  assert(production.includes('collapsed={Boolean(finder.unavailableSearch) && finder.step === "unavailable"}'), "no-availability opens the reception form unasked");
  assert(production.includes('watch={finder.step === "unavailable" ? finder.unavailableSearch : null}'), "the cancellation alert is no longer offered");
  assert(lead.includes('data-room-finder-lead-open="true"') && lead.includes('data-room-finder-lead-watch="true"'), "lead card lacks open button or alert option");
  assert(lead.includes("/api/ai-room-finder/availability-watch/"), "the alert option does not register the alert");
  assert(lead.includes("watchMissingEmail"), "the alert can be requested without an email");
}

function main() {
  testStrictDates();
  testChildrenThanksAndCorrections();
  testSupportRequestsAreNotSearches();
  testWrongYearIsOfferedNextYear();
  testArrivalTimeReachesReception();
  testSecondAuditScenarios();
  testCalendarButton();
  testPreferencesAreConfirmed();
  testNeverTheSameQuestionTwice();
  testPerRoomGuestAnswerNeverLoops();
  testRoomInfoQuestions();
  testNoDatesFallbackShowsRoomTypes();
  testDestinationMismatchPreservesBookingFacts();
  testRoomInterestContinuesMissingFieldFlow();
  testFullOneTurnBooking();
  testMultiRoomTotalIsNotGuessed();
  testGroupEasterEnquiryKeepsEveryFact();
  testDateFactsAreOrderIndependent();
  testFrontDeskRoutesOfferLeadCapture();
  testClarificationKeepsClearFacts();
  testDownstreamCorrectionAndNoChange();
  testDownstreamDateClarification();
  testInvalidDatesAndCheckoutOrder();
  testButtonAllocationPath();
  testDeterministicBackNavigation();
  testMultiRoomOfferFeasibility();
  testThreeRoomLiveShape();
  testStaffOfferSnapshotRoundTrip();
  testResultsUxCleanup();
  testConversationSurvivesReload();
  testNewSearchCanBeUndone();
  testDetailsGivenEarlyAreConfirmed();
  testNoAvailabilityIsOneShortCard();
  console.log("Room Finder deterministic flow QA passed.");
}

try {
  main();
} catch (error) {
  console.error(`Room Finder deterministic flow QA failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
