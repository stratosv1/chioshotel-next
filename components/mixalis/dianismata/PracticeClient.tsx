"use client";

import dynamic from "next/dynamic";

// Οι ασκήσεις βγάζουν τυχαίους αριθμούς· αποδίδονται μόνο στον browser ώστε να μην υπάρχει διαφορά server/client.
// Η υπόλοιπη σελίδα αποδίδεται στον server και φαίνεται αμέσως.
export const PracticeClient = dynamic(() => import("./Practice").then((m) => m.Practice), {
  ssr: false,
  loading: () => <p className="py-6 text-sm font-semibold text-[#857261]">Φόρτωση ασκήσεων…</p>,
});
