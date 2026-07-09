"use client";

import { useRef } from "react";

type HorizontalChipScrollerItem = {
  href: string;
  label: string;
  icon: string;
};

type HorizontalChipScrollerProps = {
  ariaLabel: string;
  items: readonly HorizontalChipScrollerItem[];
};

export function HorizontalChipScroller({ ariaLabel, items }: HorizontalChipScrollerProps) {
  const scrollerRef = useRef<HTMLElement | null>(null);

  function scrollNext() {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: Math.min(scroller.clientWidth * 0.78, 320),
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll right"
        onClick={scrollNext}
        className="absolute -right-1 -top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#2f261f] text-xl font-black text-white shadow-xl ring-4 ring-white transition active:scale-95 md:hidden"
      >
        →
      </button>

      <nav
        ref={scrollerRef}
        aria-label={ariaLabel}
        className="flex gap-3 overflow-x-auto pb-1 pr-12 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:pr-0 md:pt-0"
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-teal-900/10 bg-white px-4 py-3 text-sm font-black text-[#102b2d] shadow-sm transition hover:-translate-y-0.5 hover:border-teal-700/30 hover:bg-teal-50 hover:text-teal-900 md:px-5"
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
