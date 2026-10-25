"use client";

import { useEffect, useState } from "react";
import { onStudyChange, readStudy } from "@/components/mixalis/study/store";

type Cell = { n: number; x: number; y: number; w: number; h: number };

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

/**
 * Clickable areas over the poster cells. A cell whose animation card is marked
 * "★ Να το ξαναδώ" gets an orange frame and a "★ Επανάληψη" badge.
 */
export function PosterCells({ cells, posterW, posterH, lesson }: { cells: Cell[]; posterW: number; posterH: number; lesson: string }) {
  const [again, setAgain] = useState<Set<number>>(new Set());

  useEffect(() => {
    const sync = () => {
      const marks = readStudy()[lesson] ?? {};
      const next = new Set<number>();
      for (const [id, entry] of Object.entries(marks)) {
        const m = /^k(\d+)$/.exec(id);
        if (m && entry?.s === "again") next.add(Number(m[1]));
      }
      setAgain(next);
    };
    sync();
    return onStudyChange(sync);
  }, [lesson]);

  return (
    <>
      {cells.map((c) => {
        const marked = again.has(c.n);
        return (
          <a
            key={c.n}
            href={`#k${c.n}`}
            aria-label={`Κινούμενο σχέδιο για το κουτάκι ${c.n}${marked ? " (για επανάληψη)" : ""}`}
            className={`absolute rounded-lg outline-none ring-[#c9822f] transition hover:bg-[#c9822f]/10 hover:ring-2 focus-visible:ring-2 ${
              marked ? "bg-[#c9822f]/10 ring-[3px] ring-[#c9822f]" : ""
            }`}
            style={{ left: pct(c.x, posterW), top: pct(c.y, posterH), width: pct(c.w, posterW), height: pct(c.h, posterH) }}
          >
            {marked ? (
              <span className="absolute right-[3%] top-[3%] rounded-full bg-[#c9822f] px-[0.5em] py-[0.15em] text-[clamp(7px,1.1vw,12px)] font-bold leading-tight text-white shadow-sm">
                ★ Επανάληψη
              </span>
            ) : null}
          </a>
        );
      })}
    </>
  );
}

/** Small line under the poster: how many cells are waiting for revision. */
export function PosterRevisionNote({ lesson }: { lesson: string }) {
  const [list, setList] = useState<number[]>([]);

  useEffect(() => {
    const sync = () => {
      const marks = readStudy()[lesson] ?? {};
      const ns = Object.entries(marks)
        .filter(([id, e]) => /^k\d+$/.test(id) && e?.s === "again")
        .map(([id]) => Number(id.slice(1)))
        .sort((a, b) => a - b);
      setList(ns);
    };
    sync();
    return onStudyChange(sync);
  }, [lesson]);

  if (list.length === 0) {
    return (
      <p className="px-1 pt-3 text-xs leading-5 text-[#857261]">
        Όποιο κουτάκι σημειώσεις «★ Να το ξαναδώ» στο κινούμενο σχέδιό του, θα φαίνεται εδώ με πορτοκαλί πλαίσιο.
      </p>
    );
  }
  return (
    <p className="flex flex-wrap items-center gap-1.5 px-1 pt-3 text-sm text-[#5f4630]">
      <span className="font-semibold">★ Για επανάληψη ({list.length}):</span>
      {list.map((n) => (
        <a key={n} href={`#k${n}`} className="rounded-full bg-[#c9822f] px-2.5 py-0.5 text-xs font-bold text-white hover:bg-[#a96b22]">
          {n}
        </a>
      ))}
    </p>
  );
}
