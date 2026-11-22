"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Κινούμενα σχέδια και πειράματα για τη Φυσική του Σιδέρη (Κεφ. 2, χρόνος).
// Όλα σέβονται το prefers-reduced-motion μέσω των κλάσεων sx-* του tailwind.css.

const fmt = (n: number, d = 2) => n.toLocaleString("el-GR", { maximumFractionDigits: d });
const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

function useRaf(on: boolean, cb: (dt: number) => void) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      ref.current((t - last) / 1000);
      last = t;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [on]);
}

function Card({ title, children, tone = "violet" }: { title: string; children: ReactNode; tone?: "violet" | "blue" | "orange" | "green" }) {
  const c = {
    violet: "border-[#6b3fa0]/25 bg-[#f7f2fd] text-[#55307f]",
    blue: "border-[#1d5a8c]/25 bg-[#eef5fb] text-[#1d5a8c]",
    orange: "border-[#c96a2b]/30 bg-[#fff7ef] text-[#a2531f]",
    green: "border-[#3d6b3a]/25 bg-[#eef6ec] text-[#2c5229]",
  }[tone];
  return (
    <div className={`rounded-3xl border-2 p-4 shadow-sm sm:p-6 ${c}`}>
      <h3 className="mb-3 text-lg font-bold">🎮 {title}</h3>
      <div className="text-[#2c2825]">{children}</div>
    </div>
  );
}

const btn =
  "min-h-[44px] rounded-2xl px-4 py-2 text-base font-bold shadow-sm transition active:scale-95 disabled:opacity-40 disabled:active:scale-100";

// ───────────────────────────── γρήγορο ρολόι ─────────────────────────────
export function FastClock() {
  const [t, setT] = useState(10 * 3600 + 10 * 60); // 10:10:00
  const [speed, setSpeed] = useState(1);
  const [on, setOn] = useState(true);
  useRaf(on, (dt) => setT((x) => (x + dt * speed) % (12 * 3600)));
  const sec = (t % 60) * 6;
  const min = ((t / 60) % 60) * 6;
  const hr = ((t / 3600) % 12) * 30;
  const hand = (deg: number, len: number, w: number, color: string) => (
    <line x1="100" y1="100" x2="100" y2={100 - len} stroke={color} strokeWidth={w} strokeLinecap="round" transform={`rotate(${deg} 100 100)`} />
  );
  return (
    <Card title="Το γρήγορο ρολόι: δες πώς «δένουν» οι μονάδες" tone="blue">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <svg viewBox="0 0 200 200" className="h-56 w-56 shrink-0" aria-label="Αναλογικό ρολόι">
          <circle cx="100" cy="100" r="94" fill="white" stroke="#2c2825" strokeWidth="5" />
          {Array.from({ length: 60 }, (_, i) => (
            <line
              key={i}
              x1="100"
              y1="10"
              x2="100"
              y2={i % 5 ? 15 : 22}
              stroke={i % 5 ? "#b9aea3" : "#2c2825"}
              strokeWidth={i % 5 ? 1.5 : 3}
              transform={`rotate(${i * 6} 100 100)`}
            />
          ))}
          {[12, 3, 6, 9].map((n, i) => (
            <text key={n} x={100 + 62 * Math.sin((i * Math.PI) / 2)} y={106 - 62 * Math.cos((i * Math.PI) / 2)} textAnchor="middle" fontSize="16" fontWeight="700" fill="#2c2825">
              {n}
            </text>
          ))}
          {hand(hr, 48, 7, "#2c2825")}
          {hand(min, 70, 5, "#1d5a8c")}
          {hand(sec, 80, 2, "#d32f2f")}
          <circle cx="100" cy="100" r="6" fill="#d32f2f" />
        </svg>
        <div className="w-full space-y-3">
          <p className="rounded-2xl bg-[#2c2825] px-4 py-2 text-center font-mono text-3xl font-bold tabular-nums text-[#7ee0a1]">
            {pad(t / 3600 || 12)}:{pad((t / 60) % 60)}:{pad(t % 60)}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              [1, "κανονικά"],
              [60, "× 60 πιο γρήγορα"],
              [3600, "× 3600 πιο γρήγορα"],
            ].map(([s, l]) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s as number)}
                className={`${btn} ${speed === s ? "bg-[#1d5a8c] text-white" : "bg-white text-[#1d5a8c]"}`}
              >
                {l}
              </button>
            ))}
            <button type="button" onClick={() => setOn((x) => !x)} className={`${btn} bg-white text-[#2c2825]`}>
              {on ? "⏸" : "▶"}
            </button>
          </div>
          <p className="text-[15px] leading-7">
            <span className="font-bold text-[#d32f2f]">Κόκκινος</span> δείκτης: δευτερόλεπτα. Όταν κάνει <b>έναν γύρο (60 s)</b>, ο{" "}
            <span className="font-bold text-[#1d5a8c]">μπλε</span> λεπτοδείκτης πάει <b>1 λεπτό</b> μπροστά. Όταν ο μπλε κάνει έναν
            γύρο (60 min), ο <b>μαύρος</b> ωροδείκτης πάει <b>1 ώρα</b>.
          </p>
          <p className="text-sm text-[#6b625b]">Πάτα «× 60» και δες τον μπλε να τρέχει όσο έτρεχε πριν ο κόκκινος!</p>
        </div>
      </div>
    </Card>
  );
}

// ───────────────────────────── η σκάλα των μονάδων ─────────────────────────────
const STEPS = [
  { u: "h", name: "ώρες" },
  { u: "min", name: "λεπτά" },
  { u: "s", name: "δευτερόλεπτα" },
];
const START_VALUE = 2;

export function UnitStairs() {
  const [level, setLevel] = useState(0);
  const [value, setValue] = useState(START_VALUE);
  const [last, setLast] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const go = (dir: 1 | -1) => {
    const next = level + dir;
    if (next < 0 || next > 2) return;
    const v = dir === 1 ? value * 60 : value / 60;
    setLast(
      dir === 1
        ? `${fmt(value)} ${STEPS[level].u} × 60 = ${fmt(v)} ${STEPS[next].u}`
        : `${fmt(value)} ${STEPS[level].u} : 60 = ${fmt(v)} ${STEPS[next].u}`,
    );
    setValue(v);
    setLevel(next);
    setBump((b) => b + 1);
  };
  const reset = (v: number) => {
    setValue(v);
    setLevel(0);
    setLast(null);
    setBump((b) => b + 1);
  };
  return (
    <Card title="Η σκάλα των μονάδων" tone="violet">
      <p className="mb-3 text-[15px] leading-7">
        Κατεβαίνεις σκαλί → <b>× 60</b> (τα κομμάτια γίνονται μικρότερα, άρα βγαίνουν περισσότερα). Ανεβαίνεις σκαλί → <b>: 60</b>.
      </p>
      <div className="relative mx-auto mt-2 h-60 w-full max-w-md">
        {STEPS.map((s, i) => (
          <div
            key={s.u}
            className={`absolute flex items-end justify-center rounded-t-xl pb-2 text-lg font-black text-white transition ${
              i === level ? "bg-[#6b3fa0]" : "bg-[#b79ad6]"
            }`}
            style={{ left: `${i * 33.33}%`, width: "33.33%", bottom: 0, height: `${(3 - i) * 24 + 4}%` }}
          >
            {s.u}
          </div>
        ))}
        <div
          className="absolute text-4xl transition-all duration-700 ease-out"
          style={{ left: `calc(${level * 33.33 + 16.66}% - 1.1rem)`, bottom: `${(3 - level) * 24 + 4}%` }}
          aria-hidden
        >
          ⚽
        </div>
      </div>
      <p key={bump} className="sx-bounce mt-3 block text-center text-3xl font-black text-[#55307f]">
        {fmt(value)} {STEPS[level].name}
      </p>
      {last ? <p className="mt-1 text-center font-mono text-[15px] text-[#4d4138]">{last}</p> : null}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button type="button" disabled={level === 0} onClick={() => go(-1)} className={`${btn} bg-white text-[#55307f]`}>
          ⬆ Ανέβα (: 60)
        </button>
        <button type="button" disabled={level === 2} onClick={() => go(1)} className={`${btn} bg-[#6b3fa0] text-white`}>
          ⬇ Κατέβα (× 60)
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-[#6b625b]">Ξεκίνα από:</span>
        {[1, 2, 0.5, 3].map((v) => (
          <button key={v} type="button" onClick={() => reset(v)} className="min-h-[44px] rounded-xl border border-black/10 bg-white px-3 font-semibold">
            {fmt(v)} h
          </button>
        ))}
      </div>
    </Card>
  );
}

// ───────────────────────────── ποδήλατο: στιγμή και διάρκεια ─────────────────────────────
function Bike() {
  return (
    <svg viewBox="0 0 60 36" className="h-10 w-16" aria-hidden>
      <circle cx="12" cy="26" r="9" fill="none" stroke="#2c2825" strokeWidth="3" />
      <circle cx="48" cy="26" r="9" fill="none" stroke="#2c2825" strokeWidth="3" />
      <path d="M12 26 L24 12 L38 12 L48 26 M24 12 L30 26 L38 12 M30 26 L12 26" fill="none" stroke="#d32f2f" strokeWidth="3" strokeLinejoin="round" />
      <path d="M22 9 L28 9 M38 12 L40 6 L45 6" stroke="#2c2825" strokeWidth="3" strokeLinecap="round" />
      <circle cx="30" cy="3" r="3" fill="#1d5a8c" />
    </svg>
  );
}

export function BikeTimeline() {
  const TRIP = 25; // λεπτά
  const [p, setP] = useState(0);
  const [on, setOn] = useState(false);
  useRaf(on, (dt) =>
    setP((x) => {
      const n = Math.min(1, x + dt / 5);
      if (n >= 1) setOn(false);
      return n;
    }),
  );
  const minutes = Math.round(p * TRIP);
  const clock = `10:${pad(minutes)}`;
  return (
    <Card title="Ο Σιδέρης με το ποδήλατο, από το σπίτι στον Καρφά" tone="green">
      <div className="relative mt-2 h-28 overflow-hidden rounded-2xl bg-gradient-to-b from-[#cfe9ff] to-[#eaf6ff]">
        <div className="absolute inset-x-0 bottom-0 h-8 bg-[#8d8d8d]" />
        <div className="absolute inset-x-0 bottom-3.5 h-1 bg-[repeating-linear-gradient(90deg,white_0_18px,transparent_18px_36px)]" />
        <span className="absolute bottom-9 left-2 text-3xl">🏠</span>
        <span className="absolute bottom-9 right-2 text-3xl">🏖️</span>
        <div className="absolute bottom-6 transition-none" style={{ left: `${10 + p * 66}%` }}>
          <Bike />
        </div>
      </div>
      <div className="relative mt-3 h-14">
        <div className="absolute left-[10%] right-[10%] top-5 h-3 rounded-full bg-[#dfd8cf]" />
        <div className="absolute left-[10%] top-5 h-3 rounded-full bg-[#3d6b3a]" style={{ width: `${p * 80}%` }} />
        <span className="absolute left-[10%] top-0 -translate-x-1/2 rounded-md bg-white px-1.5 text-xs font-bold text-[#2c5229] shadow">t₁ = 10:00</span>
        <span
          className={`absolute right-[10%] top-0 translate-x-1/2 rounded-md bg-white px-1.5 text-xs font-bold text-[#2c5229] shadow transition ${
            p >= 1 ? "opacity-100" : "opacity-30"
          }`}
        >
          t₂ = 10:25
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-2xl bg-[#2c2825] px-4 py-2 font-mono text-2xl font-bold tabular-nums text-[#7ee0a1]">{clock}</span>
        <button
          type="button"
          onClick={() => {
            if (p >= 1) setP(0);
            setOn((x) => !x);
          }}
          className={`${btn} bg-[#3d6b3a] text-white`}
        >
          {on ? "⏸ Στάσου" : p >= 1 ? "↻ Ξανά" : "▶ Ξεκίνα"}
        </button>
      </div>
      <div className="mt-3 space-y-1 text-[15px] leading-7">
        <p>
          🕙 <b>Χρονική στιγμή</b> = μία ένδειξη του ρολογιού (ΠΟΤΕ). Τώρα: <b>{clock}</b>
        </p>
        <p>
          ⏳ <b>Χρονική διάρκεια</b> = πόσος χρόνος πέρασε (ΠΟΣΟ). Μέχρι τώρα: <b>{minutes} min</b>
        </p>
        {p >= 1 ? (
          <p className="sx-pop rounded-xl bg-white px-3 py-2 font-bold text-[#2c5229]">Δt = t₂ − t₁ = 10:25 − 10:00 = 25 min 🎉</p>
        ) : null}
      </div>
    </Card>
  );
}

// ───────────────────────────── ηλιακό ρολόι ─────────────────────────────
export function Sundial() {
  const [h, setH] = useState(9);
  const a = ((h - 6) / 12) * Math.PI; // 0 = ανατολή (αριστερά), π = δύση
  const sx = 100 - 80 * Math.cos(a);
  const sy = 95 - 75 * Math.sin(a);
  // σκιά: αντίθετα από τον ήλιο
  const len = 30 + 40 * (1 - Math.sin(a));
  const shx = 100 + len * Math.cos(a);
  return (
    <Card title="Ηλιακό ρολόι: σύρε τον ήλιο" tone="orange">
      <svg viewBox="0 0 200 130" className="mx-auto w-full max-w-sm" aria-label="Ηλιακό ρολόι">
        <path d="M20 95 A80 75 0 0 1 180 95" fill="none" stroke="#f0d6b8" strokeDasharray="4 4" />
        <circle cx={sx} cy={sy} r="11" fill="#ffb300" className="sx-pulse" />
        <ellipse cx="100" cy="110" rx="80" ry="16" fill="#efe4d6" stroke="#c9b8a4" />
        <line x1="100" y1="110" x2={shx} y2={110} stroke="#6b5c4e" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
        <path d="M100 110 L100 80 L110 110 Z" fill="#8a7563" />
      </svg>
      <input
        type="range"
        min={7}
        max={19}
        step={0.25}
        value={h}
        onChange={(e) => setH(Number(e.target.value))}
        className="mt-2 w-full accent-[#c96a2b]"
        aria-label="Ώρα της ημέρας"
      />
      <p className="mt-2 text-[15px] leading-7">
        Η σκιά της στήλης γυρίζει όσο κινείται ο ήλιος. Δείχνει περίπου <b>{Math.floor(h)}:{h % 1 ? pad((h % 1) * 60) : "00"}</b>, αλλά μόνο
        «περίπου». Και χωρίς ήλιο δεν δουλεύει καθόλου! 🌧️ Άρα έχει <b>πολύ μικρή ακρίβεια</b>.
      </p>
    </Card>
  );
}

// ───────────────────────────── κλεψύδρα ─────────────────────────────
export function Hourglass() {
  const [run, setRun] = useState(0);
  return (
    <Card title="Κλεψύδρα" tone="orange">
      <div className="flex items-center gap-5">
        <svg key={run} viewBox="0 0 80 120" className="h-36 w-24 shrink-0" aria-label="Κλεψύδρα">
          <rect x="6" y="2" width="68" height="8" rx="3" fill="#8a5a3c" />
          <rect x="6" y="110" width="68" height="8" rx="3" fill="#8a5a3c" />
          <path d="M14 10 L66 10 L44 58 L44 62 L66 110 L14 110 L36 62 L36 58 Z" fill="#fffaf3" stroke="#8a7563" strokeWidth="2" />
          <clipPath id="sx-hg-top">
            <path d="M14 10 L66 10 L44 58 L36 58 Z" />
          </clipPath>
          <clipPath id="sx-hg-bot">
            <path d="M36 62 L44 62 L66 110 L14 110 Z" />
          </clipPath>
          <rect x="0" y="10" width="80" height="48" fill="#e2b26a" clipPath="url(#sx-hg-top)" className="sx-sand-top" />
          <rect x="0" y="62" width="80" height="48" fill="#e2b26a" clipPath="url(#sx-hg-bot)" className="sx-sand-bot" />
          <line x1="40" y1="56" x2="40" y2="108" stroke="#e2b26a" strokeWidth="2" strokeDasharray="3 3" className="sx-sand-stream" />
        </svg>
        <div className="space-y-2 text-[15px] leading-7">
          <p>
            Η άμμος (ή το νερό) πέφτει από μια μικρή τρύπα. Όταν αδειάσει το πάνω μέρος, έχει περάσει πάντα <b>ο ίδιος χρόνος</b>.
          </p>
          <p>Στην αρχαία Αθήνα μετρούσαν πόσο θα μιλήσει ο καθένας στο δικαστήριο. Σήμερα τη βλέπεις στο σκάκι.</p>
          <button type="button" onClick={() => setRun((r) => r + 1)} className={`${btn} bg-[#c96a2b] text-white`}>
            🔄 Γύρνα την ανάποδα
          </button>
        </div>
      </div>
    </Card>
  );
}

// ───────────────────────────── photo finish ─────────────────────────────
export function PhotoFinish() {
  const [p, setP] = useState(0);
  const [on, setOn] = useState(false);
  useRaf(on, (dt) =>
    setP((x) => {
      const n = Math.min(1, x + dt / 3.2);
      if (n >= 1) setOn(false);
      return n;
    }),
  );
  const done = p >= 1;
  const runner = (color: string, label: string, lag: number) => (
    <div className="relative h-12 border-b border-dashed border-white/50">
      <div
        className="absolute top-1.5 grid h-9 w-9 place-items-center rounded-full text-sm font-black text-white shadow-md"
        style={{ left: `calc(${Math.min(1, p * (1 - lag))} * (89% - 2.5rem))`, background: color }}
      >
        {label}
      </div>
    </div>
  );
  return (
    <Card title="Ποιος κέρδισε; Τα 100 μέτρα στο στάδιο" tone="blue">
      <div className="relative overflow-hidden rounded-2xl bg-[#c0583a] px-2">
        {runner("#1d5a8c", "Α", 0)}
        {runner("#3d6b3a", "Β", 0.004)}
        <div className="absolute inset-y-0 right-[11%] w-1.5 bg-[repeating-linear-gradient(0deg,white_0_8px,#222_8px_16px)]" />
      </div>
      <button
        type="button"
        onClick={() => {
          setP(0);
          setOn(true);
        }}
        className={`${btn} mt-3 bg-[#1d5a8c] text-white`}
      >
        {done ? "↻ Ξανά ο αγώνας" : "▶ Πάμε!"}
      </button>
      {done ? (
        <div className="sx-pop mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-3">
            <p className="text-sm font-bold text-[#6b625b]">Χρονόμετρο που δείχνει μόνο δευτερόλεπτα</p>
            <p className="font-mono text-xl">Α: 10 s · Β: 10 s</p>
            <p className="font-bold text-[#a2531f]">🤷 Ισοπαλία; Δεν ξέρουμε!</p>
          </div>
          <div className="rounded-2xl bg-white p-3">
            <p className="text-sm font-bold text-[#6b625b]">Ψηφιακό με εκατοστά του δευτερολέπτου</p>
            <p className="font-mono text-xl">Α: 10,52 s · Β: 10,53 s</p>
            <p className="font-bold text-[#2c5229]">🏆 Νίκησε ο Α, για 1 εκατοστό!</p>
          </div>
        </div>
      ) : null}
      {done ? (
        <p className="mt-3 text-[15px] leading-7">
          Η <b>μικρότερη μονάδα</b> (εκατοστό του δευτερολέπτου) έδωσε <b>μεγαλύτερη ακρίβεια</b>. Γι' αυτό στους αγώνες ταχύτητας
          χρησιμοποιούν ψηφιακά χρονόμετρα.
        </p>
      ) : null}
    </Card>
  );
}

// ───────────────────────────── χρονόμετρο αντανακλαστικών + μέση τιμή ─────────────────────────────
export function ReactionGame() {
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const [tries, setTries] = useState<number[]>([]);
  useRaf(running, (dt) => setT((x) => x + dt));
  const toggle = () => {
    if (!running) {
      setT(0);
      setRunning(true);
    } else {
      setRunning(false);
      setTries((x) => [...x, Math.round(t * 100) / 100].slice(-5));
    }
  };
  const sum = tries.reduce((a, b) => a + b, 0);
  const mean = tries.length ? sum / tries.length : null;
  const lo = 4;
  const hi = 6;
  const pos = (v: number) => `${Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100))}%`;
  return (
    <Card title="Πείραμα: σταμάτα το χρονόμετρο ακριβώς στα 5,00 s" tone="orange">
      <p className="mb-3 text-[15px] leading-7">
        Κάνε <b>5 προσπάθειες</b>, Σιδέρη. Θα δεις ότι κάθε φορά βγαίνει λίγο αλλιώς. Το λάθος δεν είναι του ρολογιού, είναι του
        χεριού και του ματιού μας. Αυτό λέγεται <b>υποκειμενικός παράγοντας</b>.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <span className="rounded-2xl bg-[#2c2825] px-5 py-3 font-mono text-4xl font-bold tabular-nums text-[#ffb36b]">
          {(running ? t.toFixed(1) : t.toFixed(2)).replace(".", ",")}
        </span>
        <button type="button" onClick={toggle} className={`${btn} px-8 text-lg text-white ${running ? "bg-[#b33a3a]" : "bg-[#3d6b3a]"}`}>
          {running ? "■ Stop" : "▶ Start"}
        </button>
      </div>
      {tries.length ? (
        <div className="mt-5">
          <div className="relative mx-2 h-16">
            <div className="absolute inset-x-0 top-8 h-1 rounded bg-[#dfd8cf]" />
            {[4, 4.5, 5, 5.5, 6].map((v) => (
              <span key={v} className="absolute top-11 -translate-x-1/2 text-xs text-[#857a70]" style={{ left: pos(v) }}>
                {fmt(v, 1)}
              </span>
            ))}
            <span className="absolute top-2 -translate-x-1/2 text-xs font-bold text-[#2c5229]" style={{ left: pos(5) }}>
              🎯
            </span>
            {tries.map((v, i) => (
              <span key={i} className="sx-pop absolute top-6 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white bg-[#c96a2b] shadow" style={{ left: pos(v) }} />
            ))}
            {mean !== null ? (
              <span
                className="absolute top-3 h-11 w-1 -translate-x-1/2 rounded bg-[#6b3fa0] transition-all duration-500"
                style={{ left: pos(mean) }}
                title="μέση τιμή"
              />
            ) : null}
          </div>
          <p className="mt-2 text-[15px] leading-7">
            Οι μετρήσεις σου: <b>{tries.map((x) => fmt(x)).join(" · ")}</b> s
          </p>
          <p className="text-[15px] leading-7">
            <span className="font-bold text-[#6b3fa0]">▍Μέση τιμή</span> = {fmt(sum)} : {tries.length} = <b>{fmt(mean!)} s</b>
          </p>
          <p className="text-sm text-[#6b625b]">Η μωβ γραμμή είναι η μέση τιμή: πέφτει στη μέση των τελειών σου.</p>
          <button type="button" onClick={() => setTries([])} className="mt-1 min-h-[44px] text-sm font-semibold text-[#a2531f]">
            ↻ Καθάρισε
          </button>
        </div>
      ) : null}
    </Card>
  );
}

// ───────────────────────────── εκκρεμές ─────────────────────────────
export function Pendulum() {
  const [count, setCount] = useState(0);
  const [on, setOn] = useState(true);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setCount((c) => c + 1), 2000);
    return () => clearInterval(id);
  }, [on]);
  return (
    <Card title="Το εκκρεμές της τάξης (πλαστελίνη σε νήμα)" tone="violet">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <svg viewBox="0 0 200 190" className="h-52 w-52 shrink-0" aria-label="Απλό εκκρεμές που ταλαντώνεται">
          <rect x="40" y="6" width="120" height="8" rx="3" fill="#857261" />
          <path d="M37 148 Q100 172 163 148" fill="none" stroke="#cfc6bc" strokeDasharray="4 4" />
          <text x="28" y="150" fontSize="15" fontWeight="700" fill="#857261">
            Α
          </text>
          <text x="95" y="186" fontSize="15" fontWeight="700" fill="#857261">
            Ο
          </text>
          <text x="164" y="150" fontSize="15" fontWeight="700" fill="#857261">
            Γ
          </text>
          <g className={on ? "sx-swing" : ""} style={{ transformOrigin: "100px 14px" }}>
            <line x1="100" y1="14" x2="100" y2="150" stroke="#2c2825" strokeWidth="2" />
            <circle cx="100" cy="158" r="12" fill="#c2185b" />
          </g>
        </svg>
        <div className="w-full space-y-2 text-[15px] leading-7">
          <p>
            Πηγαίνει <b>Α → Ο → Γ → Ο → Α</b> ξανά και ξανά, πάντα ίδια. Μία τέτοια πήγαινε-έλα λέγεται <b>μία ταλάντωση</b>.
          </p>
          <p className="rounded-2xl bg-white px-4 py-3 text-center">
            <span className="block text-sm text-[#6b625b]">ταλαντώσεις</span>
            <span key={count} className="sx-bounce text-4xl font-black text-[#6b3fa0]">
              {count}
            </span>
          </p>
          <button type="button" onClick={() => setOn((x) => !x)} className={`${btn} bg-white text-[#2c2825]`}>
            {on ? "⏸ Σταμάτα" : "▶ Συνέχισε"}
          </button>
        </div>
      </div>
    </Card>
  );
}

// ───────────────────────────── μάντεψε πρώτα ─────────────────────────────
export function Predict({ q, choices, answer, reveal }: { q: string; choices: string[]; answer: number; reveal: ReactNode }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="rounded-3xl bg-[#2c2825] p-5 text-white shadow-md">
      <p className="mb-1 text-sm font-bold uppercase tracking-[0.14em] text-[#ffb36b]">🤔 Μάντεψε πρώτα</p>
      <p className="mb-3 text-[17px] leading-8">{q}</p>
      <div className="flex flex-wrap gap-2">
        {choices.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPick(i)}
            className={`min-h-[44px] rounded-2xl border-2 px-4 py-2 text-base font-semibold transition active:scale-95 ${
              pick === null
                ? "border-white/30 bg-white/10 hover:bg-white/20"
                : i === answer
                  ? "border-[#7ee0a1] bg-[#7ee0a1]/20"
                  : pick === i
                    ? "border-[#ffb36b] bg-[#ffb36b]/15"
                    : "border-white/15 opacity-60"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {pick !== null ? (
        <div className="sx-pop mt-3 rounded-2xl bg-white/10 p-3 text-[16px] leading-7">
          <p className="font-bold">{pick === answer ? "🎉 Μπράβο, το βρήκες!" : "😮 Σχεδόν! Δες:"}</p>
          <div className="mt-1">{reveal}</div>
        </div>
      ) : null}
    </div>
  );
}

// ───────────────────────────── βήμα-βήμα ─────────────────────────────
export function Stepper({ title, steps }: { title: ReactNode; steps: { label: string; body: ReactNode }[] }) {
  const [n, setN] = useState(1);
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <p className="mb-1 text-sm font-bold uppercase tracking-[0.14em] text-[#3d6b3a]">✍️ Λυμένο παράδειγμα</p>
      <p className="mb-3 text-[17px] font-medium leading-8">{title}</p>
      <ol className="space-y-2">
        {steps.slice(0, n).map((s, i) => (
          <li key={i} className="sx-pop flex gap-3 rounded-2xl bg-[#f7f4ef] p-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#3d6b3a] text-sm font-bold text-white">{i + 1}</span>
            <div className="text-[16px] leading-7">
              <span className="font-bold text-[#3d6b3a]">{s.label}: </span>
              {s.body}
            </div>
          </li>
        ))}
      </ol>
      {n < steps.length ? (
        <button type="button" onClick={() => setN((x) => x + 1)} className={`${btn} mt-3 bg-[#3d6b3a] text-white`}>
          Δείξε το επόμενο βήμα →
        </button>
      ) : (
        <button type="button" onClick={() => setN(1)} className="mt-3 min-h-[44px] text-sm font-semibold text-[#3d6b3a]">
          ↻ Από την αρχή
        </button>
      )}
    </div>
  );
}

// ───────────────────────────── κάρτες ─────────────────────────────
export function Flashcards({ cards }: { cards: { front: string; back: ReactNode }[] }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const c = cards[i];
  const move = (d: number) => {
    setFlip(false);
    setI((x) => (x + d + cards.length) % cards.length);
  };
  return (
    <div className="mx-auto max-w-md">
      <button type="button" onClick={() => setFlip((f) => !f)} className="block w-full [perspective:1000px]" aria-label="Γύρνα την κάρτα">
        <div
          className="relative h-56 w-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: flip ? "rotateY(180deg)" : "none" }}
        >
          <div className="absolute inset-0 grid place-items-center rounded-3xl bg-gradient-to-br from-[#6b3fa0] to-[#9c6fd1] p-6 text-center text-2xl font-black text-white shadow-lg [backface-visibility:hidden]">
            {c.front}
            <span className="absolute bottom-3 text-xs font-semibold opacity-80">πάτα για να γυρίσει 🔄</span>
          </div>
          <div className="absolute inset-0 grid place-items-center rounded-3xl bg-white p-6 text-center text-lg leading-8 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div>{c.back}</div>
          </div>
        </div>
      </button>
      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={() => move(-1)} className={`${btn} bg-white text-[#6b3fa0]`}>
          ← Πίσω
        </button>
        <span className="text-sm font-semibold text-[#6b625b]">
          {i + 1} / {cards.length}
        </span>
        <button type="button" onClick={() => move(1)} className={`${btn} bg-[#6b3fa0] text-white`}>
          Επόμενη →
        </button>
      </div>
    </div>
  );
}

// ───────────────────────────── πρόοδος ─────────────────────────────
type Mark = "done" | "star" | null;
const KEY = (id: string) => `sideris-fysiki-k2-${id}`;
const EVT = "sideris-fysiki-progress";

function readMark(id: string): Mark {
  try {
    return (localStorage.getItem(KEY(id)) as Mark) ?? null;
  } catch {
    return null;
  }
}

export function SectionDone({ id }: { id: string }) {
  const [m, setM] = useState<Mark>(null);
  useEffect(() => setM(readMark(id)), [id]);
  const set = (v: Mark) => {
    const next = m === v ? null : v;
    setM(next);
    try {
      if (next) localStorage.setItem(KEY(id), next);
      else localStorage.removeItem(KEY(id));
      window.dispatchEvent(new Event(EVT));
    } catch {
      /* χωρίς αποθήκευση */
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => set("done")} className={`${btn} ${m === "done" ? "bg-[#3d6b3a] text-white" : "bg-white text-[#3d6b3a]"}`}>
        ✓ Το έμαθα
      </button>
      <button type="button" onClick={() => set("star")} className={`${btn} ${m === "star" ? "bg-[#e2a400] text-white" : "bg-white text-[#a27500]"}`}>
        ★ Να το ξαναδώ
      </button>
    </div>
  );
}

export function PlanTracker({ items }: { items: { id: string; title: string; minutes: number; important?: boolean }[] }) {
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  useEffect(() => {
    const load = () => setMarks(Object.fromEntries(items.map((x) => [x.id, readMark(x.id)])));
    load();
    window.addEventListener(EVT, load);
    return () => window.removeEventListener(EVT, load);
  }, [items]);
  const done = items.filter((x) => marks[x.id] === "done").length;
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-bold">Η πρόοδός σου</p>
        <span className="text-sm font-semibold text-[#3d6b3a]">
          {done}/{items.length} ✓
        </span>
      </div>
      <div className="mb-4 h-3 overflow-hidden rounded-full bg-[#eee7de]">
        <div className="h-full rounded-full bg-gradient-to-r from-[#6b3fa0] to-[#3d6b3a] transition-all duration-700" style={{ width: `${(done / items.length) * 100}%` }} />
      </div>
      <ul className="space-y-2">
        {items.map((x) => (
          <li key={x.id}>
            <a href={`#${x.id}`} className="flex min-h-[44px] items-center gap-3 rounded-2xl bg-[#f7f4ef] px-3 py-2 hover:bg-[#efe8de]">
              <span className="w-6 text-center text-lg">{marks[x.id] === "done" ? "✅" : marks[x.id] === "star" ? "⭐" : "⬜"}</span>
              <span className="flex-1 font-semibold">{x.title}</span>
              {x.important ? <span className="rounded-full bg-[#fce4ec] px-2 py-0.5 text-xs font-bold text-[#c2185b]">για το τεστ!</span> : null}
              <span className="text-sm text-[#857a70]">{x.minutes}′</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
