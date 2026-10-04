"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { HomePageData } from "@/content/home";
import {
  GUESTS_SELECT_CLASS,
  LIVE_CARD_CLASS,
  LIVE_SECTION_CLASS,
  LiveDirectBodySkeleton,
  LiveDirectHeader,
  liveRequestLocale,
} from "@/components/home/LiveDirectRequestFrame";

type LastMinuteData = HomePageData["lastMinute"];

// React.lazy + Suspense (instead of next/dynamic with an empty loading state)
// keeps the full-size placeholder on screen while the widget code downloads.
// Previously the section collapsed to 0px for a moment, shifting the page.
const LiveDirectRequestClient = lazy(() =>
  import("@/components/home/LiveDirectRequest").then((module) => ({ default: module.LiveDirectRequest })),
);

const WEEKLY_TITLES = {
  en: "Travelling to Chios this week?",
  el: "Ταξιδεύετε στη Χίο αυτή την εβδομάδα;",
  fr: "Vous voyagez à Chios cette semaine ?",
  de: "Reisen Sie diese Woche nach Chios?",
  it: "Viaggi a Chios questa settimana?",
  es: "¿Viajas a Quíos esta semana?",
  tr: "Bu hafta Sakız Adası'na mı geliyorsunuz?",
} as const;

function weeklyTitle(canonicalPath: string) {
  if (canonicalPath.startsWith("/el")) return WEEKLY_TITLES.el;
  if (canonicalPath.startsWith("/fr")) return WEEKLY_TITLES.fr;
  if (canonicalPath.startsWith("/de")) return WEEKLY_TITLES.de;
  if (canonicalPath.startsWith("/it")) return WEEKLY_TITLES.it;
  if (canonicalPath.startsWith("/es")) return WEEKLY_TITLES.es;
  if (canonicalPath.startsWith("/tr")) return WEEKLY_TITLES.tr;
  return WEEKLY_TITLES.en;
}

export function LazyLastMinuteDeals({
  data,
  canonicalPath,
}: {
  data: LastMinuteData;
  canonicalPath: string;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const weeklyData: LastMinuteData = { ...data, title: weeklyTitle(canonicalPath) };

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
          setShouldLoad(true);
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

  // Same header and footprint as the loaded widget, so jumping here from the
  // hero "Offers" link lands in the right place and nothing shifts later.
  const placeholder = (
      <section className={LIVE_SECTION_CLASS} aria-labelledby="live-direct-placeholder-title" aria-busy="true">
        <div className={LIVE_CARD_CLASS}>
          <div className="min-w-0 p-4 md:p-7 lg:p-8">
            <LiveDirectHeader
              locale={liveRequestLocale(canonicalPath)}
              title={weeklyData.title}
              headingId="live-direct-placeholder-title"
              guestsControl={
                <select disabled value={2} className={GUESTS_SELECT_CLASS} aria-hidden="true" tabIndex={-1} onChange={() => undefined}>
                  {weeklyData.widget.guestButtons.map((button) => (
                    <option key={button.value} value={button.value}>{button.label}</option>
                  ))}
                </select>
              }
            />
            <LiveDirectBodySkeleton locale={liveRequestLocale(canonicalPath)} />
          </div>
        </div>
      </section>
  );

  return (
    <div id="vh-lastminute-title" ref={rootRef} className="scroll-mt-24 md:scroll-mt-28">
      {shouldLoad ? (
        <Suspense fallback={placeholder}>
          <LiveDirectRequestClient data={weeklyData} canonicalPath={canonicalPath} />
        </Suspense>
      ) : placeholder}
    </div>
  );
}
