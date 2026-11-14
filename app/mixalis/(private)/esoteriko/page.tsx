import type { Metadata } from "next";
import { EsoterikoPage } from "@/components/mixalis/esoteriko/EsoterikoPage";

export const metadata: Metadata = {
  title: { absolute: "Εσωτερικό γινόμενο · Περιπτώσεις ασκήσεων · Μαθηματικά Β΄ Λυκείου" },
  description:
    "Όλες οι περιπτώσεις ασκήσεων στο εσωτερικό γινόμενο διανυσμάτων: τι θα σου ζητήσουν, τι σκέφτεσαι, μέθοδος βήμα-βήμα και λυμένο παράδειγμα, μαζί με προβολή και σύνδεση με τη Φυσική.",
  robots: { index: false, follow: false },
};

export default function EsoterikoRoute() {
  return <EsoterikoPage />;
}
