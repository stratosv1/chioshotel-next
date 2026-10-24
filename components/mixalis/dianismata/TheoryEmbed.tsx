"use client";

import { useEffect, useRef, useState } from "react";

/** Embeds the theory presentation (public/mixalis/dianismata-theory.html) and grows the iframe to its content height. */
export function DianismataTheoryEmbed() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(820);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return;
      const h = e.data?.type === "dianismata-theory-height" ? Number(e.data.height) : 0;
      if (h > 200 && h < 4000) setHeight(h);
    };
    window.addEventListener("message", onMessage);
    ref.current?.contentWindow?.postMessage("dianismata-theory-ping", "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      src="/mixalis/dianismata-theory.html"
      title="Διανύσματα με συντεταγμένες: η θεωρία με κινούμενα σχέδια, ασκήσεις και quiz"
      loading="lazy"
      onLoad={() => ref.current?.contentWindow?.postMessage("dianismata-theory-ping", "*")}
      className="block w-full rounded-2xl border border-black/10 bg-[#f4f1ea]"
      style={{ height }}
    />
  );
}
