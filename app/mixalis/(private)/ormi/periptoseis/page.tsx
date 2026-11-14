import type { Metadata } from "next";
import { OrmiPeriptoseisPage } from "@/components/mixalis/ormi/periptoseis/OrmiPeriptoseisPage";

export const metadata: Metadata = {
  title: { absolute: "Ορμή και κρούσεις · Περιπτώσεις ασκήσεων · Φυσική Β΄ Λυκείου" },
  description:
    "Όλες οι περιπτώσεις ασκήσεων στην ορμή και τις κρούσεις (§2.3–2.7) από την Τράπεζα Θεμάτων: τι θα σου ζητήσουν, τι σκέφτεσαι, μέθοδος βήμα-βήμα και λυμένο παράδειγμα.",
  robots: { index: false, follow: false },
};

export default function OrmiPeriptoseisRoute() {
  return <OrmiPeriptoseisPage />;
}
