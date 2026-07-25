import type { ReactNode } from "react";
import { headers } from "next/headers";
import { PolishHeaderTailwind } from "@/components/pl/PolishHeaderTailwind";
import { PolishFooterTailwind } from "@/components/pl/PolishFooterTailwind";

export default async function PolishLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-current-pathname") || "/pl/";

  return (
    <div lang="pl" className="min-h-screen bg-[#fbf8f2] text-stone-800">
      <PolishHeaderTailwind pathname={pathname} />
      {children}
      <PolishFooterTailwind />
    </div>
  );
}
