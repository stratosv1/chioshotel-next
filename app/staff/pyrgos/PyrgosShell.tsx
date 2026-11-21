import type { ReactNode } from "react";
import PyrgosNav from "./PyrgosNav";

/** Puts any staff module inside the control tower, with the shared menu on the side. */
export default function PyrgosShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eef3f7] lg:flex">
      <PyrgosNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
