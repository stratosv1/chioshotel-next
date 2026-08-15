import { permanentRedirect } from "next/navigation";

export default function Page() {
  permanentRedirect("/ai-assistant/?lang=tr");
}
