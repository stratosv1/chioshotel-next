"use client";

import { FormEvent, useMemo, useReducer, useRef, useState } from "react";
import { localizeRoomOffer } from "@/lib/ai-assistant/room-card-catalog";
import type { RoomFinderCommand, RoomFinderPreference } from "@/lib/ai-assistant/room-finder-types";
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
import { rewindToAssistantPrompt } from "./room-finder-conversation-history";
import { answerRoomQuestion, roomPreferenceScore } from "./room-finder-sales-intelligence";
import { fetchLongStayDiscount, longStayDiscountMessage } from "./room-finder-long-stay";
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
  el: "Η live διαθεσιμότητα δεν μπορεί να επιβεβαιωθεί αυτή τη στιγμή. Τα στοιχεία που μου δώσατε παραμένουν αποθηκευμένα στη ροή. Δοκιμάστε ξανά ή επικοινωνήστε μαζί μας μέσω WhatsApp.",
  en: "Live availability cannot be confirmed right now. The details you already entered are still kept in this flow. Please try again or contact us on WhatsApp.",
  de: "Die Live-Verfügbarkeit kann momentan nicht bestätigt werden. Ihre bereits eingegebenen Angaben bleiben in dieser Suche erhalten. Versuchen Sie es erneut oder kontaktieren Sie uns über WhatsApp.",
  fr: "La disponibilité en direct ne peut pas être confirmée pour le moment. Les informations déjà saisies restent conservées dans cette recherche. Réessayez ou contactez-nous via WhatsApp.",
  it: "Al momento non posso confermare la disponibilità in tempo reale. I dati già inseriti restano conservati in questa ricerca. Riprovate oppure contattateci su WhatsApp.",
  es: "Ahora mismo no puedo confirmar la disponibilidad en tiempo real. Los datos que ya introdujeron se mantienen en esta búsqueda. Inténtenlo de nuevo o contáctennos por WhatsApp.",
  tr: "Canlı müsaitlik şu anda doğrulanamıyor. Daha önce girdiğiniz bilgiler bu aramada korunuyor. Tekrar deneyin veya WhatsApp üzerinden bize ulaşın.",
};

const INTERPRETER_UNAVAILABLE: Record<RoomFinderLanguage, string> = {
  el: "Δεν μπόρεσα να ερμηνεύσω αυτή την απάντηση αυτή τη στιγμή. Δεν έχασα τα προηγούμενα στοιχεία σας· μπορείτε να δοκιμάσετε ξανά ή να γράψετε την πληροφορία πιο απλά.",
  en: "I could not interpret that answer right now. Your previous details have not been lost; please try again or write the information more simply.",
  de: "Ich konnte diese Antwort gerade nicht auswerten. Ihre bisherigen Angaben sind nicht verloren; versuchen Sie es erneut oder formulieren Sie die Information einfacher.",
  fr: "Je n’ai pas pu interpréter cette réponse pour le moment. Vos informations précédentes ne sont pas perdues ; réessayez ou formulez l’information plus simplement.",
  it: "Non sono riuscito a interpretare questa risposta in questo momento. I dati precedenti non sono andati persi; riprovate o scrivete l’informazione in modo più semplice.",
  es: "No he podido interpretar esa respuesta en este momento. Sus datos anteriores no se han perdido; inténtenlo de nuevo o escriban la información de forma sencilla.",
  tr: "Bu yanıtı şu anda yorumlayamadım. Önceki bilgileriniz kaybolmadı; tekrar deneyin veya bilgiyi daha basit yazın.",
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

const PREFERENCE_APPLIED: Record<RoomFinderLanguage, string> = {
  el: "Το σημείωσα. Θα βάλω πρώτα τις διαθέσιμες επιλογές που ταιριάζουν περισσότερο σε αυτό που ζητάτε, χωρίς να κρύψω τις υπόλοιπες.",
  en: "Noted. I’ll place the available options that best match your preference first, without hiding the other rooms.",
  de: "Vermerkt. Ich zeige zuerst die verfügbaren Optionen, die am besten zu Ihrem Wunsch passen, ohne andere Zimmer auszublenden.",
  fr: "C’est noté. Je placerai d’abord les options disponibles qui correspondent le mieux à votre préférence, sans masquer les autres chambres.",
  it: "Annotato. Mostrerò prima le opzioni disponibili più adatte alla vostra preferenza, senza nascondere le altre camere.",
  es: "Anotado. Mostraré primero las opciones disponibles que mejor encajan con su preferencia, sin ocultar las demás habitaciones.",
  tr: "Not ettim. Diğer odaları gizlemeden, tercihinize en çok uyan müsait seçenekleri önce göstereceğim.",
};

const NEARBY_ALTERNATIVES: Record<RoomFinderLanguage, string> = {
  el: "Για τις ακριβείς ημερομηνίες δεν βρήκα διαθέσιμο δωμάτιο, αλλά βρήκα live διαθεσιμότητα πολύ κοντά στις ημερομηνίες σας. Οι κάρτες παρακάτω γράφουν καθαρά τη νέα περίοδο και οι ημερομηνίες αλλάζουν μόνο αν επιλέξετε μία από αυτές.",
  en: "I could not find a room for the exact dates, but I found live availability very close to them. Each card clearly shows the alternative period, and your dates change only if you select one.",
  de: "Für die exakten Daten habe ich kein Zimmer gefunden, aber sehr nahe daran gibt es Live-Verfügbarkeit. Jede Karte zeigt den alternativen Zeitraum deutlich; Ihre Daten ändern sich erst, wenn Sie eine Option auswählen.",
  fr: "Je n’ai pas trouvé de chambre pour les dates exactes, mais j’ai trouvé des disponibilités en direct très proches. Chaque carte indique clairement la période alternative et vos dates ne changent que si vous choisissez une option.",
  it: "Non ho trovato una camera per le date esatte, ma c’è disponibilità live molto vicina. Ogni scheda mostra chiaramente il periodo alternativo e le date cambiano solo se scegliete un’opzione.",
  es: "No encontré habitación para las fechas exactas, pero sí disponibilidad en vivo muy cerca de ellas. Cada tarjeta muestra claramente el periodo alternativo y sus fechas solo cambian si eligen una opción.",
  tr: "Tam tarihleriniz için oda bulamadım, ancak çok yakın tarihlerde canlı müsaitlik buldum. Her kart alternatif dönemi açıkça gösterir ve tarihleriniz yalnızca bir seçeneği seçerseniz değişir.",
};

const SALES_RECOVERY: Record<RoomFinderLanguage, string> = {
  el: "Δεν βρήκα ακριβώς την κατανομή δωματίων που ζητήσατε για όλη τη διαμονή. Πριν σας στείλω στη reception, έλεγξα ξανά τη live διαθεσιμότητα και βρήκα τις παρακάτω λύσεις για τις ίδιες ημερομηνίες, με όσο το δυνατόν λιγότερες αλλαγές.",
  en: "I could not match the exact room allocation for the whole stay. Before sending you to reception, I checked live availability again and found these options for the same dates, with as little room changing as possible.",
  de: "Die gewünschte Zimmeraufteilung ist nicht für den gesamten Aufenthalt verfügbar. Bevor ich Sie an die Rezeption verweise, habe ich die Live-Verfügbarkeit erneut geprüft und diese Lösungen für dieselben Daten mit möglichst wenigen Zimmerwechseln gefunden.",
  fr: "La répartition exacte des chambres n’est pas disponible pour tout le séjour. Avant de vous orienter vers la réception, j’ai revérifié les disponibilités en direct et trouvé ces solutions aux mêmes dates, avec le moins de changements possible.",
  it: "La distribuzione esatta delle camere non è disponibile per tutto il soggiorno. Prima di indirizzarvi alla reception, ho ricontrollato la disponibilità live e trovato queste soluzioni per le stesse date, con il minor numero possibile di cambi.",
  es: "La distribución exacta de habitaciones no está disponible durante toda la estancia. Antes de enviarles a recepción, he vuelto a comprobar la disponibilidad en vivo y encontré estas soluciones para las mismas fechas, con el menor número posible de cambios.",
  tr: "İstediğiniz oda dağılımı tüm konaklama boyunca müsait değil. Sizi resepsiyona yönlendirmeden önce canlı müsaitliği tekrar kontrol ettim ve aynı tarihler için mümkün olan en az oda değişikliğiyle bu çözümleri buldum.",
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
  const [preferences, setPreferences] = useState<RoomFinderPreference[]>([]);
  const [breakfast, setBreakfast] = useState(false);
  const [typing, setTyping] = useState(false);
  const [selectingOfferKey, setSelectingOfferKey] = useState<string | null>(null);
  const turnLocked = useRef(false);
  const languageRef = useRef(language);
  const announcedLongStayKey = useRef<string | null>(null);

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
  const visibleOffers = useMemo(() => {
    const feasible = feasibleOffersForGroup(capacityEligibleOffers, activeGroup, selectedKeys);
    const sorted = [...feasible].sort((left, right) => {
      const preferenceDifference = roomPreferenceScore(Number(right.roomNumber), preferences)
        - roomPreferenceScore(Number(left.roomNumber), preferences);
      return preferenceDifference || left.directTotal - right.directTotal || rank(left) - rank(right);
    });
    const bestScore = sorted.length ? roomPreferenceScore(Number(sorted[0].roomNumber), preferences) : 0;
    return sorted.map((offer, index) => ({
      ...offer,
      recommended: preferences.length > 0 && bestScore > 0 && index === 0,
    }));
  }, [capacityEligibleOffers, activeGroup, selectedKeys, preferences]);

  const add = (role: ChatItem["role"], content: string, kind: MessageKind = "normal") =>
    setMessages(current => [...current, { id: rid(), role, content, kind }]);

  const rewindConversation = (...promptContents: string[]) =>
    setMessages(current => rewindToAssistantPrompt(current, promptContents));

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
    setTyping(true);
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
    setTyping(false);
  };

  async function maybeAnnounceLongStay(nextDraft: BookingDraft) {
    if (!nextDraft.checkin || !nextDraft.checkout) return false;

    const key = `${nextDraft.checkin}:${nextDraft.checkout}`;
    if (announcedLongStayKey.current === key) return false;

    try {
      const info = await fetchLongStayDiscount(nextDraft.checkin, nextDraft.checkout);
      if (!info) return false;

      announcedLongStayKey.current = key;
      if (!info.eligible) return false;

      add("assistant", longStayDiscountMessage(language, info));
      return true;
    } catch (error) {
      console.error("Room Finder long-stay notice failed", error);
      return false;
    }
  }

  function reset() {
    if (languageRef.current !== language) {
      languageRef.current = language;
      setOffers(current => current.map(group => group.map(offer => localizeRoomOffer(offer, language)) as RoomOffer[]));
      setChoices(current => current.map(choice => ({
        ...choice,
        offer: localizeRoomOffer(choice.offer, language) as RoomOffer,
      })));
      setTyping(false);
      return;
    }

    turnLocked.current = false;
    announcedLongStayKey.current = null;
    dispatchFlow({ type: "reset" });
    setMessages([{ id: rid(), role: "assistant", content: copy.welcome }]);
    setInput("");
    setPreferences([]);
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
      rewindConversation(
        String((lastChoice.offer as any).recoveryType || "")
          ? SALES_RECOVERY[language]
          : tone.results(lastChoice.group, lastChoice.guests),
      );
      return;
    }

    if (previousStep === "complete") {
      const lastChoice = choices[choices.length - 1];
      setBreakfast(false);
      setSelectingOfferKey(null);
      dispatchFlow({ type: "commit_turn", state: nextFlow });
      if (lastChoice) rewindConversation(tone.selected(lastChoice.offer.name));
      return;
    }

    clearSearchSelectionState();
    if (!nextFlow.draft.checkout) announcedLongStayKey.current = null;
    dispatchFlow({ type: "commit_turn", state: nextFlow });

    switch (nextFlow.step) {
      case "checkin":
        rewindConversation(tone.invalidDate, copy.welcome);
        return;
      case "checkout":
        rewindConversation(tone.checkout);
        return;
      case "rooms":
        rewindConversation(tone.rooms);
        return;
      case "guests":
        rewindConversation(tone.guests(nextMissingGuestRoom(nextFlow.draft) || 1));
        return;
      default:
        return;
    }
  }

  function editDates() {
    if (turnLocked.current || step === "searching") return;
    const nextFlow = bookingFlowReducer(flow, { type: "edit_dates" });
    clearSearchSelectionState();
    announcedLongStayKey.current = null;
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
        preferences,
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

  async function findNearbyOffers(searchDraft: BookingDraft) {
    if (searchDraft.roomCount !== 1 || searchDraft.groups.length !== 1) return [] as RoomOffer[];

    const query = new URLSearchParams({
      checkin: searchDraft.checkin,
      checkout: searchDraft.checkout,
      guests: String(searchDraft.groups[0]),
      lang: language,
    });

    try {
      const response = await fetch(`/api/ai-room-finder/alternatives?${query}`, { cache: "no-store" });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload.alternatives)) return [];

      return payload.alternatives.flatMap((alternative: any) =>
        (Array.isArray(alternative?.offers) ? alternative.offers : []).map((offer: RoomOffer) => ({
          ...offer,
          alternativeCheckin: String(alternative.checkin || ""),
          alternativeCheckout: String(alternative.checkout || ""),
          alternativeShiftDays: Number(alternative.shiftDays || 0),
        })),
      ) as RoomOffer[];
    } catch {
      return [];
    }
  }

  async function findSalesRecoveryOffers(searchDraft: BookingDraft) {
    if (!searchDraft.roomCount || searchDraft.roomCount <= 1 || searchDraft.groups.length <= 1) {
      return [] as RoomOffer[];
    }

    const query = new URLSearchParams({
      checkin: searchDraft.checkin,
      checkout: searchDraft.checkout,
      groups: searchDraft.groups.join(","),
      lang: language,
    });

    try {
      const response = await fetch(`/api/ai-room-finder/sales-recovery?${query}`, { cache: "no-store" });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload.offers)) return [];
      return payload.offers as RoomOffer[];
    } catch (error) {
      console.error("Room Finder sales recovery request failed", error);
      return [];
    }
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
        const recovery = await findSalesRecoveryOffers(searchDraft);
        if (recovery.length) {
          setOffers([recovery]);
          setActiveGroup(0);
          dispatchFlow({ type: "set_step", step: "selecting" });
          add("assistant", SALES_RECOVERY[language]);
          return;
        }

        const nearby = await findNearbyOffers(searchDraft);
        if (nearby.length) {
          setOffers([nearby]);
          setActiveGroup(0);
          dispatchFlow({ type: "set_step", step: "selecting" });
          add("assistant", NEARBY_ALTERNATIVES[language]);
          return;
        }

        setOffers([]);
        setActiveGroup(0);
        dispatchFlow({ type: "set_step", step: "unavailable" });
        add("assistant", tone.unavailable, "contact");
        return;
      }

      setOffers(eligible);
      setActiveGroup(0);
      dispatchFlow({ type: "set_step", step: "selecting" });
      add("assistant", tone.results(1, searchDraft.groups[0]));
    } catch (error) {
      console.error("Room Finder availability request failed", error);
      setOffers([]);
      setActiveGroup(0);
      dispatchFlow({ type: "set_step", step: "unavailable" });
      add("assistant", INVENTORY_UNAVAILABLE[language], "contact");
    } finally {
      setTyping(false);
    }
  }

  async function applyCommand(command: RoomFinderCommand) {
    const preferenceAction = [...command.actions]
      .reverse()
      .find(action => action.type === "set_preferences");
    if (preferenceAction) setPreferences(preferenceAction.preferences || []);

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
      add("assistant", preferenceAction ? PREFERENCE_APPLIED[language] : NO_BOOKING_CHANGE[language]);
      return;
    }

    const shouldCheckLongStay = resolution.outcome.kind === "ready"
      || (resolution.outcome.kind === "prompt" && ["rooms", "guests"].includes(resolution.outcome.field));
    if (shouldCheckLongStay) {
      const announced = await maybeAnnounceLongStay(resolution.state.draft);
      if (announced) await wait(220);
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

    const questionAnswer = ["selecting", "breakfast", "complete"].includes(current)
      ? answerRoomQuestion(value, language, [
          ...offers.flat(),
          ...choices.map(choice => choice.offer),
        ])
      : null;

    if (questionAnswer) {
      if (!await beginUserTurn(value, "normal", "👍")) return;
      add("assistant", questionAnswer);
      endUserTurn();
      return;
    }

    const promise = interpret(value, current);
    const kind: MessageKind = current === "checkin" || current === "checkout"
      ? "date"
      : current === "rooms"
        ? "room"
        : current === "guests"
          ? "guest"
          : "normal";

    if (!await beginUserTurn(value, kind, current === "rooms" ? "❤️" : "👍")) return;

    try {
      const command = await promise;
      await applyCommand(command);
    } catch (error) {
      console.error("Room Finder interpreter request failed", error);
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

      const announced = await maybeAnnounceLongStay(nextFlow.draft);
      if (announced) await wait(220);

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

      const announced = await maybeAnnounceLongStay(nextFlow.draft);
      if (announced) await wait(220);

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

      if (offer.alternativeCheckin && offer.alternativeCheckout) {
        dispatchFlow({
          type: "commit_turn",
          state: {
            step: "selecting",
            draft: {
              ...draft,
              checkin: offer.alternativeCheckin,
              checkout: offer.alternativeCheckout,
            },
          },
        });
      }

      const recoveryType = String((offer as any).recoveryType || "");
      if (recoveryType) {
        const recoveryGuests = guestTotal || groups.reduce((sum, value) => sum + value, 0);
        setChoices([{ group: 1, guests: recoveryGuests, offer }]);
        add("assistant", tone.selected(offer.name));

        if (recoveryType === "consolidated") {
          dispatchFlow({
            type: "commit_turn",
            state: {
              step: "breakfast",
              draft: {
                ...draft,
                roomCount: 1,
                totalGuests: recoveryGuests,
                groups: [recoveryGuests],
              },
            },
          });
        } else {
          dispatchFlow({ type: "set_step", step: "breakfast" });
        }
        return;
      }

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
    preferences,
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
