"use client";

import dynamic from "next/dynamic";

// The lesson is all live SVG maths; rendering it only in the browser avoids
// server/client floating-point hydration mismatches.
const OmaliLesson = dynamic(() => import("./OmaliLesson").then((m) => m.OmaliLesson), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center bg-[#f3efe8] text-[#857261]">
      <p className="text-sm font-semibold">Φόρτωση μαθήματος…</p>
    </main>
  ),
});

export function OmaliClient() {
  return <OmaliLesson />;
}
