"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ROOM_FINDER_COPY, type RoomFinderLanguage } from "./room-finder-copy";

export type Reaction = "👍" | "❤️";
export type MessageKind = "date" | "room" | "guest" | "normal";
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
    const timer = window.setTimeout(() => setShowWelcomeFollowup(true), 850);
    return () => window.clearTimeout(timer);
  }, [message.id, welcomeLang]);

  const icon = message.kind === "room" ? "🛏️ " : message.kind === "guest" ? "👤 " : "";
  const content = message.content.replaceAll("📅", "").trim();

  if (welcomeLang) {
    const welcome = WELCOME_FLOW[welcomeLang];
    return <div className="msg flex items-end gap-2 justify-start">
      <div className="relative mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-[#d7cdc0]"><Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="" fill sizes="32px" className="object-cover"/></div>
      <div className="relative max-w-[84%] space-y-2">
        <div className="whitespace-pre-line rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white px-4 py-3 text-[15px] leading-6 shadow-sm">{welcome.greeting}</div>
        {showWelcomeFollowup ? (
          <div className="whitespace-pre-line rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white px-4 py-3 text-[15px] leading-6 shadow-sm">{welcome.directBenefit}</div>
        ) : (
          <div className="inline-flex h-10 items-center gap-1 rounded-[18px] rounded-bl-[6px] border border-[#dfd6ca] bg-white px-4 shadow-sm" aria-label="Typing">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9a8f82]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9a8f82] [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9a8f82] [animation-delay:300ms]" />
          </div>
        )}
        {showWelcomeFollowup && <p className="px-1 text-[11px] leading-4 text-[#746b60]">{CHAT_STORAGE_NOTICE[welcomeLang]}</p>}
      </div>
    </div>;
  }

  return <div className={`msg flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
    {message.role === "assistant" && <div className="relative mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-[#d7cdc0]"><Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="" fill sizes="32px" className="object-cover"/></div>}
    <div className={`relative max-w-[84%] ${message.role === "user" ? "pb-2" : ""}`}>
      <div className={`whitespace-pre-line px-4 py-3 text-[15px] leading-6 shadow-sm ${message.role === "user" ? "rounded-[20px] rounded-br-[6px] bg-[#6b604f] text-white" : "rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white"}`}>{message.role === "user" ? icon : ""}{content}</div>
      {message.role === "user" && message.reaction && <span className="reaction absolute -bottom-1 right-1 flex h-7 min-w-7 items-center justify-center rounded-full border border-[#ddd4c8] bg-white px-1.5 text-sm shadow-sm">{message.reaction}</span>}
    </div>
  </div>;
}

export function IconReplies({ values, icon, label, onSelect }:{ values:number[]; icon:string; label:(n:number)=>string; onSelect:(n:number)=>void }) {
  return <div className="hide-scroll msg ml-10 flex flex-nowrap gap-2 overflow-x-auto pb-1">{values.map((value) => <button key={value} onClick={() => onSelect(value)} className="flex min-w-[76px] flex-1 flex-col items-center justify-center rounded-[18px] border border-[#d8cec1] bg-white px-2 py-2.5 text-center shadow-sm"><div className="text-lg" aria-hidden>{value === 1 ? icon : `${icon}×${value}`}</div><span className="mt-0.5 whitespace-nowrap text-[11px] font-bold">{label(value)}</span></button>)}</div>;
}
