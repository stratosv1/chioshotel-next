import type { Metadata } from "next";
import { GroundFloorRoomsRoute, groundFloorRoomsMetadata } from "@/components/rooms/GroundFloorRoomsRoute";

export const metadata: Metadata = groundFloorRoomsMetadata("fr");

export default function Page() {
  return <GroundFloorRoomsRoute language="fr" />;
}
