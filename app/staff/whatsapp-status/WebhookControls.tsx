"use client";

import { useState } from "react";

type State = "idle" | "working" | "success" | "error";

export default function WebhookControls() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function configureWebhook() {
    if (state === "working") return;
    setState("working");
    setMessage("");

    try {
      const response = await fetch("/api/staff/whatsapp/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "configure_webhook" }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        throw new Error(data?.providerResponse?.error || data?.message || `HTTP ${response.status}`);
      }

      setState("success");
      setMessage(`Webhook ενεργό: ${data.webhookUrl || "chioshotel.gr"}`);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Δεν ήταν δυνατή η ενεργοποίηση του webhook.");
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-bold">360dialog webhook</h2>
          <p className="mt-1 text-sm text-stone-600">
            Ενεργοποίησέ το μία φορά για να καταγράφονται Delivered, Read, Failed και Stop offers.
          </p>
        </div>
        <button
          type="button"
          onClick={configureWebhook}
          disabled={state === "working"}
          className="min-h-11 rounded-xl bg-stone-900 px-5 py-2 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-50"
        >
          {state === "working" ? "Ενεργοποίηση…" : "Ενεργοποίηση webhook"}
        </button>
      </div>
      {message ? (
        <p className={`mt-3 rounded-xl p-3 text-sm font-semibold ${state === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          {message}
        </p>
      ) : null}
    </section>
  );
}
