"use client";

import { useState, type ReactNode } from "react";

/** Λύση που ανοίγει ένα βήμα τη φορά, με την απάντηση στο τέλος. */
export function Reveal({ steps, answer }: { steps: ReactNode[]; answer: ReactNode }) {
  const [shown, setShown] = useState(0);
  const total = steps.length;
  const allShown = shown >= total;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        {!allShown ? (
          <button
            type="button"
            onClick={() => setShown((s) => s + 1)}
            className="rounded-full bg-[#2c2825] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a403a]"
          >
            {shown === 0 ? "Λύσ' το πρώτα στο τετράδιο · Δείξε το 1ο βήμα" : `Επόμενο βήμα (${shown + 1}/${total})`}
          </button>
        ) : null}
        {!allShown ? (
          <button type="button" onClick={() => setShown(total)} className="px-2 text-sm font-semibold text-[#857261] underline underline-offset-2">
            Όλη η λύση
          </button>
        ) : (
          <button type="button" onClick={() => setShown(0)} className="px-2 text-sm font-semibold text-[#857261] underline underline-offset-2">
            Κρύψε τη λύση
          </button>
        )}
      </div>

      {shown > 0 ? (
        <ol className="mt-4 space-y-2">
          {steps.slice(0, shown).map((s, i) => (
            <li key={i} className="flex gap-3 border-l-2 border-[#c9822f] pl-3 text-[17px] leading-8 text-[#2c2825]">
              <span className="font-bold text-[#c9822f]">{i + 1}.</span>
              <span className="min-w-0">{s}</span>
            </li>
          ))}
        </ol>
      ) : null}

      {allShown ? (
        <p className="mt-4 inline-block rounded-full bg-[#0e6e66] px-4 py-2 text-[16px] font-semibold text-white">{answer}</p>
      ) : null}
    </div>
  );
}
