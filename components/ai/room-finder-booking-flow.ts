import type {
  RoomFinderCommand,
  RoomFinderDestinationKind,
} from "@/lib/ai-assistant/room-finder-types";
import {
  addDaysToIsoDate,
  daysBetweenIsoDates,
  isStrictIsoDate,
} from "@/lib/ai-assistant/room-finder-date";

export type FinderStep =
  | "destination"
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
  stayDestination: string;
  destinationKind: RoomFinderDestinationKind | null;
  checkin: string;
  checkout: string;
  roomCount: number | null;
  totalGuests: number | null;
  groups: number[];
  /** Stay length the guest stated in nights, kept until check-in is known and
   * when check-in is corrected later, so the stay length never changes silently. */
  statedNights?: number | null;
};

export type BookingFlowState = {
  step: FinderStep;
  draft: BookingDraft;
};

type ClarificationStep = "destination" | "checkin" | "checkout" | "rooms" | "guests";

export type BookingTurnOutcome =
  | { kind: "restart" }
  | { kind: "destination_mismatch"; destination: string }
  | { kind: "invalid_checkout" }
  | { kind: "clarification"; query: string; step: FinderStep; lead?: boolean }
  | { kind: "capacity"; guests: number; minimumRooms: number }
  | { kind: "prompt"; field: ClarificationStep; guestRoom?: number }
  | { kind: "ready" }
  | { kind: "unchanged" };

export type BookingTurnResolution = {
  state: BookingFlowState;
  outcome: BookingTurnOutcome;
  changed: boolean;
};

export type BookingFlowAction =
  | { type: "reset" }
  | { type: "commit_turn"; state: BookingFlowState }
  | { type: "set_step"; step: FinderStep }
  | { type: "choose_rooms"; roomCount: number }
  | { type: "choose_guests"; guests: number }
  | { type: "go_back" }
  | { type: "edit_dates" };

const MAX_ROOMS = 3;
const MAX_GUESTS_PER_ROOM = 5;
const MAX_TOTAL_GUESTS = MAX_ROOMS * MAX_GUESTS_PER_ROOM;
const CORE_INPUT_STEPS = new Set<FinderStep>(["destination", "checkin", "checkout", "rooms", "guests"]);

const GROUP_LIMIT_MESSAGE: Record<RoomFinderCommand["language"], (guests: number) => string> = {
  el: guests => `Για ${guests} άτομα η reception ετοιμάζει προσωπικά πρόταση, γιατί η αυτόματη αναζήτηση καλύπτει έως 15 άτομα σε 3 δωμάτια. Αφήστε μας τα στοιχεία σας παρακάτω ή καλέστε μας και θα σας απαντήσουμε σύντομα.`,
  en: guests => `For ${guests} guests our reception prepares a personal proposal, as the automated search covers up to 15 guests in 3 rooms. Leave your details below or call us and we will reply shortly.`,
  de: guests => `Für ${guests} Gäste erstellt unsere Rezeption ein persönliches Angebot, da die automatische Suche bis zu 15 Gäste in 3 Zimmern abdeckt. Hinterlassen Sie unten Ihre Daten oder rufen Sie uns an – wir melden uns in Kürze.`,
  fr: guests => `Pour ${guests} personnes, notre réception prépare une proposition personnalisée, car la recherche automatique couvre jusqu’à 15 personnes dans 3 chambres. Laissez vos coordonnées ci-dessous ou appelez-nous, nous vous répondrons rapidement.`,
  it: guests => `Per ${guests} ospiti la nostra reception prepara una proposta personalizzata, perché la ricerca automatica copre fino a 15 ospiti in 3 camere. Lasciate i vostri dati qui sotto o chiamateci e vi risponderemo a breve.`,
  es: guests => `Para ${guests} personas nuestra recepción prepara una propuesta personal, ya que la búsqueda automática cubre hasta 15 personas en 3 habitaciones. Dejen sus datos abajo o llámennos y les responderemos en breve.`,
  tr: guests => `${guests} kişi için resepsiyonumuz size özel bir teklif hazırlar; otomatik arama 3 odada en fazla 15 kişiyi kapsar. Bilgilerinizi aşağıya bırakın veya bizi arayın, kısa sürede dönüş yapalım.`,
};

const ROOM_LIMIT_MESSAGE: Record<RoomFinderCommand["language"], string> = {
  el: "Η αυτόματη αναζήτηση καλύπτει έως 3 δωμάτια, οπότε για περισσότερα δωμάτια η reception του Voulamandis House ετοιμάζει προσωπικά πρόταση. Αφήστε μας τα στοιχεία σας παρακάτω ή επικοινωνήστε μαζί μας μέσω τηλεφώνου ή WhatsApp.",
  en: "The automated search covers up to 3 rooms, so for more rooms the Voulamandis House reception prepares a personal proposal. Leave your details below or contact us by phone or WhatsApp.",
  de: "Die automatische Suche deckt bis zu 3 Zimmer ab; für mehr Zimmer erstellt die Rezeption des Voulamandis House ein persönliches Angebot. Hinterlassen Sie unten Ihre Daten oder kontaktieren Sie uns telefonisch oder über WhatsApp.",
  fr: "La recherche automatique couvre jusqu’à 3 chambres ; pour davantage de chambres, la réception de Voulamandis House prépare une proposition personnalisée. Laissez vos coordonnées ci-dessous ou contactez-nous par téléphone ou WhatsApp.",
  it: "La ricerca automatica copre fino a 3 camere; per più camere la reception di Voulamandis House prepara una proposta personalizzata. Lasciate i vostri dati qui sotto o contattateci per telefono o WhatsApp.",
  es: "La búsqueda automática cubre hasta 3 habitaciones; para más habitaciones, la recepción de Voulamandis House prepara una propuesta personal. Dejen sus datos abajo o contáctennos por teléfono o WhatsApp.",
  tr: "Otomatik arama en fazla 3 odayı kapsar; daha fazla oda için Voulamandis House resepsiyonu size özel bir teklif hazırlar. Bilgilerinizi aşağıya bırakın veya bize telefonla ya da WhatsApp üzerinden ulaşın.",
};

export function createInitialBookingFlowState(): BookingFlowState {
  return {
    step: "checkin",
    draft: {
      stayDestination: "",
      destinationKind: null,
      checkin: "",
      checkout: "",
      roomCount: null,
      totalGuests: null,
      groups: [],
      statedNights: null,
    },
  };
}

/** Fewest rooms that can host this many guests (up to 5 per room). */
export function minimumRoomsForGuests(guests: number) {
  return Math.ceil(guests / MAX_GUESTS_PER_ROOM);
}

/** True when the chosen room count cannot host the stated guest total. */
export function roomCountTooSmall(draft: BookingDraft) {
  return Boolean(
    draft.roomCount
      && draft.totalGuests
      && draft.totalGuests > draft.roomCount * MAX_GUESTS_PER_ROOM,
  );
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
  return Boolean(
    draft.destinationKind !== "other"
      && draft.checkin
      && draft.checkout
      && draft.roomCount
      && guestAllocationComplete(draft),
  );
}

function draftsEqual(left: BookingDraft, right: BookingDraft) {
  return (
    left.stayDestination === right.stayDestination &&
    left.destinationKind === right.destinationKind &&
    left.checkin === right.checkin &&
    left.checkout === right.checkout &&
    left.roomCount === right.roomCount &&
    left.totalGuests === right.totalGuests &&
    (left.statedNights ?? null) === (right.statedNights ?? null) &&
    left.groups.length === right.groups.length &&
    left.groups.every((value, index) => value === right.groups[index])
  );
}

function cloneDraft(draft: BookingDraft): BookingDraft {
  return { ...draft, groups: [...draft.groups] };
}

function goBackState(state: BookingFlowState): BookingFlowState {
  const draft = cloneDraft(state.draft);

  switch (state.step) {
    case "checkout":
      draft.checkin = "";
      draft.checkout = "";
      draft.statedNights = null;
      return { step: "checkin", draft };

    case "rooms":
      draft.checkout = "";
      draft.statedNights = null;
      return { step: "checkout", draft };

    case "guests": {
      const missingRoom = nextMissingGuestRoom(draft);
      if (!draft.roomCount || missingRoom === 1) {
        draft.roomCount = null;
        draft.totalGuests = null;
        draft.groups = [];
        return { step: "rooms", draft };
      }

      const previousRoom = Math.max(1, (missingRoom || draft.roomCount) - 1);
      draft.groups = draft.groups.slice(0, previousRoom - 1);
      return { step: "guests", draft };
    }

    case "selecting":
      if (!draft.roomCount) return state;
      draft.groups = draft.groups.slice(0, Math.max(0, draft.roomCount - 1));
      draft.totalGuests = null;
      return { step: "guests", draft };

    case "breakfast":
      return { step: "selecting", draft };

    case "complete":
      return { step: "breakfast", draft };

    default:
      return state;
  }
}

export function bookingFlowReducer(state: BookingFlowState, action: BookingFlowAction): BookingFlowState {
  switch (action.type) {
    case "reset":
      return createInitialBookingFlowState();

    case "commit_turn":
      return action.state;

    case "set_step":
      return { ...state, step: action.step };

    case "go_back":
      return goBackState(state);

    case "edit_dates": {
      const draft = cloneDraft(state.draft);
      draft.checkin = "";
      draft.checkout = "";
      draft.statedNights = null;
      return { step: "checkin", draft };
    }

    case "choose_rooms": {
      if (state.draft.totalGuests && state.draft.totalGuests > action.roomCount * MAX_GUESTS_PER_ROOM) {
        // Not enough beds for the stated group: stay on the room question.
        return {
          step: "rooms",
          draft: { ...state.draft, roomCount: null, groups: [] },
        };
      }
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
  return daysBetweenIsoDates(checkin, checkout);
}

function normalizeClarificationStep(field: string): ClarificationStep | null {
  if (field === "destination" || field === "stayDestination") return "destination";
  if (field === "roomCount") return "rooms";
  if (field === "totalGuests" || field === "guests" || field === "guestRoom" || field === "guestGroups") return "guests";
  if (field === "checkin" || field === "checkout" || field === "rooms") return field;
  return null;
}

function commandSuppliesField(command: RoomFinderCommand, field: ClarificationStep) {
  switch (field) {
    case "destination":
      return command.actions.some(action =>
        action.type === "set_stay_destination" && Boolean(action.destination && action.destinationKind),
      );
    case "checkin":
      return command.actions.some(action => Boolean(action.checkin && isStrictIsoDate(action.checkin)));
    case "checkout":
      return command.actions.some(action =>
        Boolean(action.checkout && isStrictIsoDate(action.checkout)) ||
        Boolean(action.nights && Number.isInteger(action.nights)),
      );
    case "rooms":
      return command.actions.some(action => Boolean(action.roomCount && validRoomCount(action.roomCount)));
    case "guests":
      return command.actions.some(action =>
        Boolean(action.totalGuests && validTotalGuests(action.totalGuests)) ||
        Boolean(action.guests && validRoomGuests(action.guests)),
      );
  }
}

function unresolvedClarification(command: RoomFinderCommand, fallbackStep: FinderStep) {
  for (const action of command.actions) {
    if (action.type !== "ask_clarification" || !action.query) continue;
    const fields = Array.isArray(action.missingFields) ? action.missingFields : [];

    if (fields.length === 0) return { query: action.query, step: fallbackStep };

    let recognizedField = false;
    for (const rawField of fields) {
      const field = normalizeClarificationStep(rawField);
      if (!field) continue;
      recognizedField = true;
      if (!commandSuppliesField(command, field)) return { query: action.query, step: field };
    }

    if (!recognizedField) return { query: action.query, step: fallbackStep };
  }
  return null;
}

function nextOutcome(draft: BookingDraft): BookingTurnOutcome {
  if (draft.destinationKind === "other" && draft.stayDestination) {
    return { kind: "destination_mismatch", destination: draft.stayDestination };
  }
  if (!draft.checkin) return { kind: "prompt", field: "checkin" };
  if (!draft.checkout) return { kind: "prompt", field: "checkout" };
  if (!draft.roomCount) return { kind: "prompt", field: "rooms" };
  const guestRoom = nextMissingGuestRoom(draft);
  if (guestRoom) return { kind: "prompt", field: "guests", guestRoom };
  return { kind: "ready" };
}

function stepForOutcome(outcome: BookingTurnOutcome, fallback: FinderStep): FinderStep {
  if (outcome.kind === "destination_mismatch") return "destination";
  if (outcome.kind === "invalid_checkout") return "checkout";
  if (outcome.kind === "clarification") return outcome.step;
  if (outcome.kind === "capacity") return "rooms";
  if (outcome.kind === "prompt") return outcome.field;
  if (outcome.kind === "ready") return "searching";
  return fallback;
}

export function resolveAssistantTurn(current: BookingFlowState, command: RoomFinderCommand): BookingTurnResolution {
  if (command.actions.some(action => action.type === "restart_search")) {
    return {
      state: createInitialBookingFlowState(),
      outcome: { kind: "restart" },
      changed: true,
    };
  }

  const draft: BookingDraft = {
    ...current.draft,
    groups: [...current.draft.groups],
  };

  const incomingDestination = [...command.actions]
    .reverse()
    .find(action =>
      action.type === "set_stay_destination" && action.destination && action.destinationKind,
    );
  if (incomingDestination?.destination && incomingDestination.destinationKind) {
    draft.stayDestination = incomingDestination.destination.slice(0, 120);
    draft.destinationKind = incomingDestination.destinationKind;
  }

  // Dates are resolved as a whole, independent of the order in which the
  // interpreter listed its actions: check-in first, then checkout or nights.
  let incomingCheckin = "";
  let incomingCheckout = "";
  let incomingNights = 0;
  for (const action of command.actions) {
    if (action.checkin && isStrictIsoDate(action.checkin)) incomingCheckin = action.checkin;
    if (action.checkout && isStrictIsoDate(action.checkout)) incomingCheckout = action.checkout;
    if (action.nights && Number.isInteger(action.nights) && action.nights >= 1 && action.nights <= 60) {
      incomingNights = action.nights;
    }
  }

  if (incomingCheckin) draft.checkin = incomingCheckin;
  if (incomingCheckout) {
    draft.checkout = incomingCheckout;
    draft.statedNights = null;
  } else if (incomingNights) {
    draft.statedNights = incomingNights;
    const derivedCheckout = addDaysToIsoDate(draft.checkin, incomingNights);
    if (derivedCheckout) draft.checkout = derivedCheckout;
  } else if (incomingCheckin && draft.statedNights) {
    // A corrected arrival keeps the stay length the guest asked for.
    const derivedCheckout = addDaysToIsoDate(incomingCheckin, draft.statedNights);
    if (derivedCheckout) draft.checkout = derivedCheckout;
  }

  const incomingRoomCount = [...command.actions]
    .reverse()
    .find(action => action.roomCount != null)?.roomCount;

  if (
    incomingRoomCount != null &&
    Number.isInteger(incomingRoomCount) &&
    incomingRoomCount > MAX_ROOMS
  ) {
    // The guest total is kept so reception sees the group size in the lead.
    draft.roomCount = null;
    draft.groups = [];
    const statedGuests = [...command.actions].reverse().find(action => action.totalGuests != null)?.totalGuests;
    if (statedGuests && validTotalGuests(statedGuests)) draft.totalGuests = statedGuests;
    const outcome: BookingTurnOutcome = {
      kind: "clarification",
      query: ROOM_LIMIT_MESSAGE[command.language] || ROOM_LIMIT_MESSAGE.en,
      step: "unavailable",
      lead: true,
    };
    return {
      state: { step: "unavailable", draft },
      outcome,
      changed: true,
    };
  }

  if (incomingRoomCount && validRoomCount(incomingRoomCount)) {
    if (draft.roomCount !== incomingRoomCount) draft.groups = [];
    draft.roomCount = incomingRoomCount;
  }

  const incomingTotalGuests = [...command.actions]
    .reverse()
    .find(action => action.totalGuests != null)?.totalGuests;

  if (
    incomingTotalGuests != null &&
    Number.isInteger(incomingTotalGuests) &&
    incomingTotalGuests > MAX_TOTAL_GUESTS
  ) {
    draft.roomCount = null;
    draft.totalGuests = null;
    draft.groups = [];
    const language = command.language;
    return {
      state: { step: "unavailable", draft },
      outcome: {
        kind: "clarification",
        query: (GROUP_LIMIT_MESSAGE[language] || GROUP_LIMIT_MESSAGE.en)(incomingTotalGuests),
        step: "unavailable",
        lead: true,
      },
      changed: true,
    };
  }

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

  // The guest total must fit the chosen rooms (5 guests per room). Otherwise
  // ask for the room count again instead of looping on an impossible
  // per-room question or silently dropping guests.
  let capacityOutcome: BookingTurnOutcome | null = null;
  if (roomCountTooSmall(draft)) {
    capacityOutcome = {
      kind: "capacity",
      guests: draft.totalGuests!,
      minimumRooms: minimumRoomsForGuests(draft.totalGuests!),
    };
    draft.roomCount = null;
    draft.groups = [];
  }

  normalizeGuestAllocation(draft);
  const changed = !draftsEqual(current.draft, draft);

  if (draft.destinationKind === "other" && draft.stayDestination) {
    const outcome: BookingTurnOutcome = {
      kind: "destination_mismatch",
      destination: draft.stayDestination,
    };
    return {
      state: { step: stepForOutcome(outcome, current.step), draft },
      outcome,
      changed,
    };
  }

  if (draft.checkin && draft.checkout && nightsBetween(draft.checkin, draft.checkout) < 1) {
    draft.checkout = "";
    const invalidChanged = !draftsEqual(current.draft, draft);
    const outcome: BookingTurnOutcome = { kind: "invalid_checkout" };
    return {
      state: { step: stepForOutcome(outcome, current.step), draft },
      outcome,
      changed: invalidChanged,
    };
  }

  const clarification = unresolvedClarification(command, current.step);
  if (clarification) {
    const outcome: BookingTurnOutcome = {
      kind: "clarification",
      query: clarification.query,
      step: clarification.step,
    };
    return {
      state: { step: stepForOutcome(outcome, current.step), draft },
      outcome,
      changed,
    };
  }

  if (capacityOutcome) {
    return {
      state: { step: "rooms", draft },
      outcome: capacityOutcome,
      changed,
    };
  }

  if (!changed && !CORE_INPUT_STEPS.has(current.step)) {
    const outcome: BookingTurnOutcome = { kind: "unchanged" };
    return {
      state: { step: current.step, draft },
      outcome,
      changed: false,
    };
  }

  const outcome = nextOutcome(draft);
  return {
    state: { step: stepForOutcome(outcome, current.step), draft },
    outcome,
    changed,
  };
}
