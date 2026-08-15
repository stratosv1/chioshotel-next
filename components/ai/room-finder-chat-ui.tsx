"use client";

import Image from "next/image";
import { useEffect } from "react";
import { ROOM_FINDER_COPY, type RoomFinderLanguage } from "./room-finder-copy";

export type Reaction = "👍" | "❤️";
export type MessageKind = "date" | "room" | "guest" | "normal";
export type ChatItem = { id:string; role:"assistant"|"user"; content:string; kind?:MessageKind; reaction?:Reaction };

const CHAT_STORAGE_NOTICE: Record<RoomFinderLanguage, string> = {
  el: "Η συνομιλία αποθηκεύεται με ασφάλεια και είναι ορατή στο προσωπικό του Voulamandis House για τη διαχείριση του αιτήματός σας και τη βελτίωση της υπηρεσίας.",
  en: "This conversation is stored securely and can be viewed by Voulamandis House staff to manage your request and improve the service.",
  de: "Diese Unterhaltung wird sicher gespeichert und kann vom Team des Voulamandis House eingesehen werden, um Ihre Anfrage zu bearbeiten und den Service zu verbessern.",
  fr: "Cette conversation est enregistrée de manière sécurisée et peut être consultée par l’équipe de Voulamandis House afin de gérer votre demande et d’améliorer le service.",
  it: "Questa conversazione viene archiviata in modo sicuro e può essere consultata dallo staff di Voulamandis House per gestire la richiesta e migliorare il servizio.",
  es: "Esta conversación se guarda de forma segura y puede ser consultada por el personal de Voulamandis House para gestionar su solicitud y mejorar el servicio.",
  tr: "Bu görüşme güvenli şekilde saklanır ve talebinizi yönetmek ve hizmeti geliştirmek amacıyla Voulamandis House personeli tarafından görüntülenebilir.",
};

let roomFinderSessionId = "";

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

function trackRoomFinderMessage(message: ChatItem) {
  if (typeof window === "undefined") return;
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
  useEffect(() => {
    trackRoomFinderMessage(message);
  }, [message.id, message.reaction]);

  const icon = message.kind === "room" ? "🛏️ " : message.kind === "guest" ? "👤 " : "";
  const content = message.content.replaceAll("📅", "").trim();
  const language = roomFinderLanguage();
  const isWelcome = message.role === "assistant"
    && Object.values(ROOM_FINDER_COPY).some((value) => value.welcome === message.content);

  return <div className={`msg flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
    {message.role === "assistant" && <div className="relative mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-[#d7cdc0]"><Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="" fill sizes="32px" className="object-cover"/></div>}
    <div className={`relative max-w-[84%] ${message.role === "user" ? "pb-2" : ""}`}>
      <div className={`whitespace-pre-line px-4 py-3 text-[15px] leading-6 shadow-sm ${message.role === "user" ? "rounded-[20px] rounded-br-[6px] bg-[#6b604f] text-white" : "rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white"}`}>{message.role === "user" ? icon : ""}{content}</div>
      {isWelcome && <p className="mt-2 px-1 text-[11px] leading-4 text-[#746b60]">{CHAT_STORAGE_NOTICE[language]}</p>}
      {message.role === "user" && message.reaction && <span className="reaction absolute -bottom-1 right-1 flex h-7 min-w-7 items-center justify-center rounded-full border border-[#ddd4c8] bg-white px-1.5 text-sm shadow-sm">{message.reaction}</span>}
    </div>
  </div>;
}

export function IconReplies({ values, icon, label, onSelect }:{ values:number[]; icon:string; label:(n:number)=>string; onSelect:(n:number)=>void }) {
  return <div className="hide-scroll msg ml-10 flex flex-nowrap gap-2 overflow-x-auto pb-1">{values.map((value) => <button key={value} onClick={() => onSelect(value)} className="flex min-w-[76px] flex-1 flex-col items-center justify-center rounded-[18px] border border-[#d8cec1] bg-white px-2 py-2.5 text-center shadow-sm"><div className="text-lg" aria-hidden>{value === 1 ? icon : `${icon}×${value}`}</div><span className="mt-0.5 whitespace-nowrap text-[11px] font-bold">{label(value)}</span></button>)}</div>;
}
