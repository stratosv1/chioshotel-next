"use client";

import { AnimCard } from "./AnimCard";
import type { OCase } from "./kit2";
import { section1 } from "./scenes-1";
import { section2 } from "./scenes-2";
import { section3 } from "./scenes-3";
import { section4 } from "./scenes-4";
import { section5 } from "./scenes-5";
import { section6 } from "./scenes-6";
import { section7 } from "./scenes-7";

/* Colours and titles follow the six sections of the omali poster. */
export const SECTIONS: { title: string; color: string; bg: string; intro: string; cases: OCase[] }[] = [
  {
    title: "Κίνηση και επιτάχυνση",
    color: "#1e5fb4",
    bg: "#eaf2fd",
    intro: "Πρώτα «βλέπουμε» την κίνηση: περίοδος, γωνιακή ταχύτητα και γιατί υπάρχει επιτάχυνση ακόμα κι όταν το μέτρο της υ δεν αλλάζει.",
    cases: section1,
  },
  {
    title: "Δρόμοι και περιστρεφόμενες επιφάνειες",
    color: "#0f7d8c",
    bg: "#e6f6f8",
    intro: "Κάποια πραγματική δύναμη πρέπει να «δώσει» την κεντρομόλο: η τάση ενός νήματος, η στατική τριβή, η κάθετη δύναμη ενός τοίχου ή ενός κεκλιμένου δρόμου.",
    cases: section2,
  },
  {
    title: "Κωνικό εκκρεμές",
    color: "#6b3fa0",
    bg: "#f3edfa",
    intro: "Ένα σώμα σε νήμα γράφει οριζόντιο κύκλο. Η τάση αναλύεται σε δύο κομμάτια: το κατακόρυφο ισορροπεί το βάρος, το οριζόντιο είναι η κεντρομόλος. Η γωνία φ μετριέται από την κατακόρυφο.",
    cases: section3,
  },
  {
    title: "Νήμα σε κατακόρυφο κύκλο",
    color: "#c46a12",
    bg: "#fdf3e7",
    intro: "Ο κύκλος είναι κατακόρυφος, οπότε το βάρος άλλοτε βοηθά και άλλοτε αντιστέκεται. Κανόνας: θετικά προς το κέντρο, ΣF = mυ²/R σε κάθε θέση.",
    cases: section4,
  },
  {
    title: "Λόφοι, κοιλάδες και λούπες",
    color: "#b8322b",
    bg: "#fcecea",
    intro: "Ίδια λογική με το νήμα, μόνο που τώρα σπρώχνει η επιφάνεια (κάθετη δύναμη N). Η N είναι αυτό που «νιώθεις» σαν βάρος.",
    cases: section5,
  },
  {
    title: "Ενέργεια, όρια και τροχιές",
    color: "#2e7d32",
    bg: "#ebf6ec",
    intro: "Συνδυάζουμε ΣF = mυ²/R με την ΑΔΜΕ: ποια είναι η μικρότερη ταχύτητα για να κάνει το σώμα όλο τον κύκλο, πότε χάνει την επαφή, πώς κινείται ένας δορυφόρος.",
    cases: section6,
  },
  {
    title: "Ρολόγια και συναντήσεις",
    color: "#8e3b6a",
    bg: "#f9edf4",
    intro: "Δύο σώματα που κινούνται ταυτόχρονα: δείκτες ρολογιού, δρομείς σε κυκλικό στίβο, κυκλική μαζί με ευθύγραμμη. Το κλειδί είναι η σχετική κίνηση: ομόρροπα αφαιρείς, αντίρροπα προσθέτεις.",
    cases: section7,
  },
];

export function Omali2Animations() {
  return (
    <div className="space-y-6">
      {SECTIONS.map((s, i) => !s.cases.length ? null : (
        <section key={s.title} id={`enotita-${i + 1}`} className="scroll-mt-20 rounded-3xl border p-4 sm:p-6" style={{ borderColor: s.color, backgroundColor: s.bg }}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: s.color }}>
            Ενότητα {i + 1} · {s.cases[0].n > 30 ? "επιπλέον ασκήσεις" : "κουτάκια"} {s.cases[0].n}–{s.cases[s.cases.length - 1].n}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1c2433] sm:text-3xl">{s.title}</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#3d4452]">{s.intro}</p>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {s.cases.map((c) => (
              <AnimCard key={c.n} data={c} accent={s.color} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
