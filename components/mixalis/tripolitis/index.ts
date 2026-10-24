import type { Exercise } from "./ExerciseCard";
import { ORMI_A } from "./ormi-a";
import { ORMI_B } from "./ormi-b";
import { ORMI_C } from "./ormi-c";
import { ORMI_D } from "./ormi-d";

export type ExerciseGroup = { id: string; title: string; pages: string; accent: string; intro: string; items: Exercise[] };

/**
 * Exercises from the Τριπολίτης photocopies, in book order.
 * To add more: create a new file like ormi-a.tsx and append a group here.
 */
export const GROUPS: ExerciseGroup[] = [
  {
    id: "ormi-rythmos",
    title: "Ασκήσεις · Ορμή και ρυθμός μεταβολής της ορμής",
    pages: "4.67–4.83",
    accent: "#1f6f5c",
    intro: "p = m·υ, Δp = p_{τελ} − p_{αρχ}, ΣF = Δp/Δt. Πάντα διάλεξε πρώτα θετική φορά.",
    items: ORMI_A,
  },
  {
    id: "ormi-ado",
    title: "Ασκήσεις · Αρχή διατήρησης της ορμής",
    pages: "4.84–4.100",
    accent: "#1f6fd1",
    intro: "Σύστημα χωρίς εξωτερικές δυνάμεις (ή κρούση/έκρηξη που κρατά ελάχιστα): p_{ολ,πριν} = p_{ολ,μετά}. Αρχικά ακίνητο σύστημα ⇒ p_{ολ} = 0.",
    items: ORMI_B,
  },
  {
    id: "provlimata-rythmos",
    title: "Προβλήματα · Ορμή και ρυθμός μεταβολής",
    pages: "4.101–4.106",
    accent: "#b4532a",
    intro: "Πιο σύνθετα: τριβή, πλάγιες δυνάμεις, διαγράμματα. Πάντα: όλες οι δυνάμεις → ΣF → Δp = ΣF·Δt.",
    items: ORMI_C,
  },
  {
    id: "provlimata-ado",
    title: "Προβλήματα · Αρχή διατήρησης της ορμής",
    pages: "4.107–4.123",
    accent: "#6b4fa0",
    intro: "Δύο φάσεις: πρώτα ΑΔΟ στην κρούση, μετά ό,τι ακολουθεί (τριβή, βολή, κεκλιμένο, κυκλική). Για ελαστική ή απώλεια ενέργειας: σύγκρινε κινητικές.",
    items: ORMI_D,
  },
];
