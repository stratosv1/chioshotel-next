// Κεφάλαια της Φυσικής Α΄ Γυμνασίου στο /sideris/fysiki.
// Πρόσθεσε κεφάλαιο εδώ όταν υπάρχει η σελίδα του στο app/sideris/(private)/fysiki/<slug>.

export type PhysicsSection = { id: string; code: string; title: string };
export type PhysicsChapter = { number: number; slug: string; title: string; summary: string; sections: PhysicsSection[] };

export const PHYSICS_CHAPTERS: PhysicsChapter[] = [
  {
    number: 2,
    slug: "kefalaio-2",
    title: "Μετρήσεις χρόνου – Η ακρίβεια",
    summary:
      "Μονάδες χρόνου και μετατροπές, χρονική στιγμή και χρονική διάρκεια, αναλογικά και ψηφιακά ρολόγια, ακρίβεια και μέση τιμή. Με ασκήσεις από το βοήθημα και τελικό τεστ.",
    sections: [
      { id: "fotocopia", code: "📄", title: "Η φωτοτυπία του καθηγητή" },
      { id: "2-1", code: "1", title: "Μονάδες χρόνου" },
      { id: "2-2", code: "2", title: "Στιγμή και διάρκεια" },
      { id: "2-3", code: "3", title: "Όργανα μέτρησης" },
      { id: "2-4", code: "4", title: "Ακρίβεια και μέση τιμή" },
      { id: "2-5", code: "5", title: "Το εκκρεμές (απλά)" },
      { id: "askiseis", code: "✏️", title: "Ασκήσεις βοηθήματος" },
      { id: "test", code: "🏁", title: "Τελικό τεστ" },
    ],
  },
];

export function getPhysicsChapter(slug: string) {
  return PHYSICS_CHAPTERS.find((c) => c.slug === slug) ?? null;
}
