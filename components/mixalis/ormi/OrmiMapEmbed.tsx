"use client";

import { useEffect, useRef, useState } from "react";

const MOTION_URL = "/mixalis/ormi/xartis/motion/";
const PDF_URL = "/mixalis/ormi/xartis/pdf/";

export function OrmiMapEmbed() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.type !== "ormi-map-height"
      ) return;
      const next = event.data.height;
      if (typeof next === "number" && Number.isFinite(next) && next >= 200 && next <= 8000) {
        setHeight(Math.ceil(next));
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section
      id="xartis-meletis"
      aria-labelledby="ormi-map-title"
      className="scroll-mt-20 rounded-3xl border border-[#1f6f5c]/20 bg-white p-4 shadow-sm sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f6f5c]">
        Ο χάρτης του Μιχάλη
      </p>
      <h2 id="ormi-map-title" className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
        Χάρτης ασκήσεων με κίνηση
      </h2>
      <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
        10 οικογένειες, 47 παραλλαγές και ένα μικρό λυμένο παράδειγμα σε καθεμία.
        Δες τι συμβαίνει πριν, στην κρούση και μετά.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="ormi-map-motion"
          onClick={() => setOpen(!open)}
          className="inline-flex min-h-11 items-center rounded-full bg-[#1f6f5c] px-4 py-2 text-white hover:bg-[#185747] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f6f5c]"
        >
          {open ? "Κλείσε τον χάρτη" : "Άνοιξε τον χάρτη εδώ"}
        </button>
        <a
          href={PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-full border border-black/15 px-4 py-2 hover:bg-[#f3efe8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f6f5c]"
        >
          Εκτύπωση PDF · Α4
        </a>
        <a
          href={MOTION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-full px-4 py-2 text-[#1f6f5c] hover:bg-[#f3efe8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f6f5c]"
        >
          Σε πλήρη οθόνη ↗
        </a>
      </div>
      <div id="ormi-map-motion" hidden={!open}>
        {open && (
          <iframe
            ref={frameRef}
            src={MOTION_URL}
            title="Ο χάρτης της ορμής: διαδραστικές οικογένειες ασκήσεων"
            onLoad={() => frameRef.current?.contentWindow?.postMessage("ormi-map-ping", window.location.origin)}
            className="mt-4 block w-full rounded-2xl border border-black/10 bg-[#eef3f2]"
            style={{ height }}
          />
        )}
      </div>
    </section>
  );
}
