"use client";

import { useEffect, useMemo, useState } from "react";
import { AIRoomFinder } from "@/components/ai/AIRoomFinder";

type SearchState = {
  checkin?: string;
  checkout?: string;
  guests?: number;
};

type Offer = {
  directTotal?: number;
  nights?: number;
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}

export function AIRoomFinderSummary() {
  const [search, setSearch] = useState<SearchState>({});
  const [lowestTotal, setLowestTotal] = useState<number | null>(null);

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init);
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

      if (url.includes("/api/ai-assistant/smart")) {
        void response.clone().json().then((payload) => {
          if (payload?.search) setSearch(payload.search);
          const offers: Offer[] = Array.isArray(payload?.offers) ? payload.offers : [];
          const totals = offers
            .map((offer) => Number(offer.directTotal || 0))
            .filter((value) => Number.isFinite(value) && value > 0);
          setLowestTotal(totals.length ? Math.min(...totals) : null);
        }).catch(() => undefined);
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const isVisible = Boolean(search.checkin || search.checkout || search.guests);
  const totalLabel = useMemo(() => {
    if (lowestTotal === null) return null;
    return new Intl.NumberFormat("el-GR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(lowestTotal);
  }, [lowestTotal]);

  return (
    <div className="relative">
      <AIRoomFinder />

      {isVisible ? (
        <aside className="fixed inset-x-3 bottom-3 z-[80] rounded-2xl border border-stone-200 bg-white/95 p-3 shadow-2xl backdrop-blur sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-24 sm:w-72 sm:p-4" aria-label="Σύνοψη αναζήτησης">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">Η διαμονή σας</p>
              <p className="mt-1 text-sm font-semibold text-stone-900">
                {formatDate(search.checkin)} → {formatDate(search.checkout)}
              </p>
              <p className="mt-0.5 text-xs text-stone-600">
                {search.guests ? `${search.guests} επισκέπτες` : "Αναμονή για επισκέπτες"}
              </p>
            </div>
            {totalLabel ? (
              <div className="text-right">
                <p className="text-[10px] text-stone-500">από</p>
                <p className="text-lg font-black text-[#43551b]">{totalLabel}</p>
              </div>
            ) : null}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
