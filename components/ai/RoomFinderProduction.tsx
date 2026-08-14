"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ROOM_FINDER_COPY,
  ROOM_FINDER_LANGUAGES,
  type RoomFinderLanguage,
} from "./room-finder-copy";
import { ChatMessage, IconReplies } from "./room-finder-chat-ui";
import { RoomCarousel, type RoomOffer } from "./room-finder-carousel";
import { stayRange } from "./room-finder-format";
import { SelectedRoomCard } from "./room-finder-selected-card";
import { TypingIndicator } from "./room-finder-typing-indicator";
import { useRoomFinder } from "./use-room-finder";

const WHATSAPP_NUMBER = "306944474226";
const BREAKFAST_IMAGE = "/images/welcome/voulamandis-breakfast.jpg";
const CORE_INPUT_STEPS = new Set(["checkin", "checkout", "rooms", "guests"]);

const BACK_TO_ROOMS: Record<RoomFinderLanguage, string> = {
  el: "Πίσω στα δωμάτια",
  en: "Back to rooms",
  de: "Zurück zu den Zimmern",
  fr: "Retour aux chambres",
  it: "Torna alle camere",
  es: "Volver a las habitaciones",
  tr: "Odalara dön",
};

function detectLanguage(): RoomFinderLanguage {
  if (typeof window === "undefined") return "en";
  const supported = ROOM_FINDER_LANGUAGES.map(([value]) => value);
  const queryLanguage = new URLSearchParams(window.location.search)
    .get("lang")
    ?.toLowerCase()
    .split("-")[0];
  const pathLanguage = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const documentLanguage = document.documentElement.lang?.toLowerCase().split("-")[0];

  return (
    [queryLanguage, pathLanguage, documentLanguage]
      .find(value => supported.includes(value as RoomFinderLanguage)) as RoomFinderLanguage
  ) || "en";
}

function money(value: number, language: RoomFinderLanguage) {
  const locale = {
    el: "el-GR",
    en: "en-GB",
    de: "de-DE",
    fr: "fr-FR",
    it: "it-IT",
    es: "es-ES",
    tr: "tr-TR",
  } as const;

  return new Intl.NumberFormat(locale[language], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function RoomFinderProduction({
  initialLanguage = "en",
}: {
  initialLanguage?: RoomFinderLanguage;
}) {
  const [language, setLanguage] = useState<RoomFinderLanguage>(initialLanguage);
  const finder = useRoomFinder(language);
  const copy = ROOM_FINDER_COPY[language];
  const [detail, setDetail] = useState<RoomOffer | null>(null);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const detected = detectLanguage();
    if (detected !== language) setLanguage(detected);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    finder.reset();
    setDetail(null);
    setContact({ name: "", phone: "", email: "" });
    setSendStatus("idle");
  }, [language]);

  useEffect(() => {
    setSendStatus("idle");
  }, [finder.checkin, finder.checkout, finder.guestTotal, finder.roomCount]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [finder.messages, finder.step, finder.typing, finder.choices, sendStatus]);

  function changeLanguage(next: RoomFinderLanguage) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    history.replaceState(history.state, "", url);
    setLanguage(next);
  }

  function openWhatsApp(text: string) {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function whatsappContext(base: string, includeSelectedRooms = false) {
    const selectedRooms = includeSelectedRooms
      ? finder.choices.map(choice => `${choice.offer.name} · ${money(choice.offer.directTotal, language)}`)
      : [];

    return [
      base,
      stayRange(finder.checkin, finder.checkout, language),
      finder.guestTotal ? copy.guestLabel(finder.guestTotal) : "",
      finder.roomCount ? copy.roomLabel(finder.roomCount) : "",
      ...selectedRooms,
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function sendRequest() {
    if (!contact.name.trim() || (!contact.phone.trim() && !contact.email.trim())) return;

    setSendStatus("sending");
    const breakfastTotal = finder.breakfast
      ? finder.choices.reduce((sum, choice) => sum + Number(choice.offer.breakfastTotalIfAdded || 0), 0)
      : 0;
    const roomTotal = finder.choices.reduce((sum, choice) => sum + choice.offer.directTotal, 0);
    const summary = [
      stayRange(finder.checkin, finder.checkout, language),
      copy.guestLabel(finder.guestTotal),
      ...finder.choices.map(choice => `${choice.offer.name}: ${money(choice.offer.directTotal, language)}`),
      ...(finder.breakfast ? [`${copy.breakfastLabel}: ${money(breakfastTotal, language)}`] : []),
      `${copy.total}: ${money(roomTotal + breakfastTotal, language)}`,
    ].join("\n");

    try {
      const response = await fetch("/api/ai-assistant/summary-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `AI Room Finder — ${contact.name}`,
          message: `${copy.contactTitle}\n\n${summary}\n\n${copy.name}: ${contact.name}\n${copy.phone}: ${contact.phone || "—"}\n${copy.email}: ${contact.email || "—"}`,
          guest: contact,
        }),
      });
      if (!response.ok) throw new Error("Request send failed");
      setSendStatus("sent");
    } catch {
      setSendStatus("error");
    }
  }

  const homeHref = language === "en" ? "/" : `/${language}/`;
  const inputEnabled = finder.step !== "searching" && !finder.typing;
  const inputPlaceholder = finder.step === "searching"
    ? copy.waitingPlaceholder
    : CORE_INPUT_STEPS.has(finder.step)
      ? copy.placeholder
      : copy.changePlaceholder;
  const breakfastOfferTotal = finder.choices.reduce(
    (sum, choice) => sum + Number(choice.offer.breakfastTotalIfAdded || 0),
    0,
  );
  const breakfastTotal = finder.breakfast ? breakfastOfferTotal : 0;
  const roomTotal = finder.choices.reduce((sum, choice) => sum + choice.offer.directTotal, 0);
  const stay = stayRange(finder.checkin, finder.checkout, language);
  const bookingSummary = [
    stay,
    finder.guestTotal ? copy.guestLabel(finder.guestTotal) : "",
    finder.roomCount ? copy.roomLabel(finder.roomCount) : "",
  ].filter(Boolean).join(" · ");

  return (
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-[#f6f2eb] text-[#29251f]">
      <style jsx global>{`
        @keyframes msg { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes react { from { opacity: 0; transform: translateY(2px) scale(.82); } to { opacity: 1; transform: none; } }
        @keyframes typingDot { 0%,60%,100% { opacity: .35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-4px); } }
        .msg { animation: msg .22s ease-out both; }
        .reaction { animation: react .22s ease-out both; }
        .typing-dot { display: block; width: 6px; height: 6px; border-radius: 9999px; background: #746b60; animation: typingDot 1.05s ease-in-out infinite; }
        .typing-dot:nth-child(2) { animation-delay: .14s; }
        .typing-dot:nth-child(3) { animation-delay: .28s; }
      `}</style>

      <header className="shrink-0 border-b border-[#ddd4c8] bg-[#fbf8f3]/95">
        <div className="mx-auto flex h-[64px] max-w-3xl items-center gap-1.5 px-2.5">
          <a href={homeHref} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg" aria-label="Back">
            ←
          </a>
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
            <Image
              src="/images/welcome/voulamandis-welcome-hero.webp"
              alt="Voulamandis House"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 pl-1">
            <h1 className="whitespace-nowrap text-[15px] font-bold leading-tight">Voulamandis House</h1>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#746b60]">
              <span className="h-2 w-2 rounded-full bg-[#718b52]" />
              {copy.online}
            </div>
          </div>
          <div className="relative h-9 w-[54px] shrink-0">
            <div className="pointer-events-none flex h-full items-center justify-center gap-1 rounded-full border border-[#d8cec1] bg-white text-xs font-bold">
              {language.toUpperCase()} <span aria-hidden="true">⌄</span>
            </div>
            <select
              aria-label={copy.languageLabel}
              value={language}
              onChange={event => changeLanguage(event.target.value as RoomFinderLanguage)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            >
              {ROOM_FINDER_LANGUAGES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            aria-label={copy.newSearch}
            title={copy.newSearch}
            onClick={() => finder.reset()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base text-[#746b60]"
          >
            ↻
          </button>
        </div>
      </header>

      {bookingSummary && (
        <div className="shrink-0 border-b border-[#e5ddd2] bg-[#f9f5ef] px-3 py-2">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-full border border-[#ddd3c6] bg-white px-3 py-1.5 text-center text-xs font-semibold text-[#625b52]">
            <div className="truncate">{bookingSummary}</div>
          </div>
        </div>
      )}

      <div ref={feedRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col px-3 pb-7 pt-5">
          <div className="space-y-3.5">
            {finder.messages.map(message => <ChatMessage key={message.id} message={message} />)}
            {finder.typing && <TypingIndicator />}

            {finder.step === "rooms" && (
              <IconReplies values={[1, 2, 3]} icon="🛏️" label={copy.roomLabel} onSelect={value => void finder.chooseRooms(value)} />
            )}
            {finder.step === "guests" && (
              <IconReplies values={[1, 2, 3, 4, 5]} icon="👤" label={copy.guestLabel} onSelect={value => void finder.chooseGuests(value)} />
            )}

            {finder.step === "selecting" && finder.visibleOffers.length > 0 && (
              <>
                <RoomCarousel
                  offers={finder.visibleOffers}
                  copy={copy}
                  language={language}
                  money={money}
                  selectingOfferKey={finder.selectingOfferKey}
                  onDetails={setDetail}
                  onSelect={offer => void finder.selectOffer(offer)}
                />
                <section className="msg flex items-center gap-3 rounded-[20px] border border-[#dfd6ca] bg-white px-4 py-3 shadow-sm sm:ml-10">
                  <p className="min-w-0 flex-1 text-sm font-semibold leading-5">{copy.whatsappHelp}</p>
                  <button
                    type="button"
                    onClick={() => openWhatsApp(whatsappContext(copy.whatsappHelp))}
                    className="shrink-0 rounded-full bg-[#287d4f] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    💬 {copy.whatsapp}
                  </button>
                </section>
              </>
            )}

            {finder.step === "breakfast" && (
              <>
                <SelectedRoomCard
                  choices={finder.choices}
                  copy={copy}
                  language={language}
                  checkin={finder.checkin}
                  checkout={finder.checkout}
                  money={money}
                />
                <div className="msg ml-10 flex">
                  <button
                    type="button"
                    onClick={() => finder.backToRooms()}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d8cec1] bg-white px-3.5 py-2 text-sm font-bold text-[#625b52] shadow-sm transition hover:bg-[#f7f3ed] active:scale-[.98]"
                  >
                    <span aria-hidden="true">←</span>{BACK_TO_ROOMS[language]}
                  </button>
                </div>
                <div className="msg ml-10 rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white px-4 py-3 text-[15px] shadow-sm">
                  <p>{copy.breakfast}</p>
                  {breakfastOfferTotal > 0 && (
                    <p className="mt-2 font-black text-[#5f7448]">{copy.breakfastLabel}: {money(breakfastOfferTotal, language)}</p>
                  )}
                </div>
                <section className="msg ml-10 overflow-hidden rounded-[22px] border border-[#dcd2c5] bg-white shadow-sm">
                  <div className="relative h-36">
                    <Image src={BREAKFAST_IMAGE} alt={copy.breakfastLabel} fill sizes="600px" className="object-cover" />
                  </div>
                  <div className="flex gap-2 p-3">
                    <button
                      type="button"
                      onClick={() => void finder.chooseBreakfast(true)}
                      className="rounded-full bg-[#66714f] px-4 py-2.5 text-sm font-bold text-white"
                    >
                      {copy.yesBreakfast}
                    </button>
                    <button
                      type="button"
                      onClick={() => void finder.chooseBreakfast(false)}
                      className="rounded-full border border-[#d8cec1] px-4 py-2.5 text-sm font-bold"
                    >
                      {copy.noBreakfast}
                    </button>
                  </div>
                </section>
              </>
            )}

            {finder.step === "unavailable" && (
              <section className="ml-10 grid grid-cols-2 gap-2 rounded-[22px] border border-[#dfd6ca] bg-white p-4">
                <button
                  type="button"
                  onClick={() => finder.reset()}
                  className="min-h-12 rounded-2xl border font-bold"
                >
                  {copy.newSearch}
                </button>
                <button
                  type="button"
                  onClick={() => openWhatsApp(whatsappContext(copy.whatsappHelp))}
                  className="min-h-12 rounded-2xl bg-[#287d4f] font-bold text-white"
                >
                  {copy.whatsapp}
                </button>
              </section>
            )}

            {finder.step === "complete" && (
              <section className="msg overflow-hidden rounded-[26px] border border-[#dcd2c5] bg-white shadow-[0_16px_45px_rgba(70,55,35,.10)] sm:ml-10">
                <div className="border-b bg-[#faf7f2] p-4">
                  <div className="flex justify-between gap-3">
                    <h2 className="text-lg font-black">{copy.summary}</h2>
                    <button type="button" onClick={() => finder.reset()} className="text-xs font-bold underline">
                      {copy.newSearch}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-[#746b60]">{stay} · {copy.nightLabel(finder.nights)}</p>
                </div>
                <div className="p-4">
                  {finder.choices.map(choice => (
                    <div key={choice.group} className="flex items-center gap-3 border-b py-3">
                      <div className="relative h-14 w-[72px] overflow-hidden rounded-xl">
                        <Image src={choice.offer.image} alt={choice.offer.name} fill sizes="72px" className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{choice.offer.name}</p>
                        <p className="text-xs text-[#746b60]">{copy.guestLabel(choice.guests)}</p>
                      </div>
                      <strong className="text-[#5f7448]">{money(choice.offer.directTotal, language)}</strong>
                    </div>
                  ))}
                  {finder.breakfast && (
                    <div className="flex justify-between border-b py-3">
                      <span>🥐 {copy.breakfastLabel}</span>
                      <strong>{money(breakfastTotal, language)}</strong>
                    </div>
                  )}
                  <div className="mt-4 flex justify-between rounded-2xl bg-[#f1ede7] p-4 text-lg">
                    <b>{copy.total}</b>
                    <strong className="text-xl text-[#5f7448]">{money(roomTotal + breakfastTotal, language)}</strong>
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-black">{copy.contactTitle}</h3>
                    <p className="mt-1 text-sm text-[#746b60]">{copy.contactHelp}</p>
                    <div className="mt-3 space-y-2">
                      <input
                        value={contact.name}
                        onChange={event => setContact({ ...contact, name: event.target.value })}
                        placeholder={copy.name}
                        className="h-12 w-full rounded-2xl border border-[#d8cec1] px-4"
                      />
                      <input
                        value={contact.phone}
                        onChange={event => setContact({ ...contact, phone: event.target.value })}
                        placeholder={copy.phone}
                        className="h-12 w-full rounded-2xl border border-[#d8cec1] px-4"
                      />
                      <input
                        value={contact.email}
                        onChange={event => setContact({ ...contact, email: event.target.value })}
                        placeholder={copy.email}
                        className="h-12 w-full rounded-2xl border border-[#d8cec1] px-4"
                      />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={sendStatus === "sending"}
                        onClick={() => void sendRequest()}
                        className="min-h-12 rounded-2xl bg-[#66714f] font-bold text-white disabled:opacity-40"
                      >
                        {copy.send}
                      </button>
                      <button
                        type="button"
                        onClick={() => openWhatsApp(whatsappContext(copy.contactTitle, true))}
                        className="min-h-12 rounded-2xl bg-[#287d4f] font-bold text-white"
                      >
                        {copy.whatsapp}
                      </button>
                    </div>
                    {sendStatus === "sent" && (
                      <p className="mt-3 rounded-2xl bg-[#eef4e7] p-3 font-bold text-[#5f7448]">{copy.sent}</p>
                    )}
                    {sendStatus === "error" && (
                      <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{copy.sendError}</p>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={finder.submit} className="shrink-0 border-t border-[#e2d9cd] bg-[#fbf8f3]/95 p-3">
        <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-[24px] border border-[#d8cec1] bg-white p-2 shadow-sm">
          <input
            value={finder.input}
            onChange={event => finder.setInput(event.target.value)}
            disabled={!inputEnabled}
            placeholder={inputPlaceholder}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[15px] outline-none disabled:text-[#a9a197]"
          />
          <button
            disabled={!inputEnabled || !finder.input.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6b604f] text-white disabled:bg-[#d7d0c6]"
          >
            ↑
          </button>
        </div>
      </form>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/35 p-3 sm:items-center sm:justify-center">
          <section className="max-h-[88dvh] w-full overflow-hidden rounded-[26px] bg-white sm:max-w-xl">
            <div className="relative h-60">
              <Image src={detail.image} alt={detail.name} fill sizes="600px" className="object-cover" />
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/90 text-xl"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-5">
              <h2 className="text-2xl font-black">{detail.name}</h2>
              <p className="mt-1 text-sm text-[#746b60]">{detail.category} · {detail.floor}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(detail.features || []).map(feature => (
                  <span key={feature} className="rounded-full bg-[#f1ede7] px-3 py-1.5 text-xs font-semibold">
                    {feature}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setDetail(null);
                  void finder.selectOffer(detail);
                }}
                className="mt-5 w-full rounded-2xl bg-[#66714f] p-3.5 font-black text-white"
              >
                {copy.select}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}