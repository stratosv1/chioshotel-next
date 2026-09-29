"use client";

import { useEffect, useState } from "react";

type MobileAvailabilityBarProps = {
  href: string;
  label: string;
  tone?: "dark" | "gold";
  showAfterId?: string;
  hideWhileIds?: string[];
};

export function MobileAvailabilityBar({
  href,
  label,
  tone = "dark",
  showAfterId,
  hideWhileIds = [],
}: MobileAvailabilityBarProps) {
  const blockerIds = hideWhileIds.join("|");
  const [isPastStart, setIsPastStart] = useState(!showAfterId);
  const [visibleBlockers, setVisibleBlockers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const startElement = showAfterId ? document.getElementById(showAfterId) : null;
    const blockers = blockerIds
      .split("|")
      .filter(Boolean)
      .map((id) => ({ id, element: document.getElementById(id) }))
      .filter((item): item is { id: string; element: HTMLElement } => Boolean(item.element));

    if (showAfterId && !startElement) setIsPastStart(true);

    const startObserver = startElement
      ? new IntersectionObserver(
          ([entry]) => {
            setIsPastStart(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
          },
          { threshold: [0, 0.05] },
        )
      : null;

    const blockerObserver = blockers.length
      ? new IntersectionObserver(
          (entries) => {
            setVisibleBlockers((current) => {
              const next = { ...current };
              entries.forEach((entry) => {
                next[(entry.target as HTMLElement).id] = entry.isIntersecting;
              });
              return next;
            });
          },
          { rootMargin: "0px 0px 72px 0px", threshold: 0 },
        )
      : null;

    if (startElement && startObserver) startObserver.observe(startElement);
    blockers.forEach(({ element }) => blockerObserver?.observe(element));

    return () => {
      startObserver?.disconnect();
      blockerObserver?.disconnect();
    };
  }, [blockerIds, showAfterId]);

  const isVisible = isPastStart && !Object.values(visibleBlockers).some(Boolean);
  const buttonClassName = tone === "gold"
    ? "bg-amber-500 text-[#2f261f] shadow-amber-900/10"
    : "bg-amber-700 text-white shadow-amber-900/15";

  return (
    <div
      aria-hidden={!isVisible}
      inert={!isVisible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-amber-900/10 bg-[#fffaf3]/95 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_30px_rgba(47,38,31,0.12)] backdrop-blur transition duration-300 md:hidden ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <a
        href={href}
        className={`mx-auto flex min-h-[52px] max-w-lg items-center justify-center rounded-full px-5 text-center text-sm font-black uppercase tracking-[0.06em] shadow-lg ${buttonClassName}`}
      >
        {label}
      </a>
    </div>
  );
}
