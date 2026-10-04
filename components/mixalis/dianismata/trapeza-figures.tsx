import { Arrow, COLORS } from "../omali/shared";

const A_COLOR = COLORS.velocity;
const B_COLOR = COLORS.accel;

function Dot({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={3} fill={COLORS.ink} />;
}

function Label({ x, y, children, color = COLORS.ink }: { x: number; y: number; children: string; color?: string }) {
  return (
    <text x={x} y={y} fontSize={14} fontWeight={600} fill={color} textAnchor="middle" dominantBaseline="middle">
      {children}
    </text>
  );
}

/** 22055 · Δύο τρίγωνα με BA = B΄A΄ και AΓ = A΄Γ΄. */
export function Fig22055() {
  const tri = (dx: number, prime: string) => {
    const B = { x: 25 + dx, y: 105 };
    const A = { x: 95 + dx, y: 35 };
    const G = { x: 185 + dx, y: 105 };
    return (
      <g>
        <line x1={B.x} y1={B.y} x2={G.x} y2={G.y} stroke={COLORS.track} strokeWidth={2} />
        <Arrow x1={B.x} y1={B.y} x2={A.x} y2={A.y} color={A_COLOR} />
        <Arrow x1={A.x} y1={A.y} x2={G.x} y2={G.y} color={B_COLOR} />
        <Label x={B.x - 12} y={B.y + 6}>{`Β${prime}`}</Label>
        <Label x={A.x} y={A.y - 13}>{`Α${prime}`}</Label>
        <Label x={G.x + 13} y={G.y + 6}>{`Γ${prime}`}</Label>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 430 130" className="mx-auto block w-full max-w-md" role="img" aria-label="Δύο τρίγωνα ΑΒΓ και Α΄Β΄Γ΄ με ίσα διανύσματα ΒΑ και ΑΓ">
      {tri(0, "")}
      {tri(215, "΄")}
    </svg>
  );
}

/** 22042 · Ορθογώνιο ΑΒΓΔ με κέντρο Ο, η ΔΓ χωρισμένη σε 4 ίσα τμήματα. */
export function Fig22042() {
  const L = 50;
  const R = 330;
  const T = 25;
  const Bt = 135;
  const step = (R - L) / 4;
  return (
    <svg viewBox="0 0 380 170" className="mx-auto block w-full max-w-md" role="img" aria-label="Ορθογώνιο ΑΒΓΔ με κέντρο Ο και σημεία Κ, Λ, Μ στην ΔΓ">
      <rect x={L} y={T} width={R - L} height={Bt - T} fill="none" stroke={COLORS.track} strokeWidth={2} />
      <line x1={L} y1={T} x2={R} y2={Bt} stroke={COLORS.grid} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1={R} y1={T} x2={L} y2={Bt} stroke={COLORS.grid} strokeWidth={1.5} strokeDasharray="4 4" />
      <Arrow x1={L} y1={Bt} x2={L + step} y2={Bt} color={A_COLOR} width={3.5} />
      <Arrow x1={L} y1={Bt} x2={L} y2={T} color={B_COLOR} width={3.5} />
      {[1, 2, 3].map((i) => (
        <Dot key={i} x={L + i * step} y={Bt} />
      ))}
      <Dot x={(L + R) / 2} y={(T + Bt) / 2} />
      <Label x={L - 14} y={T}>Α</Label>
      <Label x={R + 14} y={T}>Β</Label>
      <Label x={R + 14} y={Bt}>Γ</Label>
      <Label x={L - 14} y={Bt}>Δ</Label>
      <Label x={L + step} y={Bt + 17}>Κ</Label>
      <Label x={L + 2 * step} y={Bt + 17}>Λ</Label>
      <Label x={L + 3 * step} y={Bt + 17}>Μ</Label>
      <Label x={(L + R) / 2 + 12} y={(T + Bt) / 2 - 10}>Ο</Label>
      <Label x={L + step / 2} y={Bt - 13} color={A_COLOR}>α</Label>
      <Label x={L + 13} y={(T + Bt) / 2} color={B_COLOR}>β</Label>
    </svg>
  );
}

/** 21885 · Τρίγωνο ΑΒΓ με Δ στην ΑΒ και Ε στην ΑΓ. */
export function Fig21885({ midpoints = false }: { midpoints?: boolean }) {
  const A = { x: 210, y: 18 };
  const B = { x: 45, y: 175 };
  const G = { x: 315, y: 175 };
  const t1 = midpoints ? 0.5 : 0.42;
  const t2 = midpoints ? 0.5 : 0.55;
  const D = { x: A.x + (B.x - A.x) * t1, y: A.y + (B.y - A.y) * t1 };
  const E = { x: A.x + (G.x - A.x) * t2, y: A.y + (G.y - A.y) * t2 };
  return (
    <svg viewBox="0 0 360 200" className="mx-auto block w-full max-w-sm" role="img" aria-label="Τρίγωνο ΑΒΓ με σημεία Δ στην ΑΒ και Ε στην ΑΓ">
      <line x1={B.x} y1={B.y} x2={G.x} y2={G.y} stroke={COLORS.track} strokeWidth={2} />
      <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke={COLORS.ink} strokeWidth={2} />
      <Arrow x1={A.x} y1={A.y} x2={B.x} y2={B.y} color={A_COLOR} />
      <Arrow x1={A.x} y1={A.y} x2={G.x} y2={G.y} color={B_COLOR} />
      <Dot x={D.x} y={D.y} />
      <Dot x={E.x} y={E.y} />
      <Label x={A.x} y={A.y - 10}>Α</Label>
      <Label x={B.x - 12} y={B.y + 6}>Β</Label>
      <Label x={G.x + 12} y={G.y + 6}>Γ</Label>
      <Label x={D.x - 14} y={D.y - 6}>Δ</Label>
      <Label x={E.x + 14} y={E.y - 6}>Ε</Label>
      <Label x={(A.x + B.x) / 2 - 20} y={(A.y + B.y) / 2 + 30} color={A_COLOR}>α</Label>
      <Label x={(A.x + G.x) / 2 + 22} y={(A.y + G.y) / 2 + 30} color={B_COLOR}>β</Label>
    </svg>
  );
}

/** 22068 · Τρεις δυνάμεις ανά δύο 120°. Με withSum δείχνει και το Δ (πέρας του F1 + F2). */
export function Fig22068({ withSum = false }: { withSum?: boolean }) {
  const O = { x: 175, y: 110 };
  const r = 78;
  const at = (deg: number, len = r) => ({
    x: O.x + len * Math.cos((deg * Math.PI) / 180),
    y: O.y - len * Math.sin((deg * Math.PI) / 180),
  });
  const A = at(120);
  const B = at(0);
  const G = at(240);
  const D = at(60);
  return (
    <svg viewBox="0 0 330 210" className="mx-auto block w-full max-w-[17rem]" role="img" aria-label="Τρεις δυνάμεις F1, F2, F3 που σχηματίζουν ανά δύο γωνία 120 μοιρών">
      {withSum ? (
        <g>
          <line x1={A.x} y1={A.y} x2={D.x} y2={D.y} stroke={COLORS.track} strokeWidth={1.5} strokeDasharray="5 4" />
          <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke={COLORS.track} strokeWidth={1.5} strokeDasharray="5 4" />
          <line x1={G.x} y1={G.y} x2={D.x} y2={D.y} stroke={COLORS.grid} strokeWidth={1.5} />
          <Arrow x1={O.x} y1={O.y} x2={D.x} y2={D.y} color={COLORS.ok} dashed />
          <Label x={D.x + 10} y={D.y - 10} color={COLORS.ok}>Δ</Label>
        </g>
      ) : null}
      <Arrow x1={O.x} y1={O.y} x2={A.x} y2={A.y} color={A_COLOR} />
      <Arrow x1={O.x} y1={O.y} x2={B.x} y2={B.y} color={B_COLOR} />
      <Arrow x1={O.x} y1={O.y} x2={G.x} y2={G.y} color={COLORS.force} />
      <Dot x={O.x} y={O.y} />
      <Label x={O.x - 14} y={O.y + 4}>Ο</Label>
      <Label x={A.x - 10} y={A.y - 10}>Α</Label>
      <Label x={B.x + 13} y={B.y}>Β</Label>
      <Label x={G.x - 10} y={G.y + 12}>Γ</Label>
      <Label x={(O.x + A.x) / 2 - 18} y={(O.y + A.y) / 2} color={A_COLOR}>F₁</Label>
      <Label x={(O.x + B.x) / 2} y={O.y - 13} color={B_COLOR}>F₂</Label>
      <Label x={(O.x + G.x) / 2 - 18} y={(O.y + G.y) / 2} color={COLORS.force}>F₃</Label>
    </svg>
  );
}

/** 21165 · Παραλληλόγραμμο ΑΒΓΔ, Ε στην προέκταση της ΒΑ, Ζ στην ΑΔ. */
export function Fig21165() {
  // Συντεταγμένες «κόσμου»: Α=(0,0), α=(4,0), β=(1,2.4).
  const U = 52;
  const ox = 110;
  const oy = 150;
  const p = (x: number, y: number) => ({ x: ox + x * U, y: oy - y * U });
  const A = p(0, 0);
  const B = p(4, 0);
  const D = p(1, 2.4);
  const G = p(5, 2.4);
  const E = p(-2, 0);
  const Z = p(1 / 3, 0.8);
  return (
    <svg viewBox="0 0 420 180" className="mx-auto block w-full max-w-md" role="img" aria-label="Παραλληλόγραμμο ΑΒΓΔ με σημεία Ε και Ζ συνευθειακά με το Γ">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${G.x},${G.y} ${D.x},${D.y}`} fill="none" stroke={COLORS.track} strokeWidth={2} />
      <line x1={E.x} y1={E.y} x2={A.x} y2={A.y} stroke={COLORS.track} strokeWidth={2} strokeDasharray="5 4" />
      <line x1={E.x} y1={E.y} x2={G.x} y2={G.y} stroke={COLORS.ink} strokeWidth={1.5} />
      <line x1={A.x} y1={A.y} x2={G.x} y2={G.y} stroke={COLORS.grid} strokeWidth={1.5} />
      <Arrow x1={A.x} y1={A.y} x2={B.x} y2={B.y} color={A_COLOR} />
      <Arrow x1={A.x} y1={A.y} x2={D.x} y2={D.y} color={B_COLOR} />
      {[E, Z, G].map((pt, i) => (
        <Dot key={i} x={pt.x} y={pt.y} />
      ))}
      <Label x={A.x} y={A.y + 15}>Α</Label>
      <Label x={B.x + 4} y={B.y + 15}>Β</Label>
      <Label x={G.x + 12} y={G.y - 6}>Γ</Label>
      <Label x={D.x - 4} y={D.y - 12}>Δ</Label>
      <Label x={E.x - 4} y={E.y + 15}>Ε</Label>
      <Label x={Z.x - 13} y={Z.y - 5}>Ζ</Label>
      <Label x={(A.x + B.x) / 2} y={A.y - 11} color={A_COLOR}>α</Label>
      <Label x={(A.x + D.x) / 2 + 12} y={(A.y + D.y) / 2 + 20} color={B_COLOR}>β</Label>
    </svg>
  );
}

/** 18878 · Η διαδρομή του εξερευνητή O → A → B → T σε πλέγμα. */
export function Fig18878() {
  const U = 26;
  const ox = 40;
  const oy = 250;
  const s3 = Math.sqrt(3);
  const p = (x: number, y: number) => ({ x: ox + x * U, y: oy - y * U });
  const O = p(0, 0);
  const A = p(1, 1);
  const B = p(3, 5);
  const T = p(5, 5 * s3);
  return (
    <svg viewBox="0 0 230 275" className="mx-auto block w-full max-w-[15rem]" role="img" aria-label="Διαδρομή Ο, Α, Β, Τ σε ορθογώνιο σύστημα αξόνων">
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`v${i}`} x1={ox + i * U} y1={oy - 9 * U} x2={ox + i * U} y2={oy} stroke={COLORS.grid} strokeWidth={1} />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <line key={`h${i}`} x1={ox} y1={oy - i * U} x2={ox + 7 * U} y2={oy - i * U} stroke={COLORS.grid} strokeWidth={1} />
      ))}
      <Arrow x1={ox} y1={oy} x2={ox + 7.4 * U} y2={oy} color={COLORS.muted} width={1.5} head={7} />
      <Arrow x1={ox} y1={oy} x2={ox} y2={oy - 9.4 * U} color={COLORS.muted} width={1.5} head={7} />
      <Arrow x1={O.x} y1={O.y} x2={T.x} y2={T.y} color={COLORS.ok} dashed width={2} />
      <Arrow x1={O.x} y1={O.y} x2={A.x} y2={A.y} color={COLORS.ink} width={2.5} head={8} />
      <Arrow x1={A.x} y1={A.y} x2={B.x} y2={B.y} color={A_COLOR} width={2.5} />
      <Arrow x1={B.x} y1={B.y} x2={T.x} y2={T.y} color={B_COLOR} width={2.5} />
      {[A, B, T].map((pt, i) => (
        <Dot key={i} x={pt.x} y={pt.y} />
      ))}
      <Label x={O.x - 10} y={O.y + 12}>O</Label>
      <Label x={A.x + 12} y={A.y + 4}>A</Label>
      <Label x={B.x - 12} y={B.y - 4}>B</Label>
      <Label x={T.x + 4} y={T.y - 12}>T</Label>
      <text x={ox + 7.4 * U} y={oy + 14} fontSize={12} fill={COLORS.muted}>x</text>
      <text x={ox + 6} y={oy - 9.3 * U} fontSize={12} fill={COLORS.muted}>y</text>
    </svg>
  );
}

/** Παραλληλόγραμμο ΟΑΓΒ με τις δύο διαγωνίους (15320, 18520). */
export function FigParallelogramOAGB({
  aLabel = "α",
  bLabel = "β",
  aDeg = 0,
  bDeg = 60,
  showDiagonals = true,
  sumLabel = "α + β",
  diffLabel = "α − β",
  aFirst = true,
  aLen = 190,
  bLen = 140,
  diffDir = "BA",
}: {
  aLabel?: string;
  bLabel?: string;
  aDeg?: number;
  bDeg?: number;
  showDiagonals?: boolean;
  sumLabel?: string;
  diffLabel?: string;
  /** true: το Α είναι στο πέρας του α (ΟΑ = α). */
  aFirst?: boolean;
  aLen?: number;
  bLen?: number;
  /** Φορά της δεύτερης διαγωνίου: «BA» (= α − β) ή «AB» (= β − α). */
  diffDir?: "BA" | "AB";
}) {
  const O = { x: 50, y: 160 };
  const at = (deg: number, len: number) => ({
    x: len * Math.cos((deg * Math.PI) / 180),
    y: -len * Math.sin((deg * Math.PI) / 180),
  });
  const a = at(aDeg, aLen);
  const b = at(bDeg, bLen);
  const A = { x: O.x + a.x, y: O.y + a.y };
  const B = { x: O.x + b.x, y: O.y + b.y };
  const G = { x: O.x + a.x + b.x, y: O.y + a.y + b.y };
  const nameA = aFirst ? "Α" : "Β";
  const nameB = aFirst ? "Β" : "Α";
  return (
    <svg viewBox="0 0 330 180" className="mx-auto block w-full max-w-sm" role="img" aria-label="Παραλληλόγραμμο ΟΑΓΒ με τις διαγωνίους του">
      <line x1={A.x} y1={A.y} x2={G.x} y2={G.y} stroke={COLORS.track} strokeWidth={1.5} />
      <line x1={B.x} y1={B.y} x2={G.x} y2={G.y} stroke={COLORS.track} strokeWidth={1.5} />
      {showDiagonals ? (
        <g>
          <Arrow x1={O.x} y1={O.y} x2={G.x} y2={G.y} color={COLORS.ok} width={2.5} />
          {diffDir === "BA" ? (
            <Arrow x1={B.x} y1={B.y} x2={A.x} y2={A.y} color={COLORS.danger} width={2.5} dashed />
          ) : (
            <Arrow x1={A.x} y1={A.y} x2={B.x} y2={B.y} color={COLORS.danger} width={2.5} dashed />
          )}
          <text x={(O.x + G.x) / 2 - 6} y={(O.y + G.y) / 2 - 8} fontSize={13} fontWeight={600} fill={COLORS.ok} textAnchor="end">
            {sumLabel}
          </text>
          <text x={(A.x + B.x) / 2 + 8} y={(A.y + B.y) / 2 + 16} fontSize={13} fontWeight={600} fill={COLORS.danger}>
            {diffLabel}
          </text>
        </g>
      ) : null}
      <Arrow x1={O.x} y1={O.y} x2={A.x} y2={A.y} color={A_COLOR} width={3} />
      <Arrow x1={O.x} y1={O.y} x2={B.x} y2={B.y} color={B_COLOR} width={3} />
      <Dot x={O.x} y={O.y} />
      <Label x={O.x - 12} y={O.y + 6}>Ο</Label>
      <Label x={A.x + 6} y={A.y + 14}>{nameA}</Label>
      <Label x={B.x - 4} y={B.y - 12}>{nameB}</Label>
      <Label x={G.x + 10} y={G.y - 8}>Γ</Label>
      <Label x={(O.x + A.x) / 2} y={(O.y + A.y) / 2 + 14} color={A_COLOR}>{aLabel}</Label>
      <Label x={(O.x + B.x) / 2 - 14} y={(O.y + B.y) / 2} color={B_COLOR}>{bLabel}</Label>
    </svg>
  );
}

/** 15042 · Τρίγωνο ΑΒΓ με το Μ μέσο της ΒΓ (ορθή γωνία στο Α). */
export function Fig15042() {
  const A = { x: 165, y: 30 };
  const B = { x: 45, y: 150 };
  const G = { x: 285, y: 150 };
  const M = { x: 165, y: 150 };
  return (
    <svg viewBox="0 0 330 180" className="mx-auto block w-full max-w-sm" role="img" aria-label="Ορθογώνιο ισοσκελές τρίγωνο ΑΒΓ με τη διάμεσο ΑΜ">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${G.x},${G.y}`} fill="none" stroke={COLORS.track} strokeWidth={2} />
      <Arrow x1={A.x} y1={A.y} x2={B.x} y2={B.y} color={A_COLOR} />
      <Arrow x1={A.x} y1={A.y} x2={G.x} y2={G.y} color={B_COLOR} />
      <Arrow x1={A.x} y1={A.y} x2={M.x} y2={M.y} color={COLORS.ok} dashed />
      <polyline points={`${A.x - 12},${A.y + 12} ${A.x},${A.y + 24} ${A.x + 12},${A.y + 12}`} fill="none" stroke={COLORS.ink} strokeWidth={1.5} />
      <polyline points={`${M.x},${M.y - 12} ${M.x + 12},${M.y - 12} ${M.x + 12},${M.y}`} fill="none" stroke={COLORS.ink} strokeWidth={1.2} />
      <Dot x={M.x} y={M.y} />
      <Label x={A.x} y={A.y - 12}>Α</Label>
      <Label x={B.x - 12} y={B.y + 6}>Β</Label>
      <Label x={G.x + 12} y={G.y + 6}>Γ</Label>
      <Label x={M.x} y={M.y + 15}>Μ</Label>
    </svg>
  );
}

/** 15010 · Τα Δ και Ε «χτισμένα» από τα Α, Β, Γ· το Α είναι μέσο του ΔΕ. */
export function Fig15010() {
  const U = 34;
  const ox = 170;
  const oy = 110;
  const p = (x: number, y: number) => ({ x: ox + x * U, y: oy - y * U });
  const Aw = { x: 0, y: 0 };
  const Bw = { x: -1.6, y: -1.6 };
  const Gw = { x: 1.8, y: -1.1 };
  const A = p(Aw.x, Aw.y);
  const B = p(Bw.x, Bw.y);
  const G = p(Gw.x, Gw.y);
  const D = p(Aw.x + Gw.x - Bw.x, Aw.y + Gw.y - Bw.y);
  const E = p(Aw.x + Bw.x - Gw.x, Aw.y + Bw.y - Gw.y);
  return (
    <svg viewBox="0 0 340 200" className="mx-auto block w-full max-w-sm" role="img" aria-label="Σημεία Δ, Α, Ε πάνω στην ίδια ευθεία">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${G.x},${G.y}`} fill="none" stroke={COLORS.track} strokeWidth={2} />
      <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke={COLORS.grid} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1={G.x} y1={G.y} x2={D.x} y2={D.y} stroke={COLORS.grid} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1={G.x} y1={G.y} x2={E.x} y2={E.y} stroke={COLORS.grid} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1={B.x} y1={B.y} x2={E.x} y2={E.y} stroke={COLORS.grid} strokeWidth={1.5} strokeDasharray="4 4" />
      <Arrow x1={A.x} y1={A.y} x2={D.x} y2={D.y} color={A_COLOR} />
      <Arrow x1={A.x} y1={A.y} x2={E.x} y2={E.y} color={B_COLOR} />
      {[A, B, G, D, E].map((pt, i) => (
        <Dot key={i} x={pt.x} y={pt.y} />
      ))}
      <Label x={A.x} y={A.y - 13}>Α</Label>
      <Label x={B.x - 4} y={B.y + 15}>Β</Label>
      <Label x={G.x + 4} y={G.y + 15}>Γ</Label>
      <Label x={D.x + 12} y={D.y - 6}>Δ</Label>
      <Label x={E.x - 12} y={E.y - 6}>Ε</Label>
    </svg>
  );
}
