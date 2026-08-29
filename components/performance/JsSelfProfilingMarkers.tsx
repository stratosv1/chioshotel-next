"use client";

import { useEffect } from "react";

type MarkerName = "script" | "gc" | "style" | "layout" | "paint" | "other" | "unknown";

type ProfilerSample = {
  marker?: string;
  timestamp?: number;
  stackId?: number;
};

type ProfilerTrace = {
  samples?: ProfilerSample[];
};

type ProfilerInstance = {
  stop: () => Promise<ProfilerTrace>;
};

type ProfilerConstructor = new (options: {
  sampleInterval: number;
  maxBufferSize: number;
}) => ProfilerInstance;

type ProfilingWindow = Window &
  typeof globalThis & {
    Profiler?: ProfilerConstructor;
  };

const PROFILE_SAMPLE_RATE = 0.1;
const PROFILE_DURATION_MS = 4_000;
const PROFILE_SAMPLE_INTERVAL_MS = 10;
const PROFILE_MAX_SAMPLES = 500;
const PROFILE_SESSION_KEY = "vh_js_profile_markers_v1";
const PROFILE_SESSION_DECIDED_VALUE = "decided";
const ANALYTICS_CONSENT_KEY = "vh_cookie_consent_v1";
const MIN_CHROME_MAJOR = 153;

const KNOWN_MARKERS = new Set<MarkerName>([
  "script",
  "gc",
  "style",
  "layout",
  "paint",
  "other",
]);

function chromeMajorVersion(): number | null {
  const match = navigator.userAgent.match(/(?:Chrome|Chromium)\/(\d+)/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function hasAnalyticsConsent(): boolean {
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

function profileAlreadyDecided(): boolean {
  try {
    return window.sessionStorage.getItem(PROFILE_SESSION_KEY) === PROFILE_SESSION_DECIDED_VALUE;
  } catch {
    // If storage is unavailable, avoid profiling rather than repeatedly sampling.
    return true;
  }
}

function markProfileDecided(): boolean {
  try {
    window.sessionStorage.setItem(PROFILE_SESSION_KEY, PROFILE_SESSION_DECIDED_VALUE);
    return true;
  } catch {
    return false;
  }
}

function countMarkers(samples: ProfilerSample[]): Record<MarkerName, number> {
  const counts: Record<MarkerName, number> = {
    script: 0,
    gc: 0,
    style: 0,
    layout: 0,
    paint: 0,
    other: 0,
    unknown: 0,
  };

  for (const sample of samples) {
    const marker = typeof sample.marker === "string" ? sample.marker.toLowerCase() : "unknown";
    if (KNOWN_MARKERS.has(marker as MarkerName)) {
      counts[marker as MarkerName] += 1;
    } else {
      counts.unknown += 1;
    }
  }

  return counts;
}

function postSummary(payload: Record<string, unknown>) {
  void fetch("/api/performance/js-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "same-origin",
    keepalive: true,
  }).catch(() => {
    // Performance telemetry must never affect the user experience.
  });
}

export function JsSelfProfilingMarkers() {
  useEffect(() => {
    const chromeMajor = chromeMajorVersion();
    if (!chromeMajor || chromeMajor < MIN_CHROME_MAJOR) return;

    let cancelled = false;
    let startTimer: number | null = null;
    let stopTimer: number | null = null;
    let activeProfiler: ProfilerInstance | null = null;

    const stopAndReport = async () => {
      const profiler = activeProfiler;
      activeProfiler = null;
      if (!profiler) return;

      try {
        const trace = await profiler.stop();
        if (cancelled || !hasAnalyticsConsent()) return;

        const samples = Array.isArray(trace.samples) ? trace.samples : [];
        const navigation = performance.getEntriesByType("navigation")[0] as
          | PerformanceNavigationTiming
          | undefined;

        postSummary({
          version: 1,
          path: window.location.pathname,
          chromeMajor,
          durationMs: PROFILE_DURATION_MS,
          sampleIntervalMs: PROFILE_SAMPLE_INTERVAL_MS,
          sampleCount: samples.length,
          markers: countMarkers(samples),
          crossOriginIsolated: globalThis.crossOriginIsolated === true,
          navigationType: navigation?.type ?? "unknown",
        });
      } catch {
        // Unsupported/aborted profiler sessions are intentionally silent.
      }
    };

    const startProfiler = () => {
      if (cancelled || document.visibilityState !== "visible") return;
      if (!hasAnalyticsConsent() || profileAlreadyDecided()) return;

      const ProfilerCtor = (window as ProfilingWindow).Profiler;
      if (!ProfilerCtor) return;

      // One sampling decision per browser session. If sessionStorage cannot record
      // that decision, fail closed and do not profile.
      if (!markProfileDecided()) return;
      if (Math.random() >= PROFILE_SAMPLE_RATE) return;

      try {
        activeProfiler = new ProfilerCtor({
          sampleInterval: PROFILE_SAMPLE_INTERVAL_MS,
          maxBufferSize: PROFILE_MAX_SAMPLES,
        });
      } catch {
        return;
      }

      stopTimer = window.setTimeout(() => {
        void stopAndReport();
      }, PROFILE_DURATION_MS);
    };

    const scheduleProfiler = () => {
      startTimer = window.setTimeout(startProfiler, 2_000);
    };

    if (document.readyState === "complete") {
      scheduleProfiler();
    } else {
      window.addEventListener("load", scheduleProfiler, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", scheduleProfiler);
      if (startTimer !== null) window.clearTimeout(startTimer);
      if (stopTimer !== null) window.clearTimeout(stopTimer);
      if (activeProfiler) {
        void activeProfiler.stop().catch(() => undefined);
        activeProfiler = null;
      }
    };
  }, []);

  return null;
}
