"use client";

import { useState, type ReactNode } from "react";
import { rich } from "./AnimCard";
import type { MoreQuestion } from "./kit";

const INK = "#5b3f8f";

/**
 * «Τι άλλο μπορεί να ρωτήσει ο καθηγητής»: questions on the same phenomenon, each with a
 * small figure. The explanation and the answer stay hidden until asked for.
 */
export function MoreQuestions({ n, title, items, asCard = false }: { n: number; title: string; items: MoreQuestion[]; asCard?: boolean }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <aside
      className={asCard ? "self-start overflow-hidden rounded-3xl border bg-white shadow-sm" : "border-t border-black/5"}
      style={{ borderColor: "rgba(91, 63, 143, 0.25)" }}
      aria-label={`Ερωτήσεις καθηγητή για το κουτάκι ${n}`}
    >
      <div className="px-4 py-3 sm:px-5" style={{ backgroundColor: "#f4f1fa" }}>
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: INK }}>
          Κουτάκι {n} · {title}
        </p>
        <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-[#1c2433]">Τι άλλο μπορεί να ρωτήσει ο καθηγητής</h3>
        <p className="mt-0.5 text-sm text-[#5b6577]">Ίδιο φαινόμενο, άλλο ερώτημα. Σκέψου πρώτα, μετά άνοιξε την απάντηση.</p>
      </div>
      <ol className="space-y-3 px-3 py-3 sm:px-4">
        {items.map((item, i) => {
          const isOpen = open.has(i);
          return (
            <li key={i} className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: "rgba(91, 63, 143, 0.18)" }}>
              <div className="flex gap-3 p-3">
                {item.fig ? (
                  <div className="w-[38%] max-w-[170px] flex-none rounded-xl border border-black/5" style={{ backgroundColor: "#fbfaf7" }}>
                    {item.fig}
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold leading-6 text-[#1c2433]">
                    <span style={{ color: INK }}>{i + 1}. </span>
                    {rich(item.q)}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="mt-2 rounded-full border px-3 py-1 text-xs font-semibold"
                    style={{ borderColor: "rgba(91, 63, 143, 0.4)", color: INK, backgroundColor: isOpen ? "#f4f1fa" : "#ffffff" }}
                  >
                    {isOpen ? "Κρύψε" : "Δείξε την απάντηση"}
                  </button>
                </div>
              </div>
              {isOpen ? (
                <div className="space-y-2 border-t px-3 py-3 text-sm leading-6" style={{ borderColor: "rgba(91, 63, 143, 0.15)", backgroundColor: "#fcfbfe" }}>
                  {item.steps?.length ? (
                    <ol className="space-y-1.5">
                      {item.steps.map((st, k) => (
                        <li key={k} className="flex gap-2">
                          <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: INK }}>
                            {k + 1}
                          </span>
                          <span className="text-[#3d4452]">{rich(st)}</span>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                  <p className="rounded-xl border bg-white px-3 py-2 font-semibold text-[#1c2433]" style={{ borderColor: "rgba(31, 157, 85, 0.35)" }}>
                    <span style={{ color: "#1f9d55" }}>Απάντηση: </span>
                    {rich(item.a)}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

/** Small square figure frame for the questions (viewBox 160×120). */
export function QFig({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 160 120" className="block h-auto w-full" role="img" aria-hidden>
      {children}
    </svg>
  );
}
