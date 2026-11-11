"use client";

import { AnimCard } from "@/components/mixalis/pedio/AnimCard";
import type { ECase } from "@/components/mixalis/pedio/kitE";
import { section1 } from "./scenes-1";
import { section2 } from "./scenes-2";
import { section3 } from "./scenes-3";
import { section4 } from "./scenes-4";

/* Colours and titles follow the four sections of the work–energy poster (scripts/mixalis/ergo_poster.py). */
export const SECTIONS: { title: string; color: string; intro: string; cases: ECase[] }[] = [
  {
    title: "Έργο δύναμης",
    color: "#1e5fb4",
    intro: "Το έργο μετράει πόση ενέργεια μεταφέρει μια δύναμη όταν το σώμα μετακινείται: W = F·s·συνθ. Το πρόσημο λέει αν η δύναμη δίνει (+) ή παίρνει (−) ενέργεια.",
    cases: section1,
  },
  {
    title: "Ενέργεια",
    color: "#0f7d8c",
    intro: "Κινητική ενέργεια λόγω κίνησης, δυναμική λόγω θέσης (ύψος ή παραμόρφωση ελατηρίου). Για μεταβλητή δύναμη το έργο είναι το εμβαδόν στο διάγραμμα F–x.",
    cases: section2,
  },
  {
    title: "ΘΜΚΕ – ΑΔΜΕ – απώλειες",
    color: "#6b3fa0",
    intro: "Τα δύο εργαλεία για τις ασκήσεις: το ΘΜΚΕ (ΣW = ΔK) ισχύει πάντα· η ΑΔΜΕ (K + U = σταθ.) μόνο όταν έργο κάνουν μόνο βάρος ή ελατήριο. Με τριβή: έργο τριβής = μεταβολή της μηχανικής ενέργειας.",
    cases: section3,
  },
  {
    title: "Ισχύς – απόδοση",
    color: "#2e7d32",
    intro: "Η ισχύς δείχνει πόσο γρήγορα γίνεται το έργο: P = W/Δt ή P = F·υ. Ο βαθμός απόδοσης δείχνει πόσο από την ενέργεια που μπαίνει γίνεται χρήσιμη.",
    cases: section4,
  },
];

export function ErgoAnimations() {
  return (
    <div className="space-y-[4rem]">
      {SECTIONS.map((s, i) => (
        <section key={s.title} id={`enotita-${i + 1}`} className="scroll-mt-20 border-t-4 pt-6" style={{ borderColor: s.color }}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: s.color }}>
            Ενότητα {i + 1} · κουτάκια {s.cases[0].n}–{s.cases[s.cases.length - 1].n}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1c2433] sm:text-3xl">{s.title}</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#3d4452]">{s.intro}</p>
          <div className="mt-8 grid gap-x-[3rem] gap-y-[3.5rem] lg:grid-cols-2">
            {s.cases.map((c) => (
              <AnimCard key={c.n} data={c} accent={s.color} study={{ lesson: "ergo", path: "/mixalis/ergo" }} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
