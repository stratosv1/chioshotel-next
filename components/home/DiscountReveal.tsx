"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type DiscountRevealProps = {
  submitLabel: string;
  successText: string;
  code: string;
};

const REVEAL_PERCENT = 60;

function getLocaleFromPath(): "en" | "el" | "fr" | "de" | "it" | "es" | "tr" {
  if (typeof window === "undefined") return "en";

  const path = window.location.pathname.toLowerCase();

  if (path === "/el" || path.startsWith("/el/")) return "el";
  if (path === "/fr" || path.startsWith("/fr/")) return "fr";
  if (path === "/de" || path.startsWith("/de/")) return "de";
  if (path === "/it" || path.startsWith("/it/")) return "it";
  if (path === "/es" || path.startsWith("/es/")) return "es";
  if (path === "/tr" || path.startsWith("/tr/")) return "tr";

  return "en";
}

const COPY = {
  en: {
    title: "Scratch to reveal your discount",
    line1: "Scratch to reveal",
    line2: "your discount",
    codeLabel: "Direct booking code",
    note: "Scratch the card to reveal your 10% discount code",
  },
  el: {
    title: "Ξύσε για να δεις την έκπτωση",
    line1: "Ξύσε για να δεις",
    line2: "την έκπτωση",
    codeLabel: "Κωδικός απευθείας κράτησης",
    note: "Ξύσε την κάρτα για να εμφανιστεί ο κωδικός έκπτωσης 10%",
  },
  fr: {
    title: "Grattez pour voir la réduction",
    line1: "Grattez pour voir",
    line2: "la réduction",
    codeLabel: "Code de réservation directe",
    note: "Grattez la carte pour révéler votre code de réduction de 10%",
  },
  de: {
    title: "Freirubbeln und Rabatt sehen",
    line1: "Freirubbeln",
    line2: "und Rabatt sehen",
    codeLabel: "Direktbuchungscode",
    note: "Rubbeln Sie die Karte frei, um Ihren 10%-Rabattcode zu sehen",
  },
  it: {
    title: "Gratta per vedere lo sconto",
    line1: "Gratta per vedere",
    line2: "lo sconto",
    codeLabel: "Codice prenotazione diretta",
    note: "Gratta la card per rivelare il codice sconto del 10%",
  },
  es: {
    title: "Rasca para ver el descuento",
    line1: "Rasca para ver",
    line2: "el descuento",
    codeLabel: "Código de reserva directa",
    note: "Rasca la tarjeta para revelar tu código de descuento del 10%",
  },
  tr: {
    title: "İndirimi görmek için kazıyın",
    line1: "İndirimi görmek",
    line2: "için kazıyın",
    codeLabel: "Doğrudan rezervasyon kodu",
    note: "%10 indirim kodunuzu görmek için kartı kazıyın",
  },
} as const;

export function DiscountReveal({ successText, code }: DiscountRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const checkCounterRef = useRef(0);

  const [isRevealed, setIsRevealed] = useState(false);
  const [locale, setLocale] = useState<keyof typeof COPY>("en");

  useEffect(() => {
    setLocale(getLocaleFromPath());
  }, []);

  const text = COPY[locale];

  const drawCover = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;

    if (!canvas || !card || isRevealed) return;

    const rect = card.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#c69221");
    gradient.addColorStop(0.5, "#d9b76c");
    gradient.addColorStop(1, "#a06d0d");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = "rgba(255,255,255,0.14)";
    for (let x = 0; x < rect.width; x += 16) {
      ctx.fillRect(x, 0, 7, rect.height);
    }

    ctx.fillStyle = "#fffaf1";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "700 17px Arial, sans-serif";
    ctx.fillText(text.line1, rect.width / 2, rect.height / 2 - 10);

    ctx.font = "700 15px Arial, sans-serif";
    ctx.fillText(text.line2, rect.width / 2, rect.height / 2 + 14);
  }, [isRevealed, text.line1, text.line2]);

  useEffect(() => {
    drawCover();

    function onResize() {
      drawCover();
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [drawCover]);

  function scratch(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    checkCounterRef.current += 1;

    if (checkCounterRef.current % 6 === 0) {
      checkRevealPercent();
    }
  }

  function checkRevealPercent() {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels += 1;
    }

    const percent = (transparentPixels / (pixels.length / 4)) * 100;

    if (percent >= REVEAL_PERCENT) {
      setIsRevealed(true);
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (isRevealed) return;

    isDrawingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    scratch(event.clientX, event.clientY);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current || isRevealed) return;

    event.preventDefault();
    scratch(event.clientX, event.clientY);
  }

  function handlePointerUp() {
    isDrawingRef.current = false;
    checkRevealPercent();
  }

  return (
    <div
      id="discountCodeForm"
      style={{
        width: "100%",
        maxWidth: 420,
        margin: 0,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: "#5e513f",
          marginBottom: 10,
        }}
      >
        🎁 {text.title}
      </div>

      <div
        ref={cardRef}
        aria-label={text.title}
        style={{
          position: "relative",
          width: "100%",
          height: 128,
          borderRadius: 18,
          overflow: "hidden",
          border: "2px dashed rgba(142,102,7,.24)",
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,.78), transparent 30%), linear-gradient(135deg, #fff6e5, #f2d79e)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          userSelect: "none",
          boxShadow: "0 10px 24px rgba(142,102,7,.10)",
        }}
      >
        <div style={{ padding: "14px 18px" }}>
          <div style={{ fontSize: 23, marginBottom: 4 }} aria-hidden="true">
            🎁
          </div>

          <div
            style={{
              fontSize: 10,
              fontWeight: 900,
              color: "#6f645b",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            {text.codeLabel}
          </div>

          <div
            id="discountCodeValue"
            className="discount-code-value"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(28px, 3vw, 40px)",
              lineHeight: 1,
              color: "#8E6607",
              fontWeight: 900,
              letterSpacing: ".03em",
            }}
          >
            {code || "WELCOME10"}
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "#6f645b",
              fontWeight: 700,
            }}
          >
            {isRevealed ? successText : text.note}
          </div>
        </div>

        {!isRevealed ? (
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              cursor: "grab",
              touchAction: "none",
            }}
          />
        ) : null}
      </div>

      <div
        id="discountSuccess"
        className="discount-success"
        aria-live="polite"
        style={{
          display: isRevealed ? "block" : "none",
          marginTop: 10,
          fontSize: 13,
          textAlign: "center",
        }}
      >
        <div id="discountSuccessText">{successText}</div>
      </div>

      <div id="discountFeedback" className="discount-error" aria-live="polite" />
    </div>
  );
}
