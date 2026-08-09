"use client";

import { useMemo, useState, type ReactNode } from "react";

type CategoryId = "beach" | "village" | "food" | "drink" | "sights";
type RegionId = "NW" | "NE" | "SW" | "SE" | "auto";

type Category = {
  id: CategoryId;
  label: string;
  image: string;
  icon: ReactNode;
  wideOnMobile?: boolean;
};

const iconClass = "h-6 w-6 stroke-[1.65]";

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
  {
    id: "beach",
    label: "Παραλία",
    image: "/images/beaches/karfas-beach-chios-vertical.webp",
    icon: <BeachIcon />,
  },
  {
    id: "village",
    label: "Χωριό",
    image: "/images/chios-guide/9ac4cf44d16c4af6d873c5bba4a6696b_L.webp",
    icon: <VillageIcon />,
  },
  {
    id: "food",
    label: "Φαγητό",
    image: "/images/taste/d8765ffe-dbf2-496c-9190-f1fb82e6318a.webp",
    icon: <FoodIcon />,
  },
  {
    id: "drink",
    label: "Ποτό",
    image: "/images/taste/asteri.jpg",
    icon: <DrinkIcon />,
  },
  {
    id: "sights",
    label: "Αξιοθέατα",
    image: "/images/chios-guide/ag-markella.jpg",
    icon: <SightsIcon />,
    wideOnMobile: true,
  },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-3 text-[#8b5e34]">
      <svg viewBox="0 0 52 48" className="h-9 w-10 md:h-11 md:w-12" fill="none" aria-hidden="true">
        <path d="M8 30c6-3 11-4 18-4s12 1 18 4M11 36c5-2 10-3 15-3 6 0 11 1 15 3M14 41c4-1.3 8-2 12-2s8 .7 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 10v7M14.5 14.5l5 5M37.5 14.5l-5 5M8 25h7M37 25h7M16 24c1.8-4.6 5.4-7 10-7s8.2 2.4 10 7" stroke="#c88745" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="leading-none">
        <div className="font-serif text-[17px] tracking-[0.16em] text-[#4b382d] md:text-[20px]">CHIOS</div>
        <div className="mt-1 text-[8px] font-semibold tracking-[0.22em] text-[#8b5e34] md:text-[9px]">TRIP PLANNER</div>
      </div>
    </div>
  );
}

function CategoryCard({ category, selected, onToggle }: { category: Category; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`group relative min-w-0 overflow-hidden rounded-[16px] border bg-white text-left shadow-[0_8px_24px_rgba(65,48,36,.07)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b68754]/50 md:rounded-[18px] ${
        category.wideOnMobile ? "col-span-2 md:col-span-1" : ""
      } ${selected ? "border-[#b77c42] ring-2 ring-[#c99761]/35" : "border-[#e7ded3] hover:-translate-y-0.5 hover:border-[#d6c3af] hover:shadow-[0_12px_30px_rgba(65,48,36,.1)]"}`}
    >
      <div className="relative aspect-[1.45/1] overflow-hidden bg-[#eee5db] md:aspect-[1.15/1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={category.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        {selected && (
          <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#b77c42] text-white shadow-md md:h-8 md:w-8">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="m6.5 12.4 3.2 3.2 7.8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
      <div className="relative flex min-h-[60px] items-end justify-center px-3 pb-3 pt-7 md:min-h-[86px] md:pb-5 md:pt-10">
        <span className="absolute -top-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd3] bg-white text-[#3c3029] shadow-[0_5px_14px_rgba(59,44,33,.08)] md:-top-7 md:h-14 md:w-14">
          {category.icon}
        </span>
        <span className="text-center text-[14px] font-semibold text-[#2f2722] md:text-[18px]">{category.label}</span>
      </div>
    </button>
  );
}

export default function TripPlannerStart() {
  const [selected, setSelected] = useState<CategoryId[]>(["beach"]);
  const [step, setStep] = useState<"activities" | "region">("activities");
  const [region, setRegion] = useState<RegionId | null>(null);

  const canContinue = selected.length > 0;
  const selectedLabels = useMemo(
    () => categories.filter((item) => selected.includes(item.id)).map((item) => item.label),
    [selected],
  );

  const toggle = (id: CategoryId) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <main className="min-h-[100svh] bg-[#f8f4ee] text-[#2f2722]">
      <header className="border-b border-[#e8dfd4] bg-[#fffdf9]/95">
        <div className="mx-auto flex h-[76px] w-[min(1120px,calc(100%-32px))] items-center justify-between md:h-[88px] md:w-[min(1180px,calc(100%-48px))]">
          <BrandMark />
          <p className="hidden text-[13px] font-medium text-[#4d433d] md:block">Ανακάλυψε τη Χίο με τον δικό σου τρόπο <span className="ml-2 text-[20px] align-[-2px]">♡</span></p>
        </div>
      </header>

      {step === "activities" ? (
        <section className="relative overflow-hidden">
          <div className="mx-auto flex min-h-[calc(100svh-76px)] w-[min(1120px,calc(100%-28px))] flex-col py-7 pb-6 md:min-h-[calc(100svh-88px)] md:w-[min(1180px,calc(100%-48px))] md:items-center md:py-14">
            <div className="mx-auto text-center">
              <h1 className="font-serif text-[34px] font-semibold leading-[1.06] tracking-[-0.035em] text-[#2e241f] sm:text-[40px] md:text-[58px] lg:text-[66px]">Τι θέλεις να κάνεις σήμερα;</h1>
              <p className="mt-3 text-[14px] font-semibold text-[#b1763f] md:mt-4 md:text-[18px]">Διάλεξε όσα θέλεις</p>
            </div>

            <div className="mt-6 grid w-full grid-cols-2 gap-3 md:mt-10 md:grid-cols-5 md:gap-4 lg:gap-5">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} selected={selected.includes(category.id)} onToggle={() => toggle(category.id)} />
              ))}
            </div>

            <p className="mx-auto mt-5 hidden items-center gap-2 text-[13px] text-[#7a7068] md:flex">
              <span className="text-[#c99a61]">✦</span> Μπορείς να επιλέξεις παραπάνω από μία επιλογές
            </p>

            <div className="mt-auto w-full pt-5 md:mt-8 md:w-[392px] md:pt-0">
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => canContinue && setStep("region")}
                className="flex min-h-[54px] w-full items-center justify-center gap-4 rounded-[12px] bg-[#aeb39a] px-6 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(94,101,72,.18)] transition hover:bg-[#9ca484] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 md:min-h-[58px] md:rounded-[13px] md:text-[18px]"
              >
                <span>Συνέχεια</span>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#837a73] md:text-[12px]">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true"><rect x="6" y="10" width="12" height="9" rx="2" stroke="currentColor"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" stroke="currentColor"/></svg>
                Δεν αποθηκεύουμε προσωπικά δεδομένα
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto flex min-h-[calc(100svh-76px)] w-[min(720px,calc(100%-32px))] flex-col items-center justify-center py-10 text-center md:min-h-[calc(100svh-88px)]">
          <button type="button" onClick={() => setStep("activities")} className="mb-8 self-start rounded-full border border-[#ddd3c7] bg-white px-4 py-2 text-sm text-[#5f554e] shadow-sm">← Πίσω</button>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#b1763f]">Βήμα 2</p>
          <h2 className="mt-3 font-serif text-[38px] font-semibold leading-tight tracking-[-0.03em] md:text-[52px]">Προς τα πού θέλεις να κινηθείς;</h2>
          <p className="mt-3 max-w-[520px] text-sm leading-6 text-[#766c64]">Επέλεξες {selectedLabels.join(", ")}. Διάλεξε κατεύθυνση ή άφησέ μας να σου προτείνουμε.</p>

          <div className="mt-9 grid grid-cols-[88px_88px] gap-4 md:grid-cols-[108px_108px]">
            {(["NW", "NE", "SW", "SE"] as RegionId[]).map((item) => (
              <button key={item} type="button" onClick={() => setRegion(item)} className={`h-[88px] rounded-[22px] border bg-white text-lg font-bold shadow-[0_8px_22px_rgba(65,48,36,.06)] transition md:h-[108px] ${region === item ? "border-[#aeb39a] bg-[#f0f1e9] text-[#667050] ring-2 ring-[#aeb39a]/25" : "border-[#e5ddd3] text-[#4f463f]"}`}>
                {item === "NW" ? "ΒΔ" : item === "NE" ? "ΒΑ" : item === "SW" ? "ΝΔ" : "ΝΑ"}
              </button>
            ))}
          </div>
          <div className="my-5 text-2xl text-[#b1763f]">🧭</div>
          <button type="button" onClick={() => setRegion("auto")} className={`flex h-[72px] w-[196px] items-center justify-center rounded-[20px] border bg-white text-2xl shadow-[0_8px_22px_rgba(65,48,36,.06)] transition ${region === "auto" ? "border-[#aeb39a] bg-[#f0f1e9] text-[#667050] ring-2 ring-[#aeb39a]/25" : "border-[#e5ddd3] text-[#b1763f]"}`}>✦</button>
        </section>
      )}
    </main>
  );
}
