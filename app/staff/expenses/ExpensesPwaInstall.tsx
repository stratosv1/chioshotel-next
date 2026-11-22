"use client";

import { Download, Share2, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallPlatform = "ios" | "android" | "other";

function runsStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function ExpensesPwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<InstallPlatform>("other");
  const [installed, setInstalled] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setInstalled(runsStandalone());
    setDismissed(window.sessionStorage.getItem("expenses-pwa-install-dismissed-v2") === "1");

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker
        .register("/staff-expenses-sw.js", {
          scope: "/staff/expenses/",
        })
        .catch(() => undefined);
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform("ios");
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    }

    function captureInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setInstalled(false);
    }

    function markInstalled() {
      setInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    window.addEventListener("appinstalled", markInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
      window.removeEventListener("appinstalled", markInstalled);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === "accepted") {
        setInstalled(true);
      }
    } catch {
      setInstallPrompt(null);
    }
  }

  function dismiss() {
    window.sessionStorage.setItem("expenses-pwa-install-dismissed-v2", "1");
    setDismissed(true);
  }

  if (installed || dismissed) {
    return null;
  }

  const fallbackInstructions =
    platform === "ios"
      ? "Στο Safari πάτησε Κοινή χρήση και μετά «Προσθήκη στην οθόνη Αφετηρίας»."
      : platform === "android"
        ? "Στο Chrome πάτησε ⋮ και «Εγκατάσταση εφαρμογής» ή «Προσθήκη στην αρχική οθόνη». Σε Xiaomi, Redmi ή POCO, αν δεν εμφανιστεί το εικονίδιο: Ρυθμίσεις → Εφαρμογές → Chrome → Δικαιώματα → άνοιξε τις «Συντομεύσεις αρχικής οθόνης» και δοκίμασε ξανά."
        : "Άνοιξε το μενού του browser και επίλεξε «Εγκατάσταση εφαρμογής» ή «Προσθήκη στην αρχική οθόνη».";

  return (
    <aside
      className="mb-4 rounded-[1.5rem] border border-[#c7bff7] bg-[#f4f1ff] p-3.5 shadow-sm"
      aria-label="Εγκατάσταση εφαρμογής"
    >
      <div className="flex items-start gap-3">
        <div
          className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#5443c9] text-white shadow-sm"
          aria-hidden="true"
        >
          <Smartphone className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#5443c9]">
            Εφαρμογή κινητού
          </p>
          <h2 className="mt-0.5 text-base font-black text-[#1f2a3c]">
            Βάλε τα Έξοδα στην αρχική οθόνη
          </h2>
          <p className="mt-1 text-sm font-medium leading-5 text-[#4b5b70]">
            {installPrompt
              ? "Θα ανοίγει αυτόνομα, γρήγορα και χωρίς τα κουμπιά του browser."
              : fallbackInstructions}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="grid size-10 shrink-0 place-items-center rounded-full text-[#5b6b80] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5443c9]"
          aria-label="Απόκρυψη πρότασης εγκατάστασης"
        >
          <X className="size-4" />
        </button>
      </div>

      {installPrompt ? (
        <button
          type="button"
          onClick={() => void installApp()}
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#5443c9] px-4 text-base font-black text-white shadow-md shadow-stone-300/40 transition active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5443c9]"
        >
          <Download className="size-5" />
          Εγκατάσταση εφαρμογής
        </button>
      ) : (
        <div className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#c7bff7] bg-white px-4 text-center text-sm font-extrabold text-[#3b2f8a]">
          <Share2 className="size-5 shrink-0" />
          {platform === "ios" ? "Κοινή χρήση → Προσθήκη στην οθόνη" : "Chrome → ⋮ → Προσθήκη στην αρχική"}
        </div>
      )}
    </aside>
  );
}
