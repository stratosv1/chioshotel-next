"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Ball, C, Ground, T, Vec } from "../kit";

/**
 * «Πάμε παραπέρα» για τη σύνθετη 5 (owner, 2026-11-21): μπάλα με 3 αναπηδήσεις,
 * κινούμενο σχέδιο + ζωντανό διάγραμμα p–t + δύναμη σε κάθε στιγμή, και
 * ερωτήματα α–ι με σειρά, το καθένα με «Δείξε τη στιγμή».
 * m = 0,2 kg, h₁ = 1,8 m, επαφή 0,05 s, κάθε κρούση κρατά τα 2/3 της ταχύτητας.
 */

const m = 0.2;
const g = 10;
const DT = 0.05;
const E = 2 / 3;

type Seg = { kind: "air" | "contact"; real: number; anim: number; v0: number; v1: number; y0: number; label: string; say: string; n?: number };

function buildSegs(): Seg[] {
  const out: Seg[] = [];
  let v = 6;
  out.push({ kind: "air", real: 0.6, anim: 1.6, v0: 0, v1: -6, y0: 1.8, label: "Πτώση", say: "Πέφτει ελεύθερα. Μόνη δύναμη το βάρος: ΣF = −mg = −2 N. Άρα η ορμή μειώνεται σταθερά: dp/dt = −2 kg·m/s² (ευθεία με κλίση −2 στο διάγραμμα)." });
  for (let i = 1; i <= 3; i++) {
    const u = v * E;
    const dp = m * (u + v);
    const F = dp / DT;
    out.push({
      kind: "contact",
      real: DT,
      anim: 1.3,
      v0: -v,
      v1: u,
      y0: 0,
      n: i,
      label: `${i}η κρούση`,
      say: `Επαφή 0,05 s. Η ορμή πηδά από ${fmt(-m * v)} σε +${fmt(m * u)} kg·m/s: Δp = +${fmt(dp)}. ΣF = Δp/Δt = ${fmt(F)} N, άρα N = ΣF + mg = ${fmt(F + 2)} N (${fmt((F + 2) / 2)} φορές το βάρος). Στο διάγραμμα: σχεδόν κατακόρυφο άλμα.`,
    });
    const tUp = u / g;
    out.push({ kind: "air", real: tUp, anim: tUp * 2.6, v0: u, v1: 0, y0: 0, label: `Άνοδος ${i}`, say: `Ανεβαίνει με ${fmt(u)} m/s ως ύψος ${fmt((u * u) / (2 * g))} m. Πάλι μόνο βάρος: ίδια κλίση −2 στο διάγραμμα. Χάθηκε το ${fmt(100 * (1 - E * E))}% της κινητικής στην κρούση.` });
    if (i < 3) out.push({ kind: "air", real: tUp, anim: tUp * 2.6, v0: 0, v1: -u, y0: (u * u) / (2 * g), label: `Κάθοδος ${i + 1}`, say: "Ξαναπέφτει από το ψηλότερο σημείο: ίδια κλίση −mg. Φτάνει κάτω με την ταχύτητα που είχε στην άνοδο." });
    v = u;
  }
  return out;
}

function fmt(x: number) {
  const r = Math.round(x * 100) / 100;
  return String(r).replace(".", ",").replace("-", "−");
}

export const SEGS = buildSegs();
export const ANIM_TOTAL = SEGS.reduce((s, x) => s + x.anim, 0);
export const REAL_TOTAL = SEGS.reduce((s, x) => s + x.real, 0);

type State = { real: number; y: number; v: number; seg: number; f: number };

export function atAnim(a: number): State {
  let acc = 0;
  let racc = 0;
  for (let i = 0; i < SEGS.length; i++) {
    const s = SEGS[i];
    if (a <= acc + s.anim || i === SEGS.length - 1) {
      const f = Math.max(0, Math.min(1, (a - acc) / s.anim));
      return stateIn(i, f, racc);
    }
    acc += s.anim;
    racc += s.real;
  }
  return stateIn(0, 0, 0);
}

function atReal(t: number): State {
  let racc = 0;
  for (let i = 0; i < SEGS.length; i++) {
    const s = SEGS[i];
    if (t <= racc + s.real || i === SEGS.length - 1) return stateIn(i, Math.max(0, Math.min(1, (t - racc) / s.real)), racc);
    racc += s.real;
  }
  return stateIn(0, 0, 0);
}

function stateIn(i: number, f: number, racc: number): State {
  const s = SEGS[i];
  const t = f * s.real;
  const v = s.v0 + (s.v1 - s.v0) * f;
  const y = s.kind === "contact" ? 0 : Math.max(0, s.y0 + s.v0 * t - 0.5 * g * t * t);
  return { real: racc + t, y, v, seg: i, f };
}

function animForReal(t: number) {
  let acc = 0;
  let racc = 0;
  for (const s of SEGS) {
    if (t <= racc + s.real) return acc + ((t - racc) / s.real) * s.anim;
    acc += s.anim;
    racc += s.real;
  }
  return ANIM_TOTAL;
}

/* ───── drawing geometry ───── */
const VW = 720;
const VH = 270;
const GROUND = 238;
const HS = 100; // px per metre
const BX = 110;
const GX0 = 268;
const GX1 = 706;
const SX = (GX1 - GX0) / 2.05;
const P0 = 128;
const PS = 72;
const px = (t: number) => GX0 + t * SX;
const py = (p: number) => P0 - p * PS;

const PATH = (() => {
  const pts: string[] = [];
  const N = 500;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * REAL_TOTAL;
    const s = atReal(t);
    pts.push(`${i ? "L" : "M"}${px(t).toFixed(1)},${py(m * s.v).toFixed(1)}`);
  }
  return pts.join(" ");
})();

const CONTACT_T = (() => {
  const out: number[] = [];
  let r = 0;
  for (const s of SEGS) {
    if (s.kind === "contact") out.push(r + s.real / 2);
    r += s.real;
  }
  return out;
})();

type Q = { k: string; q: string; tool: string; at: number; a: React.ReactNode };

const QUESTIONS: Q[] = [
  {
    k: "α",
    q: "Με ποια ταχύτητα φτάνει στο έδαφος την πρώτη φορά;",
    tool: "ΑΔΜΕ",
    at: 0.599,
    a: (
      <>
        Πέφτει ελεύθερα 1,8 m: mgh₁ = ½mυ₁² ⇒ <b>υ₁ = 6 m/s</b> (κάτω).
      </>
    ),
  },
  {
    k: "β",
    q: "Με ποια ταχύτητα φεύγει από το έδαφος μετά την 1η κρούση; (ανεβαίνει ως 0,8 m)",
    tool: "ΑΔΜΕ",
    at: 0.651,
    a: (
      <>
        Από το ύψος της ανόδου, ανάποδα: ½mυ₂² = mgh₂ ⇒ <b>υ₂ = 4 m/s</b> (πάνω).
      </>
    ),
  },
  {
    k: "γ",
    q: "Ορμή πριν, ορμή μετά και μεταβολή ορμής στην 1η κρούση.",
    tool: "Ορμή με πρόσημα",
    at: 0.625,
    a: (
      <>
        Θετικά προς τα <b>πάνω</b>. p_πριν = 0,2·(−6) = −1,2 · p_μετά = 0,2·(+4) = +0,8. <b>Δp = p_μετά − p_πριν = 0,8 − (−1,2) = +2 kg·m/s</b>. Γι' αυτό
        «προστίθενται» οι ταχύτητες: αλλάζει φορά.
      </>
    ),
  },
  {
    k: "δ",
    q: "Μέση δύναμη από το έδαφος στην 1η κρούση. Πόσες φορές το βάρος είναι;",
    tool: "ΣF = Δp/Δt",
    at: 0.625,
    a: (
      <>
        ΣF = 2/0,05 = 40 N. Αυτή είναι η συνισταμένη: N − mg = 40 ⇒ <b>N = 42 N</b> = <b>21 φορές</b> το βάρος (2 N).
      </>
    ),
  },
  {
    k: "ε",
    q: "Πόση κινητική ενέργεια χάθηκε στην 1η κρούση και τι ποσοστό;",
    tool: "Κινητική πριν/μετά",
    at: 0.651,
    a: (
      <>
        Κ_πριν = ½·0,2·36 = 3,6 J, Κ_μετά = ½·0,2·16 = 1,6 J ⇒ <b>χάθηκαν 2 J (≈ 55,6%)</b>. Έλεγχος: mg(h₁ − h₂) = 2·1 = 2 J ✓ — η «χαμένη» ενέργεια
        είναι ακριβώς το ύψος που δεν ξαναπήρε.
      </>
    ),
  },
  {
    k: "στ",
    q: "Πόσος είναι ο ρυθμός μεταβολής της ορμής στον αέρα και πόσος στην επαφή;",
    tool: "Ρυθμός = ΣF",
    at: 0.3,
    a: (
      <>
        Στον αέρα μόνο βάρος: <b>dp/dt = −mg = −2 kg·m/s²</b> (σταθερός, ίδιος σε άνοδο και κάθοδο → ίδια κλίση στο διάγραμμα). Στην επαφή: <b>+40 kg·m/s²</b>{" "}
        (σχεδόν κατακόρυφο άλμα). Ρυθμός μεταβολής ορμής = ΣF, σε κάθε στιγμή.
      </>
    ),
  },
  {
    k: "ζ",
    q: "Πόσο κρατά η πτώση, πόσο η 1η άνοδος, και πόσο όλο μέχρι το 1ο ψηλότερο σημείο;",
    tool: "Κινηματική",
    at: 1.05,
    a: (
      <>
        Πτώση t = υ₁/g = <b>0,6 s</b>, άνοδος υ₂/g = <b>0,4 s</b>, μαζί με την επαφή: 0,6 + 0,05 + 0,4 = <b>1,05 s</b>.
      </>
    ),
  },
  {
    k: "η",
    q: "Ποια είναι η μεταβολή της ορμής από τη στιγμή που αφήνεται ως το 1ο ψηλότερο σημείο; Τι μας λέει;",
    tool: "Δp = ΣF·Δt",
    at: 1.05,
    a: (
      <>
        Και στις δύο στιγμές είναι ακίνητη ⇒ <b>Δp_ολ = 0</b>. Άρα οι ωθήσεις ισορροπούν: ώθηση βάρους = 2 N · 1,05 s = 2,1 N·s (κάτω), ώθηση εδάφους = 42 N ·
        0,05 s = 2,1 N·s (πάνω) ✓. Μικρή δύναμη για πολύ χρόνο = μεγάλη δύναμη για λίγο χρόνο.
      </>
    ),
  },
  {
    k: "θ",
    q: "Αν το έδαφος ήταν μαλακό και η επαφή κρατούσε 0,1 s (ίδιες ταχύτητες), πόση θα ήταν η N;",
    tool: "ΣF = Δp/Δt",
    at: 0.625,
    a: (
      <>
        Ίδια Δp = 2, διπλάσιος χρόνος: ΣF = 20 N ⇒ <b>N = 22 N</b> (σχεδόν μισή). Γι' αυτό υπάρχουν στρώματα, αερόσακοι, λυγισμένα γόνατα: ίδια μεταβολή
        ορμής, περισσότερος χρόνος, μικρότερη δύναμη.
      </>
    ),
  },
  {
    k: "ι",
    q: "Αν σε κάθε κρούση κρατά τα 2/3 της ταχύτητας, πόσο ανεβαίνει στη 2η και στην 3η αναπήδηση; Πόση η N σε κάθε κρούση;",
    tool: "ΣF = Δp/Δt + ΑΔΜΕ",
    at: REAL_TOTAL,
    a: (
      <>
        Ταχύτητες: 6 → 4 → 2,67 → 1,78 m/s. Ύψη: <b>0,8 m → 0,36 m → 0,16 m</b> (κάθε φορά × 4/9, γιατί h ∝ υ²). Δύναμη εδάφους:{" "}
        <b>42 N → 28,7 N → 19,8 N</b>. Σε κάθε κρούση χάνεται το ίδιο <b>ποσοστό</b> (55,6%) αλλά όλο λιγότερα joule (2 → 0,89 → 0,40 J).
      </>
    ),
  },
];

const EVENTS: { label: string; t: number }[] = [
  { label: "Αρχή", t: 0 },
  { label: "1η κρούση", t: CONTACT_T[0] },
  { label: "1ο ψηλότερο", t: 1.05 },
  { label: "2η κρούση", t: CONTACT_T[1] },
  { label: "3η κρούση", t: CONTACT_T[2] },
  { label: "Τέλος", t: REAL_TOTAL },
];

export function BounceDeep() {
  const [a, setA] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);
  const figRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!playing) return;
    const tick = (now: number) => {
      const dt = last.current === null ? 0 : Math.min(0.05, (now - last.current) / 1000);
      last.current = now;
      setA((prev) => {
        const next = prev + dt * (slow ? 0.45 : 1);
        if (next >= ANIM_TOTAL) {
          setPlaying(false);
          return ANIM_TOTAL;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = null;
    };
  }, [playing, slow]);

  const jump = useCallback((t: number, scroll = false) => {
    setPlaying(false);
    setA(animForReal(t));
    if (scroll) figRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const s = useMemo(() => atAnim(a), [a]);
  const seg = SEGS[s.seg];
  const p = m * s.v;
  const contact = seg.kind === "contact";
  const SF = contact ? (m * (seg.v1 - seg.v0)) / DT : -m * g;
  const by = GROUND - 10 - s.y * HS;
  const squash = contact ? 0.42 * Math.sin(Math.PI * s.f) : 0;

  return (
    <section id="anapidisi" className="scroll-mt-20 rounded-3xl border border-[#6b4fa0] bg-white p-4 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b4fa0]">Σύνθετη 5 · πάμε παραπέρα</p>
      <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#1c2433] sm:text-2xl">Μπάλα με 3 αναπηδήσεις: σχέδιο, διάγραμμα p–t και ερωτήματα</h3>
      <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#3d4452]">
        Μπάλα <b>0,2 kg</b> αφήνεται από <b>1,8 m</b>. Κάθε επαφή με το έδαφος κρατά <b>0,05 s</b> και η μπάλα φεύγει με τα <b>2/3</b> της ταχύτητας που
        ήρθε (η 1η φορά ανεβαίνει ως 0,8 m). Δες τη μπάλα και δίπλα το διάγραμμα <b>ορμής–χρόνου</b> να σχεδιάζεται. Θετική φορά: προς τα πάνω.
      </p>

      <div ref={figRef} className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-[#fbfaf7]">
        <div className="grid sm:grid-cols-[1fr_2fr]">
        <svg viewBox={`10 0 210 ${VH}`} className="mx-auto block h-auto w-full max-w-[220px] sm:max-w-none" role="img" aria-label="Μπάλα που αναπηδά">
          {/* left: ball */}
          <Ground y={GROUND} x1={20} x2={210} />
          {[1.8, 0.8, 0.356, 0.158].map((h, i) => (
            <g key={h}>
              <line x1={40} y1={GROUND - h * HS} x2={180} y2={GROUND - h * HS} stroke={C.faint} strokeDasharray="3 4" />
              <T x={36} y={GROUND - h * HS + 4} s={["1,8 m", "0,8", "0,36", "0,16"][i]} size={10} color={C.muted} anchor="end" bold={false} />
            </g>
          ))}
          <Ball cx={BX} cy={contact ? GROUND - 10 * (1 - squash) : by} r={10} squash={squash} axis="y" />
          {Math.abs(s.v) > 0.3 && !contact ? (
            <Vec x={BX + 18} y={by} dx={0} dy={-s.v * 6} label="υ" labelSide="right" />
          ) : null}
          {contact ? (
            <g>
              <Vec x={BX} y={GROUND - 24} dx={0} dy={-Math.min(80, SF * 1.7)} color={C.F} label={`N ≈ ${fmt(SF + 2)} N`} labelSide="right" />
            </g>
          ) : (
            <Vec x={BX - 18} y={by} dx={0} dy={16} color={C.F} label="mg" labelSide="left" />
          )}

        </svg>
        <svg viewBox={`228 0 ${VW - 222} ${VH}`} className="block h-auto w-full border-t border-black/5 sm:border-l sm:border-t-0" role="img" aria-label="Διάγραμμα ορμής–χρόνου">
          {/* right: p–t graph */}
          <line x1={GX0} y1={18} x2={GX0} y2={GROUND + 4} stroke={C.edge} strokeWidth={1.2} />
          <line x1={GX0} y1={P0} x2={GX1 + 6} y2={P0} stroke={C.edge} strokeWidth={1.2} />
          <T x={GX0 + 6} y={18} s="p (kg·m/s)" size={15} color={C.ink} anchor="start" />
          <T x={GX1} y={P0 - 8} s="t (s)" size={15} color={C.ink} anchor="end" />
          {[0.8, -1.2].map((v) => (
            <g key={v}>
              <line x1={GX0 - 4} y1={py(v)} x2={GX1} y2={py(v)} stroke={C.faint} strokeDasharray="2 5" />
              <T x={GX0 - 6} y={py(v) + 4} s={fmt(v)} size={15} color={C.muted} anchor="end" bold={false} />
            </g>
          ))}
          {[0.5, 1, 1.5, 2].map((t) => (
            <T key={t} x={px(t)} y={P0 + 15} s={fmt(t)} size={15} color={C.muted} bold={false} />
          ))}
          <clipPath id="bounce-reveal">
            <rect x={GX0 - 2} y={0} width={Math.max(0, px(s.real) - GX0 + 2)} height={VH} />
          </clipPath>
          <path d={PATH} fill="none" stroke={C.faint} strokeWidth={1.2} strokeDasharray="2 4" />
          <path d={PATH} fill="none" stroke={C.p} strokeWidth={2.4} clipPath="url(#bounce-reveal)" />
          <circle cx={px(s.real)} cy={py(p)} r={4.5} fill={C.p} stroke="#fff" strokeWidth={1.5} />
          {s.real > 0.35 ? <T x={px(0.02)} y={py(-1.05)} s="κλίση = −mg" size={15} color={C.F} anchor="start" /> : null}
          {CONTACT_T.map((t, i) =>
            s.real >= t ? (
              <T key={t} x={i === 2 ? px(t) - 5 : px(t) + 5} y={py([0.95, 0.65, 0.7][i])} s={`Δp=+${["2", "1,33", "0,89"][i]}`} size={14} color={C.F} anchor={i === 2 ? "end" : "start"} />
            ) : null,
          )}
        </svg>
        </div>

        <div className="border-t border-black/5 px-4 py-3">
          <p className="text-sm font-bold text-[#6b4fa0]">
            {seg.label} · t = {fmt(s.real)} s · p = {fmt(p)} kg·m/s · ΣF = {fmt(SF)} N
          </p>
          <p className="mt-1 min-h-[4.5rem] text-[15px] leading-6 text-[#2c2825]" aria-live="polite">
            {seg.say}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (a >= ANIM_TOTAL) setA(0);
                setPlaying((v) => !v);
              }}
              className="min-h-10 rounded-full px-5 text-sm font-bold text-white"
              style={{ background: "#6b4fa0", color: "#fff" }}
            >
              {playing ? "❚❚ Παύση" : a >= ANIM_TOTAL ? "↻ Ξανά" : "▶ Παίξε"}
            </button>
            <button
              type="button"
              onClick={() => setSlow((v) => !v)}
              aria-pressed={slow}
              className={`min-h-10 rounded-full border px-4 text-sm font-bold ${slow ? "border-[#6b4fa0] bg-[#f1edf8] text-[#6b4fa0]" : "border-black/10 text-[#3d4452]"}`}
            >
              🐢 Αργά
            </button>
            {EVENTS.map((ev) => (
              <button key={ev.label} type="button" onClick={() => jump(ev.t)} className="min-h-10 rounded-full border border-black/10 px-3 text-xs font-bold text-[#3d4452]">
                {ev.label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={ANIM_TOTAL}
            step={0.01}
            value={a}
            onChange={(e) => {
              setPlaying(false);
              setA(Number(e.target.value));
            }}
            aria-label="Χρόνος"
            className="mt-3 w-full accent-[#6b4fa0]"
          />
        </div>
      </div>

      <h4 className="mt-6 text-lg font-bold text-[#1c2433]">Ερωτήματα, με τη σειρά</h4>
      <p className="mt-1 text-sm leading-6 text-[#5b6577]">
        Λύσε κάθε ερώτημα στο τετράδιο πρώτα. Το «Δείξε τη στιγμή» πηγαίνει το σχέδιο εκεί που αφορά το ερώτημα.
      </p>
      <ol className="mt-3 space-y-3">
        {QUESTIONS.map((q) => (
          <li key={q.k} className="rounded-2xl border border-black/10 bg-[#f7f8fb] p-3 sm:p-4">
            <p className="text-[15px] leading-6 text-[#1c2433]">
              <b className="text-[#6b4fa0]">{q.k})</b> {q.q}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#6b4fa0] ring-1 ring-[#6b4fa0]/30">Εργαλείο: {q.tool}</span>
              <button type="button" onClick={() => jump(q.at, true)} className="min-h-9 rounded-full border border-black/10 bg-white px-3 text-xs font-bold text-[#3d4452]">
                ◉ Δείξε τη στιγμή
              </button>
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [q.k]: !o[q.k] }))}
                aria-expanded={Boolean(open[q.k])}
                className="min-h-9 rounded-full px-3 text-xs font-bold text-white"
                style={{ background: "#1c2433", color: "#fff" }}
              >
                {open[q.k] ? "Κρύψε τη λύση" : "Δες τη λύση"}
              </button>
            </div>
            {open[q.k] ? <p className="mt-2 rounded-xl bg-white p-3 text-[15px] leading-6 text-[#2c2825]">{q.a}</p> : null}
          </li>
        ))}
      </ol>
      <p className="mt-4 rounded-2xl bg-[#f6f3fb] p-4 text-[15px] leading-6 text-[#3d4452]">
        <b>Τι κρατάμε:</b> στο διάγραμμα p–t η κλίση είναι η ΣF. Στον αέρα όλες οι ευθείες έχουν την ίδια κλίση (−mg), όσο ψηλά κι αν πάει η μπάλα. Οι κρούσεις
        είναι τα σχεδόν κατακόρυφα άλματα: μεγάλη Δp σε ελάχιστο χρόνο = τεράστια δύναμη.
      </p>
    </section>
  );
}
