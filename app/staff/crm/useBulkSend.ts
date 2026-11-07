"use client";

import { useRef, useState } from "react";

export type BulkBatchResult = { sent: number; failed: number; remaining: number; limitReached: boolean };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Calls the server batch after batch until everyone has the email, the daily limit is hit, or staff stops it. */
export function useBulkSend() {
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState("");
  const stopRef = useRef(false);

  const run = async (batch: () => Promise<BulkBatchResult>): Promise<string> => {
    stopRef.current = false;
    setSending(true);
    let sent = 0;
    let failed = 0;
    try {
      while (!stopRef.current) {
        const result = await batch();
        sent += result.sent;
        failed += result.failed;
        setProgress(`Στάλθηκαν ${sent}${failed ? `, απέτυχαν ${failed}` : ""} · απομένουν ${result.remaining}`);
        if (result.limitReached) return `Φτάσαμε το ημερήσιο όριο του Gmail: ${sent} στάλθηκαν σήμερα. Πάτα ξανά αποστολή αύριο για τους υπόλοιπους ${result.remaining}.`;
        if (result.remaining <= 0) return `Ολοκληρώθηκε: ${sent} στάλθηκαν${failed ? `, ${failed} απέτυχαν` : ""}.`;
        await wait(1_000);
      }
      return `Σταμάτησε: ${sent} στάλθηκαν. Συνεχίζει από εκεί που έμεινε, χωρίς διπλά.`;
    } finally {
      setSending(false);
      setProgress("");
    }
  };

  return { sending, progress, run, stop: () => { stopRef.current = true; } };
}
