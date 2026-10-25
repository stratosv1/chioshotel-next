/**
 * Απλά σχήματα (ξανασχεδιασμένα) για τα θέματα ορμής της Τράπεζας
 * που χρειάζονται εικόνα για να διαβαστούν.
 */

const INK = "#2c2825";
const MUTED = "#857261";
const V = "#1f6fd1"; // ταχύτητα
const P = "#1f9d55"; // ορμή
const GOLD = "#c9822f";
const WOOD = "#b98a5a";

function Frame({ children, label, h = 170, w = 320 }: { children: React.ReactNode; label: string; h?: number; w?: number }) {
  return (
    <figure className="mx-auto w-full max-w-md">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} className="h-auto w-full">
        <defs>
          <marker id="to-arrow-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={V} />
          </marker>
          <marker id="to-arrow-k" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={INK} />
          </marker>
        </defs>
        {children}
      </svg>
      <figcaption className="mt-1 text-center text-xs text-[#857261]">{label}</figcaption>
    </figure>
  );
}

const txt = { fontSize: 13, fill: INK, fontFamily: "inherit" } as const;

function Cart({ x, y, w, label, spring }: { x: number; y: number; w: number; label: string; spring?: "right" }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={22} rx={3} fill={WOOD} stroke={INK} />
      <circle cx={x + 12} cy={y + 26} r={7} fill="#2347a8" stroke={INK} />
      <circle cx={x + w - 12} cy={y + 26} r={7} fill="#2347a8" stroke={INK} />
      <text x={x + w / 2} y={y + 16} textAnchor="middle" {...txt} fontWeight={700}>
        {label}
      </text>
      {spring === "right" ? (
        <path
          d={`M${x + w} ${y + 11} l4 -5 l4 10 l4 -10 l4 10 l4 -5`}
          fill="none"
          stroke={GOLD}
          strokeWidth={2}
        />
      ) : null}
    </g>
  );
}

/** 14748 / 14785: δύο αμαξίδια σε πάγκο με εμπόδια Ε1, Ε2. */
export function FigTwoCartsBench() {
  return (
    <Frame label="Τα αμαξίδια m (με μηχανισμό εκτίναξης) και 2m ανάμεσα στα εμπόδια Ε1 και Ε2" h={110}>
      <line x1={10} y1={84} x2={310} y2={84} stroke={INK} strokeWidth={2} />
      <rect x={10} y={30} width={8} height={54} fill={MUTED} />
      <rect x={302} y={30} width={8} height={54} fill={MUTED} />
      <text x={22} y={26} {...txt}>
        Ε1
      </text>
      <text x={280} y={26} {...txt}>
        Ε2
      </text>
      <Cart x={100} y={48} w={56} label="m" spring="right" />
      <Cart x={180} y={48} w={56} label="2m" />
      <line x1={168} y1={20} x2={168} y2={100} stroke={GOLD} strokeDasharray="3 3" />
      <text x={168} y={14} textAnchor="middle" fontSize={11} fill={MUTED}>
        μέση του πάγκου
      </text>
    </Frame>
  );
}

/** 16103: αμαξίδια με αποστάσεις s (κενό ως το εμπόδιο) και x (από το σημείο επαφής). */
export function FigCartsDistances() {
  return (
    <Frame label="s = κενό από τη μύτη του αμαξιδίου ως το εμπόδιο · x = από το σημείο επαφής ως το εμπόδιο" h={140}>
      <line x1={10} y1={84} x2={310} y2={84} stroke={INK} strokeWidth={2} />
      <rect x={10} y={30} width={8} height={54} fill={MUTED} />
      <rect x={302} y={30} width={8} height={54} fill={MUTED} />
      <Cart x={92} y={48} w={68} label="m₁" />
      <Cart x={160} y={48} w={68} label="m₂" />
      {/* s1, s2 */}
      <line x1={18} y1={104} x2={92} y2={104} stroke={V} markerStart="url(#to-arrow-v)" markerEnd="url(#to-arrow-v)" />
      <text x={55} y={100} textAnchor="middle" fontSize={12} fill={V}>
        s₁
      </text>
      <line x1={228} y1={104} x2={302} y2={104} stroke={V} markerStart="url(#to-arrow-v)" markerEnd="url(#to-arrow-v)" />
      <text x={265} y={100} textAnchor="middle" fontSize={12} fill={V}>
        s₂
      </text>
      {/* x1, x2 */}
      <line x1={18} y1={126} x2={160} y2={126} stroke={INK} markerStart="url(#to-arrow-k)" markerEnd="url(#to-arrow-k)" />
      <text x={89} y={122} textAnchor="middle" fontSize={12} fill={INK}>
        x₁
      </text>
      <line x1={160} y1={126} x2={302} y2={126} stroke={INK} markerStart="url(#to-arrow-k)" markerEnd="url(#to-arrow-k)" />
      <text x={231} y={122} textAnchor="middle" fontSize={12} fill={INK}>
        x₂
      </text>
    </Frame>
  );
}

function Axes({ ox, oy, w, h, xl, yl }: { ox: number; oy: number; w: number; h: number; xl: string; yl: string }) {
  return (
    <g>
      <line x1={ox} y1={oy} x2={ox + w} y2={oy} stroke={INK} markerEnd="url(#to-arrow-k)" />
      <line x1={ox} y1={oy} x2={ox} y2={oy - h} stroke={INK} markerEnd="url(#to-arrow-k)" />
      <text x={ox + w - 4} y={oy + 16} fontSize={12} fill={INK}>
        {xl}
      </text>
      <text x={ox - 6} y={oy - h - 6} fontSize={12} fill={INK} textAnchor="middle">
        {yl}
      </text>
    </g>
  );
}

/** 16037: διάγραμμα θέσης–χρόνου του αμαξιδίου Α. */
export function FigXT() {
  // κλίμακα: t 0..3 s → 40..250, x 0..0.8 m → 150..20
  const X = (t: number) => 50 + t * 70;
  const Y = (x: number) => 150 - x * 160;
  return (
    <Frame label="Θέση x του αμαξιδίου Α σε συνάρτηση με τον χρόνο (κρούση τη στιγμή t = 2 s)" h={175}>
      <Axes ox={50} oy={150} w={240} h={124} xl="t (s)" yl="x (m)" />
      {[1, 2, 3].map((t) => (
        <g key={t}>
          <line x1={X(t)} y1={150} x2={X(t)} y2={154} stroke={INK} />
          <text x={X(t)} y={167} fontSize={11} textAnchor="middle" fill={INK}>
            {t}
          </text>
        </g>
      ))}
      {[0.2, 0.6, 0.7].map((x) => (
        <g key={x}>
          <line x1={46} y1={Y(x)} x2={50} y2={Y(x)} stroke={INK} />
          <text x={42} y={Y(x) + 4} fontSize={11} textAnchor="end" fill={INK}>
            {String(x).replace(".", ",")}
          </text>
          <line x1={50} y1={Y(x)} x2={290} y2={Y(x)} stroke={MUTED} strokeDasharray="2 4" opacity={0.6} />
        </g>
      ))}
      <polyline points={`${X(0)},${Y(0.2)} ${X(2)},${Y(0.6)} ${X(3)},${Y(0.7)}`} fill="none" stroke={V} strokeWidth={2.5} />
      <line x1={X(2)} y1={150} x2={X(2)} y2={Y(0.6)} stroke={GOLD} strokeDasharray="3 3" />
    </Frame>
  );
}

/** 16049: διάγραμμα ταχύτητας–χρόνου (κρούση διάρκειας 1 s). */
export function FigVT() {
  const X = (t: number) => 50 + t * 70;
  const Y = (v: number) => 150 - v * 8;
  return (
    <Frame label="Ταχύτητα του σώματος μάζας m: από 15 m/s σε 5 m/s κατά την κρούση (διάρκεια 1 s)" h={175}>
      <Axes ox={50} oy={150} w={240} h={124} xl="t (s)" yl="υ (m/s)" />
      {[1, 2, 3].map((t) => (
        <g key={t}>
          <line x1={X(t)} y1={150} x2={X(t)} y2={154} stroke={INK} />
          <text x={X(t)} y={167} fontSize={11} textAnchor="middle" fill={INK}>
            {t}
          </text>
        </g>
      ))}
      {[5, 15].map((v) => (
        <g key={v}>
          <line x1={46} y1={Y(v)} x2={50} y2={Y(v)} stroke={INK} />
          <text x={42} y={Y(v) + 4} fontSize={11} textAnchor="end" fill={INK}>
            {v}
          </text>
          <line x1={50} y1={Y(v)} x2={290} y2={Y(v)} stroke={MUTED} strokeDasharray="2 4" opacity={0.6} />
        </g>
      ))}
      <polyline points={`${X(0)},${Y(15)} ${X(1)},${Y(15)} ${X(2)},${Y(5)} ${X(3)},${Y(5)}`} fill="none" stroke={V} strokeWidth={2.5} />
      <text x={X(1.5)} y={Y(10) - 8} fontSize={11} fill={GOLD}>
        κρούση
      </text>
    </Frame>
  );
}

/** 16875: τρία διαγράμματα ορμής–χρόνου. */
export function FigPTOptions() {
  const graphs: { label: string; d: string }[] = [
    { label: "(α)", d: "M10 70 L90 45" },
    { label: "(β)", d: "M10 30 L80 100" },
    { label: "(γ)", d: "M10 70 L90 110" },
  ];
  return (
    <Frame label="Ποιο διάγραμμα p–t δείχνει το αυτοκίνητο που φρενάρει;" h={150} w={330}>
      {graphs.map((g, i) => (
        <g key={g.label} transform={`translate(${i * 110 + 10} 10)`}>
          <line x1={10} y1={i === 2 ? 70 : 100} x2={100} y2={i === 2 ? 70 : 100} stroke={INK} markerEnd="url(#to-arrow-k)" />
          <line x1={10} y1={i === 2 ? 120 : 100} x2={10} y2={8} stroke={INK} markerEnd="url(#to-arrow-k)" />
          <text x={18} y={14} fontSize={11} fill={INK}>
            p
          </text>
          <text x={94} y={(i === 2 ? 70 : 100) + 14} fontSize={11} fill={INK}>
            t
          </text>
          <path d={g.d} stroke={P} strokeWidth={2.5} fill="none" />
          <text x={50} y={136} fontSize={12} textAnchor="middle" fill={INK} fontWeight={700}>
            {g.label}
          </text>
        </g>
      ))}
    </Frame>
  );
}
