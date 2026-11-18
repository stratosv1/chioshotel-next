// Chapters of the Α΄ Γυμνασίου maths book on /sideris/mathimatika.
// Add a chapter here when its page exists under app/sideris/(private)/mathimatika/<slug>.

export type MathSection = { id: string; code: string; title: string };
export type MathChapter = { number: number; slug: string; title: string; summary: string; sections: MathSection[] };

export const MATH_CHAPTERS: MathChapter[] = [
  {
    number: 2,
    slug: "kefalaio-2",
    title: "Τα κλάσματα",
    summary: "Έννοια, ισοδύναμα, σύγκριση και οι τέσσερις πράξεις κλασμάτων, με θεωρία, λυμένα παραδείγματα και τις ασκήσεις του βιβλίου λυμένες.",
    sections: [
      { id: "2-1", code: "2.1", title: "Η έννοια του κλάσματος" },
      { id: "2-2", code: "2.2", title: "Ισοδύναμα κλάσματα" },
      { id: "2-3", code: "2.3", title: "Σύγκριση κλασμάτων" },
      { id: "2-4", code: "2.4", title: "Πρόσθεση και αφαίρεση" },
      { id: "2-5", code: "2.5", title: "Πολλαπλασιασμός" },
      { id: "2-6", code: "2.6", title: "Διαίρεση" },
      { id: "anakefalaiosi", code: "★", title: "Ανακεφαλαίωση" },
    ],
  },
];

export function getMathChapter(slug: string) {
  return MATH_CHAPTERS.find((c) => c.slug === slug) ?? null;
}
