import type { Metadata } from "next";
import { OrmiNavStrip } from "@/components/mixalis/ormi/OrmiNav";
import { Ormi2ThinkingTricks } from "@/components/mixalis/ormi2/Ormi2ThinkingTricks";

export const metadata: Metadata = {
  title: { absolute: "Ορμή 2 · Πέντε Δυνατά Κόλπα Σκέψης | Physics Workspace" },
  description: "Πέντε δύσκολες ασκήσεις ορμής με ανάλυση φυσικών δυνάμεων, ιδιαίτερη σκέψη και 20 λυμένα εναλλακτικά ζητούμενα.",
};

export default function Ormi2ThinkingPage() {
  return (
    <>
      <OrmiNavStrip active="sintheta" />
      <Ormi2ThinkingTricks />
    </>
  );
}
