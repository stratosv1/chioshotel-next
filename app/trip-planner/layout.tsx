import type { ReactNode } from "react";
import TripPlannerSharpBeachImages from "@/components/trip-planner/TripPlannerSharpBeachImages";

export default function TripPlannerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <TripPlannerSharpBeachImages />
    </>
  );
}
