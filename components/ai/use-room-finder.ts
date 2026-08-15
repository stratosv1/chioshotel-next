"use client";

import { FormEvent, useMemo, useReducer, useRef, useState } from "react";
import type { RoomFinderCommand } from "@/lib/ai-assistant/room-finder-types";
import type { RoomFinderLanguage } from "./room-finder-copy";
import { ROOM_FINDER_COPY } from "./room-finder-copy";
import { ROOM_FINDER_TONE } from "./room-finder-tone";
import { TURN_TIMING, type TurnPace } from "./room-finder-flow-helpers";
import {
  bookingFlowReducer,
  createInitialBookingFlowState,
  nextMissingGuestRoom,
  nightsBetween,
  resolveAssistantTurn,
  type BookingDraft,
  type FinderStep,
} from "./room-finder-booking-flow";
import {
  feasibleOffersForGroup,
  hasDistinctOfferPlan,
  roomOfferKey,
} from "./room-finder-offer-plan";
import type { ChatItem, MessageKind, Reaction } from "./room-finder-chat-ui";
import type { RoomOffer } from "./room-finder-carousel";
import type { RoomChoice } from "./room-finder-selected-card";

export type { FinderStep } from "./room-finder-booking-flow";

const wait = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));
const rid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const rank = (room: RoomOffer) => {
  const order = [2, 6, 5, 7, 1, 3, 4, 8, 9, 10];
  const index = order.indexOf(Number(room.roomNumber));
  return index < 0 ? 99 : index;
};

const INVENTORY_UNAVAILABLE: Record<RoomFinderLanguage, string> = {
  el: "Η live διαθεσιμότητα δεν μπορεί να επιβεβαιωθεί αυτή τη στιγμή. Δοκιμάστε ξανά σε λίγα λεπτά ή επικοινωνήστε μαζί μας μέσω WhatsApp.",
  en: "Live availability cannot be confirmed right now. Please try again in a few minutes or contact us on WhatsApp.",
  de: "Die Live-Verfügbarkeit kann momentan nicht bestätigt werden. Versuchen Sie es in wenigen Minuten erneut oder kontaktieren Sie uns über WhatsApp.",
  fr: "La disponibilité en direct ne peut pas être confirmée pour le moment. Réessayez dans quelques minutes ou contactez-nous sur WhatsApp.",
  it: "Al momento non posso confermare la disponibilità in tempo reale. Riprovate tra qualche minuto o contattateci su WhatsApp.",
  es: "Ahora mismo no puedo confirmar la disponibilidad en tiempo real. Inténtenlo de nuevo en unos minutos o contáctennos por WhatsApp.",
  tr: "Canlı müsaitlik şu anda doğrulanamıyor. Lütfen birkaç dakika sonra tekrar deneyin veya WhatsApp üzerinden bize ulaşın.",
};

const INTERPRETER_UNAVAILABLE: Record<RoomFinderLanguage, string> = {
  el: "Υπήρξε προσωρινό πρόβλημα σύνδεσης με τον βοηθό. Δοκιμάστε ξανά την τελευταία απάντησή σας σε λίγα δευτερόλεπτα 🙏",
  en: "There was a temporary connection problem with the assistant. Please try your last answer again in a few seconds 🙏",
  de: "Es gab vorübergehend ein Verbindungsproblem mit dem Assistenten. Bitte versuchen Sie Ihre letzte Antwort in einigen Sekunden erneut 🙏",
  fr: "Un problème de connexion temporaire avec l’assistant est survenu. Réessayez votre dernière réponse dans quelques secondes 🙏",
  it: "Si è verificato un problema temporaneo di connessione con l’assistente. Riprovate l’ultima risposta tra qualche secondo 🙏",
  es: "Ha habido un problema temporal de conexión con el asistente. Vuelvan a intentar su última respuesta en unos segundos 🙏",
  tr: "Asistanla bağlantıda geçici bir sorun oluştu. Lütfen son yanıtınızı birkaç saniye sonra tekrar deneyin 🙏",
};

const NO_BOOKING_CHANGE: Record<RoomFinderLanguage, string> = {
  el: "Μπορώ να αλλάξω ημερομηνίες, αριθμό δωματίων ή άτομα. Γράψτε μου π.χ. «τελικά 3 άτομα» ή «αναχώρηση 13/10».",
  en: "I can change your dates, number of rooms or guests. For example: “actually 3 guests” or “check-out 13/10”.",
  de: "Ich kann Ihre Daten, die Zimmeranzahl oder die Gästezahl ändern. Zum Beispiel: „doch 3 Gäste“ oder „Check-out 13/10“.",
  fr: "Je peux modifier vos dates, le nombre de chambres ou de personnes. Par exemple : « finalement 3 personnes » ou « check-out 13/10 ».",
  it: "Posso modificare le date, il numero di camere o degli ospiti. Per esempio: « in realtà 3 ospiti » oppure « check-out 13/10 ».",
  es: "Puedo cambiar las fechas, el número de habitaciones o de huéspedes. Por ejemplo: « al final 3 personas » o « check-out 13/10 ».",
  tr: "Tarihleri, oda sayısını veya kişi sayısını değiştirebilirim. Örneğin: “aslında 3 kişi” veya “çıkış 13/10”.",
};

class AvailabilityError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = "AvailabilityError";
  }
}

export function useRoomFinder(language: RoomFinderLanguage) {
  const copy = ROOM_FINDER_COPY[language];
  const tone = ROOM_FINDER_TONE[language];
  const [flow, dispatchFlow] = useReducer(bookingFlowReducer, undefined, createInitialBookingFlowState);
  const [messages, setMessages] = useState<ChatItem[]>([
    { id: rid(), role: "assistant", content: copy.welcome },
  ]);
  const [input, setInput] = useState("");
  const [offers, setOffers] = useState<RoomOffer[][]>([]);
  const [activeGroup, setActiveGroup] = useState(0);
  const [choices, setChoices] = useState<RoomChoice[]>([]);
  const [breakfast, setBreakfast] = useState(false);
  const [typing, setTyping] = useState(false);
  const [selectingOfferKey, setSelectingOfferKey] = useState<string | null>(null);
  const turnLocked = useRef(false);

  const { step, draft } = flow;
  const { checkin, checkout, roomCount, totalGuests, groups } = draft;
  const guestTotal = totalGuests || groups.reduce((sum, guests) => sum + guests, 0);
  const nights = checkin && checkout ? Math.max(0, nightsBetween(checkin, checkout)) : 0;
  const canGoBack = step !== "checkin" && step !== "searching" && step !== "unavailable";
  const selectedKeys = useMemo(
    () => new Set(choices.map(choice => roomOfferKey(choice.offer))),
    [choices],
  );
  const capacityEligibleOffers = useMemo(
    () => offers.map((groupOffers, groupIndex) => {
      const guests = groups[groupIndex] || 0;
      return groupOffers.filter(offer => !offer.maxGuests || offer.maxGuests >= guests);
    }),
    [offers, groups],
  );
  const visibleOffers = useMemo(
    () => feasibleOffersForGroup(capacityEligibleOffers, activeGroup, selectedKeys)
      .sort((left, right) => left.directTotal - right.directTotal || rank(left) - rank(right)),
    [capacityEligibleOffers, activeGroup, selectedKeys],
  );

  const add = (role: ChatItem["role"], content: string, kind: MessageKind = "normal") =>
    setMessages(current => [...current, { id: rid(), role, content, kind }]);

  function clearSearchSelectionState() {
    setOffers([]);
    setActiveGroup(0);
    setChoices([]);
    setBreakfast(false);
    setSelectingOfferKey(null);
  }

  async function beginUserTurn(
    content: string,
    kind: MessageKind = "normal",
    reaction: Reaction = "👍",
    pace: TurnPace = "normal",
  ) {
    if (turnLocked.current) return false;
    turnLocked.current = true;
    const timing = TURN_TIMING[pace];
    const id = rid();
    setMessages(current => [...current, { id, role: "user", content, kind }]);
    await wait(timing.reaction);
    setMessages(current => current.map(message => (
      message.id === id ? { ...message, reaction } : message
    )));
    await wait(timing.after);
    return true;
  }

  const endUserTurn = () => {
    turnLocked.current = false;
  };

  function reset() {
    turnLocked.current = false;
    dispatchFlow({ type: "reset" });
    setMessages([{ id: rid(), role: "assistant", content: copy.welcome }]);
    setInput("");
    clearSearchSelectionState();
    setTyping(false);
  }

  function goBack() {
    if (turnLocked.current || !canGoBack) return;

    const previousStep = step;
    const nextFlow = bookingFlowReducer(flow, { type: "go_back" });
    if (nextFlow === flow) return;

    if (previousStep === "breakfast") {
      const lastChoice = choices[choices.length - 1];
      if (!lastChoice) return;
      setChoices(current => current.slice(0, -1));
      setActiveGroup(Math.max(0, lastChoice.group - 1));
      setBreakfast(false);
      setSelectingOfferKey(null);
      dispatchFlow({ type: "commit_turn", state: nextFlow });
      add("assistant", tone.results(lastChoice.group, lastChoice.guests));
      return;
    }

    if (previousStep === "complete") {
      setBreakfast(false);
      setSelectingOfferKey(null);
      dispatchFlow({ type: "commit_turn", state: nextFlow });
      return;
    }

    clearSearchSelectionState();
    dispatchFlow({ type: "commit_turn", state: nextFlow });

    switch (nextFlow.step) {
      case "checkin":
        add("assistant", tone.invalidDate);
        return;
      case "checkout":
        add("assistant", tone.checkout);
        return;
      case "rooms":
        add("assistant", tone.rooms);
        return;
      case "guests":
        add("assistant", tone.guests(nextMissingGuestRoom(nextFlow.draft) || 1));
        return;
      default:
        return;
    }
  }

  function editDates() {
    if (turnLocked.current || step === "searching") return;
    const nextFlow = bookingFlowReducer(flow, { type: "edit_dates" });
    clearSearchSelectionState();
    dispatchFlow({ type: "commit_turn", state: nextFlow });
    add("assistant", tone.invalidDate);
  }

  async function interpret(value: string, current: FinderStep): Promise<RoomFinderCommand> {
    const recentMessages = messages.slice(-8).map(({ role, content }) => ({ role, content }));
    const requestBody = JSON.stringify({
      message: value,
      context: {
        language,
        currentStep: current,
        checkin: checkin || undefined,
        checkout: checkout || undefined,
        totalGuests: totalGuests || undefined,
        roomCount: roomCount || undefined,
        guestGroups: groups,
        currentRoom: current === "guests" ? nextMissingGuestRoom(draft) || undefined : undefined,
        recentMessages,
      },
    });

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15_000);

      try {
        const response = await fetch("/api/ai-assistant/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: requestBody,
        });
        const data = await response.json().catch(() => null);
        if (response.ok && data?.command) return data.command as RoomFinderCommand;

        const code = String(data?.code || "AI_UNAVAILABLE");
        const transient = response.status === 502
          || response.status === 504
          || code === "AI_TIMEOUT"
          || code === "AI_UNAVAILABLE";
        if (attempt === 0 && transient) {
          await wait(250);
          continue;
        }
        throw new Error(code);
      } catch (error) {
        if (attempt === 0 && error instanceof TypeError) {
          await wait(250);
          continue;
        }
        throw error;
      } finally {
        window.clearTimeout(timeout);
      }
    }

    throw new Error("AI_UNAVAILABLE");
  }

  async function runAvailabilitySearch(searchDraft: BookingDraft) {
    dispatchFlow({ type: "set_step", step: "searching" });
    add("assistant", tone.searching);
    setTyping(true);

    try {
      const result = await Promise.all(searchDraft.groups.map(async guests => {
        const query = new URLSearchParams({
          checkin: searchDraft.checkin,
          checkout: searchDraft.checkout,
          guests: String(guests),
          lang: language,
          allowSplit: searchDraft.roomCount === 1 ? "1" : "0",
        });
        const response = await fetch(`/api/ai-room-finder/availability?${query}`, { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new AvailabilityError(String(payload?.code || "REQUEST_FAILED"));
        }
        return (Array.isArray(payload.offers) ? payload.offers : []) as RoomOffer[];
      }));

      const eligible = result.map((groupOffers, groupIndex) => {
        const guests = searchDraft.groups[groupIndex] || 0;
        return groupOffers.filter(offer => !offer.maxGuests || offer.maxGuests >= guests);
      });

      if (!hasDistinctOfferPlan(eligible)) {
        setOffers([]);
        setActiveGroup(0);
        dispatchFlow({ type: "set_step", step: "unavailable" });
        add("assistant", tone.unavailable);
        return;
      }

      setOffers(eligible);
      setActiveGroup(0);
      dispatchFlow({ type: "set_step", step: "selecting" });
      add("assistant", tone.results(1, searchDraft.groups[0]));
    } catch (error) {
      setOffers([]);
      setActiveGroup(0);
      dispatchFlow({ type: "set_step", step: "unavailable" });
      const stale = error instanceof AvailabilityError && (
        error.code === "STALE_DATA" || error.code === "DATA_UNAVAILABLE"
      );
      add("assistant", stale ? INVENTORY_UNAVAILABLE[language] : tone.unavailable);
    } finally {
      setTyping(false);
    }
  }

  async function applyCommand(command: RoomFinderCommand) {
    const resolution = resolveAssistantTurn(flow, command);

    if (resolution.outcome.kind === "restart") {
      reset();
      return;
    }

    if (resolution.changed) clearSearchSelectionState();
    dispatchFlow({ type: "commit_turn", state: resolution.state });

    if (resolution.outcome.kind === "invalid_checkout") {
      add("assistant", tone.invalidCheckout);
      return;
    }

    if (resolution.outcome.kind === "clarification") {
      add("assistant", resolution.outcome.query);
      return;
    }

    if (resolution.outcome.kind === "unchanged") {
      add("assistant", NO_BOOKING_CHANGE[language]);
      return;
    }

    if (resolution.outcome.kind === "ready") {
      await runAvailabilitySearch(resolution.state.draft);
      return;
    }

    switch (resolution.outcome.field) {
      case "checkin":
        add("assistant", tone.invalidDate);
        return;
      case "checkout":
        add("assistant", tone.checkout);
        return;
      case "rooms":
        add("assistant", tone.rooms);
        return;
      case "guests":
        add("assistant", tone.guests(resolution.outcome.guestRoom || 1));
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value || turnLocked.current || step === "searching") return;

    const current = step;
    setInput("");
    const promise = interpret(value, current);
    const kind: MessageKind = current === "checkin" || current === "checkout"
      ? "date"
      : current === "rooms"
        ? "room"
        : current === "guests"
          ? "guest"
          : "normal";

    if (!await beginUserTurn(value, kind, current === "rooms" ? "❤️" : "👍")) return;

    setTyping(true);
    try {
      const command = await promise;
      setTyping(false);
      await applyCommand(command);
    } catch (error) {
      console.error("Room Finder interpreter request failed", error);
      setTyping(false);
      add("assistant", INTERPRETER_UNAVAILABLE[language]);
    } finally {
      endUserTurn();
    }
  }

  async function chooseRooms(roomCountValue: number) {
    if (!await beginUserTurn(copy.roomLabel(roomCountValue), "room", "❤️")) return;

    try {
      const nextFlow = bookingFlowReducer(flow, {
        type: "choose_rooms",
        roomCount: roomCountValue,
      });
      dispatchFlow({ type: "commit_turn", state: nextFlow });

      if (nextFlow.step === "searching") {
        await runAvailabilitySearch(nextFlow.draft);
      } else {
        add("assistant", tone.guests(nextMissingGuestRoom(nextFlow.draft) || 1));
      }
    } finally {
      endUserTurn();
    }
  }

  async function chooseGuests(guests: number) {
    if (!await beginUserTurn(copy.guestLabel(guests), "guest", "👍")) return;

    try {
      const nextFlow = bookingFlowReducer(flow, { type: "choose_guests", guests });
      dispatchFlow({ type: "commit_turn", state: nextFlow });

      if (nextFlow.step === "searching") {
        await runAvailabilitySearch(nextFlow.draft);
      } else {
        add("assistant", tone.guests(nextMissingGuestRoom(nextFlow.draft) || 1));
      }
    } finally {
      endUserTurn();
    }
  }

  async function selectOffer(offer: RoomOffer) {
    if (turnLocked.current) return;
    const key = roomOfferKey(offer);
    if (!visibleOffers.some(candidate => roomOfferKey(candidate) === key)) return;

    setSelectingOfferKey(key);
    try {
      if (!await beginUserTurn(`${copy.select}: ${offer.name}`, "room", "❤️", "quick")) return;

      const nextChoices = [
        ...choices,
        { group: activeGroup + 1, guests: groups[activeGroup], offer },
      ];
      setChoices(nextChoices);
      add("assistant", tone.selected(offer.name));

      if (roomCount && activeGroup + 1 < roomCount) {
        const nextGroup = activeGroup + 1;
        setActiveGroup(nextGroup);
        add("assistant", tone.results(nextGroup + 1, groups[nextGroup]));
      } else {
        dispatchFlow({ type: "set_step", step: "breakfast" });
      }
    } finally {
      setSelectingOfferKey(null);
      endUserTurn();
    }
  }

  async function chooseBreakfast(value: boolean) {
    if (!await beginUserTurn(
      value ? copy.yesBreakfast : copy.noBreakfast,
      "normal",
      value ? "❤️" : "👍",
    )) return;

    setBreakfast(value);
    dispatchFlow({ type: "set_step", step: "complete" });
    add("assistant", tone.finalizing);
    endUserTurn();
  }

  return {
    copy,
    step,
    messages,
    input,
    setInput,
    checkin,
    checkout,
    roomCount,
    groups,
    offers,
    activeGroup,
    choices,
    breakfast,
    typing,
    selectingOfferKey,
    guestTotal,
    nights,
    visibleOffers,
    canGoBack,
    reset,
    goBack,
    editDates,
    submit,
    chooseRooms,
    chooseGuests,
    selectOffer,
    chooseBreakfast,
  };
}
