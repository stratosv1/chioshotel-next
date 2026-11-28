"use client";

import { useEffect, useState } from "react";

/**
 * Floating «Πίσω στο τυπολόγιο» button. While an animation card (id k<n>) is on
 * screen, it shows that card's number; a click scrolls back to the same cell of
 * the poster (id t<n>) and makes it blink, so the reader finds it at once.
 * On wide screens it sits in the empty space to the right of the page; on phones
 * it is a small round button at the bottom right.
 */
export function BackToPoster({ cardPrefix = "k" }: { cardPrefix?: string }) {
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    const re = new RegExp(`^${cardPrefix}(\\d+)$`);
    let raf = 0;
    const update = () => {
      raf = 0;
      // Cards appear lazily, so look them up on every check.
      const mid = window.innerHeight / 2;
      let found: number | null = null;
      for (const el of document.querySelectorAll<HTMLElement>(`[id^="${cardPrefix}"]`)) {
        const m = re.exec(el.id);
        if (!m || el.tagName === "A") continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid * 0.6) {
          found = Number(m[1]);
          break;
        }
      }
      setN(found);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cardPrefix]);

  if (n === null) return null;

  const go = () => {
    const cell = document.getElementById(`t${n}`);
    if (!cell) return;
    cell.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    cell.classList.remove("poster-cell-flash");
    void cell.offsetWidth;
    cell.classList.add("poster-cell-flash");
    history.replaceState(null, "", `#t${n}`);
  };

  return (
    <>
      <style>{`
        @keyframes posterCellFlash { 0%,100% { box-shadow: inset 0 0 0 0 rgba(201,130,47,0); background: transparent; } 20%,60% { box-shadow: inset 0 0 0 4px #c9822f; background: rgba(201,130,47,.18); } }
        .poster-cell-flash { animation: posterCellFlash 1.8s ease-in-out 0.35s 2; }
        .back-to-poster { position: fixed; z-index: 40; }
        @media (min-width: 1440px) { .back-to-poster { width: 118px; top: 50%; transform: translateY(-50%); left: calc(50% + 37.5rem); } }
        @media (max-width: 1439px) { .back-to-poster { right: 12px; bottom: 16px; padding: 6px 10px 6px 6px !important; flex-direction: row !important; border-radius: 999px !important; } .back-to-poster .btp-text { display: none; } .back-to-poster .btp-ic { width: 28px !important; height: 28px !important; font-size: 15px !important; } }
      `}</style>
      <button
        type="button"
        onClick={go}
        className="back-to-poster flex flex-col items-center gap-1 rounded-2xl border border-black/10 bg-white px-3 py-3 text-center font-semibold text-[#2c2825] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        aria-label={`Επιστροφή στο κουτάκι ${n} του τυπολογίου`}
      >
        <span className="btp-ic flex h-9 w-9 items-center justify-center rounded-full text-lg text-white" style={{ backgroundColor: "#c9822f" }} aria-hidden>
          ↑
        </span>
        <span className="btp-text text-xs leading-4">Πίσω στο τυπολόγιο</span>
        <span className="rounded-full px-2 py-0.5 text-[11px] text-white" style={{ backgroundColor: "#2c2825" }}>
          <span className="btp-text">κουτάκι </span>{n}
        </span>
      </button>
    </>
  );
}
