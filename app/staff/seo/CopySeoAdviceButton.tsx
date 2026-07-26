"use client";

import { useState } from "react";

type Props = {
  title: string;
  explanation: string;
  action: string;
  evidence: string;
  page?: string;
  query?: string;
};

export default function CopySeoAdviceButton({ title, explanation, action, evidence, page, query }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyAdvice() {
    const sections = [
      `SEO εύρημα: ${title}`,
      `Τι βρήκαμε: ${explanation}`,
      `Τι προτείνεις: ${action}`,
      `Γιατί το λες: ${evidence}`,
      query ? `Query: ${query}` : "",
      page ? `Σελίδα: ${page}` : "",
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
      aria-label="Αντιγραφή ευρήματος και πρότασης"
    >
      {copied ? "✓ Αντιγράφηκε" : "📋 Αντιγραφή για ChatGPT"}
    </button>
  );
}
