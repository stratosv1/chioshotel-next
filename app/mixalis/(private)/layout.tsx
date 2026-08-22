import { redirect } from "next/navigation";
import { getMixalisSession } from "@/lib/mixalis/auth";

export const dynamic = "force-dynamic";

export default async function MixalisPrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getMixalisSession();

  if (!session) {
    redirect("/mixalis/login");
  }

  return children;
}
