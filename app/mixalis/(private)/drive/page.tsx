import type { Metadata } from "next";
import Link from "next/link";
import { DriveQuiz } from "@/components/mixalis/drive/DriveQuiz";
import { DRIVE_QUESTIONS } from "@/lib/mixalis/drive/questions";

export const metadata: Metadata = {
  title: { absolute: "Δίπλωμα μηχανής · Εξάσκηση" },
  description: "Εξάσκηση στις ερωτήσεις θεωρίας για το δίπλωμα μοτοσυκλέτας, με λίστα λαθών και στατιστικά.",
};

export default function DrivePage() {
  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/mixalis" prefetch={false} className="text-sm font-semibold text-[#857261] hover:text-[#5f5045]">
          ← Τα μαθήματά μου
        </Link>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Θεωρία · μοτοσυκλέτα</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Δίπλωμα μηχανής</h1>
        <div className="mt-6">
          <DriveQuiz questions={DRIVE_QUESTIONS} />
        </div>
      </div>
    </main>
  );
}
