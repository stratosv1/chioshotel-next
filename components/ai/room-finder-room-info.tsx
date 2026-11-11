"use client";

import Image from "next/image";
import { roomCatalogForLanguage } from "@/lib/ai-assistant/room-card-catalog";
import type { RoomFinderLanguage } from "./room-finder-copy";
import { roomTypeName, roomTypeOf, roomTypeRooms } from "./room-finder-room-types";

export { detectRoomInfoRequest, type RoomInfoRequest } from "@/lib/ai-assistant/room-info-intent";

/**
 * Questions about one room ("details for room 3", "λεπτομέρειες για το
 * δωμάτιο 5", "room #11 pictures") are answered at any step from the
 * owner-confirmed room catalog, with the room's own photo. Nothing here
 * claims availability.
 */

type RoomInfoCopy = {
  partOf: (typeName: string, rooms: string) => string;
  askDates: (room: string) => string;
  noSuchRoom: (requested: number) => string;
};

const COPY: Record<RoomFinderLanguage, RoomInfoCopy> = {
  el: {
    partOf: (type, rooms) => `Ανήκει στην κατηγορία «${type}» (${rooms}).`,
    askDates: room => `Θέλετε να ελέγξω αν το ${room} είναι διαθέσιμο; Γράψτε μου την ημέρα άφιξης.`,
    noSuchRoom: n => `Δεν υπάρχει δωμάτιο ${n}: το Voulamandis House έχει τα δωμάτια και διαμερίσματα 1 έως 10.`,
  },
  en: {
    partOf: (type, rooms) => `It belongs to the “${type}” type (${rooms}).`,
    askDates: room => `Would you like me to check if ${room} is available? Tell me your arrival day.`,
    noSuchRoom: n => `There is no room ${n}: Voulamandis House has rooms and apartments 1 to 10.`,
  },
  de: {
    partOf: (type, rooms) => `Es gehört zur Kategorie „${type}“ (${rooms}).`,
    askDates: room => `Soll ich prüfen, ob ${room} frei ist? Nennen Sie mir Ihren Anreisetag.`,
    noSuchRoom: n => `Ein Zimmer ${n} gibt es nicht: Das Voulamandis House hat die Zimmer und Apartments 1 bis 10.`,
  },
  fr: {
    partOf: (type, rooms) => `Elle fait partie du type « ${type} » (${rooms}).`,
    askDates: room => `Voulez-vous que je vérifie si ${room} est disponible ? Indiquez-moi votre jour d’arrivée.`,
    noSuchRoom: n => `Il n’y a pas de chambre ${n} : Voulamandis House propose les chambres et appartements 1 à 10.`,
  },
  it: {
    partOf: (type, rooms) => `Fa parte della tipologia «${type}» (${rooms}).`,
    askDates: room => `Volete che verifichi se ${room} è disponibile? Scrivetemi il giorno di arrivo.`,
    noSuchRoom: n => `Non esiste la camera ${n}: Voulamandis House ha camere e appartamenti dall’1 al 10.`,
  },
  es: {
    partOf: (type, rooms) => `Pertenece al tipo «${type}» (${rooms}).`,
    askDates: room => `¿Quieren que compruebe si ${room} está disponible? Díganme el día de llegada.`,
    noSuchRoom: n => `No existe la habitación ${n}: Voulamandis House tiene habitaciones y apartamentos del 1 al 10.`,
  },
  tr: {
    partOf: (type, rooms) => `“${type}” tipine aittir (${rooms}).`,
    askDates: room => `${room} müsait mi kontrol edeyim mi? Bana varış gününüzü yazın.`,
    noSuchRoom: n => `${n} numaralı oda yok: Voulamandis House’ta 1’den 10’a kadar oda ve daireler bulunur.`,
  },
};

export function roomInfoEntry(language: RoomFinderLanguage, roomNumber: number) {
  return roomCatalogForLanguage(language).find(room => room.roomNumber === roomNumber) || null;
}

/** The chat text for one room. `askDates` is left out once dates are known. */
export function roomInfoMessage(language: RoomFinderLanguage, roomNumber: number, askDates: boolean) {
  const copy = COPY[language] || COPY.en;
  const room = roomInfoEntry(language, roomNumber);
  const categoryId = roomTypeOf(roomNumber);
  if (!room || !categoryId) return copy.noSuchRoom(roomNumber);

  return [
    `${room.name} · ${room.category}`,
    room.floor,
    room.features.map(feature => `• ${feature}`).join("\n"),
    copy.partOf(roomTypeName(language, categoryId), roomTypeRooms(categoryId)),
    askDates ? copy.askDates(room.name) : "",
  ].filter(Boolean).join("\n\n");
}

export function noSuchRoomMessage(language: RoomFinderLanguage, roomNumber: number) {
  return (COPY[language] || COPY.en).noSuchRoom(roomNumber);
}

const VIEW_LABEL: Record<RoomFinderLanguage, string> = {
  el: "Δείτε φωτογραφίες",
  en: "See photos",
  de: "Fotos ansehen",
  fr: "Voir les photos",
  it: "Vedi le foto",
  es: "Ver fotos",
  tr: "Fotoğrafları gör",
};

/** The room's own photos with a link to its page. */
export function RoomInfoCard({ language, roomNumber }: { language: RoomFinderLanguage; roomNumber: number }) {
  const room = roomInfoEntry(language, roomNumber);
  if (!room) return null;
  const photos = Array.from(new Set([room.image, ...(room.gallery || [])])).slice(0, 2);

  return (
    <a
      href={room.detailsUrl}
      data-room-finder-room-info={room.roomNumber}
      className="msg ml-10 mt-2.5 block max-w-[340px] overflow-hidden rounded-3xl border border-[#eadfce] bg-white p-2 shadow-[0_1px_2px_rgba(47,38,31,0.06)] transition hover:shadow-[0_10px_30px_rgba(47,38,31,0.12)]"
    >
      <div className="grid grid-cols-2 gap-1.5">
        {photos.map((src, index) => (
          <div key={src} className={`relative overflow-hidden rounded-[16px] bg-[#e8dccb] ${photos.length === 1 ? "col-span-2 h-[190px]" : "h-[150px]"}`}>
            <Image
              src={src}
              alt={`${room.name} · ${room.category}`}
              fill
              sizes="170px"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      <div className="px-1 pb-0.5 pt-2">
        <span className="flex min-h-11 w-full items-center justify-center gap-1 rounded-full bg-[#fbeee0] px-4 text-sm font-semibold text-[#7c2d12]">
          {VIEW_LABEL[language]}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}
