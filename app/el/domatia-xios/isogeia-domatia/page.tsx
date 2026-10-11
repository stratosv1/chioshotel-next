import type { Metadata } from "next";
import { GroundFloorRoomsRoute, groundFloorRoomsMetadata } from "@/components/rooms/GroundFloorRoomsRoute";

export const metadata: Metadata = groundFloorRoomsMetadata("el");

export default function Page() {
  return <GroundFloorRoomsRoute language="el" />;
}
