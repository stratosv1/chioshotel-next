"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { SCENARIOS } from "@/components/mixalis/ormi/OrmiPhaseQuiz";
import { setLessonTotal } from "@/components/mixalis/study/store";
import { CHALLENGES } from "./challenges-data";
import { THINKING_TRICKS } from "./thinking-tricks-data";
import "./ormi2.css";

/** Μονάδες μελέτης (✓ / ★) της Ορμής 2: σενάρια φάσεων, προκλήσεις, κόλπα. */
export const ORMI2_STUDY_TOTAL = SCENARIOS.length + CHALLENGES.length + THINKING_TRICKS.length;

/** Οι τέσσερις σελίδες της Ορμής 2, με τη σειρά που προτείνεται να δουλευτούν. */
export const ORMI2_PAGES = [
  { key: "phases", href: "/mixalis/ormi2", label: "1 · Φάσεις & νόμοι" },
  { key: "numeric", href: "/mixalis/ormi2/prokliseis", label: "2 · Αριθμητικές προκλήσεις" },
  { key: "tricks", href: "/mixalis/ormi2/kolpa", label: "3 · Τα 5 κόλπα" },
  { key: "progress", href: "/mixalis/ormi2/proodos", label: "Χάρτης προόδου" },
] as const;
export type Ormi2PageKey = (typeof ORMI2_PAGES)[number]["key"];

const FONTS =
  "https://fonts.googleapis.com/css2?family=Commissioner:wght@500;600;700;800&family=Literata:opsz,wght@7..72,400;7..72,600&family=Noto+Sans+Mono:wght@500;700&display=swap";

/** Σελίδα Ορμής 2: πάνω γραμμή, καρτέλες σελίδων και οτιδήποτε άλλο από κάτω. */
export function Ormi2Shell({ page, subtitle, counter, children }: {
  page: Ormi2PageKey;
  subtitle: string;
  counter?: ReactNode;
  children: ReactNode;
}) {
  // Για τη μπάρα προόδου της κάρτας «Ορμή 2» στα «Τα μαθήματα του Μιχάλη».
  useEffect(() => { try { setLessonTotal("ormi2", ORMI2_STUDY_TOTAL); } catch { /* storage optional */ } }, []);
  return (
    <main className="o2">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* React 19 μεταφέρει το stylesheet στο <head>. */}
      <link rel="stylesheet" href={FONTS} precedence="default" />
      <div className="o2-wrap">
        <div className="o2-topline">
          <Link href="/mixalis/ormi" className="o2-brand">Ορμή 2 <span>· {subtitle}<span className="o2-hide-sm"> · Φυσική Προσανατολισμού Β΄ Λυκείου</span></span></Link>
          {counter ? <span className="o2-counter">{counter}</span> : null}
        </div>
        <nav className="o2-tabs" aria-label="Σελίδες της Ορμής 2">
          <Link href="/mixalis" className="o2-tab back">← Τα μαθήματά μου</Link>
          {ORMI2_PAGES.map((p) => (
            <Link key={p.key} href={p.href} className="o2-tab" aria-current={p.key === page ? "page" : undefined}>{p.label}</Link>
          ))}
          <Link href="/mixalis/ormi" className="o2-tab back">Θεωρία ορμής →</Link>
        </nav>
        {children}
      </div>
    </main>
  );
}

/** Μπάρα ενοτήτων όπως στο μάθημα: κάθε στοιχείο έχει ετικέτα και γέμισμα 0..1. */
export function Ormi2Secs({ items, label }: {
  label: string;
  items: { key: string; label: string; fill: number; current?: boolean; onClick?: () => void; disabled?: boolean }[];
}) {
  return (
    <div className="o2-secs" role="group" aria-label={label}>
      {items.map((item) => (
        <button key={item.key} type="button" onClick={item.onClick} disabled={item.disabled || !item.onClick}
          aria-current={item.current ? "step" : undefined}>
          <span className="bar"><i style={{ width: Math.round(Math.max(0, Math.min(1, item.fill)) * 100) + "%" }} /></span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Προηγούμενο / επόμενο στο κάτω μέρος, με τα βελάκια του πληκτρολογίου. */
export function Ormi2Navbar({ prevLabel, nextLabel, onPrev, onNext, hint }: {
  prevLabel: string; nextLabel: string; onPrev: () => void; onNext: () => void; hint?: string;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const el = event.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el?.isContentEditable) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); onPrev(); }
      if (event.key === "ArrowRight") { event.preventDefault(); onNext(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext]);
  return (
    <div className="o2-navbar">
      <button type="button" className="o2-btn big" onClick={onPrev}>← {prevLabel}</button>
      {hint ? <span className="o2-hint">{hint}</span> : <span />}
      <button type="button" className="o2-btn big pri" onClick={onNext}>{nextLabel} →</button>
    </div>
  );
}
