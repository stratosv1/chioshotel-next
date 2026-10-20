"use client";

import dynamic from "next/dynamic";

// All animations are live SVG maths; rendering them only in the browser avoids
// server/client floating-point hydration mismatches (same approach as the omali lesson).
const OrmiAnimations = dynamic(() => import("./OrmiAnimations").then((m) => m.OrmiAnimations), {
  ssr: false,
  loading: () => <p className="py-10 text-center text-sm font-semibold text-[#857261]">Φόρτωση κινούμενων σχεδίων…</p>,
});

export function OrmiAnimationsClient() {
  return <OrmiAnimations />;
}
