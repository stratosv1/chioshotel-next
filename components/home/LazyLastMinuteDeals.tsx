"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { HomePageData } from "@/content/home";

type LastMinuteData = HomePageData["lastMinute"];

const LAST_MINUTE_CSS_ID = "last-minute-widget-css";

function loadLastMinuteStyles() {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }

  if (document.getElementById(LAST_MINUTE_CSS_ID)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const link = document.createElement("link");
    link.id = LAST_MINUTE_CSS_ID;
    link.rel = "stylesheet";
    link.href = "/css/last-minute-widget.css";
    link.onload = () => resolve();
    link.onerror = () => resolve();

    document.head.appendChild(link);
  });
}

const LastMinuteDealsClient = dynamic(
  () => import("@/components/home/LastMinuteDeals").then((module) => module.LastMinuteDeals),
  {
    ssr: false,
    loading: () => null,
  },
);

export function LazyLastMinuteDeals({
  data,
  canonicalPath,
}: {
  data: LastMinuteData;
  canonicalPath: string;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  function revealDeals() {
    void loadLastMinuteStyles().finally(() => setShouldLoad(true));
  }

  useEffect(() => {
    const element = rootRef.current;

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
          revealDeals();
          observer.disconnect();
        }
      },
      {
        rootMargin: "700px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldLoad]);

  if (shouldLoad) {
    return <LastMinuteDealsClient data={data} canonicalPath={canonicalPath} />;
  }

  return (
    <div ref={rootRef}>
      <section className="vh-section vh-section--tight" aria-labelledby="vh-lastminute-title">
        <div className="vh-wrap">
          <header className="vh-section-head" style={{ textAlign: "center" }}>
            <span className="vh-kicker">{data.kicker}</span>
            <h2 className="vh-title" id="vh-lastminute-title">
              <span aria-hidden="true" style={{ marginRight: 8 }}>
                {data.icon}
              </span>
              {data.title}
            </h2>
            <p className="vh-subtitle" style={{ margin: "0 auto", maxWidth: 900 }}>
              {data.subtitle}
            </p>
          </header>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button
              type="button"
              className="vh-btn vh-btn--primary"
              onClick={revealDeals}
            >
              {data.title}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
