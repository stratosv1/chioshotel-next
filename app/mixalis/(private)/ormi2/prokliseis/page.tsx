import type { Metadata } from "next";
import { OrmiNavStrip } from "@/components/mixalis/ormi/OrmiNav";
import { Ormi2ChallengeLab } from "@/components/mixalis/ormi2/Ormi2ChallengeLab";

export const metadata: Metadata = {
  title: { absolute: "Ορμή 2 · Προκλήσεις Συνδυαστικών | Physics Workspace" },
  description: "Δύσκολες σύνθετες ασκήσεις ορμής, κρούσεων και ενέργειας με προοδευτικές υποδείξεις, επαλήθευση κάθε αριθμητικού βήματος και παραλλαγές.",
};

export default function Ormi2ChallengesPage() {
  return (
    <>
      <OrmiNavStrip active="sintheta" />
      <Ormi2ChallengeLab />
    </>
  );
}
