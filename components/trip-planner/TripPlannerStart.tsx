"use client";

import { useMemo, useState, type ReactNode } from "react";
import { beaches, villages } from "@/content/trip-planner";

type CategoryId = "beach" | "village" | "food" | "drink" | "sights";
type RegionId = "NW" | "NE" | "SW" | "SE" | "auto";
type Step = "activities" | "region" | "places" | "summary";

type Category = {
  id: CategoryId;
  label: string;
  singular: string;
  image: string;
  icon: ReactNode;
  wideOnMobile?: boolean;
};

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
  { id: "beach", label: "Παραλία", singular: "παραλία", image: "/images/beaches/karfas-beach-chios-vertical.webp", icon: <BeachIcon /> },
  { id: "village", label: "Χωριό", singular: "χωριό", image: "/images/chios-guide/9ac4cf44d16c4af6d873c5bba4a6696b_L.webp", icon: <VillageIcon /> },
  { id: "food", label: "Φαγητό", singular: "φαγητό", image: "/images/taste/d8765ffe-dbf2-496c-9190-f1fb82e6318a.webp", icon: <FoodIcon /> },
  { id: "drink", label: "Ποτό", singular: "ποτό", image: "/images/taste/asteri.jpg", icon: <DrinkIcon /> },
  { id: "sights", label: "Αξιοθέατα", singular: "αξιοθέατο", image: "/images/chios-guide/ag-markella.jpg", icon: <SightsIcon />, wideOnMobile: true },
];

const regionOptions: Array<{ id: Exclude<RegionId, "auto">; label: string; position: string }> = [
  { id: "NW", label: "ΒΔ", position: "col-start-1 row-start-1" },
  { id: "NE", label: "ΒΑ", position: "col-start-3 row-start-1" },
  { id: "SW", label: "ΝΔ", position: "col-start-1 row-start-3" },
  { id: "SE", label: "ΝΑ", position: "col-start-3 row-start-3" },
];

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

function matchesRegion(category: CategoryId, itemRegion: string, region: RegionId | null) {
  if (!region || region === "auto") return true;
  if (category === "beach") {
    if (region === "NW") return itemRegion === "northwest" || itemRegion === "west";
    if (region === "NE") return itemRegion === "northeast" || itemRegion === "near-city";
    if (region === "SW") return itemRegion === "west" || itemRegion === "south";
    return itemRegion === "south" || itemRegion === "near-city";
  }
  if (category === "village") {
    if (region === "NW") return itemRegion === "northwest" || itemRegion === "west-central";
    if (region === "NE") return itemRegion === "northeast" || itemRegion === "central";
    if (region === "SW") return itemRegion === "west-central" || itemRegion === "south";
    return itemRegion === "south" || itemRegion === "central";
  }
  return true;
}

export default function TripPlannerStart() {
  const [selected, setSelected] = useState<CategoryId[]>(["beach"]);
  const [step, setStep] = useState<Step>("activities");
  const [region, setRegion] = useState<RegionId | null>(null);
  const [placeCategoryIndex, setPlaceCategoryIndex] = useState(0);
  const [chosenPlaces, setChosenPlaces] = useState<Partial<Record<CategoryId, string>>>({});

  const selectedLabels = useMemo(() => categories.filter((item) => selected.includes(item.id)).map((item) => item.label), [selected]);
  const placeCategories = useMemo(() => selected.filter((id) => id === "beach" || id === "village"), [selected]);
  const currentCategory = placeCategories[placeCategoryIndex] ?? null;

  const placeOptions = useMemo(() => {
    if (currentCategory === "beach") {
      return beaches.filter((item) => matchesRegion("beach", item.region, region)).map((item) => ({ id: item.id, name: item.name, image: item.image, meta: item.bestTime ?? item.character?.[0] ?? "Παραλία Χίου" }));
    }
    if (currentCategory === "village") {
      return villages.filter((item) => matchesRegion("village", item.region, region)).map((item) => ({ id: item.id, name: item.name, image: item.image, meta: item.bestTime ?? item.character[0] ?? "Χωριό Χίου" }));
    }
    return [];
  }, [currentCategory, region]);

  const toggle = (id: CategoryId) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const chooseRegion = (nextRegion: RegionId) => {
    setRegion(nextRegion);
    setPlaceCategoryIndex(0);
    setStep(placeCategories.length > 0 ? "places" : "summary");
  };

  const choosePlace = (id: string) => {
    if (!currentCategory) return;
    setChosenPlaces((current) => ({ ...current, [currentCategory]: id }));
    if (placeCategoryIndex < placeCategories.length - 1) {
      setPlaceCategoryIndex((current) => current + 1);
    } else {
      setStep("summary");
    }
  };

  const goBackFromPlaces = () => {
    if (placeCategoryIndex > 0) setPlaceCategoryIndex((current) => current - 1);
    else setStep("region");
  };

  const selectedPlaceNames = useMemo(() => {
    const result: string[] = [];
    if (chosenPlaces.beach) result.push(beaches.find((item) => item.id === chosenPlaces.beach)?.name ?? "");
    if (chosenPlaces.village) result.push(villages.find((item) => item.id === chosenPlaces.village)?.name ?? "");
    return result.filter(Boolean);
  }, [chosenPlaces]);

  return (
    <main className="min-h-[100svh] bg-[#f8f4ee] text-[#2f2722]">
      <header className="border-b border-[#e8dfd4] bg-[#fffdf9]/95">
        <div className="mx-auto flex h-[58px] w-[min(1260px,calc(100%-28px))] items-center justify-between md:h-[68px] md:w-[min(1260px,calc(100%-48px))]">
          <BrandMark />
          <p className="hidden text-[12px] font-medium text-[#655a52] md:block">Ανακάλυψε τη Χίο με τον δικό σου τρόπο <span className="ml-2 text-[18px]">♡</span></p>
        </div>
      </header>

      {step === "activities" ? (
        <section className="relative overflow-hidden">
          <div className="mx-auto flex w-[min(1260px,calc(100%-24px))] flex-col py-4 pb-5 md:min-h-[calc(100svh-68px)] md:w-[min(1260px,calc(100%-48px))] md:items-center md:justify-center md:py-8">
            <div className="mx-auto text-center">
              <h1 className="font-serif text-[30px] font-semibold leading-[1.02] tracking-[-0.035em] text-[#2e241f] sm:text-[36px] md:text-[54px] lg:text-[60px]">Τι θέλεις να κάνεις σήμερα;</h1>
              <p className="mt-2 text-[13px] font-semibold text-[#b1763f] md:mt-3 md:text-[17px]">Διάλεξε όσα θέλεις</p>
            </div>
            <div className="mt-4 grid w-full grid-cols-2 gap-2.5 sm:gap-3 md:mt-7 md:grid-cols-5 md:gap-4 lg:gap-5">
              {categories.map((category) => <CategoryCard key={category.id} category={category} selected={selected.includes(category.id)} onToggle={() => toggle(category.id)} />)}
            </div>
            <div className="mt-4 w-full md:mt-6 md:w-[400px]">
              <button type="button" disabled={selected.length === 0} onClick={() => selected.length > 0 && setStep("region")} className="flex min-h-[50px] w-full items-center justify-center gap-4 rounded-[12px] bg-[#aeb39a] px-6 text-[15px] font-semibold text-white shadow-[0_9px_22px_rgba(94,101,72,.2)] transition hover:bg-[#9ca484] disabled:opacity-45 md:min-h-[56px] md:text-[17px]">Συνέχεια →</button>
            </div>
          </div>
        </section>
      ) : null}

      {step === "region" ? (
        <section className="mx-auto flex w-[min(760px,calc(100%-28px))] flex-col items-center py-5 text-center md:min-h-[calc(100svh-68px)] md:justify-center md:py-8">
          <button type="button" onClick={() => setStep("activities")} className="mb-4 self-start rounded-full border border-[#ded5ca] bg-white/75 px-3.5 py-1.5 text-[12px] font-medium text-[#6b6159] shadow-sm">← Πίσω</button>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b1763f] md:text-[11px]">Βήμα 2</p>
          <h2 className="mt-2 max-w-[620px] font-serif text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[46px]">Προς τα πού θέλεις να κινηθείς;</h2>
          <p className="mt-2 max-w-[500px] text-[12px] leading-5 text-[#766c64] md:mt-3 md:text-[13px]">Επέλεξες {selectedLabels.join(", ")}. Διάλεξε κατεύθυνση ή άφησέ μας να σου προτείνουμε.</p>
          <div className="mt-5 grid grid-cols-[96px_44px_96px] grid-rows-[58px_38px_58px] items-center justify-items-center gap-x-2 gap-y-1 md:mt-7 md:grid-cols-[124px_54px_124px] md:grid-rows-[68px_42px_68px] md:gap-x-3 md:gap-y-2">
            {regionOptions.map((item) => (
              <button key={item.id} type="button" onClick={() => chooseRegion(item.id)} className={`${item.position} h-full w-full rounded-[18px] border border-[#e5ddd3] bg-white text-[15px] font-semibold text-[#4f463f] shadow-[0_7px_18px_rgba(65,48,36,.055)] transition hover:border-[#aeb39a] hover:bg-[#f3f4ed] md:rounded-[20px] md:text-[16px]`}>{item.label}</button>
            ))}
            <div className="col-start-2 row-start-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#dbcbbb] bg-[#fffdf9] text-[18px] text-[#ad7744] shadow-sm" aria-hidden="true">🧭</div>
          </div>
          <button type="button" onClick={() => chooseRegion("auto")} className="mt-5 flex min-h-[48px] w-[210px] items-center justify-center gap-2 rounded-full border border-[#ddd4c9] bg-white px-5 text-[14px] font-semibold text-[#87613c] shadow-[0_7px_18px_rgba(65,48,36,.055)] transition hover:border-[#aeb39a] hover:bg-[#eef0e6] md:mt-6 md:w-[230px] md:text-[15px]"><span className="text-[#bd8149]">✦</span><span>Πρότεινέ μου</span></button>
        </section>
      ) : null}

      {step === "places" && currentCategory ? (
        <section className="mx-auto w-[min(980px,calc(100%-28px))] py-5 md:py-9">
          <button type="button" onClick={goBackFromPlaces} className="mb-4 rounded-full border border-[#ded5ca] bg-white/75 px-3.5 py-1.5 text-[12px] font-medium text-[#6b6159] shadow-sm">← Πίσω</button>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b1763f]">Βήμα {3 + placeCategoryIndex}</p>
            <h2 className="mt-2 font-serif text-[32px] font-semibold leading-tight tracking-[-0.03em] md:text-[46px]">Διάλεξε {categories.find((item) => item.id === currentCategory)?.singular}</h2>
            <p className="mt-2 text-[12px] text-[#766c64] md:text-[13px]">{region === "auto" ? "Σου δείχνουμε καλές επιλογές από όλη τη Χίο." : "Οι επιλογές έχουν φιλτραριστεί με βάση την κατεύθυνση που διάλεξες."}</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:mt-7 md:grid-cols-3 md:gap-4">
            {placeOptions.slice(0, 9).map((item) => (
              <button key={item.id} type="button" onClick={() => choosePlace(item.id)} className="overflow-hidden rounded-[16px] border border-[#e3dacf] bg-white text-left shadow-[0_7px_20px_rgba(65,48,36,.06)] transition hover:-translate-y-0.5 hover:border-[#c9b9a7]">
                <div className="h-[110px] bg-[#e9e1d7] md:h-[150px]">
                  {item.image ? <img src={item.image} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-3xl text-[#c7b6a3]">{currentCategory === "beach" ? "≈" : "⌂"}</div>}
                </div>
                <div className="p-3 md:p-4">
                  <div className="font-serif text-[18px] font-semibold text-[#332923] md:text-[21px]">{item.name}</div>
                  <div className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#82766c] md:text-[12px]">{item.meta}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === "summary" ? (
        <section className="mx-auto flex min-h-[calc(100svh-68px)] w-[min(720px,calc(100%-28px))] flex-col items-center justify-center py-8 text-center">
          <button type="button" onClick={() => { setStep(placeCategories.length ? "places" : "region"); setPlaceCategoryIndex(Math.max(placeCategories.length - 1, 0)); }} className="mb-5 self-start rounded-full border border-[#ded5ca] bg-white/75 px-3.5 py-1.5 text-[12px] font-medium text-[#6b6159] shadow-sm">← Πίσω</button>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b1763f]">Το πλάνο σου</p>
          <h2 className="mt-2 font-serif text-[36px] font-semibold leading-tight tracking-[-0.03em] md:text-[50px]">Ωραία, έχουμε βάση για τη μέρα σου.</h2>
          {selectedPlaceNames.length ? <div className="mt-6 flex flex-wrap justify-center gap-2">{selectedPlaceNames.map((name) => <span key={name} className="rounded-full border border-[#d9cec1] bg-white px-4 py-2 text-sm font-semibold text-[#59483c]">{name}</span>)}</div> : null}
          <p className="mt-5 max-w-[520px] text-[13px] leading-6 text-[#766c64]">Στο επόμενο στάδιο θα συνδέσουμε αυτές τις επιλογές με ώρα, διαδρομή και την εκτίμηση καιρού/θάλασσας.</p>
        </section>
      ) : null}
    </main>
  );
}
