"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Live SVG maths: render only in the browser (same as /mixalis/omali2).
const CaseViewer = dynamic(() => import("@/components/mixalis/omali2/CaseViewer").then((m) => m.CaseViewer), {
  ssr: false,
  loading: () => <p className="py-10 text-center text-sm font-semibold text-[#857261]">Φόρτωση κινούμενου σχεδίου…</p>,
});

const POSTER_W = 1212;
const POSTER_H = 1720;
const LAST = 36;

/** Same grid as the poster SVG (and /mixalis/omali2). */
const cells = Array.from({ length: 30 }, (_, i) => {
  const section = Math.floor(i / 5);
  const col = i % 5;
  return { n: i + 1, x: 17 + 238 * col, y: 146 + 256 * section, w: 226, h: 212 };
});

const extras: { n: number; label: string }[] = [
  { n: 31, label: "Δείκτες ρολογιού 90°" },
  { n: 32, label: "Συνάντηση ομόρροπα" },
  { n: 33, label: "Συνάντηση αντίρροπα" },
  { n: 34, label: "Κυκλική και ευθύγραμμη" },
  { n: 35, label: "Κλίση και τριβή" },
  { n: 36, label: "Χάντρα σε δαχτυλίδι" },
];

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

/**
 * The 30-cell poster of the lesson page. Tapping a cell opens that case's
 * step-by-step animation right under the poster, without leaving the lesson.
 */
export function OmaliTypologio() {
  const [open, setOpen] = useState<number | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const scrollOnOpen = useRef(false);

  // #k12 in the address opens case 12.
  useEffect(() => {
    const m = /^#k(\d+)$/.exec(window.location.hash);
    const n = m ? Number(m[1]) : 0;
    if (n >= 1 && n <= LAST) {
      scrollOnOpen.current = true;
      setOpen(n);
    }
  }, []);

  useEffect(() => {
    if (open && scrollOnOpen.current) {
      scrollOnOpen.current = false;
      requestAnimationFrame(() => viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, [open]);

  const show = (n: number) => {
    scrollOnOpen.current = true;
    setOpen(n);
    history.replaceState(null, "", `#k${n}`);
  };

  const close = () => {
    setOpen(null);
    history.replaceState(null, "", "#typologio");
    document.getElementById("typologio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#fbf8f2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mixalis/omali-typologio.svg"
          alt="Τυπολόγιο κυκλικής κίνησης: 30 περιπτώσεις με διαγράμματα δυνάμεων και τύπους"
          width={POSTER_W}
          height={POSTER_H}
          loading="lazy"
          decoding="async"
          className="mx-auto h-auto w-full"
        />
        {cells.map((c) => (
          <button
            key={c.n}
            type="button"
            onClick={() => show(c.n)}
            aria-label={`Άνοιξε αναλυτικά την περίπτωση ${c.n}`}
            className={`absolute rounded-lg outline-none ring-[#c9822f] transition hover:bg-[#c9822f]/10 hover:ring-2 focus-visible:ring-2 ${
              open === c.n ? "bg-[#c9822f]/10 ring-[3px]" : ""
            }`}
            style={{ left: pct(c.x, POSTER_W), top: pct(c.y, POSTER_H), width: pct(c.w, POSTER_W), height: pct(c.h, POSTER_H) }}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-black/10 bg-[#fbf8f2] p-3 sm:p-4">
        <p className="text-sm font-semibold text-[#2c2825]">Επιπλέον περιπτώσεις (δεν είναι στο σχέδιο)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {extras.map((e) => (
            <button
              key={e.n}
              type="button"
              onClick={() => show(e.n)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                open === e.n ? "border-[#c9822f] bg-[#c9822f] text-white" : "border-black/10 bg-white text-[#4d4138] hover:bg-[#f3efe8]"
              }`}
            >
              {e.n}. {e.label}
            </button>
          ))}
        </div>
      </div>

      {open ? (
        <div ref={viewerRef} className="scroll-mt-20 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            <button
              type="button"
              onClick={() => show(open > 1 ? open - 1 : LAST)}
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 hover:bg-[#f3efe8]"
            >
              ← {open > 1 ? open - 1 : LAST}
            </button>
            <span className="px-1 text-[#857261]">Περίπτωση {open} από {LAST}</span>
            <button
              type="button"
              onClick={() => show(open < LAST ? open + 1 : 1)}
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 hover:bg-[#f3efe8]"
            >
              {open < LAST ? open + 1 : 1} →
            </button>
            <button type="button" onClick={close} className="ml-auto rounded-full bg-[#2c2825] px-3 py-1.5 text-white hover:bg-black">
              ↑ Πίσω στο τυπολόγιο
            </button>
          </div>
          <CaseViewer n={open} />
        </div>
      ) : (
        <p className="px-1 text-sm leading-6 text-[#5c534c]">
          <b>Πάτα ένα κουτάκι</b> και ανοίγει εδώ από κάτω η περίπτωση αναλυτικά: τι βλέπεις, δεδομένα, κινούμενο σχέδιο βήμα βήμα, λύση και παγίδα.
        </p>
      )}
    </div>
  );
}
