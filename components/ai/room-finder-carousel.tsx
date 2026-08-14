"use client";

import Image from "next/image";
import type { RoomFinderCopy, RoomFinderLanguage } from "./room-finder-copy";

export type RoomOffer = { roomId:string; unitId:string; roomNumber:number; name:string; category:string; floor:string; maxGuests:number; features:string[]; image:string; gallery?:string[]; detailsUrl?:string; nights:number; originalTotal:number; directTotal:number; saving:number };

const SELECTING_LABEL: Record<RoomFinderLanguage,string> = {
  el:"Επιλέγεται…",
  en:"Selecting…",
  de:"Wird ausgewählt…",
  fr:"Sélection…",
  it:"Selezione…",
  es:"Seleccionando…",
  tr:"Seçiliyor…",
};

export function RoomCarousel({ offers, copy, language, money, onDetails, onSelect, selectingOfferKey }:{ offers:RoomOffer[]; copy:RoomFinderCopy; language:RoomFinderLanguage; money:(v:number,l:RoomFinderLanguage)=>string; onDetails:(offer:RoomOffer)=>void; onSelect:(offer:RoomOffer)=>void; selectingOfferKey?:string|null }) {
  return <section className="msg relative -mx-3 sm:mx-0 sm:ml-10"><div className="hide-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 sm:px-10">{offers.map((offer,index) => {const key=`${offer.roomId}:${offer.unitId}`;const pending=selectingOfferKey===key;return <article key={key} className="min-w-[88%] snap-center overflow-hidden rounded-[24px] border border-[#dcd2c5] bg-white shadow-[0_14px_38px_rgba(70,55,35,.10)] sm:min-w-[68%]"><div className="relative h-44 sm:h-56"><Image src={offer.image} alt={offer.name} fill sizes="88vw" className="object-cover"/><span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold">{index+1}/{offers.length}</span></div><div className="p-3.5"><div className="flex justify-between gap-3"><div><h2 className="text-[1.35rem] font-bold">{offer.name}</h2><p className="text-sm text-[#746b60]">{offer.category} · {offer.floor}</p></div><div className="text-right">{offer.originalTotal > offer.directTotal && <p className="text-xs text-[#b05252] line-through">{money(offer.originalTotal,language)}</p>}<p className="text-xl font-black text-[#5f7448]">{money(offer.directTotal,language)}</p></div></div><div className="mt-2 flex flex-wrap gap-1.5">{(offer.features||[]).slice(0,4).map((feature) => <span key={feature} className="rounded-full bg-[#f1ede7] px-2.5 py-1 text-[11px] font-semibold">{feature}</span>)}</div>{offer.saving > 0 && <p className="mt-2 text-sm font-bold text-[#5f7448]">{copy.saving}: {money(offer.saving,language)}</p>}<div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => onDetails(offer)} className="min-h-11 rounded-2xl border border-[#d8cec1] font-bold">{copy.details}</button><button onClick={() => onSelect(offer)} disabled={Boolean(selectingOfferKey)} aria-busy={pending} className="min-h-11 rounded-2xl bg-[#66714f] font-bold text-white transition disabled:cursor-wait disabled:opacity-70">{pending?`✓ ${SELECTING_LABEL[language]}`:copy.select}</button></div></div></article>;})}</div></section>;
}
