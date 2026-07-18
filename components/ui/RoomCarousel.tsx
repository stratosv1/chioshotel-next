"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type RoomCarouselProps = {
  images: string[];
  roomName: string;
  compact?: boolean;
  showThumbnails?: boolean;
  imageFit?: "cover" | "contain";
};

export function RoomCarousel({
  images,
  roomName,
  compact = false,
  showThumbnails = true,
  imageFit = "cover",
}: RoomCarouselProps) {
  const safeImages = Array.from(new Set(images.filter(Boolean)));
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => setIndex(0), [roomName]);

  if (!safeImages.length) return null;

  const previous = () => setIndex((current) => (current - 1 + safeImages.length) % safeImages.length);
  const next = () => setIndex((current) => (current + 1) % safeImages.length);

  return (
    <div className="bg-white">
      <div
        className={compact
          ? "relative h-[clamp(260px,38dvh,430px)] overflow-hidden bg-white sm:h-[400px]"
          : "relative aspect-[16/10] overflow-hidden bg-white sm:aspect-[16/8]"}
        onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
          if (delta > 45) previous();
          if (delta < -45) next();
          touchStartX.current = null;
        }}
      >
        <Image
          key={safeImages[index]}
          src={safeImages[index]}
          alt={`${roomName}, φωτογραφία ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className={imageFit === "contain" ? "object-contain object-center" : "object-cover object-center"}
          priority
        />

        {safeImages.length > 1 ? (
          <>
            <button type="button" onClick={previous} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl shadow-md transition hover:scale-105" aria-label="Προηγούμενη φωτογραφία">‹</button>
            <button type="button" onClick={next} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl shadow-md transition hover:scale-105" aria-label="Επόμενη φωτογραφία">›</button>
            <span className="absolute bottom-3 right-4 rounded-full bg-[#43551b]/90 px-3 py-1 text-xs font-semibold text-white">{index + 1} / {safeImages.length}</span>
          </>
        ) : null}
      </div>

      {showThumbnails && safeImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto border-t border-stone-200 bg-white px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Μικρογραφίες δωματίου">
          {safeImages.map((src, imageIndex) => (
            <button
              key={`${src}-${imageIndex}`}
              type="button"
              onClick={() => setIndex(imageIndex)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${imageIndex === index ? "border-emerald-600 ring-2 ring-emerald-100" : "border-stone-200 opacity-75 hover:opacity-100"}`}
              aria-label={`Προβολή φωτογραφίας ${imageIndex + 1}`}
              aria-current={imageIndex === index ? "true" : undefined}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
