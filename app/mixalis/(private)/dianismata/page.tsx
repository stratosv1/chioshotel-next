import type { Metadata } from "next";
import { DianismataClient } from "@/components/mixalis/dianismata/DianismataClient";

export const metadata: Metadata = {
  title: { absolute: "Διανύσματα · Μαθηματικά Β΄ Λυκείου" },
  description: "Θεωρία των συντεταγμένων στο επίπεδο με κινούμενα σχέδια, θέματα της Τράπεζας Θεμάτων με λύσεις βήμα-βήμα και ασκήσεις εξάσκησης.",
};

export default function DianismataRoute() {
  return <DianismataClient />;
}
