"use client";

import { Ball, Bars, Box, Bullet, Burst, C, Cart, Ground, Heat, MiniGraph, T, Tag, Vec, bump, clamp, lerp, num, seg, type Case } from "./kit";
import { CollisionScene } from "./collide";

/* ═════════════ ΕΝΟΤΗΤΑ 6 · Εκρήξεις και συνδυαστικά ═════════════ */

/* 26. Έκρηξη ακίνητου: 1 kg ← 4 m/s, 2 kg → 2 m/s */
const case26: Case = {
  n: 26,
  given: "Ακίνητο σώμα 3 kg σπάει σε 1 kg και 2 kg. Το 1 kg φεύγει με 4 m/s.",
  ask: "Την ταχύτητα υ_2 του άλλου κομματιού και την ενέργεια της έκρηξης.",
  what: "Ένα ακίνητο σώμα εκρήγνυται σε δύο κομμάτια που φεύγουν αντίθετα. Δείχνει ότι στην έκρηξη η ορμή μένει μηδέν, ενώ η κινητική ενέργεια αυξάνεται.",
  title: "Έκρηξη ακίνητου",
  period: 5.5,
  legend: ["v", "p", "K"],
  phases: [
    { until: 1.2, label: "Πριν", say: "Ένα ακίνητο σώμα 3 kg έχει μέσα του εκρηκτικό. Ολική ορμή μηδέν, κινητική ενέργεια μηδέν." },
    { until: 1.8, label: "Έκρηξη", say: "Η έκρηξη σπάει το σώμα σε 1 kg και 2 kg. Οι δυνάμεις της έκρηξης είναι εσωτερικές: η ορμή μένει 0." },
    { until: 5.5, label: "Μετά", say: "Φεύγουν αντίθετα: 1·4 = 2·2. Η κινητική όμως αυξήθηκε από 0 σε 12 J: την έδωσε η χημική ενέργεια του εκρηκτικού." },
  ],
  Scene: ({ t }) => {
    const gy = 100;
    const after = Math.min(3, Math.max(0, t - 1.2));
    const S = 9;
    const x1 = 168 - S * 4 * after;
    const x2 = 196 + S * 2 * after;
    const exploded = t > 1.2;
    return (
      <g>
        <Ground y={gy} />
        {!exploded ? (
          <Box cx={180} y={gy} w={44} h={30} fill="#d9c9a3" label="3 kg" />
        ) : (
          <g>
            <Box cx={x1} y={gy} w={26} h={22} fill={C.b1} label="m_1" />
            <Box cx={x2} y={gy} w={34} h={28} fill={C.b2} label="m_2" />
            <Vec x={x1 - 14} y={gy - 34} dx={-4 * 9} label="υ_1 = 4" />
            <Vec x={x2 + 18} y={gy - 40} dx={2 * 9} label="υ_2 = 2" />
          </g>
        )}
        <Burst cx={180} cy={gy - 16} k={seg(t, 1.2, 1.9)} />
        <Bars
          y={134}
          max={13}
          items={[
            { label: "p_1", value: exploded ? -4 : 0 },
            { label: "p_2", value: exploded ? 4 : 0 },
            { label: "p_{ολ}", value: 0, color: C.ink },
            { label: "K_{ολ}", value: exploded ? 12 : 0, color: C.K, unit: "J" },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      0 = m₁υ₁ − m₂υ₂ ⇒ 1·4 = 2·υ₂ ⇒ <b>υ₂ = 2 m/s</b>. Ενέργεια έκρηξης: E = K₁ + K₂ = 8 + 4 = <b>12 J</b>.
    </>
  ),
  trap: "Στην έκρηξη η κινητική ΑΥΞΑΝΕΤΑΙ. Διατηρείται μόνο η ορμή.",
};

/* 27. Έκρηξη κινούμενου: 10 kg · 50 m/s → 6 kg · 100 m/s και 4 kg · (−25 m/s) */
const case27: Case = {
  n: 27,
  given: "Σφαίρα 10 kg με 50 m/s σπάει σε 6 kg και 4 kg. Το 6 kg φεύγει μπροστά με 100 m/s.",
  ask: "Την ταχύτητα υ_2 του κομματιού 4 kg.",
  what: "Μια σφαίρα που κινείται εκρήγνυται, το ένα κομμάτι πάει πιο γρήγορα μπροστά και το άλλο γυρίζει πίσω. Δείχνει την ΑΔΟ σε έκρηξη κινούμενου σώματος.",
  title: "Έκρηξη κινούμενου",
  period: 6,
  legend: ["v", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "Σφαίρα 10 kg κινείται με 50 m/s: p = 500 kg·m/s προς τα δεξιά." },
    { until: 2.6, label: "Έκρηξη", say: "Σπάει σε 6 kg και 4 kg. Το κομμάτι των 6 kg συνεχίζει μπροστά με 100 m/s. Πού θα πάει το άλλο;" },
    { until: 6, label: "Μετά", say: "500 = 6·100 + 4·υ₂ ⇒ υ₂ = −25 m/s. Το μικρό κομμάτι γύρισε πίσω! Η ολική ορμή έμεινε 500." },
  ],
  Scene: ({ t }) => {
    const gy = 100;
    const k = 0.6; // px per (m/s · s)
    const xb = 60 + k * 50 * Math.min(t, 2);
    const after = Math.min(2, Math.max(0, t - 2));
    const exploded = t > 2;
    return (
      <g>
        <Ground y={gy} />
        {!exploded ? (
          <g>
            <Ball cx={xb} cy={gy - 14} r={14} fill="#d9c9a3" label="10 kg" />
            <Vec x={xb + 16} y={gy - 36} dx={50 * 0.7} label="υ = 50" />
          </g>
        ) : (
          <g>
            <Ball cx={xb + 10 + k * 100 * after} cy={gy - 12} r={12} fill={C.b2} label="6" />
            <Ball cx={xb - 10 - k * 25 * after} cy={gy - 10} r={10} fill={C.b1} label="4" />
            <Vec x={xb + 24 + k * 100 * after} y={gy - 32} dx={100 * 0.7} label="υ_1 = 100" />
            <Vec x={xb - 22 - k * 25 * after} y={gy - 30} dx={-25 * 0.7} label="υ_2 = −25" labelSide="left" />
          </g>
        )}
        <Burst cx={xb} cy={gy - 14} k={seg(t, 2, 2.7)} />
        <Bars
          y={134}
          max={650}
          items={[
            { label: "p_1", value: exploded ? 600 : 300 },
            { label: "p_2", value: exploded ? -100 : 200 },
            { label: "p_{ολ}", value: 500, color: C.ink },
          ]}
        />
        <T x={180} y={200} s={exploded ? "πριν: 6 kg και 4 kg κινούνταν μαζί με 50 m/s" : ""} size={9.5} color={C.muted} bold={false} />
      </g>
    );
  },
  solve: (
    <>
      Mυ = m₁υ₁ + m₂υ₂ ⇒ 500 = 600 + 4υ₂ ⇒ <b>υ₂ = −25 m/s</b>. E = K_μετά − K_πριν = 31.250 − 12.500 = <b>18.750 J</b>.
    </>
  ),
  trap: "Αν δεν ξέρεις τη φορά ενός κομματιού, το θεωρείς θετικό. Το πρόσημο της λύσης σού λέει πού πήγε.",
};

/* 28. Έκρηξη στο ύψιστο σημείο: H = 20 m, 1 kg ← 4 m/s, 2 kg → 2 m/s */
const case28: Case = {
  n: 28,
  given: "Σώμα 3 kg ρίχνεται πάνω με 20 m/s. Στο ψηλότερο σημείο σπάει: 1 kg φεύγει οριζόντια με 4 m/s.",
  ask: "Πόσο μακριά από το σημείο της έκρηξης (οριζόντια) πέφτει κάθε κομμάτι, και πόσο απέχουν μεταξύ τους στο έδαφος.",
  what: "Μια μπάλα πετιέται ψηλά, εκρήγνυται στο ψηλότερο σημείο και τα κομμάτια πέφτουν κάνοντας οριζόντια βολή. Δείχνει πώς συνδυάζεται η έκρηξη με τη βολή.",
  title: "Έκρηξη στο ύψιστο σημείο",
  period: 7,
  legend: ["v", "p"],
  phases: [
    { until: 2, label: "Άνοδος", say: "Ρίχνουμε σώμα 3 kg κατακόρυφα με 20 m/s. Ανεβαίνει ως H = 20 m, όπου η ταχύτητά του γίνεται 0." },
    { until: 2.4, label: "Έκρηξη", say: "Εκεί σπάει σε 1 kg και 2 kg. Το κομμάτι του 1 kg φεύγει οριζόντια με 4 m/s. Αφού το σώμα ήταν ακίνητο (p = 0), το άλλο φεύγει αντίθετα: 1·4 = 2·υ₂ ⇒ υ₂ = 2 m/s." },
    {
      until: 7,
      label: "Οριζόντιες βολές",
      say: "Κάθε κομμάτι κάνει οριζόντια βολή από το ίδιο ύψος, οπότε πέφτουν μαζί σε t = √(2H/g) = 2 s. Το ελαφρύ πάει διπλάσια μακριά.",
    },
  ],
  Scene: ({ t }) => {
    const gy = 196;
    const S = 7; // px per metre
    const x0 = 180;
    const rise = Math.min(t, 2);
    const yUp = 20 * rise - 5 * rise * rise;
    const after = clamp((t - 2.4) / 1, 0, 2); // anim second = phys second
    const yDown = 20 - 5 * after * after;
    const exploded = t > 2;
    return (
      <g>
        <Ground y={gy} />
        <line x1={x0} y1={gy} x2={x0} y2={gy - S * 20} stroke={C.faint} strokeDasharray="3 4" />
        <T x={x0 + 6} y={gy - S * 10} s="H = 20 m" size={10} color={C.muted} anchor="start" bold={false} />
        {!exploded ? (
          <g>
            <Ball cx={x0} cy={gy - S * yUp - 8} r={8} fill="#d9c9a3" />
            <Vec x={x0 + 14} y={gy - S * yUp - 8} dx={0} dy={-(20 - 10 * rise) * 2} label="υ" />
          </g>
        ) : (
          <g>
            <path
              d={Array.from({ length: 21 }, (_, i) => {
                const u = (i / 20) * after;
                return `${i ? "L" : "M"}${x0 - S * 4 * u},${gy - S * (20 - 5 * u * u) - 6}`;
              }).join(" ")}
              fill="none"
              stroke={C.b1}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            <path
              d={Array.from({ length: 21 }, (_, i) => {
                const u = (i / 20) * after;
                return `${i ? "L" : "M"}${x0 + S * 2 * u},${gy - S * (20 - 5 * u * u) - 8}`;
              }).join(" ")}
              fill="none"
              stroke={C.b2}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            <Ball cx={x0 - S * 4 * after} cy={gy - S * yDown - 6} r={6} fill={C.b1} />
            <Ball cx={x0 + S * 2 * after} cy={gy - S * yDown - 8} r={8} fill={C.b2} />
            {after < 0.3 ? (
              <g>
                <Vec x={x0 - 10} y={gy - S * 20 - 20} dx={-4 * 8} label="υ_1 = 4" />
                <Vec x={x0 + 10} y={gy - S * 20 - 20} dx={2 * 8} label="υ_2 = 2" />
              </g>
            ) : null}
            {after >= 2 ? (
              <g>
                <T x={x0 - S * 4} y={gy + 0} s="" />
                <line x1={x0} y1={gy - 4} x2={x0 - S * 8} y2={gy - 4} stroke={C.p} strokeWidth={2} />
                <line x1={x0} y1={gy - 10} x2={x0 + S * 4} y2={gy - 10} stroke={C.p} strokeWidth={2} />
                <T x={x0 - S * 4} y={gy - 10} s="x_1 = 8 m" size={10.5} color={C.p} />
                <T x={x0 + S * 2 + 20} y={gy - 16} s="x_2 = 4 m" size={10.5} color={C.p} anchor="start" />
              </g>
            ) : null}
          </g>
        )}
        <Burst cx={x0} cy={gy - S * 20 - 8} k={seg(t, 2, 2.5)} />
        <T x={60} y={30} s={exploded ? `t = ${num(after, 1)} s` : ""} size={11} color={C.ink} />
        <T x={300} y={30} s="1 kg ← · → 2 kg" size={10} color={C.muted} bold={false} />
      </g>
    );
  },
  solve: (
    <>
      0 = m₁υ₁ − m₂υ₂ ⇒ υ₂ = 2 m/s. t = √(2H/g) = 2 s. x₁ = 4·2 = 8 m, x₂ = 2·2 = 4 m ⇒ <b>x₁/x₂ = m₂/m₁ = 2</b>. Απόσταση μεταξύ τους: 12 m.
    </>
  ),
  trap: "Η ορμή διατηρείται μόνο τη στιγμή της έκρηξης. Στην πτώση ασκείται βάρος.",
};

/* 29. Κρούση και οριζόντια βολή: 0,02 kg · 200 m/s σε 0,98 kg στην άκρη τραπεζιού, H = 1,25 m */
const case29: Case = {
  n: 29,
  given: "Βλήμα m = 0,02 kg με 200 m/s, κύβος M = 0,98 kg στην άκρη τραπεζιού ύψους H = 1,25 m.",
  ask: "Πόσο μακριά από το τραπέζι πέφτει (x).",
  what: "Ένα βλήμα σφηνώνεται σε κύβο στην άκρη τραπεζιού και ο κύβος πέφτει κάνοντας οριζόντια βολή. Δείχνει κρούση και βολή μαζί.",
  title: "Κρούση και οριζόντια βολή",
  period: 6.5,
  legend: ["v"],
  phases: [
    { until: 1.4, label: "Κρούση", say: "Βλήμα 20 g με 200 m/s σφηνώνεται σε κύβο 0,98 kg στην άκρη του τραπεζιού. ΑΔΟ: V = 4/1 = 4 m/s." },
    { until: 2.9, label: "Οριζόντια βολή", say: "Το σύνολο φεύγει οριζόντια με V = 4 m/s από ύψος 1,25 m. Οριζόντια κινείται ομαλά, κατακόρυφα πέφτει ελεύθερα." },
    { until: 6.5, label: "Πού πέφτει", say: "Χρόνος πτώσης t = √(2H/g) = 0,5 s. Απόσταση x = V·t = 4·0,5 = 2 m από τη βάση του τραπεζιού." },
  ],
  Scene: ({ t }) => {
    const S = 50; // px per metre
    const table = { x1: 20, x2: 150, y: 120 };
    const floor = table.y + S * 1.25; // 182.5
    const tc = 1.4;
    const tau = clamp((t - tc) / 3, 0, 0.5); // phys time of flight, 3× slower
    const bx = table.x2 - 14 + S * 4 * tau;
    const by = table.y - 12 + S * 5 * tau * tau;
    const bulletX = t < tc ? table.x2 - 28 - 70 * (tc - t) : null;
    const path = Array.from({ length: 21 }, (_, i) => {
      const u = (i / 20) * 0.5;
      return `${i ? "L" : "M"}${table.x2 - 14 + S * 4 * u},${table.y - 12 + S * 5 * u * u}`;
    }).join(" ");
    return (
      <g>
        <rect x={table.x1} y={table.y} width={table.x2 - table.x1} height={8} fill={C.wood} stroke={C.edge} />
        <line x1={table.x1 + 10} y1={table.y + 8} x2={table.x1 + 10} y2={floor} stroke={C.edge} strokeWidth={3} />
        <line x1={table.x2 - 10} y1={table.y + 8} x2={table.x2 - 10} y2={floor} stroke={C.edge} strokeWidth={3} />
        <Ground y={floor} />
        <path d={path} fill="none" stroke={C.faint} strokeDasharray="3 4" />
        <g transform={`rotate(${t > tc ? Math.min(40, tau * 60) : 0} ${bx} ${by})`}>
          <rect x={bx - 12} y={by - 12} width={24} height={24} rx={3} fill={C.wood} stroke={C.edge} />
        </g>
        {bulletX !== null ? <Bullet x={bulletX} y={table.y - 12} /> : null}
        {t > tc && tau < 0.5 ? (
          <g>
            <Vec x={bx + 14} y={by} dx={4 * 8} label="V" />
            <Vec x={bx} y={by + 14} dx={0} dy={10 * tau * 8} label="υ_y" opacity={0.8} />
          </g>
        ) : null}
        <line x1={table.x2 + 160} y1={table.y - 12} x2={table.x2 + 160} y2={floor} stroke={C.muted} strokeWidth={1} />
        <T x={table.x2 + 154} y={floor - 14} s="H = 1,25 m" size={10} color={C.muted} anchor="end" bold={false} />
        {tau >= 0.5 ? (
          <g>
            <line x1={table.x2 - 14} y1={floor + 8} x2={table.x2 - 14 + S * 2} y2={floor + 8} stroke={C.p} strokeWidth={2} />
            <T x={table.x2 - 14 + S} y={floor + 22} s="x = 2 m" size={11} color={C.p} />
          </g>
        ) : null}
        <T x={70} y={30} s={t > tc ? `t = ${num(tau, 2)} s` : "V = mυ/(M+m) = 4 m/s"} size={11} color={C.ink} />
      </g>
    );
  },
  solve: (
    <>
      0,02·200 = 1·V ⇒ <b>V = 4 m/s</b>. t = √(2·1,25/10) = 0,5 s ⇒ <b>x = V·t = 2 m</b>.
    </>
  ),
  trap: "Ο χρόνος πτώσης εξαρτάται μόνο από το ύψος, όχι από τη V.",
};

/* 30. Σώμα πέφτει σε καρότσι: M = 4 kg με 3 m/s, m = 2 kg πέφτει με 5 m/s και κολλάει → V = 2 m/s */
const case30: Case = {
  n: 30,
  given: "Καρότσι M = 4 kg με 3 m/s. Σώμα m = 2 kg πέφτει κατακόρυφα πάνω του και κολλάει.",
  ask: "Την ταχύτητα V μετά.",
  what: "Ένα κουτί πέφτει κατακόρυφα πάνω σε καρότσι που κυλάει και κολλάει, και το καρότσι αργοπορεί. Δείχνει ότι η ορμή διατηρείται μόνο στον οριζόντιο άξονα.",
  title: "Σώμα πέφτει σε καρότσι",
  period: 6,
  legend: ["v", "F", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "Το καρότσι (4 kg) κυλάει με 3 m/s. Από πάνω πέφτει κατακόρυφα σώμα 2 kg και θα κολλήσει πάνω του." },
    { until: 2.6, label: "Κρούση", say: "Στον κατακόρυφο άξονα το δάπεδο σπρώχνει απότομα (μεγάλη N) και σταματά την πτώση: εκεί η ορμή ΔΕΝ διατηρείται." },
    { until: 6, label: "Μετά", say: "Στον οριζόντιο άξονα δεν υπάρχει εξωτερική δύναμη: 4·3 = 6·V ⇒ V = 2 m/s. Το καρότσι «βάρυνε» και αργοπόρησε." },
  ],
  Scene: ({ t }) => {
    const gy = 112;
    const tc = 2;
    const X = 180;
    const cartX = t < tc ? X - 27 * (tc - t) : t < 2.6 ? X : X + 18 * (t - 2.6);
    const blockY = t < tc ? lerp(20, gy - 24, (t / tc) ** 1.6) : gy - 24;
    const N = bump(t, 2, 2.6);
    const stuck = t >= 2;
    const vy = t < tc ? 5 * (t / tc) : 0;
    return (
      <g>
        <Ground y={gy} />
        <Cart cx={cartX} y={gy} w={64} label="M" fill={C.b1} />
        <Box cx={stuck ? cartX : X} y={blockY} w={24} h={20} fill={C.b2} label="m" />
        {!stuck ? <Vec x={X - 20} y={blockY - 18} dx={0} dy={vy * 5} label="υ_y" labelSide="left" /> : null}
        <Vec x={cartX + 34} y={gy - 34} dx={(t < 2 ? 3 : t < 2.6 ? lerp(3, 2, seg(t, 2, 2.6)) : 2) * 9} label={t < 2 ? "υ = 3" : "V = 2"} />
        {N > 0.05 ? <Vec x={cartX} y={gy + 2} dx={0} dy={-N * 70} color={C.F} label="N (μεγάλη)" labelSide="right" width={3.4} /> : null}
        <Tag x={14} y={24} s="κρούση · αργή κίνηση" color={C.F} show={t > 2 && t < 2.6} />
        <Bars
          y={142}
          max={13}
          title="ορμή συστήματος ανά άξονα"
          items={[
            { label: "p_x", value: 12, color: C.ink },
            { label: "p_y", value: t < 2 ? -10 * (t / tc) : t < 2.6 ? -10 * (1 - seg(t, 2, 2.6)) : 0, color: C.F },
          ]}
        />
        <T x={180} y={190} s="p_x σταθερή ✓ · p_y χάνεται (το δάπεδο την «απορροφά»)" size={9.5} color={C.muted} bold={false} />
      </g>
    );
  },
  solve: (
    <>
      Στον x: Mυ = (M + m)V ⇒ 4·3 = 6V ⇒ <b>V = 2 m/s</b>. Στον y δεν γράφεις ΑΔΟ.
    </>
  ),
  trap: "Η ΑΔΟ μπορεί να ισχύει σε έναν άξονα και όχι στον άλλο. Γράφεις μόνο εκεί που ΣF_εξ = 0.",
};

/* ═════════════ ΕΝΟΤΗΤΑ 7 · Κρούσεις χωρίς συσσωμάτωση και δυνάμεις επαφής ═════════════ */

const case31: Case = {
  n: 31,
  given: "m_1 = 3 kg με 6 m/s, m_2 = 1 kg ακίνητο. Μετά το m_2 φεύγει με 6 m/s.",
  ask: "Την ταχύτητα υ′_1 και τη θερμότητα Q.",
  what: "Μια σφαίρα χτυπά μια μικρότερη, ακίνητη, και φεύγουν χωριστά, αλλά χάνεται λίγη ενέργεια. Δείχνει την ανελαστική κρούση (χωρίς να κολλήσουν).",
  title: "Ανελαστική κρούση",
  period: 6,
  legend: ["v", "F", "p", "K"],
  phases: [
    { until: 2, label: "Πριν", say: "Σφαίρα 3 kg με 6 m/s χτυπά ακίνητη σφαίρα 1 kg. Αυτή τη φορά ΔΕΝ θα κολλήσουν." },
    { until: 2.7, label: "Κρούση", say: "Μετά την κρούση έχουμε δύο ταχύτητες. Η ΑΔΟ είναι μία εξίσωση, άρα πρέπει να μας δίνουν τη μία από τις δύο." },
    { until: 6, label: "Μετά", say: "Η μικρή φεύγει με 6 m/s, άρα 18 = 3υ′₁ + 6 ⇒ υ′₁ = 4 m/s. Η κινητική έπεσε από 54 σε 42 J: χάθηκαν 12 J." },
  ],
  Scene: ({ t }) => <CollisionScene t={t} c={{ m1: 3, m2: 1, u1: 6, u2: 0, v1: 4, v2: 6, S: 10, showK: true, widths: [40, 28], barMax: 58 }} />,
  solve: (
    <>
      m₁υ₁ = m₁υ′₁ + m₂υ′₂ ⇒ 18 = 3υ′₁ + 6 ⇒ <b>υ′₁ = 4 m/s</b>. Q = 54 − (24 + 18) = <b>12 J</b>.
    </>
  ),
  trap: "Ανελαστική δεν σημαίνει πλαστική. Πλαστική είναι μόνο όταν κολλάνε.",
};

const case32: Case = {
  n: 32,
  given: "m_1 = m_2 = 1 kg, υ_1 = 4 m/s, m_2 ακίνητο. Ελαστική μετωπική κρούση.",
  ask: "Τις ταχύτητες μετά, υ′_1 και υ′_2.",
  what: "Ένα αμαξάκι χτυπά ένα ίδιο ακίνητο: το πρώτο σταματά και το δεύτερο φεύγει, όπως στο μπιλιάρδο. Δείχνει την ελαστική κρούση ίσων μαζών.",
  title: "Ίσες μάζες (ελαστική)",
  period: 6,
  legend: ["v", "F", "p", "K"],
  phases: [
    { until: 2, label: "Πριν", say: "Δύο ίδια αμαξάκια (1 kg). Το πρώτο τρέχει με 4 m/s, το δεύτερο είναι ακίνητο. Η κρούση είναι ελαστική και μετωπική." },
    { until: 2.7, label: "Κρούση", say: "Στην ελαστική κρούση διατηρείται και η ορμή και η κινητική ενέργεια." },
    { until: 6, label: "Μετά", say: "Το πρώτο σταματά επιτόπου και το δεύτερο φεύγει με 4 m/s. Αντάλλαξαν ταχύτητες! (Όπως στο μπιλιάρδο.)" },
  ],
  Scene: ({ t }) => <CollisionScene t={t} c={{ m1: 1, m2: 1, u1: 4, u2: 0, v1: 0, v2: 4, S: 13, showK: true, widths: [34, 34], barMax: 9 }} />,
  solve: (
    <>
      ΑΔΟ: 1·4 = 1·υ′₁ + 1·υ′₂ και K: ½·16 = ½υ′₁² + ½υ′₂² ⇒ <b>υ′₁ = 0, υ′₂ = 4 m/s</b>.
    </>
  ),
  trap: "Ισχύει μόνο για ίσες μάζες σε ελαστική μετωπική κρούση. Με άνισες μάζες δεν ανταλλάσσουν ταχύτητες.",
};

/* 33. Δύναμη από το έδαφος: m = 2 kg, υ1 = 10 ↓, υ2 = 6 ↑, Δt = 0,1 s */
const case33: Case = {
  n: 33,
  given: "m = 2 kg, φτάνει με 10 m/s κάτω, φεύγει με 6 m/s πάνω, επαφή Δt = 0,1 s, g = 10 m/s².",
  ask: "Τη μέση δύναμη N που ασκεί το έδαφος.",
  what: "Μια μπάλα χτυπά στο πάτωμα και αναπηδά, και φαίνονται οι δυνάμεις στη στιγμή της επαφής. Δείχνει πόση δύναμη ασκεί το πάτωμα, μαζί με το βάρος.",
  title: "Δύναμη από το έδαφος",
  period: 5.5,
  legend: ["v", "F"],
  phases: [
    { until: 1.4, label: "Πτώση", say: "Σφαίρα 2 kg χτυπά το έδαφος με 10 m/s." },
    {
      until: 2.4,
      label: "Επαφή 0,1 s",
      say: "Στην επαφή ασκούνται ΔΥΟ δυνάμεις: η N από το έδαφος (πάνω) και το βάρος mg (κάτω). Ο τύπος Δp/Δt δίνει τη συνισταμένη τους.",
    },
    { until: 5.5, label: "Αναπήδηση", say: "ΣF = 32/0,1 = 320 N. Άρα N = ΣF + mg = 340 N. Κοίτα πόσο μικρό είναι το βάρος δίπλα στη N!" },
  ],
  Scene: ({ t }) => {
    const gy = 176;
    const r = 11;
    const S = 20;
    const f = 1.4;
    let cy: number;
    let vUp: number;
    if (t < 1.4) {
      const tau = t / f;
      cy = gy - r - S * (5 - 5 * tau * tau);
      vUp = -10 * tau;
    } else if (t < 2.4) {
      const k = seg(t, 1.4, 2.4);
      cy = gy - r + 2 * Math.sin(Math.PI * k);
      vUp = lerp(-10, 6, k);
    } else {
      const tau = Math.min((t - 2.4) / f, 0.6);
      cy = gy - r - S * (6 * tau - 5 * tau * tau);
      vUp = 6 - 10 * tau;
    }
    const contact = t >= 1.4 && t < 2.4;
    const x = 90;
    const sc = 0.3; // px per N
    return (
      <g>
        <Ground y={gy} x2={180} />
        <Ball cx={x} cy={cy} r={r} squash={contact ? 0.25 * Math.sin(Math.PI * seg(t, 1.4, 2.4)) : 0} axis="y" />
        <Vec x={x + 26} y={cy} dx={0} dy={-vUp * 4} label={vUp < 0 ? "υ_1" : vUp > 0.3 ? "υ_2" : undefined} />
        {contact ? (
          <g>
            <Vec x={x - 4} y={gy} dx={0} dy={-340 * sc} color={C.F} label="N = 340 N" labelSide="left" width={3.6} />
            <Vec x={x + 6} y={cy} dx={0} dy={20 * sc + 4} color={C.F} label="mg" labelSide="right" width={2.6} />
          </g>
        ) : (
          <Vec x={x} y={cy + r} dx={0} dy={20 * sc + 4} color={C.F} label="mg" labelSide="right" width={2.6} />
        )}
        <Tag x={14} y={24} s="αργή κίνηση" color={C.F} show={contact} />
        <rect x={196} y={34} width={156} height={104} rx={8} fill="#ffffff" stroke="#d6dae1" />
        <T x={204} y={52} s="θετική φορά ↑" size={10} color={C.muted} anchor="start" bold={false} />
        <T x={204} y={72} s="Δp = 2·6 − 2·(−10) = 32" size={10.5} color={C.p} anchor="start" />
        <T x={204} y={92} s="ΣF = Δp/Δt = 320 N" size={10.5} color={C.F} anchor="start" />
        <T x={204} y={112} s="N − mg = 320" size={10.5} color={C.F} anchor="start" />
        <T x={204} y={130} s="N = 340 N" size={11.5} color={C.F} anchor="start" />
        <Bars x={196} w={158} y={160} max={350} items={[{ label: "N", value: contact ? 340 : 0, color: C.F, unit: "N" }, { label: "mg", value: 20, color: C.F, unit: "N" }]} />
      </g>
    );
  },
  solve: (
    <>
      ΣF = Δp/Δt = 32/0,1 = 320 N ⇒ N − mg = 320 ⇒ <b>N = 340 N</b> (προς τα πάνω).
    </>
  ),
  trap: "Το Δp/Δt είναι η ΣΥΝΙΣΤΑΜΕΝΗ. Αν σε ρωτούν τη δύναμη του εδάφους, πρόσθεσε το βάρος.",
};

/* 34. Βλήμα μέσα στο ξύλο: m = 0,1 kg, υ = 100 m/s, M = 4,9 kg, d = 1 m */
const case34: Case = {
  n: 34,
  given: "Βλήμα m = 0,1 kg με 100 m/s, ξύλο M = 4,9 kg ακίνητο, λείο δάπεδο. Το βλήμα προχωρά d = 1 m μέσα στο ξύλο.",
  ask: "Τη δύναμη F ανάμεσα σε βλήμα και ξύλο.",
  what: "Ένα βλήμα μπαίνει σε ξύλο, προχωρά μέσα του 1 m και σταματά, ενώ το ξύλο κινείται ελάχιστα. Δείχνει ότι η θερμότητα που βγαίνει ισούται με δύναμη επί την απόσταση μέσα στο ξύλο.",
  title: "Βλήμα μέσα στο ξύλο",
  period: 7,
  legend: ["v", "F", "K"],
  phases: [
    { until: 1.2, label: "Πριν", say: "Βλήμα 0,1 kg με 100 m/s μπαίνει σε ξύλο 4,9 kg (λείο δάπεδο). Θα σταματήσει μέσα του, αφού διανύσει d = 1 m μέσα στο ξύλο." },
    {
      until: 4.2,
      label: "Διείσδυση",
      say: "Το ξύλο σπρώχνει το βλήμα πίσω με δύναμη F, και το βλήμα σπρώχνει το ξύλο μπροστά. Η τριβή ανάμεσά τους ζεσταίνει το ξύλο.",
    },
    { until: 7, label: "Κοινή V", say: "Κοινή ταχύτητα V = 2 m/s. Χάθηκαν Q = 490 J. Αυτή η θερμότητα είναι F επί τη ΣΧΕΤΙΚΗ μετατόπιση d: F = 490/1 = 490 N." },
  ],
  Scene: ({ t }) => {
    const gy = 120;
    const S = 120; // px per metre
    const k = seg(t, 1.2, 4.2);
    const tau = 0.02 * k; // phys seconds
    const dRel = 100 * tau - 2500 * tau * tau; // m, bullet relative to block
    const sBlock = 50 * tau * tau; // m
    const vb = 100 - 4900 * tau;
    const vB = 100 * tau;
    const blockLeft = 110 + S * sBlock;
    const bulletX = t < 1.2 ? blockLeft - 90 * (1.2 - t) : blockLeft + S * dRel;
    const Kb = 0.5 * 0.1 * vb * vb;
    const KB = 0.5 * 4.9 * vB * vB;
    const Q = 500 - Kb - KB;
    const inside = t >= 1.2;
    return (
      <g>
        <Ground y={gy} />
        <rect x={blockLeft} y={gy - 50} width={170} height={50} rx={3} fill={C.wood} stroke={C.edge} />
        <T x={blockLeft + 150} y={gy - 34} s="M" size={12} italic />
        {inside ? <line x1={blockLeft} y1={gy - 25} x2={bulletX - 8} y2={gy - 25} stroke="#7a5a3a" strokeWidth={3} opacity={0.6} /> : null}
        <Bullet x={bulletX} y={gy - 25} />
        {!inside ? <Vec x={Math.max(10, bulletX - 50)} y={gy - 40} dx={40} label="υ" /> : null}
        {inside && k < 1 ? (
          <g>
            <Vec x={bulletX - 10} y={gy - 25} dx={-26} color={C.F} label="F" width={2.8} labelSide="above" />
            <Vec x={bulletX + 2} y={gy - 8} dx={26} color={C.F} label="−F (στο ξύλο)" width={2.4} labelSide="below" />
          </g>
        ) : null}
        <line x1={blockLeft} y1={gy - 60} x2={blockLeft + S * dRel} y2={gy - 60} stroke={C.p} strokeWidth={2} />
        <T x={blockLeft + (S * dRel) / 2} y={gy - 66} s={inside ? `d = ${num(dRel, 2)} m` : ""} size={10.5} color={C.p} />
        <Heat cx={blockLeft + S * dRel * 0.6} cy={gy - 25} k={inside ? k : 0} />
        <T x={60} y={24} s={inside ? `ξύλο: s = ${num(sBlock * 100, 1)} cm μόνο` : ""} size={10} color={C.muted} bold={false} />
        <Bars
          y={142}
          max={520}
          title="ενέργειες (J)"
          items={[
            { label: "K_{βλ}", value: Kb, color: C.K, unit: "J" },
            { label: "K_{ξύλ}", value: KB, color: C.K, unit: "J" },
            { label: "Q = F·d", value: inside ? Q : 0, color: "#e2571e", unit: "J" },
          ]}
        />
      </g>
    );
  },
  solve: (
    <>
      ΑΔΟ: 0,1·100 = 5V ⇒ V = 2 m/s. Q = 500 − 10 = 490 J. Q = F·d ⇒ <b>F = 490 N</b>.
    </>
  ),
  trap: "Στο Q = F·d, το d είναι πόσο προχώρησε το βλήμα ΜΕΣΑ στο ξύλο, όχι πόσο μετακινήθηκε ως προς το έδαφος.",
};

/* 35. Μαλακή «προσγείωση»: 0,5 kg με 6 m/s σταματά · σκληρό Δt = 0,02 s, στρώμα Δt = 0,2 s */
const case35: Case = {
  n: 35,
  given: "m = 0,5 kg, φτάνει με 6 m/s και σταματά. Πλακάκι: Δt = 0,02 s. Στρώμα: Δt = 0,2 s.",
  ask: "Τη μέση δύναμη σε κάθε περίπτωση.",
  what: "Δύο ίδιες μπάλες πέφτουν, η μία σε πλακάκι και η άλλη σε στρώμα. Δείχνει γιατί το μαλακό «σε σώζει»: ίδια αλλαγή ορμής σε περισσότερο χρόνο, άρα μικρότερη δύναμη.",
  title: "Μαλακή «προσγείωση»",
  period: 6,
  legend: ["v", "F"],
  phases: [
    { until: 1.5, label: "Πτώση", say: "Δύο ίδιες μπάλες (0,5 kg) φτάνουν με 6 m/s: η μία σε πλακάκι, η άλλη σε στρώμα. Και οι δύο θα σταματήσουν." },
    {
      until: 3.2,
      label: "Φρενάρισμα",
      say: "Ίδια Δp = 3 kg·m/s για τις δύο. Στο πλακάκι σταματά σχεδόν ακαριαία, στο στρώμα «βουλιάζει» αργά.",
    },
    {
      until: 6,
      label: "Σύγκριση",
      say: "Τα εμβαδά στα δύο διαγράμματα είναι ίσα (= Δp). Μεγάλο Δt ⇒ μικρή δύναμη. Γι' αυτό ζώνη, αερόσακος και στρώματα σώζουν ζωές.",
    },
  ],
  Scene: ({ t }) => {
    const lanes = [
      { x: 90, label: "πλακάκι", dt: 0.02, F: 150, stopAnim: 0.15, color: C.F },
      { x: 270, label: "στρώμα", dt: 0.2, F: 15, stopAnim: 1.5, color: C.p },
    ];
    const gy = 92;
    return (
      <g>
        {lanes.map((l) => {
          const falling = t < 1.5;
          const k = clamp((t - 1.5) / l.stopAnim, 0, 1);
          const sink = l.label === "στρώμα" ? 14 * (2 * k - k * k) : 0;
          const cy = falling ? gy - 10 - 50 * (1 - t / 1.5) : gy - 10 + sink;
          const v = falling ? 6 : 6 * (1 - k);
          const force = !falling && k < 1 ? 1 : 0;
          return (
            <g key={l.label}>
              {l.label === "στρώμα" ? <rect x={l.x - 50} y={gy - 4} width={100} height={22} rx={6} fill="#cfe3c8" stroke={C.edge} /> : <rect x={l.x - 50} y={gy} width={100} height={8} fill="#c9ccd3" stroke={C.edge} />}
              <T x={l.x} y={gy + 34} s={l.label} size={10.5} color={C.muted} />
              <Ball cx={l.x} cy={cy} r={10} squash={l.label === "πλακάκι" && force ? 0.3 : 0} axis="y" />
              <Vec x={l.x + 22} y={cy - 12} dx={0} dy={v * 4} label="υ" />
              {force ? <Vec x={l.x - 22} y={gy} dx={0} dy={-(l.F / 150) * 60 - 6} color={C.F} label="F" labelSide="left" width={3.2} /> : null}
              <MiniGraph
                x={l.x - 70}
                y={140}
                w={140}
                h={50}
                tMax={0.22}
                yMin={0}
                yMax={160}
                fn={(u) => (u < l.dt ? l.F : 0)}
                tNow={falling ? 0 : Math.min(0.22, k * l.dt + (k >= 1 ? 0.22 : 0))}
                color={l.color}
                fillArea
                yLabel={`F_μ = ${l.F} N`}
                ghost={false}
              />
            </g>
          );
        })}
        <T x={180} y={24} s="ίδια Δp = 3 kg·m/s" size={11} color={C.p} />
      </g>
    );
  },
  solve: (
    <>
      Δp = 0,5·6 = 3 kg·m/s. Μέση ΣF: πλακάκι 3/0,02 = <b>150 N</b>, στρώμα 3/0,2 = <b>15 N</b>. Η δύναμη από την επιφάνεια είναι ΣF + mg: 155 N έναντι 20 N.
    </>
  ),
  trap: "Το στρώμα δεν μικραίνει τη Δp. Μεγαλώνει τον χρόνο Δt, κι έτσι μικραίνει τη δύναμη.",
};

export const section6: Case[] = [case26, case27, case28, case29, case30];
export const section7: Case[] = [case31, case32, case33, case34, case35];
