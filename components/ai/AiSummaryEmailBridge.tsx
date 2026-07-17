"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const TARGET_EMAIL = "chioshotel@gmail.com";

function parseMailto(href: string) {
  const url = new URL(href);
  return {
    to: decodeURIComponent(url.pathname),
    subject: url.searchParams.get("subject") || "Αίτημα διαμονής από AI Room Finder",
    message: url.searchParams.get("body") || "",
  };
}

export function AiSummaryEmailBridge() {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    async function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>(`a[href^="mailto:${TARGET_EMAIL}"]`);
      if (!link) return;

      event.preventDefault();
      if (status === "sending") return;

      const { subject, message } = parseMailto(link.href);
      setStatus("sending");

      try {
        const response = await fetch("/api/ai-assistant/summary-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, message }),
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.ok) {
          throw new Error(payload?.error || "Email send failed");
        }

        setStatus("sent");
      } catch (error) {
        console.error("AI summary email send error:", error);
        setStatus("error");
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [status]);

  if (status === "idle") return null;

  const message =
    status === "sending"
      ? "Το μήνυμα αποστέλλεται…"
      : status === "sent"
        ? "Το μήνυμα εστάλη. Σύντομα η reception θα επικοινωνήσει μαζί σας."
        : "Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά σε λίγο.";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-4 bottom-5 z-[1000] mx-auto max-w-md rounded-2xl border px-4 py-4 text-center text-sm font-semibold shadow-2xl ${
        status === "sent"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : status === "error"
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-stone-200 bg-white text-stone-800"
      }`}
    >
      {message}
    </div>
  );
}
