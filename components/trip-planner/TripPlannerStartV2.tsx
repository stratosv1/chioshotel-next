"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  beaches,
  villages,
  beachRoutingById,
  villageRoutingById,
} from "@/content/trip-planner";
import { applyTripPlannerMedia } from "@/content/trip-planner/media";
import {
  plannerExtraPlaces,
  type PlannerExtraPlace,
} from "@/content/trip-planner/extra-places";

type CategoryId = "beach" | "village" | "food" | "drink" | "sights";
type RegionId = "NW" | "NE" | "SW" | "SE";
type RegionChoice = RegionId | "auto";
type Step = "activities" | "region" | "places" | "summary";

type Category = {
  id: CategoryId;
  label: string;
  singular: string;
  plural: string;
  image: string;
  icon: ReactNode;
  wideOnMobile?: boolean;
};

type ForecastSummary = {
  startTime: string | null;
  endTime: string | null;
  temperatureC: number | null;
  weatherCode: number | null;
  waveHeightMAvg: number | null;
  waveHeightMMax: number | null;
  waveDirectionDeg: number | null;
  wavePeriodSAvg: number | null;
  windWaveHeightMAvg: number | null;
  windSpeedKmhAvg: number | null;
  windSpeedKmhMax: number | null;
  windDirectionDeg: number | null;
  windGustsKmhMax: number | null;
};

type MarineRankedBeach = {
  beachId: string;
  name: string;
  score: number;
  rating: "excellent" | "good" | "fair" | "poor" | "not-recommended";
  dataQuality: "full" | "partial" | "limited";
  reasonCodes: string[];
  spatialConfidence: "high" | "medium" | "low";
  exposureConfidence: "medium" | "medium-high" | "high" | null;
  forecastSummary: ForecastSummary;
};

type MarineResponse = {
  ok: boolean;
  ranked?: MarineRankedBeach[];
};

type ChosenPlaces = Record<CategoryId, string[]>;

type PlaceOption = {
  id: string;
  name: string;
  image: string | null;
  meta: string;
  category: CategoryId;
  weather?: MarineRankedBeach;
};

const plannerMedia = applyTripPlannerMedia(beaches, villages);
const beachItems = plannerMedia.beaches;
const villageItems = plannerMedia.villages;

const PLACE_ORDER: CategoryId[] = ["beach", "village", "sights", "food", "drink"];
const MULTI_SELECT = new Set<CategoryId>(["beach", "village", "sights"]);
const REGION_IDS: RegionId[] = ["NW", "NE", "SW", "SE"];

const emptyChosenPlaces = (): ChosenPlaces => ({
  beach: [],
  village: [],
  sights: [],
  food: [],
  drink: [],
});

const iconClass = "h-5 w-5 stroke-[1.65] md:h-6 md:w-6";

const BeachIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
    <path d="M4 12c1.7-4.3 5-6.6 8-6.6 3.1 0 6.3 2.3 8 6.6M12 5.4V19M7.5 12c.6-3.2 2.1-5.3 4.5-6.6M16.5 12c-.6-3.2-2.1-5.3-4.5-6.6M9.4 19h5.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VillageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
    <path d="M3.8 10.8 12 4l8.2 6.8V20H3.8v-9.2Z" stroke="currentColor" strokeLinejoin="round" />
    <path d="M9.3 20v-6h5.4v6" stroke="currentColor" />
  </svg>
);

const FoodIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
    <path d="M6 3v7M9 3v7M6 7h3M7.5 10v11M16 3v18M16 3c2.4 2.5 2.6 6 .8 8.8" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const DrinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
    <path d="M5 4h14l-7 8-7-8ZM12 12v7M8.5 20h7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SightsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
    <path d="m4 8 8-4 8 4H4ZM5.5 9.5h13M7 10v7M10.3 10v7M13.7 10v7M17 10v7M4 19h16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const categories: Category[] = [
  { id: "beach", label: "Παραλία", singular: "παραλία", plural: "παραλίες", image: "/images/beaches/karfas-beach-chios-vertical.webp", icon: <BeachIcon /> },
  { id: "village", label: "Χωριό", singular: "χωριό", plural: "χωριά", image: "/images/chios-guide/9ac4cf44d16c4af6d873c5bba4a6696b_L.webp", icon: <VillageIcon /> },
  { id: "food", label: "Φαγητό", singular: "φαγητό", plural: "επιλογές φαγητού", image: "/images/taste/d8765ffe-dbf2-496c-9190-f1fb82e6318a.webp", icon: <FoodIcon /> },
  { id: "drink", label: "Ποτό", singular: "ποτό", plural: "επιλογές ποτού", image: "/images/taste/asteri.jpg", icon: <DrinkIcon /> },
  { id: "sights", label: "Αξιοθέατα", singular: "αξιοθέατο", plural: "αξιοθέατα", image: "/images/chios-guide/ag-markella.jpg", icon: <SightsIcon />, wideOnMobile: true },
];

const categoryById = Object.fromEntries(categories.map((item) => [item.id, item])) as Record<CategoryId, Category>;

const regionOptions: Array<{ id: RegionId; label: string; title: string; position: string }> = [
  { id: "NW", label: "ΒΔ", title: "Βορειοδυτικά", position: "col-start-1 row-start-1" },
  { id: "NE", label: "ΒΑ", title: "Βορειοανατολικά", position: "col-start-3 row-start-1" },
  { id: "SW", label: "ΝΔ", title: "Νοτιοδυτικά", position: "col-start-1 row-start-3" },
  { id: "SE", label: "ΝΑ", title: "Νοτιοανατολικά", position: "col-start-3 row-start-3" },
];

const regionName = (region: RegionChoice | null) => {
  if (region === "auto") return "Αυτόματη πρόταση";
  return regionOptions.find((item) => item.id === region)?.title ?? "";
};

const forecastTimeWindow = (summary: ForecastSummary) => {
  const start = summary.startTime?.slice(11, 16) ?? null;
  const end = summary.endTime?.slice(11, 16) ?? null;
  if (start && end) return `${start}–${end}`;
  if (start) return `από ${start}`;
  return null;
};

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 text-[#8b5e34] md:gap-3">
      <svg viewBox="0 0 52 48" className="h-8 w-9 md:h-9 md:w-10" fill="none" aria-hidden="true">
        <path d="M8 30c6-3 11-4 18-4s12 1 18 4M11 36c5-2 10-3 15-3 6 0 11 1 15 3M14 41c4-1.3 8-2 12-2s8 .7 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 10v7M14.5 14.5l5 5M37.5 14.5l-5 5M8 25h7M37 25h7M16 24c1.8-4.6 5.4-7 10-7s8.2 2.4 10 7" stroke="#c88745" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="leading-none">
        <div className="font-serif text-[16px] tracking-[0.16em] text-[#4b382d] md:text-[18px]">CHIOS</div>
        <div className="mt-1 text-[7px] font-semibold tracking-[0.22em] text-[#8b5e34] md:text-[8px]">TRIP PLANNER</div>
      </div>
    </div>
  );
}

function CategoryCard({ category, selected, onToggle }: { category: Category; selected: boolean; onToggle: () => void }) {
  return (
    <button type="button" aria-pressed={selected} onClick={onToggle} className={`group relative min-w-0 overflow-hidden rounded-[15px] border bg-white text-left shadow-[0_7px_20px_rgba(65,48,36,.065)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#aeb39a]/60 md:rounded-[18px] ${category.wideOnMobile ? "col-span-2 md:col-span-1" : ""} ${selected ? "border-[#c49a61] bg-[#fdfbf7] ring-2 ring-[#c49a61]/20" : "border-[#e7ded3] hover:-translate-y-0.5 hover:border-[#d6c3af]"}`}>
      <div className={`relative overflow-hidden bg-[#eee5db] ${category.wideOnMobile ? "h-[104px] md:h-auto md:aspect-[1.18/1]" : "h-[98px] sm:h-[108px] md:h-auto md:aspect-[1.18/1]"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={category.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
        {selected ? <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#c28a4c] text-white shadow-md">✓</span> : null}
      </div>
      <div className="relative flex min-h-[48px] items-end justify-center px-2.5 pb-2.5 pt-5 md:min-h-[82px] md:pb-5 md:pt-10">
        <span className="absolute -top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd3] bg-white text-[#3c3029] shadow-sm md:-top-7 md:h-14 md:w-14">{category.icon}</span>
        <span className="text-center text-[13px] font-semibold text-[#2f2722] md:text-[18px]">{category.label}</span>
      </div>
    </button>
  );
}

function beachRegion(beachId: string): RegionId | null {
  const cluster = beachRoutingById[beachId]?.routeCluster;
  if (!cluster) return null;
  if (["west-lithi-anavatos", "northwest-volissos", "north-amani"].includes(cluster)) return "NW";
  if (["vrontados-coast", "northeast-kardamyla"].includes(cluster)) return "NE";
  if (cluster === "south-mesta-olympoi") return "SW";
  if (["south-pyrgi-emporios", "near-city-south"].includes(cluster)) return "SE";
  return null;
}

function villageRegion(villageId: string): RegionId | null {
  const village = villageItems.find((item) => item.id === villageId);
  const routing = villageRoutingById[villageId];
  if (!village) return null;
  if (village.region === "northwest" || village.region === "west-central") return "NW";
  if (village.region === "northeast") return "NE";
  if (village.region === "south") return (routing?.coordinates.lng ?? 26) < 25.98 ? "SW" : "SE";
  if (village.region === "central") return (routing?.coordinates.lng ?? 26.02) < 26.02 ? "NW" : "SE";
  return null;
}

const directionLabel = (degrees: number | null) => {
  if (degrees === null || !Number.isFinite(degrees)) return "–";
  const labels = ["Β", "ΒΑ", "Α", "ΝΑ", "Ν", "ΝΔ", "Δ", "ΒΔ"];
  return labels[Math.round((((degrees % 360) + 360) % 360) / 45) % 8];
};

const weatherLabel = (code: number | null) => {
  if (code === null) return "Πρόγνωση";
  if (code === 0) return "Καθαρός";
  if (code <= 3) return "Λίγες νεφώσεις";
  if (code === 45 || code === 48) return "Ομίχλη";
  if (code >= 51 && code <= 67) return "Βροχή";
  if (code >= 80 && code <= 82) return "Μπόρες";
  if (code >= 95) return "Καταιγίδες";
  return "Μεταβλητός";
};

const ratingLabel = (rating: MarineRankedBeach["rating"]) => ({
  excellent: "Εξαιρετική σήμερα",
  good: "Καλή σήμερα",
  fair: "Μέτρια σήμερα",
  poor: "Δύσκολη σήμερα",
  "not-recommended": "Όχι ιδανική σήμερα",
}[rating]);

const ratingClasses = (rating: MarineRankedBeach["rating"]) => {
  if (rating === "excellent") return "bg-[#e7f1e4] text-[#466342] border-[#c9dec4]";
  if (rating === "good") return "bg-[#eef1e5] text-[#66704e] border-[#d5ddc6]";
  if (rating === "fair") return "bg-[#fff4df] text-[#866638] border-[#ead5ae]";
  return "bg-[#f7e8e4] text-[#8b5148] border-[#e4c7c0]";
};

const confidenceLabel = (confidence: MarineRankedBeach["spatialConfidence"]) => {
  if (confidence === "high") return "Υψηλή";
  if (confidence === "medium") return "Μέτρια";
  return "Χαμηλότερη";
};

function SelectionStrip({ selectedCategories, region, chosenPlaces }: { selectedCategories: CategoryId[]; region: RegionChoice | null; chosenPlaces: ChosenPlaces }) {
  const chips: Array<{ key: string; label: string }> = [];
  if (region) chips.push({ key: "region", label: `🧭 ${regionName(region)}` });

  const namesFor = (category: CategoryId, ids: string[]) => {
    if (category === "beach") return ids.map((id) => beachItems.find((item) => item.id === id)?.name).filter(Boolean) as string[];
    if (category === "village") return ids.map((id) => villageItems.find((item) => item.id === id)?.name).filter(Boolean) as string[];
    return ids.map((id) => plannerExtraPlaces.find((item) => item.id === id)?.name).filter(Boolean) as string[];
  };

  const emojis: Record<CategoryId, string> = { beach: "🏖", village: "🏡", sights: "🏛", food: "🍽", drink: "🍸" };
  selectedCategories.forEach((category) => {
    const names = namesFor(category, chosenPlaces[category]);
    if (names.length) names.forEach((name, index) => chips.push({ key: `${category}-${index}-${name}`, label: `${emojis[category]} ${name}` }));
    else chips.push({ key: `pending-${category}`, label: `${emojis[category]} ${categoryById[category].label}` });
  });

  return (
    <div className="sticky top-0 z-30 border-b border-[#e8dfd4] bg-[#fffdf9]/95 backdrop-blur">
      <div className="mx-auto flex w-[min(1260px,calc(100%_-_24px))] items-center gap-2 py-2 md:w-[min(1260px,calc(100%_-_48px))]">
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.16em] text-[#aa8660] md:text-[10px]">Η εκδρομή σου</span>
        <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
          {chips.map((chip) => <span key={chip.key} className="shrink-0 rounded-full border border-[#e3d8ca] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#665548] shadow-sm md:text-[11px]">{chip.label}</span>)}
        </div>
      </div>
    </div>
  );
}

function BeachWeatherCard({ weather }: { weather: MarineRankedBeach }) {
  const summary = weather.forecastSummary;
  const sheltered = weather.reasonCodes.includes("directionally-sheltered");
  const exposed = weather.reasonCodes.includes("directionally-exposed");
  const timeWindow = forecastTimeWindow(summary);

  return (
    <div className="mt-3 rounded-xl border border-[#e6dfd3] bg-[#faf8f3] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${ratingClasses(weather.rating)}`}>{ratingLabel(weather.rating)}</span>
        {timeWindow ? <span className="text-[10px] font-bold text-[#a08266]">Καλύτερα {timeWindow}</span> : null}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-[#6f6257]">
        {summary.temperatureC !== null ? <span>🌡 {Math.round(summary.temperatureC)}°C</span> : null}
        <span>🌤 {weatherLabel(summary.weatherCode)}</span>
        <span>💨 {summary.windSpeedKmhAvg !== null ? `${Math.round(summary.windSpeedKmhAvg)} km/h ${directionLabel(summary.windDirectionDeg)}` : "–"}</span>
      </div>

      {(sheltered || exposed) ? (
        <p className={`mt-2 text-[10px] font-semibold leading-4 ${sheltered ? "text-[#5f7657]" : "text-[#94624f]"}`}>
          {sheltered ? "✓ Σχετικά προστατευμένη ακτή για τη σημερινή διεύθυνση κύματος." : "△ Πιο εκτεθειμένη ακτή στη σημερινή διεύθυνση κύματος."}
        </p>
      ) : null}

      <details className="mt-2 border-t border-[#e7dfd5] pt-2 text-[10px] text-[#817367]">
        <summary className="cursor-pointer select-none font-semibold text-[#776859]">Γιατί αυτή η πρόταση;</summary>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 leading-4">
          <span>Score μοντέλου {weather.score}/100</span>
          <span>Ριπές {summary.windGustsKmhMax !== null ? `${Math.round(summary.windGustsKmhMax)} km/h` : "–"}</span>
          <span>Κύμα μοντέλου {summary.waveHeightMAvg !== null ? `${summary.waveHeightMAvg.toFixed(1)} m · ${directionLabel(summary.waveDirectionDeg)}` : "–"}</span>
          <span>Περίοδος {summary.wavePeriodSAvg !== null ? `${summary.wavePeriodSAvg.toFixed(1)}s` : "–"}</span>
          <span>Ανεμοκύμα {summary.windWaveHeightMAvg !== null ? `${summary.windWaveHeightMAvg.toFixed(1)} m` : "–"}</span>
          <span>Μέγ. κύμα {summary.waveHeightMMax !== null ? `${summary.waveHeightMMax.toFixed(1)} m` : "–"}</span>
        </div>
        <p className="mt-2 text-[9px] leading-3.5 text-[#9a8c7e]">Βεβαιότητα πρόγνωσης ακτής: {confidenceLabel(weather.spatialConfidence)} · πρόγνωση + έκθεση ακτής, όχι live μέτρηση.</p>
      </details>
    </div>
  );
}

function GenericPlaceVisual({ category }: { category: CategoryId }) {
  const symbol = category === "sights" ? "⌂" : category === "food" ? "⌘" : "◇";
  return <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.85),transparent_28%),linear-gradient(145deg,#e8ddcf,#d7dfd2_55%,#b9c3ae)] text-3xl text-[#9b8063]">{symbol}</div>;
}

function PlaceImage({ src, name, category }: { src: string | null; name: string; category: CategoryId }) {
  if (!src) return <GenericPlaceVisual category={category} />;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-xl" loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="relative z-[1] block h-full w-full object-contain" loading="lazy" />
    </>
  );
}

export default function TripPlannerStartV2() {
  const [selected, setSelected] = useState<CategoryId[]>(["beach"]);
  const [step, setStep] = useState<Step>("activities");
  const [region, setRegion] = useState<RegionChoice | null>(null);
  const [placeCategoryIndex, setPlaceCategoryIndex] = useState(0);
  const [chosenPlaces, setChosenPlaces] = useState<ChosenPlaces>(emptyChosenPlaces);
  const [marineStatus, setMarineStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [marineRanking, setMarineRanking] = useState<MarineRankedBeach[]>([]);

  const selectedLabels = useMemo(() => categories.filter((item) => selected.includes(item.id)).map((item) => item.label), [selected]);
  const placeCategories = useMemo(() => PLACE_ORDER.filter((id) => selected.includes(id)), [selected]);
  const currentCategory = placeCategories[placeCategoryIndex] ?? null;
  const marineById = useMemo(() => new Map(marineRanking.map((item) => [item.beachId, item])), [marineRanking]);

  useEffect(() => {
    const needsMarine = step === "region" || currentCategory === "beach";
    if (!needsMarine || marineRanking.length > 0) return;
    const controller = new AbortController();
    setMarineStatus("loading");
    fetch("/api/trip-planner/marine", { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as MarineResponse;
        if (!response.ok || !payload.ok || !Array.isArray(payload.ranked)) throw new Error("forecast unavailable");
        setMarineRanking(payload.ranked);
        setMarineStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMarineStatus("error");
      });
    return () => controller.abort();
  }, [step, currentCategory, marineRanking.length]);

  const regionRankings = useMemo(() => {
    return REGION_IDS.map((id) => {
      const candidates = marineRanking.filter((item) => beachRegion(item.beachId) === id).sort((a, b) => b.score - a.score);
      const top = candidates.slice(0, 3);
      const score = top.length ? Math.round(top.reduce((sum, item) => sum + item.score, 0) / top.length) : null;
      return { id, score, topBeach: candidates[0] ?? null };
    }).sort((a, b) => {
      const averageDifference = (b.score ?? -1) - (a.score ?? -1);
      if (averageDifference !== 0) return averageDifference;
      return (b.topBeach?.score ?? -1) - (a.topBeach?.score ?? -1);
    });
  }, [marineRanking]);

  const recommendedRegion = regionRankings[0]?.score !== null ? regionRankings[0]?.id ?? null : null;
  const recommendedRegionInfo = regionRankings.find((item) => item.id === recommendedRegion) ?? null;
  const recommendedWindow = recommendedRegionInfo?.topBeach ? forecastTimeWindow(recommendedRegionInfo.topBeach.forecastSummary) : null;

  const placeOptions = useMemo<PlaceOption[]>(() => {
    if (!currentCategory) return [];
    if (currentCategory === "beach") {
      return beachItems
        .filter((item) => region === "auto" || !region || beachRegion(item.id) === region)
        .map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          meta: item.character?.[0] ?? "Παραλία Χίου",
          category: "beach" as const,
          weather: marineById.get(item.id),
        }))
        .sort((a, b) => (b.weather?.score ?? -1) - (a.weather?.score ?? -1));
    }
    if (currentCategory === "village") {
      return villageItems
        .filter((item) => region === "auto" || !region || villageRegion(item.id) === region)
        .map((item) => ({ id: item.id, name: item.name, image: item.image, meta: `${item.bestTime} · ${item.recommendedDuration}`, category: "village" as const }));
    }
    return plannerExtraPlaces
      .filter((item) => item.category === currentCategory)
      .filter((item) => region === "auto" || !region || item.region === region)
      .map((item: PlannerExtraPlace) => ({ id: item.id, name: item.name, image: item.image, meta: item.meta, category: item.category }));
  }, [currentCategory, region, marineById]);

  const toggleCategory = (id: CategoryId) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    if (selected.includes(id)) setChosenPlaces((current) => ({ ...current, [id]: [] }));
  };

  const chooseRegion = (nextRegion: RegionChoice) => {
    const resolved: RegionChoice = nextRegion === "auto" && recommendedRegion ? recommendedRegion : nextRegion;
    if (region !== resolved) setChosenPlaces(emptyChosenPlaces());
    setRegion(resolved);
    setPlaceCategoryIndex(0);
    setStep(placeCategories.length > 0 ? "places" : "summary");
  };

  const togglePlace = (id: string) => {
    if (!currentCategory) return;
    setChosenPlaces((current) => {
      const existing = current[currentCategory];
      if (!MULTI_SELECT.has(currentCategory)) return { ...current, [currentCategory]: existing[0] === id ? [] : [id] };
      return { ...current, [currentCategory]: existing.includes(id) ? existing.filter((item) => item !== id) : [...existing, id] };
    });
  };

  const continuePlaces = () => {
    if (!currentCategory || chosenPlaces[currentCategory].length === 0) return;
    if (placeCategoryIndex < placeCategories.length - 1) setPlaceCategoryIndex((current) => current + 1);
    else setStep("summary");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBackFromPlaces = () => {
    if (placeCategoryIndex > 0) setPlaceCategoryIndex((current) => current - 1);
    else setStep("region");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedNameGroups = useMemo(() => {
    const extraById = new Map(plannerExtraPlaces.map((item) => [item.id, item.name]));
    return PLACE_ORDER.map((category) => {
      const names = chosenPlaces[category].map((id) => {
        if (category === "beach") return beachItems.find((item) => item.id === id)?.name;
        if (category === "village") return villageItems.find((item) => item.id === id)?.name;
        return extraById.get(id);
      }).filter(Boolean) as string[];
      return { category, names };
    }).filter((group) => group.names.length > 0);
  }, [chosenPlaces]);

  const currentChosenCount = currentCategory ? chosenPlaces[currentCategory].length : 0;
  const currentCategoryInfo = currentCategory ? categoryById[currentCategory] : null;

  return (
    <main className="min-h-[100svh] overflow-x-clip bg-[#f8f4ee] text-[#2f2722]">
      <header className="border-b border-[#e8dfd4] bg-[#fffdf9]/95">
        <div className="mx-auto flex h-[58px] w-[min(1260px,calc(100%_-_28px))] items-center justify-between md:h-[68px] md:w-[min(1260px,calc(100%_-_48px))]">
          <BrandMark />
          <p className="hidden text-[12px] font-medium text-[#655a52] md:block">Ανακάλυψε τη Χίο με τον δικό σου τρόπο <span className="ml-2 text-[18px]">♡</span></p>
        </div>
      </header>

      {step !== "activities" ? <SelectionStrip selectedCategories={placeCategories} region={region} chosenPlaces={chosenPlaces} /> : null}

      {step === "activities" ? (
        <section className="relative overflow-hidden">
          <div className="mx-auto flex w-[min(1260px,calc(100%_-_24px))] flex-col py-4 pb-5 md:min-h-[calc(100svh-68px)] md:w-[min(1260px,calc(100%_-_48px))] md:items-center md:justify-center md:py-8">
            <div className="mx-auto text-center">
              <h1 className="font-serif text-[30px] font-semibold leading-[1.02] tracking-[-0.035em] text-[#2e241f] sm:text-[36px] md:text-[54px] lg:text-[60px]">Τι θέλεις να κάνεις σήμερα;</h1>
              <p className="mt-2 text-[13px] font-semibold text-[#b1763f] md:mt-3 md:text-[17px]">Διάλεξε όσα θέλεις</p>
            </div>
            <div className="mt-4 grid w-full grid-cols-2 gap-2.5 sm:gap-3 md:mt-7 md:grid-cols-5 md:gap-4 lg:gap-5">
              {categories.map((category) => <CategoryCard key={category.id} category={category} selected={selected.includes(category.id)} onToggle={() => toggleCategory(category.id)} />)}
            </div>
            <div className="mt-4 w-full md:mt-6 md:w-[400px]">
              <button type="button" disabled={selected.length === 0} onClick={() => selected.length > 0 && setStep("region")} className="flex min-h-[50px] w-full items-center justify-center rounded-[12px] bg-[#aeb39a] px-6 text-[15px] font-semibold text-white shadow-[0_9px_22px_rgba(94,101,72,.2)] transition hover:bg-[#9ca484] disabled:opacity-45 md:min-h-[56px] md:text-[17px]">Συνέχεια →</button>
            </div>
          </div>
        </section>
      ) : null}

      {step === "region" ? (
        <section className="mx-auto flex w-[min(820px,calc(100%_-_28px))] flex-col items-center py-5 text-center md:min-h-[calc(100svh-112px)] md:justify-center md:py-8">
          <button type="button" onClick={() => setStep("activities")} className="mb-3 self-start rounded-full border border-[#ded5ca] bg-white/75 px-3.5 py-1.5 text-[12px] font-medium text-[#6b6159] shadow-sm">← Πίσω</button>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b1763f] md:text-[11px]">Βήμα 2</p>
          <h2 className="mt-2 max-w-[620px] font-serif text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[46px]">Προς τα πού θέλεις να κινηθείς;</h2>
          <p className="mt-2 max-w-[540px] text-[12px] leading-5 text-[#766c64] md:mt-3 md:text-[13px]">Επέλεξες {selectedLabels.join(", ")}. Οι σημερινές συνθήκες θάλασσας και ανέμου σε βοηθούν να διαλέξεις πλευρά.</p>

          <div aria-live="polite" className="mt-4 w-full max-w-[560px] rounded-2xl border border-[#d7dcc7] bg-[#f0f2e8] p-3 text-left shadow-[0_8px_20px_rgba(86,93,64,.08)] md:p-4">
            {marineStatus === "loading" || marineStatus === "idle" ? <div className="flex items-center gap-3 text-[12px] text-[#667050]"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#9da584]" /> Ελέγχουμε θάλασσα, άνεμο και ριπές για τις επόμενες ώρες…</div> : null}
            {marineStatus === "error" ? <p className="text-[12px] leading-5 text-[#7b6d5e]">Δεν ήταν δυνατή η live ενημέρωση τώρα. Μπορείς να επιλέξεις κατεύθυνση κανονικά.</p> : null}
            {marineStatus === "ready" && recommendedRegionInfo?.topBeach ? (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7d8764]">✦ Tip βάσει σημερινής πρόγνωσης{recommendedWindow ? ` · ${recommendedWindow}` : ""}</p>
                <p className="mt-1 text-[14px] font-bold text-[#4f5d40] md:text-[15px]">Καλύτερη κατεύθυνση τώρα: {regionName(recommendedRegion)}</p>
                <p className="mt-1 text-[11px] leading-4 text-[#6c745c]">Η καλύτερη εικόνα αυτή τη στιγμή ξεκινά από την {recommendedRegionInfo.topBeach.name}. Η πρόταση συνδυάζει θαλάσσια πρόγνωση και έκθεση ακτής.</p>
              </div>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-[112px_46px_112px] grid-rows-[72px_40px_72px] items-center justify-items-center gap-x-2 gap-y-1 md:mt-6 md:grid-cols-[150px_58px_150px] md:grid-rows-[82px_44px_82px] md:gap-x-3 md:gap-y-2">
            {regionOptions.map((item) => {
              const info = regionRankings.find((row) => row.id === item.id);
              const best = recommendedRegion === item.id && marineStatus === "ready";
              return (
                <button key={item.id} type="button" onClick={() => chooseRegion(item.id)} className={`${item.position} h-full w-full rounded-[18px] border px-2 text-center shadow-[0_7px_18px_rgba(65,48,36,.055)] transition md:rounded-[20px] ${best ? "border-[#aeb39a] bg-[#eef0e6] text-[#5f684d] ring-2 ring-[#aeb39a]/20" : "border-[#e5ddd3] bg-white text-[#4f463f] hover:border-[#aeb39a] hover:bg-[#f6f7f1]"}`}>
                  <span className="block text-[16px] font-bold md:text-[17px]">{item.label}</span>
                  <span className="mt-0.5 block text-[9px] font-semibold opacity-75 md:text-[10px]">{best ? "★ Καλύτερα σήμερα" : info?.score !== null && info?.score !== undefined ? ratingLabel(info.topBeach?.rating ?? "fair") : item.title}</span>
                </button>
              );
            })}
            <div className="col-start-2 row-start-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#dbcbbb] bg-[#fffdf9] text-[18px] text-[#ad7744] shadow-sm" aria-hidden="true">🧭</div>
          </div>
          <button type="button" onClick={() => chooseRegion("auto")} className="mt-4 flex min-h-[48px] w-[225px] items-center justify-center gap-2 rounded-full border border-[#cfd5bd] bg-[#f7f8f2] px-5 text-[14px] font-semibold text-[#687154] shadow-[0_7px_18px_rgba(65,48,36,.055)] transition hover:bg-[#eef0e6] md:mt-5 md:w-[245px] md:text-[15px]"><span className="text-[#bd8149]">✦</span><span>{recommendedRegion ? `Πρότεινέ μου ${regionOptions.find((item) => item.id === recommendedRegion)?.label}` : "Πρότεινέ μου"}</span></button>
        </section>
      ) : null}

      {step === "places" && currentCategory && currentCategoryInfo ? (
        <section className="mx-auto w-[min(1060px,calc(100%_-_24px))] py-4 pb-24 md:py-7 md:pb-10">
          <button type="button" onClick={goBackFromPlaces} className="mb-3 rounded-full border border-[#ded5ca] bg-white/75 px-3.5 py-1.5 text-[12px] font-medium text-[#6b6159] shadow-sm">← Πίσω</button>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b1763f]">Βήμα {3 + placeCategoryIndex}</p>
            <h2 className="mt-1.5 font-serif text-[31px] font-semibold leading-tight tracking-[-0.03em] md:text-[46px]">Διάλεξε {MULTI_SELECT.has(currentCategory) ? currentCategoryInfo.plural : currentCategoryInfo.singular}</h2>
            <p className="mx-auto mt-2 max-w-[620px] text-[11px] leading-5 text-[#766c64] md:text-[13px]">{MULTI_SELECT.has(currentCategory) ? "Μπορείς να επιλέξεις περισσότερα από ένα." : "Επίλεξε μία επιλογή."} {region === "auto" ? "Βλέπεις επιλογές από όλη τη Χίο." : `Πλευρά: ${regionName(region)}.`}</p>
            {currentCategory === "beach" ? <p className="mx-auto mt-1 max-w-[680px] text-[10px] leading-4 text-[#9a8877]">Οι παραλίες είναι ήδη ταξινομημένες από καλύτερη προς δυσκολότερη για τις σημερινές συνθήκες.</p> : null}
          </div>

          {currentCategory === "beach" && marineStatus === "loading" ? <div className="mx-auto mt-4 max-w-[540px] rounded-xl border border-[#ded8c8] bg-white/70 px-4 py-3 text-center text-[11px] text-[#7b705f]">Ενημερώνουμε τις παραλίες με τις σημερινές συνθήκες…</div> : null}
          {currentCategory === "beach" && marineStatus === "error" ? <div className="mx-auto mt-4 max-w-[540px] rounded-xl border border-[#ead7bd] bg-[#fff7e8] px-4 py-3 text-center text-[11px] text-[#7b623f]">Η πρόγνωση δεν είναι διαθέσιμη τώρα. Οι επιλογές παραμένουν διαθέσιμες χωρίς weather ranking.</div> : null}

          <div className="mt-3 flex items-center justify-between md:hidden">
            <span className="text-[10px] font-semibold text-[#9a8776]">Σύρε για περισσότερες επιλογές</span>
            <span className="text-[#b47d48]">→</span>
          </div>

          <div className={`-mx-3 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-6 md:grid md:snap-none md:overflow-visible md:px-0 md:pb-0 ${currentCategory === "beach" ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-3"}`}>
            {placeOptions.map((item) => {
              const isSelected = chosenPlaces[currentCategory].includes(item.id);
              return (
                <button key={item.id} type="button" aria-pressed={isSelected} onClick={() => togglePlace(item.id)} className={`w-[86vw] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-[18px] border bg-white text-left shadow-[0_10px_28px_rgba(65,48,36,.08)] transition md:w-auto md:max-w-none md:shrink md:snap-none md:hover:-translate-y-0.5 ${isSelected ? "border-[#aeb39a] bg-[#fdfdf9] ring-2 ring-[#aeb39a]/30" : "border-[#e3dacf] hover:border-[#c9b9a7]"}`}>
                  <div className="relative h-[210px] overflow-hidden bg-[#e9e1d7] md:h-[176px]">
                    <PlaceImage src={item.image} name={item.name} category={currentCategory} />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-14 bg-gradient-to-t from-black/25 to-transparent" />
                    {isSelected ? <span className="absolute right-2.5 top-2.5 z-[3] flex h-8 w-8 items-center justify-center rounded-full bg-[#9ca484] text-sm font-bold text-white shadow-md">✓</span> : null}
                    {item.weather ? <span className={`absolute bottom-2 left-2 z-[3] rounded-full border px-2.5 py-1 text-[10px] font-bold shadow-sm ${ratingClasses(item.weather.rating)}`}>{ratingLabel(item.weather.rating)}</span> : null}
                  </div>
                  <div className="p-3.5 md:p-4">
                    <div className="font-serif text-[21px] font-semibold text-[#332923] md:text-[21px]">{item.name}</div>
                    <div className="mt-1 text-[11px] leading-4 text-[#82766c] md:text-[12px]">{item.meta}</div>
                    {item.weather ? <BeachWeatherCard weather={item.weather} /> : null}
                  </div>
                </button>
              );
            })}
          </div>

          {placeOptions.length === 0 ? <div className="mx-auto mt-6 max-w-[520px] rounded-2xl border border-dashed border-[#d9cec0] bg-white/60 p-6 text-center text-sm text-[#827468]">Δεν έχουμε ακόμη επιλογές αυτής της κατηγορίας για τη συγκεκριμένη πλευρά.</div> : null}
          {MULTI_SELECT.has(currentCategory) && currentChosenCount >= 4 ? <div className="mx-auto mt-4 max-w-[620px] rounded-xl border border-[#ead7bd] bg-[#fff7e8] px-4 py-3 text-center text-[11px] leading-4 text-[#7b623f]">Έχεις επιλέξει {currentChosenCount} {currentCategoryInfo.plural}. Είναι αρκετές στάσεις για μία μέρα· ο planner θα τις οργανώσει με βάση χρόνο και αποστάσεις.</div> : null}

          <div className="sticky bottom-3 z-20 mx-auto mt-4 w-full rounded-2xl border border-[#ded7ca] bg-[#fffdf9]/95 p-2 shadow-[0_14px_34px_rgba(56,43,33,.16)] backdrop-blur md:static md:mt-6 md:w-[420px] md:border-0 md:bg-transparent md:p-0 md:shadow-none">
            <button type="button" disabled={currentChosenCount === 0} onClick={continuePlaces} className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#aeb39a] px-5 text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(94,101,72,.18)] transition hover:bg-[#9ca484] disabled:cursor-not-allowed disabled:opacity-40 md:text-[15px]">
              {currentChosenCount === 0 ? `Επίλεξε ${currentCategoryInfo.singular}` : MULTI_SELECT.has(currentCategory) ? `Συνέχεια με ${currentChosenCount} ${currentCategoryInfo.plural}` : "Συνέχεια →"}
            </button>
          </div>
        </section>
      ) : null}

      {step === "summary" ? (
        <section className="mx-auto flex min-h-[calc(100svh-112px)] w-[min(820px,calc(100%_-_28px))] flex-col items-center justify-center py-7 text-center">
          <button type="button" onClick={() => { setStep(placeCategories.length ? "places" : "region"); setPlaceCategoryIndex(Math.max(placeCategories.length - 1, 0)); }} className="mb-4 self-start rounded-full border border-[#ded5ca] bg-white/75 px-3.5 py-1.5 text-[12px] font-medium text-[#6b6159] shadow-sm">← Πίσω</button>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b1763f]">Το πλάνο σου</p>
          <h2 className="mt-2 font-serif text-[34px] font-semibold leading-tight tracking-[-0.03em] md:text-[50px]">Ωραία, έχουμε τις επιλογές της εκδρομής σου.</h2>
          <div className="mt-5 grid w-full gap-3 sm:grid-cols-2">
            {selectedNameGroups.map((group) => (
              <div key={group.category} className="rounded-2xl border border-[#e0d5c8] bg-white p-4 text-left shadow-[0_7px_20px_rgba(65,48,36,.05)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a9835e]">{categoryById[group.category].label}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">{group.names.map((name) => <span key={name} className="rounded-full bg-[#f3efe8] px-3 py-1.5 text-[11px] font-semibold text-[#5d4e42]">{name}</span>)}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-[580px] text-[12px] leading-5 text-[#766c64] md:text-[13px]">Επόμενο στάδιο: ώρα, σωστή σειρά στάσεων, αποστάσεις και τελικό itinerary με βάση τις επιλογές σου και τις σημερινές συνθήκες.</p>
        </section>
      ) : null}
    </main>
  );
}
