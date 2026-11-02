import type { Metadata } from "next";
import { DianismaClient } from "@/components/mixalis/dianisma/DianismaClient";

export const metadata: Metadata = {
  title: { absolute: "Διάνυσμα: πέρα από το βέλος · Physics Workspace" },
  description: "Συνιστώσες δύναμης Fx, Fy με ημίτονο και συνημίτονο: κανόνας της γωνίας, κεκλιμένο επίπεδο, λυμένα παραδείγματα και προπόνηση.",
};

export default function DianismaPage() {
  return <DianismaClient />;
}
