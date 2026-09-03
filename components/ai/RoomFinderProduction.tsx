"use client";

import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  ROOM_FINDER_COPY,
  ROOM_FINDER_LANGUAGES,
  type RoomFinderLanguage,
} from "./room-finder-copy";
import { ChatMessage, IconReplies } from "./room-finder-chat-ui";
import { RoomCarousel, type RoomOffer } from "./room-finder-carousel";
import { stayRange } from "./room-finder-format";
import { SelectedRoomCard } from "./room-finder-selected-card";
import { TypingIndicator } from "./room-finder-typing-indicator";
import { useRoomFinder } from "./use-room-finder";

const WHATSAPP_NUMBER = "306944474226";
const CALL_NUMBER = "+306944764654";
const BREAKFAST_IMAGE = "/images/welcome/voulamandis-breakfast.jpg";
const CORE_INPUT_STEPS = new Set(["checkin", "checkout", "rooms", "guests"]);

const CALL_LABEL: Record<RoomFinderLanguage, string> = {
  el: "Κλήση",
  en: "Call",
  de: "Anrufen",
  fr: "Appeler",
  it: "Chiama",
  es: "Llamar",
  tr: "Ara",
};

type ContactPrivacyCopy = {
  firstName: string;
  lastName: string;
  contactHelp: string;
  privacyNotice: string;
  privacyAccepted: string;
};

const CONTACT_PRIVACY_COPY: Record<RoomFinderLanguage, ContactPrivacyCopy> = {
  el: {
    firstName: "Όνομα",
    lastName: "Επώνυμο",
    contactHelp: "Συμπληρώστε όνομα, επώνυμο και τηλέφωνο. Το email είναι προαιρετικό.",
    privacyNotice: "Έχω ενημερωθεί ότι το Voulamandis House θα χρησιμοποιήσει τα στοιχεία μου (όνομα, επώνυμο, τηλέφωνο και email) αποκλειστικά για τη διαχείριση και απάντηση στο αίτημα διαμονής μου. Δεν θα χρησιμοποιηθούν για marketing χωρίς ξεχωριστή συγκατάθεση.",
    privacyAccepted: "Αποδοχή ενημέρωσης προσωπικών δεδομένων",
  },
  en: {
    firstName: "First name",
    lastName: "Last name",
    contactHelp: "Enter your first name, last name and phone number. Email is optional.",
    privacyNotice: "I understand that Voulamandis House will use my personal details (first name, last name, phone number and email) solely to manage and respond to my accommodation request. They will not be used for marketing without separate consent.",
    privacyAccepted: "Privacy notice accepted",
  },
  de: {
    firstName: "Vorname",
    lastName: "Nachname",
    contactHelp: "Geben Sie Vorname, Nachname und Telefonnummer ein. Die E-Mail-Adresse ist optional.",
    privacyNotice: "Ich bin darüber informiert, dass Voulamandis House meine Daten (Vorname, Nachname, Telefonnummer und E-Mail-Adresse) ausschließlich zur Bearbeitung und Beantwortung meiner Unterkunftsanfrage verwendet. Sie werden ohne gesonderte Einwilligung nicht für Marketingzwecke verwendet.",
    privacyAccepted: "Datenschutzhinweis akzeptiert",
  },
  fr: {
    firstName: "Prénom",
    lastName: "Nom",
    contactHelp: "Indiquez votre prénom, nom et numéro de téléphone. L’e-mail est facultatif.",
    privacyNotice: "Je suis informé(e) que Voulamandis House utilisera mes données (prénom, nom, téléphone et e-mail) uniquement pour traiter et répondre à ma demande de séjour. Elles ne seront pas utilisées à des fins de marketing sans consentement séparé.",
    privacyAccepted: "Information sur la confidentialité acceptée",
  },
  it: {
    firstName: "Nome",
    lastName: "Cognome",
    contactHelp: "Inserite nome, cognome e numero di telefono. L’email è facoltativa.",
    privacyNotice: "Sono informato/a che Voulamandis House utilizzerà i miei dati (nome, cognome, telefono ed email) esclusivamente per gestire e rispondere alla mia richiesta di soggiorno. Non saranno utilizzati per finalità di marketing senza un consenso separato.",
    privacyAccepted: "Informativa privacy accettata",
  },
  es: {
    firstName: "Nombre",
    lastName: "Apellidos",
    contactHelp: "Indiquen nombre, apellidos y teléfono. El email es opcional.",
    privacyNotice: "He sido informado/a de que Voulamandis House utilizará mis datos (nombre, apellidos, teléfono y email) únicamente para gestionar y responder a mi solicitud de estancia. No se utilizarán con fines de marketing sin un consentimiento por separado.",
    privacyAccepted: "Aviso de privacidad aceptado",
  },
  tr: {
    firstName: "Ad",
    lastName: "Soyad",
    contactHelp: "Adınızı, soyadınızı ve telefon numaranızı girin. E-posta isteğe bağlıdır.",
    privacyNotice: "Voulamandis House’un kişisel bilgilerimi (ad, soyad, telefon ve e-posta) yalnızca konaklama talebimi yönetmek ve yanıtlamak amacıyla kullanacağı konusunda bilgilendirildim. Ayrı bir onayım olmadan pazarlama amacıyla kullanılmayacaktır.",
    privacyAccepted: "Gizlilik bildirimi kabul edildi",
  },
};

const CLOSE_DETAILS: Record<RoomFinderLanguage, string> = {
  el: "Κλείσιμο λεπτομερειών δωματίου",
  en: "Close room details",
  de: "Zimmerdetails schließen",
  fr: "Fermer les détails de la chambre",
  it: "Chiudi i dettagli della camera",
  es: "Cerrar detalles de la habitación",
  tr: "Oda ayrıntılarını kapat",
};

const COST_BREAKDOWN_COPY: Record<RoomFinderLanguage, {
  dayLabel: (count: number) => string;
  perNight: string;
  perPerson: string;
}> = {
  el: {
    dayLabel: count => count === 1 ? "μέρα" : "μέρες",
    perNight: "/διανυκτέρευση",
    perPerson: "/άτομο",
  },
  en: {
    dayLabel: count => count === 1 ? "day" : "days",
    perNight: "/night",
    perPerson: "/person",
  },
  de: {
    dayLabel: count => count === 1 ? "Tag" : "Tage",
    perNight: "/Nacht",
    perPerson: "/Person",
  },
  fr: {
    dayLabel: count => count === 1 ? "jour" : "jours",
    perNight: "/nuit",
    perPerson: "/personne",
  },
  it: {
    dayLabel: count => count === 1 ? "giorno" : "giorni",
    perNight: "/notte",
    perPerson: "/persona",
  },
  es: {
    dayLabel: count => count === 1 ? "día" : "días",
    perNight: "/noche",
    perPerson: "/persona",
  },
  tr: {
    dayLabel: () => "gün",
    perNight: "/gece",
    perPerson: "/kişi",
  },
};

function detectLanguage(): RoomFinderLanguage {
  if (typeof window === "undefined") return "en";
  const supported = ROOM_FINDER_LANGUAGES.map(([value]) => value);
  const queryLanguage = new URLSearchParams(window.location.search)
    .get("lang")
    ?.toLowerCase()
    .split("-")[0];
  const pathLanguage = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const documentLanguage = document.documentElement.lang?.toLowerCase().split("-")[0];

  return (
    [queryLanguage, pathLanguage, documentLanguage]
      .find(value => supported.includes(value as RoomFinderLanguage)) as RoomFinderLanguage
  ) || "en";
}

function money(value: number, language: RoomFinderLanguage) {
  const locale = {
    el: "el-GR",
    en: "en-GB",
    de: "de-DE",
    fr: "fr-FR",
    it: "it-IT",
    es: "es-ES",
    tr: "tr-TR",
  } as const;

  return new Intl.NumberFormat(locale[language], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function RoomFinderProduction({
  initialLanguage = "en",
}: {
  initialLanguage?: RoomFinderLanguage;
}) {
  const [language, setLanguage] = useState<RoomFinderLanguage>(initialLanguage);
  const finder = useRoomFinder(language);
  const copy = ROOM_FINDER_COPY[language];
  const breakdownCopy = COST_BREAKDOWN_COPY[language];
  const contactCopy = CONTACT_PRIVACY_COPY[language];
  const [detail, setDetail] = useState<RoomOffer | null>(null);
  const [contact, setContact] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [hiddenQuickReplyPromptId, setHiddenQuickReplyPromptId] = useState<string | null>(null);
  const [breakfastChoicePending, setBreakfastChoicePending] = useState<boolean | null>(null);
  const shellRef = useRef<HTMLElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const composerInputRef = useRef<HTMLInputElement>(null);
  const detailDialogRef = useRef<HTMLElement>(null);
  const detailCloseRef = useRef<HTMLButtonElement>(null);
  const detailTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const detected = detectLanguage();
    if (detected !== language) setLanguage(detected);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    finder.reset();
    setDetail(null);
    setContact({ firstName: "", lastName: "", phone: "", email: "" });
    setPrivacyAccepted(false);
    setSendStatus("idle");
    setHiddenQuickReplyPromptId(null);
    setBreakfastChoicePending(null);
  }, [language]);

  useEffect(() => {
    setSendStatus("idle");
  }, [finder.checkin, finder.checkout, finder.guestTotal, finder.roomCount]);

  useEffect(() => {
    if (finder.step !== "breakfast") setBreakfastChoicePending(null);
  }, [finder.step]);

  useEffect(() => {
    if (finder.step === "searching" || (finder.step === "selecting" && finder.visibleOffers.length > 0)) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [finder.messages, finder.step, finder.typing, finder.choices, finder.visibleOffers.length, sendStatus]);

  useEffect(() => {
    if (finder.step !== "searching") return;
    composerInputRef.current?.blur();
  }, [finder.step]);

  useEffect(() => {
    if (finder.step !== "selecting" || finder.visibleOffers.length === 0) return;

    composerInputRef.current?.blur();

    const scrollToResults = (behavior: ScrollBehavior) => {
      resultsRef.current?.scrollIntoView({ block: "start", behavior });
    };

    const frame = requestAnimationFrame(() => scrollToResults("smooth"));
    const settleTimer = window.setTimeout(() => scrollToResults("auto"), 300);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
    };
  }, [finder.step, finder.visibleOffers.length]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const visualViewport = window.visualViewport;
    let viewportFrame: number | null = null;

    const syncViewport = () => {
      viewportFrame = null;
      const viewport = window.visualViewport;
      const visibleHeight = Math.max(320, Math.round(viewport?.height ?? window.innerHeight));
      const offsetTop = Math.max(0, Math.round(viewport?.offsetTop ?? 0));
      const layoutHeight = Math.max(window.innerHeight, document.documentElement.clientHeight);
      const keyboardOpen = Boolean(viewport && layoutHeight - viewport.height > 120);

      shell.style.setProperty("--rf-visual-height", `${visibleHeight}px`);
      shell.style.setProperty("--rf-visual-offset-top", `${offsetTop}px`);
      shell.dataset.keyboardOpen = keyboardOpen ? "true" : "false";

      if (document.activeElement === composerInputRef.current) {
        requestAnimationFrame(() => {
          feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "auto" });
        });
      }
    };

    const scheduleViewportSync = () => {
      if (viewportFrame !== null) cancelAnimationFrame(viewportFrame);
      viewportFrame = requestAnimationFrame(syncViewport);
    };

    syncViewport();
    visualViewport?.addEventListener("resize", scheduleViewportSync);
    visualViewport?.addEventListener("scroll", scheduleViewportSync);
    window.addEventListener("resize", scheduleViewportSync);
    window.addEventListener("orientationchange", scheduleViewportSync);

    return () => {
      if (viewportFrame !== null) cancelAnimationFrame(viewportFrame);
      visualViewport?.removeEventListener("resize", scheduleViewportSync);
      visualViewport?.removeEventListener("scroll", scheduleViewportSync);
      window.removeEventListener("resize", scheduleViewportSync);
      window.removeEventListener("orientationchange", scheduleViewportSync);
    };
  }, []);

  useEffect(() => {
    if (!detail) return;

    const frame = requestAnimationFrame(() => detailCloseRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setDetail(null);
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = detailDialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter(element => !element.hasAttribute("hidden"));

      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      const trigger = detailTriggerRef.current;
      requestAnimationFrame(() => trigger?.focus());
    };
  }, [detail]);

  function changeLanguage(next: RoomFinderLanguage) {
    if (finder.typing || finder.step === "searching") return;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    history.replaceState(history.state, "", url);
    setLanguage(next);
  }

  function openRoomDetail(offer: RoomOffer) {
    detailTriggerRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    composerInputRef.current?.blur();
    setDetail(offer);
  }

  function openWhatsApp(text: string) {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function whatsappContext(base: string, includeSelectedRooms = false) {
    const selectedRooms = includeSelectedRooms
      ? finder.choices.map(choice => `${choice.offer.name} · ${money(choice.offer.directTotal, language)}`)
      : [];

    return [
      base,
      stayRange(finder.checkin, finder.checkout, language),
      finder.guestTotal ? copy.guestLabel(finder.guestTotal) : "",
      finder.roomCount ? copy.roomLabel(finder.roomCount) : "",
      ...selectedRooms,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function chooseBreakfast(value: boolean) {
    if (breakfastChoicePending !== null) return;
    setBreakfastChoicePending(value);
    void finder.chooseBreakfast(value);
  }

  async function sendRequest() {
    if (!contact.firstName.trim() || !contact.lastName.trim() || !contact.phone.trim() || !privacyAccepted) return;

    setSendStatus("sending");
    const breakfastTotal = finder.breakfast
      ? finder.choices.reduce((sum, choice) => sum + Number(choice.offer.breakfastTotalIfAdded || 0), 0)
      : 0;
    const roomTotal = finder.choices.reduce((sum, choice) => sum + choice.offer.directTotal, 0);
    const summary = [
      stayRange(finder.checkin, finder.checkout, language),
      copy.guestLabel(finder.guestTotal),
      ...finder.choices.map(choice => `${choice.offer.name}: ${money(choice.offer.directTotal, language)}`),
      ...(finder.breakfast ? [`${copy.breakfastLabel}: ${money(breakfastTotal, language)}`] : []),
      `${copy.total}: ${money(roomTotal + breakfastTotal, language)}`,
    ].join("\n");
    const fullName = `${contact.firstName.trim()} ${contact.lastName.trim()}`;
    const privacyAcceptedAt = new Date().toISOString();

    try {
      const response = await fetch("/api/ai-assistant/summary-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "ai-room-finder",
          subject: `AI Room Finder — ${fullName}`,
          message: `${copy.contactTitle}\n\n${summary}\n\n${contactCopy.firstName}: ${contact.firstName.trim()}\n${contactCopy.lastName}: ${contact.lastName.trim()}\n${copy.phone}: ${contact.phone.trim()}\n${copy.email}: ${contact.email.trim() || "—"}\n${contactCopy.privacyAccepted}: ${privacyAcceptedAt}`,
          guest: {
            ...contact,
            name: fullName,
            privacyAccepted: true,
            privacyAcceptedAt,
          },
        }),
      });
      if (!response.ok) throw new Error("Request send failed");
      setSendStatus("sent");
    } catch {
      setSendStatus("error");
    }
  }

  const homeHref = language === "en" ? "/" : `/${language}/`;
  const inputEnabled = finder.step !== "searching" && !finder.typing;
  const inputPlaceholder = finder.step === "searching"
    ? copy.waitingPlaceholder
    : CORE_INPUT_STEPS.has(finder.step)
      ? copy.placeholder
      : copy.changePlaceholder;
  const breakfastOfferTotal = finder.choices.reduce(
    (sum, choice) => sum + Number(choice.offer.breakfastTotalIfAdded || 0),
    0,
  );
  const breakfastTotal = finder.breakfast ? breakfastOfferTotal : 0;
  const breakfastUnitPrice = finder.guestTotal > 0 && finder.nights > 0
    ? breakfastOfferTotal / (finder.guestTotal * finder.nights)
    : 0;
  const roomTotal = finder.choices.reduce((sum, choice) => sum + choice.offer.directTotal, 0);
  const stay = stayRange(finder.checkin, finder.checkout, language);
  const guestSummary = finder.guestTotal ? copy.guestLabel(finder.guestTotal) : "";
  const roomSummary = finder.roomCount ? copy.roomLabel(finder.roomCount) : "";
  const bookingSummary = [stay, guestSummary, roomSummary].filter(Boolean).join(", ");
  const canSendRequest = Boolean(
    contact.firstName.trim()
      && contact.lastName.trim()
      && contact.phone.trim()
      && privacyAccepted,
  );
  const lastAssistantMessageId = [...finder.messages]
    .reverse()
    .find(message => message.role === "assistant")?.id;
  const awaitingStepTransition = finder.messages[finder.messages.length - 1]?.role === "user";
  const quickRepliesHidden = awaitingStepTransition
    || (!!lastAssistantMessageId && hiddenQuickReplyPromptId === lastAssistantMessageId);

  return (
    <main
      ref={shellRef}
      data-room-finder-shell="true"
      data-keyboard-open="false"
      className="fixed inset-x-0 top-0 flex min-h-0 w-full flex-col overflow-hidden bg-[#f6f2eb] text-[#29251f]"
      style={{
        height: "var(--rf-visual-height, 100dvh)",
        top: "var(--rf-visual-offset-top, 0px)",
      }}
    >
      <style jsx global>{`
        :root { --mandarin: #c66a34; }
        @keyframes msg { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes react { from { opacity: 0; transform: translateY(2px) scale(.82); } to { opacity: 1; transform: none; } }
        @keyframes typingDot { 0%,60%,100% { opacity: .35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-4px); } }
        .msg { animation: msg .22s ease-out both; }
        .reaction { animation: react .22s ease-out both; }
        .typing-dot { display: block; width: 6px; height: 6px; border-radius: 9999px; background: #746b60; animation: typingDot 1.05s ease-in-out infinite; }
        .typing-dot:nth-child(2) { animation-delay: .14s; }
        .typing-dot:nth-child(3) { animation-delay: .28s; }
        [data-room-finder-shell="true"] { overscroll-behavior: none; }
        .room-finder-composer {
          padding: .75rem;
          padding-bottom: max(.75rem, env(safe-area-inset-bottom));
        }
        [data-room-finder-shell="true"][data-keyboard-open="true"] .room-finder-composer {
          padding-bottom: .75rem;
        }
      `}</style>

      <header className="shrink-0 border-b border-[#ddd4c8] bg-[#fbf8f3]/95 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-[64px] max-w-3xl items-center gap-1.5 px-2.5">
          <a
            href={homeHref}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[26px] font-semibold leading-none text-[#625b52] transition hover:bg-white/70 active:scale-[.96]"
            aria-label="Back"
          >
            ←
          </a>
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
            <Image
              src="/images/welcome/voulamandis-welcome-hero.webp"
              alt="Voulamandis House"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 pl-1">
            <h1 className="whitespace-nowrap text-[15px] font-bold leading-tight">Voulamandis House</h1>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#746b60]">
              <span className="h-2 w-2 rounded-full bg-[#718b52]" />
              {copy.online}
            </div>
          </div>
          <div className="relative h-11 w-[58px] shrink-0">
            <div className="pointer-events-none flex h-full items-center justify-center gap-1 rounded-full border border-[#d8cec1] bg-white text-xs font-bold">
              {language.toUpperCase()} <span aria-hidden="true">⌄</span>
            </div>
            <select
              aria-label={copy.languageLabel}
              value={language}
              disabled={finder.typing || finder.step === "searching"}
              onChange={event => changeLanguage(event.target.value as RoomFinderLanguage)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-wait"
            >
              {ROOM_FINDER_LANGUAGES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            aria-label={copy.newSearch}
            title={copy.newSearch}
            onClick={() => finder.reset()}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-[#d8cec1] bg-white text-[30px] font-black leading-none text-[#5f574d] shadow-sm transition hover:bg-[#fffdf9] active:scale-[.96]"
          >
            ↻
          </button>
        </div>
      </header>

      {bookingSummary && (
        <div className="shrink-0 border-b border-[#e5ddd2] bg-[#f9f5ef] px-3 py-2">
          <div className="mx-auto flex max-w-3xl items-center">
            <div
              aria-label={bookingSummary}
              className="relative flex h-8 min-w-0 flex-1 items-center rounded-full border border-dashed border-[#d8cec1] bg-white pl-5 pr-3 text-xs font-semibold text-[#625b52] shadow-[0_6px_16px_rgba(70,55,35,.06)]"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[6px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-[1.5px] bg-[#f6f2eb] [border-color:var(--mandarin)]"
              />
              <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden">
                {stay && (
                  <span className="min-w-0 truncate [font-variant-numeric:tabular-nums]">{stay}</span>
                )}
                {stay && guestSummary && (
                  <span aria-hidden="true" className="mx-2 h-3 shrink-0 border-l border-dashed border-[#d8cec1]" />
                )}
                {guestSummary && (
                  <span className="min-w-0 truncate">{guestSummary}</span>
                )}
                {(stay || guestSummary) && roomSummary && (
                  <span aria-hidden="true" className="mx-2 h-3 shrink-0 border-l border-dashed border-[#d8cec1]" />
                )}
                {roomSummary && (
                  <span className="min-w-0 truncate">{roomSummary}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        ref={feedRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-atomic="false"
        aria-busy={finder.typing}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto flex min-h-full max-w-3xl flex-col px-3 pb-7 pt-5">
          <div className="space-y-3.5">
            {finder.messages.map(message => (
              <div key={message.id}>
                <ChatMessage message={message} />
                {message.kind === "contact" && (
                  <section
                    aria-label={`${CALL_LABEL[language]} / ${copy.whatsapp}`}
                    className="msg ml-10 mt-2 grid grid-cols-2 gap-2 rounded-[22px] border border-[#dfd6ca] bg-white p-3 shadow-sm"
                  >
                    <a
                      href={`tel:${CALL_NUMBER}`}
                      aria-label={`${CALL_LABEL[language]} ${CALL_NUMBER}`}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#c66a34] px-3 font-bold text-white transition hover:bg-[#ad572a] active:scale-[.97]"
                    >
                      <Phone className="h-5 w-5" aria-hidden="true" />
                      {CALL_LABEL[language]}
                    </a>
                    <button
                      type="button"
                      onClick={() => openWhatsApp(whatsappContext(copy.whatsappHelp))}
                      aria-label={copy.whatsapp}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#287d4f] px-3 font-bold text-white transition hover:bg-[#20663f] active:scale-[.97]"
                    >
                      <MessageCircle className="h-5 w-5" aria-hidden="true" />
                      {copy.whatsapp}
                    </button>
                  </section>
                )}
                {finder.canGoBack
                  && !finder.typing
                  && !quickRepliesHidden
                  && message.role === "assistant"
                  && message.id === lastAssistantMessageId && (
                    <div className="ml-10 mt-1.5">
                      <button
                        type="button"
                        onClick={() => finder.goBack()}
                        aria-label={copy.backLabel}
                        title={copy.backLabel}
                        className="inline-flex min-h-11 items-center gap-1 rounded-full border border-[#ddd3c6] bg-[#fbf8f3] px-3 text-xs font-bold text-[#625b52] shadow-sm transition hover:bg-white active:scale-[.97]"
                      >
                        <span aria-hidden="true">←</span>
                        {copy.backLabel}
                      </button>
                    </div>
                  )}
              </div>
            ))}
            {finder.typing && <TypingIndicator />}

            {finder.step === "rooms" && !quickRepliesHidden && (
              <IconReplies
                values={[1, 2, 3]}
                icon="🛏️"
                label={copy.roomLabel}
                onSelect={value => {
                  if (lastAssistantMessageId) setHiddenQuickReplyPromptId(lastAssistantMessageId);
                  void finder.chooseRooms(value);
                }}
              />
            )}
            {finder.step === "guests" && !quickRepliesHidden && (
              <IconReplies
                values={[1, 2, 3, 4, 5]}
                icon="👤"
                label={copy.guestLabel}
                onSelect={value => {
                  if (lastAssistantMessageId) setHiddenQuickReplyPromptId(lastAssistantMessageId);
                  void finder.chooseGuests(value);
                }}
              />
            )}

            {finder.step === "selecting" && finder.visibleOffers.length > 0 && (
              <div ref={resultsRef} data-room-results-start="true" className="space-y-3.5 scroll-mt-2">
                <RoomCarousel
                  offers={finder.visibleOffers}
                  copy={copy}
                  language={language}
                  money={money}
                  selectingOfferKey={finder.selectingOfferKey}
                  onDetails={openRoomDetail}
                  onSelect={offer => void finder.selectOffer(offer)}
                />
                <section className="msg flex items-center gap-3 rounded-[20px] border border-[#dfd6ca] bg-white px-4 py-3 shadow-sm sm:ml-10">
                  <p className="min-w-0 flex-1 text-sm font-semibold leading-5">{copy.whatsappHelp}</p>
                  <button
                    type="button"
                    onClick={() => openWhatsApp(whatsappContext(copy.whatsappHelp))}
                    className="min-h-11 shrink-0 rounded-full bg-[#287d4f] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    💬 {copy.whatsapp}
                  </button>
                </section>
              </div>
            )}

            {finder.step === "breakfast" && (
              <>
                <SelectedRoomCard
                  choices={finder.choices}
                  copy={copy}
                  language={language}
                  checkin={finder.checkin}
                  checkout={finder.checkout}
                  money={money}
                />
                <div className="msg ml-10 rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white px-4 py-3 text-[15px] shadow-sm">
                  <p>{copy.breakfast}</p>
                  {breakfastOfferTotal > 0 && (
                    <p className="mt-2 font-black text-[#5f7448] [font-variant-numeric:tabular-nums]">{copy.breakfastLabel}: {money(breakfastOfferTotal, language)}</p>
                  )}
                </div>
                <section className="msg ml-10 overflow-hidden rounded-[22px] border border-[#dcd2c5] bg-white shadow-sm">
                  <div className="relative h-36">
                    <Image src={BREAKFAST_IMAGE} alt={copy.breakfastLabel} fill sizes="600px" className="object-cover" />
                  </div>
                  <div className="p-3">
                    {breakfastChoicePending === null ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => chooseBreakfast(true)}
                          className="min-h-11 rounded-full bg-[#66714f] px-4 py-2.5 text-sm font-bold text-white transition active:scale-[.97]"
                        >
                          {copy.yesBreakfast}
                        </button>
                        <button
                          type="button"
                          onClick={() => chooseBreakfast(false)}
                          className="min-h-11 rounded-full border border-[#d8cec1] px-4 py-2.5 text-sm font-bold transition active:scale-[.97]"
                        >
                          {copy.noBreakfast}
                        </button>
                      </div>
                    ) : (
                      <div
                        role="status"
                        aria-live="polite"
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#b9c6aa] bg-[#eef4e7] px-4 text-sm font-black text-[#4f6539] shadow-sm"
                      >
                        <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full bg-[#66714f] text-xs text-white">✓</span>
                        {breakfastChoicePending ? copy.yesBreakfast : copy.noBreakfast}
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {finder.step === "complete" && (
              <section className="msg relative rounded-[26px] border border-[#dcd2c5] bg-white shadow-[0_16px_45px_rgba(70,55,35,.10)] sm:ml-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[14px] -top-[14px] z-10 flex h-[58px] w-[58px] -rotate-[9deg] items-center justify-center rounded-full border-2 bg-white text-center opacity-[.92] [border-color:var(--mandarin)] [border-style:double] [color:var(--mandarin)]"
                >
                  <span className="text-[7.2px] font-extrabold uppercase leading-[9px] tracking-[0.05em]">
                    VH ·<br />KAMBOS ·<br />CHIOS
                  </span>
                </div>

                <div className="rounded-t-[26px] bg-[#faf7f2] p-4 pr-[82px]">
                  <div className="flex justify-between gap-3">
                    <h2 className="text-lg font-black">{copy.summary}</h2>
                    <button type="button" onClick={() => finder.reset()} className="min-h-11 text-xs font-bold underline">
                      {copy.newSearch}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-[#746b60] [font-variant-numeric:tabular-nums]">{stay} · {copy.nightLabel(finder.nights)}</p>
                </div>

                <div className="relative h-0 border-t-2 border-dashed border-[#d8cec1]">
                  <span aria-hidden="true" className="absolute -left-[11px] -top-[10px] h-5 w-5 rounded-full border border-[#d8cec1] bg-[#f6f2eb]" />
                  <span aria-hidden="true" className="absolute -right-[11px] -top-[10px] h-5 w-5 rounded-full border border-[#d8cec1] bg-[#f6f2eb]" />
                </div>

                <div className="p-4">
                  {finder.choices.map(choice => {
                    const choiceNights = Math.max(1, Number(choice.offer.nights || finder.nights || 1));
                    const nightlyRate = choice.offer.directTotal / choiceNights;
                    return (
                      <div key={choice.group} className="flex items-center gap-3 border-b py-3">
                        <div className="relative h-14 w-[72px] shrink-0 overflow-hidden rounded-xl">
                          <Image src={choice.offer.image} alt={choice.offer.name} fill sizes="72px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold">{choice.offer.name}</p>
                          <p className="text-xs text-[#746b60]">{copy.guestLabel(choice.guests)}</p>
                          <p className="mt-1 text-xs font-semibold leading-5 text-[#625b52] [font-variant-numeric:tabular-nums]">
                            {choiceNights} {breakdownCopy.dayLabel(choiceNights)} × {money(nightlyRate, language)}{breakdownCopy.perNight} = {money(choice.offer.directTotal, language)}
                          </p>
                        </div>
                        <strong className="shrink-0 text-[#5f7448] [font-variant-numeric:tabular-nums]">{money(choice.offer.directTotal, language)}</strong>
                      </div>
                    );
                  })}
                  {finder.breakfast && (
                    <div className="flex items-center gap-3 border-b py-3">
                      <div className="relative h-14 w-[72px] shrink-0 overflow-hidden rounded-xl">
                        <Image src={BREAKFAST_IMAGE} alt={copy.breakfastLabel} fill sizes="72px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold">{copy.breakfastLabel}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-[#625b52] [font-variant-numeric:tabular-nums]">
                          {copy.guestLabel(finder.guestTotal)} × {money(breakfastUnitPrice, language)}{breakdownCopy.perPerson} × {finder.nights} {breakdownCopy.dayLabel(finder.nights)} = {money(breakfastTotal, language)}
                        </p>
                      </div>
                      <strong className="shrink-0 [font-variant-numeric:tabular-nums]">{money(breakfastTotal, language)}</strong>
                    </div>
                  )}
                  <div className="mt-4 flex justify-between rounded-2xl bg-[#f1ede7] p-4 text-lg">
                    <b>{copy.total}</b>
                    <strong className="text-xl text-[#5f7448] [font-variant-numeric:tabular-nums]">{money(roomTotal + breakfastTotal, language)}</strong>
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-black">{copy.contactTitle}</h3>
                    <p className="mt-1 text-sm text-[#746b60]">{contactCopy.contactHelp}</p>
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <label htmlFor="room-finder-first-name" className="sr-only">{contactCopy.firstName}</label>
                          <input
                            id="room-finder-first-name"
                            name="given-name"
                            autoComplete="given-name"
                            required
                            value={contact.firstName}
                            onChange={event => setContact({ ...contact, firstName: event.target.value })}
                            placeholder={`${contactCopy.firstName} *`}
                            className="h-12 w-full rounded-2xl border border-[#d8cec1] px-4 text-[16px]"
                          />
                        </div>
                        <div>
                          <label htmlFor="room-finder-last-name" className="sr-only">{contactCopy.lastName}</label>
                          <input
                            id="room-finder-last-name"
                            name="family-name"
                            autoComplete="family-name"
                            required
                            value={contact.lastName}
                            onChange={event => setContact({ ...contact, lastName: event.target.value })}
                            placeholder={`${contactCopy.lastName} *`}
                            className="h-12 w-full rounded-2xl border border-[#d8cec1] px-4 text-[16px]"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="room-finder-phone" className="sr-only">{copy.phone}</label>
                        <input
                          id="room-finder-phone"
                          name="tel"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                          value={contact.phone}
                          onChange={event => setContact({ ...contact, phone: event.target.value })}
                          placeholder={`${copy.phone} *`}
                          className="h-12 w-full rounded-2xl border border-[#d8cec1] px-4 text-[16px]"
                        />
                      </div>
                      <div>
                        <label htmlFor="room-finder-email" className="sr-only">{copy.email}</label>
                        <input
                          id="room-finder-email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={contact.email}
                          onChange={event => setContact({ ...contact, email: event.target.value })}
                          placeholder={copy.email}
                          className="h-12 w-full rounded-2xl border border-[#d8cec1] px-4 text-[16px]"
                        />
                      </div>
                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#e1d8cd] bg-[#faf7f2] p-3 text-xs leading-5 text-[#625b52]">
                        <input
                          type="checkbox"
                          required
                          checked={privacyAccepted}
                          onChange={event => setPrivacyAccepted(event.target.checked)}
                          className="mt-0.5 h-5 w-5 shrink-0 accent-[#66714f]"
                        />
                        <span>{contactCopy.privacyNotice}</span>
                      </label>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={sendStatus === "sending" || !canSendRequest}
                        onClick={() => void sendRequest()}
                        className="min-h-12 rounded-2xl bg-[#66714f] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {copy.send}
                      </button>
                      <button
                        type="button"
                        onClick={() => openWhatsApp(whatsappContext(copy.contactTitle, true))}
                        className="min-h-12 rounded-2xl bg-[#287d4f] font-bold text-white"
                      >
                        {copy.whatsapp}
                      </button>
                    </div>
                    {sendStatus === "sent" && (
                      <p className="mt-3 rounded-2xl bg-[#eef4e7] p-3 font-bold text-[#5f7448]">{copy.sent}</p>
                    )}
                    {sendStatus === "error" && (
                      <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{copy.sendError}</p>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={finder.submit} className="room-finder-composer shrink-0 border-t border-[#e2d9cd] bg-[#fbf8f3]/95">
        <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-[24px] border border-[#d8cec1] bg-white p-2 shadow-sm">
          <label htmlFor="room-finder-message" className="sr-only">{inputPlaceholder}</label>
          <input
            ref={composerInputRef}
            id="room-finder-message"
            name="room-finder-message"
            autoComplete="off"
            enterKeyHint="send"
            aria-label={inputPlaceholder}
            aria-disabled={!inputEnabled}
            aria-busy={!inputEnabled}
            value={finder.input}
            onBeforeInput={event => {
              if (!inputEnabled) event.preventDefault();
            }}
            onPaste={event => {
              if (!inputEnabled) event.preventDefault();
            }}
            onDrop={event => {
              if (!inputEnabled) event.preventDefault();
            }}
            onChange={event => {
              if (inputEnabled) finder.setInput(event.target.value);
            }}
            placeholder={inputPlaceholder}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[16px] outline-none"
          />
          <button
            type="submit"
            aria-label={copy.send}
            onPointerDown={event => event.preventDefault()}
            disabled={!inputEnabled || !finder.input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6b604f] text-white disabled:bg-[#d7d0c6]"
          >
            ↑
          </button>
        </div>
      </form>

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/35 p-3 sm:items-center sm:justify-center"
          onClick={event => {
            if (event.target === event.currentTarget) setDetail(null);
          }}
        >
          <section
            ref={detailDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-detail-title"
            aria-describedby="room-detail-meta"
            tabIndex={-1}
            className="flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[26px] bg-white sm:max-w-xl sm:rounded-[26px]"
          >
            <div className="flex shrink-0 justify-center py-2 sm:hidden" aria-hidden="true">
              <span className="h-1 w-10 rounded-full bg-[#d8cec1]" />
            </div>
            <div className="relative h-60 shrink-0">
              <Image src={detail.image} alt={detail.name} fill sizes="600px" className="object-cover" />
              <button
                ref={detailCloseRef}
                type="button"
                onClick={() => setDetail(null)}
                className="absolute right-3 top-3 h-11 w-11 rounded-full bg-white/90 text-xl shadow-sm"
                aria-label={CLOSE_DETAILS[language]}
              >
                ×
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <h2 id="room-detail-title" className="text-2xl font-black">{detail.name}</h2>
              <p id="room-detail-meta" className="mt-1 text-sm text-[#746b60]">{detail.category} · {detail.floor}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(detail.features || []).map(feature => (
                  <span key={feature} className="rounded-full bg-[#f1ede7] px-3 py-1.5 text-xs font-semibold">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 border-t border-[#e5ddd2] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => {
                  const selected = detail;
                  setDetail(null);
                  void finder.selectOffer(selected);
                }}
                className="min-h-12 w-full rounded-2xl bg-[#66714f] p-3.5 font-black text-white"
              >
                {copy.select}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}