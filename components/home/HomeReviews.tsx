"use client";

import { useEffect, useRef, useState } from "react";

type HomeReviewsProps = {
  loaderUrl: string;
};

export function HomeReviews({ loaderUrl }: HomeReviewsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

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

    element.innerHTML = "";

    const script = document.createElement("script");
    script.src = loaderUrl;
    script.async = true;
    script.defer = true;

    element.appendChild(script);
  }, [loaderUrl, shouldLoad]);

  return <div ref={containerRef} className="vh-reviews-widget" style={{ textAlign: "center" }} />;
}
