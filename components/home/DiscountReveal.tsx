"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

type DiscountRevealProps = {
  submitLabel: string;
  successText: string;
  code: string;
};

type Locale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

const REVEAL_PERCENT = 58;

const COMPACT_SECTION_CSS = `
@supports selector(article:has(#discountCodeForm)) {
  article:has(#discountCodeForm) {
    margin-top: 2rem;
    border-radius: 1.75rem;
    background: #fff8ea;
    box-shadow: 0 14px 32px rgba(68, 64, 60, .08);
  }

  article:has(#discountCodeForm) > div.absolute {
    display: none;
  }

  article:has(#discountCodeForm) > div.relative {
    grid-template-columns: minmax(0, 1fr);
  }

  article:has(#discountCodeForm) > div.relative > div:first-child {
    padding: 1.35rem 1.35rem .5rem;
  }

  article:has(#discountCodeForm) > div.relative > div:first-child h3 {
    margin-top: 1rem;
    max-width: 18rem;
    font-size: clamp(2rem, 9vw, 3rem);
    line-height: 1.05;
  }

  article:has(#discountCodeForm) > div.relative > div:first-child p {
    display: none;
  }

  article:has(#discountCodeForm) > div.relative > div:first-child ul {
    margin-top: 1rem;
    display: flex;
    gap: .5rem;
    overflow-x: auto;
    padding-bottom: .25rem;
    scrollbar-width: none;
  }

  article:has(#discountCodeForm) > div.relative > div:first-child ul::-webkit-scrollbar {
    display: none;
  }

  article:has(#discountCodeForm) > div.relative > div:first-child li {
    min-width: max-content;
    display: flex;
    align-items: center;
    gap: .5rem;
    border-radius: 999px;
    padding: .65rem .85rem;
    font-size: .78rem;
    line-height: 1.15;
  }

  article:has(#discountCodeForm) > div.relative > div:first-child li span:first-child {
    margin: 0;
    height: 1.6rem;
    min-width: 1.6rem;
    font-size: .62rem;
  }

  article:has(#discountCodeForm) > div.relative > div:last-child {
    padding: .5rem 1.25rem 1.35rem;
  }

  article:has(#discountCodeForm) > div.relative > div:last-child > div {
    max-width: 100%;
    border-radius: 1.45rem;
    padding: .75rem;
    background: linear-gradient(135deg, #6f3f1d, #a35b1e);
    box-shadow: 0 10px 22px rgba(68, 64, 60, .12);
  }

  article:has(#discountCodeForm) > div.relative > div:last-child > div > div {
    border-radius: 1.25rem;
    padding: .9rem;
  }

  article:has(#discountCodeForm) > div.relative > div:last-child > div > div > p {
    display: none;
  }

  article:has(#discountCodeForm) > div.relative > div:last-child > div > div > div {
    margin-top: 0;
    padding: .8rem;
    box-shadow: 0 8px 18px rgba(68, 64, 60, .12);
  }
}

@media (min-width: 1024px) {
  @supports selector(article:has(#discountCodeForm)) {
    article:has(#discountCodeForm) > div.relative {
      grid-template-columns: minmax(0, 1fr) 360px;
      align-items: center;
    }

    article:has(#discountCodeForm) > div.relative > div:first-child {
      padding: 2rem 2.5rem;
    }

    article:has(#discountCodeForm) > div.relative > div:first-child h3 {
      max-width: 36rem;
      font-size: 3rem;
    }

    article:has(#discountCodeForm) > div.relative > div:first-child ul {
      overflow: visible;
    }

    article:has(#discountCodeForm) > div.relative > div:last-child {
      padding: 1.5rem 2rem 1.5rem 0;
    }
  }
}
`;

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

function getLocaleFromPath(): Locale {
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

export function DiscountReveal({ successText, code }: DiscountRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const checkCounterRef = useRef(0);

  const [isRevealed, setIsRevealed] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");

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
    gradient.addColorStop(0, "#b98618");
    gradient.addColorStop(0.5, "#d9b76c");
    gradient.addColorStop(1, "#916006");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = "rgba(255,255,255,0.15)";
    for (let x = 0; x < rect.width; x += 16) {
      ctx.fillRect(x, 0, 7, rect.height);
    }

    ctx.fillStyle = "#fffaf1";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "700 16px Arial, sans-serif";
    ctx.fillText(text.coverLine1, rect.width / 2, rect.height / 2 - 9);

    ctx.font = "700 14px Arial, sans-serif";
    ctx.fillText(text.coverLine2, rect.width / 2, rect.height / 2 + 13);
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
    <>
      <style jsx global>{COMPACT_SECTION_CSS}</style>
      <div
        id="discountCodeForm"
        style={{
          width: "100%",
          maxWidth: 300,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "none",
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
            height: 96,
            border: "2px dashed rgba(142,102,7,.24)",
            borderRadius: 16,
            overflow: "hidden",
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,.78), transparent 30%), linear-gradient(135deg, #fff6e5, #f2d79e)",
            boxShadow: "0 8px 18px rgba(142,102,7,.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          <div style={{ padding: "9px 14px" }}>
            <div style={{ fontSize: 16, marginBottom: 2 }} aria-hidden="true">
              🎁
            </div>

            <div
              style={{
                marginBottom: 4,
                color: "#6f645b",
                fontSize: 8,
                fontWeight: 900,
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              {text.codeLabel}
            </div>

            <div
              id="discountCodeValue"
              style={{
                color: "#8E6607",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(23px, 7vw, 32px)",
                fontWeight: 900,
                letterSpacing: ".03em",
                lineHeight: 1,
              }}
            >
              {code || "WELCOME10"}
            </div>

            {isRevealed ? (
              <div
                style={{
                  marginTop: 5,
                  color: "#6f645b",
                  fontSize: 10,
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}
              >
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

        <div id="discountFeedback" className="discount-error" aria-live="polite" />
      </div>
    </>
  );
}
