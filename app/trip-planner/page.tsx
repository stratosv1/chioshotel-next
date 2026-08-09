import type { Metadata } from "next";
import TripPlannerStart from "@/components/trip-planner/TripPlannerStart";

export const metadata: Metadata = {
  title: "Chios Trip Planner | Οργάνωσε τη μέρα σου στη Χίο",
  description:
    "Διάλεξε τι θέλεις να κάνεις σήμερα στη Χίο και δημιούργησε ένα απλό, προσωπικό πλάνο με παραλίες, χωριά, φαγητό, ποτό και αξιοθέατα.",
  robots: { index: false, follow: false },
};

export default function TripPlannerPage() {
  return <TripPlannerStart />;
}
