"use client";

import dynamic from "next/dynamic";

// Live SVG maths with Greek number formatting: render in the browser only
// to avoid server/client floating-point hydration mismatches.
const DianismaLesson = dynamic(() => import("./DianismaLesson").then((m) => m.DianismaLesson), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center bg-[#f3efe8] text-[#857261]">
      <p className="text-sm font-semibold">Φόρτωση μαθήματος…</p>
    </main>
  ),
});

export function DianismaClient() {
  return <DianismaLesson />;
}
