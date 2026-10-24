"use client";

import { rich } from "@/components/mixalis/ormi/AnimCard";
import { ExerciseCard } from "./ExerciseCard";
import { GROUPS } from "./index";

const anchor = (id: string) => `a${id.replace(".", "-")}`;

export function TripolitisList() {
  return (
    <div className="space-y-10">
      <nav className="sticky top-2 z-20 rounded-3xl border border-black/10 bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
          {GROUPS.flatMap((g) =>
            g.items.map((e) => (
              <a
                key={e.id}
                href={`#${anchor(e.id)}`}
                className="rounded-full px-2.5 py-1 font-mono text-xs font-bold text-white hover:opacity-80"
                style={{ backgroundColor: g.accent }}
              >
                {e.id}
              </a>
            )),
          )}
        </div>
      </nav>
      {GROUPS.map((g) => (
        <section key={g.id} id={g.id} className="scroll-mt-24 space-y-5">
          <div className="rounded-3xl border-l-8 bg-white px-5 py-4 shadow-sm" style={{ borderColor: g.accent }}>
            <p className="font-mono text-sm font-bold" style={{ color: g.accent }}>
              {g.pages}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-[#1c2433]">{g.title}</h2>
            <p className="mt-1 text-[15px] leading-7 text-[#5c534c]">{rich(g.intro)}</p>
          </div>
          {g.items.map((e) => (
            <ExerciseCard key={e.id} ex={e} accent={g.accent} />
          ))}
        </section>
      ))}
    </div>
  );
}
