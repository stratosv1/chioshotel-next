"use client";

import { useEffect, useRef, useState } from "react";

/** Embeds the theory presentation (public/mixalis/ormi-theory.html) and grows the iframe to its content height. */
export function OrmiTheoryEmbed() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(820);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return;
      const h = e.data?.type === "ormi-theory-height" ? Number(e.data.height) : 0;
      if (h > 200 && h < 4000) setHeight(h);
    };
    window.addEventListener("message", onMessage);
    ref.current?.contentWindow?.postMessage("ormi-theory-ping", "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      src="/mixalis/ormi-theory.html"
      title="Ορμή και κρούσεις: η θεωρία με κινούμενα σχέδια, εργαστήρια και quiz"
      loading="lazy"
      onLoad={() => ref.current?.contentWindow?.postMessage("ormi-theory-ping", "*")}
      className="block w-full bg-[#f4f1ea]"
      style={{ height }}
    />
  );
}
