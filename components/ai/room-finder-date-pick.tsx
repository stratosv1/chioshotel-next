"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RoomFinderLanguage } from "./room-finder-copy";

/**
 * Ref 5: a calendar button under the check-in / check-out question, so on a
 * phone the guest can pick the date instead of typing it. The picked date
 * goes through the same booking flow as a typed date (past dates, long stays
 * and the next question are handled there).
 *
 * The calendar is our own small month grid, not the browser’s native
 * date input. The native picker sent dates the guest never chose:
 * desktop Chrome moved (and committed) the value on the next-month arrow, and
 * on Android pressing "Set" after only changing the month sent today's date
 * (real guest, 22/11/2026: two arrivals of "today" before typing 29.08.2027).
 * Here the month arrows only change the view; a date is sent only when the
 * guest taps a day, and days before `min` cannot be tapped.
 */

const LABELS: Record<RoomFinderLanguage, { checkin: string; checkout: string; prev: string; next: string; arrival: string }> = {
  el: { checkin: "Επιλογή ημερομηνίας άφιξης", checkout: "Επιλογή ημερομηνίας αναχώρησης", prev: "Προηγούμενος μήνας", next: "Επόμενος μήνας", arrival: "Άφιξη" },
  en: { checkin: "Pick arrival date", checkout: "Pick departure date", prev: "Previous month", next: "Next month", arrival: "Arrival" },
  de: { checkin: "Anreisedatum wählen", checkout: "Abreisedatum wählen", prev: "Vorheriger Monat", next: "Nächster Monat", arrival: "Anreise" },
  fr: { checkin: "Choisir la date d’arrivée", checkout: "Choisir la date de départ", prev: "Mois précédent", next: "Mois suivant", arrival: "Arrivée" },
  it: { checkin: "Scegli la data di arrivo", checkout: "Scegli la data di partenza", prev: "Mese precedente", next: "Mese successivo", arrival: "Arrivo" },
  es: { checkin: "Elegir fecha de llegada", checkout: "Elegir fecha de salida", prev: "Mes anterior", next: "Mes siguiente", arrival: "Llegada" },
  tr: { checkin: "Varış tarihini seç", checkout: "Çıkış tarihini seç", prev: "Önceki ay", next: "Sonraki ay", arrival: "Varış" },
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

/** How far ahead the calendar can go, in months after the earliest date. */
const MONTHS_AHEAD = 24;

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

type MonthKey = { year: number; month: number }; // month: 0–11

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function isoOf(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function monthOfIso(iso: string): MonthKey | null {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(iso || "");
  return match ? { year: Number(match[1]), month: Number(match[2]) - 1 } : null;
}

function shiftMonth(key: MonthKey, by: number): MonthKey {
  const total = key.year * 12 + key.month + by;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

function monthIndex(key: MonthKey) {
  return key.year * 12 + key.month;
}

/** The days of one month as a Monday-first grid; null cells are padding. */
export function monthGrid(key: MonthKey): (string | null)[] {
  const first = new Date(Date.UTC(key.year, key.month, 1));
  const daysInMonth = new Date(Date.UTC(key.year, key.month + 1, 0)).getUTCDate();
  const leading = (first.getUTCDay() + 6) % 7; // Monday = 0
  const cells: (string | null)[] = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(isoOf(key.year, key.month, day));
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function DatePickReply({
  field,
  language,
  min,
  checkin,
  onPick,
}: {
  field: "checkin" | "checkout";
  language: RoomFinderLanguage;
  /** Earliest selectable date (YYYY-MM-DD). */
  min: string;
  /** The chosen arrival, marked on the departure calendar. */
  checkin?: string;
  onPick: (iso: string) => void;
}) {
  const labels = LABELS[language] || LABELS.en;
  const locale = LOCALES[language] || LOCALES.en;
  const label = labels[field];
  const firstMonth = useMemo<MonthKey>(() => {
    const fromMin = monthOfIso(min);
    if (fromMin) return fromMin;
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [min]);
  const lastMonth = useMemo(() => shiftMonth(firstMonth, MONTHS_AHEAD), [firstMonth]);
  const maxIso = useMemo(() => {
    const end = new Date(Date.UTC(lastMonth.year, lastMonth.month + 1, 0));
    return isoOf(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  }, [lastMonth]);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<MonthKey>(firstMonth);
  const committed = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // A new question (or a new earliest date) starts again from its first month.
  useEffect(() => {
    setView(firstMonth);
    committed.current = false;
  }, [firstMonth, field]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open]);

  const monthTitle = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(view.year, view.month, 15)));
  const weekdays = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
    // 2024-01-01 was a Monday.
    return Array.from({ length: 7 }, (_, index) => format.format(new Date(Date.UTC(2024, 0, 1 + index))));
  }, [locale]);
  const cells = monthGrid(view);
  const canGoPrev = monthIndex(view) > monthIndex(firstMonth);
  const canGoNext = monthIndex(view) < monthIndex(lastMonth);

  function pick(iso: string) {
    if (committed.current || iso < min || iso > maxIso) return;
    committed.current = true;
    setOpen(false);
    onPick(iso);
  }

  return (
    <div className="msg ml-10" data-room-finder-date-pick={field}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
        className="flex min-h-12 items-center gap-2 rounded-2xl border border-[#d8cec1] bg-white px-4 text-[15px] font-bold text-[#4a4339] shadow-[0_4px_14px_rgba(70,55,35,.06)] transition hover:border-[#bda991] hover:bg-[#fffaf4] active:scale-[.97]"
      >
        <span aria-hidden="true">📅</span>
        {label}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="group"
          aria-label={label}
          className="mt-2 w-full max-w-[340px] scroll-mb-28 rounded-2xl border border-[#e0d5c7] bg-white p-3 shadow-[0_8px_24px_rgba(70,55,35,.08)]"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label={labels.prev}
              disabled={!canGoPrev}
              onClick={() => setView(current => shiftMonth(current, -1))}
              className="flex h-11 w-11 items-center justify-center rounded-full text-xl font-bold text-[#4a4339] transition hover:bg-[#f6efe6] disabled:opacity-25 disabled:hover:bg-transparent"
            >
              ‹
            </button>
            <span aria-live="polite" className="text-[15px] font-black capitalize text-[#3f382f]">{monthTitle}</span>
            <button
              type="button"
              aria-label={labels.next}
              disabled={!canGoNext}
              onClick={() => setView(current => shiftMonth(current, 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full text-xl font-bold text-[#4a4339] transition hover:bg-[#f6efe6] disabled:opacity-25 disabled:hover:bg-transparent"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center" aria-hidden="true">
            {weekdays.map((day, index) => (
              <span key={index} className="py-1 text-[11px] font-bold uppercase text-[#9a8f82]">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((iso, index) => {
              if (!iso) return <span key={`pad-${index}`} />;
              const disabled = iso < min || iso > maxIso;
              const isArrival = field === "checkout" && iso === checkin;
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  aria-label={isArrival ? `${formatPickedDate(language, iso)} · ${labels.arrival}` : formatPickedDate(language, iso)}
                  onClick={() => pick(iso)}
                  className={`flex h-10 items-center justify-center rounded-xl text-[15px] font-semibold transition ${
                    isArrival
                      ? "bg-[#c9822f] text-white"
                      : disabled
                        ? "cursor-default text-[#cfc6ba]"
                        : "text-[#3f382f] hover:bg-[#fff0e4] active:scale-95 active:bg-[#c9822f] active:text-white"
                  }`}
                >
                  {Number(iso.slice(8, 10))}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
