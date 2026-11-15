"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Embeds the first-time-learner presentation (public/mixalis/pedio-intro.html) and grows the iframe to its content height.
 * Other parts of the page can open a slide with: window.dispatchEvent(new CustomEvent("pedio-intro-go", { detail: "<scene id>" })).
 */
export function PedioIntroEmbed() {
  const ref = useRef<HTMLIFrameElement>(null);
  const loaded = useRef(false);
  const pending = useRef<string | null>(null);
  const [height, setHeight] = useState(760);

  const send = (id: string) => ref.current?.contentWindow?.postMessage({ type: "pedio-intro-go", id }, "*");

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return;
      const h = e.data?.type === "pedio-intro-height" ? Number(e.data.height) : 0;
      if (h > 200 && h < 4000) setHeight(h);
    };
    const onGo = (e: Event) => {
      const id = String((e as CustomEvent).detail ?? "");
      if (!id) return;
      if (loaded.current) send(id);
      else pending.current = id;
    };
    window.addEventListener("message", onMessage);
    window.addEventListener("pedio-intro-go", onGo);
    ref.current?.contentWindow?.postMessage("pedio-intro-ping", "*");
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("pedio-intro-go", onGo);
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src="/mixalis/pedio-intro.html"
      title="Πρώτη γνωριμία με το ηλεκτρικό πεδίο: παρουσίαση"
      loading="lazy"
      onLoad={() => {
        loaded.current = true;
        ref.current?.contentWindow?.postMessage("pedio-intro-ping", "*");
        if (pending.current) {
          send(pending.current);
          pending.current = null;
        }
      }}
      className="block w-full rounded-2xl bg-[#f3efe8]"
      style={{ height }}
    />
  );
}
