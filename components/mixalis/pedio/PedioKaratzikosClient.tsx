"use client";

import dynamic from "next/dynamic";

// Live SVG maths: render only in the browser to avoid floating-point hydration mismatches.
const PedioKaratzikos = dynamic(() => import("./PedioKaratzikos").then((m) => m.PedioKaratzikos), {
  ssr: false,
  loading: () => <p className="py-10 text-center text-sm font-semibold text-[#857261]">Φόρτωση μεθοδολογιών…</p>,
});

export function PedioKaratzikosClient() {
  return <PedioKaratzikos />;
}
