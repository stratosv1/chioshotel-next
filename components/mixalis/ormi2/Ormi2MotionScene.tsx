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
    return <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      Δεν βρέθηκε το κινούμενο σχήμα για αυτή την άσκηση.
    </p>;
  }

  const displayPercent = Math.round(progress * 100);

  return (
    <div ref={stageRef} className="mt-5 overflow-hidden rounded-2xl border border-[#cbded2] bg-[#f7faf7]">
      <div className="flex flex-wrap items-start justify-between gap-2 px-4 pb-1 pt-4 sm:px-5">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#237357]">
            Κινούμενη αναπαράσταση · Σενάριο {story.n}/36
          </p>
          <p className="mt-1 text-sm leading-6 text-[#3d5f4f]">
            {story.what}
          </p>
        </div>
        <span className="rounded-full bg-[#e3f1e7] px-3 py-1 text-xs font-semibold text-[#2a654c]">
          {playing ? "Σε κίνηση" : hasAutoPlayed ? "Σε παύση" : "Έτοιμο για αναπαραγωγή"}
        </span>
      </div>

      <div className="mx-2 my-2 overflow-hidden rounded-xl border border-[#e4e9e3] bg-[#fbfaf7] sm:mx-4">
        <svg
          viewBox={"0 0 " + W + " " + H}
          className="block w-full"
          role="img"
          aria-label={"Κινούμενο φυσικό σχήμα: " + scenario.title + ", σημείο " + displayPercent + "%"}
          fontFamily="Inter, 'Segoe UI', Roboto, Arial, sans-serif"
        >
          {story.draw(progress, { mode: "play", phase: -1 })}
        </svg>
      </div>

      <div className="px-4 pb-4 sm:px-5">
        <label htmlFor={"ormi2-motion-" + scenario.id} className="flex items-center justify-between gap-3 text-xs font-semibold text-[#476e5a]">
          <span>Χρονογραμμή κίνησης — σύρε για να εξετάσεις κάθε στιγμή</span>
          <span className="shrink-0 tabular-nums">{displayPercent}%</span>
        </label>
        <input
          id={"ormi2-motion-" + scenario.id}
          type="range"
          min="0" max="1000" step="1"
          value={Math.round(progress * 1000)}
          onChange={(event) => { setPlaying(false); seek(Number(event.target.value) / 1000); }}
          className="mt-2 h-2 w-full cursor-pointer accent-[#24765b]"
          aria-label={"Στιγμή κίνησης για " + scenario.title}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={togglePlayback}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#206a52] px-4 py-2 text-sm font-semibold text-white hover:bg-[#19523e]">
            {playing ? <Pause size={17} /> : <Play size={17} />}
            {playing ? "Παύση" : progress >= 1 ? "Δες ξανά την κίνηση" : "Κίνηση"}
          </button>
          <button type="button" onClick={() => { setPlaying(false); seek(progressRef.current - 0.1); }}
            aria-label="Δέκα τοις εκατό πίσω στην κίνηση"
            className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-[#ccd9ce] bg-white px-3 py-2 text-xs font-semibold text-[#425c4d]">
            <SkipBack size={17}/> Πίσω
          </button>
          <button type="button" onClick={() => { setPlaying(false); seek(progressRef.current + 0.1); }}
            aria-label="Δέκα τοις εκατό μπροστά στην κίνηση"
            className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-[#ccd9ce] bg-white px-3 py-2 text-xs font-semibold text-[#425c4d]">
            <SkipForward size={17}/> Μπροστά
          </button>
          <button type="button" onClick={restart}
            className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-[#ccd9ce] bg-white px-3 py-2 text-xs font-semibold text-[#425c4d]">
            <RotateCcw size={16}/> Αρχή
          </button>
          <button type="button" aria-pressed={slow} onClick={() => setSlow((v) => !v)}
            className={"inline-flex min-h-11 items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold " +
              (slow ? "border-[#206a52] bg-[#e1f2e8] text-[#14523d]" : "border-[#ccd9ce] bg-white text-[#425c4d]")}>
            <Turtle size={16}/> Αργά
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-[#637b6c]">
          <span><span className="mr-1 inline-block h-[3px] w-5 align-middle" style={{backgroundColor:C.v}}/>Ταχύτητα</span>
          <span><span className="mr-1 inline-block h-[3px] w-5 align-middle" style={{backgroundColor:C.F}}/>Δύναμη</span>
          <span><span className="mr-1 inline-block h-[3px] w-5 align-middle" style={{backgroundColor:C.p}}/>Ορμή</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#688071]">
          Το σχήμα δείχνει τη φυσική εξέλιξη της συγκεκριμένης άσκησης, όχι κίνηση σε ακριβή χρονική κλίμακα. Οι νόμοι και η στρατηγική παραμένουν δική σου επιλογή στα επόμενα βήματα.
        </p>
      </div>
    </div>
  );
}
