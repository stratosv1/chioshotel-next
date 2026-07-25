"use client";

import { useEffect, useRef, useState } from "react";
import type { DealsPageData } from "@/content/deals";

type OffersCarouselProps = {
  offers: DealsPageData["offers"];
};

export function OffersCarousel({ offers }: OffersCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToOffer = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const item = track.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const move = (direction: -1 | 1) => {
    const nextIndex = (activeIndex + direction + offers.length) % offers.length;
    setActiveIndex(nextIndex);
    scrollToOffer(nextIndex);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const items = Array.from(track.children) as HTMLElement[];
      if (!items.length) return;

      const trackLeft = track.getBoundingClientRect().left;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      items.forEach((item, index) => {
        const distance = Math.abs(item.getBoundingClientRect().left - trackLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex gap-2" aria-label="Offer carousel navigation">
          <button
            type="button"
            onClick={() => move(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-800/20 bg-white text-xl font-black text-amber-900 shadow-md shadow-stone-900/5 transition hover:-translate-y-0.5 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
            aria-label="Previous offer"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-800/20 bg-white text-xl font-black text-amber-900 shadow-md shadow-stone-900/5 transition hover:-translate-y-0.5 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
            aria-label="Next offer"
          >
            →
          </button>
        </div>

        <div className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500" aria-live="polite">
          {activeIndex + 1} / {offers.length}
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6 lg:gap-8"
      >
        {offers.map((offer) => (
          <article
            className="group min-w-[88%] snap-start overflow-hidden rounded-[2rem] border border-amber-800/15 bg-white shadow-xl shadow-stone-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-900/10 sm:min-w-[72%] lg:min-w-[calc(50%-1rem)]"
            key={offer.id}
          >
            <div className="h-[260px] overflow-hidden bg-stone-200 md:h-[360px]">
              <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={offer.image} alt={offer.imageAlt} loading="lazy" />
            </div>

            <div className="p-[clamp(24px,4vw,38px)] text-center">
              <span className="inline-flex min-h-[30px] items-center rounded-full border border-amber-800/15 bg-amber-50 px-3 text-[10px] font-black uppercase tracking-[0.12em] text-amber-800">
                {offer.discountLabel}
              </span>
              <h3 className="mt-4 text-[clamp(30px,4vw,46px)] font-black leading-none tracking-[-0.045em] text-amber-800">{offer.title}</h3>
              <p className="mt-4 text-[15px] leading-7 text-stone-600">{offer.description}</p>

              <div className="mt-6 flex flex-wrap justify-center gap-2" aria-label={`${offer.title} offer tags`}>
                {offer.tags.map((tag) => (
                  <span className="inline-flex min-h-7 items-center rounded-full border border-amber-800/20 bg-white px-3 text-[9px] font-black uppercase tracking-[0.1em] text-amber-800" key={tag}>{tag}</span>
                ))}
              </div>

              <div className="mt-5 rounded-[1.125rem] border border-amber-800/15 bg-amber-50 p-4 text-[13px] leading-6 text-stone-800">
                <strong className="text-amber-800">Tip:</strong> {offer.tip}
              </div>

              <div className="mt-4 rounded-[1.25rem] border-2 border-dashed border-amber-800 bg-[#f8f7f2] p-4" aria-label={`${offer.title} coupon code`}>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.12em] text-stone-600">Code</span>
                <strong className="block font-mono text-3xl font-black leading-none tracking-[0.06em] text-amber-800">{offer.couponCode}</strong>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-amber-800 px-4 text-[11px] font-black uppercase tracking-[0.1em] !text-white shadow-lg shadow-amber-900/15"
                  href={offer.bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book now
                </a>

                <a className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-amber-800/20 bg-[#fff7ee] px-4 text-[11px] font-black uppercase tracking-[0.1em] text-amber-900" href={offer.roomPageHref}>
                  View room
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-1 flex justify-center gap-2" aria-label="Offer carousel pages">
        {offers.map((offer, index) => (
          <button
            key={offer.id}
            type="button"
            onClick={() => {
              setActiveIndex(index);
              scrollToOffer(index);
            }}
            className={`h-2.5 rounded-full transition-all ${activeIndex === index ? "w-7 bg-amber-800" : "w-2.5 bg-amber-800/25 hover:bg-amber-800/45"}`}
            aria-label={`Go to offer ${index + 1}`}
            aria-current={activeIndex === index ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
