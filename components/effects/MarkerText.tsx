import type { ReactNode } from "react";

/**
 * Highlighter-pen effect for section titles: a soft marker stroke is drawn
 * behind the lower part of the text, left to right, when the title scrolls
 * into view. The stroke is triggered by <MarkerObserver/> (sets data-drawn).
 * Without JS, or with reduced motion, the text simply renders normally.
 */
const markerImage =
  "linear-gradient(100deg, rgba(245,158,11,0) 0.6%, rgba(245,158,11,0.5) 2.2%, rgba(245,158,11,0.32) 6%, rgba(245,158,11,0.36) 92%, rgba(245,158,11,0.52) 96.5%, rgba(245,158,11,0) 99%)";
const markerImageDark =
  "linear-gradient(100deg, rgba(217,119,6,0) 0.6%, rgba(217,119,6,0.75) 2.2%, rgba(217,119,6,0.55) 6%, rgba(217,119,6,0.6) 92%, rgba(217,119,6,0.78) 96.5%, rgba(217,119,6,0) 99%)";

export function MarkerText({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <span
      data-marker=""
      className="bg-no-repeat [background-position:0_88%] [background-size:0%_0.42em] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] transition-[background-size] duration-[1100ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] data-[drawn=true]:[background-size:100%_0.42em] motion-reduce:transition-none"
      style={{ backgroundImage: onDark ? markerImageDark : markerImage }}
    >
      {children}
    </span>
  );
}
