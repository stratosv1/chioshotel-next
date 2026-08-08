"use client";

import { useMemo, useState } from "react";
import type { BeachMaster } from "@/content/trip-planner/beaches";
import type { VillageMaster } from "@/content/trip-planner/villages";
import { beachRoutingById } from "@/content/trip-planner/beach-routing";
import { villageRoutingById } from "@/content/trip-planner/village-routing";
import { BeachTripPlanner } from "./BeachTripPlanner";

type Props = {
  beaches: BeachMaster[];
  villages: VillageMaster[];
  locale: string;
};

type PlannerKind = "beach" | "village";
type PlannerItem = {
  key: string;
  id: string;
  kind: PlannerKind;
  name: string;
  image: string | null;
  distanceKm: number;
  driveMin: number;
  duration?: string;
  family: boolean;
  quiet: boolean;
  cluster: string;
  coordinate: { lat: number; lng: number } | null;
};

type FilterId = "all" | "beaches" | "villages" | "family" | "nearby";
type DayPlans = [string[], string[], string[]];

const FILTERS: { id: FilterId; label: string; icon: string }[] = [
  { id: "all", label: "Όλα", icon: "✦" },
  { id: "beaches", label: "Παραλίες", icon: "🏖️" },
  { id: "villages", label: "Χωριά", icon: "🏡" },
  { id: "family", label: "Οικογένεια", icon: "👨‍👩‍👧" },
  { id: "nearby", label: "Χωρίς πολλή οδήγηση", icon: "🚗" },
];

const DAY_LABELS = ["Ημέρα 1", "Ημέρα 2", "Ημέρα 3"] as const;
const ORIGIN = { lat: 38.32178, lng: 26.13543 };

function mapsUrl(items: PlannerItem[]) {
  if (items.length === 0) return null;
  const points = items.filter((item) => item.coordinate);
  if (points.length === 0) return null;

  const destination = points[points.length - 1].coordinate!;
  const waypoints = points
    .slice(0, -1)
    .map((item) => `${item.coordinate!.lat},${item.coordinate!.lng}`)
    .join("|");
  const params = new URLSearchParams({
    api: "1",
    origin: `${ORIGIN.lat},${ORIGIN.lng}`,
    destination: `${destination.lat},${destination.lng}`,
    travelmode: "driving",
  });
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function TripPlanner({ beaches, villages, locale }: Props) {
  const isEl = locale === "el";

  if (!isEl) {
    return <BeachTripPlanner beaches={beaches} locale={locale} />;
  }

  return <GreekTripPlanner beaches={beaches} villages={villages} />;
}

function GreekTripPlanner({ beaches, villages }: Pick<Props, "beaches" | "villages">) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeDay, setActiveDay] = useState(0);
  const [mobileView, setMobileView] = useState<"suggestions" | "plan">("suggestions");
  const [days, setDays] = useState<DayPlans>([[], [], []]);

  const items = useMemo<PlannerItem[]>(() => {
    const beachItems = beaches.map((beach) => {
      const routing = beachRoutingById[beach.id];
      return {
        key: `beach:${beach.id}`,
        id: beach.id,
        kind: "beach" as const,
        name: beach.name,
        image: beach.image,
        distanceKm: routing?.distanceFromVoulamandisKm ?? 0,
        driveMin: routing?.driveTimeFromVoulamandisMin ?? 0,
        duration: beach.recommendedDuration,
        family: Boolean(beach.familyFit && beach.familyFit !== "not-recommended"),
        quiet: Boolean(beach.tags.includes("quiet") || beach.tags.includes("remote")),
        cluster: routing?.routeCluster ?? beach.region,
        coordinate: routing ? { lat: routing.coordinates.lat, lng: routing.coordinates.lng } : null,
      };
    });

    const villageItems = villages.map((village) => {
      const routing = villageRoutingById[village.id];
      return {
        key: `village:${village.id}`,
        id: village.id,
        kind: "village" as const,
        name: village.name,
        image: village.image,
        distanceKm: routing?.distanceFromVoulamandisKm ?? 0,
        driveMin: routing?.driveTimeFromVoulamandisMin ?? 0,
        duration: village.recommendedDuration,
        family: village.visitorFit.includes("οικογένειες") || village.tags.includes("family"),
        quiet: village.character.includes("ήσυχο") || village.tags.includes("quiet"),
        cluster: routing?.routeCluster ?? village.region,
        coordinate: routing ? { lat: routing.coordinates.lat, lng: routing.coordinates.lng } : null,
      };
    });

    return [...villageItems, ...beachItems];
  }, [beaches, villages]);

  const itemByKey = useMemo(() => new Map(items.map((item) => [item.key, item])), [items]);
  const selectedKeys = useMemo(() => new Set(days.flat()), [days]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter === "beaches") return item.kind === "beach";
      if (filter === "villages") return item.kind === "village";
      if (filter === "family") return item.family;
      if (filter === "nearby") return item.distanceKm > 0 && item.distanceKm <= 15;
      return true;
    });
  }, [filter, items]);

  const totalStops = days.reduce((sum, day) => sum + day.length, 0);
  const totalDrive = days.reduce(
    (sum, day) => sum + day.reduce((daySum, key) => daySum + (itemByKey.get(key)?.driveMin ?? 0), 0),
    0,
  );

  const addToDay = (key: string, dayIndex: number) => {
    setDays((current) => {
      const next: DayPlans = [
        current[0].filter((item) => item !== key),
        current[1].filter((item) => item !== key),
        current[2].filter((item) => item !== key),
      ];
      next[dayIndex] = [...next[dayIndex], key];
      return next;
    });
  };

  const removeFromDay = (key: string, dayIndex: number) => {
    setDays((current) => {
      const next: DayPlans = [[...current[0]], [...current[1]], [...current[2]]];
      next[dayIndex] = next[dayIndex].filter((item) => item !== key);
      return next;
    });
  };

  const moveToIndex = (key: string, dayIndex: number, targetIndex: number) => {
    setDays((current) => {
      const next: DayPlans = [
        current[0].filter((item) => item !== key),
        current[1].filter((item) => item !== key),
        current[2].filter((item) => item !== key),
      ];
      const bounded = Math.max(0, Math.min(targetIndex, next[dayIndex].length));
      next[dayIndex].splice(bounded, 0, key);
      return next;
    });
  };

  const activeItems = days[activeDay].map((key) => itemByKey.get(key)).filter(Boolean) as PlannerItem[];
  const activeMapsUrl = mapsUrl(activeItems);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fcfaf6_0%,#f8f3eb_38%,#faf7f1_100%)] text-[#30271f]">
      <section className="border-b border-[#eadfce] bg-[#fcfaf6]/95">
        <div className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9d8061]">Chios Trip Planner</p>
              <h1 className="font-serif text-3xl tracking-tight text-[#2e251e] sm:text-4xl lg:text-[44px] lg:leading-[1.05]">Φτιάξε το πρόγραμμά σου στη Χίο</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#74675b] sm:text-[15px]">Διάλεξε ημέρα, πρόσθεσε στάσεις και οργάνωσε το ταξίδι σου χωρίς να γεμίσεις τη μέρα με άσκοπες μετακινήσεις.</p>
            </div>

            <div className="grid grid-cols-3 divide-x divide-[#eadfce] rounded-2xl border border-[#e5d9c9] bg-white/95 px-1 py-3 shadow-[0_8px_24px_rgba(90,68,45,0.05)] sm:min-w-[330px]">
              <SummaryStat icon="📅" value="3" label="ημέρες" />
              <SummaryStat icon="📍" value={String(totalStops)} label="στάσεις" />
              <SummaryStat icon="🚗" value={totalDrive ? `~${Math.max(1, Math.round(totalDrive / 60))} ώρ.` : "0 ώρ."} label="οδήγηση*" />
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${filter === item.id ? "border-[#9f7d59] bg-[#8f6f4f] text-white shadow-sm" : "border-[#e2d6c7] bg-white/90 text-[#574b40] hover:border-[#c9ae8d] hover:bg-white"}`}
              >
                <span className="mr-1.5">{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1580px] px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
        <div className="lg:hidden">
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[#e2d6c7] bg-white shadow-sm">
            {DAY_LABELS.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveDay(index)}
                className={`min-h-12 px-2 text-sm font-medium transition ${activeDay === index ? "bg-[#8f6f4f] text-white" : "text-[#584c41]"}`}
              >
                {label}
                {days[index].length > 0 && <span className="ml-1 text-xs opacity-80">({days[index].length})</span>}
              </button>
            ))}
          </div>

          <p className="mt-2 text-center text-xs font-medium text-[#8b7968]">Οι νέες στάσεις θα προστεθούν στην <strong className="text-[#6f5438]">{DAY_LABELS[activeDay]}</strong>.</p>

          <div className="mt-3 grid grid-cols-2 rounded-2xl border border-[#e2d6c7] bg-white p-1 shadow-sm">
            <button type="button" onClick={() => setMobileView("suggestions")} className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${mobileView === "suggestions" ? "bg-[#eee2d3] text-[#624a32]" : "text-[#796c5f]"}`}>Προτάσεις</button>
            <button type="button" onClick={() => setMobileView("plan")} className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${mobileView === "plan" ? "bg-[#eee2d3] text-[#624a32]" : "text-[#796c5f]"}`}>Πρόγραμμα ({days[activeDay].length})</button>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:mt-0 lg:grid-cols-[430px_minmax(0,1fr)] xl:grid-cols-[470px_minmax(0,1fr)]">
          <section className={`${mobileView === "plan" ? "hidden lg:block" : "block"}`}>
            <div className="rounded-[24px] border border-[#e2d6c8] bg-white/95 p-4 shadow-[0_12px_32px_rgba(88,65,42,0.055)] sm:p-5">
              <div className="mb-4 border-b border-[#f0e7dc] pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a48a6e]">Browse</p>
                    <h2 className="mt-1 font-serif text-[25px] text-[#342a22]">Προτεινόμενες επιλογές</h2>
                  </div>
                  <span className="rounded-full bg-[#f5efe7] px-3 py-1 text-xs font-semibold text-[#816c56]">{filteredItems.length}</span>
                </div>
                <p className="mt-1.5 text-sm text-[#8a7d70] lg:hidden">Πάτησε «Προσθήκη» και η στάση θα μπει στην {DAY_LABELS[activeDay]}.</p>
                <p className="mt-1.5 hidden text-sm text-[#8a7d70] lg:block">Σύρε μια στάση σε μία ημέρα ή πάτησε Προσθήκη.</p>
              </div>

              <div className="space-y-2.5 lg:max-h-[680px] lg:overflow-y-auto lg:pr-1.5">
                {filteredItems.map((item) => {
                  const selected = selectedKeys.has(item.key);
                  return (
                    <div
                      key={item.key}
                      draggable={!selected}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", item.key);
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      className={`group flex w-full items-center gap-3 rounded-2xl border px-2.5 py-2.5 text-left transition ${selected ? "border-[#e4ddd4] bg-[#f7f4ef] opacity-65" : "border-[#ece3d8] bg-white hover:-translate-y-px hover:border-[#cfb89b] hover:shadow-[0_8px_18px_rgba(94,70,46,0.07)]"}`}
                    >
                      <div className="hidden shrink-0 cursor-grab text-base leading-none text-[#c0b2a2] lg:block">⋮⋮</div>
                      <StopThumb item={item} compact={false} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <p className="font-semibold leading-5 text-[#3f342b]">{item.name}</p>
                          <span className="mt-0.5 shrink-0 rounded-full bg-[#f6f0e8] px-1.5 py-0.5 text-[10px] text-[#8d7459]">{item.kind === "beach" ? "Παραλία" : "Χωριό"}</span>
                        </div>
                        <p className="mt-1 text-xs text-[#8b7b6d]">{item.distanceKm || "–"} km · ~{item.driveMin || "–"}′</p>
                        {item.duration && <p className="mt-0.5 line-clamp-1 text-[11px] leading-4 text-[#a09082]">{item.duration}</p>}
                      </div>
                      <button
                        type="button"
                        disabled={selected}
                        onClick={() => addToDay(item.key, activeDay)}
                        className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition ${selected ? "cursor-default bg-[#ece7e0] text-[#897b6e]" : "border border-[#dbc6aa] bg-[#fffaf3] text-[#805c35] hover:border-[#9f7d59] hover:bg-[#8f6f4f] hover:text-white active:scale-[0.98]"}`}
                      >
                        {selected ? "✓ Στο πρόγραμμα" : <><span className="lg:hidden">+ {DAY_LABELS[activeDay]}</span><span className="hidden lg:inline">Προσθήκη</span></>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className={`${mobileView === "suggestions" ? "hidden lg:block" : "block"}`}>
            <div className="rounded-[24px] border border-[#dfd1c0] bg-[#f5efe7] p-3 shadow-[0_14px_36px_rgba(88,65,42,0.06)] sm:p-4">
              <div className="mb-3 flex flex-col gap-3 rounded-2xl bg-white/85 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a48a6e]">Workspace</p>
                  <h2 className="mt-1 font-serif text-[25px] text-[#342a22]">Το πρόγραμμά μου</h2>
                  <p className="mt-1 text-xs text-[#8a7d70] sm:text-sm">{DAY_LABELS[activeDay]} ενεργή · στο mobile με tap, στο desktop και με drag.</p>
                </div>
                <div className="hidden items-center gap-2 lg:flex">
                  {activeMapsUrl && (
                    <a href={activeMapsUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-xl border border-[#d8c5ab] bg-white px-3.5 py-2 text-xs font-semibold text-[#765533] shadow-sm transition hover:bg-[#fffaf3]">📍 Google Maps · {DAY_LABELS[activeDay]}</a>
                  )}
                </div>
              </div>

              <div className="hidden gap-3 lg:grid lg:grid-cols-3">
                {DAY_LABELS.map((label, dayIndex) => (
                  <DayColumn
                    key={label}
                    label={label}
                    dayIndex={dayIndex}
                    keys={days[dayIndex]}
                    itemByKey={itemByKey}
                    onDropKey={(key) => addToDay(key, dayIndex)}
                    onMoveToIndex={(key, targetIndex) => moveToIndex(key, dayIndex, targetIndex)}
                    onRemove={(key) => removeFromDay(key, dayIndex)}
                    onActivate={() => setActiveDay(dayIndex)}
                    active={activeDay === dayIndex}
                  />
                ))}
              </div>

              <div className="rounded-2xl bg-white p-3 lg:hidden">
                <MobileDayPlan
                  label={DAY_LABELS[activeDay]}
                  keys={days[activeDay]}
                  itemByKey={itemByKey}
                  onRemove={(key) => removeFromDay(key, activeDay)}
                  onMove={(key, direction) => {
                    const list = days[activeDay];
                    const index = list.indexOf(key);
                    moveToIndex(key, activeDay, direction === "up" ? index - 1 : index + 1);
                  }}
                />

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setMobileView("suggestions")} className="min-h-12 rounded-xl border border-[#dac9b5] bg-white px-4 text-sm font-semibold text-[#6e5944]">+ Προσθήκη στάσης</button>
                  {activeMapsUrl ? (
                    <a href={activeMapsUrl} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center rounded-xl bg-[#8f6f4f] px-4 text-center text-sm font-semibold text-white">🗺️ Χάρτης</a>
                  ) : (
                    <span className="flex min-h-12 items-center justify-center rounded-xl bg-[#eee8df] px-4 text-sm font-semibold text-[#9a8b7c]">🗺️ Χάρτης</span>
                  )}
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-[#e5d8c8] bg-white/80 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs leading-5 text-[#817466]">{totalStops === 0 ? "Ξεκίνα επιλέγοντας μία ημέρα και πρόσθεσε την πρώτη στάση." : `${totalStops} στάσεις σε 3 ημέρες · εκτιμήσεις σχεδιασμού από το Voulamandis House.`}</p>
                  <div className="text-xs font-semibold text-[#765b3f]">🚗 ~{totalDrive}′ συνολικά</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {mobileView === "suggestions" && totalStops > 0 && (
        <button
          type="button"
          onClick={() => setMobileView("plan")}
          className="fixed inset-x-4 bottom-4 z-40 flex min-h-14 items-center justify-between rounded-2xl bg-[#6f5438] px-5 text-sm font-semibold text-white shadow-2xl lg:hidden"
        >
          <span>Δες το πρόγραμμα</span>
          <span>{DAY_LABELS[activeDay]} · {days[activeDay].length} στάσεις →</span>
        </button>
      )}
    </main>
  );
}

function SummaryStat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 px-2">
      <span className="text-base opacity-80">{icon}</span>
      <span><strong className="block text-base leading-5 text-[#3f342a]">{value}</strong><small className="text-[10px] text-[#8a7b6d]">{label}</small></span>
    </div>
  );
}

function StopThumb({ item, compact = true }: { item: PlannerItem; compact?: boolean }) {
  const size = compact ? "h-12 w-16" : "h-[58px] w-[82px] sm:h-[60px] sm:w-[88px]";
  return (
    <div className={`${size} relative shrink-0 overflow-hidden rounded-xl border border-white/70 bg-gradient-to-br from-[#e1d4c3] via-[#c8d0c5] to-[#8fa7a1] shadow-sm`}>
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.75),transparent_26%),linear-gradient(145deg,#d8cbb9,#b7c7bf_55%,#91aaa4)] p-2">
          <span className="rounded-md bg-white/75 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#6d655b] backdrop-blur">{item.kind === "beach" ? "Beach" : "Village"}</span>
        </div>
      )}
    </div>
  );
}

function DayColumn({
  label,
  keys,
  itemByKey,
  onDropKey,
  onMoveToIndex,
  onRemove,
  onActivate,
  active,
}: {
  label: string;
  dayIndex: number;
  keys: string[];
  itemByKey: Map<string, PlannerItem>;
  onDropKey: (key: string) => void;
  onMoveToIndex: (key: string, targetIndex: number) => void;
  onRemove: (key: string) => void;
  onActivate: () => void;
  active: boolean;
}) {
  const items = keys.map((key) => itemByKey.get(key)).filter(Boolean) as PlannerItem[];

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        event.preventDefault();
        const key = event.dataTransfer.getData("text/plain");
        if (key) onDropKey(key);
      }}
      onClick={onActivate}
      className={`relative overflow-hidden rounded-2xl border p-3 transition ${active ? "border-[#a67f55] bg-[#fffaf3] shadow-[0_10px_26px_rgba(115,83,50,0.11)] ring-1 ring-[#c8a67d]/40" : "border-[#e3d8ca] bg-white/75 hover:border-[#cfb89b]"}`}
    >
      {active && <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8f6f4f] via-[#b28a5f] to-[#d0b18a]" />}
      <div className="flex min-h-9 items-center justify-between gap-2 px-1 pb-2 pt-0.5">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-[19px] text-[#44372c]">{label}</h3>
          {active && <span className="rounded-full bg-[#8f6f4f] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">Ενεργή</span>}
        </div>
        <span className="rounded-full bg-[#f4eee6] px-2.5 py-1 text-[11px] font-semibold text-[#7e6c59]">{items.length}</span>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.key}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("text/plain", item.key);
              event.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const key = event.dataTransfer.getData("text/plain");
              if (key) onMoveToIndex(key, index);
            }}
            className="group flex cursor-grab items-center gap-2 rounded-xl border border-[#e9dfd3] bg-white p-2 shadow-[0_4px_12px_rgba(83,62,43,0.045)] transition hover:border-[#d4bea2] hover:shadow-[0_7px_16px_rgba(83,62,43,0.07)] active:cursor-grabbing"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#9a744c] text-[11px] font-bold text-white">{index + 1}</span>
            <StopThumb item={item} compact />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-4 text-[#44382e]">{item.name}</p>
              <p className="mt-1 text-[11px] text-[#907f70]">{item.distanceKm} km · ~{item.driveMin}′</p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#a1876b]">{item.kind === "beach" ? "Παραλία" : "Χωριό"}</p>
            </div>
            <button type="button" onClick={(event) => { event.stopPropagation(); onRemove(item.key); }} className="rounded-lg px-2 py-1 text-xs text-[#a08369] opacity-60 transition hover:bg-[#f5eee6] hover:opacity-100">×</button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="mt-1 flex min-h-[130px] items-center justify-center rounded-xl border border-dashed border-[#d9c6ae] bg-white/55 px-4 text-center text-xs leading-5 text-[#978674]">Σύρε εδώ μια στάση<br />ή επίλεξε την ημέρα και πάτησε «Προσθήκη».</div>
      )}

      <div className={`mt-2.5 rounded-xl border border-dashed px-3 py-2 text-center text-[11px] font-semibold ${active ? "border-[#c5a276] bg-[#fff7ec] text-[#76532f]" : "border-[#d9c7ae] text-[#8b6b49]"}`}>{active ? "✓ Οι νέες στάσεις μπαίνουν εδώ" : "+ Επίλεξε αυτή την ημέρα"}</div>
    </div>
  );
}

function MobileDayPlan({
  label,
  keys,
  itemByKey,
  onRemove,
  onMove,
}: {
  label: string;
  keys: string[];
  itemByKey: Map<string, PlannerItem>;
  onRemove: (key: string) => void;
  onMove: (key: string, direction: "up" | "down") => void;
}) {
  const items = keys.map((key) => itemByKey.get(key)).filter(Boolean) as PlannerItem[];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif text-xl text-[#44372c]">{label}</h3>
        <span className="rounded-full bg-[#f2e7d9] px-2.5 py-1 text-xs font-semibold text-[#7c603f]">{items.length} στάσεις</span>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-[#d9c7b1] bg-[#fcfaf6] px-8 text-center text-sm leading-6 text-[#92816f]">Πήγαινε στις «Προτάσεις» και πάτησε «+ {label}» για να προσθέσεις την πρώτη στάση.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.key} className="flex items-center gap-3 rounded-2xl border border-[#e6dacd] bg-white p-3 shadow-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#9a744c] text-xs font-bold text-white">{index + 1}</span>
              <StopThumb item={item} compact={false} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-5 text-[#40352c]">{item.name}</p>
                <p className="mt-1 text-xs text-[#8c7c6d]">{item.distanceKm} km · ~{item.driveMin}′</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#a1876b]">{item.kind === "beach" ? "Παραλία" : "Χωριό"}</p>
                <div className="mt-2 flex gap-1.5">
                  <button type="button" disabled={index === 0} onClick={() => onMove(item.key, "up")} className="rounded-lg border border-[#e4d8ca] px-2.5 py-1.5 text-xs disabled:opacity-30">↑</button>
                  <button type="button" disabled={index === items.length - 1} onClick={() => onMove(item.key, "down")} className="rounded-lg border border-[#e4d8ca] px-2.5 py-1.5 text-xs disabled:opacity-30">↓</button>
                  <button type="button" onClick={() => onRemove(item.key)} className="rounded-lg border border-[#eadfd3] px-2.5 py-1.5 text-xs text-[#976f56]">Αφαίρεση</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
