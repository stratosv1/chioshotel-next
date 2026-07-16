"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, TouchEvent } from "react";

type Language = "el" | "en";

type SearchState = {
  checkin?: string;
  checkout?: string;
  guests?: number;
};

export type RoomOfferModalOffer = {
  roomId: string;
  unitId: string;
  name: string;
  category: string;
  floor: string;
  maxGuests: number;
  features: string[];
  image: string;
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
};

type RoomOfferModalProps = {
  offer: RoomOfferModalOffer;
  images: string[];
  language: Language;
  search: SearchState;
  whatsappHref: string;
  onClose: () => void;
  onInterest: () => void;
};

type IconProps = { className?: string };

function CloseIcon({ className = "h-5 w-5" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>;
}

function ChevronLeftIcon({ className = "h-5 w-5" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>;
}

function ChevronRightIcon({ className = "h-5 w-5" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>;
}

function HomeIcon({ className = "h-5 w-5" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></svg>;
}

function UtensilsIcon({ className = "h-5 w-5" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M7 3v8M4 3v5c0 2 1.2 3 3 3s3-1 3-3V3M7 11v10M16 3v18M16 3c3 2 4 5 4 8h-4" /></svg>;
}

function UsersIcon({ className = "h-5 w-5" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}

function InfoIcon({ className = "h-5 w-5" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>;
}

function CalendarIcon({ className = "h-5 w-5" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>;
}

function TagIcon({ className = "h-5 w-5" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M20.6 13.6 11 23l-9-9V4h10l8.6 8.6a1.4 1.4 0 0 1 0 2Z" /><circle cx="7" cy="9" r="1.3" /></svg>;
}

function MailIcon({ className = "h-5 w-5" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
}

function WhatsAppIcon({ className = "h-5 w-5" }: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.55-4.77A8.5 8.5 0 1 1 20.5 11.5Z" /><path d="M8.3 7.8c.2-.45.42-.46.66-.47h.56c.16 0 .42.06.64.55.22.5.75 1.82.82 1.95.07.13.11.29.02.46-.09.18-.13.29-.27.44-.13.16-.28.35-.4.47-.13.13-.27.27-.11.53.16.27.71 1.17 1.53 1.89 1.05.93 1.93 1.22 2.2 1.35.27.13.42.11.58-.07.16-.18.67-.78.85-1.05.18-.27.35-.22.6-.13.24.09 1.55.73 1.82.86.27.13.44.2.51.31.07.11.07.64-.16 1.25-.22.62-1.31 1.18-1.8 1.25-.46.07-1.04.1-1.68-.11-.38-.12-.87-.28-1.5-.55-.26-.11-4.5-1.67-6.15-5.73-.46-1.13-.49-1.96-.34-2.24Z" /></svg>;
}

const COPY = {
  el: {
    close: "Κλείσιμο",
    previous: "Προηγούμενη φωτογραφία",
    next: "Επόμενη φωτογραφία",
    upTo: "έως",
    guests: "άτομα",
    guest: "επισκέπτης",
    guestsSummary: "επισκέπτες",
    night: "νύχτα",
    nights: "νύχτες",
    perNight: "/ βράδυ",
    totalFor: "συνολικά για",
    savePrefix: "Εξοικονομείτε",
    saveSuffix: "με απευθείας κράτηση",
    interested: "Ενδιαφέρομαι για αυτό το δωμάτιο",
    whatsapp: "WhatsApp",
    email: "Email",
    conditionalFifthGuest: "Δυνατότητα φιλοξενίας 5ου ατόμου με πρόσθετο κρεβάτι. Ο διαθέσιμος χώρος θα είναι περιορισμένος.",
  },
  en: {
    close: "Close",
    previous: "Previous photo",
    next: "Next photo",
    upTo: "up to",
    guests: "guests",
    guest: "guest",
    guestsSummary: "guests",
    night: "night",
    nights: "nights",
    perNight: "/ night",
    totalFor: "total for",
    savePrefix: "You save",
    saveSuffix: "with direct booking",
    interested: "I am interested in this room",
    whatsapp: "WhatsApp",
    email: "Email",
    conditionalFifthGuest: "A 5th guest can be accommodated with an extra bed. The available space will be limited.",
  },
} as const;

function parseIsoDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day, 12));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateRange(checkin: string | undefined, checkout: string | undefined, language: Language) {
  const start = parseIsoDate(checkin);
  const end = parseIsoDate(checkout);
  if (!start || !end) return [checkin, checkout].filter(Boolean).join(" – ");

  const locale = language === "el" ? "el-GR" : "en-GB";
  const sameMonth = start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth();
  if (sameMonth) {
    const endLabel = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: "UTC" }).format(end);
    return `${start.getUTCDate()}–${endLabel}`;
  }

  const formatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

function normalizedText(value: string) {
  return value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function localizeRoomName(value: string, language: Language) {
  if (language !== "el") return value;
  return value
    .replace(/^Apartment\s+/i, "Διαμέρισμα ")
    .replace(/^Room\s+/i, "Δωμάτιο ");
}

function localizeCategory(value: string, language: Language) {
  if (language !== "el") return value;
  const normalized = normalizedText(value);
  if (/family apartment/.test(normalized)) return "Οικογενειακό διαμέρισμα";
  if (/apartment/.test(normalized)) return "Διαμέρισμα";
  if (/economy double/.test(normalized)) return "Οικονομικό δίκλινο";
  if (/standard double/.test(normalized)) return "Standard δίκλινο";
  return value;
}

function localizeFeature(value: string, language: Language) {
  if (language !== "el") return value;
  const normalized = normalizedText(value);
  const exact: Array<[RegExp, string]> = [
    [/^full kitchen$/, "Πλήρης κουζίνα"],
    [/^kitchenette$/, "Μικρή κουζίνα"],
    [/^independent$/, "Ανεξάρτητο"],
    [/^independent apartment$/, "Ανεξάρτητο"],
    [/^apartment$/, "Διαμέρισμα"],
    [/^family apartment$/, "Οικογενειακό διαμέρισμα"],
    [/^private balcony$/, "Ιδιωτικό μπαλκόνι"],
    [/^garden access$/, "Πρόσβαση στον κήπο"],
    [/^economy double$/, "Οικονομικό δίκλινο"],
    [/^ground floor$/, "Ισόγειο"],
    [/^no stairs$/, "Χωρίς σκάλες"],
    [/^ground floor · no stairs$/, "Ισόγειο · χωρίς σκάλες"],
    [/^first floor · stairs$/, "1ος όροφος · σκάλες"],
    [/^first floor$/, "1ος όροφος"],
  ];
  for (const [pattern, label] of exact) {
    if (pattern.test(normalized)) return label;
  }
  return value
    .replace(/1 double bed/gi, "1 διπλό κρεβάτι")
    .replace(/2 single beds/gi, "2 μονά κρεβάτια")
    .replace(/1 single bed/gi, "1 μονό κρεβάτι")
    .replace(/sofa bed/gi, "καναπές-κρεβάτι");
}

function featureIcon(value: string) {
  const normalized = normalizedText(value);
  if (/kitchen|κουζιν|κουζινα/.test(normalized)) return <UtensilsIcon />;
  if (/guest|person|ατομ|επισκεπτ/.test(normalized)) return <UsersIcon />;
  return <HomeIcon />;
}

function FeaturePill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-xl border border-[#e8dccb] bg-[#fffdfa] px-2 py-2 text-center text-[11px] font-medium leading-4 text-[#4c4a42] sm:text-xs">
      <span className="shrink-0 text-[#526124]">{icon}</span>
      <span className="min-w-0 break-words">{label}</span>
    </div>
  );
}

export function RoomOfferModal({ offer, images, language, search, whatsappHref, onClose, onInterest }: RoomOfferModalProps) {
  const t = COPY[language];
  const safeImages = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [imageIndex, setImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => setImageIndex(0), [offer.roomId, offer.unitId]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const previousImage = () => setImageIndex((current) => (current - 1 + safeImages.length) % safeImages.length);
  const nextImage = () => setImageIndex((current) => (current + 1) % safeImages.length);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || safeImages.length < 2) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    if (delta > 45) previousImage();
    if (delta < -45) nextImage();
    touchStartX.current = null;
  };

  const nights = Math.max(1, Number(offer.nights || 1));
  const originalNightly = offer.originalTotal / nights;
  const directNightly = offer.directTotal / nights;
  const totalSaving = offer.saving > 0 ? offer.saving : Math.max(0, offer.originalTotal - offer.directTotal);
  const money = (value: number) => new Intl.NumberFormat(language === "el" ? "el-GR" : "en-GB", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  const nightsLabel = `${nights} ${nights === 1 ? t.night : t.nights}`;
  const guests = Number(search.guests || 0);
  const guestsLabel = guests ? `${guests} ${guests === 1 ? t.guest : t.guestsSummary}` : "";
  const dateRange = formatDateRange(search.checkin, search.checkout, language);
  const summary = [dateRange, nightsLabel, guestsLabel].filter(Boolean).join(" · ");

  const displayName = localizeRoomName(offer.name, language);
  const displayCategory = localizeCategory(offer.category, language);
  const isConditionalFeature = (feature: string) => /5|five|5th|5ου|5ο/.test(normalizedText(feature));
  const isConditionalFiveGuestRoom = /(?:^|\D)10(?:\D|$)/.test(offer.name) && offer.features.some(isConditionalFeature);
  const usableFeatures = offer.features.filter((feature) => !isConditionalFeature(feature));
  const independentFeature = usableFeatures.find((feature) => /independent|ανεξαρτη/.test(normalizedText(feature)));
  const kitchenFeature = usableFeatures.find((feature) => /kitchen|κουζιν/.test(normalizedText(feature)));
  const floorFeature = offer.floor || independentFeature || usableFeatures.find((feature) => /floor|stairs|οροφο|ισογει/.test(normalizedText(feature))) || displayCategory;
  const secondaryFeature = kitchenFeature || usableFeatures.find((feature) => feature !== independentFeature && normalizedText(feature) !== normalizedText(floorFeature)) || usableFeatures[0];
  const pills = [
    floorFeature ? { label: localizeFeature(floorFeature, language), icon: <HomeIcon /> } : null,
    secondaryFeature ? { label: localizeFeature(secondaryFeature, language), icon: featureIcon(secondaryFeature) } : null,
    { label: `${t.upTo} ${offer.maxGuests} ${t.guests}`, icon: <UsersIcon /> },
  ].filter((item): item is { label: string; icon: ReactNode } => Boolean(item?.label));

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-stone-950/60 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={displayName}>
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label={t.close} />
      <div className="relative z-10 max-h-[97dvh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-[28px] bg-[#fffdfa] px-2.5 pb-[max(12px,env(safe-area-inset-bottom))] pt-2.5 shadow-2xl sm:max-h-[94dvh] sm:rounded-[28px] sm:px-3 sm:pb-3">
        <div className="mx-auto mb-2 h-1.5 w-20 rounded-full bg-stone-300" aria-hidden="true" />

        <div className="relative overflow-hidden rounded-[20px] bg-stone-100" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="relative aspect-[4/3] sm:aspect-[16/9]">
            {safeImages.length ? (
              <Image
                key={safeImages[imageIndex]}
                src={safeImages[imageIndex]}
                alt={`${displayName}, ${language === "el" ? "φωτογραφία" : "photo"} ${imageIndex + 1}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            ) : null}
          </div>

          {safeImages.length > 1 ? (
            <>
              <button type="button" onClick={previousImage} className="absolute left-2.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-stone-900 shadow-md transition active:scale-95" aria-label={t.previous}><ChevronLeftIcon /></button>
              <button type="button" onClick={nextImage} className="absolute right-2.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-stone-900 shadow-md transition active:scale-95" aria-label={t.next}><ChevronRightIcon /></button>
              <span className="absolute bottom-2.5 right-2.5 rounded-full bg-[#43551b]/95 px-3 py-1 text-xs font-bold text-white shadow-sm">{imageIndex + 1} / {safeImages.length}</span>
            </>
          ) : null}
        </div>

        <button type="button" onClick={onClose} className="absolute right-3 top-8 z-20 grid h-11 w-11 place-items-center rounded-full border border-stone-200 bg-white/95 text-stone-900 shadow-lg backdrop-blur transition active:scale-95 sm:right-4" aria-label={t.close}><CloseIcon /></button>

        <div className="px-2 pb-1 pt-4 sm:px-4 sm:pt-5">
          <h2 className="text-[28px] font-black leading-tight tracking-[-0.02em] text-[#43551b] sm:text-3xl">{displayName}</h2>
          <p className="mt-1 text-sm font-semibold leading-5 text-[#a45d20] sm:text-base">{[displayCategory, `${t.upTo} ${offer.maxGuests} ${t.guests}`].filter(Boolean).join(" · ")}</p>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {pills.slice(0, 3).map((pill) => <FeaturePill key={pill.label} icon={pill.icon} label={pill.label} />)}
          </div>

          {isConditionalFiveGuestRoom ? (
            <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-[#eadcc9] bg-[#fff9f0] px-3 py-3 text-[12px] leading-5 text-stone-700 sm:text-sm">
              <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#a45d20]" />
              <p>{t.conditionalFifthGuest}</p>
            </div>
          ) : null}

          {summary ? (
            <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-[#eadcc9] bg-white px-3 py-3 text-[12px] font-medium leading-5 text-stone-700 sm:text-sm">
              <CalendarIcon className="h-5 w-5 shrink-0 text-stone-600" />
              <p>{summary}</p>
            </div>
          ) : null}

          <div className="mt-4">
            <p className="text-sm text-stone-400 line-through">{money(originalNightly)} {t.perNight}</p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
              <p className="text-[34px] font-black leading-none tracking-[-0.025em] text-[#43551b]">{money(directNightly)}</p>
              <span className="text-sm font-medium text-stone-600">{t.perNight}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-stone-700">{money(offer.directTotal)} {t.totalFor} {nightsLabel}</p>
            <div className="mt-2 flex items-start gap-2 text-sm font-semibold leading-5 text-[#526124]">
              <TagIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{t.savePrefix} {money(totalSaving)} {t.saveSuffix}</p>
            </div>
          </div>

          <button type="button" onClick={onInterest} className="mt-4 min-h-[52px] w-full rounded-2xl bg-[#4b5c18] px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(75,92,24,0.20)] transition active:scale-[0.99] sm:text-base">{t.interested}</button>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#d8cfbf] bg-white px-3 py-3 text-sm font-semibold text-[#43551b] transition active:bg-stone-50"><WhatsAppIcon className="h-5 w-5 text-[#128C4A]" />{t.whatsapp}</a>
            <button type="button" onClick={onInterest} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#d8cfbf] bg-white px-3 py-3 text-sm font-semibold text-[#43551b] transition active:bg-stone-50"><MailIcon />{t.email}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
