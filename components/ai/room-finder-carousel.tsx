"use client";

import Image from "next/image";
import { Info } from "lucide-react";
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

const PER_NIGHT_LABEL: Record<RoomFinderLanguage,string> = {
  el:"/βράδυ",
  en:"/night",
  de:"/Nacht",
  fr:"/nuit",
  it:"/notte",
  es:"/noche",
  tr:"/gece",
};

function discountPercent(offer:RoomOffer) {
  if (!(offer.originalTotal > offer.directTotal) || offer.originalTotal <= 0) return 0;
  return Math.round((1 - offer.directTotal / offer.originalTotal) * 100);
}

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

export function RoomCarousel({ offers, copy, language, money, onDetails, onSelect, selectingOfferKey, selectionRoom }:{ offers:RoomOffer[]; copy:RoomFinderCopy; language:RoomFinderLanguage; money:(v:number,l:RoomFinderLanguage)=>string; onDetails:(offer:RoomOffer)=>void; onSelect:(offer:RoomOffer)=>void; selectingOfferKey?:string|null; selectionRoom?:number }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const autoSelectedOfferRef = useRef<string|null>(null);
  const [canScrollLeft,setCanScrollLeft] = useState(false);
  const [canScrollRight,setCanScrollRight] = useState(offers.length > 1);
  const [staffRequestedUnavailable,setStaffRequestedUnavailable] = useState<number|null>(null);

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

  useEffect(() => {
    if (typeof document === "undefined" || offers.length === 0) return;
    const match = document.cookie.match(/(?:^|;\s*)staff_requested_room=(10|[1-9])(?:;|$)/);
    if (!match) return;

    const requestedRoom = Number(match[1]);
    const signature = `${requestedRoom}:${offers.map((offer) => `${offer.roomId}:${offer.unitId}:${offer.roomNumber}`).join("|")}`;
    if (autoSelectedOfferRef.current === signature) return;
    autoSelectedOfferRef.current = signature;

    document.cookie = "staff_requested_room=; Max-Age=0; Path=/staff; SameSite=Strict";
    const requestedOffer = offers.find((offer) => offer.roomNumber === requestedRoom && offer.recoveryType !== "split");
    if (!requestedOffer) {
      setStaffRequestedUnavailable(requestedRoom);
      return;
    }

    setStaffRequestedUnavailable(null);
    onSelect(requestedOffer);
  },[offers,onSelect]);

  const move = (direction:-1|1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>("[data-room-card]");
    const distance = card ? card.offsetWidth + 12 : scroller.clientWidth * 0.75;
    scroller.scrollBy({ left:direction*distance, behavior:"smooth" });
  };

  // Compact, chat-aligned cards: about three quarters of the chat column wide
  // so the next option peeks in (no arrows needed on phones), image on top,
  // what the guest compares (room type, price per night, total) up front.
  return <section className="msg relative -mr-3.5 ml-10 sm:mr-0">
    {staffRequestedUnavailable && <div className="mb-3 mr-3.5 rounded-2xl border border-[#e3cda9] bg-[#fff8ea] px-4 py-3 text-sm font-semibold text-[#765d3b] sm:mr-0">Το Δωμάτιο {staffRequestedUnavailable} που ζήτησες δεν είναι διαθέσιμο για όλη τη διαμονή. Παρακάτω είναι οι διαθέσιμες επιλογές.</div>}
    <div ref={scrollerRef} className="-mb-4 -mt-2 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-6 pr-3.5 pt-2 [scrollbar-width:none] sm:pr-0 [&::-webkit-scrollbar]:hidden">
      {offers.map((offer) => {
        const key=`${offer.roomId}:${offer.unitId}:${offer.alternativeCheckin||""}`;
        const pending=selectingOfferKey===key;
        const splitVisuals=splitRoomVisuals(offer);
        const isSplit=splitVisuals.length>1;
        const narrative=isSplit?splitStayNarrative(offer,language):null;
        const nights=Math.max(1,Number(offer.nights)||1);
        const perNight=offer.directTotal/nights;
        const discount=discountPercent(offer);
        const title=isSplit?SPLIT_SOLUTION_LABEL[language]:offer.category||offer.name;
        const subtitle=isSplit?splitVisuals.map(room => room.name).join(" + "):[offer.name,offer.floor].filter(Boolean).join(" · ");
        const highlights=(offer.features||[]).slice(0,2).join(" · ");
        const selectLabel=pending ? SELECTING_LABEL[language] : isSplit ? SELECT_SOLUTION_LABEL[language] : selectionRoom ? copy.selectForRoom(selectionRoom) : copy.select;
        return <article data-room-card key={key} className="flex w-[78%] max-w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border border-[#e1d8cc] bg-white shadow-[0_8px_24px_rgba(70,55,35,.08)] sm:w-[280px]">
          <button type="button" onClick={() => onDetails(offer)} aria-label={`${copy.details}: ${title}`} className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#efe8de] text-left">
            {isSplit ? <div className="grid h-full w-full" style={{gridTemplateColumns:`repeat(${Math.min(splitVisuals.length,3)},minmax(0,1fr))`}}>
              {splitVisuals.slice(0,3).map((roomVisual,visualIndex) => <div key={`${roomVisual.name}:${visualIndex}`} className="relative min-w-0 overflow-hidden border-r border-white/70 last:border-r-0">
                <Image src={roomVisual.image} alt="" fill sizes="(min-width: 640px) 140px, 38vw" className="object-cover"/>
              </div>)}
            </div> : <Image src={offer.image} alt="" fill sizes="(min-width: 640px) 280px, 75vw" className="object-cover"/>}
            {offer.recommended && <span className="absolute left-2.5 top-2.5 rounded-full bg-[#66714f]/95 px-2.5 py-1 text-[11px] font-black text-white shadow-sm">★ {RECOMMENDED_LABEL[language]}</span>}
            {discount > 0 && <span className="absolute right-2.5 top-2.5 rounded-full bg-[#c66a34] px-2 py-1 text-[12px] font-black leading-none text-white shadow-sm [font-variant-numeric:tabular-nums]">−{discount}%</span>}
          </button>
          <div className="flex flex-1 flex-col p-3">
            {offer.alternativeCheckin && offer.alternativeCheckout && <p className="mb-2 w-fit rounded-full bg-[#fbf4e8] px-2.5 py-1 text-[11px] font-bold text-[#765d3b]">
              {ALTERNATIVE_LABEL[language]} · {shortDate(offer.alternativeCheckin,language)}–{shortDate(offer.alternativeCheckout,language)}
            </p>}
            <h2 className="line-clamp-2 text-[16px] font-black leading-snug text-[#29251f]">{title}</h2>
            <p className="mt-0.5 line-clamp-2 text-[13px] leading-[18px] text-[#746b60]">{subtitle}</p>
            {isSplit ? narrative && <p className="mt-1.5 line-clamp-2 text-[13px] leading-[18px] text-[#625b52]">{narrative}</p> : highlights && <p className="mt-1.5 line-clamp-1 text-[13px] leading-[18px] text-[#625b52]">{highlights}</p>}
            <div className="mt-auto pt-3">
              <p className="flex items-baseline gap-1 [font-variant-numeric:tabular-nums]">
                <span className="text-[19px] font-black text-[#5f7448]">{money(perNight,language)}</span>
                <span className="text-[13px] font-semibold text-[#746b60]">{PER_NIGHT_LABEL[language]}</span>
              </p>
              <p className="mt-0.5 text-[12px] leading-4 text-[#746b60] [font-variant-numeric:tabular-nums]">
                {discount > 0 && <s className="mr-1 text-[#a59a8d]">{money(offer.originalTotal,language)}</s>}
                <b className="font-bold text-[#514a42]">{money(offer.directTotal,language)}</b> · {copy.nightLabel(nights)}
              </p>
              <div className="mt-2.5 flex gap-2">
                <button type="button" onClick={() => onDetails(offer)} aria-label={`${copy.details}: ${title}`} title={copy.details} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d8cec1] text-[#514a42] transition hover:bg-[#fbf8f3] active:scale-[.97]"><Info className="h-5 w-5" aria-hidden="true" /></button>
                <button
                  type="button"
                  onClick={() => onSelect(offer)}
                  disabled={Boolean(selectingOfferKey)}
                  aria-busy={pending}
                  aria-label={selectLabel}
                  className="min-h-11 min-w-0 flex-1 rounded-full bg-[#66714f] px-3 text-[14px] font-bold leading-tight text-white transition hover:bg-[#5a6446] active:scale-[.97] disabled:cursor-wait disabled:opacity-70"
                >
                  {pending ? `✓ ${selectLabel}` : selectLabel}
                </button>
              </div>
            </div>
          </div>
        </article>;
      })}
    </div>
    {offers.length > 1 && <>
      <button type="button" aria-label={PREVIOUS_LABEL[language]} onClick={() => move(-1)} disabled={!canScrollLeft} className="absolute -left-5 top-[88px] z-20 hidden h-10 w-10 items-center justify-center rounded-full border border-[#d8cec1] bg-white text-2xl font-semibold leading-none text-[#4f473d] shadow-md transition hover:scale-105 disabled:pointer-events-none disabled:opacity-0 sm:flex">‹</button>
      <button type="button" aria-label={NEXT_LABEL[language]} onClick={() => move(1)} disabled={!canScrollRight} className="absolute -right-5 top-[88px] z-20 hidden h-10 w-10 items-center justify-center rounded-full border border-[#d8cec1] bg-white text-2xl font-semibold leading-none text-[#4f473d] shadow-md transition hover:scale-105 disabled:pointer-events-none disabled:opacity-0 sm:flex">›</button>
    </>}
  </section>;
}
