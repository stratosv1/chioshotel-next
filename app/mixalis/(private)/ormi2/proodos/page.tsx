import type { Metadata } from "next";
import { OrmiNavStrip } from "@/components/mixalis/ormi/OrmiNav";
import { Ormi2ProgressDashboard } from "@/components/mixalis/ormi2/Ormi2ProgressDashboard";

export const metadata: Metadata = {
  title: { absolute: "Ορμή 2 · Ο χάρτης προόδου μου | Physics Workspace" },
  description: "Προσωπική καταγραφή δεξιοτήτων, ενδιάμεσων λαθών και προτάσεων εξάσκησης στις συνδυαστικές ασκήσεις ορμής.",
};

export default function Ormi2ProgressPage() {
  return (
    <>
      <OrmiNavStrip active="proodos" />
      <Ormi2ProgressDashboard />
    </>
  );
}
