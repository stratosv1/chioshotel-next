"use client";

import Image from "next/image";

export type Reaction = "👍" | "❤️";
export type MessageKind = "date" | "room" | "guest" | "normal";
export type ChatItem = { id:string; role:"assistant"|"user"; content:string; kind?:MessageKind; reaction?:Reaction };

export function ChatMessage({ message }:{ message:ChatItem }) {
  const icon = message.kind === "room" ? "🛏️ " : message.kind === "guest" ? "👤 " : "";
  const content = message.content.replaceAll("📅", "").trim();
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
