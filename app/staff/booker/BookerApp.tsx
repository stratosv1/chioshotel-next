"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { RoomFinderCalmMotion } from "@/components/ai/RoomFinderCalmMotion";
import { RoomCarousel, type RoomOffer } from "@/components/ai/room-finder-carousel";
import { ROOM_FINDER_COPY } from "@/components/ai/room-finder-copy";
import { TypingIndicator } from "@/components/ai/room-finder-typing-indicator";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type Draft = {
  checkin: string;
  checkout: string;
  nights: number | null;
  totalGuests: number | null;
  adults: number | null;
  children: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  totalPrice: number | null;
  comments: string;
  notes: string;
};

type IntakeFields = {
  checkin: string | null;
  checkout: string | null;
  nights: number | null;
  totalGuests: number | null;
  adults: number | null;
  children: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  language: string | null;
  totalPrice: number | null;
  comments: string | null;
  notes: string | null;
};

type IntakeResult = {
  fields: IntakeFields;
  clearFields: Array<"email" | "phone" | "comments" | "notes">;
  sourceSummary: string;
  clarification: string | null;
  message?: string;
};

type BookingResult = {
  message?: string;
  bookingId?: string | number;
  roomLabel?: string;
  categoryLabel?: string;
  whatsappUrl?: string;
};

type Capability = {
  apiReady: boolean;
  propertyReady: boolean;
};

type AwaitingField = "checkin" | "checkout" | "adults" | "children" | "firstName" | "lastName" | "email" | "phone" | "language" | "price" | null;
type Mode = "collecting" | "rooms" | "review" | "done";

const copy = ROOM_FINDER_COPY.el;
const EMPTY_DRAFT: Draft = {
  checkin: "",
  checkout: "",
  nights: null,
  totalGuests: null,
  adults: null,
  children: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  language: "",
  totalPrice: null,
  comments: "",
  notes: "",
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function assistant(text: string): ChatMessage {
  return { id: makeId(), role: "assistant", text };
}

function user(text: string): ChatMessage {
  return { id: makeId(), role: "user", text };
}

function initialMessages(): ChatMessage[] {
  return [
    assistant("Staff Booking Assistant. Γράψε μου τα στοιχεία όπως σε βολεύει: μία απάντηση τη φορά, ολόκληρο copy-paste από email/μήνυμα ή ανέβασε screenshot. Το OpenAI θα εξάγει όσα στοιχεία βρίσκει και θα σε ρωτάω μόνο όσα λείπουν."),
    assistant("Δεν δημιουργείται καμία κράτηση αυτόματα. Πρώτα θα δεις διαθέσιμα δωμάτια, θα επιλέξεις εσύ και στο τέλος θα πατήσεις «Καταχώρηση στο Beds24». Πες μου τι κράτηση θέλεις να περάσουμε."),
  ];
}

function money(value: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function prettyDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function nightsBetween(checkin: string, checkout: string) {
  const start = new Date(`${checkin}T00:00:00Z`).getTime();
  const end = new Date(`${checkout}T00:00:00Z`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.round((end - start) / 86400000);
}

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day || !Number.isFinite(days)) return "";
  const value = new Date(Date.UTC(year, month - 1, day + days));
  return value.toISOString().slice(0, 10);
}

function normalizeDraft(value: Draft): Draft {
  const next = { ...value };

  if (next.checkin && next.checkout) {
    const calculatedNights = nightsBetween(next.checkin, next.checkout);
    if (calculatedNights > 0) next.nights = calculatedNights;
  } else if (next.checkin && next.nights && next.nights > 0) {
    next.checkout = addDays(next.checkin, next.nights);
  }

  if (next.adults !== null && next.children !== null) {
    next.totalGuests = next.adults + next.children;
  } else if (next.totalGuests !== null && next.adults !== null && next.children === null) {
    const children = next.totalGuests - next.adults;
    if (children >= 0) next.children = children;
  } else if (next.totalGuests !== null && next.children !== null && next.adults === null) {
    const adults = next.totalGuests - next.children;
    if (adults >= 1) next.adults = adults;
  }

  return next;
}

function mergeIntake(current: Draft, result: IntakeResult) {
  const next = { ...current };
  const fields = result.fields || ({} as IntakeFields);
  const assignString = (key: keyof Pick<Draft, "checkin" | "checkout" | "firstName" | "lastName" | "email" | "phone" | "language" | "comments" | "notes">, value: string | null) => {
    if (value !== null && typeof value !== "undefined") next[key] = String(value).trim();
  };
  const assignNumber = (key: keyof Pick<Draft, "nights" | "totalGuests" | "adults" | "children" | "totalPrice">, value: number | null) => {
    if (value !== null && typeof value !== "undefined" && Number.isFinite(Number(value))) next[key] = Number(value);
  };

  assignString("checkin", fields.checkin);
  assignString("checkout", fields.checkout);
  assignNumber("nights", fields.nights);
  assignNumber("totalGuests", fields.totalGuests);
  assignNumber("adults", fields.adults);
  assignNumber("children", fields.children);
  assignString("firstName", fields.firstName);
  assignString("lastName", fields.lastName);
  assignString("email", fields.email);
  assignString("phone", fields.phone);
  assignString("language", fields.language);
  assignNumber("totalPrice", fields.totalPrice);
  assignString("comments", fields.comments);
  assignString("notes", fields.notes);

  for (const field of result.clearFields || []) {
    if (field === "email" || field === "phone" || field === "comments" || field === "notes") next[field] = "";
  }

  return normalizeDraft(next);
}

function coreChanged(before: Draft, after: Draft) {
  return before.checkin !== after.checkin
    || before.checkout !== after.checkout
    || before.adults !== after.adults
    || before.children !== after.children;
}

function nextMissing(draft: Draft, hasRoom: boolean, emailSkipped: boolean, phoneSkipped: boolean): AwaitingField {
  if (!draft.checkin) return "checkin";
  if (!draft.checkout) return "checkout";
  if (draft.adults === null) return "adults";
  if (draft.children === null) return "children";
  if (!hasRoom) return null;
  if (!draft.firstName) return "firstName";
  if (!draft.lastName) return "lastName";
  if (!draft.email && !emailSkipped) return "email";
  if (!draft.phone && !phoneSkipped) return "phone";
  if (!draft.language) return "language";
  if (draft.totalPrice === null) return "price";
  return null;
}

function questionFor(field: AwaitingField) {
  const questions: Record<Exclude<AwaitingField, null>, string> = {
    checkin: "Ποια είναι η ημερομηνία check-in;",
    checkout: "Ποια είναι η ημερομηνία check-out;",
    adults: "Πόσοι ενήλικες είναι στην κράτηση;",
    children: "Πόσα παιδιά είναι στην κράτηση; Αν δεν υπάρχουν, γράψε 0.",
    firstName: "Ποιο είναι το όνομα του πελάτη;",
    lastName: "Ποιο είναι το επώνυμο του πελάτη;",
    email: "Ποιο είναι το email του πελάτη; Αν δεν υπάρχει, πάτησε Παράλειψη.",
    phone: "Ποιο είναι το τηλέφωνο/κινητό του πελάτη; Αν δεν υπάρχει, πάτησε Παράλειψη.",
    language: "Σε ποια γλώσσα είναι ο πελάτης; Μπορείς να γράψεις π.χ. English, Ελληνικά ή Türkçe.",
    price: "Ποια συνολική τιμή θέλεις να καταχωρηθεί στο Beds24;",
  };
  return field ? questions[field] : "";
}

function displayUserText(value: string) {
  const trimmed = value.trim();
  if (trimmed.length <= 1800) return trimmed;
  return `${trimmed.slice(0, 1800)}\n… [το υπόλοιπο κείμενο αναλύθηκε κανονικά]`;
}

function StaffMessage({ message }: { message: ChatMessage }) {
  return (
    <div className={`msg flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role === "assistant" && (
        <div className="relative mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-[#d7cdc0]">
          <Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="" fill sizes="32px" className="object-cover" />
        </div>
      )}
      <div className="max-w-[84%]">
        <div className={`whitespace-pre-line px-4 py-3 text-[15px] leading-6 shadow-sm ${message.role === "user"
          ? "rounded-[20px] rounded-br-[6px] bg-[#6b604f] text-white"
          : "rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white"
        }`}>
          {message.text}
        </div>
      </div>
    </div>
  );
}

export default function BookerApp() {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [mode, setMode] = useState<Mode>("collecting");
  const [awaiting, setAwaiting] = useState<AwaitingField>(null);
  const [offers, setOffers] = useState<RoomOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<RoomOffer | null>(null);
  const [detail, setDetail] = useState<RoomOffer | null>(null);
  const [composer, setComposer] = useState("");
  const [interpreting, setInterpreting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [emailSkipped, setEmailSkipped] = useState(false);
  const [phoneSkipped, setPhoneSkipped] = useState(false);
  const [capability, setCapability] = useState<Capability | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);
  const shellRef = useRef<HTMLElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const nights = useMemo(() => draft.checkin && draft.checkout ? nightsBetween(draft.checkin, draft.checkout) : 0, [draft.checkin, draft.checkout]);
  const totalGuests = (draft.adults ?? 0) + (draft.children ?? 0);
  const bookingReady = Boolean(
    selectedOffer
      && draft.checkin
      && draft.checkout
      && draft.adults !== null
      && draft.children !== null
      && draft.firstName
      && draft.lastName
      && (draft.email || emailSkipped)
      && (draft.phone || phoneSkipped)
      && draft.language
      && draft.totalPrice !== null
      && capability?.apiReady
      && capability?.propertyReady,
  );

  function push(...items: ChatMessage[]) {
    setMessages((current) => [...current, ...items]);
  }

  useEffect(() => {
    void fetch("/api/staff/booker/create/", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) throw new Error("capability");
        return response.json() as Promise<Capability>;
      })
      .then(setCapability)
      .catch(() => setCapability({ apiReady: false, propertyReady: false }));
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const visualViewport = window.visualViewport;
    let frame: number | null = null;
    const sync = () => {
      frame = null;
      const viewport = window.visualViewport;
      const visibleHeight = Math.max(320, Math.round(viewport?.height ?? window.innerHeight));
      const offsetTop = Math.max(0, Math.round(viewport?.offsetTop ?? 0));
      const layoutHeight = Math.max(window.innerHeight, document.documentElement.clientHeight);
      shell.style.setProperty("--rf-visual-height", `${visibleHeight}px`);
      shell.style.setProperty("--rf-visual-offset-top", `${offsetTop}px`);
      shell.dataset.keyboardOpen = viewport && layoutHeight - viewport.height > 120 ? "true" : "false";
    };
    const schedule = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    sync();
    visualViewport?.addEventListener("resize", schedule);
    visualViewport?.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      visualViewport?.removeEventListener("resize", schedule);
      visualViewport?.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (mode === "rooms" && offers.length) {
      const frame = requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ block: "start", behavior: "smooth" }));
      return () => cancelAnimationFrame(frame);
    }
    const frame = requestAnimationFrame(() => feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" }));
    return () => cancelAnimationFrame(frame);
  }, [messages, mode, offers.length, interpreting, searching, saving]);

  function resetChat() {
    setDraft(EMPTY_DRAFT);
    setMessages(initialMessages());
    setMode("collecting");
    setAwaiting(null);
    setOffers([]);
    setSelectedOffer(null);
    setDetail(null);
    setComposer("");
    setEmailSkipped(false);
    setPhoneSkipped(false);
    setResult(null);
  }

  async function findRooms(nextDraft: Draft) {
    if (!nextDraft.checkin || !nextDraft.checkout || nextDraft.adults === null || nextDraft.children === null) return;
    const guests = nextDraft.adults + nextDraft.children;
    if (guests < 1 || guests > 5) {
      push(assistant("Η συγκεκριμένη καταχώρηση υποστηρίζει ένα δωμάτιο με έως 5 άτομα. Διόρθωσε τον αριθμό ενηλίκων/παιδιών μέσα στο chat."));
      setMode("collecting");
      return;
    }

    setSearching(true);
    setMode("collecting");
    setOffers([]);
    setSelectedOffer(null);
    push(assistant("Ελέγχω τώρα τη live διαθεσιμότητα και τις τιμές στο Booking Core…"));

    const query = new URLSearchParams({
      checkin: nextDraft.checkin,
      checkout: nextDraft.checkout,
      guests: String(guests),
      lang: "el",
      allowSplit: "0",
    });

    const response = await fetch(`/api/ai-room-finder/availability/?${query.toString()}`, {
      cache: "no-store",
      credentials: "same-origin",
    });
    const data = await response.json().catch(() => null);
    setSearching(false);

    if (!response.ok || !data?.success) {
      push(assistant(data?.message || "Δεν μπόρεσα να ελέγξω τη διαθεσιμότητα."));
      return;
    }

    const nextOffers = (data.offers || []) as RoomOffer[];
    if (!nextOffers.length) {
      push(assistant("Δεν βρήκα διαθέσιμο δωμάτιο για όλη τη διαμονή. Γράψε άλλες ημερομηνίες και θα ξαναελέγξω."));
      setOffers([]);
      setMode("collecting");
      return;
    }

    setOffers(nextOffers);
    setMode("rooms");
    setAwaiting(null);
    push(assistant(`Βρήκα ${nextOffers.length} διαθέσιμες επιλογές. Επίλεξε εσύ το δωμάτιο που θέλεις να καταχωρήσουμε.`));
  }

  async function advance(nextDraft: Draft, changedCore: boolean, nextEmailSkipped: boolean, nextPhoneSkipped: boolean) {
    if (nextDraft.checkin && nextDraft.checkout && nextDraft.checkout <= nextDraft.checkin) {
      setAwaiting("checkout");
      setMode("collecting");
      push(assistant("Το check-out πρέπει να είναι μετά το check-in. Ποια είναι η σωστή ημερομηνία check-out;"));
      return;
    }

    const missingCore = nextMissing(nextDraft, false, nextEmailSkipped, nextPhoneSkipped);
    if (missingCore && ["checkin", "checkout", "adults", "children"].includes(missingCore)) {
      setAwaiting(missingCore);
      setMode("collecting");
      push(assistant(questionFor(missingCore)));
      return;
    }

    if (changedCore) {
      setSelectedOffer(null);
      setOffers([]);
      await findRooms(nextDraft);
      return;
    }

    if (!selectedOffer) {
      if (offers.length) {
        setMode("rooms");
        push(assistant("Τα διαθέσιμα δωμάτια είναι παραπάνω. Επίλεξε ποιο θέλεις να κρατήσουμε."));
        return;
      }
      await findRooms(nextDraft);
      return;
    }

    const missing = nextMissing(nextDraft, true, nextEmailSkipped, nextPhoneSkipped);
    if (missing) {
      setAwaiting(missing);
      setMode("collecting");
      push(assistant(questionFor(missing)));
      return;
    }

    setAwaiting(null);
    setMode("review");
    push(assistant("Έχω όλα τα στοιχεία. Έλεγξε την τελική σύνοψη. Αν θέλεις αλλαγή, γράψ' την κανονικά στο chat. Αν είναι σωστά, πάτησε «Καταχώρηση στο Beds24»."));
  }

  async function submitIntake(message: string, image?: File) {
    if (interpreting || searching || saving) return;
    const text = message.trim();
    if (!text && !image) return;

    if (image) {
      push(user(`📎 Screenshot: ${image.name}`));
    } else {
      push(user(displayUserText(text)));
    }

    setComposer("");
    setInterpreting(true);
    const form = new FormData();
    form.set("message", text);
    form.set("context", JSON.stringify({
      ...draft,
      currentQuestion: awaiting,
      selectedRoomNumber: selectedOffer?.roomNumber ?? null,
      emailSkipped,
      phoneSkipped,
    }));
    if (image) form.set("image", image);

    const response = await fetch("/api/staff/booker/interpret/", {
      method: "POST",
      credentials: "same-origin",
      body: form,
    });
    const data = (await response.json().catch(() => null)) as IntakeResult | null;
    setInterpreting(false);

    if (!response.ok || !data?.fields) {
      push(assistant(data?.message || "Δεν μπόρεσα να αναλύσω αυτό το μήνυμα. Δοκίμασε ξανά."));
      return;
    }

    const nextDraft = mergeIntake(draft, data);
    const changed = coreChanged(draft, nextDraft);
    const nextEmailSkipped = data.clearFields?.includes("email") ? true : (nextDraft.email ? false : emailSkipped);
    const nextPhoneSkipped = data.clearFields?.includes("phone") ? true : (nextDraft.phone ? false : phoneSkipped);

    setDraft(nextDraft);
    setEmailSkipped(nextEmailSkipped);
    setPhoneSkipped(nextPhoneSkipped);
    setResult(null);

    if (data.sourceSummary?.trim()) push(assistant(`Κατάλαβα: ${data.sourceSummary.trim()}`));
    if (data.clarification) {
      push(assistant(data.clarification));
      return;
    }

    await advance(nextDraft, changed, nextEmailSkipped, nextPhoneSkipped);
  }

  function chooseOffer(offer: RoomOffer) {
    setSelectedOffer(offer);
    setOffers([]);
    const nextDraft = draft.totalPrice === null ? { ...draft, totalPrice: offer.directTotal } : draft;
    setDraft(nextDraft);
    push(user(`${offer.name} · ${money(offer.directTotal)}`));

    const missing = nextMissing(nextDraft, true, emailSkipped, phoneSkipped);
    if (missing) {
      setAwaiting(missing);
      setMode("collecting");
      push(assistant(questionFor(missing)));
    } else {
      setAwaiting(null);
      setMode("review");
      push(assistant("Η κράτηση είναι συμπληρωμένη. Έλεγξε τη σύνοψη και πάτησε «Καταχώρηση στο Beds24». Μπορείς ακόμη να γράψεις οποιαδήποτε διόρθωση στο chat."));
    }
  }

  function skipOptional(field: "email" | "phone") {
    if (field === "email") {
      setEmailSkipped(true);
      push(user("Παράλειψη email"));
      const missing = nextMissing(draft, Boolean(selectedOffer), true, phoneSkipped);
      if (missing) {
        setAwaiting(missing);
        push(assistant(questionFor(missing)));
      } else {
        setAwaiting(null);
        setMode("review");
        push(assistant("Έχω όλα τα στοιχεία. Έλεγξε τη σύνοψη πριν την καταχώρηση."));
      }
      return;
    }

    setPhoneSkipped(true);
    push(user("Παράλειψη τηλεφώνου"));
    const missing = nextMissing(draft, Boolean(selectedOffer), emailSkipped, true);
    if (missing) {
      setAwaiting(missing);
      push(assistant(questionFor(missing)));
    } else {
      setAwaiting(null);
      setMode("review");
      push(assistant("Έχω όλα τα στοιχεία. Έλεγξε τη σύνοψη πριν την καταχώρηση."));
    }
  }

  function useSuggestedPrice() {
    if (!selectedOffer) return;
    const nextDraft = { ...draft, totalPrice: selectedOffer.directTotal };
    setDraft(nextDraft);
    push(user(money(selectedOffer.directTotal)));
    setAwaiting(null);
    setMode("review");
    push(assistant("Χρησιμοποίησα την προτεινόμενη συνολική τιμή. Έλεγξε τη σύνοψη πριν την καταχώρηση."));
  }

  async function createBooking() {
    if (!bookingReady || !selectedOffer || saving) return;
    setSaving(true);
    push(assistant("Κάνω έναν τελευταίο server-side έλεγχο διαθεσιμότητας και καταχωρώ την κράτηση στο Beds24…"));

    const response = await fetch("/api/staff/booker/create/", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: Number(selectedOffer.roomId),
        unitId: Number(selectedOffer.unitId),
        arrival: draft.checkin,
        departure: draft.checkout,
        firstName: draft.firstName,
        lastName: draft.lastName,
        email: draft.email,
        phone: draft.phone,
        language: draft.language,
        adults: draft.adults,
        children: draft.children,
        price: draft.totalPrice,
        comments: draft.comments,
        notes: draft.notes,
      }),
    });
    const data = (await response.json().catch(() => null)) as BookingResult | null;
    setSaving(false);

    if (!response.ok || !data?.bookingId) {
      push(assistant(data?.message || "Η κράτηση δεν δημιουργήθηκε. Δεν έγινε καμία δεύτερη προσπάθεια αυτόματα."));
      return;
    }

    setResult(data);
    setMode("done");
    push(assistant(`✓ Η κράτηση δημιουργήθηκε στο Beds24. Booking ID: ${data.bookingId}.`));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitIntake(composer);
  }

  function handleImage(file?: File | null) {
    if (!file) return;
    void submitIntake("", file);
    if (fileRef.current) fileRef.current.value = "";
  }

  const summary = [
    draft.checkin && draft.checkout ? `${prettyDate(draft.checkin)} → ${prettyDate(draft.checkout)}` : "",
    draft.adults !== null && draft.children !== null ? `${draft.adults + draft.children} άτομα` : "",
    selectedOffer?.name || "",
  ].filter(Boolean).join(" · ");

  const busy = interpreting || searching || saving;
  const placeholder = mode === "review"
    ? "Γράψε οποιαδήποτε διόρθωση…"
    : awaiting
      ? questionFor(awaiting)
      : "Γράψε ή κάνε paste στοιχεία κράτησης…";

  return (
    <main
      ref={shellRef}
      data-room-finder-shell="true"
      data-keyboard-open="false"
      className="fixed inset-x-0 top-0 flex min-h-0 w-full flex-col overflow-hidden bg-[#f6f2eb] text-[#29251f]"
      style={{ height: "var(--rf-visual-height, 100dvh)", top: "var(--rf-visual-offset-top, 0px)" }}
    >
      <RoomFinderCalmMotion />
      <style jsx global>{`
        :root { --mandarin: #c66a34; }
        .typing-dot { display:block; width:6px; height:6px; border-radius:9999px; background:#746b60; }
        [data-room-finder-shell="true"] { overscroll-behavior:none; }
        .room-finder-composer { padding:.75rem; padding-bottom:max(.75rem, env(safe-area-inset-bottom)); }
        [data-room-finder-shell="true"][data-keyboard-open="true"] .room-finder-composer { padding-bottom:.75rem; }
        .hide-scroll { scrollbar-width:none; }
        .hide-scroll::-webkit-scrollbar { display:none; }
      `}</style>

      <header className="shrink-0 border-b border-[#ddd4c8] bg-[#fbf8f3]/95 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-[64px] max-w-3xl items-center gap-1.5 px-2.5">
          <Link href="/staff" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[26px] font-semibold text-[#625b52] hover:bg-white/70" aria-label="Staff Area">←</Link>
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
            <Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="Voulamandis House" fill sizes="40px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1 pl-1">
            <h1 className="truncate text-[15px] font-bold leading-tight">Staff Booking Assistant</h1>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#746b60]">
              <span className={`h-2 w-2 rounded-full ${capability?.apiReady && capability?.propertyReady ? "bg-[#718b52]" : "bg-amber-500"}`} />
              OpenAI · Booking Core · Beds24
            </div>
          </div>
          <button type="button" onClick={resetChat} disabled={busy} aria-label="Νέα κράτηση" className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-[#d8cec1] bg-white text-[30px] font-black leading-none text-[#5f574d] shadow-sm disabled:opacity-50">↻</button>
        </div>
      </header>

      {summary && (
        <div className="shrink-0 border-b border-[#e5ddd2] bg-[#f9f5ef] px-3 py-2">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex h-8 min-w-0 items-center rounded-full border border-dashed border-[#d8cec1] bg-white px-4 text-xs font-semibold text-[#625b52] shadow-[0_6px_16px_rgba(70,55,35,.06)]">
              <span className="truncate">{summary}</span>
            </div>
          </div>
        </div>
      )}

      <div ref={feedRef} role="log" aria-live="polite" aria-busy={busy} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col px-3 pb-7 pt-5">
          <div className="space-y-3.5">
            {messages.map((message) => <StaffMessage key={message.id} message={message} />)}
            {(interpreting || searching || saving) && <TypingIndicator />}

            {mode === "rooms" && offers.length > 0 && (
              <div ref={resultsRef} data-room-results-start="true" className="space-y-3.5 scroll-mt-2">
                <RoomCarousel
                  offers={offers}
                  copy={copy}
                  language="el"
                  money={(value) => money(value)}
                  onDetails={setDetail}
                  onSelect={chooseOffer}
                />
              </div>
            )}

            {awaiting === "email" && !busy && (
              <div className="hide-scroll msg ml-10 flex gap-2 overflow-x-auto pb-1">
                <button type="button" onClick={() => skipOptional("email")} className="min-h-11 shrink-0 rounded-full border border-[#ddd3c6] bg-white px-4 text-sm font-bold">Παράλειψη email</button>
              </div>
            )}

            {awaiting === "phone" && !busy && (
              <div className="hide-scroll msg ml-10 flex gap-2 overflow-x-auto pb-1">
                <button type="button" onClick={() => skipOptional("phone")} className="min-h-11 shrink-0 rounded-full border border-[#ddd3c6] bg-white px-4 text-sm font-bold">Παράλειψη τηλεφώνου</button>
              </div>
            )}

            {awaiting === "price" && selectedOffer && !busy && (
              <div className="hide-scroll msg ml-10 flex gap-2 overflow-x-auto pb-1">
                <button type="button" onClick={useSuggestedPrice} className="min-h-11 shrink-0 rounded-full border border-[#b9c6aa] bg-[#eef4e7] px-4 text-sm font-black text-[#4f6539]">Προτεινόμενη {money(selectedOffer.directTotal)}</button>
              </div>
            )}

            {mode === "review" && selectedOffer && (
              <section className="msg relative rounded-[26px] border border-[#dcd2c5] bg-white shadow-[0_16px_45px_rgba(70,55,35,.10)] sm:ml-10">
                <div className="rounded-t-[26px] bg-[#faf7f2] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[.18em] text-[#8a6f50]">Τελικός έλεγχος</p>
                  <h2 className="mt-1 text-lg font-black">Έτοιμη κράτηση για Beds24</h2>
                  <p className="mt-1 text-xs text-[#746b60]">Μπορείς να γράψεις οποιαδήποτε διόρθωση στο chat πριν πατήσεις καταχώρηση.</p>
                </div>
                <div className="grid gap-2 p-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#f8f5f0] p-3"><span className="text-xs text-[#8a7f72]">Διαμονή</span><strong className="mt-1 block text-sm">{prettyDate(draft.checkin)} → {prettyDate(draft.checkout)} · {nights} νύχτες</strong></div>
                  <div className="rounded-2xl bg-[#f8f5f0] p-3"><span className="text-xs text-[#8a7f72]">Επισκέπτες</span><strong className="mt-1 block text-sm">{draft.adults} ενήλικες · {draft.children} παιδιά</strong></div>
                  <div className="rounded-2xl bg-[#f8f5f0] p-3"><span className="text-xs text-[#8a7f72]">Δωμάτιο</span><strong className="mt-1 block text-sm">{selectedOffer.name}</strong></div>
                  <div className="rounded-2xl bg-[#f8f5f0] p-3"><span className="text-xs text-[#8a7f72]">Συνολική τιμή</span><strong className="mt-1 block text-lg text-[#5f7448]">{money(draft.totalPrice || 0)}</strong></div>
                  <div className="rounded-2xl bg-[#f8f5f0] p-3"><span className="text-xs text-[#8a7f72]">Πελάτης</span><strong className="mt-1 block text-sm">{draft.firstName} {draft.lastName}</strong><span className="mt-1 block text-xs text-[#746b60]">Γλώσσα: {draft.language.toUpperCase()}</span></div>
                  <div className="rounded-2xl bg-[#f8f5f0] p-3"><span className="text-xs text-[#8a7f72]">Επικοινωνία</span><strong className="mt-1 block break-all text-sm">{draft.email || "Χωρίς email"}</strong><span className="mt-1 block text-sm">{draft.phone || "Χωρίς τηλέφωνο"}</span></div>
                  {(draft.comments || draft.notes) && <div className="rounded-2xl bg-[#f8f5f0] p-3 sm:col-span-2"><span className="text-xs text-[#8a7f72]">Σημειώσεις</span>{draft.comments && <p className="mt-1 text-sm"><b>Guest:</b> {draft.comments}</p>}{draft.notes && <p className="mt-1 text-sm"><b>Staff:</b> {draft.notes}</p>}</div>}
                </div>
                <div className="border-t border-[#eee7dd] p-4">
                  <button type="button" onClick={() => void createBooking()} disabled={!bookingReady || saving} className="min-h-12 w-full rounded-2xl bg-[#66714f] px-5 font-black text-white shadow-sm disabled:cursor-not-allowed disabled:bg-[#b8b2a9]">
                    {saving ? "Καταχώρηση…" : "Καταχώρηση στο Beds24"}
                  </button>
                  {!capability?.apiReady || !capability?.propertyReady ? <p className="mt-2 text-center text-xs font-semibold text-amber-700">Η σύνδεση δημιουργίας κράτησης με Beds24 δεν είναι έτοιμη. Το κουμπί θα ενεργοποιηθεί μόνο όταν το backend επιβεβαιώσει token + property.</p> : null}
                </div>
              </section>
            )}

            {mode === "done" && result?.bookingId && (
              <section className="msg rounded-[24px] border border-[#b9c6aa] bg-[#eef4e7] p-4 sm:ml-10">
                <p className="text-lg font-black text-[#4f6539]">✓ Booking #{result.bookingId}</p>
                <p className="mt-1 text-sm text-[#56644a]">Η κράτηση δημιουργήθηκε επιτυχώς στο Beds24.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.whatsappUrl && <a href={result.whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#287d4f] px-4 py-2.5 text-sm font-bold text-white">WhatsApp πελάτη</a>}
                  <button type="button" onClick={resetChat} className="rounded-full border border-[#aebc9e] bg-white px-4 py-2.5 text-sm font-bold">Νέα κράτηση</button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="room-finder-composer shrink-0 border-t border-[#e2d9cd] bg-[#fbf8f3]/95">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-[24px] border border-[#d8cec1] bg-white p-2 shadow-sm">
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => handleImage(event.target.files?.[0])} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy || mode === "done"} aria-label="Ανέβασε screenshot" title="Ανέβασε screenshot" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ddd3c6] bg-[#faf7f2] text-xl font-bold disabled:opacity-40">＋</button>
          <label htmlFor="staff-booking-message" className="sr-only">{placeholder}</label>
          <textarea
            ref={composerRef}
            id="staff-booking-message"
            rows={1}
            value={composer}
            disabled={busy || mode === "done"}
            onChange={(event) => setComposer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (composer.trim() && !busy) event.currentTarget.form?.requestSubmit();
              }
            }}
            onPaste={(event) => {
              const image = Array.from(event.clipboardData.files).find((file) => file.type.startsWith("image/"));
              if (image) {
                event.preventDefault();
                handleImage(image);
              }
            }}
            placeholder={busy ? "Αναλύω…" : placeholder}
            className="max-h-28 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-[16px] leading-6 outline-none disabled:opacity-50"
          />
          <button type="submit" disabled={busy || mode === "done" || !composer.trim()} aria-label="Αποστολή" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6b604f] text-white disabled:bg-[#d7d0c6]">↑</button>
        </div>
        <p className="mx-auto mt-1.5 max-w-3xl px-2 text-center text-[10px] leading-4 text-[#8a8176]">Κείμενο και screenshots αναλύονται από OpenAI για εξαγωγή στοιχείων. Η πραγματική κράτηση δημιουργείται μόνο με το τελικό κουμπί.</p>
      </form>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/35 p-3 sm:items-center sm:justify-center" onClick={(event) => { if (event.target === event.currentTarget) setDetail(null); }}>
          <section role="dialog" aria-modal="true" className="flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[26px] bg-white sm:max-w-xl sm:rounded-[26px]">
            <div className="relative h-60 shrink-0">
              <Image src={detail.image} alt={detail.name} fill sizes="600px" className="object-cover" />
              <button type="button" onClick={() => setDetail(null)} className="absolute right-3 top-3 h-11 w-11 rounded-full bg-white/90 text-xl shadow-sm" aria-label="Κλείσιμο">×</button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <h2 className="text-2xl font-black">{detail.name}</h2>
              <p className="mt-1 text-sm text-[#746b60]">{detail.category} · {detail.floor}</p>
              <div className="mt-3 flex flex-wrap gap-2">{(detail.features || []).map((feature) => <span key={feature} className="rounded-full bg-[#f1ede7] px-3 py-1.5 text-xs font-semibold">{feature}</span>)}</div>
            </div>
            <div className="shrink-0 border-t border-[#e5ddd2] bg-white p-4">
              <button type="button" onClick={() => { const offer = detail; setDetail(null); chooseOffer(offer); }} className="min-h-12 w-full rounded-2xl bg-[#66714f] p-3.5 font-black text-white">Επιλογή</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
