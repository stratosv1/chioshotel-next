"use client";

import { useEffect, useMemo, useState } from "react";
import type { DealsPageData } from "@/content/deals";

type DealsPageProps = {
  data: DealsPageData;
};

type CountdownState = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
};

function getCountdown(targetIso: string): CountdownState {
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      expired: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    expired: false,
  };
}

function Countdown({ data }: { data: DealsPageData }) {
  const initialCountdown = useMemo(() => getCountdown(data.countdown.targetIso), [data]);
  const [countdown, setCountdown] = useState<CountdownState>(initialCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown(data.countdown.targetIso));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [data.countdown.targetIso]);

  if (countdown.expired) {
    return (
      <div className="relative z-10 mx-auto -mt-10 w-[min(620px,calc(100%-32px))] rounded-[2rem] border border-amber-800/15 bg-white px-6 py-5 text-center text-sm font-black uppercase tracking-[0.12em] text-amber-800 shadow-2xl shadow-stone-900/10" role="status">
        {data.countdown.expiredText}
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto -mt-10 flex w-[min(650px,calc(100%-32px))] flex-col items-center justify-center gap-3 rounded-[2rem] border border-amber-800/15 bg-white px-5 py-5 shadow-2xl shadow-stone-900/10 md:flex-row md:rounded-full md:px-7" aria-label={data.countdown.label}>
      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-amber-800">{data.countdown.label}</div>

      <div className="grid grid-cols-4 gap-2 md:flex md:gap-4">
        {[
          [countdown.days, "Days"],
          [countdown.hours, "Hours"],
          [countdown.minutes, "Mins"],
          [countdown.seconds, "Secs"],
        ].map(([value, label]) => (
          <div className="min-w-14 rounded-2xl bg-amber-50 px-2 py-2 text-center md:bg-transparent md:p-0" key={label}>
            <strong className="block text-2xl font-black leading-none text-amber-800 md:text-[28px]">{value}</strong>
            <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.11em] text-stone-700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DealsPage({ data }: DealsPageProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(142,102,7,.12),transparent_30rem),linear-gradient(180deg,#fffdfa_0%,#faf9f6_100%)] text-stone-800">
      <div className="relative z-10 border-b border-amber-800/15 bg-white px-4 py-3 text-center">
        <a className="text-[13px] font-black uppercase tracking-[0.1em] text-amber-800" href={data.hero.phoneHref}>{data.hero.phoneLabel}</a>
      </div>

      <section className="relative flex min-h-[500px] items-end overflow-hidden text-white max-md:min-h-[76svh]" aria-labelledby="deals-hero-title">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img className="h-full w-full object-cover" src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(18,25,18,.86)_0%,rgba(55,43,24,.56)_58%,rgba(18,25,18,.26)_100%),linear-gradient(0deg,rgba(18,25,18,.78)_0%,transparent_62%)]" />

        <div className="relative z-[2] mx-auto w-[min(1240px,calc(100%-40px))] py-20 pt-28 max-md:w-[calc(100%-24px)] max-md:py-14 max-md:pt-5">
          <div className="max-w-[850px] rounded-[2.125rem] border border-white/20 bg-white/10 p-[clamp(30px,5vw,54px)] shadow-[0_34px_90px_rgba(0,0,0,.24)] backdrop-blur-xl max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-0">
            <span className="mb-5 inline-flex min-h-8 items-center rounded-full border border-white/25 bg-white/15 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-white">
              {data.hero.kicker}
            </span>
            <h1 id="deals-hero-title" className="m-0 max-w-[13ch] text-[clamp(40px,7vw,78px)] font-black leading-[0.96] tracking-[-0.055em] text-white drop-shadow-lg">
              {data.hero.title}
            </h1>
            <p className="mt-5 max-w-[720px] text-base leading-7 text-white/95 md:text-lg md:leading-8">
              {data.hero.description}
            </p>
          </div>
        </div>
      </section>

      <Countdown data={data} />

      <section className="px-0 py-16 md:py-20" aria-labelledby="deals-intro-title">
        <div className="mx-auto w-[min(1240px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <header className="mx-auto mb-11 max-w-[840px] text-center">
            <span className="inline-flex min-h-8 items-center rounded-full bg-[#f1eadc] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-amber-800">
              {data.intro.kicker}
            </span>
            <h2 id="deals-intro-title" className="mt-4 text-[clamp(34px,5vw,62px)] font-black leading-none tracking-[-0.055em] text-amber-800">
              {data.intro.title}
            </h2>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-7 text-stone-600">{data.intro.description}</p>
          </header>

          <div className="grid gap-8 lg:grid-cols-2">
            {data.offers.map((offer) => (
              <article className="group overflow-hidden rounded-[2rem] border border-amber-800/15 bg-white shadow-xl shadow-stone-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-900/10" key={offer.id}>
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
                      className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-amber-800 px-4 text-[11px] font-black uppercase tracking-[0.1em] text-white"
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
        </div>
      </section>
    </main>
  );
}
