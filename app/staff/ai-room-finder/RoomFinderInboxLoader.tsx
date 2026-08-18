"use client";

import { useEffect, useState } from "react";
import type { RoomFinderInboxData } from "@/lib/ai-assistant/conversation-store";
import RoomFinderInboxClient from "./RoomFinderInboxClient";

export default function RoomFinderInboxLoader() {
  const [data, setData] = useState<RoomFinderInboxData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const sessionId = new URLSearchParams(window.location.search).get("session");
        const query = sessionId ? `?session=${encodeURIComponent(sessionId)}` : "";
        const response = await fetch(`/api/staff/ai-room-finder${query}`, {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (response.status === 401) {
          throw new Error("Authentication required.");
        }
        if (!response.ok) {
          throw new Error("Could not load AI Room Finder conversations.");
        }

        const payload = (await response.json()) as RoomFinderInboxData;
        if (!cancelled) setData(payload);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Could not load AI Room Finder conversations.");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f3eb] px-4 py-8 text-stone-900">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-5">
          <h1 className="text-lg font-black">AI Room Finder Inbox</h1>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#f7f3eb] px-4 py-8 text-stone-900">
        <div className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-white p-5 text-sm font-semibold text-stone-600">
          Φόρτωση AI Room Finder Inbox…
        </div>
      </main>
    );
  }

  return <RoomFinderInboxClient initialData={data} />;
}
