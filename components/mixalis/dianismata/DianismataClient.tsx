"use client";

import dynamic from "next/dynamic";

// Οι ασκήσεις εξάσκησης βγάζουν τυχαίους αριθμούς· αποδίδονται μόνο στον
// browser ώστε να μην υπάρχει διαφορά server/client στο hydration.
const DianismataPage = dynamic(() => import("./DianismataPage").then((m) => m.DianismataPage), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center bg-[#f3efe8] text-[#857261]">
      <p className="text-sm font-semibold">Φόρτωση ασκήσεων…</p>
    </main>
  ),
});

export function DianismataClient() {
  return <DianismataPage />;
}
