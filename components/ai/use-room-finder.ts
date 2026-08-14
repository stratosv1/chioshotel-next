"use client";

import { FormEvent, useMemo, useReducer, useRef, useState } from "react";
import type { RoomFinderCommand } from "@/lib/ai-assistant/room-finder-types";
import type { RoomFinderLanguage } from "./room-finder-copy";
import { ROOM_FINDER_COPY } from "./room-finder-copy";
import { ROOM_FINDER_TONE } from "./room-finder-tone";
import { TURN_TIMING } from "./room-finder-flow-helpers";
import {
  bookingFlowReducer,
  createInitialBookingFlowState,
  nextMissingGuestRoom,
  nightsBetween,
  resolveAssistantTurn,
  type BookingDraft,
  type FinderStep,
} from "./room-finder-booking-flow";
import type { ChatItem, MessageKind, Reaction } from "./room-finder-chat-ui";
import type { RoomOffer } from "./room-finder-carousel";
import type { RoomChoice } from "./room-finder-selected-card";

export type { FinderStep } from "./room-finder-booking-flow";
export type FeedbackMode = "idle" | "happy" | "different";
type TurnPace = "normal" | "quick";

const wait = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));
const rid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const rank = (room: RoomOffer) => {
  const order = [2, 6, 5, 7, 1, 3, 4, 8, 9, 10];
  const i = order.indexOf(Number(room.roomNumber));
  return i < 0 ? 99 : i;
};
const offerKey = (offer: RoomOffer) => `${offer.roomId}:${offer.unitId}`;

const INVENTORY_UNAVAILABLE: Record<RoomFinderLanguage, string> = {
  el: "Σας ευχαριστώ για την υπομονή σας 🙏 Η live διαθεσιμότητα δεν μπορεί να επιβεβαιωθεί αυτή τη στιγμή και δεν θέλω να σας δείξω παλιά στοιχεία. Δοκιμάστε ξανά σε λίγα λεπτά ή μπορούμε να το ελέγξουμε μαζί μέσω WhatsApp 💬",
  en: "Thank you for your patience 🙏 Live availability cannot be confirmed right now, and I don’t want to show you outdated information. Please try again in a few minutes, or we can check it together on WhatsApp 💬",
  de: "Vielen Dank für Ihre Geduld 🙏 Die Live-Verfügbarkeit kann momentan nicht zuverlässig bestätigt werden, und ich möchte Ihnen keine veralteten Angaben zeigen. Versuchen Sie es bitte in wenigen Minuten erneut oder wir prüfen es gemeinsam über WhatsApp 💬",
  fr: "Merci pour votre patience 🙏 La disponibilité en direct ne peut pas être confirmée pour le moment et je préfère ne pas vous montrer d’informations anciennes. Réessayez dans quelques minutes ou vérifions-la ensemble sur WhatsApp 💬",
  it: "Grazie per la pazienza 🙏 Al momento non posso confermare in modo affidabile la disponibilità live e non voglio mostrarvi dati non aggiornati. Riprovate tra qualche minuto oppure possiamo verificarla insieme su WhatsApp 💬",
  es: "Gracias por su paciencia 🙏 En este momento no puedo confirmar de forma fiable la disponibilidad en directo y no quiero mostrarles información desactualizada. Inténtenlo de nuevo en unos minutos o podemos comprobarlo juntos por WhatsApp 💬",
  tr: "Sabrınız için teşekkür ederim 🙏 Canlı müsaitlik şu anda güvenilir şekilde doğrulanamıyor ve size eski bilgi göstermek istemiyorum. Lütfen birkaç dakika sonra tekrar deneyin veya WhatsApp üzerinden birlikte kontrol edelim 💬",
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
  const [messages, setMessages] = useState<ChatItem[]>([{ id: rid(), role: "assistant", content: copy.welcome }]);
  const [input, setInput] = useState("");
  const [offers, setOffers] = useState<RoomOffer[][]>([]);
  const [activeGroup, setActiveGroup] = useState(0);
  const [choices, setChoices] = useState<RoomChoice[]>([]);
  const [feedback, setFeedback] = useState<FeedbackMode>("idle");
  const [breakfast, setBreakfast] = useState(false);
  const [typing, setTyping] = useState(false);
  const [selectingOfferKey, setSelectingOfferKey] = useState<string | null>(null);
  const turnLocked = useRef(false);

  const { step, draft } = flow;
  const { checkin, checkout, roomCount, totalGuests, groups } = draft;
  const guestTotal = totalGuests || groups.reduce((a, b) => a + b, 0);
  const nights = checkin && checkout ? Math.max(0, nightsBetween(checkin, checkout)) : 0;
  const selected = useMemo(() => new Set(choices.map(c => offerKey(c.offer))), [choices]);
  const visibleOffers = useMemo(() => {
    const guests = groups[activeGroup] || 0;
    return [...(offers[activeGroup] || [])]
      .filter(o => !selected.has(offerKey(o)))
      .filter(o => !o.maxGuests || o.maxGuests >= guests)
      .sort((a, b) => a.directTotal - b.directTotal || rank(a) - rank(b));
  }, [offers, activeGroup, groups, selected]);

  const add = (role: ChatItem["role"], content: string, kind: MessageKind = "normal") =>
    setMessages(v => [...v, { id: rid(), role, content, kind }]);

  async function beginUserTurn(content: string, kind: MessageKind = "normal", reaction: Reaction = "👍", pace: TurnPace = "normal") {
    if (turnLocked.current) return false;
    turnLocked.current = true;
    const timing = TURN_TIMING[pace];
    const id = rid();
    setMessages(v => [...v, { id, role: "user", content, kind }]);
    await wait(timing.reaction);
    setMessages(v => v.map(m => (m.id === id ? { ...m, reaction } : m)));
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
    setOffers([]);
    setActiveGroup(0);
    setChoices([]);
    setFeedback("idle");
    setBreakfast(false);
    setTyping(false);
    setSelectingOfferKey(null);
  }

  async function interpret(value: string, current: FinderStep): Promise<RoomFinderCommand> {
    const recentMessages = messages.slice(-8).map(({ role, content }) => ({ role, content }));
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch("/api/ai-assistant/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
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
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.command) throw new Error(String(data?.code || "AI_UNAVAILABLE"));
      return data.command as RoomFinderCommand;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function runAvailabilitySearch(searchDraft: BookingDraft) {
    dispatchFlow({ type: "set_step", step: "searching" });
    setFeedback("idle");
    add("assistant", tone.searching);
    setTyping(true);

    try {
      const result = await Promise.all(searchDraft.groups.map(async guests => {
        const q = new URLSearchParams({
          checkin: searchDraft.checkin,
          checkout: searchDraft.checkout,
          guests: String(guests),
          lang: language,
        });
        const response = await fetch(`/api/ai-room-finder/availability?${q}`, { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new AvailabilityError(String(payload?.code || "REQUEST_FAILED"));
        }
        return Array.isArray(payload.offers) ? payload.offers : [];
      }));

      setOffers(result);
      setActiveGroup(0);

      if (!(result[0] || []).length) {
        dispatchFlow({ type: "set_step", step: "unavailable" });
        add("assistant", tone.unavailable);
        return;
      }

      dispatchFlow({ type: "set_step", step: "selecting" });
      add("assistant", tone.results(1, searchDraft.groups[0]));
    } catch (error) {
      dispatchFlow({ type: "set_step", step: "unavailable" });
      const stale = error instanceof AvailabilityError && (error.code === "STALE_DATA" || error.code === "DATA_UNAVAILABLE");
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

    dispatchFlow({ type: "commit_turn", state: resolution.state });

    if (resolution.outcome.kind === "invalid_checkout") {
      add("assistant", tone.invalidCheckout);
      return;
    }

    if (resolution.outcome.kind === "clarification") {
      add("assistant", resolution.outcome.query);
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

  async function submit(e: FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value || turnLocked.current || !["checkin", "checkout", "rooms", "guests"].includes(step)) return;

    const current = step;
    setInput("");
    const promise = interpret(value, current);
    const kind: MessageKind = current === "checkin" || current === "checkout" ? "date" : current === "rooms" ? "room" : "guest";
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

  async function chooseRooms(n: number) {
    if (!await beginUserTurn(copy.roomLabel(n), "room", "❤️")) return;

    try {
      const nextFlow = bookingFlowReducer(flow, { type: "choose_rooms", roomCount: n });
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

  async function chooseGuests(n: number) {
    if (!await beginUserTurn(copy.guestLabel(n), "guest", "👍")) return;

    try {
      const nextFlow = bookingFlowReducer(flow, { type: "choose_guests", guests: n });
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
    const key = offerKey(offer);
    setSelectingOfferKey(key);
    try {
      if (!await beginUserTurn(`${copy.select}: ${offer.name}`, "room", "❤️", "quick")) return;
      const next = [...choices, { group: activeGroup + 1, guests: groups[activeGroup], offer }];
      setChoices(next);
      add("assistant", tone.selected(offer.name));
      if (roomCount && activeGroup + 1 < roomCount) {
        const group = activeGroup + 1;
        setActiveGroup(group);
        setFeedback("idle");
        add("assistant", tone.results(group + 1, groups[group]));
      } else {
        dispatchFlow({ type: "set_step", step: "breakfast" });
        setFeedback("idle");
      }
    } finally {
      setSelectingOfferKey(null);
      endUserTurn();
    }
  }

  function backToRooms() {
    if (turnLocked.current || choices.length === 0) return;
    const lastChoice = choices[choices.length - 1];
    setChoices(current => current.slice(0, -1));
    setActiveGroup(Math.max(0, lastChoice.group - 1));
    setBreakfast(false);
    setFeedback("idle");
    dispatchFlow({ type: "set_step", step: "selecting" });
  }

  async function chooseBreakfast(value: boolean) {
    if (!await beginUserTurn(value ? copy.yesBreakfast : copy.noBreakfast, "normal", value ? "❤️" : "👍")) return;
    setBreakfast(value);
    dispatchFlow({ type: "set_step", step: "complete" });
    add("assistant", tone.finalizing);
    endUserTurn();
  }

  async function happy() {
    if (!await beginUserTurn(copy.feedbackYes, "normal", "❤️")) return;
    setFeedback("happy");
    add("assistant", tone.feedbackYesReply);
    endUserTurn();
  }

  async function different() {
    if (!await beginUserTurn(copy.feedbackDifferent, "normal", "👍")) return;
    setFeedback("different");
    add("assistant", tone.changePrompt);
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
    feedback,
    breakfast,
    typing,
    selectingOfferKey,
    guestTotal,
    nights,
    visibleOffers,
    beginUserTurn,
    endUserTurn,
    reset,
    submit,
    chooseRooms,
    chooseGuests,
    selectOffer,
    backToRooms,
    chooseBreakfast,
    happy,
    different,
  };
}
