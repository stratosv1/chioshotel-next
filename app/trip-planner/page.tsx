import type { Metadata } from "next";
import TripPlannerStart from "@/components/trip-planner/TripPlannerStartV5";
import styles from "./trip-planner.module.css";

export const metadata: Metadata = {
  title: "Chios Trip Planner | Οργάνωσε τη μέρα σου στη Χίο",
  description:
    "Διάλεξε τι θέλεις να κάνεις σήμερα στη Χίο και δημιούργησε ένα απλό, προσωπικό πλάνο με παραλίες, χωριά, φαγητό, ποτό και αξιοθέατα.",
  robots: { index: false, follow: false },
};

// Unified visual card template for beaches, villages, sights, food and drink.
export default function TripPlannerPage() {
  return (
    <div className={styles.tripPlannerUi}>
      <TripPlannerStart />
    </div>
  );
}
