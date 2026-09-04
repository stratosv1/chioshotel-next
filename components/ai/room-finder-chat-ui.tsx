"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ROOM_FINDER_COPY, type RoomFinderLanguage } from "./room-finder-copy";

export type Reaction = "👍" | "❤️";
export type MessageKind = "date" | "room" | "guest" | "normal" | "contact";
export type ChatItem = { id:string; role:"assistant"|"user"; content:string; kind?:MessageKind; reaction?:Reaction };

const CHAT_STORAGE_NOTICE: Record<RoomFinderLanguage, string> = {
  el: "Η συνομιλία αποθηκεύεται και μπορεί να τη δει το προσωπικό του Voulamandis House για τη διαχείριση και απάντηση στο αίτημά σας.",
  en: "This conversation is stored and may be viewed by Voulamandis House staff to manage and respond to your request.",
  de: "Diese Unterhaltung wird gespeichert und kann vom Team des Voulamandis House eingesehen werden, um Ihre Anfrage zu bearbeiten und zu beantworten.",
  fr: "Cette conversation est enregistrée et peut être consultée par l’équipe de Voulamandis House afin de gérer votre demande et d’y répondre.",
  it: "Questa conversazione viene archiviata e può essere consultata dallo staff di Voulamandis House per gestire e rispondere alla vostra richiesta.",
  es: "Esta conversación se guarda y puede ser consultada por el personal de Voulamandis House para gestionar y responder a su solicitud.",
  tr: "Bu görüşme saklanır ve talebinizi yönetmek ve yanıtlamak amacıyla Voulamandis House personeli tarafından görüntülenebilir.",
};

const WELCOME_FLOW: Record<RoomFinderLanguage, { greeting: string; directBenefit: string }> = {
  el: {
    greeting: "Καλώς ήρθατε στο Voulamandis House 👋 Είμαι εδώ για να σας βοηθήσω να βρείτε το κατάλληλο δωμάτιο για τη διαμονή σας.",
    directBenefit: "Μια μικρή πληροφορία πριν ξεκινήσουμε: με απευθείας κράτηση στο Voulamandis House επωφελείστε από 10% χαμηλότερη τιμή σε σχέση με τις online πλατφόρμες, καθώς εξοικονομούνται οι προμήθειες τρίτων.\n\nΠότε θα θέλατε να κάνετε check-in;",
  },
  en: {
    greeting: "Welcome to Voulamandis House 👋 I’m here to help you find the right room for your stay.",
    directBenefit: "A quick note before we begin: by booking directly with Voulamandis House, you benefit from a 10% lower rate compared with online booking platforms, as third-party commission costs are avoided.\n\nWhen would you like to check in?",
  },
  de: {
    greeting: "Willkommen im Voulamandis House 👋 Ich helfe Ihnen gerne, das passende Zimmer für Ihren Aufenthalt zu finden.",
    directBenefit: "Eine kurze Information vorab: Bei einer Direktbuchung im Voulamandis House profitieren Sie von einem 10% günstigeren Preis als auf Online-Buchungsplattformen, da keine Provisionen an Drittanbieter anfallen.\n\nWann möchten Sie einchecken?",
  },
  fr: {
    greeting: "Bienvenue à Voulamandis House 👋 Je suis là pour vous aider à trouver la chambre qui convient à votre séjour.",
    directBenefit: "Une petite information avant de commencer : en réservant directement auprès de Voulamandis House, vous bénéficiez d’un tarif inférieur de 10% à celui des plateformes de réservation en ligne, car les commissions de tiers sont évitées.\n\nQuand souhaitez-vous faire le check-in ?",
  },
  it: {
    greeting: "Benvenuti a Voulamandis House 👋 Sono qui per aiutarvi a trovare la camera più adatta al vostro soggiorno.",
    directBenefit: "Una piccola informazione prima di iniziare: prenotando direttamente con Voulamandis House beneficiate di una tariffa inferiore del 10% rispetto alle piattaforme di prenotazione online, perché si evitano le commissioni di terzi.\n\nQuando desiderate effettuare il check-in?",
  },
  es: {
    greeting: "Bienvenidos a Voulamandis House 👋 Estoy aquí para ayudarles a encontrar la habitación adecuada para su estancia.",
    directBenefit: "Una pequeña información antes de empezar: al reservar directamente con Voulamandis House, se benefician de una tarifa un 10% más baja que en las plataformas de reservas online, ya que se evitan las comisiones de terceros.\n\n¿Cuándo les gustaría hacer el check-in?",
  },
  tr: {
    greeting: "Voulamandis House’a hoş geldiniz 👋 Konaklamanız için size en uygun odayı bulmanıza yardımcı olmak için buradayım.",
    directBenefit: "Başlamadan önce küçük bir bilgi: Voulamandis House ile doğrudan rezervasyon yaptığınızda, üçüncü taraf komisyonları olmadığı için online rezervasyon platformlarına kıyasla %10 daha düşük fiyattan yararlanırsınız.\n\nNe zaman giriş yapmak istersiniz?",
  },
};

function MiniIcon({ children }:{ children:ReactNode }) {
  return <span className="mt-0.5 inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-[#e8dfd4] bg-[#f6f1ea] text-[#786957] shadow-[0_1px_2px_rgba(67,55,42,0.05)]" aria-hidden>{children}</span>;
}

function SparkleIcon() {
  return <MiniIcon><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.2 3.6L17 8l-3.8 1.4L12 13l-1.2-3.6L7 8l3.8-1.4L12 3Z"/><path d="M18.5 14.5l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z"/></svg></MiniIcon>;
}

function DiscountIcon() {
  return <MiniIcon><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 13.5 13.5 19a2 2 0 0 1-2.8 0L5 13.3V5h8.3L19 10.7a2 2 0 0 1 0 2.8Z"/><circle cx="9" cy="9" r="1"/><path d="m9.5 15 5-5"/></svg></MiniIcon>;
}

function CalendarIcon() {
  return <MiniIcon><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg></MiniIcon>;
}

function AssistantAvatar() {
  return (
    <span
      className="mb-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d9cfc2] bg-[#fffaf3] text-[#9f5a31] shadow-[0_2px_8px_rgba(70,55,35,.08)]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.25 3.75L17 8l-3.75 1.25L12 13l-1.25-3.75L7 8l3.75-1.25L12 3Z" />
        <path d="M18.5 14.5l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z" />
      </svg>
    </span>
  );
}

let roomFinderSessionId = "";
let roomFinderHasUserMessage = false;

function getRoomFinderSessionId() {
  if (roomFinderSessionId) return roomFinderSessionId;
  const randomPart = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  roomFinderSessionId = `rf-${Date.now()}-${randomPart}`;
  return roomFinderSessionId;
}

function roomFinderLanguage(): RoomFinderLanguage {
  if (typeof document === "undefined") return "en";
  const documentLanguage = document.documentElement.lang?.toLowerCase().split("-")[0];
  const pathLanguage = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const supported: RoomFinderLanguage[] = ["el", "en", "de", "fr", "it", "es", "tr"];
  if (supported.includes(documentLanguage as RoomFinderLanguage)) return documentLanguage as RoomFinderLanguage;
  if (supported.includes(pathLanguage as RoomFinderLanguage)) return pathLanguage as RoomFinderLanguage;
  return "en";
}

function welcomeLanguage(content: string): RoomFinderLanguage | null {
  const match = Object.entries(ROOM_FINDER_COPY).find(([, value]) => value.welcome === content);
  return match ? match[0] as RoomFinderLanguage : null;
}

function trackRoomFinderMessage(message: ChatItem) {
  if (typeof window === "undefined") return;

  if (message.role === "user") roomFinderHasUserMessage = true;
  if (message.role === "assistant" && !roomFinderHasUserMessage) return;

  const payload = JSON.stringify({
    sessionId: getRoomFinderSessionId(),
    language: roomFinderLanguage(),
    sourcePath: window.location.pathname,
    messages: [{
      id: message.id,
      role: message.role,
      content: message.content,
      kind: message.kind,
      reaction: message.reaction,
    }],
  });

  const send = () => fetch("/api/ai-assistant/conversation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });

  void send().catch(() => {
    window.setTimeout(() => void send().catch(() => undefined), 1200);
  });
}

export function ChatMessage({ message }:{ message:ChatItem }) {
  const welcomeLang = welcomeLanguage(message.content);
  const [showWelcomeFollowup, setShowWelcomeFollowup] = useState(!welcomeLang);

  useEffect(() => {
    trackRoomFinderMessage(message);
  }, [message.id, message.reaction]);

  useEffect(() => {
    if (!welcomeLang) {
      setShowWelcomeFollowup(true);
      return;
    }

    setShowWelcomeFollowup(false);
    const timer = window.setTimeout(() => setShowWelcomeFollowup(true), 1200);
    return () => window.clearTimeout(timer);
  }, [message.id, welcomeLang]);

  const icon = message.kind === "room" ? "🛏️ " : message.kind === "guest" ? "👤 " : "";
  const content = message.content.replaceAll("📅", "").trim();

  if (welcomeLang) {
    const welcome = WELCOME_FLOW[welcomeLang];
    const [directBenefit, checkInQuestion] = welcome.directBenefit.split("\n\n");

    return <div className="msg flex items-end justify-start gap-2">
      <AssistantAvatar />
      <div className="relative min-w-0 flex-1 space-y-2.5 sm:max-w-[82%]">
        <div className="rounded-[20px] rounded-bl-[7px] border border-[#ded4c8] bg-white px-4 py-3.5 text-[15px] leading-6 shadow-[0_5px_18px_rgba(70,55,35,.06)]">
          <div className="flex items-start gap-2.5"><SparkleIcon/><span>{welcome.greeting}</span></div>
        </div>
        {showWelcomeFollowup ? (
          <>
            <div className="rf-followup-bubble overflow-hidden rounded-[20px] rounded-bl-[7px] border border-[#dfd3c4] bg-white shadow-[0_8px_24px_rgba(70,55,35,.07)]">
              <div className="flex items-start gap-2.5 px-4 py-3.5 text-[15px] leading-6">
                <DiscountIcon/>
                <div className="min-w-0">
                  <span className="mb-1.5 inline-flex rounded-full bg-[#fff0e4] px-2 py-0.5 text-[12px] font-black tracking-[.02em] text-[#a65329]">−10%</span>
                  <p>{directBenefit}</p>
                </div>
              </div>
              {checkInQuestion && (
                <div className="flex items-center gap-2.5 border-t border-[#eadfd2] bg-[#faf6f0] px-4 py-3.5">
                  <CalendarIcon/>
                  <span className="text-[16px] font-black leading-5 text-[#3f382f]">{checkInQuestion}</span>
                </div>
              )}
            </div>
            <p className="rf-followup-meta px-1 text-[12px] leading-[18px] text-[#746b60]">{CHAT_STORAGE_NOTICE[welcomeLang]}</p>
          </>
        ) : (
          <div className="inline-flex h-10 items-center gap-1 rounded-[18px] rounded-bl-[7px] border border-[#dfd6ca] bg-white px-4 shadow-sm" aria-label="Typing">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9a8f82]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9a8f82] [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9a8f82] [animation-delay:300ms]" />
          </div>
        )}
      </div>
    </div>;
  }

  return <div className={`msg flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
    {message.role === "assistant" && <AssistantAvatar />}
    <div className={`relative ${message.role === "user" ? "max-w-[88%] pb-2" : "min-w-0 flex-1 sm:max-w-[82%]"}`}>
      <div className={`whitespace-pre-line px-4 py-3 text-[15px] leading-6 shadow-[0_5px_18px_rgba(70,55,35,.06)] ${message.role === "user" ? "rounded-[20px] rounded-br-[7px] bg-[#62594d] text-white" : "rounded-[20px] rounded-bl-[7px] border border-[#ded4c8] bg-white"}`}>{message.role === "user" ? <>{icon}{content}</> : content}</div>
      {message.role === "user" && message.reaction && <span className="reaction absolute -bottom-1 right-1 flex h-7 min-w-7 items-center justify-center rounded-full border border-[#ddd4c8] bg-white px-1.5 text-sm shadow-sm">{message.reaction}</span>}
    </div>
  </div>;
}

export function IconReplies({ values, icon, label, onSelect }:{ values:number[]; icon:string; label:(n:number)=>string; onSelect:(n:number)=>void }) {
  return <div className="hide-scroll msg ml-10 flex flex-nowrap gap-2 overflow-x-auto pb-1">{values.map((value) => <button key={value} onClick={() => onSelect(value)} className="flex min-h-16 min-w-[82px] flex-1 flex-col items-center justify-center rounded-[18px] border border-[#d8cec1] bg-white px-2 py-2.5 text-center shadow-[0_4px_14px_rgba(70,55,35,.06)] transition hover:border-[#bda991] hover:bg-[#fffaf4] active:scale-[.97]"><div className="text-lg" aria-hidden>{value === 1 ? icon : `${icon}×${value}`}</div><span className="mt-0.5 whitespace-nowrap text-[12px] font-bold">{label(value)}</span></button>)}</div>;
}
