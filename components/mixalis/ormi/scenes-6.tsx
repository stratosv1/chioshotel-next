"use client";

import { Ball, Bars, Burst, C, Cart, Ground, StickPerson, T, Vec, clamp, lerp, seg, type Case } from "./kit";
import { CollisionScene } from "./collide";

/* ═════════════ ΕΝΟΤΗΤΑ 9 · Ειδικές περιπτώσεις ═════════════ */

/* 41. Ελαστική με άνισες μάζες: 1 kg · 6 m/s → ακίνητο 3 kg ⇒ −3 και +3 m/s */
const case41: Case = {
  n: 41,
  given: "m_1 = 1 kg με 6 m/s χτυπά ελαστικά και μετωπικά ακίνητο m_2 = 3 kg. Μετά το m_1 γυρίζει πίσω με 3 m/s.",
  ask: "Την ταχύτητα υ′_2 και να ελέγξεις ότι η κρούση είναι ελαστική.",
  what: "Ένα ελαφρύ αμαξάκι χτυπά ένα βαρύ ακίνητο και αναπηδά προς τα πίσω, ενώ το βαρύ φεύγει μπροστά. Δείχνει την ελαστική κρούση με άνισες μάζες: διατηρούνται και η ορμή και η κινητική ενέργεια.",
  title: "Ελαστική με άνισες μάζες",
  period: 6,
  legend: ["v", "F", "p", "K"],
  phases: [
    { until: 2, label: "Πριν", say: "Το ελαφρύ (1 kg) τρέχει με 6 m/s προς το βαρύ (3 kg), που είναι ακίνητο. p = 6 kg·m/s, K = 18 J." },
    { until: 2.7, label: "Κρούση", say: "Ελαστική κρούση: τα σώματα παραμορφώνονται λίγο και επανέρχονται. Δεν γίνεται θερμότητα." },
    {
      until: 6,
      label: "Μετά",
      say: "Το ελαφρύ γυρίζει πίσω με 3 m/s, το βαρύ φεύγει με 3 m/s. Ορμή: −3 + 9 = 6 ✓. Κινητική: 4,5 + 13,5 = 18 J ✓. Και τα δύο διατηρήθηκαν.",
    },
  ],
  Scene: ({ t }) => <CollisionScene t={t} c={{ m1: 1, m2: 3, u1: 6, u2: 0, v1: -3, v2: 3, S: 11, showK: true, widths: [30, 46], barMax: 20 }} />,
  solve: (
    <>
      ΑΔΟ: 1·6 + 0 = 1·(−3) + 3·υ′₂ ⇒ <b>υ′₂ = 3 m/s</b>. Έλεγχος: K πριν = ½·1·6² = 18 J, K μετά = ½·1·3² + ½·3·3² = 4,5 + 13,5 = 18 J ⇒{" "}
      <b>ελαστική</b>.
    </>
  ),
  trap: "Ελαφρύ σώμα που χτυπά ελαστικά βαρύ ακίνητο γυρίζει πίσω: η ταχύτητά του μπαίνει με «−». Για να πεις «ελαστική» πρέπει να ελέγξεις την K, όχι την ορμή.",
};

/* 42. Έκρηξη σε τρία κομμάτια: 1 kg ανατολικά 6 m/s, 2 kg βόρεια 3 m/s, 3 kg; */
const case42: Case = {
  n: 42,
  given: "Ακίνητο σώμα 6 kg σπάει σε τρία κομμάτια. 1 kg φεύγει ανατολικά με 6 m/s, 2 kg βόρεια με 3 m/s (κάτοψη).",
  ask: "Το μέτρο και την κατεύθυνση της ταχύτητας υ_3 του κομματιού 3 kg.",
  what: "Από πάνω (κάτοψη) ένα ακίνητο σώμα εκρήγνυται σε τρία κομμάτια που φεύγουν προς διαφορετικές κατευθύνσεις. Δείχνει ότι τα τρία βέλη ορμής κλείνουν τρίγωνο, γιατί το άθροισμά τους πρέπει να είναι μηδέν.",
  title: "Έκρηξη σε τρία κομμάτια",
  period: 7,
  legend: ["v", "p"],
  phases: [
    { until: 1.2, label: "Πριν", say: "Ακίνητο σώμα 6 kg: ολική ορμή μηδέν." },
    { until: 1.9, label: "Έκρηξη", say: "Σπάει σε τρία κομμάτια. Οι δυνάμεις της έκρηξης είναι εσωτερικές, άρα p⃗₁ + p⃗₂ + p⃗₃ = 0." },
    {
      until: 7,
      label: "Μετά",
      say: "p₁ = 6 ανατολικά, p₂ = 6 βόρεια. Το τρίτο πρέπει να «κλείσει» το τρίγωνο: p₃ = 6√2 ≈ 8,5 kg·m/s προς τα νοτιοδυτικά, άρα υ₃ ≈ 2,8 m/s.",
    },
  ],
  Scene: ({ t }) => {
    const P = { x: 112, y: 104 };
    const after = Math.min(1.7, Math.max(0, t - 1.2));
    const S = 7;
    const exploded = t > 1.2;
    const v3 = (6 * Math.SQRT2) / 3;
    const d3 = (v3 * S * after) / Math.SQRT2;
    const g1 = seg(t, 2.2, 2.9);
    const g2 = seg(t, 3.0, 3.7);
    const g3 = seg(t, 3.9, 4.6);
    const ox = 238;
    const oy = 150;
    const u = 9; // px per kg·m/s
    return (
      <g>
        <rect x={6} y={8} width={210} height={196} rx={8} fill="#eef5ee" opacity={0.6} />
        <T x={14} y={22} s="κάτοψη (λείο οριζόντιο)" size={9.5} color={C.muted} anchor="start" bold={false} />
        <T x={206} y={22} s="Β ↑" size={9.5} color={C.muted} anchor="end" bold={false} />
        {!exploded ? (
          <circle cx={P.x} cy={P.y} r={17} fill="#d9c9a3" stroke={C.edge} />
        ) : (
          <g>
            <Ball cx={P.x + 14 + S * 6 * after} cy={P.y} r={9} fill={C.b1} label="1" />
            <Ball cx={P.x} cy={P.y - 14 - S * 3 * after} r={11} fill={C.b2} label="2" />
            <Ball cx={P.x - 12 - d3} cy={P.y + 12 + d3} r={13} fill="#c9b6e4" label="3" />
            {after > 0.3 ? (
              <g>
                <Vec x={P.x + 12 + S * 6 * after} y={P.y - 16} dx={26} label="6 m/s" labelSide="above" />
                <Vec x={P.x + 16} y={P.y - 20 - S * 3 * after} dx={0} dy={-18} label="3 m/s" labelSide="right" />
                <Vec x={P.x - 24 - d3} y={P.y + 24 + d3} dx={-14} dy={14} label="υ_3" labelSide="left" />
              </g>
            ) : null}
          </g>
        )}
        <Burst cx={P.x} cy={P.y} k={seg(t, 1.2, 1.9)} />
        <rect x={222} y={30} width={132} height={146} rx={8} fill="#ffffff" stroke="#d6dae1" />
        <T x={230} y={44} s="ορμές (kg·m/s)" size={9.5} color={C.muted} anchor="start" bold={false} />
        {g1 > 0 ? <Vec x={ox} y={oy} dx={6 * u * g1} color={C.p} label={g1 > 0.9 ? "p_1 = 6" : undefined} labelSide="below" /> : null}
        {g2 > 0 ? <Vec x={ox + 6 * u} y={oy} dx={0} dy={-6 * u * g2} color={C.p} label={g2 > 0.9 ? "p_2 = 6" : undefined} labelSide="right" /> : null}
        {g3 > 0 ? (
          <Vec
            x={ox + 6 * u}
            y={oy - 6 * u}
            dx={-6 * u * g3}
            dy={6 * u * g3}
            color={C.ink}
            width={3.2}
            label={g3 > 0.9 ? "p_3 ≈ 8,5" : undefined}
            labelSide="left"
          />
        ) : null}
        <T x={288} y={194} s={t > 4.6 ? "κλειστό τρίγωνο ⇒ Σp = 0" : ""} size={10.5} color={C.p} />
      </g>
    );
  },
  solve: (
    <>
      p⃗₁ + p⃗₂ + p⃗₃ = 0. x: 1·6 + 0 + p₃ₓ = 0 ⇒ p₃ₓ = −6 · y: 0 + 2·3 + p₃ᵧ = 0 ⇒ p₃ᵧ = −6. <b>p₃ = 6√2 ≈ 8,5 kg·m/s</b> ⇒ υ₃ = 8,5/3 ≈{" "}
      <b>2,8 m/s</b>, προς τα νοτιοδυτικά (45°).
    </>
  ),
  trap: "Δεν αρκεί να βρεις το μέτρο: το τρίτο κομμάτι πάει αντίθετα από το άθροισμα των δύο άλλων. Και μην προσθέσεις 6 + 6 = 12: είναι κάθετα βέλη.",
};

/* 43. Άλμα από κινούμενο όχημα: καρότσι 100 kg + άνθρωπος 50 kg με 4 m/s, πηδά μπροστά με 8 m/s */
const case43: Case = {
  n: 43,
  given: "Καρότσι 100 kg με άνθρωπο 50 kg κινείται με 4 m/s σε λείο δρόμο. Ο άνθρωπος πηδά οριζόντια μπροστά με 8 m/s (ως προς το έδαφος).",
  ask: "Την ταχύτητα V του καροτσιού αμέσως μετά.",
  what: "Ένας άνθρωπος πάνω σε καρότσι που ήδη κινείται πηδά μπροστά, και το καρότσι επιβραδύνεται. Δείχνει ότι εδώ η ορμή πριν ΔΕΝ είναι μηδέν, σε αντίθεση με τη βάρκα (κουτάκι 14).",
  title: "Άλμα από κινούμενο όχημα",
  period: 6.5,
  legend: ["v", "p"],
  phases: [
    { until: 2, label: "Πριν", say: "Καρότσι και άνθρωπος κινούνται μαζί με 4 m/s: p = (100 + 50)·4 = 600 kg·m/s. Όχι μηδέν!" },
    { until: 2.7, label: "Άλμα", say: "Ο άνθρωπος σπρώχνει το καρότσι προς τα πίσω και αυτό σπρώχνει τον άνθρωπο μπροστά: εσωτερικές δυνάμεις, η ορμή μένει 600." },
    { until: 6.5, label: "Μετά", say: "Άνθρωπος: 50·8 = 400. Το καρότσι κρατά 600 − 400 = 200 ⇒ V = 200/100 = 2 m/s. Επιβραδύνθηκε από 4 σε 2 m/s." },
  ],
  Scene: ({ t }) => {
    const gy = 96;
    const S = 6;
    const tj = 2;
    const after = Math.max(0, Math.min(t - tj, 3));
    const xBefore = 60 + S * 4 * Math.min(t, tj);
    const xCart = t < tj ? xBefore : xBefore + S * 2 * after;
    const xMan = t < tj ? xBefore : xBefore + S * 8 * after;
    const jump = t >= tj ? Math.sin(Math.PI * clamp(after / 1.6)) * 22 : 0;
    const manY = t < tj ? gy - 24 : after < 1.6 ? gy - 24 - jump : lerp(gy - 24, gy, clamp((after - 1.6) / 0.3));
    const cartV = t < tj ? 4 : 2;
    const pMan = t < tj ? 200 : 400;
    const pCart = t < tj ? 400 : 200;
    return (
      <g>
        <Ground y={gy} />
        <Cart cx={xCart} y={gy} w={64} label="100 kg" fill={C.b1} />
        <StickPerson x={Math.min(xMan, 340)} y={manY} step={t >= tj ? t * 6 : 0} scale={0.75} />
        {t < tj ? (
          <Vec x={xCart - 10} y={gy - 64} dx={4 * 8} label="4 m/s (μαζί)" labelSide="above" />
        ) : (
          <g>
            <Vec x={xCart - 30} y={gy - 40} dx={cartV * 8} label="V = 2" labelSide="above" />
            {xMan < 320 ? <Vec x={Math.min(xMan, 340) + 8} y={manY - 40} dx={8 * 4} label="8 m/s" labelSide="above" /> : null}
          </g>
        )}
        <Bars
          y={128}
          max={650}
          items={[
            { label: "p_{άνθρ}", value: pMan },
            { label: "p_{καρ}", value: pCart },
            { label: "p_{ολ}", value: 600, color: C.ink },
          ]}
        />
        <T x={180} y={196} s="p πριν = 600 ≠ 0 (κινούνταν ήδη)" size={10} color={C.muted} bold={false} />
      </g>
    );
  },
  solve: (
    <>
      (M + m)·u = M·V + m·υ ⇒ 150·4 = 100·V + 50·8 ⇒ 600 = 100V + 400 ⇒ <b>V = 2 m/s</b> (ίδια φορά, πιο αργά).
    </>
  ),
  trap: "Μην γράψεις «0 = ...» όπως στη βάρκα: το σύστημα κινούνταν ήδη. Και η ταχύτητα του ανθρώπου μπαίνει ως προς το έδαφος.",
};

export const section9: Case[] = [case41, case42, case43];
