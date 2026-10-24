"use client";

import dynamic from "next/dynamic";

// Live SVG maths: render only in the browser to avoid hydration float mismatches.
const TripolitisList = dynamic(() => import("./TripolitisList").then((m) => m.TripolitisList), {
  ssr: false,
  loading: () => <p className="py-10 text-center text-sm font-semibold text-[#857261]">Φόρτωση ασκήσεων…</p>,
});

export function TripolitisClient() {
  return <TripolitisList />;
}
