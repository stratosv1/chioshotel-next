"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { HomePageData } from "@/content/home";

type LastMinuteData = HomePageData["lastMinute"];

const LiveDirectRequestClient = dynamic(
  () => import("@/components/home/LiveDirectRequest").then((module) => module.LiveDirectRequest),
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

  if (shouldLoad) {
    return (
      <div id="vh-lastminute-title" ref={rootRef} className="scroll-mt-24 md:scroll-mt-28">
        <LiveDirectRequestClient data={data} canonicalPath={canonicalPath} />
      </div>
    );
  }

  return (
    <div id="vh-lastminute-title" ref={rootRef} className="scroll-mt-24 md:scroll-mt-28">
      <section className="px-4 py-12 md:px-8 md:py-18" aria-labelledby="live-direct-placeholder-title">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-amber-900/10 bg-[#fffaf3] p-6 text-center shadow-lg shadow-stone-900/5 md:p-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-amber-700">{data.kicker}</p>
          <h2 id="live-direct-placeholder-title" className="font-serif text-3xl font-bold leading-tight text-stone-900 md:text-5xl">
            <span className="mr-2" aria-hidden="true">{data.icon}</span>
            {data.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-stone-600 md:text-lg">{data.subtitle}</p>
        </div>
      </section>
    </div>
  );
}
