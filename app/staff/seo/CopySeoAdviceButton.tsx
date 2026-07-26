"use client";

import { useState } from "react";

type QueryChange = {
  query: string;
  currentClicks: number;
  previousClicks: number;
  currentImpressions: number;
  previousImpressions: number;
  currentCtr: number;
  previousCtr: number;
  currentPosition: number;
  previousPosition: number;
  clickChange: number;
  impressionChange: number;
  positionDelta: number;
};

type Props = {
  title: string;
  explanation: string;
  diagnosis?: string;
  action: string;
  evidence: string;
  page?: string;
  query?: string;
  queryBreakdown?: QueryChange[];
};

function formatNumber(value: number, digits = 1) {
  return new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(value);
}

function formatPct(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, 1)}%`;
}

function formatQueryBreakdown(rows: QueryChange[]) {
  if (!rows.length) return "";

  const lines = rows.slice(0, 8).map((row, index) => {
    const currentPosition = row.currentPosition > 0 ? formatNumber(row.currentPosition, 1) : "—";
    const previousPosition = row.previousPosition > 0 ? formatNumber(row.previousPosition, 1) : "—";
    return `${index + 1}. ${row.query}\n   Clicks: ${formatNumber(row.previousClicks, 0)} → ${formatNumber(row.currentClicks, 0)} (${formatPct(row.clickChange)})\n   Impressions: ${formatNumber(row.previousImpressions, 0)} → ${formatNumber(row.currentImpressions, 0)} (${formatPct(row.impressionChange)})\n   Θέση: ${previousPosition} → ${currentPosition}\n   CTR: ${formatNumber(row.previousCtr * 100, 2)}% → ${formatNumber(row.currentCtr * 100, 2)}%`;
  });

  return `Queries που άλλαξαν περισσότερο:\n${lines.join("\n\n")}`;
}

export default function CopySeoAdviceButton({
  title,
  explanation,
  diagnosis,
  action,
  evidence,
  page,
  query,
  queryBreakdown = [],
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyAdvice() {
    const sections = [
      `SEO εύρημα: ${title}`,
      `Τι βρήκαμε: ${explanation}`,
      diagnosis ? `Διάγνωση από τα δεδομένα: ${diagnosis}` : "",
      `Τι προτείνεις: ${action}`,
      `Γιατί το λες: ${evidence}`,
      query ? `Query: ${query}` : "",
      page ? `Σελίδα: ${page}` : "",
      formatQueryBreakdown(queryBreakdown),
      "Θέλω να αξιολογήσεις τα παραπάνω πριν κάνουμε αλλαγή. Πες μου αν συμφωνείς με τη διάγνωση, ποια είναι η πιθανότερη αιτία και ποια ακριβώς αλλαγή αξίζει να κάνουμε πρώτη.",
    ].filter(Boolean);

    const text = sections.join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <button
      type="button"
      onClick={copyAdvice}
      className="inline-flex items-center justify-center rounded-full border border-[#cdbda7] bg-white px-3.5 py-2 text-sm font-semibold text-[#44372d] shadow-sm transition hover:bg-[#f4ede3] active:scale-[0.98]"
      aria-label="Αντιγραφή ευρήματος, διάγνωσης, queries και πρότασης"
    >
      {copied ? "✓ Αντιγράφηκε" : "📋 Αντιγραφή για ChatGPT"}
    </button>
  );
}
