"use client";

import { useEffect, useState } from "react";

type MobileStickyContactProps = {
  call: {
    label: string;
    href: string;
  };
  chat: {
    label: string;
    href: string;
  };
};

type LiveRequestDetail = {
  href?: string;
};

export function MobileStickyContact({ call, chat }: MobileStickyContactProps) {
  const [chatHref, setChatHref] = useState(chat.href);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("home-hero");
    if (!hero) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.intersectionRatio < 0.05),
      { threshold: [0, 0.05] },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleUpdate(event: Event) {
      const detail = (event as CustomEvent<LiveRequestDetail>).detail;
      if (detail?.href) {
        setChatHref(detail.href);
      }
    }

    window.addEventListener("live-direct-request:update", handleUpdate);
    return () => window.removeEventListener("live-direct-request:update", handleUpdate);
  }, []);

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-amber-900/10 bg-white/95 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-2xl backdrop-blur transition duration-300 md:hidden ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="grid grid-cols-2 gap-3">
        <a
          href={call.href}
          className="inline-flex min-h-12 items-center justify-center break-words rounded-full border border-amber-900/15 bg-white px-5 text-sm font-black uppercase tracking-[0.08em] text-stone-800 shadow-md transition hover:-translate-y-0.5 hover:bg-amber-50"
        >
          {call.label}
        </a>
        <a
          href={chatHref}
          className="break-words inline-flex min-h-12 items-center justify-center rounded-full bg-green-600 px-6 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-700"
        >
          {chat.label}
        </a>
      </div>
    </div>
  );
}
