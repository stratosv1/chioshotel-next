import { redirect } from "next/navigation";
import { getSiderisSession } from "@/lib/sideris/auth";

export const dynamic = "force-dynamic";

export default async function SiderisPrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSiderisSession();

  if (!session) {
    redirect("/sideris/login");
  }

  return children;
}
