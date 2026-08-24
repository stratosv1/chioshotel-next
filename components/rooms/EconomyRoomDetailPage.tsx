import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import type { RoomDetailData } from "@/content/room-details";

type EconomyRoomDetailPageProps = {
  data: RoomDetailData;
};

export function EconomyRoomDetailPage({ data }: EconomyRoomDetailPageProps) {
  return <RoomDetailPage data={{ ...data, id: "economy-double-carousel" }} />;
}
