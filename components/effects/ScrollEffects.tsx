import { MarkerObserver } from "@/components/effects/MarkerObserver";
import { RevealObserver } from "@/components/effects/RevealObserver";

/**
 * Mount once near the top of a page to enable <MarkerText> title strokes and
 * [data-reveal] fade-ups. The inline script hides reveal targets before they
 * paint (only when JS + IntersectionObserver are available and the visitor
 * has not asked for reduced motion).
 */
const revealBootstrap =
  "if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window&&!document.getElementById('vh-reveal'))(function(){var s=document.createElement('style');s.id='vh-reveal';s.textContent='[data-reveal]:not([data-shown]){opacity:0;transform:translate3d(0,24px,0)}';document.head.appendChild(s)})()";

export function ScrollEffects() {
  return (
    <>
      <MarkerObserver />
      <RevealObserver />
      <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
    </>
  );
}
