"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { dayTripAreaById, dayTripAreas, type StopKind } from "@/content/trip-planner/day-trips";
import {
  buildDayPlan,
  defaultPicks,
  directionsUrl,
  formatTime,
  getPlace,
  isClosedOn,
  parseTime,
  rankAreas,
  rankBeachOptions,
  type DayPlan,
  type PlannerPlace,
  type SeaDay,
} from "@/lib/trip-planner/day-plan";

/* Greek UI copy (kept in one place so other languages can be added next). */
const t = {
  brandTop: "Voulamandis House",
  brandBottom: "Chios Day Planner",
  morning: "Καλημέρα!",
  afternoon: "Καλησπέρα!",
  homeTitle: "Πού πάμε σήμερα;",
  homeTitleTomorrow: "Πού πάμε αύριο;",
  homeTitleOther: "Πού πάμε;",
  homeIntro: "Διάλεξε μια έτοιμη εκδρομή. Τη στήνουμε με βάση τη θάλασσα της ημέρας και την προσαρμόζεις όπως θέλεις.",
  today: "Σήμερα",
  tomorrow: "Αύριο",
  bestToday: "★ Καλύτερη επιλογή",
  seeTrip: "Δες το πρόγραμμα →",
  fromKambos: "από τον Κάμπο",
  continuePlan: "Συνέχισε το πλάνο σου",
  back: "← Όλες οι εκδρομές",
  startAt: "Ξεκίνημα",
  openRoute: "Άνοιξε όλη τη διαδρομή στο Google Maps",
  directions: "Οδηγίες",
  change: "Αλλαγή",
  remove: "Αφαίρεση",
  add: "Πρόσθεσε",
  drive: "οδήγηση",
  freeTime: "Ελεύθερος χρόνος",
  returnTo: "Επιστροφή στο Voulamandis House",
  totalDrive: "Συνολική οδήγηση",
  closedToday: "Συνήθως κλειστό αυτή τη μέρα — έλεγξε πριν πας.",
  checkHours: "Έλεγξε το ωράριο πριν πας.",
  calmerToday: "Πιο ήρεμη θάλασσα σήμερα:",
  switchTo: "Άλλαξε",
  sheetTitle: "Διάλεξε",
  sheetBeachHint: "Ταξινομημένες από την πιο ήρεμη θάλασσα της ημέρας.",
  close: "Κλείσιμο",
  share: "Στείλε το σε κάποιον",
  copied: "Ο σύνδεσμος αντιγράφηκε",
  emailToggle: "Στείλ' το στο email μου",
  emailPlaceholder: "Το email σου",
  emailSend: "Αποστολή",
  emailSent: "Στάλθηκε! Έλεγξε και τα ανεπιθύμητα αν δεν το δεις.",
  emailError: "Δεν στάλθηκε. Δοκίμασε ξανά.",
  askReception: "Ερώτηση στη reception (WhatsApp)",
  disclaimer:
    "Οι ώρες και οι χρόνοι οδήγησης είναι εκτιμήσεις. Η θάλασσα είναι πρόγνωση για 10:00–18:00 (Open-Meteo) με βάση τον προσανατολισμό κάθε ακτής — όχι μέτρηση ή εγγύηση ασφάλειας.",
  noForecast: "Η πρόγνωση θάλασσας δεν είναι διαθέσιμη τώρα — οι εκδρομές λειτουργούν κανονικά.",
  kinds: { beach: "Παραλία", village: "Χωριό", sight: "Αξιοθέατο", food: "Φαγητό", drink: "Ποτό" } as Record<StopKind, string>,
  sea: { calm: "Ήρεμη θάλασσα", "some-waves": "Λίγο κύμα", wavy: "Κύμα" },
  wind: "Άνεμος",
  bft: "Μποφόρ",
  directionsShort: ["Β", "ΒΑ", "Α", "ΝΑ", "Ν", "ΝΔ", "Δ", "ΒΔ"],
  directionsLong: ["βόρειος", "βορειοανατολικός", "ανατολικός", "νοτιοανατολικός", "νότιος", "νοτιοδυτικός", "δυτικός", "βορειοδυτικός"],
};

const KIND_ICON: Record<StopKind, string> = { beach: "🏖️", village: "🏘️", sight: "🏛️", food: "🍽️", drink: "🍷" };
const KIND_TINT: Record<StopKind, string> = {
  beach: "from-[#d8ecee] to-[#b9d9dc]",
  village: "from-[#efe4d4] to-[#dccab1]",
  sight: "from-[#e9e3d6] to-[#d3c8b1]",
  food: "from-[#f3e2cf] to-[#e3c6a3]",
  drink: "from-[#ecdccf] to-[#d6b8a2]",
};
const SEA_STYLE = {
  calm: "bg-emerald-50 text-emerald-800 ring-emerald-700/20",
  "some-waves": "bg-amber-50 text-amber-800 ring-amber-700/20",
  wavy: "bg-rose-50 text-rose-800 ring-rose-700/20",
};
const SEA_DOT = { calm: "bg-emerald-500", "some-waves": "bg-amber-500", wavy: "bg-rose-500" };
const WHATSAPP = "306944474226";
const STORAGE_KEY = "vh_day_planner_v1";
const START_CHOICES = ["09:00", "10:00", "11:00", "12:00"];

type Props = {
  seaDays: SeaDay[];
  nowMinutes: number;
  source: string | null;
};

type PlanState = { areaId: string; dayIndex: number; picks: (string | null)[]; start: string };

function emit(name: string, properties: Record<string, string | number | undefined>) {
  try {
    if (window.localStorage.getItem("vh_cookie_consent_v1") !== "accepted") return;
  } catch {
    return;
  }
  const clean = Object.fromEntries(Object.entries(properties).filter(([, v]) => v !== undefined)) as Record<string, string | number>;
  track(name, clean);
  (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", name, clean);
}

function directionIndex(deg: number | null) {
  if (deg === null || !Number.isFinite(deg)) return null;
  return Math.round((((deg % 360) + 360) % 360) / 45) % 8;
}

function dayLabel(day: SeaDay) {
  const [y, m, d] = day.date.split("-").map(Number);
  const formatted = new Intl.DateTimeFormat("el-GR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
  if (day.offsetFromToday === 0) return `${t.today} · ${formatted}`;
  if (day.offsetFromToday === 1) return `${t.tomorrow} · ${formatted}`;
  return formatted;
}

function defaultStart(day: SeaDay | undefined, nowMinutes: number) {
  if (!day || day.offsetFromToday !== 0 || nowMinutes < 9 * 60 + 30) return "10:00";
  const next = Math.ceil((nowMinutes + 20) / 15) * 15;
  return formatTime(Math.min(next, 15 * 60));
}

function encodePlan(state: PlanState, source: string | null) {
  const params = new URLSearchParams();
  if (source) params.set("src", source);
  params.set("trip", state.areaId);
  params.set("day", String(state.dayIndex));
  params.set("s", state.picks.map((id) => id ?? "~").join(","));
  params.set("t", state.start);
  return `?${params.toString()}`;
}

function decodePlan(search: string, dayCount: number): PlanState | null {
  const params = new URLSearchParams(search);
  const areaId = params.get("trip");
  const area = areaId ? dayTripAreaById[areaId] : null;
  if (!area) return null;
  const dayIndex = Math.min(Math.max(Number(params.get("day")) || 0, 0), Math.max(dayCount - 1, 0));
  const raw = (params.get("s") ?? "").split(",");
  const picks = area.slots.map((slot, index) => {
    const value = raw[index];
    if (value === "~") return null;
    return value && slot.options.includes(value) ? value : slot.default;
  });
  const start = /^\d{2}:\d{2}$/.test(params.get("t") ?? "") ? (params.get("t") as string) : "10:00";
  return { areaId: area.id, dayIndex, picks, start };
}

function SeaChip({ seaDay, beachId, compact = false }: { seaDay: SeaDay | undefined; beachId: string; compact?: boolean }) {
  const sea = seaDay?.beaches[beachId];
  if (!sea) return null;
  const dir = directionIndex(sea.windDirectionDeg);
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-bold ring-1 ${SEA_STYLE[sea.state]}`}>
      <span className={`h-2 w-2 rounded-full ${SEA_DOT[sea.state]}`} aria-hidden="true" />
      {t.sea[sea.state]}
      {!compact && sea.beaufort !== null ? (
        <span className="font-semibold opacity-80">· {dir !== null ? `${t.directionsShort[dir]} ` : ""}{sea.beaufort} {t.bft}</span>
      ) : null}
    </span>
  );
}

function PlacePhoto({ place, className = "", sizes = "100vw" }: { place: PlannerPlace; className?: string; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  if (place.photo && !failed) {
    return (
      <div className={`relative overflow-hidden bg-[#e8dfd3] ${className}`}>
        <Image src={place.photo} alt={`${place.name}, Χίος`} fill sizes={sizes} className="object-cover" onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${KIND_TINT[place.kind]} ${className}`} aria-hidden="true">
      <span className="text-[34px] drop-shadow-sm">{KIND_ICON[place.kind]}</span>
    </div>
  );
}

function BrandBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e8dfd4] bg-[#fffdf9]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[640px] items-center justify-between px-4">
        <div className="leading-tight">
          <div className="tracking-[-0.02em] text-[17px] font-extrabold text-[#3a2e26]">{t.brandTop}</div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a7743f]">{t.brandBottom}</div>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[#cfe0cf] bg-[#f3f9f1] px-3 py-1.5 text-[12px] font-bold text-[#3f6b47]"
          onClick={() => emit("planner_whatsapp", { place: "header" })}
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}

export function DayPlanner({ seaDays, nowMinutes, source }: Props) {
  const [screen, setScreen] = useState<"home" | "plan">("home");
  const [dayIndex, setDayIndex] = useState(0);
  const [plan, setPlan] = useState<PlanState | null>(null);
  const [sheetSlot, setSheetSlot] = useState<number | null>(null);
  const [saved, setSaved] = useState<PlanState | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copied, setCopied] = useState(false);

  const seaDay = seaDays[dayIndex];
  const hasForecast = seaDays.some((day) => Object.keys(day.beaches).length > 0);
  const ranked = useMemo(() => rankAreas(dayTripAreas, hasForecast ? seaDay : null), [seaDay, hasForecast]);

  // Restore from the URL (shared link / browser back) and from the device.
  useEffect(() => {
    const fromUrl = decodePlan(window.location.search, seaDays.length);
    if (fromUrl) {
      setPlan(fromUrl);
      setDayIndex(fromUrl.dayIndex);
      setScreen("plan");
    }
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as (PlanState & { date: string }) | null;
      if (stored) {
        const index = seaDays.findIndex((day) => day.date === stored.date);
        if (index >= 0 && dayTripAreaById[stored.areaId]) setSaved({ ...stored, dayIndex: index });
      }
    } catch {
      /* storage unavailable */
    }
    const onPop = () => {
      const state = decodePlan(window.location.search, seaDays.length);
      setSheetSlot(null);
      if (state) {
        setPlan(state);
        setDayIndex(state.dayIndex);
        setScreen("plan");
      } else {
        setScreen("home");
      }
    };
    window.addEventListener("popstate", onPop);
    emit("planner_open", { source: source ?? "direct" });
    return () => window.removeEventListener("popstate", onPop);
  }, [seaDays, source]);

  const persist = useCallback((next: PlanState, push: boolean) => {
    const url = encodePlan(next, source);
    if (push) window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, date: seaDays[next.dayIndex]?.date }));
    } catch {
      /* storage unavailable */
    }
  }, [seaDays, source]);

  const openArea = (areaId: string) => {
    const area = dayTripAreaById[areaId];
    const day = seaDays[dayIndex];
    const next: PlanState = {
      areaId,
      dayIndex,
      picks: defaultPicks(area, hasForecast ? day : null, day?.date ?? ""),
      start: defaultStart(day, nowMinutes),
    };
    setPlan(next);
    setScreen("plan");
    setEmailState("idle");
    persist(next, true);
    window.scrollTo({ top: 0 });
    emit("planner_area_open", { area: areaId, rank: ranked.findIndex((item) => item.area.id === areaId) + 1, source: source ?? "direct" });
  };

  const resume = (state: PlanState) => {
    setPlan(state);
    setDayIndex(state.dayIndex);
    setScreen("plan");
    persist(state, true);
    window.scrollTo({ top: 0 });
  };

  const updatePlan = (patch: Partial<PlanState>) => {
    if (!plan) return;
    const next = { ...plan, ...patch };
    setPlan(next);
    persist(next, false);
  };

  const goHome = () => {
    if (window.history.length > 1 && new URLSearchParams(window.location.search).get("trip")) window.history.back();
    else {
      window.history.replaceState(null, "", source ? `?src=${encodeURIComponent(source)}` : window.location.pathname);
      setScreen("home");
    }
  };

  const dayPlan: DayPlan | null = plan ? buildDayPlan(plan.areaId, plan.picks, plan.start) : null;
  const planSeaDay = plan ? seaDays[plan.dayIndex] : undefined;
  const planDate = planSeaDay?.date ?? "";

  const sendEmail = async () => {
    if (!plan) return;
    setEmailState("sending");
    try {
      const response = await fetch("/api/trip-planner/send-itinerary/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, area: plan.areaId, date: planDate, start: plan.start, picks: plan.picks }),
      });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean };
      if (!response.ok || !payload.ok) throw new Error("send");
      setEmailState("sent");
      emit("planner_email_sent", { area: plan.areaId });
    } catch {
      setEmailState("error");
    }
  };

  const share = async () => {
    if (!plan) return;
    const url = `${window.location.origin}${window.location.pathname}${encodePlan(plan, "share")}`;
    emit("planner_share", { area: plan.areaId });
    try {
      if (navigator.share) {
        await navigator.share({ title: dayPlan?.area.title ?? "Chios", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* user cancelled */
    }
  };

  const islandWind = (() => {
    if (!seaDay || seaDay.islandWind.beaufort === null) return null;
    const dir = directionIndex(seaDay.islandWind.directionDeg);
    return `${t.wind} ${dir !== null ? t.directionsLong[dir] + " " : ""}~${seaDay.islandWind.beaufort} ${t.bft}`;
  })();

  /* ---------- Home ---------- */
  if (screen === "home" || !plan || !dayPlan) {
    const greeting = nowMinutes < 12 * 60 ? t.morning : t.afternoon;
    return (
      <main className="min-h-[100svh] bg-[#f8f4ee] pb-16 text-[#2f2722]">
        <BrandBar />
        <div className="mx-auto max-w-[640px] px-4 pt-5">
          <p className="text-[14px] font-bold text-[#a7743f]">{greeting}</p>
          <h1 className="mt-1 text-[34px] font-extrabold leading-[1.05] tracking-[-0.02em]">{seaDay?.offsetFromToday === 1 ? t.homeTitleTomorrow : seaDay && seaDay.offsetFromToday > 1 ? t.homeTitleOther : t.homeTitle}</h1>
          <p className="mt-2 text-[15px] leading-6 text-[#6c6057]">{t.homeIntro}</p>

          {seaDays.length > 1 ? (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label="Ημέρα">
              {seaDays.map((day, index) => (
                <button
                  key={day.date}
                  type="button"
                  role="tab"
                  aria-selected={index === dayIndex}
                  onClick={() => setDayIndex(index)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-bold ring-1 transition ${index === dayIndex ? "bg-[#3a2e26] text-white ring-[#3a2e26]" : "bg-white text-[#5d5048] ring-[#e3d9cc]"}`}
                >
                  {dayLabel(day)}
                </button>
              ))}
            </div>
          ) : null}

          {hasForecast && islandWind ? (
            <p className="mt-3 rounded-2xl bg-[#2f3a33] px-4 py-3 text-[14px] font-bold leading-6 text-white">
              🌊 {islandWind}. Οι εκδρομές είναι ταξινομημένες από την πιο ήρεμη θάλασσα.
            </p>
          ) : !hasForecast ? (
            <p className="mt-3 rounded-2xl bg-[#fff6e6] px-4 py-3 text-[13px] font-semibold text-[#7b623f]">{t.noForecast}</p>
          ) : null}

          {saved ? (
            <button
              type="button"
              onClick={() => resume(saved)}
              className="mt-4 flex w-full items-center justify-between rounded-2xl border border-[#d8cbb9] bg-white px-4 py-3 text-left shadow-sm"
            >
              <span>
                <span className="block text-[12px] font-black uppercase tracking-[0.12em] text-[#a7743f]">{t.continuePlan}</span>
                <span className="block text-[15px] font-bold text-[#3a2e26]">{dayTripAreaById[saved.areaId]?.title}</span>
              </span>
              <span className="text-[20px] text-[#a7743f]">→</span>
            </button>
          ) : null}

          <ol className="mt-5 grid gap-4">
            {ranked.map(({ area, bestBeach }, index) => {
              const beach = bestBeach ? getPlace(bestBeach) : null;
              const cover = beach ?? getPlace(area.slots[0].default);
              const plan0 = buildDayPlan(area.id, defaultPicks(area, hasForecast ? seaDay : null, seaDay?.date ?? ""), "10:00");
              return (
                <li key={area.id}>
                  <button type="button" onClick={() => openArea(area.id)} className="block w-full overflow-hidden rounded-[22px] bg-white text-left shadow-[0_10px_28px_rgba(65,48,36,.08)] ring-1 ring-[#e6dccf] transition active:scale-[0.99]">
                    {cover ? <PlacePhoto place={cover} className="aspect-[16/9] w-full" sizes="(max-width: 640px) 100vw, 640px" /> : null}
                    <div className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {index === 0 && hasForecast ? <span className="rounded-full bg-[#3a2e26] px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-white">{t.bestToday}</span> : null}
                        {beach && hasForecast ? <SeaChip seaDay={seaDay} beachId={beach.id} /> : null}
                      </div>
                      <h2 className="mt-2 tracking-[-0.02em] text-[24px] font-extrabold leading-tight text-[#2f2722]">{area.title}</h2>
                      <p className="mt-1 text-[14px] leading-6 text-[#6c6057]">{area.subtitle}</p>
                      <p className="mt-2 text-[13px] font-semibold text-[#8b7a6b]">
                        {plan0?.stops.map((stop) => stop.place.name).join(" → ")}
                      </p>
                      <span className="mt-3 inline-flex text-[14px] font-black text-[#7a5a35]">{t.seeTrip}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>

          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => emit("planner_whatsapp", { place: "home" })}
            className="mt-6 flex min-h-[52px] items-center justify-center rounded-2xl border border-[#cfe0cf] bg-[#f3f9f1] text-[15px] font-bold text-[#3f6b47]"
          >
            {t.askReception}
          </a>
          <p className="mt-4 text-[12px] leading-5 text-[#8b7f75]">{t.disclaimer}</p>
        </div>
      </main>
    );
  }

  /* ---------- Plan ---------- */
  const area = dayPlan.area;
  const removedSlots = area.slots.map((slot, index) => ({ slot, index })).filter(({ index }) => plan.picks[index] === null);
  const sheet = sheetSlot !== null ? area.slots[sheetSlot] : null;
  const sheetOptions = sheet ? (sheet.kind === "beach" ? rankBeachOptions(sheet.options, hasForecast ? planSeaDay ?? null : null) : sheet.options) : [];
  const startChoices = Array.from(new Set([...START_CHOICES, plan.start])).sort();

  return (
    <main className="min-h-[100svh] bg-[#f8f4ee] pb-20 text-[#2f2722]">
      <BrandBar />
      <div className="mx-auto max-w-[640px] px-4 pt-4">
        <button type="button" onClick={goHome} className="rounded-full border border-[#ded5ca] bg-white px-3.5 py-1.5 text-[13px] font-bold text-[#6b6159]">
          {t.back}
        </button>
        <p className="mt-4 text-[13px] font-black uppercase tracking-[0.14em] text-[#a7743f]">{planSeaDay ? dayLabel(planSeaDay) : ""}</p>
        <h1 className="mt-1 tracking-[-0.02em] text-[30px] font-extrabold leading-[1.08]">{area.title}</h1>
        <p className="mt-1 text-[14px] leading-6 text-[#6c6057]">{area.subtitle}</p>

        <div className="mt-4">
          <p className="text-[12px] font-black uppercase tracking-[0.12em] text-[#8b7a6b]">{t.startAt}</p>
          <div className="mt-2 flex gap-2 overflow-x-auto [scrollbar-width:none]">
            {startChoices.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => updatePlan({ start: time })}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[14px] font-bold ring-1 ${time === plan.start ? "bg-[#3a2e26] text-white ring-[#3a2e26]" : "bg-white text-[#5d5048] ring-[#e3d9cc]"}`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {dayPlan.routeUrl ? (
          <a
            href={dayPlan.routeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => emit("planner_route_open", { area: area.id })}
            className="mt-4 flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-[#3f6b4f] px-4 text-center text-[16px] font-black text-white shadow-[0_10px_24px_rgba(63,107,79,.25)]"
          >
            🗺️ {t.openRoute}
          </a>
        ) : null}

        <ol className="mt-5">
          {dayPlan.stops.map((stop, index) => {
            const previousLeave = index > 0 ? parseTime(dayPlan.stops[index - 1].leave) : parseTime(dayPlan.start);
            const gap = parseTime(stop.arrive) - stop.driveMin - previousLeave;
            const slot = area.slots[stop.slotIndex];
            const sea = stop.place.kind === "beach" ? planSeaDay?.beaches[stop.place.id] : undefined;
            const calmer = sea && sea.state !== "calm"
              ? rankBeachOptions(slot.options, planSeaDay ?? null).find((id) => id !== stop.place.id && planSeaDay?.beaches[id]?.state === "calm")
              : undefined;
            const closed = isClosedOn(stop.place.id, planDate);
            const canRemove = dayPlan.stops.length > 1;
            return (
              <li key={`${stop.slotIndex}-${stop.place.id}`}>
                {gap >= 30 ? (
                  <div className="flex items-center gap-3 py-2 pl-[18px] text-[13px] font-semibold text-[#8b7a6b]">
                    <span className="h-6 w-[2px] bg-[#e0d4c4]" aria-hidden="true" />☕ {t.freeTime} · {formatTime(previousLeave)}–{formatTime(previousLeave + gap)}
                  </div>
                ) : null}
                <div className="flex items-center gap-3 py-2 pl-[18px] text-[13px] font-semibold text-[#8b7a6b]">
                  <span className="h-6 w-[2px] bg-[#e0d4c4]" aria-hidden="true" />🚗 ~{stop.driveMin}′ {t.drive}
                </div>
                <article className="overflow-hidden rounded-[20px] bg-white shadow-[0_8px_22px_rgba(65,48,36,.07)] ring-1 ring-[#e6dccf]">
                  <div className="flex gap-3 p-3">
                    <PlacePhoto place={stop.place} className="h-[92px] w-[92px] shrink-0 rounded-2xl" sizes="96px" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-black text-[#a7743f]">
                        {stop.arrive}–{stop.leave} · {t.kinds[stop.place.kind]}
                      </p>
                      <h2 className="mt-0.5 tracking-[-0.02em] text-[21px] font-extrabold leading-tight text-[#2f2722]">{stop.place.name}</h2>
                      <p className="mt-0.5 text-[13px] leading-5 text-[#6c6057]">{stop.place.summary}</p>
                      {sea ? <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1"><SeaChip seaDay={planSeaDay} beachId={stop.place.id} compact />{sea.beaufort !== null ? <span className="text-[12px] font-semibold text-[#6c6057]">{t.wind} {directionIndex(sea.windDirectionDeg) !== null ? `${t.directionsShort[directionIndex(sea.windDirectionDeg) as number]} ` : ""}{sea.beaufort} {t.bft}</span> : null}</div> : null}
                    </div>
                  </div>
                  {stop.place.detail && stop.place.detail !== stop.place.summary ? <p className="px-3 pb-2 text-[13px] leading-5 text-[#5f554d]">{stop.place.detail}</p> : null}
                  {closed ? <p className="mx-3 mb-2 rounded-xl bg-rose-50 px-3 py-2 text-[13px] font-bold text-rose-800">⚠️ {t.closedToday}</p> : null}
                  {!closed && stop.place.kind === "sight" ? <p className="mx-3 mb-2 text-[12px] font-semibold text-[#8b7a6b]">ℹ️ {t.checkHours}</p> : null}
                  {calmer ? (
                    <div className="mx-3 mb-2 flex items-center justify-between gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[13px] font-bold text-emerald-900">
                      <span>{t.calmerToday} {getPlace(calmer)?.name}</span>
                      <button
                        type="button"
                        className="rounded-full bg-emerald-700 px-3 py-1 text-[12px] font-black text-white"
                        onClick={() => {
                          const picks = [...plan.picks];
                          picks[stop.slotIndex] = calmer;
                          updatePlan({ picks });
                          emit("planner_stop_swap", { area: area.id, to: calmer, reason: "calmer" });
                        }}
                      >
                        {t.switchTo}
                      </button>
                    </div>
                  ) : null}
                  <div className="grid grid-cols-3 border-t border-[#efe7dc] text-[13px] font-black">
                    <a
                      href={directionsUrl(stop.place)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => emit("planner_directions", { area: area.id, place: stop.place.id })}
                      className="flex min-h-[46px] items-center justify-center gap-1 text-[#3f6b4f]"
                    >
                      📍 {t.directions}
                    </a>
                    <button
                      type="button"
                      disabled={slotOptionsCount(slot) < 2}
                      onClick={() => setSheetSlot(stop.slotIndex)}
                      className="flex min-h-[46px] items-center justify-center border-x border-[#efe7dc] text-[#6b5545] disabled:text-[#c9bdb0]"
                    >
                      ⇄ {t.change}
                    </button>
                    <button
                      type="button"
                      disabled={!canRemove}
                      onClick={() => {
                        const picks = [...plan.picks];
                        picks[stop.slotIndex] = null;
                        updatePlan({ picks });
                      }}
                      className="flex min-h-[46px] items-center justify-center text-[#8b6a5a] disabled:text-[#c9bdb0]"
                    >
                      ✕ {t.remove}
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <div className="flex items-center gap-3 py-2 pl-[18px] text-[13px] font-semibold text-[#8b7a6b]">
          <span className="h-6 w-[2px] bg-[#e0d4c4]" aria-hidden="true" />🚗 ~{dayPlan.returnDriveMin}′ {t.drive}
        </div>
        <div className="rounded-[18px] bg-[#efe6da] px-4 py-3 text-[14px] font-bold text-[#4d4036]">
          🏡 {t.returnTo} · ~{dayPlan.returnAt}
          <span className="block text-[12px] font-semibold text-[#7d6e62]">{t.totalDrive}: ~{Math.round(dayPlan.totalDriveMin / 5) * 5}′</span>
        </div>

        {removedSlots.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {removedSlots.map(({ slot, index }) => {
              const option = getPlace(slot.kind === "beach" ? rankBeachOptions(slot.options, planSeaDay ?? null)[0] : slot.default);
              if (!option) return null;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const picks = [...plan.picks];
                    picks[index] = option.id;
                    updatePlan({ picks });
                  }}
                  className="rounded-full border border-dashed border-[#c9b9a6] bg-white px-3.5 py-2 text-[13px] font-bold text-[#6b5545]"
                >
                  + {t.add}: {option.name}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-6 grid gap-3">
          <button type="button" onClick={share} className="flex min-h-[50px] items-center justify-center rounded-2xl bg-white text-[15px] font-black text-[#3a2e26] ring-1 ring-[#e3d9cc]">
            📤 {copied ? t.copied : t.share}
          </button>
          {emailState === "sent" ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-center text-[14px] font-bold text-emerald-800">✓ {t.emailSent}</p>
          ) : emailOpen ? (
            <form
              className="rounded-2xl bg-white p-3 ring-1 ring-[#e3d9cc]"
              onSubmit={(event) => {
                event.preventDefault();
                void sendEmail();
              }}
            >
              <label htmlFor="planner-email" className="sr-only">{t.emailPlaceholder}</label>
              <div className="flex gap-2">
                <input
                  id="planner-email"
                  type="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="min-h-[48px] min-w-0 flex-1 rounded-xl border border-[#d9cdbf] px-3 text-[16px] outline-none focus:border-[#7a5a35]"
                />
                <button type="submit" disabled={emailState === "sending"} className="rounded-xl bg-[#3a2e26] px-4 text-[14px] font-black text-white disabled:opacity-60">
                  {t.emailSend}
                </button>
              </div>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} className="hidden" aria-hidden="true" />
              {emailState === "error" ? <p className="mt-2 text-[13px] font-bold text-rose-700">{t.emailError}</p> : null}
            </form>
          ) : (
            <button type="button" onClick={() => setEmailOpen(true)} className="flex min-h-[50px] items-center justify-center rounded-2xl bg-white text-[15px] font-black text-[#3a2e26] ring-1 ring-[#e3d9cc]">
              ✉️ {t.emailToggle}
            </button>
          )}
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Καλημέρα! Σχετικά με την εκδρομή μου (${area.title}):`)}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => emit("planner_whatsapp", { place: "plan" })}
            className="flex min-h-[50px] items-center justify-center rounded-2xl border border-[#cfe0cf] bg-[#f3f9f1] text-[15px] font-bold text-[#3f6b47]"
          >
            {t.askReception}
          </a>
        </div>
        <p className="mt-5 text-[12px] leading-5 text-[#8b7f75]">{t.disclaimer}</p>
      </div>

      {sheet !== null && sheetSlot !== null ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40" role="dialog" aria-modal="true" aria-label={t.sheetTitle} onClick={(event) => event.target === event.currentTarget && setSheetSlot(null)}>
          <div className="max-h-[82svh] w-full overflow-y-auto overflow-x-hidden rounded-t-[26px] bg-[#fffdf9] p-4 pb-8 shadow-2xl">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#e0d4c4]" aria-hidden="true" />
            <div className="flex items-center justify-between">
              <h2 className="tracking-[-0.02em] text-[22px] font-extrabold">{t.sheetTitle}: {t.kinds[sheet.kind].toLocaleLowerCase("el-GR")}</h2>
              <button type="button" onClick={() => setSheetSlot(null)} className="rounded-full px-3 py-1 text-[14px] font-bold text-[#6b5545]">{t.close}</button>
            </div>
            {sheet.kind === "beach" && hasForecast ? <p className="mt-1 text-[13px] text-[#8b7a6b]">{t.sheetBeachHint}</p> : null}
            <ul className="mt-3 grid grid-cols-1 gap-2 [&>li]:min-w-0">
              {sheetOptions.map((id) => {
                const place = getPlace(id);
                if (!place) return null;
                const selected = plan.picks[sheetSlot] === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => {
                        const picks = [...plan.picks];
                        picks[sheetSlot] = id;
                        updatePlan({ picks });
                        setSheetSlot(null);
                        emit("planner_stop_swap", { area: area.id, to: id, reason: "manual" });
                      }}
                      className={`flex w-full items-center gap-3 rounded-2xl p-2 text-left ring-1 ${selected ? "bg-[#f3ede4] ring-[#a7743f]" : "bg-white ring-[#e6dccf]"}`}
                    >
                      <PlacePhoto place={place} className="h-16 w-16 shrink-0 rounded-xl" sizes="64px" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[16px] font-bold text-[#2f2722]">{place.name}</span>
                        <span className="block truncate text-[13px] text-[#6c6057]">{place.summary}</span>
                        {place.kind === "beach" ? <span className="mt-1 block"><SeaChip seaDay={planSeaDay} beachId={id} compact /></span> : null}
                      </span>
                      {selected ? <span className="text-[18px] text-[#a7743f]">✓</span> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function slotOptionsCount(slot: { options: string[] }) {
  return slot.options.length;
}
