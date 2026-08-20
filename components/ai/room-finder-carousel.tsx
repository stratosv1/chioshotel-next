"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RoomFinderCopy, RoomFinderLanguage } from "./room-finder-copy";
import { splitStayNarrative } from "./room-finder-split-narrative";

export type RoomOffer = {
  roomId:string;
  unitId:string;
  roomNumber:number;
  name:string;
  category:string;
  floor:string;
  maxGuests:number;
  features:string[];
  image:string;
  gallery?:string[];
  detailsUrl?:string;
  nights:number;
  originalTotal:number;
  directTotal:number;
  saving:number;
  breakfastTotalIfAdded?:number;
  recommended?:boolean;
  alternativeCheckin?:string;
  alternativeCheckout?:string;
  alternativeShiftDays?:number;
  recoveryType?:"consolidated"|"split";
  recoveryRoomCount?:number;
  recoverySummary?:string;
};

const SELECTING_LABEL: Record<RoomFinderLanguage,string> = {
  el:"Επιλέγεται…",
  en:"Selecting…",
  de:"Wird ausgewählt…",
  fr:"Sélection…",
  it:"Selezione…",
  es:"Seleccionando…",
  tr:"Seçiliyor…",
};

const PREVIOUS_LABEL: Record<RoomFinderLanguage,string> = {
  el:"Προηγούμενο δωμάτιο",
  en:"Previous room",
  de:"Vorheriges Zimmer",
  fr:"Chambre précédente",
  it:"Camera precedente",
  es:"Habitación anterior",
  tr:"Önceki oda",
};

const NEXT_LABEL: Record<RoomFinderLanguage,string> = {
  el:"Επόμενο δωμάτιο",
  en:"Next room",
  de:"Nächstes Zimmer",
  fr:"Chambre suivante",
  it:"Camera successiva",
  es:"Habitación siguiente",
  tr:"Sonraki oda",
};

const RECOMMENDED_LABEL: Record<RoomFinderLanguage,string> = {
  el:"Προτεινόμενο για εσάς",
  en:"Recommended for you",
  de:"Für Sie empfohlen",
  fr:"Recommandé pour vous",
  it:"Consigliato per voi",
  es:"Recomendado para ustedes",
  tr:"Size önerilen",
};

const ALTERNATIVE_LABEL: Record<RoomFinderLanguage,string> = {
  el:"Κοντινές διαθέσιμες ημερομηνίες",
  en:"Nearby available dates",
  de:"Nahe verfügbare Reisedaten",
  fr:"Dates disponibles proches",
  it:"Date disponibili vicine",
  es:"Fechas disponibles cercanas",
  tr:"Yakın müsait tarihler",
};

const SPLIT_SOLUTION_LABEL: Record<RoomFinderLanguage,string> = {
  el:"Λύση με 1 αλλαγή",
  en:"Solution with 1 change",
  de:"Lösung mit 1 Wechsel",
  fr:"Solution avec 1 changement",
  it:"Soluzione con 1 cambio",
  es:"Solución con 1 cambio",
  tr:"1 değişiklikli çözüm",
};

const ROOMS_IN_SOLUTION_LABEL: Record<RoomFinderLanguage,string> = {
  el:"Δωμάτια της λύσης",
  en:"Rooms in this solution",
  de:"Zimmer in dieser Lösung",
  fr:"Chambres de cette solution",
  it:"Camere della soluzione",
  es:"Habitaciones de la solución",
  tr:"Bu çözümdeki odalar",
};

const SELECT_SOLUTION_LABEL: Record<RoomFinderLanguage,string> = {
  el:"Επιλογή λύσης",
  en:"Choose solution",
  de:"Lösung wählen",
  fr:"Choisir la solution",
  it:"Scegli soluzione",
  es:"Elegir solución",
  tr:"Çözümü seç",
};

function shortDate(value:string,language:RoomFinderLanguage) {
  const locale = { el:"el-GR", en:"en-GB", de:"de-DE", fr:"fr-FR", it:"it-IT", es:"es-ES", tr:"tr-TR" }[language];
  const [year,month,day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat(locale,{ day:"2-digit", month:"short", timeZone:"UTC" })
    .format(new Date(Date.UTC(year,month-1,day)));
}

export function splitRoomVisuals(offer:RoomOffer) {
  if (offer.recoveryType !== "split") return [] as Array<{name:string;image:string}>;

  const names = offer.name
    .split(/[→+]/)
    .map(value => value.trim())
    .filter(Boolean);
  const uniqueNames = [...new Set(names)];
  const images = (offer.gallery || []).filter(Boolean);

  return uniqueNames.map((name,index) => ({
    name,
    image: images[index] || offer.image,
  }));
}

export function RoomCarousel({ offers, copy, language, money, onDetails, onSelect, selectingOfferKey }:{ offers:RoomOffer[]; copy:RoomFinderCopy; language:RoomFinderLanguage; money:(v:number,l:RoomFinderLanguage)=>string; onDetails:(offer:RoomOffer)=>void; onSelect:(offer:RoomOffer)=>void; selectingOfferKey?:string|null }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft,setCanScrollLeft] = useState(false);
  const [canScrollRight,setCanScrollRight] = useState(offers.length > 1);

  const updateNavigation = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setCanScrollLeft(scroller.scrollLeft > 8);
    setCanScrollRight(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 8);
  },[]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const frame = window.requestAnimationFrame(updateNavigation);
    scroller.addEventListener("scroll",updateNavigation,{ passive:true });
    window.addEventListener("resize",updateNavigation);
    return () => {
      window.cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll",updateNavigation);
      window.removeEventListener("resize",updateNavigation);
    };
  },[offers.length,updateNavigation]);

  const move = (direction:-1|1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>("[data-room-card]");
    const distance = card ? card.offsetWidth + 12 : scroller.clientWidth * 0.75;
    scroller.scrollBy({ left:direction*distance, behavior:"smooth" });
  };

  return <section className="msg relative -mx-3 sm:mx-0 sm:ml-10">
    <div ref={scrollerRef} className="hide-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 sm:px-10">
      {offers.map((offer,index) => {
        const key=`${offer.roomId}:${offer.unitId}:${offer.alternativeCheckin||""}`;
        const pending=selectingOfferKey===key;
        const splitVisuals=splitRoomVisuals(offer);
        const isSplit=splitVisuals.length>1;
        const narrative=isSplit?splitStayNarrative(offer,language):null;
        return <article data-room-card key={key} className="min-w-[92%] snap-center overflow-hidden rounded-[24px] border border-[#dcd2c5] bg-white shadow-[0_14px_38px_rgba(70,55,35,.10)] sm:min-w-[68%]">
          <div className="relative h-44 sm:h-56">
            {isSplit ? <div className="grid h-full w-full" style={{gridTemplateColumns:`repeat(${Math.min(splitVisuals.length,3)},minmax(0,1fr))`}}>
              {splitVisuals.slice(0,3).map((roomVisual,visualIndex) => <div key={`${roomVisual.name}:${visualIndex}`} className="relative min-w-0 overflow-hidden border-r border-white/70 last:border-r-0">
                <Image src={roomVisual.image} alt={roomVisual.name} fill sizes="46vw" className="object-cover"/>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-2 pb-2.5 pt-8">
                  <div className="truncate text-[11px] font-black text-white sm:text-xs">{roomVisual.name}</div>
                </div>
              </div>)}
            </div> : <Image src={offer.image} alt={offer.name} fill sizes="92vw" className="object-cover"/>}
            {offer.recommended && <span className="absolute left-3 top-3 z-10 rounded-full bg-[#66714f]/95 px-3 py-1.5 text-[11px] font-black text-white shadow-sm">★ {RECOMMENDED_LABEL[language]}</span>}
            <span className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold">{index+1}/{offers.length}</span>
          </div>
          <div className="p-3.5">
            {offer.alternativeCheckin && offer.alternativeCheckout && <div className="mb-3 rounded-2xl border border-[#e1d3bd] bg-[#fbf4e8] px-3 py-2 text-xs font-bold text-[#765d3b]">
              {ALTERNATIVE_LABEL[language]} · {shortDate(offer.alternativeCheckin,language)}–{shortDate(offer.alternativeCheckout,language)}
            </div>}
            <div className="flex justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-[1.35rem] font-bold">{isSplit?SPLIT_SOLUTION_LABEL[language]:offer.name}</h2>
                {isSplit && <p className="mt-1 text-sm font-semibold leading-5 text-[#514a42]">{splitVisuals.map(room => room.name).join(" + ")}</p>}
                {isSplit ? narrative && <p className="mt-2 text-sm leading-5 text-[#746b60]">{narrative}</p> : <p className="mt-1 text-sm text-[#746b60]">{offer.category} · {offer.floor}</p>}
              </div>
              <div className="shrink-0 text-right">{offer.originalTotal > offer.directTotal && <p className="text-xs text-[#b05252] line-through">{money(offer.originalTotal,language)}</p>}<p className="text-xl font-black text-[#5f7448]">{money(offer.directTotal,language)}</p></div>
            </div>
            {isSplit ? <div className="mt-3">
              <div className="mb-2 text-[11px] font-black uppercase tracking-[.08em] text-[#8a7f72]">{ROOMS_IN_SOLUTION_LABEL[language]}</div>
              <div className="grid grid-cols-2 gap-2">
                {splitVisuals.map((roomVisual,visualIndex) => <div key={`${roomVisual.name}:mini:${visualIndex}`} className="flex min-w-0 items-center gap-2 rounded-2xl border border-[#e7ded2] bg-[#faf7f2] p-2">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <Image src={roomVisual.image} alt={roomVisual.name} fill sizes="48px" className="object-cover"/>
                  </div>
                  <div className="min-w-0 text-xs font-black leading-4 text-[#514a42]">{roomVisual.name}</div>
                </div>)}
              </div>
              <div className="mt-2 space-y-1.5">{(offer.features||[]).slice(0,2).map((feature) => <div key={feature} className="rounded-2xl bg-[#f1ede7] px-3 py-2 text-[11px] font-semibold leading-4 text-[#514a42]">{feature}</div>)}</div>
            </div> : <div className="mt-2 flex flex-wrap gap-1.5">{(offer.features||[]).slice(0,4).map((feature) => <span key={feature} className="rounded-full bg-[#f1ede7] px-2.5 py-1 text-[11px] font-semibold">{feature}</span>)}</div>}
            {offer.saving > 0 && <p className="mt-3 text-sm font-bold text-[#5f7448]">{copy.saving}: {money(offer.saving,language)}</p>}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => onDetails(offer)} className="min-h-11 rounded-2xl border border-[#d8cec1] font-bold">{copy.details}</button>
              <button onClick={() => onSelect(offer)} disabled={Boolean(selectingOfferKey)} aria-busy={pending} className="min-h-11 rounded-2xl bg-[#66714f] px-2 font-bold text-white transition disabled:cursor-wait disabled:opacity-70">{pending?`✓ ${SELECTING_LABEL[language]}`:(isSplit?SELECT_SOLUTION_LABEL[language]:copy.select)}</button>
            </div>
          </div>
        </article>;
      })}
    </div>
    {offers.length > 1 && <>
      <button type="button" aria-label={PREVIOUS_LABEL[language]} onClick={() => move(-1)} disabled={!canScrollLeft} className="absolute left-3 top-[35%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8cec1] bg-white/95 text-2xl font-semibold leading-none text-[#4f473d] shadow-lg backdrop-blur transition hover:scale-105 disabled:cursor-default disabled:opacity-45 sm:left-12 sm:h-12 sm:w-12 sm:text-3xl">‹</button>
      <button type="button" aria-label={NEXT_LABEL[language]} onClick={() => move(1)} disabled={!canScrollRight} className="absolute right-3 top-[35%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8cec1] bg-white/95 text-2xl font-semibold leading-none text-[#4f473d] shadow-lg backdrop-blur transition hover:scale-105 disabled:cursor-default disabled:opacity-45 sm:right-12 sm:h-12 sm:w-12 sm:text-3xl">›</button>
    </>}
  </section>;
}
