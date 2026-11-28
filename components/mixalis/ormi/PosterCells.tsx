"use client";

import { useEffect, useState } from "react";
import { onStudyChange, readStudy, type StudyState } from "@/components/mixalis/study/store";

type Cell = { n: number; href?: string; x: number; y: number; w: number; h: number };

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

const DONE = "#2e8b57";
const AGAIN = "#c9822f";

/**
 * Which study mark belongs to a poster cell. Most cells open their own animation
 * (lesson "ormi", id "k<n>"); the linked ones open a card on another page, so we
 * read the mark of that card instead.
 */
function markKey(cell: Cell, lesson: string): [string, string] {
  const href = cell.href ?? "";
  let m = /^\/mixalis\/ormi2#(s\d+)$/.exec(href);
  if (m) return ["ormi", m[1]];
  m = /^\/mixalis\/ormi\/askiseis#(a[\d-]+)$/.exec(href);
  if (m) return ["ormi", m[1]];
  m = /^\/mixalis\/ormi\/periptoseis#(p\w+)$/.exec(href);
  if (m) return ["ormi", m[1]];
  m = /^\/mixalis\/pedio#(k\d+)$/.exec(href);
  if (m) return ["pedio", m[1]];
  return [lesson, `k${cell.n}`];
}

/** Marks of every cell, by cell number. */
function useCellMarks(cells: Cell[], lesson: string) {
  const [marks, setMarks] = useState<Map<number, StudyState>>(new Map());

  useEffect(() => {
    const sync = () => {
      const data = readStudy();
      const next = new Map<number, StudyState>();
      for (const c of cells) {
        const [l, id] = markKey(c, lesson);
        const s = data[l]?.[id]?.s;
        if (s) next.set(c.n, s);
      }
      setMarks(next);
    };
    sync();
    return onStudyChange(sync);
  }, [cells, lesson]);

  return marks;
}

/**
 * Clickable areas over the poster cells. A cell marked «✓ Τελείωσα» gets a green
 * frame and a ✓ badge; «★ Να το ξαναδώ» an orange frame and a «★ Επανάληψη» badge.
 */
export function PosterCells({ cells, posterW, posterH, lesson }: { cells: Cell[]; posterW: number; posterH: number; lesson: string }) {
  const marks = useCellMarks(cells, lesson);

  return (
    <>
      {cells.map((c) => {
        const s = marks.get(c.n);
        const color = s === "done" ? DONE : s === "again" ? AGAIN : null;
        const label = s === "done" ? " (τελειωμένο)" : s === "again" ? " (για επανάληψη)" : "";
        return (
          <a
            key={c.n}
            id={`t${c.n}`}
            href={c.href ?? `#k${c.n}`}
            aria-label={`Κινούμενο σχέδιο για το κουτάκι ${c.n}${label}`}
            className="absolute rounded-lg outline-none transition hover:bg-[#c9822f]/10 hover:ring-2 hover:ring-[#c9822f] focus-visible:ring-2 focus-visible:ring-[#c9822f]"
            style={{
              left: pct(c.x, posterW),
              top: pct(c.y, posterH),
              width: pct(c.w, posterW),
              height: pct(c.h, posterH),
              ...(color ? { boxShadow: `inset 0 0 0 3px ${color}`, backgroundColor: s === "done" ? "rgba(46, 139, 87, 0.07)" : "rgba(201, 130, 47, 0.1)" } : {}),
            }}
          >
            {s === "done" ? (
              <span
                className="absolute flex items-center justify-center rounded-full font-bold leading-none text-white shadow-sm"
                style={{ right: "3%", top: "3%", backgroundColor: DONE, width: "1.9em", height: "1.9em", fontSize: "clamp(8px, 1.3vw, 14px)" }}
                aria-hidden
              >
                ✓
              </span>
            ) : s === "again" ? (
              <span
                className="absolute rounded-full font-bold leading-tight text-white shadow-sm"
                style={{ right: "3%", top: "3%", backgroundColor: AGAIN, padding: "0.15em 0.5em", fontSize: "clamp(7px, 1.1vw, 12px)" }}
                aria-hidden
              >
                ★ Επανάληψη
              </span>
            ) : null}
          </a>
        );
      })}
    </>
  );
}

/** Line under the poster: how many cells are done and which are waiting for revision. */
export function PosterRevisionNote({ lesson, cells }: { lesson: string; cells: Cell[] }) {
  const marks = useCellMarks(cells, lesson);
  const done = cells.filter((c) => marks.get(c.n) === "done").length;
  const again = cells.filter((c) => marks.get(c.n) === "again");

  if (done === 0 && again.length === 0) {
    return (
      <p className="px-1 pt-3 text-xs leading-5 text-[#857261]">
        Πάτα «✓ Τελείωσα» ή «★ Να το ξαναδώ» κάτω από κάθε κινούμενο σχέδιο: το κουτάκι εδώ θα πάρει πράσινο ✓ ή πορτοκαλί πλαίσιο.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1 pt-3 text-sm">
      <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: DONE }}>
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-white" style={{ backgroundColor: DONE }}>
          ✓
        </span>
        Τελειωμένα: {done} από {cells.length}
      </span>
      {again.length ? (
        <span className="flex flex-wrap items-center gap-1.5 text-[#5f4630]">
          <span className="font-semibold">★ Για επανάληψη ({again.length}):</span>
          {again.map((c) => (
            <a
              key={c.n}
              href={c.href ?? `#k${c.n}`}
              className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white hover:opacity-90"
              style={{ backgroundColor: AGAIN }}
            >
              {c.n}
            </a>
          ))}
        </span>
      ) : null}
    </div>
  );
}
