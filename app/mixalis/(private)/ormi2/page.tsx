import type { Metadata } from "next";
import { Ormi2Trainer } from "@/components/mixalis/ormi2/Ormi2Trainer";

export const metadata: Metadata = {
  title: { absolute: "Ορμή 2 · Εργαστήριο Συνδυαστικών | Physics Workspace" },
  description: "Εξάσκηση στη διάκριση φάσεων, την επιλογή νόμων και τη στρατηγική επίλυσης συνδυαστικών ασκήσεων ορμής.",
};

export default function Ormi2Page() {
  return <Ormi2Trainer />;
}
