import type { RoomFinderCommand } from "@/lib/ai-assistant/room-finder-types";

export type FinderStep =
  | "checkin"
  | "checkout"
  | "rooms"
  | "guests"
  | "searching"
  | "selecting"
  | "breakfast"
  | "complete"
  | "unavailable";

export type BookingDraft = {
  checkin: string;
  checkout: string;
  roomCount: number | null;
  totalGuests: number | null;
  groups: number[];
};

export type BookingFlowState = {
  step: FinderStep;
  draft: BookingDraft;
};

type ClarificationStep = "checkin" | "checkout" | "rooms" | "guests";

export type BookingTurnOutcome =
  | { kind: "restart" }
  | { kind: "invalid_checkout" }
  | { kind: "clarification"; query: string; step: FinderStep }
  | { kind: "prompt"; field: ClarificationStep; guestRoom?: number }
  | { kind: "ready" };

export type BookingTurnResolution = {
  state: BookingFlowState;
  outcome: BookingTurnOutcome;
};

export type BookingFlowAction =
  | { type: "reset" }
  | { type: "commit_turn"; state: BookingFlowState }
  | { type: "set_step"; step: FinderStep }
  | { type: "choose_rooms"; roomCount: number }
  | { type: "choose_guests"; guests: number };

const MAX_ROOMS = 3;
const MAX_GUESTS_PER_ROOM = 5;
const MAX_TOTAL_GUESTS = MAX_ROOMS * MAX_GUESTS_PER_ROOM;

export function createInitialBookingFlowState(): BookingFlowState {
  return {
    step: "checkin",
    draft: {
      checkin: "",
      checkout: "",
      roomCount: null,
      totalGuests: null,
      groups: [],
    },
  };
}

function validRoomCount(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= MAX_ROOMS;
}

function validRoomGuests(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= MAX_GUESTS_PER_ROOM;
}

function validTotalGuests(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= MAX_TOTAL_GUESTS;
}

function assignedGuestTotal(groups: number[]) {
  return groups.reduce((sum, guests) => sum + (validRoomGuests(guests) ? guests : 0), 0);
}

export function nextMissingGuestRoom(draft: BookingDraft) {
  if (!draft.roomCount) return 1;
  for (let index = 0; index < draft.roomCount; index += 1) {
    if (!validRoomGuests(draft.groups[index] || 0)) return index + 1;
  }
  return null;
}

function guestAllocationComplete(draft: BookingDraft) {
  return Boolean(draft.roomCount && nextMissingGuestRoom(draft) === null);
}

function normalizeGuestAllocation(draft: BookingDraft) {
  if (!draft.roomCount) {
    draft.groups = [];
    return draft;
  }

  draft.groups = draft.groups.slice(0, draft.roomCount);

  if (draft.roomCount === 1 && draft.totalGuests && validRoomGuests(draft.totalGuests)) {
    draft.groups = [draft.totalGuests];
  }

  const missingRoom = nextMissingGuestRoom(draft);
  if (draft.totalGuests && missingRoom && draft.roomCount > 1) {
    let missingCount = 0;
    for (let index = 0; index < draft.roomCount; index += 1) {
      if (!validRoomGuests(draft.groups[index] || 0)) missingCount += 1;
    }

    if (missingCount === 1) {
      const remaining = draft.totalGuests - assignedGuestTotal(draft.groups);
      if (validRoomGuests(remaining)) {
        while (draft.groups.length < missingRoom) draft.groups.push(0);
        draft.groups[missingRoom - 1] = remaining;
      }
    }
  }

  if (guestAllocationComplete(draft)) {
    draft.totalGuests = assignedGuestTotal(draft.groups.slice(0, draft.roomCount));
  }

  return draft;
}

function bookingCoreIsComplete(draft: BookingDraft) {
  return Boolean(draft.checkin && draft.checkout && draft.roomCount && guestAllocationComplete(draft));
}

export function bookingFlowReducer(state: BookingFlowState, action: BookingFlowAction): BookingFlowState {
  switch (action.type) {
    case "reset":
      return createInitialBookingFlowState();

    case "commit_turn":
      return action.state;

    case "set_step":
      return { ...state, step: action.step };

    case "choose_rooms": {
      const roomCountChanged = state.draft.roomCount !== action.roomCount;
      const draft = normalizeGuestAllocation({
        ...state.draft,
        roomCount: action.roomCount,
        groups: roomCountChanged ? [] : [...state.draft.groups],
      });
      return {
        step: bookingCoreIsComplete(draft) ? "searching" : "guests",
        draft,
      };
    }

    case "choose_guests": {
      const draft: BookingDraft = {
        ...state.draft,
        groups: [...state.draft.groups],
      };
      const room = nextMissingGuestRoom(draft);
      if (room && validRoomGuests(action.guests)) {
        while (draft.groups.length < room) draft.groups.push(0);
        draft.groups[room - 1] = action.guests;
      }
      normalizeGuestAllocation(draft);
      return {
        step: bookingCoreIsComplete(draft) ? "searching" : "guests",
        draft,
      };
    }

    default:
      return state;
  }
}

export function nightsBetween(checkin: string, checkout: string) {
  return Math.round(
    (Date.parse(`${checkout}T12:00:00Z`) - Date.parse(`${checkin}T12:00:00Z`)) / 86_400_000,
  );
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`));
}

function addDays(iso: string, days: number) {
  if (!isIsoDate(iso) || !Number.isInteger(days) || days < 1 || days > 60) return "";
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function normalizeClarificationStep(field: string): ClarificationStep | null {
  if (field === "roomCount") return "rooms";
  if (field === "totalGuests" || field === "guests" || field === "guestRoom" || field === "guestGroups") return "guests";
  if (field === "checkin" || field === "checkout" || field === "rooms") return field;
  return null;
}

function isResolvedField(field: ClarificationStep, draft: BookingDraft) {
  switch (field) {
    case "checkin":
      return Boolean(draft.checkin);
    case "checkout":
      return Boolean(draft.checkout);
    case "rooms":
      return Boolean(draft.roomCount);
    case "guests":
      return guestAllocationComplete(draft);
  }
}

function unresolvedClarification(command: RoomFinderCommand, draft: BookingDraft, fallbackStep: FinderStep) {
  for (const action of command.actions) {
    if (action.type !== "ask_clarification" || !action.query) continue;
    const fields = Array.isArray(action.missingFields) ? action.missingFields : [];

    if (fields.length === 0) return { query: action.query, step: fallbackStep };

    for (const rawField of fields) {
      const field = normalizeClarificationStep(rawField);
      if (field && !isResolvedField(field, draft)) return { query: action.query, step: field };
    }
  }
  return null;
}

function nextOutcome(draft: BookingDraft): BookingTurnOutcome {
  if (!draft.checkin) return { kind: "prompt", field: "checkin" };
  if (!draft.checkout) return { kind: "prompt", field: "checkout" };
  if (!draft.roomCount) return { kind: "prompt", field: "rooms" };
  const guestRoom = nextMissingGuestRoom(draft);
  if (guestRoom) return { kind: "prompt", field: "guests", guestRoom };
  return { kind: "ready" };
}

function stepForOutcome(outcome: BookingTurnOutcome, fallback: FinderStep): FinderStep {
  if (outcome.kind === "invalid_checkout") return "checkout";
  if (outcome.kind === "clarification") return outcome.step;
  if (outcome.kind === "prompt") return outcome.field;
  if (outcome.kind === "ready") return "searching";
  return fallback;
}

export function resolveAssistantTurn(current: BookingFlowState, command: RoomFinderCommand): BookingTurnResolution {
  if (command.actions.some(action => action.type === "restart_search")) {
    return { state: createInitialBookingFlowState(), outcome: { kind: "restart" } };
  }

  const draft: BookingDraft = {
    ...current.draft,
    groups: [...current.draft.groups],
  };

  for (const action of command.actions) {
    if (action.checkin && isIsoDate(action.checkin)) draft.checkin = action.checkin;

    if (action.checkout && isIsoDate(action.checkout)) {
      draft.checkout = action.checkout;
    } else if (action.nights && Number.isInteger(action.nights) && action.nights >= 1 && action.nights <= 60) {
      const derivedCheckout = addDays(draft.checkin, action.nights);
      if (derivedCheckout) draft.checkout = derivedCheckout;
    }
  }

  const incomingRoomCount = [...command.actions]
    .reverse()
    .find(action => action.roomCount != null)?.roomCount;
  if (incomingRoomCount && validRoomCount(incomingRoomCount)) {
    if (draft.roomCount !== incomingRoomCount) draft.groups = [];
    draft.roomCount = incomingRoomCount;
  }

  const incomingTotalGuests = [...command.actions]
    .reverse()
    .find(action => action.totalGuests != null)?.totalGuests;
  if (incomingTotalGuests && validTotalGuests(incomingTotalGuests)) {
    if (draft.totalGuests !== incomingTotalGuests && assignedGuestTotal(draft.groups) !== incomingTotalGuests) {
      draft.groups = [];
    }
    draft.totalGuests = incomingTotalGuests;
  }

  for (const action of command.actions) {
    if (!action.guests || !validRoomGuests(action.guests)) continue;

    if (action.guestRoom && validRoomCount(action.guestRoom)) {
      while (draft.groups.length < action.guestRoom) draft.groups.push(0);
      draft.groups[action.guestRoom - 1] = action.guests;
      continue;
    }

    if (draft.roomCount === 1) {
      draft.totalGuests = action.guests;
      draft.groups = [action.guests];
    }
  }

  normalizeGuestAllocation(draft);

  if (draft.checkin && draft.checkout && nightsBetween(draft.checkin, draft.checkout) < 1) {
    draft.checkout = "";
    const outcome: BookingTurnOutcome = { kind: "invalid_checkout" };
    return { state: { step: stepForOutcome(outcome, current.step), draft }, outcome };
  }

  const clarification = unresolvedClarification(command, draft, current.step);
  if (clarification) {
    const outcome: BookingTurnOutcome = {
      kind: "clarification",
      query: clarification.query,
      step: clarification.step,
    };
    return { state: { step: stepForOutcome(outcome, current.step), draft }, outcome };
  }

  const outcome = nextOutcome(draft);
  return { state: { step: stepForOutcome(outcome, current.step), draft }, outcome };
}
