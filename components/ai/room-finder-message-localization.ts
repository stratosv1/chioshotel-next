import {
  ROOM_FINDER_COPY,
  ROOM_FINDER_LANGUAGES,
  type RoomFinderLanguage,
} from "./room-finder-copy";
import { ROOM_FINDER_TONE } from "./room-finder-tone";

export type RelocalizableRoomFinderMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  [key: string]: unknown;
};

function promptTranslations(from: RoomFinderLanguage, to: RoomFinderLanguage) {
  const fromCopy = ROOM_FINDER_COPY[from];
  const toCopy = ROOM_FINDER_COPY[to];
  const fromTone = ROOM_FINDER_TONE[from];
  const toTone = ROOM_FINDER_TONE[to];
  const translations = new Map<string, string>([
    [fromCopy.welcome, toCopy.welcome],
    [fromTone.checkout, toTone.checkout],
    [fromTone.rooms, toTone.rooms],
    [fromTone.searching, toTone.searching],
    [fromTone.finalizing, toTone.finalizing],
    [fromTone.invalidDate, toTone.invalidDate],
    [fromTone.invalidCheckout, toTone.invalidCheckout],
    [fromTone.unavailable, toTone.unavailable],
  ]);

  for (let room = 1; room <= 3; room += 1) {
    translations.set(fromTone.guests(room), toTone.guests(room));
  }
  for (let group = 1; group <= 3; group += 1) {
    for (let guests = 1; guests <= 5; guests += 1) {
      translations.set(fromTone.results(group, guests), toTone.results(group, guests));
    }
  }

  return translations;
}

export function relocalizeRoomFinderMessages<T extends RelocalizableRoomFinderMessage>(
  messages: T[],
  from: RoomFinderLanguage,
  to: RoomFinderLanguage,
): T[] {
  if (from === to) return messages;
  const translations = promptTranslations(from, to);
  return messages.map(message => {
    if (message.role !== "assistant") return message;
    const translated = translations.get(message.content);
    return translated ? { ...message, content: translated } : message;
  });
}

export function relocalizeRoomFinderMessageToLanguage<T extends RelocalizableRoomFinderMessage>(
  message: T,
  to: RoomFinderLanguage,
): T {
  if (message.role !== "assistant") return message;
  for (const [from] of ROOM_FINDER_LANGUAGES) {
    const translated = promptTranslations(from, to).get(message.content);
    if (translated) return translated === message.content ? message : { ...message, content: translated };
  }
  return message;
}
