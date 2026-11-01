"use client";

import { useEffect, useRef, useState } from "react";

/** Neon 1.2 based visual theory, presented as independent interactive slides. */
export function OmaliTheoryEmbed() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(760);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== ref.current?.contentWindow || event.origin !== window.location.origin) return;
      if (event.data?.type !== "omali-theory-height") return;
      const next = Number(event.data.height);
      if (Number.isFinite(next) && next >= 320 && next <= 3500) {
        setHeight((current) => Math.abs(current - next) > 3 ? next : current);
      }
    };
    window.addEventListener("message", onMessage);
    ref.current?.contentWindow?.postMessage("omali-theory-ping", window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      src="/mixalis/omali-theory.html"
      title="Ομαλή κυκλική κίνηση: διαδραστική θεωρία με 24 διαφάνειες, γραφήματα και quiz"
      loading="lazy"
      onLoad={() => ref.current?.contentWindow?.postMessage("omali-theory-ping", window.location.origin)}
      className="block w-full rounded-2xl border border-black/10 bg-[#f3efe8]"
      style={{ height }}
    />
  );
}
