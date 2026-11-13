"use client";

import { AnimCard } from "./AnimCard";
import { SECTIONS } from "./Omali2Animations";

/** All animated cases in poster order, with the colour of their section. */
const ALL = SECTIONS.flatMap((s) => s.cases.map((c) => ({ c, section: s })))
  .slice()
  .sort((a, b) => a.c.n - b.c.n);

export const CASE_NUMBERS = ALL.map((x) => x.c.n);

/** One animated case, as on /mixalis/omali2, for use inside other pages. */
export function CaseViewer({ n }: { n: number }) {
  const hit = ALL.find((x) => x.c.n === n);
  if (!hit) return null;
  return (
    <div className="rounded-3xl border p-3 sm:p-5" style={{ borderColor: hit.section.color, backgroundColor: hit.section.bg }}>
      <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: hit.section.color }}>
        {hit.section.title}
      </p>
      <AnimCard key={n} data={hit.c} accent={hit.section.color} />
    </div>
  );
}
