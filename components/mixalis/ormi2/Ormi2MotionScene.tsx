"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward, Turtle } from "lucide-react";
import type { Scenario } from "@/components/mixalis/ormi/OrmiPhaseQuiz";
import { BASE_STORIES } from "@/components/mixalis/ormi/sintheta/stories";
import { EXTRA_STORIES } from "@/components/mixalis/ormi/sintheta/extra-stories";
import { H, W, C } from "@/components/mixalis/ormi/kit";
import type { Story } from "@/components/mixalis/ormi/sintheta/story";

/**
 * The 36 quiz exercises and the existing 36 hand-authored SVG motion stories
 * describe the SAME exercise in the SAME order. Keep the explicit ids to guard
 * against silent scene substitution if either source is later reordered.
 *
 * All 36 mappings are checked against the quiz titles and story titles in
 * scripts/qa-ormi2-motion.cjs during EVERY production build.
 */
export const SCENE_IDS = [
  "bullet-floor", "ballistic", "pendulum-hit", "table-edge", "bounce",
  "two-pendulums", "slide-hit-slide", "shell-top", "loop", "incline",
  "spring-ramp", "depth-slide", "car-wall", "circle-table", "cart-jump",
  "air-collision", "hanging-explosion", "pass-slide", "pass-edge",
  "recoil-brake", "elastic-ramp", "three-chain", "plank", "sand-cart",
  "oblique-bounce", "rate-top", "rod-loop", "xt-graph", "same-speed",
  "many-bullets", "explosive-collision", "circle-track", "elastic-slides",
  "ramp-hit-slide", "tension-angle", "rocket-split",
] as const;

const ALL_STORIES: Story[] = [...BASE_STORIES, ...EXTRA_STORIES];
const STORIES = new Map<string, Story>(SCENE_IDS.map((id, i) => [id, ALL_STORIES[i]]));

const NORMAL_DURATION_MS = 6600;
const SLOW_DURATION_MS = 12500;

export function Ormi2MotionScene({ scenario }: { scenario: Scenario }) {
  const story = STORIES.get(scenario.id);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const seek = (value: number) => {
    const next = Math.min(1, Math.max(0, value));
    progressRef.current = next;
    setProgress(next);
  };

  // Start a single cycle only when this scene actually enters the viewport.
  // Respect the OS-level reduced-motion preference.
  useEffect(() => {
    if (typeof window === "undefined" || !stageRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.3)) {
        setPlaying(true);
        setHasAutoPlayed(true);
        observer.disconnect();
      }
    }, { threshold: [0.3, 0.6] });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let previous: number | null = null;
    const tick = (timestamp: number) => {
      if (previous === null) previous = timestamp;
      const delta = Math.min(75, Math.max(0, timestamp - previous));
      previous = timestamp;
      const duration = slow ? SLOW_DURATION_MS : NORMAL_DURATION_MS;
      const next = Math.min(1, progressRef.current + delta / duration);
      progressRef.current = next;
      setProgress(next);
      if (next >= 1) { setPlaying(false); return; }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [playing, slow]);

  function togglePlayback() {
    if (playing) {
      setPlaying(false);
    } else {
      if (progressRef.current >= 0.999) seek(0);
      setPlaying(true);
      setHasAutoPlayed(true);
    }
  }

  function restart() {
    seek(0);
    setPlaying(true);
    setHasAutoPlayed(true);
  }

  if (!story) {
    return <p role="alert" className="o2-fb warn">Δεν βρέθηκε το κινούμενο σχήμα για αυτή την άσκηση.</p>;
  }

  const displayPercent = Math.round(progress * 100);

  return (
    <div ref={stageRef} className="o2-bench">
      <div className="o2-bench-head">
        <span><b>Το φαινόμενο</b> · {story.what}</span>
        <span>{playing ? "Σε κίνηση" : hasAutoPlayed ? "Σε παύση" : "Έτοιμο"}</span>
      </div>
      <svg
        viewBox={"0 0 " + W + " " + H}
        className="o2-cv"
        role="img"
        aria-label={"Κινούμενο φυσικό σχήμα: " + scenario.title + ", σημείο " + displayPercent + "%"}
        fontFamily="Commissioner, 'Segoe UI', Roboto, Arial, sans-serif"
      >
        {story.draw(progress, { mode: "play", phase: -1 })}
      </svg>
      <div className="o2-ctrls">
        <button type="button" onClick={togglePlayback} className="o2-btn pri">
          {playing ? <Pause size={16} /> : <Play size={16} />}
          {playing ? "Παύση" : progress >= 1 ? "Ξανά" : "Κίνηση"}
        </button>
        <input
          id={"ormi2-motion-" + scenario.id}
          type="range"
          min="0" max="1000" step="1"
          value={Math.round(progress * 1000)}
          onChange={(event) => { setPlaying(false); seek(Number(event.target.value) / 1000); }}
          aria-label={"Στιγμή κίνησης για " + scenario.title}
        />
        <output htmlFor={"ormi2-motion-" + scenario.id}>{displayPercent}%</output>
        <span className="o2-seg">
          <button type="button" onClick={() => { setPlaying(false); seek(progressRef.current - 0.1); }}
            aria-label="Δέκα τοις εκατό πίσω στην κίνηση" className="o2-btn sm"><SkipBack size={15}/></button>
          <button type="button" onClick={() => { setPlaying(false); seek(progressRef.current + 0.1); }}
            aria-label="Δέκα τοις εκατό μπροστά στην κίνηση" className="o2-btn sm"><SkipForward size={15}/></button>
          <button type="button" onClick={restart} aria-label="Από την αρχή" className="o2-btn sm"><RotateCcw size={15}/></button>
          <button type="button" aria-pressed={slow} onClick={() => setSlow((v) => !v)} className="o2-btn sm"><Turtle size={15}/> ½×</button>
        </span>
      </div>
      <div className="o2-readout">
        <span style={{ color: C.v }}>━ ταχύτητα</span>{"   "}
        <span style={{ color: C.F }}>━ δύναμη</span>{"   "}
        <span style={{ color: C.p }}>━ ορμή</span>
        <span className="o2-muted"> · σχηματικό, όχι σε χρονική κλίμακα. Οι νόμοι είναι δική σου επιλογή.</span>
      </div>
    </div>
  );
}
