"use client";

import dynamic from "next/dynamic";

// Live SVG maths: render only in the browser to avoid floating-point hydration mismatches.
const PedioAnimations = dynamic(() => import("./PedioAnimations").then((m) => m.PedioAnimations), {
  ssr: false,
  loading: () => <p className="py-10 text-center text-sm font-semibold text-[#857261]">Φόρτωση κινούμενων σχεδίων…</p>,
});

export function PedioAnimationsClient() {
  return <PedioAnimations />;
}
