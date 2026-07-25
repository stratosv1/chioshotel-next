"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const PolishLiveSearch = dynamic(
  () => import("@/components/booking/PolishChiosHotelsLiveSearch").then((module) => module.PolishChiosHotelsLiveSearch),
  { ssr: false, loading: () => null },
);

export function LazyPolishChiosHotelsLiveSearch() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = rootRef.current;
    if (!element || shouldLoad) return;
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
      { rootMargin: "700px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div id="vh-lastminute-title" ref={rootRef} className="scroll-mt-24 md:scroll-mt-28">
      {shouldLoad ? (
        <PolishLiveSearch />
      ) : (
        <section className="px-4 py-12 md:px-8 md:py-18" aria-labelledby="pl-live-placeholder-title">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-amber-900/10 bg-[#fffaf3] p-6 text-center shadow-lg shadow-stone-900/5 md:p-10">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-amber-700">AKTUALNA DOSTĘPNOŚĆ</p>
            <h2 id="pl-live-placeholder-title" className="font-serif text-3xl font-bold leading-tight text-stone-900 md:text-5xl">Sprawdź pokoje i apartamenty na swoje daty</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-stone-600 md:text-lg">Wyniki pochodzą z aktualnych danych Voulamandis House i pokazują rzeczywiste opcje pobytu.</p>
          </div>
        </section>
      )}
    </div>
  );
}
