import type { ReactNode } from "react";
import { PolishHeaderTailwind } from "@/components/pl/PolishHeaderTailwind";
import { PolishFooterTailwind } from "@/components/pl/PolishFooterTailwind";

export default function PolishLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="pl" className="min-h-screen bg-[#fbf8f2] text-stone-800">
      <PolishHeaderTailwind />
      {children}
      <PolishFooterTailwind />
    </div>
  );
}
