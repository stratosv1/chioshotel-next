"use client";

import { useEffect, useRef, useState } from "react";

/** Embeds the first-time-learner presentation (public/mixalis/pedio-intro.html) and grows the iframe to its content height. */
export function PedioIntroEmbed() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(760);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return;
      const h = e.data?.type === "pedio-intro-height" ? Number(e.data.height) : 0;
      if (h > 200 && h < 4000) setHeight(h);
    };
    window.addEventListener("message", onMessage);
    ref.current?.contentWindow?.postMessage("pedio-intro-ping", "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      src="/mixalis/pedio-intro.html"
      title="Πρώτη γνωριμία με το ηλεκτρικό πεδίο: παρουσίαση"
      loading="lazy"
      onLoad={() => ref.current?.contentWindow?.postMessage("pedio-intro-ping", "*")}
      className="block w-full bg-[#f4f1ea]"
      style={{ height }}
    />
  );
}
