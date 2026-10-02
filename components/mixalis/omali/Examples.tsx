"use client";

import { useEffect, useState } from "react";
import { Arrow, COLORS, G, Legend, Note, Pill, PlayButton, Slider, Stat, fmt, useClock, usePlaying } from "./shared";

/** Λυμένο 1: two runners on a circular track, R = 100 m. */
export function TrackRunners() {
  const [dir, setDir] = useState<"same" | "opposite">("same");
  const [v1, setV1] = useState(10);
  const [v2, setV2] = useState(20);
  const [playing, setPlaying] = usePlaying(false);
  const SPEED = 4; // simulation runs 4× faster than real time
  const clock = useClock(playing, SPEED);
  const R = 100;
  const L = 2 * Math.PI * R;
  const same = dir === "same";
  const tMeet = same ? (v1 === v2 ? Infinity : L / Math.abs(v2 - v1)) : L / (v1 + v2);
  const t = Math.min(clock.t, Number.isFinite(tMeet) ? tMeet : clock.t);
  const met = Number.isFinite(tMeet) && clock.t >= tMeet;
  useEffect(() => {
    if (met && playing) setPlaying(false);
  }, [met, playing, setPlaying]);
  const s1 = v1 * t;
  const s2 = v2 * t;
  const S1meet = v1 * tMeet;

  const C = 150;
  const RP = 110;
  // Start at the top, positive = clockwise for runner 1.
  const pos = (s: number, sign: number) => {
    const th = Math.PI / 2 - sign * (s / R);
    return { x: C + RP * Math.cos(th), y: C - RP * Math.sin(th) };
  };
  const p1 = pos(s1, 1);
  const p2 = pos(s2, same ? 1 : -1);
  const meetPoint = Number.isFinite(tMeet) ? pos(S1meet, 1) : null;

  return (
    <div ref={clock.ref} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Pill active={same} onClick={() => { setDir("same"); clock.setT(0); }}>i) Ομόρροπα</Pill>
        <Pill active={!same} onClick={() => { setDir("opposite"); clock.setT(0); }}>ii) Αντίρροπα</Pill>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <div className="rounded-2xl border border-black/10 bg-[#f6e9e2] p-2">
            <svg viewBox="0 0 300 300" className="mx-auto block w-full max-w-[360px]" role="img" aria-label="Δύο δρομείς σε κυκλικό στίβο">
              <circle cx={C} cy={C} r={RP} fill="none" stroke="#c96e4b" strokeWidth="22" />
              <circle cx={C} cy={C} r={RP} fill="none" stroke="white" strokeWidth="1.2" strokeDasharray="6 6" />
              <line x1={C} y1={C - RP - 14} x2={C} y2={C - RP + 14} stroke={COLORS.ink} strokeWidth="3" />
              <text x={C + 6} y={C - RP - 16} fontSize="11" fill={COLORS.ink}>αφετηρία</text>
              {meetPoint && met ? <circle cx={meetPoint.x} cy={meetPoint.y} r="16" fill="none" stroke={COLORS.ok} strokeWidth="3" /> : null}
              <circle cx={p1.x} cy={p1.y} r="8" fill="#2f5fb3" stroke="white" strokeWidth="2" />
              <circle cx={p2.x} cy={p2.y} r="8" fill={COLORS.mandarin} stroke="white" strokeWidth="2" />
              <text x={C} y={C - 8} textAnchor="middle" fontSize="13" fill={COLORS.ink} fontWeight="600">
                t = {fmt(t, 1)} s
              </text>
              <text x={C} y={C + 12} textAnchor="middle" fontSize="11" fill={COLORS.muted}>
                S₁ = {fmt(s1, 0)} m · S₂ = {fmt(s2, 0)} m
              </text>
              {met ? (
                <text x={C} y={C + 34} textAnchor="middle" fontSize="13" fill={COLORS.ok} fontWeight="700">
                  Συνάντηση!
                </text>
              ) : null}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <PlayButton playing={playing} onToggle={() => { if (met) clock.setT(0); setPlaying(!playing); }} onReset={() => { clock.setT(0); setPlaying(false); }} />
            <Legend items={[{ color: "#2f5fb3", label: `κινητό 1 (υ₁)` }, { color: COLORS.mandarin, label: `κινητό 2 (υ₂)` }]} />
          </div>
          <p className="mt-2 text-xs text-[#857261]">Η κίνηση παίζει 4× πιο γρήγορα από την πραγματικότητα.</p>
        </div>
        <div className="space-y-4">
          <Slider label="υ₁" value={v1} min={2} max={30} step={1} onChange={(x) => { setV1(x); clock.setT(0); }} display={`${v1} m/s`} color="#2f5fb3" />
          <Slider label="υ₂" value={v2} min={2} max={30} step={1} onChange={(x) => { setV2(x); clock.setT(0); }} display={`${v2} m/s`} color={COLORS.mandarin} />
          <div className="rounded-2xl border border-black/10 bg-white p-4 font-mono text-sm leading-7">
            {same ? (
              <>
                <p>S₂ = S₁ + 2πR (ο γρήγορος κάνει έναν γύρο παραπάνω)</p>
                <p>υ₂t − υ₁t = 2πR ⇒ t = 2πR / (υ₂ − υ₁)</p>
              </>
            ) : (
              <>
                <p>S₁ + S₂ = 2πR (μαζί καλύπτουν έναν γύρο)</p>
                <p>υ₁t + υ₂t = 2πR ⇒ t = 2πR / (υ₁ + υ₂)</p>
              </>
            )}
            <p className="mt-1 font-semibold text-[#2e8b57]">
              t = {Number.isFinite(tMeet) ? `${fmt(tMeet, 2)} s` : "δεν συναντώνται ποτέ (ίδια ταχύτητα!)"}
            </p>
            {Number.isFinite(tMeet) ? <p className="font-semibold text-[#2e8b57]">S₁ = υ₁·t = {fmt(S1meet, 1)} m</p> : null}
          </div>
          {same && v1 === 10 && v2 === 20 ? (
            <Note tone="warn" title="Προσοχή στις σημειώσεις">
              Στη σελ. 5 γράφει t = 6,28 s, αλλά 2·3,14·100 / 10 = <b>62,8 s</b> (σωστά χρησιμοποιεί μετά 62,8). Και S₁ = 628 m = ακριβώς ένας γύρος: ξανασυναντιούνται
              <b> στην αφετηρία</b>!
            </Note>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Λυμένο 2: second hand, |Δυ| after 15 s. */
export function SecondHand() {
  const [dt, setDt] = useState(15);
  const R = 0.3;
  const T = 60;
  const v = (2 * Math.PI * R) / T;
  const dth = (2 * Math.PI * dt) / T;
  const dv = 2 * v * Math.sin(dth / 2);

  const C = 120;
  const RP = 90;
  const sc = 2200; // px per (m/s)
  // Hand at 12 o'clock at t=0, clockwise.
  const ang0 = Math.PI / 2;
  const ang1 = Math.PI / 2 - dth;
  const P0 = { x: C + RP * Math.cos(ang0), y: C - RP * Math.sin(ang0) };
  const P1 = { x: C + RP * Math.cos(ang1), y: C - RP * Math.sin(ang1) };
  // Clockwise tangent: (sin θ, cos θ) in screen coords → (sinθ, cosθ) with y down
  const v0 = { x: Math.sin(ang0) * v * sc, y: Math.cos(ang0) * v * sc };
  const v1 = { x: Math.sin(ang1) * v * sc, y: Math.cos(ang1) * v * sc };

  // Triangle on the right: −υ1 then υ2 tail-to-tip.
  const O = { x: 300, y: 110 };
  const A = { x: O.x - v0.x, y: O.y - v0.y };
  const Bp = { x: A.x + v1.x, y: A.y + v1.y };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-2">
        <svg viewBox="0 0 400 240" className="block w-full" role="img" aria-label="Δευτερολεπτοδείκτης και η διανυσματική μεταβολή της ταχύτητας">
          <circle cx={C} cy={C} r={RP + 12} fill="white" stroke={COLORS.ink} strokeWidth="3" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return <line key={i} x1={C + (RP + 2) * Math.cos(a)} y1={C + (RP + 2) * Math.sin(a)} x2={C + (RP + 9) * Math.cos(a)} y2={C + (RP + 9) * Math.sin(a)} stroke={COLORS.ink} strokeWidth="2" />;
          })}
          <line x1={C} y1={C} x2={P0.x} y2={P0.y} stroke={COLORS.track} strokeWidth="2" strokeDasharray="3 3" />
          <line x1={C} y1={C} x2={P1.x} y2={P1.y} stroke={COLORS.danger} strokeWidth="2.5" />
          <Arrow x1={P0.x} y1={P0.y} x2={P0.x + v0.x} y2={P0.y + v0.y} color={COLORS.velocity} width={3} />
          <text x={P0.x + v0.x - 10} y={P0.y + v0.y - 6} fontSize="12" fill={COLORS.velocity} fontWeight="700">υ₁</text>
          <Arrow x1={P1.x} y1={P1.y} x2={P1.x + v1.x} y2={P1.y + v1.y} color={COLORS.velocity} width={3} />
          <text x={P1.x + v1.x + 4} y={P1.y + v1.y + 4} fontSize="12" fill={COLORS.velocity} fontWeight="700">υ₂</text>
          <circle cx={C} cy={C} r="4" fill={COLORS.ink} />

          <Arrow x1={O.x} y1={O.y} x2={A.x} y2={A.y} color={COLORS.velocity} width={2.5} dashed />
          <text x={(O.x + A.x) / 2 - 8} y={(O.y + A.y) / 2 + 16} fontSize="11" fill={COLORS.velocity}>−υ₁</text>
          <Arrow x1={A.x} y1={A.y} x2={Bp.x} y2={Bp.y} color={COLORS.velocity} width={2.5} />
          <Arrow x1={O.x} y1={O.y} x2={Bp.x} y2={Bp.y} color={COLORS.accel} width={3.5} />
          <text x={(O.x + Bp.x) / 2 + 6} y={(O.y + Bp.y) / 2} fontSize="12" fill={COLORS.accel} fontWeight="700">Δυ</text>
        </svg>
      </div>
      <div className="space-y-4">
        <Slider label="Χρονικό διάστημα Δt" value={dt} min={1} max={60} step={1} onChange={setDt} display={`${dt} s`} />
        <div className="grid grid-cols-2 gap-3">
          <Stat label="υ = 2πR/T" value={fmt(v, 4)} unit="m/s" color={COLORS.velocity} />
          <Stat label="Μεταβολή μέτρου Δ|υ|" value="0" unit="m/s" hint="το μέτρο μένει ίδιο" />
          <Stat label="|Δυ| (διάνυσμα)" value={fmt(dv, 4)} unit="m/s" color={COLORS.accel} hint="|Δυ| = 2υ·ημ(Δθ/2)" />
          <Stat label="Γωνία που διέγραψε" value={fmt((dth * 180) / Math.PI, 0)} unit="°" />
        </div>
        {dt === 15 ? (
          <Note tone="warn" title="Προσοχή στις σημειώσεις">
            Για 15 s: |Δυ| = υ√2 = 0,0314·1,414 ≈ <b>0,044 m/s</b> (όχι 0,44 που γράφει η σελ. 6 — λάθος στο κόμμα).
          </Note>
        ) : null}
        {dt === 30 ? <Note tone="ok">Στα 30 s οι ταχύτητες είναι αντίθετες: |Δυ| = 2υ — η μέγιστη δυνατή μεταβολή!</Note> : null}
        {dt === 60 ? <Note tone="ok">Μετά από μία περίοδο ο δείκτης γύρισε εκεί που ήταν: Δυ = 0. Περιοδικό φαινόμενο!</Note> : null}
      </div>
    </div>
  );
}

/** Λυμένο 3: conical pendulum, m = 100 g, ℓ = 20 cm. */
export function ConicalPendulum() {
  const [f, setF] = useState(5 / Math.PI);
  const [playing, setPlaying] = usePlaying(true);
  const [slow, setSlow] = useState(true);
  const clock = useClock(playing, slow ? 0.25 : 1);
  const m = 0.1;
  const l = 0.2;
  const PI2 = Math.PI * Math.PI; // exact π² so that f = 5/π gives T = 2 N, φ = 60° exactly
  const tension = m * 4 * PI2 * f * f * l;
  const cosPhi = Math.min(1, (m * G) / tension);
  const phi = Math.acos(cosPhi);
  const phiDeg = (phi * 180) / Math.PI;
  const fMin = Math.sqrt(G / (4 * PI2 * l));
  const R = l * Math.sin(phi);

  const top = { x: 160, y: 30 };
  const Lpx = 170;
  const Rpx = Lpx * Math.sin(phi);
  const hpx = Lpx * Math.cos(phi);
  const th = 2 * Math.PI * f * clock.t;
  const bob = { x: top.x + Rpx * Math.cos(th), y: top.y + hpx + Rpx * 0.28 * Math.sin(th) };
  const centre = { x: top.x, y: top.y + hpx };
  const behind = Math.sin(th) < 0;

  const exact = Math.abs(f - 5 / Math.PI) < 0.005;

  return (
    <div ref={clock.ref} className="grid gap-5 lg:grid-cols-2">
      <div>
        <div className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-2">
          <svg viewBox="0 0 320 260" className="mx-auto block w-full max-w-[380px]" role="img" aria-label="Κωνικό εκκρεμές">
            <rect x="60" y="18" width="200" height="12" fill="#a99a89" />
            <ellipse cx={centre.x} cy={centre.y} rx={Math.max(Rpx, 1)} ry={Math.max(Rpx * 0.28, 1)} fill="none" stroke={COLORS.track} strokeDasharray="4 4" />
            <line x1={top.x} y1={top.y} x2={centre.x} y2={centre.y} stroke={COLORS.muted} strokeDasharray="2 3" />
            {behind ? <circle cx={bob.x} cy={bob.y} r="10" fill={COLORS.danger} opacity="0.7" /> : null}
            <line x1={top.x} y1={top.y} x2={bob.x} y2={bob.y} stroke={COLORS.ink} strokeWidth="2" />
            {phiDeg > 3 ? (
              <path d={`M ${top.x} ${top.y + 40} A 40 40 0 0 0 ${top.x + 40 * Math.sin(phi)} ${top.y + 40 * Math.cos(phi)}`} fill="none" stroke={COLORS.mandarin} strokeWidth="2" />
            ) : null}
            <text x={top.x + 6} y={top.y + 58} fontSize="13" fontWeight="700" fill={COLORS.mandarin}>φ</text>
            {!behind ? <circle cx={bob.x} cy={bob.y} r="10" fill={COLORS.danger} /> : null}
            <Arrow x1={bob.x} y1={bob.y} x2={bob.x} y2={bob.y + 45} color={COLORS.muted} width={3} />
            <Arrow x1={bob.x} y1={bob.y} x2={bob.x + ((top.x - bob.x) / Lpx) * 45 / cosPhi * 0.9} y2={bob.y + ((top.y - bob.y) / Lpx) * 45 / cosPhi * 0.9} color="#2f5fb3" width={3} />
            <text x="12" y="250" fontSize="12" fill={COLORS.muted}>
              B (γκρι) · T τάση (μπλε) · R = ℓημφ = {fmt(R * 100, 1)} cm
            </text>
          </svg>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <PlayButton playing={playing} onToggle={() => setPlaying(!playing)} />
          <Pill active={slow} onClick={() => setSlow(!slow)}>αργή κίνηση ×¼</Pill>
        </div>
      </div>
      <div className="space-y-4">
        <Slider label="Συχνότητα f" value={f} min={0.9} max={4} step={0.01} onChange={setF} display={`${fmt(f, 2)} Hz`} />
        <div className="flex flex-wrap gap-2">
          <Pill active={exact} onClick={() => setF(5 / Math.PI)}>f = 5/π Hz (σημειώσεις)</Pill>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Τάση T = m·4π²f²·ℓ" value={fmt(tension, 2)} unit="N" color="#2f5fb3" />
          <Stat label="συνφ = mg/T" value={fmt(cosPhi, 3)} />
          <Stat label="Γωνία φ" value={fmt(phiDeg, 1)} unit="°" color={COLORS.mandarin} />
          <Stat label="Ελάχιστη f για κωνική κίνηση" value={fmt(fMin, 2)} unit="Hz" hint="κάτω από αυτή T < mg: αδύνατον" />
        </div>
        {f < fMin ? (
          <Note tone="warn">Με τόσο μικρή συχνότητα θα έπρεπε T &lt; mg, αλλά τότε το νήμα δεν κρατά τη σφαίρα — δεν γίνεται κωνική κίνηση.</Note>
        ) : null}
        <Note tone="warn" title="Προσοχή στις σημειώσεις">
          Το μήκος του νήματος πρέπει να είναι <b>ℓ = 20 cm = 0,2 m</b> (όχι 20 m). Με 0,2 m βγαίνει T = 0,1·4·10·(25/10)·0,2 = <b>2 N</b> και φ = 60°, όπως
          στη λύση. Με 20 m θα έβγαινε 200 N!
        </Note>
      </div>
    </div>
  );
}

