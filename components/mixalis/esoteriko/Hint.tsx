"use client";

import { useState, type ReactNode } from "react";

/**
 * Βοήθεια κρυμμένη πίσω από κουμπί, ώστε ο μαθητής να ξεκινά τη λυμένη άσκηση
 * χωρίς να βλέπει από την αρχή την ιδέα ή τη μέθοδο.
 */
export function Hint({ label, hideLabel, accent, children }: { label: string; hideLabel: string; accent: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="rounded-full border-2 px-4 py-1.5 text-sm font-semibold hover:bg-black/5"
        style={{ borderColor: accent, color: accent }}
      >
        {open ? hideLabel : label}
      </button>
      {open ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
