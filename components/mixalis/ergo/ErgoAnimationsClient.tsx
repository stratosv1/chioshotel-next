"use client";

import dynamic from "next/dynamic";

// Live SVG maths: render only in the browser to avoid floating-point hydration mismatches.
const ErgoAnimations = dynamic(() => import("./ErgoAnimations").then((m) => m.ErgoAnimations), {
  ssr: false,
  loading: () => <p className="py-10 text-center text-sm font-semibold text-[#857261]">Φόρτωση κινούμενων σχεδίων…</p>,
});

export function ErgoAnimationsClient() {
  return <ErgoAnimations />;
}
