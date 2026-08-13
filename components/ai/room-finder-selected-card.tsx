"use client";
import Image from "next/image";
import type { RoomFinderCopy, RoomFinderLanguage } from "./room-finder-copy";
import type { RoomOffer } from "./room-finder-carousel";
export type RoomChoice={group:number;guests:number;offer:RoomOffer};
export function SelectedRoomCard({choices,copy,language,checkin,checkout,money}:{choices:RoomChoice[];copy:RoomFinderCopy;language:RoomFinderLanguage;checkin:string;checkout:string;money:(v:number,l:RoomFinderLanguage)=>string}){
 return <section className="msg ml-10 rounded-[22px] border border-[#d9cfc2] bg-[#fffdfa] p-3.5 shadow-sm"><div className="mb-3 flex items-center justify-between"><div className="font-black text-[#5f7448]">♥ {copy.selected}</div><strong className="text-[#5f7448]">{money(choices.reduce((s,c)=>s+c.offer.directTotal,0),language)}</strong></div><div className="space-y-2">{choices.map(c=><div key={c.group} className="flex items-center gap-3 rounded-2xl bg-[#f5f1eb] p-2.5"><div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl"><Image src={c.offer.image} alt={c.offer.name} fill sizes="80px" className="object-cover"/></div><div className="min-w-0 flex-1"><div className="truncate font-bold">{c.offer.name}</div><div className="text-xs text-[#746b60]">{c.offer.category} · {c.offer.floor}</div><div className="mt-1 text-xs font-semibold text-[#625b52]">📅 {checkin} → {checkout} · 👥 {copy.guestLabel(c.guests)}</div></div><strong className="text-sm text-[#5f7448]">{money(c.offer.directTotal,language)}</strong></div>)}</div></section>;
}
