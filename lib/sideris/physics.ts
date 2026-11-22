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
      "Μονάδες και μετατροπές, στιγμή και διάρκεια, αναλογικά και ψηφιακά ρολόγια, ακρίβεια και μέση τιμή. Με κινούμενα σχέδια, πειράματα, κάρτες και διαγώνισμα στα 20.",
    sections: [
      { id: "plano", code: "📋", title: "Πλάνο" },
      { id: "fotocopia", code: "📄", title: "Φωτοτυπία καθηγητή" },
      { id: "2-1", code: "1", title: "Μονάδες" },
      { id: "2-2", code: "2", title: "Στιγμή – διάρκεια" },
      { id: "2-3", code: "3", title: "Όργανα" },
      { id: "2-4", code: "4", title: "Ακρίβεια – μέση τιμή" },
      { id: "2-5", code: "5", title: "Εκκρεμές" },
      { id: "askiseis", code: "✏️", title: "Ασκήσεις" },
      { id: "kartes", code: "🃏", title: "Κάρτες" },
      { id: "test", code: "🏁", title: "Διαγώνισμα" },
    ],
  },
];

export function getPhysicsChapter(slug: string) {
  return PHYSICS_CHAPTERS.find((c) => c.slug === slug) ?? null;
}
