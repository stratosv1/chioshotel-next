"use client";

import { AnimCard } from "./AnimCard";
import type { Case } from "./kit";
import { section1 } from "./scenes-1";
import { section2, section3 } from "./scenes-2";
import { section4, section5 } from "./scenes-3";
import { section6, section7 } from "./scenes-4";
import { section8 } from "./scenes-5";

export const SECTIONS: { title: string; color: string; bg: string; intro: string; cases: Case[] }[] = [
  {
    title: "Ορμή και μεταβολή ορμής",
    color: "#1e5fb4",
    bg: "#eaf2fd",
    intro: "Πρώτα μαθαίνουμε να «βλέπουμε» την ορμή σαν βέλος. Μετά μετράμε πόσο άλλαξε: Δp = τελική ορμή − αρχική ορμή, πάντα αφού διαλέξουμε θετική φορά.",
    cases: section1,
  },
  {
    title: "Δύναμη και ρυθμός μεταβολής ορμής",
    color: "#0f7d8c",
    bg: "#e6f6f8",
    intro: "Η δύναμη είναι ο ρυθμός με τον οποίο αλλάζει η ορμή: ΣF = Δp/Δt. Στα διαγράμματα: εμβαδόν F–t = Δp, κλίση p–t = ΣF.",
    cases: section2,
  },
  {
    title: "Σύστημα σωμάτων – ΑΔΟ",
    color: "#6b3fa0",
    bg: "#f3edfa",
    intro: "Όταν δύο σώματα σπρώχνουν το ένα το άλλο, ό,τι ορμή κερδίζει το ένα τη χάνει το άλλο. Κοίτα τη μαύρη ράβδο της ολικής ορμής: δεν αλλάζει ποτέ.",
    cases: section3,
  },
  {
    title: "Πλαστική κρούση (συσσωμάτωση)",
    color: "#c46a12",
    bg: "#fdf3e7",
    intro: "Κολλάνε και φεύγουν με μία κοινή ταχύτητα V. Η ορμή διατηρείται, η κινητική ενέργεια όχι.",
    cases: section4,
  },
  {
    title: "Βλήμα και στόχος",
    color: "#b8322b",
    bg: "#fcecea",
    intro: "Δύο στάδια: πρώτα η κρούση (ΑΔΟ), μετά ό,τι ακολουθεί (ΘΜΚΕ με τριβή, ΑΔΜΕ για ύψος, κεντρομόλος για τάση).",
    cases: section5,
  },
  {
    title: "Εκρήξεις και συνδυαστικά",
    color: "#2e7d32",
    bg: "#ebf6ec",
    intro: "Στην έκρηξη η ορμή μένει ίδια, αλλά η κινητική αυξάνεται. Συχνά μετά έρχεται οριζόντια βολή.",
    cases: section6,
  },
  {
    title: "Κρούσεις χωρίς συσσωμάτωση και δυνάμεις επαφής",
    color: "#3949ab",
    bg: "#eceefb",
    intro: "Νέες περιπτώσεις από το σχολικό βιβλίο και τον Σαββάλα: κρούσεις όπου τα σώματα δεν κολλάνε, και τι δύναμη «νιώθει» ένα σώμα όταν σταματά.",
    cases: section7,
  },
  {
    title: "Ωθήσεις, ροές και κατακόρυφη βολή",
    color: "#8e3b6a",
    bg: "#f9edf4",
    intro: "Ελατήριο, πύραυλος, περπάτημα σε σανίδα, βροχή: όλα είναι ΑΔΟ ή ΣF = Δp/Δt με άλλη μορφή.",
    cases: section8,
  },
];

export function OrmiAnimations() {
  return (
    <div className="space-y-6">
      {SECTIONS.map((s, i) => (
        <section key={s.title} id={`enotita-${i + 1}`} className="scroll-mt-20 rounded-3xl border p-4 sm:p-6" style={{ borderColor: s.color, backgroundColor: s.bg }}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: s.color }}>
            Ενότητα {i + 1} · κουτάκια {s.cases[0].n}–{s.cases[s.cases.length - 1].n}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1c2433] sm:text-3xl">{s.title}</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#3d4452]">{s.intro}</p>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {s.cases.map((c) => (
              <AnimCard key={c.n} data={c} accent={s.color} study={{ lesson: "ormi", path: "/mixalis/ormi" }} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
