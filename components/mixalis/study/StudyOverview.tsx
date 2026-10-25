"use client";

import { useEffect, useState } from "react";
import { STUDY_LESSONS, onStudyChange, readStudy, readTotals, type StudyData } from "./store";

function useStudy() {
  const [data, setData] = useState<StudyData>({});
  const [totals, setTotals] = useState<Record<string, number>>({});
  useEffect(() => {
    const sync = () => {
      setData(readStudy());
      setTotals(readTotals());
    };
    sync();
    return onStudyChange(sync);
  }, []);
  return { data, totals };
}

/** Dashboard card: everything marked "★ Να το ξαναδώ", across all lessons. */
export function StudyOverview() {
  const { data } = useStudy();
  const groups = Object.keys(STUDY_LESSONS)
    .map((lesson) => ({
      lesson,
      items: Object.entries(data[lesson] ?? {})
        .filter(([, m]) => m.s === "again")
        .sort((a, b) => a[1].at - b[1].at),
    }))
    .filter((g) => g.items.length);
  const count = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="mb-8 rounded-3xl border border-[#c9822f]/30 bg-[#fffaf2] p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">★ Να τα ξαναδώ</h2>
        <span className="text-sm font-semibold text-[#8a5a22]">{count} σημειωμένα</span>
      </div>
      {count === 0 ? (
        <p className="mt-2 text-sm leading-6 text-[#6f665f]">
          Όταν διαβάζεις ένα μάθημα, πάτα <b>★ Να το ξαναδώ</b> κάτω από όποια ενότητα, κουτάκι ή άσκηση θέλεις να ξαναδείς. Θα μαζευτούν όλα
          εδώ. Όσα τα έχεις καταλάβει, πάτα <b>✓ Τελείωσα</b>.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g.lesson}>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#857261]">{STUDY_LESSONS[g.lesson]}</p>
              <ul className="grid gap-1.5">
                {g.items.map(([id, m]) => (
                  <li key={id}>
                    <a href={m.h} className="block rounded-xl bg-white px-3 py-2 text-sm font-medium text-[#4d4138] shadow-sm ring-1 ring-black/5 hover:bg-[#fdf3e6]">
                      ★ {m.t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** Small progress line on a lesson card. */
export function LessonProgress({ lesson }: { lesson: string }) {
  const { data, totals } = useStudy();
  const marks = Object.values(data[lesson] ?? {});
  const done = marks.filter((m) => m.s === "done").length;
  const again = marks.filter((m) => m.s === "again").length;
  const total = totals[lesson] ?? 0;
  if (!total && !marks.length) return null;
  const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
  return (
    <div className="grid gap-1.5">
      <div className="flex flex-wrap justify-between gap-2 text-sm text-[#5c534c]">
        <span>
          <b className="text-[#2e6b47]">✓ {done}</b>
          {total ? ` / ${total}` : ""} τελειωμένα
        </span>
        {again ? <b className="text-[#8a5a22]">★ {again} για ξανά</b> : null}
      </div>
      {total ? (
        <div className="h-1.5 overflow-hidden rounded-full bg-[#efe9e1]">
          <div className="h-full rounded-full bg-[#2e8b57]" style={{ width: `${pct}%` }} />
        </div>
      ) : null}
    </div>
  );
}
