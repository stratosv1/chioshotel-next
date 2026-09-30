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
        ? "Αν είσαι μέσα σε άλλη εφαρμογή, άνοιξε τη σελίδα στο Chrome. Μετά πάτησε ⋮ και «Προσθήκη στην αρχική οθόνη»."
        : "Άνοιξε το μενού του browser και επίλεξε «Εγκατάσταση εφαρμογής» ή «Προσθήκη στην αρχική οθόνη».";

  return (
    <aside
      className="mb-4 rounded-[1.5rem] border border-[#d8c4ae] bg-[#fffaf4] p-3.5 shadow-sm"
      aria-label="Εγκατάσταση εφαρμογής"
    >
      <div className="flex items-start gap-3">
        <div
          className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#805536] text-white shadow-sm"
          aria-hidden="true"
        >
          <Smartphone className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#a86f35]">
            Εφαρμογή κινητού
          </p>
          <h2 className="mt-0.5 text-base font-black text-[#49392f]">
            Βάλε τα Έξοδα στην αρχική οθόνη
          </h2>
          <p className="mt-1 text-sm font-medium leading-5 text-stone-600">
            {installPrompt
              ? "Θα ανοίγει αυτόνομα, γρήγορα και χωρίς τα κουμπιά του browser."
              : fallbackInstructions}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="grid size-10 shrink-0 place-items-center rounded-full text-stone-500 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#805536]"
          aria-label="Απόκρυψη πρότασης εγκατάστασης"
        >
          <X className="size-4" />
        </button>
      </div>

      {installPrompt ? (
        <button
          type="button"
          onClick={() => void installApp()}
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#805536] px-4 text-base font-black text-white shadow-md shadow-stone-300/40 transition active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#805536]"
        >
          <Download className="size-5" />
          Εγκατάσταση εφαρμογής
        </button>
      ) : (
        <div className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#d8c4ae] bg-white px-4 text-center text-sm font-extrabold text-[#684a35]">
          <Share2 className="size-5 shrink-0" />
          {platform === "ios" ? "Κοινή χρήση → Προσθήκη στην οθόνη" : "Chrome → ⋮ → Προσθήκη στην αρχική"}
        </div>
      )}
    </aside>
  );
}
