"use client";

import { useCallback, useEffect, useState } from "react";
import { onStudyChange, readStudy, setLessonTotal, type StudyMarkEntry } from "./store";

type Filter = "all" | "again" | "todo";

const FILTERS: [Filter, string][] = [
  ["all", "Όλα"],
  ["again", "★ Μόνο όσα θέλω να ξαναδώ"],
  ["todo", "Όσα δεν έχω τελειώσει"],
];

/** Progress + filter for one lesson page. Works on every element with data-study-lesson={lesson}. */
export function StudyBar({ lesson }: { lesson: string }) {
  const [marks, setMarks] = useState<Record<string, StudyMarkEntry>>({});
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");
  const [openList, setOpenList] = useState(false);

  const units = useCallback(
    () => Array.from(document.querySelectorAll<HTMLElement>(`[data-study-lesson="${lesson}"]`)),
    [lesson],
  );

  // Count the study units on the page (some are rendered by client components after load).
  useEffect(() => {
    const count = () => {
      const n = units().length;
      setTotal(n);
      if (n) setLessonTotal(lesson, n);
    };
    count();
    // Animations mutate the DOM every frame, so recount at most every 800 ms.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const obs = new MutationObserver(() => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = undefined;
        count();
      }, 800);
    });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
  }, [lesson, units]);

  useEffect(() => {
    const sync = () => setMarks(readStudy()[lesson] ?? {});
    sync();
    return onStudyChange(sync);
  }, [lesson]);

  // Apply the filter by hiding the units that don't match.
  useEffect(() => {
    units().forEach((el) => {
      const s = marks[el.dataset.studyId ?? ""]?.s;
      const show = filter === "all" || (filter === "again" ? s === "again" : s !== "done");
      el.style.display = show ? "" : "none";
    });
  }, [filter, marks, units, total]);

  const done = Object.values(marks).filter((m) => m.s === "done").length;
  const again = Object.entries(marks)
    .filter(([, m]) => m.s === "again")
    .sort((a, b) => a[1].at - b[1].at);
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <>
      <section className="border-y border-[#ddd5c7] py-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Η πρόοδός μου</p>
          <p className="text-sm text-[#5c534c]">
            <b className="text-[#2e6b47]">✓ {done}</b> / {total} τελειωμένα · <b className="text-[#8a5a22]">★ {again.length}</b> για ξανά
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#efe9e1]">
          <div className="h-full rounded-full bg-[#2e8b57] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-3 text-sm leading-6 text-[#5c534c]">
          Κάτω από κάθε κουτάκι, άσκηση και θέμα πάτα <b>✓ Τελείωσα</b> όταν το έχεις καταλάβει ή <b>★ Να το ξαναδώ</b> αν θέλεις να γυρίσεις σε
          αυτό. Μετά διάλεξε «★ Μόνο όσα θέλω να ξαναδώ» για να δεις μόνο αυτά.
        </p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Τι να δείχνει η σελίδα">
          {FILTERS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                filter === key ? "bg-[#2c2825] text-white" : "border border-[#ddd5c7] bg-white text-[#4d4138] hover:bg-[#f3efe8]"
              }`}
            >
              {label}
              {key === "again" ? ` (${again.length})` : ""}
            </button>
          ))}
        </div>
        {again.length > 0 && (
          <div className="mt-4">
            <button type="button" onClick={() => setOpenList(!openList)} className="text-sm font-semibold text-[#8a5a22] underline-offset-4 hover:underline">
              {openList ? "▾" : "▸"} Λίστα «Να τα ξαναδώ» ({again.length})
            </button>
            {openList && (
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {again.map(([id, m]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="block rounded-xl bg-[#fdf3e6] px-3 py-2 text-sm font-medium text-[#6b4a1d] hover:bg-[#f8e6cc]">
                      ★ {m.t}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {filter !== "all" && (
        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-full bg-[#2c2825] px-4 py-2 text-sm text-white shadow-lg">
            <span>{filter === "again" ? `Βλέπεις μόνο ★ (${again.length})` : `Βλέπεις όσα δεν τελείωσες (${total - done})`}</span>
            <button type="button" onClick={() => setFilter("all")} className="rounded-full bg-white px-3 py-1 font-semibold text-[#2c2825]">
              Δείξε όλα
            </button>
          </div>
        </div>
      )}
    </>
  );
}
