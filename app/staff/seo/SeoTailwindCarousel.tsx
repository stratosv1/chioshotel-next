"use client";

import { Children, type ReactNode, useRef } from "react";

type Props = {
  children: ReactNode;
  label: string;
  desktopColumns?: 1 | 2 | 3 | 4;
};

const desktopGrid: Record<NonNullable<Props["desktopColumns"]>, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export default function SeoTailwindCarousel({
  children,
  label,
  desktopColumns = 1,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;

    const firstItem = track.querySelector<HTMLElement>("[data-seo-carousel-item]");
    const distance = firstItem ? firstItem.offsetWidth + 12 : track.clientWidth * 0.88;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center justify-between gap-3 md:hidden">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a755f]">
          Σύρετε για {label}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={`Προηγούμενο ${label}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8cbb9] bg-white text-lg font-semibold text-[#44372d] shadow-sm transition active:scale-95"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={`Επόμενο ${label}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#44372d] text-lg font-semibold text-white shadow-sm transition active:scale-95"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className={`flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:overflow-visible md:snap-none md:pb-0 ${desktopGrid[desktopColumns]}`}
      >
        {Children.map(children, (child) => (
          <div
            data-seo-carousel-item
            className="min-w-[88%] snap-start sm:min-w-[68%] md:min-w-0"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
