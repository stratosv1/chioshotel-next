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

function CategoryCard({
  category,
  selected,
  onToggle,
}: {
  category: Category;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`group relative min-w-0 overflow-hidden rounded-[15px] border bg-white text-left shadow-[0_7px_20px_rgba(65,48,36,.065)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#aeb39a]/60 md:rounded-[18px] ${
        category.wideOnMobile ? "col-span-2 md:col-span-1" : ""
      } ${
        selected
          ? "border-[#c49a61] bg-[#fdfbf7] ring-2 ring-[#c49a61]/20"
          : "border-[#e7ded3] hover:-translate-y-0.5 hover:border-[#d6c3af] hover:shadow-[0_12px_30px_rgba(65,48,36,.09)]"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-[#eee5db] ${
          category.wideOnMobile
            ? "h-[104px] md:h-auto md:aspect-[1.18/1]"
            : "h-[98px] sm:h-[108px] md:h-auto md:aspect-[1.18/1]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        {selected ? (
          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#c28a4c] text-white shadow-md md:right-2.5 md:top-2.5 md:h-8 md:w-8">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="m6.5 12.4 3.2 3.2 7.8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        ) : null}
      </div>
      <div className="relative flex min-h-[48px] items-end justify-center px-2.5 pb-2.5 pt-5 md:min-h-[82px] md:px-3 md:pb-5 md:pt-10">
        <span className="absolute -top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd3] bg-white text-[#3c3029] shadow-[0_4px_12px_rgba(59,44,33,.08)] md:-top-7 md:h-14 md:w-14">
          {category.icon}
        </span>
        <span className="text-center text-[13px] font-semibold text-[#2f2722] md:text-[18px]">{category.label}</span>
      </div>
    </button>
  );
}

const regionOptions: Array<{ id: Exclude<RegionId, "auto">; label: string; position: string }> = [
  { id: "NW", label: "ΒΔ", position: "col-start-1 row-start-1" },
  { id: "NE", label: "ΒΑ", position: "col-start-3 row-start-1" },
  { id: "SW", label: "ΝΔ", position: "col-start-1 row-start-3" },
  { id: "SE", label: "ΝΑ", position: "col-start-3 row-start-3" },
];

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
        <div className="mx-auto flex h-[58px] w-[min(1260px,calc(100%-28px))] items-center justify-between md:h-[68px] md:w-[min(1260px,calc(100%-48px))]">
          <BrandMark />
          <p className="hidden text-[12px] font-medium text-[#655a52] md:block">
            Ανακάλυψε τη Χίο με τον δικό σου τρόπο
            <span className="ml-2 text-[18px] align-[-2px]">♡</span>
          </p>
        </div>
      </header>

      {step === "activities" ? (
        <section className="relative overflow-hidden">
          <div className="mx-auto flex w-[min(1260px,calc(100%-24px))] flex-col py-4 pb-5 md:min-h-[calc(100svh-68px)] md:w-[min(1260px,calc(100%-48px))] md:items-center md:justify-center md:py-8">
            <div className="mx-auto text-center">
              <h1 className="font-serif text-[30px] font-semibold leading-[1.02] tracking-[-0.035em] text-[#2e241f] sm:text-[36px] md:text-[54px] lg:text-[60px]">
                Τι θέλεις να κάνεις σήμερα;
              </h1>
              <p className="mt-2 text-[13px] font-semibold text-[#b1763f] md:mt-3 md:text-[17px]">
                Διάλεξε όσα θέλεις
              </p>
            </div>

            <div className="mt-4 grid w-full grid-cols-2 gap-2.5 sm:gap-3 md:mt-7 md:grid-cols-5 md:gap-4 lg:gap-5">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  selected={selected.includes(category.id)}
                  onToggle={() => toggle(category.id)}
                />
              ))}
            </div>

            <div className="mt-4 w-full md:mt-6 md:w-[400px]">
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => canContinue && setStep("region")}
                className="flex min-h-[50px] w-full items-center justify-center gap-4 rounded-[12px] bg-[#aeb39a] px-6 text-[15px] font-semibold text-white shadow-[0_9px_22px_rgba(94,101,72,.2)] transition hover:bg-[#9ca484] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 md:min-h-[56px] md:text-[17px]"
              >
                <span>Συνέχεια</span>
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden="true">
                  <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-[#837a73] md:text-[11px]">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden="true">
                  <rect x="6" y="10" width="12" height="9" rx="2" stroke="currentColor" />
                  <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" />
                </svg>
                Δεν αποθηκεύουμε προσωπικά δεδομένα
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto flex w-[min(760px,calc(100%-28px))] flex-col items-center px-0 py-5 text-center md:min-h-[calc(100svh-68px)] md:justify-center md:py-8">
          <button
            type="button"
            onClick={() => setStep("activities")}
            className="mb-4 self-start rounded-full border border-[#ded5ca] bg-white/75 px-3.5 py-1.5 text-[12px] font-medium text-[#6b6159] shadow-[0_3px_10px_rgba(65,48,36,.05)] transition hover:bg-white md:mb-5 md:text-[13px]"
          >
            ← Πίσω
          </button>

          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b1763f] md:text-[11px]">
            Βήμα 2
          </p>
          <h2 className="mt-2 max-w-[620px] font-serif text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[46px]">
            Προς τα πού θέλεις να κινηθείς;
          </h2>
          <p className="mt-2 max-w-[500px] text-[12px] leading-5 text-[#766c64] md:mt-3 md:text-[13px] md:leading-6">
            Επέλεξες {selectedLabels.join(", ")}. Διάλεξε κατεύθυνση ή άφησέ μας να σου προτείνουμε.
          </p>

          <div className="mt-5 grid grid-cols-[96px_44px_96px] grid-rows-[58px_38px_58px] items-center justify-items-center gap-x-2 gap-y-1 md:mt-7 md:grid-cols-[124px_54px_124px] md:grid-rows-[68px_42px_68px] md:gap-x-3 md:gap-y-2">
            {regionOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRegion(item.id)}
                className={`${item.position} h-full w-full rounded-[18px] border text-[15px] font-semibold shadow-[0_7px_18px_rgba(65,48,36,.055)] transition md:rounded-[20px] md:text-[16px] ${
                  region === item.id
                    ? "border-[#aeb39a] bg-[#eef0e6] text-[#667050] ring-2 ring-[#aeb39a]/25"
                    : "border-[#e5ddd3] bg-white text-[#4f463f] hover:border-[#cfc3b6]"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="col-start-2 row-start-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#dbcbbb] bg-[#fffdf9] text-[18px] text-[#ad7744] shadow-[0_4px_12px_rgba(65,48,36,.07)] md:h-10 md:w-10 md:text-[20px]" aria-hidden="true">
              🧭
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRegion("auto")}
            className={`mt-5 flex min-h-[48px] w-[210px] items-center justify-center gap-2 rounded-full border px-5 text-[14px] font-semibold shadow-[0_7px_18px_rgba(65,48,36,.055)] transition md:mt-6 md:min-h-[50px] md:w-[230px] md:text-[15px] ${
              region === "auto"
                ? "border-[#aeb39a] bg-[#eef0e6] text-[#667050] ring-2 ring-[#aeb39a]/25"
                : "border-[#ddd4c9] bg-white text-[#87613c] hover:border-[#c9baa9]"
            }`}
          >
            <span className="text-[#bd8149]">✦</span>
            <span>Πρότεινέ μου</span>
          </button>
        </section>
      )}
    </main>
  );
}
