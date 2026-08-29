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

    try {
      if (window.sessionStorage.getItem(PROFILE_SESSION_KEY) === "sampled") return;
    } catch {
      // Session storage is an optimization only.
    }

    if (Math.random() >= PROFILE_SAMPLE_RATE) return;

    try {
      window.sessionStorage.setItem(PROFILE_SESSION_KEY, "sampled");
    } catch {
      // Continue without session deduplication when storage is unavailable.
    }

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
        if (cancelled) return;

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

      const ProfilerCtor = (window as ProfilingWindow).Profiler;
      if (!ProfilerCtor) return;

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
