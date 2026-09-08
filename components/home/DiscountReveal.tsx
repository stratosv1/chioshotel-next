"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

type DiscountRevealProps = {
  submitLabel: string;
  successText: string;
  code: string;
  locale?: Locale;
};

type Locale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

const REVEAL_PERCENT = 58;

const COPY: Record<
  Locale,
  {
    title: string;
    coverLine1: string;
    coverLine2: string;
    codeLabel: string;
    hiddenNote: string;
  }
> = {
  en: {
    title: "Scratch to reveal your discount",
    coverLine1: "Scratch to reveal",
    coverLine2: "your discount",
    codeLabel: "Direct booking code",
    hiddenNote: "Scratch the card to reveal your 10% discount code.",
  },
  el: {
    title: "Ξύσε για να δεις την έκπτωση",
    coverLine1: "Ξύσε για να δεις",
    coverLine2: "την έκπτωση",
    codeLabel: "Κωδικός απευθείας κράτησης",
    hiddenNote: "Ξύσε την κάρτα για να εμφανιστεί ο κωδικός έκπτωσης 10%.",
  },
  fr: {
    title: "Grattez pour voir la réduction",
    coverLine1: "Grattez pour voir",
    coverLine2: "la réduction",
    codeLabel: "Code de réservation directe",
    hiddenNote: "Grattez la carte pour révéler votre code de réduction de 10%.",
  },
  de: {
    title: "Rabatt freirubbeln",
    coverLine1: "Freirubbeln",
    coverLine2: "Rabatt sehen",
    codeLabel: "Direktbuchungscode",
    hiddenNote: "Rubbeln Sie die Karte frei, um Ihren 10%-Rabattcode zu sehen.",
  },
  it: {
    title: "Gratta per vedere lo sconto",
    coverLine1: "Gratta per vedere",
    coverLine2: "lo sconto",
    codeLabel: "Codice prenotazione diretta",
    hiddenNote: "Gratta la card per rivelare il codice sconto del 10%.",
  },
  es: {
    title: "Rasca para ver el descuento",
    coverLine1: "Rasca para ver",
    coverLine2: "el descuento",
    codeLabel: "Código de reserva directa",
    hiddenNote: "Rasca la tarjeta para revelar tu código de descuento del 10%.",
  },
  tr: {
    title: "İndirimi görmek için kazıyın",
    coverLine1: "İndirimi görmek",
    coverLine2: "için kazıyın",
    codeLabel: "Doğrudan rezervasyon kodu",
    hiddenNote: "%10 indirim kodunuzu görmek için kartı kazıyın.",
  },
};

export function DiscountReveal({ successText, code, locale = "en" }: DiscountRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const checkCounterRef = useRef(0);

  const [isRevealed, setIsRevealed] = useState(false);
  const text = COPY[locale];

  const drawCover = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;

    if (!canvas || !card || isRevealed) return;

    const width = card.clientWidth;
    const height = card.clientHeight;
    const ratio = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#b98618");
    gradient.addColorStop(0.5, "#d9b76c");
    gradient.addColorStop(1, "#916006");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255,255,255,0.15)";
    for (let x = 0; x < width; x += 16) {
      ctx.fillRect(x, 0, 7, height);
    }

    ctx.fillStyle = "#fffaf1";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "700 16px Arial, sans-serif";
    ctx.fillText(text.coverLine1, width / 2, height / 2 - 9);

    ctx.font = "700 14px Arial, sans-serif";
    ctx.fillText(text.coverLine2, width / 2, height / 2 + 13);
  }, [isRevealed, text.coverLine1, text.coverLine2]);

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

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (isRevealed) return;
    isDrawingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    scratch(event.clientX, event.clientY);
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current || isRevealed) return;
    event.preventDefault();
    scratch(event.clientX, event.clientY);
  }

  function handlePointerUp() {
    isDrawingRef.current = false;
    checkRevealPercent();
  }

  return (
    <div id="discountCodeForm" className="mx-auto w-full max-w-[300px]">
        <div className="hidden">
          🎁 {text.title}
        </div>

        <div
          ref={cardRef}
          aria-label={text.title}
          className="relative flex h-24 w-full select-none items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-amber-800/25 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.78),transparent_30%),linear-gradient(135deg,#fff6e5,#f2d79e)] text-center shadow-[0_8px_18px_rgba(142,102,7,.10)]"
        >
          <div className="px-3.5 py-2">
            <div className="mb-0.5 text-base" aria-hidden="true">
              🎁
            </div>

            <div className="mb-1 text-[8px] font-black uppercase tracking-[.12em] text-[#6f645b]">
              {text.codeLabel}
            </div>

            <div
              id="discountCodeValue"
              className="font-serif text-[clamp(23px,7vw,32px)] font-black leading-none tracking-[.03em] text-[#8e6607]"
            >
              {code || "WELCOME10"}
            </div>

            {isRevealed ? (
              <div className="mt-1.5 text-[10px] font-bold leading-tight text-[#6f645b]">
                {successText}
              </div>
            ) : null}
          </div>

          {!isRevealed ? (
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute inset-0 h-full w-full touch-none cursor-grab"
            />
          ) : null}
        </div>

        <div id="discountFeedback" className="text-sm font-bold text-red-700" aria-live="polite" />
    </div>
  );
}
