/** Σχήματα της σελίδας «Εσωτερικό γινόμενο». Μεγάλα, χωρίς κουτιά γύρω τους. */

const INK = "#2c2825";
const ORANGE = "#c9822f";
const TEAL = "#0e6e66";
const GREY = "#857261";

function Head({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill={color} />
    </marker>
  );
}

/** Τρία μικρά σχήματα: οξεία, ορθή, αμβλεία γωνία. */
export function SignFigure({ kind }: { kind: "acute" | "right" | "obtuse" }) {
  const end = kind === "acute" ? [248, 71] : kind === "right" ? [130, 18] : [32, 49];
  const id = `sg-${kind}`;
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full max-w-[300px]" role="img" aria-label="Δύο διανύσματα με κοινή αρχή">
      <defs>
        <Head id={`${id}-a`} color={INK} />
        <Head id={`${id}-b`} color={ORANGE} />
      </defs>
      <line x1="130" y1="170" x2="282" y2="170" stroke={INK} strokeWidth="7" markerEnd={`url(#${id}-a)`} />
      <line x1="130" y1="170" x2={end[0]} y2={end[1]} stroke={ORANGE} strokeWidth="7" markerEnd={`url(#${id}-b)`} />
      <text x="270" y="196" fontSize="24" fontWeight="700" fill={INK}>α</text>
      <text x={kind === "obtuse" ? 20 : end[0] + 10} y={end[1] + 4} fontSize="24" fontWeight="700" fill={ORANGE}>β</text>
    </svg>
  );
}

/** Η προβολή του β πάνω στο α. */
export function ProjectionFigure() {
  return (
    <svg viewBox="0 0 760 440" className="h-auto w-full" role="img" aria-label="Το β προβάλλεται κάθετα πάνω στη διεύθυνση του α και δίνει το β1">
      <defs>
        <Head id="pj-a" color={INK} />
        <Head id="pj-b" color={ORANGE} />
        <Head id="pj-c" color={TEAL} />
      </defs>
      <line x1="60" y1="320" x2="700" y2="320" stroke={INK} strokeWidth="7" markerEnd="url(#pj-a)" />
      <line x1="60" y1="320" x2="414" y2="78" stroke={ORANGE} strokeWidth="7" markerEnd="url(#pj-b)" />
      <line x1="420" y1="84" x2="420" y2="320" stroke={GREY} strokeWidth="3" strokeDasharray="12 10" />
      <path d="M398 320 V298 H420" fill="none" stroke={GREY} strokeWidth="3" />
      <line x1="60" y1="362" x2="410" y2="362" stroke={TEAL} strokeWidth="9" markerEnd="url(#pj-c)" />
      <text x="24" y="330" fontSize="34" fontWeight="700" fill={INK}>O</text>
      <text x="690" y="300" fontSize="38" fontWeight="700" fill={INK}>α</text>
      <text x="200" y="170" fontSize="38" fontWeight="700" fill={ORANGE}>β</text>
      <text x="120" y="412" fontSize="32" fontWeight="700" fill={TEAL}>β₁ = προβολή του β πάνω στο α</text>
    </svg>
  );
}

/** Έλκηθρο: δύναμη υπό γωνία, τριβή, βάρος, κάθετη αντίδραση, μετατόπιση. */
export function SledFigure() {
  return (
    <svg viewBox="0 0 480 330" className="h-auto w-full max-w-[560px]" role="img" aria-label="Έλκηθρο που σέρνεται με σχοινί υπό γωνία 60 μοιρών, με τις δυνάμεις F, T, B, N και τη μετατόπιση Δx">
      <defs>
        <Head id="sl-a" color={ORANGE} />
        <Head id="sl-b" color={TEAL} />
        <Head id="sl-c" color={INK} />
        <Head id="sl-d" color={GREY} />
      </defs>
      <line x1="0" y1="250" x2="480" y2="250" stroke={GREY} strokeWidth="3" />
      <rect x="130" y="190" width="130" height="60" rx="8" fill={INK} />
      <line x1="195" y1="190" x2="195" y2="112" stroke={GREY} strokeWidth="5" markerEnd="url(#sl-d)" />
      <line x1="195" y1="232" x2="195" y2="306" stroke={GREY} strokeWidth="5" markerEnd="url(#sl-d)" />
      <line x1="130" y1="222" x2="44" y2="222" stroke={INK} strokeWidth="5" markerEnd="url(#sl-c)" />
      <line x1="260" y1="192" x2="332" y2="70" stroke={ORANGE} strokeWidth="6" markerEnd="url(#sl-a)" />
      <path d="M310 192 A50 50 0 0 0 285 149" fill="none" stroke={ORANGE} strokeWidth="3" />
      <line x1="222" y1="296" x2="418" y2="296" stroke={TEAL} strokeWidth="6" markerEnd="url(#sl-b)" />
      <text x="342" y="66" fontSize="30" fontWeight="700" fill={ORANGE}>F</text>
      <text x="316" y="170" fontSize="22" fontWeight="700" fill={ORANGE}>60°</text>
      <text x="26" y="212" fontSize="30" fontWeight="700" fill={INK}>T</text>
      <text x="206" y="124" fontSize="30" fontWeight="700" fill={GREY}>N</text>
      <text x="160" y="300" fontSize="30" fontWeight="700" fill={GREY}>B</text>
      <text x="424" y="306" fontSize="28" fontWeight="700" fill={TEAL}>Δx</text>
    </svg>
  );
}
