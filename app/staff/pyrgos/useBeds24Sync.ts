"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const EVERY = 120_000;
const MAX_MINUTES = 7 * 24 * 60;

/**
 * Safety net for bookings typed straight into Beds24 (shared by Σήμερα and Πλάνο).
 * - Runs once on open (last 24 h), then every 2 minutes while the page is visible.
 * - Each run asks for everything changed since the last successful run (+5 min margin), so a tab
 *   that was hidden for hours does not miss changes (it used to look back only 30 minutes).
 * - Coming back to the tab syncs right away if the last run is older than a minute.
 * - Changing the day/week does NOT restart it (it used to fire a 24 h Beds24 query on every click).
 */
export function useBeds24Sync(onChanged: () => void) {
  const changedRef = useRef(onChanged);
  changedRef.current = onChanged;
  const lastOk = useRef<number | null>(null);
  const running = useRef(false);
  const [info, setInfo] = useState("");

  const run = useCallback(async (manual = false) => {
    if (running.current) return;
    if (!manual && document.visibilityState !== "visible") return;
    running.current = true;
    if (manual) setInfo("Συγχρονισμός…");
    const minutes = manual || lastOk.current === null
      ? 24 * 60
      : Math.min(MAX_MINUTES, Math.max(5, Math.ceil((Date.now() - lastOk.current) / 60_000) + 5));
    const startedAt = Date.now();
    try {
      const json = await fetch(`/api/staff/pyrgos/sync/?minutes=${minutes}`, { method: "POST", cache: "no-store" })
        .then((r) => r.json())
        .catch(() => null);
      const time = new Intl.DateTimeFormat("el-GR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" }).format(new Date());
      if (json?.ok) {
        lastOk.current = startedAt;
        setInfo(`Beds24 ✓ ${time}${json.changed ? ` · ${json.changed} αλλαγές` : ""}`);
        if (json.changed) changedRef.current();
      } else setInfo(json?.rateLimited ? "Beds24: παύση, ξαναδοκιμάζει σε λίγο" : "⚠️ Ο συγχρονισμός απέτυχε");
    } finally {
      running.current = false;
    }
  }, []);

  useEffect(() => {
    run();
    const timer = setInterval(() => run(), EVERY);
    const onVisible = () => {
      if (document.visibilityState === "visible" && (lastOk.current === null || Date.now() - lastOk.current > 60_000)) run();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [run]);

  return { info, syncNow: () => run(true) };
}
