"use client";

import { useEffect } from "react";

type ClarificationResponse = {
  clarification?: string;
  error?: string;
};

export default function LessonClarificationEnhancer({ revisionId }: { revisionId: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`[data-lesson-clarification-root="${revisionId}"]`);
    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-clarifiable][data-clarification-key]"),
    );
    const cleanups: Array<() => void> = [];

    for (const target of targets) {
      if (target.closest("details")) continue;
      if (target.dataset.clarificationReady === "true") continue;

      const blockKey = target.dataset.clarificationKey?.trim() ?? "";
      if (!blockKey) continue;

      target.dataset.clarificationReady = "true";

      const controls = document.createElement("div");
      controls.className = "mt-3";

      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "inline-flex min-h-11 items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-[16px] font-extrabold text-blue-800 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-[17px]";
      button.textContent = "?  Εξήγησέ το πιο απλά";
      button.setAttribute("aria-expanded", "false");

      const panel = document.createElement("div");
      panel.className = "mt-3 hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-5";
      panel.setAttribute("role", "status");
      panel.setAttribute("aria-live", "polite");

      let loaded = false;
      let loading = false;

      const onClick = async () => {
        if (loaded) {
          const willOpen = panel.classList.contains("hidden");
          panel.classList.toggle("hidden");
          button.setAttribute("aria-expanded", String(willOpen));
          button.textContent = willOpen ? "−  Κλείσιμο διευκρίνισης" : "?  Εξήγησέ το πιο απλά";
          return;
        }
        if (loading) return;

        loading = true;
        button.disabled = true;
        button.textContent = "Γίνεται πιο απλό…";
        panel.classList.remove("hidden");
        panel.innerHTML = '<p class="text-[17px] font-semibold leading-8 text-slate-600 sm:text-[18px]">Ετοιμάζω μια πιο απλή εξήγηση με βάση αυτό το μάθημα…</p>';
        button.setAttribute("aria-expanded", "true");

        try {
          const response = await fetch(`/mixalis/api/lesson-revisions/${revisionId}/clarify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ blockKey }),
          });

          const payload = (await response.json()) as ClarificationResponse;
          if (!response.ok || !payload.clarification) {
            throw new Error(payload.error || "Δεν ήταν δυνατή η διευκρίνιση.");
          }

          panel.replaceChildren();

          const title = document.createElement("p");
          title.className = "text-[17px] font-black text-blue-950 sm:text-[18px]";
          title.textContent = "Διευκρίνιση";

          const answer = document.createElement("p");
          answer.className = "mt-2 whitespace-pre-line text-[18px] leading-8 text-slate-800 sm:text-[20px] sm:leading-9";
          answer.textContent = payload.clarification;

          panel.append(title, answer);
          loaded = true;
          button.textContent = "−  Κλείσιμο διευκρίνισης";
        } catch (error) {
          panel.replaceChildren();
          const message = document.createElement("p");
          message.className = "text-[17px] font-semibold leading-8 text-rose-800";
          message.textContent = error instanceof Error ? error.message : "Δεν ήταν δυνατή η διευκρίνιση.";
          panel.append(message);
          button.textContent = "?  Προσπάθησε ξανά";
        } finally {
          loading = false;
          button.disabled = false;
        }
      };

      button.addEventListener("click", onClick);
      controls.append(button, panel);
      target.insertAdjacentElement("afterend", controls);

      cleanups.push(() => {
        button.removeEventListener("click", onClick);
        controls.remove();
        delete target.dataset.clarificationReady;
      });
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [revisionId]);

  return null;
}
