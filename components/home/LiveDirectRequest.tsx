"use client";

import type { HomePageData } from "@/content/home";

type LastMinuteData = HomePageData["lastMinute"];

export function LiveDirectRequest({ data }: { data: LastMinuteData; canonicalPath: string }) {
  return (
    <section className="px-4 py-12 md:px-8 md:py-18" aria-labelledby="live-direct-title">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-amber-900/10 bg-[#fffaf3] p-6 shadow-2xl shadow-stone-900/10 md:p-10">
        <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-800">
          Instant request to reception
        </span>
        <h2 id="live-direct-title" className="mt-6 font-serif text-4xl font-bold leading-tight text-[#17351f] md:text-6xl">
          {data.title}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-700">{data.subtitle}</p>
      </div>
    </section>
  );
}
