"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { onStudyChange, readStudy, type StudyState } from "@/components/mixalis/study/store";

export type Panel = { id: string; label: string; node: ReactNode };
export type CaseSlide = { id: string; code: string; title: string; group: string; groupTitle: string; groupIntro: ReactNode; node: ReactNode };

const CASES_TAB = "periptoseis";

/**
 * Η σελίδα σε καρτέλες, και οι περιπτώσεις μία-μία σαν κάρτες με Προηγούμενη / Επόμενη.
 * Όλα αποδίδονται στον server· εδώ απλώς δείχνουμε ένα κομμάτι τη φορά.
 * Το #hash της διεύθυνσης κρατά πού είσαι (π.χ. #a4, #typologio), ώστε οι σύνδεσμοι να δουλεύουν.
 */
export function Shell({ lesson, panels, cases }: { lesson: string; panels: Panel[]; cases: CaseSlide[] }) {
  const [tab, setTab] = useState<string>(CASES_TAB);
  const [idx, setIdx] = useState(0);
  const [marks, setMarks] = useState<Record<string, StudyState>>({});
  const topRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  // Από το #hash στην κατάσταση.
  const applyHash = useCallback(() => {
    const h = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!h) return;
    const ci = cases.findIndex((c) => c.id === h);
    if (ci >= 0) {
      setTab(CASES_TAB);
      setIdx(ci);
      return;
    }
    const gi = cases.findIndex((c) => c.group === h);
    if (gi >= 0) {
      setTab(CASES_TAB);
      setIdx(gi);
      return;
    }
    if (panels.some((p) => p.id === h) || h === CASES_TAB) {
      setTab(h);
      return;
    }
    // Άγκυρα μέσα σε καρτέλα (π.χ. #provoli): άνοιξε την καρτέλα που την περιέχει.
    const el = document.getElementById(h);
    const host = el?.closest<HTMLElement>("[data-panel]");
    if (host?.dataset.panel) {
      setTab(host.dataset.panel);
      requestAnimationFrame(() => el?.scrollIntoView({ block: "start" }));
    }
  }, [cases, panels]);

  useEffect(() => {
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [applyHash]);

  // Σημάδια μελέτης για τα κουμπάκια Α1…Γ8.
  useEffect(() => {
    const sync = () => {
      const all = readStudy()[lesson] ?? {};
      const out: Record<string, StudyState> = {};
      for (const [k, v] of Object.entries(all)) out[k] = v.s;
      setMarks(out);
    };
    sync();
    return onStudyChange(sync);
  }, [lesson]);

  const setHash = (h: string) => {
    window.history.replaceState(null, "", `#${h}`);
  };

  const goTab = (id: string) => {
    setTab(id);
    setHash(id === CASES_TAB ? cases[idx].id : id);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goCase = useCallback(
    (i: number) => {
      const n = Math.max(0, Math.min(cases.length - 1, i));
      setIdx(n);
      setTab(CASES_TAB);
      window.history.replaceState(null, "", `#${cases[n].id}`);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [cases],
  );

  // Βελάκια πληκτρολογίου.
  useEffect(() => {
    if (tab !== CASES_TAB) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight") goCase(idx + 1);
      if (e.key === "ArrowLeft") goCase(idx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tab, idx, goCase]);

  const cur = cases[idx];
  const prev = idx > 0 ? cases[idx - 1] : null;
  const next = idx < cases.length - 1 ? cases[idx + 1] : null;
  const groups = Array.from(new Set(cases.map((c) => c.group)));
  const tabs: { id: string; label: string }[] = [
    ...panels.slice(0, 4).map((p) => ({ id: p.id, label: p.label })),
    { id: CASES_TAB, label: `Περιπτώσεις (${cases.length})` },
    ...panels.slice(4).map((p) => ({ id: p.id, label: p.label })),
  ];

  const chipClass = (c: CaseSlide, i: number) => {
    const m = marks[c.id];
    if (i === idx) return "bg-[#2c2825] text-white";
    if (m === "done") return "bg-[#2e8b57] text-white";
    if (m === "again") return "bg-[#c9822f] text-white";
    return "bg-white text-[#4d4138] ring-1 ring-black/10 hover:bg-[#ece4da]";
  };

  return (
    <div ref={topRef} className="scroll-mt-0">
      <nav className="sticky top-0 z-20 border-y border-black/10 bg-[#f3efe8]/95 backdrop-blur" aria-label="Ενότητες">
        <div className="mx-auto flex w-full max-w-[1400px] gap-1 overflow-x-auto px-3 py-2 sm:px-8" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => goTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.id ? "bg-[#2c2825] text-white" : "text-[#4d4138] hover:bg-black/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8">
        {panels.map((p) => (
          <div key={p.id} data-panel={p.id} hidden={tab !== p.id}>
            {p.node}
          </div>
        ))}

        <div data-panel={CASES_TAB} hidden={tab !== CASES_TAB} className="pb-16 pt-8">
          {/* Κουμπάκια Α1…Γ8, ανά ομάδα */}
          <div className="space-y-3">
            {groups.map((g) => (
              <div key={g} className="flex flex-wrap items-center gap-1.5">
                <span className="mr-2 w-6 text-lg font-bold text-[#c9822f]">{g}</span>
                {cases.map((c, i) =>
                  c.group === g ? (
                    <button
                      key={c.id}
                      type="button"
                      title={c.title}
                      aria-current={i === idx ? "step" : undefined}
                      onClick={() => goCase(i)}
                      className={`h-9 min-w-11 rounded-full px-2.5 text-sm font-bold transition ${chipClass(c, i)}`}
                    >
                      {c.code}
                    </button>
                  ) : null,
                )}
              </div>
            ))}
            <p className="text-xs text-[#857261]">
              Πράσινο: τελείωσα · Πορτοκαλί: να το ξαναδώ · Στον υπολογιστή αλλάζεις με τα βελάκια ← →, στο κινητό με σύρσιμο.
            </p>
          </div>

          {/* Η τρέχουσα περίπτωση */}
          <div
            className="mt-8 border-t border-black/10 pt-6"
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 70) goCase(idx + (dx < 0 ? 1 : -1));
            }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#857261]">
                Ομάδα {cur.group} · {cur.groupTitle}
              </p>
              <p className="text-sm font-semibold text-[#857261]">
                {idx + 1} / {cases.length}
              </p>
            </div>
            {idx === 0 || cases[idx - 1].group !== cur.group ? (
              <div className="mt-2 max-w-3xl text-[16px] leading-7 text-[#5c534c]">{cur.groupIntro}</div>
            ) : null}

            <div className="mt-6">
              {cases.map((c, i) => (
                <div key={c.id} hidden={i !== idx}>
                  {c.node}
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-black/10 pt-6">
              <div>
                {prev ? (
                  <button
                    type="button"
                    onClick={() => goCase(idx - 1)}
                    className="flex w-full flex-col items-start rounded-2xl px-4 py-3 text-left ring-1 ring-black/10 hover:bg-white"
                  >
                    <span className="text-sm font-semibold text-[#857261]">‹ Προηγούμενη · {prev.code}</span>
                    <span className="mt-0.5 text-[16px] font-semibold text-[#2c2825]">{prev.title}</span>
                  </button>
                ) : null}
              </div>
              <div>
                {next ? (
                  <button
                    type="button"
                    onClick={() => goCase(idx + 1)}
                    className="flex w-full flex-col items-end rounded-2xl bg-[#2c2825] px-4 py-3 text-right text-white hover:bg-[#4a403a]"
                  >
                    <span className="text-sm font-semibold text-white/70">Επόμενη · {next.code} ›</span>
                    <span className="mt-0.5 text-[16px] font-semibold">{next.title}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => goTab("trapeza")}
                    className="flex w-full flex-col items-end rounded-2xl bg-[#0e6e66] px-4 py-3 text-right text-white"
                  >
                    <span className="text-sm font-semibold text-white/70">Τέλος περιπτώσεων ›</span>
                    <span className="mt-0.5 text-[16px] font-semibold">Τράπεζα Θεμάτων και πλάνο μελέτης</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
