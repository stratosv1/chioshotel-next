import type { AssistantCommand, AssistantPreferences } from "@/lib/ai-assistant/types";
import type { RoomFinderFilter } from "./room-finder-copy";

export type FinderStep =
  | "checkin"
  | "checkout"
  | "rooms"
  | "guests"
  | "preferences"
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
  filters: RoomFinderFilter[];
};

export type BookingFlowState = {
  step: FinderStep;
  draft: BookingDraft;
};

type ClarificationStep = "checkin" | "checkout" | "rooms" | "guests" | "preferences";

export type BookingTurnOutcome =
  | { kind: "restart" }
  | { kind: "invalid_checkout" }
  | { kind: "clarification"; query: string; step: FinderStep }
  | { kind: "prompt"; field: ClarificationStep; guestRoom?: number };

export type BookingTurnResolution = {
  state: BookingFlowState;
  outcome: BookingTurnOutcome;
};

export type BookingFlowAction =
  | { type: "reset" }
  | { type: "commit_turn"; state: BookingFlowState }
  | { type: "set_step"; step: FinderStep }
  | { type: "set_filters"; filters: RoomFinderFilter[] }
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
      filters: [],
    },
  };
}

export function bookingFlowReducer(state: BookingFlowState, action: BookingFlowAction): BookingFlowState {
  switch (action.type) {
    case "reset":
      return createInitialBookingFlowState();
    case "commit_turn":
      return action.state;
    case "set_step":
      return { ...state, step: action.step };
    case "set_filters":
      return { ...state, draft: { ...state.draft, filters: action.filters } };
    case "choose_rooms": {
      const pendingGuests = state.draft.pendingGuestTotal;
      if (action.roomCount === 1 && pendingGuests) {
        return {
          step: "preferences",
          draft: {
            ...state.draft,
            roomCount: 1,
            groups: [pendingGuests],
            pendingGuestTotal: null,
          },
        };
      }
      return {
        step: "guests",
        draft: {
          ...state.draft,
          roomCount: action.roomCount,
          groups: [],
          pendingGuestTotal: action.roomCount > 1 ? null : state.draft.pendingGuestTotal,
        },
      };
    }
    case "choose_guests": {
      const groups = [...state.draft.groups, action.guests];
      const needsAnotherRoom = Boolean(state.draft.roomCount && groups.length < state.draft.roomCount);
      return {
        step: needsAnotherRoom ? "guests" : "preferences",
        draft: { ...state.draft, groups, pendingGuestTotal: null },
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

export function mergePreferenceFilters(current: RoomFinderFilter[], preferences?: AssistantPreferences) {
  if (!preferences) return current;
  const next = new Set(current);

  if (preferences.floor === "first") {
    next.delete("ground");
    next.delete("noStairs");
    next.add("first");
  } else if (preferences.floor === "ground") {
    next.delete("first");
    next.add("ground");
  } else if (preferences.floor === "any") {
    next.delete("first");
    next.delete("ground");
  }

  if (preferences.noStairs === true) {
    next.delete("first");
    next.add("noStairs");
  } else if (preferences.noStairs === false) {
    next.delete("noStairs");
  }

  if (preferences.kitchenette === true || preferences.fullKitchen === true) next.add("kitchen");
  if (preferences.budget === "lowest") next.add("economy");
  if (preferences.budget === "family" || preferences.familyFriendly === true) next.add("family");

  return Array.from(next);
}

export function preferenceContext(filters: RoomFinderFilter[]): AssistantPreferences {
  return {
    floor: filters.includes("first") ? "first" : filters.includes("ground") ? "ground" : undefined,
    noStairs: filters.includes("noStairs") || undefined,
    kitchenette: filters.includes("kitchen") || undefined,
    budget: filters.includes("economy") ? "lowest" : filters.includes("family") ? "family" : undefined,
    familyFriendly: filters.includes("family") || undefined,
  };
}

function normalizeClarificationStep(field: string): ClarificationStep | null {
  if (field === "roomCount") return "rooms";
  if (field === "checkin" || field === "checkout" || field === "rooms" || field === "guests" || field === "preferences") {
    return field;
  }
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
    case "preferences":
      return false;
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

function nextMissingPrompt(draft: BookingDraft): BookingTurnOutcome {
  if (!draft.checkin) return { kind: "prompt", field: "checkin" };
  if (!draft.checkout) return { kind: "prompt", field: "checkout" };
  if (!draft.roomCount) return { kind: "prompt", field: "rooms" };
  if (draft.groups.length < draft.roomCount || draft.groups.some(group => !group)) {
    return { kind: "prompt", field: "guests", guestRoom: draft.groups.length + 1 };
  }
  return { kind: "prompt", field: "preferences" };
}

function stepForOutcome(outcome: BookingTurnOutcome, fallback: FinderStep): FinderStep {
  if (outcome.kind === "invalid_checkout") return "checkout";
  if (outcome.kind === "clarification") return outcome.step;
  if (outcome.kind === "prompt") return outcome.field;
  return fallback;
}

export function resolveAssistantTurn(current: BookingFlowState, command: AssistantCommand): BookingTurnResolution {
  if (command.actions.some(action => action.type === "restart_search")) {
    return { state: createInitialBookingFlowState(), outcome: { kind: "restart" } };
  }

  let draft: BookingDraft = {
    ...current.draft,
    groups: [...current.draft.groups],
    filters: [...current.draft.filters],
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

    if (action.preferences) {
      draft.filters = mergePreferenceFilters(draft.filters, action.preferences);
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

  const outcome = nextMissingPrompt(draft);
  return { state: { step: stepForOutcome(outcome, current.step), draft }, outcome };
}
