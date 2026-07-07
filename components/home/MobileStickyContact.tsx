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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-amber-900/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a
          href={call.href}
          className="break-words inline-flex min-h-12 items-center justify-center rounded-full border border-emerald-950 bg-emerald-950 px-6 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-900"
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
