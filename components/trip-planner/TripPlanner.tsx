"use client";

import { useState } from "react";
import type { BeachMaster } from "@/content/trip-planner/beaches";
import type { VillageMaster } from "@/content/trip-planner/villages";
import { BeachTripPlanner } from "./BeachTripPlanner";
import { VillageTripPlanner } from "./VillageTripPlanner";

type Props = {
  beaches: BeachMaster[];
  villages: VillageMaster[];
  locale: string;
};

export function TripPlanner({ beaches, villages, locale }: Props) {
  const isEl = locale === "el";
  const [mode, setMode] = useState<"beaches" | "villages">("beaches");

  if (!isEl) {
    return <BeachTripPlanner beaches={beaches} locale={locale} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#3d342c]">
      <div className="sticky top-0 z-40 border-b border-[#ded3c6] bg-[#f7f4ee]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <div className="inline-flex rounded-2xl border border-[#d9cec1] bg-white p-1 shadow-sm">
            <button type="button" onClick={() => setMode("beaches")} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${mode === "beaches" ? "bg-[#6e5b49] text-white" : "text-[#6a5c50] hover:bg-[#f6f1eb]"}`}>
              🏖️ Παραλίες
            </button>
            <button type="button" onClick={() => setMode("villages")} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${mode === "villages" ? "bg-[#6e5b49] text-white" : "text-[#6a5c50] hover:bg-[#f6f1eb]"}`}>
              🏡 Χωριά
            </button>
          </div>
        </div>
      </div>

      {mode === "beaches" ? <BeachTripPlanner beaches={beaches} locale={locale} /> : <VillageTripPlanner villages={villages} />}
    </div>
  );
}
