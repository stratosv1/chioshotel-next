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

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#3d342c]">
      <section className="border-b border-[#e8dfd3] bg-gradient-to-b from-[#efe8dc] to-[#f7f4ee]">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-7 sm:px-6 lg:px-8 lg:pb-8 lg:pt-10">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-[#d8c8b5] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a6654]">Chios Trip Planner</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#352d27] sm:text-4xl lg:text-5xl">
              {isEl ? "Φτιάξε τη δική σου διαδρομή στη Χίο" : "Build your Chios route"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d6258] sm:text-base">
              {isEl
                ? "Ξεκίνα με παραλίες ή χωριά. Διάλεξε όσα σου ταιριάζουν και ο planner θα σε βοηθήσει να τα οργανώσεις γεωγραφικά."
                : "Start with beaches or villages. Pick what fits you and the planner will help group your day geographically."}
            </p>
          </div>
          <div className="mt-6 inline-flex rounded-2xl border border-[#d9cec1] bg-white p-1 shadow-sm">
            <button type="button" onClick={() => setMode("beaches")} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${mode === "beaches" ? "bg-[#6e5b49] text-white" : "text-[#6a5c50] hover:bg-[#f6f1eb]"}`}>
              {isEl ? "🏖️ Παραλίες" : "🏖️ Beaches"}
            </button>
            <button type="button" onClick={() => setMode("villages")} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${mode === "villages" ? "bg-[#6e5b49] text-white" : "text-[#6a5c50] hover:bg-[#f6f1eb]"}`}>
              {isEl ? "🏡 Χωριά" : "🏡 Villages"}
            </button>
          </div>
        </div>
      </section>
      {mode === "beaches" ? <BeachTripPlanner beaches={beaches} locale={locale} /> : <VillageTripPlanner villages={villages} />}
    </div>
  );
}
