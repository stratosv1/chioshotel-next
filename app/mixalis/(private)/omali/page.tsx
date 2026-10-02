import type { Metadata } from "next";
import { OmaliClient } from "@/components/mixalis/omali/OmaliClient";

export const metadata: Metadata = {
  title: { absolute: "Ομαλή κυκλική κίνηση · Physics Workspace" },
  description: "Διαδραστικό μάθημα για την ομαλή κυκλική κίνηση και την κεντρομόλο δύναμη.",
};

export default function OmaliPage() {
  return <OmaliClient />;
}
