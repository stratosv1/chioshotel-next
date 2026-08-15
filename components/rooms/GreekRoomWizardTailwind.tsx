import { RoomWizardTailwind } from "@/components/rooms/RoomWizardTailwind";
import type { RoomWizardRoom } from "@/content/rooms";

type Props = {
  rooms: RoomWizardRoom[];
  whatsappPhone: string;
};

export function GreekRoomWizardTailwind(props: Props) {
  return <RoomWizardTailwind {...props} language="el" />;
}
