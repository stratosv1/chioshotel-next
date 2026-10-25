"use client";

import { useEffect, useState } from "react";
import { onStudyChange, readStudy, setStudyMark, type StudyState } from "./store";

/**
 * "✓ Τελείωσα" / "★ Να το ξαναδώ" buttons for one study unit (a card or a section).
 * The surrounding element should carry data-study-lesson / data-study-id so the
 * lesson's StudyBar can count and filter it.
 */
export function StudyMark({
  lesson,
  id,
  title,
  path,
  className = "",
}: {
  lesson: string;
  id: string;
  title: string;
  /** Page path, e.g. "/mixalis/ormi". The anchor is the element id. */
  path: string;
  className?: string;
}) {
  const [state, setState] = useState<StudyState | null>(null);

  useEffect(() => {
    const sync = () => setState(readStudy()[lesson]?.[id]?.s ?? null);
    sync();
    return onStudyChange(sync);
  }, [lesson, id]);

  const toggle = (next: StudyState) => {
    const value = state === next ? null : next;
    setStudyMark(lesson, id, value, title, `${path}#${id}`);
    setState(value);
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#857261]">Πώς πήγε;</span>
      <button
        type="button"
        onClick={() => toggle("done")}
        aria-pressed={state === "done"}
        className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
          state === "done" ? "bg-[#2e8b57] text-white" : "border border-[#2e8b57]/40 bg-white text-[#2e6b47] hover:bg-[#ecf7f0]"
        }`}
      >
        ✓ Τελείωσα
      </button>
      <button
        type="button"
        onClick={() => toggle("again")}
        aria-pressed={state === "again"}
        className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
          state === "again" ? "bg-[#c9822f] text-white" : "border border-[#c9822f]/50 bg-white text-[#8a5a22] hover:bg-[#fdf3e6]"
        }`}
      >
        ★ Να το ξαναδώ
      </button>
    </div>
  );
}
