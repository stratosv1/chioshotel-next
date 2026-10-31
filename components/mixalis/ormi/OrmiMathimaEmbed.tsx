"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Embeds the interactive momentum lesson (public/mixalis/ormi-mathima.html, chapter 2 of the school book)
 * and grows the iframe to its content height. When the lesson changes slide it asks us to bring its top into view.
 */
export function OrmiMathimaEmbed() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return;
      if (e.data?.type === "ormi-mathima-height") {
        const h = Number(e.data.height);
        if (h > 200 && h < 8000) setHeight(h);
      } else if (e.data?.type === "ormi-mathima-top") {
        const top = ref.current?.getBoundingClientRect().top ?? 0;
        if (top < 0) ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("message", onMessage);
    ref.current?.contentWindow?.postMessage("ormi-mathima-ping", "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      src="/mixalis/ormi-mathima.html"
      title="Ορμή: το μάθημα του κεφαλαίου 2 με κινούμενα σχέδια, εργαστήρια, quiz και λυμένες ασκήσεις"
      onLoad={() => ref.current?.contentWindow?.postMessage("ormi-mathima-ping", "*")}
      className="block w-full scroll-mt-4 bg-[#f4f1ea]"
      style={{ height }}
    />
  );
}
