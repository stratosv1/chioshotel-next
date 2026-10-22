"use client";

import dynamic from "next/dynamic";

// Live SVG maths: render only in the browser to avoid floating-point hydration mismatches.
const Omali2Animations = dynamic(() => import("./Omali2Animations").then((m) => m.Omali2Animations), {
  ssr: false,
  loading: () => <p className="py-10 text-center text-sm font-semibold text-[#857261]">Φόρτωση κινούμενων σχεδίων…</p>,
});

export function Omali2AnimationsClient() {
  return <Omali2Animations />;
}
