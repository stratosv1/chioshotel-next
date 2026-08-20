"use client";

import Image from "next/image";
import type { RoomFinderCopy, RoomFinderLanguage } from "./room-finder-copy";
import { splitRoomVisuals, type RoomOffer } from "./room-finder-carousel";
import { stayRange } from "./room-finder-format";

export type RoomChoice = {
  group: number;
  guests: number;
  offer: RoomOffer;
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

export function SelectedRoomCard({
  choices,
  copy,
  language,
  checkin,
  checkout,
  money,
}: {
  choices: RoomChoice[];
  copy: RoomFinderCopy;
  language: RoomFinderLanguage;
  checkin: string;
  checkout: string;
  money: (value: number, language: RoomFinderLanguage) => string;
}) {
  const stay = stayRange(checkin, checkout, language);
  const total = choices.reduce((sum, choice) => sum + choice.offer.directTotal, 0);

  return (
    <section className="msg ml-10 overflow-hidden rounded-[22px] border border-[#d9cfc2] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#eee6dc] px-4 py-3.5">
        <div className="font-black text-[#5f7448]">
          <span aria-hidden="true">❤️</span> {copy.selected}
        </div>
        <strong className="text-lg text-[#5f7448]">{money(total, language)}</strong>
      </div>
      <div className="divide-y divide-[#eee6dc]">
        {choices.map(choice => {
          const splitVisuals = splitRoomVisuals(choice.offer);
          const isSplit = splitVisuals.length > 1;
          return (
            <div key={choice.group} className="flex gap-3 px-4 py-4">
              <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#f1ede7]">
                {isSplit ? (
                  <div className="grid h-full w-full grid-cols-2">
                    {splitVisuals.slice(0,2).map((roomVisual,index) => (
                      <div key={`${roomVisual.name}:${index}`} className="relative overflow-hidden border-r border-white/70 last:border-r-0">
                        <Image src={roomVisual.image} alt={roomVisual.name} fill sizes="56px" className="object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/55 px-1 py-1 text-center text-[8px] font-black leading-3 text-white">
                          {roomVisual.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Image src={choice.offer.image} alt={choice.offer.name} fill sizes="112px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[17px] font-black leading-5">
                      {isSplit ? SPLIT_SOLUTION_LABEL[language] : choice.offer.name}
                    </div>
                    {isSplit && (
                      <div className="mt-1 text-[12px] font-semibold leading-4 text-[#514a42]">
                        {splitVisuals.map(room => room.name).join(" + ")}
                      </div>
                    )}
                  </div>
                  {choices.length > 1 && (
                    <strong className="shrink-0 text-sm text-[#5f7448]">
                      {money(choice.offer.directTotal, language)}
                    </strong>
                  )}
                </div>
                <div className="mt-1.5 text-[13px] leading-5 text-[#746b60]">
                  {choice.offer.category} · {choice.offer.floor}
                </div>
                <div className="mt-2 text-[13px] font-semibold leading-5 text-[#625b52]">{stay}</div>
                <div className="mt-0.5 text-[13px] font-semibold text-[#625b52]">
                  {copy.guestLabel(choice.guests)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}