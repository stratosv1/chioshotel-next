"use client";

import { AnimCard } from "../AnimCard";
import { SINTHETA_CASES } from "./stories";

const ACCENT = "#6b4fa0";

export function SinthetaPresentations() {
  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      {SINTHETA_CASES.map((c) => (
        <AnimCard key={c.n} data={c} accent={ACCENT} idPrefix="s" study={{ lesson: "ormi", path: "/mixalis/ormi" }} />
      ))}
    </div>
  );
}
