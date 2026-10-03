/**
 * Απλά σχήματα (ξανασχεδιασμένα) για τα θέματα της Τράπεζας που
 * χρειάζονται εικόνα για να διαβαστούν.
 */

const INK = "#2c2825";
const MUTED = "#857261";
const V = "#0f8b8d"; // ταχύτητα
const A = "#c0392b"; // επιτάχυνση / δύναμη
const GOLD = "#c9822f";

function Frame({ children, label, h = 200 }: { children: React.ReactNode; label: string; h?: number }) {
  return (
    <figure className="mx-auto w-full max-w-sm">
      <svg viewBox={`0 0 320 ${h}`} role="img" aria-label={label} className="h-auto w-full">
        <defs>
          <marker id="tz-arrow-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={V} />
          </marker>
          <marker id="tz-arrow-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={A} />
          </marker>
          <marker id="tz-arrow-k" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
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

/** 16119 / 16120: δύο σφαιρίδια σε λείο τραπέζι (κάτοψη). */
export function FigTwoStrings({ sameLength }: { sameLength: boolean }) {
  const r1 = sameLength ? 55 : 70;
  const r2 = sameLength ? 55 : 35;
  return (
    <Frame label="Κάτοψη: δύο σφαιρίδια δεμένα με νήματα σε ακλόνητα σημεία" h={190}>
      {[
        { cx: 85, r: r1, name: "Σ1" },
        { cx: 235, r: r2, name: "Σ2" },
      ].map(({ cx, r, name }) => (
        <g key={name}>
          <circle cx={cx} cy={95} r={r} fill="none" stroke={MUTED} strokeDasharray="4 4" />
          <line x1={cx} y1={95} x2={cx + r} y2={95} stroke={INK} strokeWidth={1.5} />
          <circle cx={cx} cy={95} r={3} fill={INK} />
          <circle cx={cx + r} cy={95} r={7} fill={GOLD} stroke={INK} />
          <line x1={cx + r} y1={95} x2={cx + r} y2={95 - 34} stroke={V} strokeWidth={2.2} markerEnd="url(#tz-arrow-v)" />
          <line x1={cx + r - 8} y1={95} x2={cx + r - 34} y2={95} stroke={A} strokeWidth={2.2} markerEnd="url(#tz-arrow-a)" />
          <text x={cx + r + 10} y={112} {...txt}>
            {name}
          </text>
        </g>
      ))}
      <text x={12} y={180} fontSize={11} fill={V}>
        υ: εφαπτόμενη
      </text>
      <text x={110} y={180} fontSize={11} fill={A}>
        α<tspan fontSize={8} dy={3}>κ</tspan>
        <tspan dy={-3}>: προς το κέντρο (κάθετη στην υ)</tspan>
      </text>
    </Frame>
  );
}

/** 16121: κόβεται το νήμα — ποια τροχιά; */
export function FigCutString() {
  return (
    <Frame label="Η σφαίρα γυρίζει δεξιόστροφα· το νήμα κόβεται στο σημείο Ρ" h={200}>
      <circle cx={130} cy={110} r={65} fill="none" stroke={MUTED} strokeDasharray="4 4" />
      <circle cx={130} cy={110} r={3} fill={INK} />
      <line x1={130} y1={110} x2={130} y2={45} stroke={INK} strokeWidth={1.2} strokeDasharray="2 3" />
      <circle cx={130} cy={45} r={7} fill={GOLD} stroke={INK} />
      <text x={112} y={36} {...txt}>
        Ρ
      </text>
      {/* (1) ακτινικά προς τα έξω */}
      <line x1={130} y1={38} x2={130} y2={8} stroke={INK} strokeWidth={1.5} markerEnd="url(#tz-arrow-k)" />
      <text x={136} y={18} {...txt}>
        (1)
      </text>
      {/* (2) συνεχίζει να καμπυλώνει */}
      <path d="M138 46 Q 205 60 205 120" fill="none" stroke={INK} strokeWidth={1.5} markerEnd="url(#tz-arrow-k)" />
      <text x={212} y={110} {...txt}>
        (2)
      </text>
      {/* (3) εφαπτομενικά */}
      <line x1={138} y1={45} x2={290} y2={45} stroke={V} strokeWidth={2} markerEnd="url(#tz-arrow-v)" />
      <text x={268} y={36} {...txt}>
        (3)
      </text>
      <path d="M70 80 A 65 65 0 0 1 95 55" fill="none" stroke={MUTED} markerEnd="url(#tz-arrow-k)" />
    </Frame>
  );
}

/** 16209 / 16639: κατακόρυφος κύκλος. */
export function FigVerticalCircle({ top, bottom, center }: { top: string; bottom: string; center: string }) {
  return (
    <Frame label="Σώμα δεμένο σε νήμα, σε κατακόρυφο κύκλο" h={210}>
      <circle cx={160} cy={105} r={75} fill="none" stroke={MUTED} strokeDasharray="4 4" />
      <circle cx={160} cy={105} r={3} fill={INK} />
      <text x={168} y={110} {...txt}>
        {center}
      </text>
      <line x1={160} y1={105} x2={160} y2={30} stroke={INK} strokeWidth={1.2} />
      <line x1={160} y1={105} x2={160} y2={180} stroke={INK} strokeWidth={1.2} />
      <circle cx={160} cy={30} r={7} fill={GOLD} stroke={INK} />
      <circle cx={160} cy={180} r={7} fill={GOLD} stroke={INK} />
      <text x={172} y={26} {...txt}>
        {top} (ανώτερο)
      </text>
      <text x={172} y={198} {...txt}>
        {bottom} (κατώτερο)
      </text>
      <line x1={40} y1={60} x2={40} y2={100} stroke={A} strokeWidth={2} markerEnd="url(#tz-arrow-a)" />
      <text x={22} y={118} fontSize={11} fill={A}>
        g
      </text>
    </Frame>
  );
}

/** 16489: παιδί στη «Ρόδα», δεξιόστροφα. */
export function FigFerrisWheel() {
  return (
    <Frame label="Η «Ρόδα» γυρίζει δεξιόστροφα· το παιδί είναι στο ανώτερο σημείο Α" h={220}>
      <circle cx={160} cy={100} r={70} fill="none" stroke={INK} strokeWidth={1.5} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return <line key={i} x1={160} y1={100} x2={160 + 70 * Math.cos(a)} y2={100 + 70 * Math.sin(a)} stroke={MUTED} />;
      })}
      <path d="M150 170 L135 200 M170 170 L185 200" stroke={INK} strokeWidth={2} />
      <line x1={90} y1={200} x2={300} y2={200} stroke={INK} strokeWidth={1.5} />
      <circle cx={160} cy={30} r={7} fill={GOLD} stroke={INK} />
      <text x={146} y={20} {...txt}>
        Α
      </text>
      <line x1={168} y1={30} x2={218} y2={30} stroke={V} strokeWidth={2.2} markerEnd="url(#tz-arrow-v)" />
      <text x={222} y={34} fontSize={12} fill={V}>
        υ
      </text>
      <path d="M160 30 Q 225 45 262 198" fill="none" stroke={A} strokeDasharray="4 3" />
      <text x={156} y={214} {...txt}>
        Β
      </text>
      <text x={258} y={214} {...txt}>
        Γ
      </text>
      <text x={70} y={214} {...txt}>
        Δ
      </text>
      <path d="M100 55 A 70 70 0 0 1 130 37" fill="none" stroke={MUTED} markerEnd="url(#tz-arrow-k)" />
    </Frame>
  );
}

/** 16710: δίσκος, Β στο μέσο ακτίνας, Α στην περιφέρεια. */
export function FigDisk() {
  return (
    <Frame label="Δίσκος που περιστρέφεται γύρω από το κέντρο του" h={180}>
      <circle cx={160} cy={90} r={75} fill="#fbf8f3" stroke={INK} strokeWidth={1.5} />
      <circle cx={160} cy={90} r={3} fill={INK} />
      <line x1={160} y1={90} x2={235} y2={90} stroke={MUTED} />
      <circle cx={197.5} cy={90} r={5} fill={GOLD} stroke={INK} />
      <circle cx={235} cy={90} r={5} fill={GOLD} stroke={INK} />
      <text x={192} y={110} {...txt}>
        Β
      </text>
      <text x={242} y={95} {...txt}>
        Α
      </text>
      <text x={150} y={108} {...txt}>
        Ο
      </text>
    </Frame>
  );
}

/** 16711: οριζόντιος κύκλος σε προοπτική, σημείο Α μπροστά. */
export function FigPerspectiveCircle() {
  return (
    <Frame label="Ο κύκλος είναι οριζόντιος (κάθετος στη σελίδα). Το σώμα γυρίζει όπως το βέλος." h={170}>
      <line x1={160} y1={10} x2={160} y2={160} stroke={MUTED} />
      <ellipse cx={160} cy={80} rx={110} ry={26} fill="none" stroke={INK} strokeWidth={1.3} />
      <circle cx={160} cy={106} r={6} fill={GOLD} stroke={INK} />
      <text x={146} y={100} {...txt}>
        Α
      </text>
      <path d="M290 60 Q 285 100 245 108" fill="none" stroke={INK} markerEnd="url(#tz-arrow-k)" />
    </Frame>
  );
}

/** 21403: άνθρωποι στη Γη, Α σε μεγάλο γεωγραφικό πλάτος, Β στον Ισημερινό. */
export function FigEarth() {
  return (
    <Frame label="Ο Α είναι σε βόρειο γεωγραφικό πλάτος, ο Β στον Ισημερινό" h={200}>
      <line x1={160} y1={8} x2={160} y2={192} stroke={INK} strokeDasharray="4 3" />
      <circle cx={160} cy={100} r={80} fill="#e6f1f5" stroke={INK} strokeWidth={1.5} />
      <ellipse cx={160} cy={100} rx={80} ry={14} fill="none" stroke={MUTED} />
      <ellipse cx={160} cy={45} rx={58} ry={10} fill="none" stroke={MUTED} />
      <circle cx={218} cy={45} r={6} fill={GOLD} stroke={INK} />
      <circle cx={240} cy={100} r={6} fill={GOLD} stroke={INK} />
      <text x={228} y={42} {...txt}>
        Α
      </text>
      <text x={250} y={104} {...txt}>
        Β
      </text>
      <line x1={160} y1={45} x2={212} y2={45} stroke={A} strokeWidth={1.2} />
      <text x={176} y={40} fontSize={11} fill={A}>
        r<tspan fontSize={8} dy={3}>Α</tspan>
      </text>
      <line x1={160} y1={100} x2={234} y2={100} stroke={A} strokeWidth={1.2} />
      <text x={186} y={95} fontSize={11} fill={A}>
        r<tspan fontSize={8} dy={3}>Β</tspan>
        <tspan dy={-3}> = R</tspan>
        <tspan fontSize={8} dy={3}>Γ</tspan>
      </text>
      <text x={110} y={128} fontSize={11} fill={MUTED}>
        Ισημερινός
      </text>
    </Frame>
  );
}

/** 21768: ομόκεντροι κύκλοι, Α και Β στην ίδια ακτίνα. */
export function FigConcentric() {
  return (
    <Frame label="Τα Α και Β ξεκινούν από την ίδια ακτίνα, με ίσες ταχύτητες υ" h={190}>
      <circle cx={160} cy={95} r={80} fill="none" stroke={MUTED} strokeDasharray="4 4" />
      <circle cx={160} cy={95} r={30} fill="none" stroke={MUTED} strokeDasharray="4 4" />
      <circle cx={160} cy={95} r={3} fill={INK} />
      <text x={148} y={112} {...txt}>
        Ο
      </text>
      <line x1={160} y1={95} x2={240} y2={95} stroke={INK} />
      <circle cx={190} cy={95} r={5} fill={GOLD} stroke={INK} />
      <circle cx={240} cy={95} r={5} fill={GOLD} stroke={INK} />
      <text x={186} y={114} {...txt}>
        Β
      </text>
      <text x={246} y={100} {...txt}>
        Α
      </text>
      <line x1={190} y1={95} x2={190} y2={60} stroke={V} strokeWidth={2} markerEnd="url(#tz-arrow-v)" />
      <line x1={240} y1={95} x2={240} y2={60} stroke={V} strokeWidth={2} markerEnd="url(#tz-arrow-v)" />
    </Frame>
  );
}
