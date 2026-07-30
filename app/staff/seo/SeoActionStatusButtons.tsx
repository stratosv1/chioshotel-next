"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeoActionStatusButtons({ actionKey, status }: { actionKey: string; status: "recommended" | "implemented" | "dismissed" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function update(nextStatus: "recommended" | "implemented" | "dismissed") {
    setBusy(true);
    try {
      const response = await fetch("/api/staff/seo/actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ actionKey, status: nextStatus }),
      });
      if (!response.ok) throw new Error("Action update failed");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "implemented" && (
        <button type="button" disabled={busy} onClick={() => update("implemented")} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 disabled:opacity-50">Υλοποιήθηκε</button>
      )}
      {status !== "recommended" && (
        <button type="button" disabled={busy} onClick={() => update("recommended")} className="rounded-full border border-[#d8c8b1] bg-white px-3 py-1.5 text-xs font-semibold text-[#6f6051] disabled:opacity-50">Ξανά σε παρακολούθηση</button>
      )}
      {status !== "dismissed" && (
        <button type="button" disabled={busy} onClick={() => update("dismissed")} className="rounded-full border border-[#e4d7c4] bg-[#faf7f1] px-3 py-1.5 text-xs font-semibold text-[#8a755f] disabled:opacity-50">Δεν θα γίνει</button>
      )}
    </div>
  );
}
