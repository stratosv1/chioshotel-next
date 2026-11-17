"use client";

import { useEffect, useRef } from "react";
import type { RoomFinderLanguage } from "./room-finder-copy";

/**
 * Ref 5: a calendar button under the check-in / check-out question, so on a
 * phone the guest can pick the date instead of typing it. It opens the
 * phone's own date picker; the picked date goes through the same booking
 * flow as a typed date (past dates, long stays and the next question are
 * handled there).
 *
 * Only the native "change" event commits the date. Desktop Chrome fires
 * "input" (React's onChange) every time the open calendar moves its
 * highlight, e.g. on the next-month arrow, which used to send a date the
 * guest never chose. "change" fires once the guest actually picks a day.
 */

const LABELS: Record<RoomFinderLanguage, { checkin: string; checkout: string }> = {
  el: { checkin: "Επιλογή ημερομηνίας άφιξης", checkout: "Επιλογή ημερομηνίας αναχώρησης" },
  en: { checkin: "Pick arrival date", checkout: "Pick departure date" },
  de: { checkin: "Anreisedatum wählen", checkout: "Abreisedatum wählen" },
  fr: { checkin: "Choisir la date d’arrivée", checkout: "Choisir la date de départ" },
  it: { checkin: "Scegli la data di arrivo", checkout: "Scegli la data di partenza" },
  es: { checkin: "Elegir fecha de llegada", checkout: "Elegir fecha de salida" },
  tr: { checkin: "Varış tarihini seç", checkout: "Çıkış tarihini seç" },
};

const LOCALES: Record<RoomFinderLanguage, string> = {
  el: "el-GR",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  es: "es-ES",
  tr: "tr-TR",
};

/** "Fri 11 June 2027" in the guest's language, for the guest's chat bubble. */
export function formatPickedDate(language: RoomFinderLanguage, iso: string) {
  const date = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALES[language] || LOCALES.en, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function DatePickReply({
  field,
  language,
  min,
  onPick,
}: {
  field: "checkin" | "checkout";
  language: RoomFinderLanguage;
  /** Earliest selectable date (YYYY-MM-DD). */
  min: string;
  onPick: (iso: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const label = (LABELS[language] || LABELS.en)[field];
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    let committed = false;
    const handleChange = () => {
      const value = input.value;
      if (committed || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < min) return;
      committed = true;
      onPickRef.current(value);
    };
    input.addEventListener("change", handleChange);
    return () => input.removeEventListener("change", handleChange);
  }, [min]);

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      // Older browsers open the picker from the tap on the input itself.
    }
  }

  return (
    <div className="msg ml-10" data-room-finder-date-pick={field}>
      <div className="relative inline-flex">
        <span
          aria-hidden="true"
          className="flex min-h-12 items-center gap-2 rounded-2xl border border-[#d8cec1] bg-white px-4 text-[15px] font-bold text-[#4a4339] shadow-[0_4px_14px_rgba(70,55,35,.06)] transition hover:border-[#bda991] hover:bg-[#fffaf4] active:scale-[.97]"
        >
          <span aria-hidden="true">📅</span>
          {label}
        </span>
        {/* The real date input covers the button: a tap opens the phone's
            native date picker; on desktop the click also calls showPicker(). */}
        <input
          ref={inputRef}
          type="date"
          min={min}
          aria-label={label}
          onClick={openPicker}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}
