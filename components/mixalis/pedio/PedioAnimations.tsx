"use client";

import { AnimCard } from "./AnimCard";
import type { ECase } from "./kitE";
import { section1 } from "./scenes-1";
import { section2 } from "./scenes-2";
import { section3 } from "./scenes-3";
import { section4 } from "./scenes-4";
import { section5 } from "./scenes-5";
import { section6 } from "./scenes-6";

/* Colours and titles follow the six sections of the electric-field poster. */
export const SECTIONS: { title: string; color: string; bg: string; intro: string; cases: ECase[] }[] = [
  {
    title: "Ηλεκτροστατικό πεδίο – ένταση",
    color: "#1e5fb4",
    bg: "#eaf2fd",
    intro: "Η ένταση είναι διάνυσμα: δείχνει πού θα σπρωχτεί ένα θετικό φορτίο. Για πολλά φορτία τις προσθέτουμε σαν διανύσματα (σχολικό βιβλίο §1.2, Σαββάλας κεφ. 3).",
    cases: section1,
  },
  {
    title: "Ομογενές ηλεκτροστατικό πεδίο",
    color: "#0f7d8c",
    bg: "#e6f6f8",
    intro: "Ανάμεσα σε δύο φορτισμένες πλάκες η ένταση είναι ίδια παντού. Η δύναμη F = qE είναι σταθερή, οπότε τα σωματίδια κάνουν κινήσεις που ξέρουμε από τη μηχανική (Σαββάλας κεφ. 4).",
    cases: section2,
  },
  {
    title: "Ηλεκτροστατική δυναμική ενέργεια",
    color: "#6b3fa0",
    bg: "#f3edfa",
    intro: "Δύο φορτία έχουν ενέργεια επειδή αλληλεπιδρούν: U = kQq/r, με τα πρόσημα. Το έργο της δύναμης του πεδίου είναι η μείωση της U (σχολικό §1.3, Σαββάλας κεφ. 5).",
    cases: section3,
  },
  {
    title: "Δυναμικό – διαφορά δυναμικού",
    color: "#c46a12",
    bg: "#fdf3e7",
    intro: "Το δυναμικό είναι «ενέργεια ανά φορτίο» σε κάθε σημείο: ένας αριθμός με πρόσημο. Δυναμικά προστίθενται σαν αριθμοί, εντάσεις σαν διανύσματα (σχολικό §1.4, Σαββάλας κεφ. 6).",
    cases: section4,
  },
  {
    title: "Τάση και ένταση στο ομογενές πεδίο",
    color: "#b8322b",
    bg: "#fcecea",
    intro: "Στο ομογενές πεδίο η σύνδεση είναι απλή: E = V/ℓ. Το δυναμικό πέφτει γραμμικά κατά τη φορά της έντασης (Σαββάλας κεφ. 7).",
    cases: section5,
  },
  {
    title: "Πυκνωτής",
    color: "#2e7d32",
    bg: "#ebf6ec",
    intro: "Ο πυκνωτής αποθηκεύει φορτίο και ενέργεια. Το κλειδί σε κάθε άσκηση: είναι συνδεδεμένος με πηγή (σταθερό V) ή αποσυνδεδεμένος (σταθερό Q); (σχολικό §1.5, Σαββάλας κεφ. 8).",
    cases: section6,
  },
];

export function PedioAnimations() {
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
              <AnimCard key={c.n} data={c} accent={s.color} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
