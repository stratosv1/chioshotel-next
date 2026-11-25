import type { Metadata } from "next";
import { Ormi2Trainer } from "@/components/mixalis/ormi2/Ormi2Trainer";
import { OrmiNav, OrmiNavStrip } from "@/components/mixalis/ormi/OrmiNav";
import { SinthetaPresentationsClient } from "@/components/mixalis/ormi/sintheta/SinthetaPresentationsClient";

export const metadata: Metadata = {
  title: { absolute: "Ορμή 2 · Εργαστήριο Συνδυαστικών | Physics Workspace" },
  description: "Εξάσκηση στη διάκριση φάσεων, την επιλογή νόμων και τη στρατηγική επίλυσης συνδυαστικών ασκήσεων ορμής.",
};

// Βήμα 4 του κεφαλαίου: τα 36 σενάρια ζουν μόνο εδώ (εργαστήριο + παρουσιάσεις «πώς σκέφτομαι»), owner 2026-11-25.
export default function Ormi2Page() {
  return (
    <>
      <OrmiNavStrip active="sintheta" />
      <Ormi2Trainer />
      <div className="bg-[#f3efe8] px-3 pb-8 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <SinthetaPresentationsClient />
          <OrmiNav active="sintheta" />
        </div>
      </div>
    </>
  );
}
