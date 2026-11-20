"use client";

import dynamic from "next/dynamic";

// Live SVG maths: render only in the browser (same approach as the other animations).
const SinthetaPresentations = dynamic(() => import("./SinthetaPresentations").then((m) => m.SinthetaPresentations), {
  ssr: false,
  loading: () => <p className="py-10 text-center text-sm font-semibold text-[#857261]">Φόρτωση παρουσιάσεων…</p>,
});

export function SinthetaPresentationsClient() {
  return (
    <section id="parousiaseis" className="scroll-mt-20 rounded-3xl border border-[#6b4fa0] bg-[#f6f3fb] p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b4fa0]">Σύνθετες ασκήσεις · παρουσιάσεις με κίνηση</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1c2433] sm:text-3xl">Πώς σκέφτομαι σε κάθε σύνθετη άσκηση</h2>
      <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#3d4452]">
        Τα 35 φαινόμενα του quiz, ένα-ένα: πρώτα βλέπεις τι συμβαίνει, μετά τι ζητάει η άσκηση, μετά κάθε φάση ξαναπαίζει με το εργαλείο της και{" "}
        <b>γιατί</b> το διαλέγουμε, και στο τέλος <b>με ποια σειρά</b> λύνεις. Πάτα «Επόμενο βήμα» για να προχωράς με τον δικό σου ρυθμό.
      </p>
      <SinthetaPresentations />
    </section>
  );
}
