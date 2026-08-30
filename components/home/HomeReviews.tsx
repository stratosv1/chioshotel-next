"use client";

import { useEffect, useRef, useState } from "react";

type HomeReviewsProps = {
  loaderUrl: string;
};

export function HomeReviews({ loaderUrl }: HomeReviewsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || shouldLoad) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "600px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || !shouldLoad) {
      return;
    }

    setWidgetReady(false);
    element.innerHTML = "";

    const mutationObserver = new MutationObserver(() => {
      const hasRenderedWidget = Array.from(element.children).some(
        (child) => child.tagName !== "SCRIPT",
      );
      if (hasRenderedWidget) {
        setWidgetReady(true);
        mutationObserver.disconnect();
      }
    });

    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
    });

    const script = document.createElement("script");
    script.src = loaderUrl;
    script.async = true;
    script.defer = true;
    script.addEventListener("error", () => setWidgetReady(true), { once: true });

    element.appendChild(script);

    return () => mutationObserver.disconnect();
  }, [loaderUrl, shouldLoad]);

  return (
    <div
      ref={containerRef}
      className="vh-reviews-widget min-h-[280px] md:min-h-[320px]"
      style={{ textAlign: "center" }}
      role="region"
      aria-label="Guest reviews"
      aria-busy={!widgetReady}
    />
  );
}
