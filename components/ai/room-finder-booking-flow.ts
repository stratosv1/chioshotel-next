import type { AssistantCommand } from "@/lib/ai-assistant/types";

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
  groups: number[];
  pendingGuestTotal: number | null;
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

export function createInitialBookingFlowState(): BookingFlowState {
  return {
    step: "checkin",
    draft: {
      checkin: "",
      checkout: "",
      roomCount: null,
      groups: [],
      pendingGuestTotal: null,
    },
  };
}

function bookingCoreIsComplete(draft: BookingDraft) {
  return Boolean(
    draft.checkin &&
    draft.checkout &&
    draft.roomCount &&
    draft.groups.length >= draft.roomCount &&
    draft.groups.every(Boolean),
  );
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
      const pendingGuests = state.draft.pendingGuestTotal;
      const draft: BookingDraft = {
        ...state.draft,
        roomCount: action.roomCount,
        groups: action.roomCount === 1 && pendingGuests ? [pendingGuests] : [],
        pendingGuestTotal: null,
      };
      return {
        step: bookingCoreIsComplete(draft) ? "searching" : "guests",
        draft,
      };
    }
    case "choose_guests": {
      const draft: BookingDraft = {
        ...state.draft,
        groups: [...state.draft.groups, action.guests],
        pendingGuestTotal: null,
      };
      const needsAnotherRoom = Boolean(draft.roomCount && draft.groups.length < draft.roomCount);
      return {
        step: needsAnotherRoom ? "guests" : bookingCoreIsComplete(draft) ? "searching" : state.step,
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
  if (field === "checkin" || field === "checkout" || field === "rooms" || field === "guests") return field;
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
      return Boolean(draft.roomCount && draft.groups.length >= draft.roomCount && draft.groups.every(Boolean));
  }
}

function unresolvedClarification(command: AssistantCommand, draft: BookingDraft, fallbackStep: FinderStep) {
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
  if (draft.groups.length < draft.roomCount || draft.groups.some(group => !group)) {
    return { kind: "prompt", field: "guests", guestRoom: draft.groups.length + 1 };
  }
  return { kind: "ready" };
}

function stepForOutcome(outcome: BookingTurnOutcome, fallback: FinderStep): FinderStep {
  if (outcome.kind === "invalid_checkout") return "checkout";
  if (outcome.kind === "clarification") return outcome.step;
  if (outcome.kind === "prompt") return outcome.field;
  if (outcome.kind === "ready") return "searching";
  return fallback;
}

export function resolveAssistantTurn(current: BookingFlowState, command: AssistantCommand): BookingTurnResolution {
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

    if (action.roomCount && action.roomCount >= 1 && action.roomCount <= 3) {
      draft.roomCount = action.roomCount;
      draft.groups = draft.groups.slice(0, action.roomCount);
    }

    if (action.guests && action.guests >= 1 && action.guests <= 5) {
      if (current.step === "guests" && draft.roomCount) {
        const index = Math.min(draft.groups.length, Math.max(0, draft.roomCount - 1));
        draft.groups[index] = action.guests;
        draft.pendingGuestTotal = null;
      } else if (draft.roomCount === 1) {
        draft.groups = [action.guests];
        draft.pendingGuestTotal = null;
      } else {
        draft.pendingGuestTotal = action.guests;
      }
    }
  }

  if (draft.roomCount === 1 && draft.pendingGuestTotal && draft.groups.length === 0) {
    draft.groups = [draft.pendingGuestTotal];
    draft.pendingGuestTotal = null;
  }

  if (draft.checkin && draft.checkout && nightsBetween(draft.checkin, draft.checkout) < 1) {
    draft.checkout = "";
    const outcome: BookingTurnOutcome = { kind: "invalid_checkout" };
    return { state: { step: stepForOutcome(outcome, current.step), draft }, outcome };
  }

  const clarification = unresolvedClarification(command, draft, current.step);
  if (clarification) {
    const outcome: BookingTurnOutcome = { kind: "clarification", query: clarification.query, step: clarification.step };
    return { state: { step: stepForOutcome(outcome, current.step), draft }, outcome };
  }

  const outcome = nextOutcome(draft);
  return { state: { step: stepForOutcome(outcome, current.step), draft }, outcome };
}
