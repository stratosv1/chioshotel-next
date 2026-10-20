import type { Metadata } from "next";
import { DianismaClient } from "@/components/mixalis/dianisma/DianismaClient";

export const metadata: Metadata = {
  title: { absolute: "Διάνυσμα: πέρα από το βέλος · Physics Workspace" },
  description: "12 βασικές ιδέες για τα διανύσματα με σχήματα, συνιστώσες με τριγωνομετρία και λυμένο παράδειγμα.",
};

export default function DianismaPage() {
  return <DianismaClient />;
}
