"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export const COLORS = {
  ink: "#2c2825",
  muted: "#6b625b",
  velocity: "#0f8b8d",
  accel: "#e0731f",
  force: "#8a5a3c",
  mandarin: "#c9822f",
  danger: "#c0392b",
  ok: "#2e8b57",
  grid: "#e7dfd4",
  track: "#b9ab9b",
  paper: "#fbf8f3",
};

export const G = 10;

/** Greek number formatting (decimal comma). */
export function fmt(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("el-GR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

/** Play/pause state that starts paused for people who prefer reduced motion. */
export function usePlaying(initial = true) {
  const [playing, setPlaying] = useState(initial);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
    }
  }, []);
  return [playing, setPlaying] as const;
}

/**
 * Animation clock in seconds. Only ticks while playing and while the
 * attached element is on screen, so off-screen widgets cost nothing.
 */
export function useClock(playing: boolean, speed = 1) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useRef(true);
  const [t, setT] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      if (visible.current) setT((x) => x + dt * speed);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  return { ref, t, setT };
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 3,
  head = 10,
  dashed = false,
  opacity = 1,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
  head?: number;
  dashed?: boolean;
  opacity?: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1.5) return null;
  const ux = dx / len;
  const uy = dy / len;
  const h = Math.min(head, len * 0.6);
  const bx = x2 - ux * h;
  const by = y2 - uy * h;
  const px = -uy * h * 0.55;
  const py = ux * h * 0.55;
  return (
    <g opacity={opacity}>
      <line
        x1={x1}
        y1={y1}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <polygon points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} />
    </g>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  color = COLORS.mandarin,
}: {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  display: ReactNode;
  color?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-[#4d4138]">{label}</span>
        <span className="font-mono text-sm font-semibold tabular-nums" style={{ color }}>
          {display}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer"
        style={{ accentColor: color }}
      />
    </label>
  );
}

export function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-[#2c2825] text-white shadow-sm"
          : "border border-black/10 bg-white text-[#4d4138] hover:bg-[#f3efe8]"
      }`}
    >
      {children}
    </button>
  );
}

export function PlayButton({
  playing,
  onToggle,
  onReset,
}: {
  playing: boolean;
  onToggle: () => void;
  onReset?: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onToggle}
        className="rounded-full bg-[#c9822f] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b37226]"
      >
        {playing ? "❚❚ Παύση" : "▶ Κίνηση"}
      </button>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-semibold text-[#4d4138] transition hover:bg-[#f3efe8]"
        >
          ↺ Από την αρχή
        </button>
      ) : null}
    </div>
  );
}

export function Stat({
  label,
  value,
  unit,
  color = COLORS.ink,
  hint,
}: {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  color?: string;
  hint?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] px-4 py-3">
      <p className="text-xs font-semibold text-[#857261]">{label}</p>
      <p className="mt-1 font-mono text-xl font-semibold tabular-nums" style={{ color }}>
        {value}
        {unit ? <span className="ml-1 text-sm font-medium text-[#857261]">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-xs leading-5 text-[#7a7068]">{hint}</p> : null}
    </div>
  );
}

export function Formula({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-lg bg-[#2c2825] px-2.5 py-1 font-mono text-sm font-semibold text-white">
      {children}
    </span>
  );
}

export function Legend({ items }: { items: { color: string; label: string; dashed?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6b625b]">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <svg width="22" height="8" aria-hidden="true">
            <line
              x1="1"
              y1="4"
              x2="21"
              y2="4"
              stroke={item.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={item.dashed ? "4 3" : undefined}
            />
          </svg>
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function Note({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "ok";
  title?: ReactNode;
  children: ReactNode;
}) {
  const styles = {
    info: "border-[#c9822f]/30 bg-[#fdf3e6] text-[#5f4630]",
    warn: "border-[#c0392b]/25 bg-[#fdeeec] text-[#7a2c22]",
    ok: "border-[#2e8b57]/25 bg-[#ecf7f0] text-[#245c3d]",
  }[tone];
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${styles}`}>
      {title ? <p className="font-semibold">{title}</p> : null}
      <div>{children}</div>
    </div>
  );
}
