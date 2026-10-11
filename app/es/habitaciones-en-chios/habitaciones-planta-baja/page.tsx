import type { Metadata } from "next";
import { GroundFloorRoomsRoute, groundFloorRoomsMetadata } from "@/components/rooms/GroundFloorRoomsRoute";

export const metadata: Metadata = groundFloorRoomsMetadata("es");

export default function Page() {
  return <GroundFloorRoomsRoute language="es" />;
}
