/**
 * Σχήματα για τα λυμένα παραδείγματα των περιπτώσεων ορμής.
 * Χρώματα όπως στα κινούμενα σχέδια της ορμής: μπλε = ταχύτητα, κόκκινο = δύναμη,
 * πορτοκαλί = ενέργεια. Το ζητούμενο είναι πάντα πράσινο-μπλε με «?» (διακεκομμένο βέλος).
 */
import type { ReactNode } from "react";

const INK = "#2c2825";
const V = "#1f6fd1";
const F = "#d9342b";
const EN = "#e08a1e";
const ASK = "#0e6e66";
const GREY = "#857261";
const BOX = "#efe7da";

type Pt = { x1: number; y1: number; x2: number; y2: number };

function Arrow({ x1, y1, x2, y2, c, w = 5, dash = false }: Pt & { c: string; w?: number; dash?: boolean }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const h = Math.max(14, w * 3);
  const hw = h * 0.55;
  const bx = x2 - ux * h;
  const by = y2 - uy * h;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={c} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ? "9 7" : undefined} />
      <polygon points={`${x2},${y2} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}`} fill={c} />
    </g>
  );
}

function T({
  x,
  y,
  c = INK,
  s = 18,
  a = "middle",
  b = false,
  children,
}: {
  x: number;
  y: number;
  c?: string;
  s?: number;
  a?: "start" | "middle" | "end";
  b?: boolean;
  children: ReactNode;
}) {
  return (
    <text x={x} y={y} fill={c} fontSize={s} textAnchor={a} fontWeight={b ? 700 : 500}>
      {children}
    </text>
  );
}

/** Δείκτης κάτω δεξιά (π.χ. υ με δείκτη Β). */
function Sub({ children }: { children: ReactNode }) {
  return (
    <tspan fontSize="0.72em" dy="0.3em">
      {children}
    </tspan>
  );
}

function Box({ x, y, w, h, label, fill = BOX, dash = false }: { x: number; y: number; w: number; h: number; label?: ReactNode; fill?: string; dash?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={dash ? GREY : INK} strokeWidth={2.5} strokeDasharray={dash ? "7 6" : undefined} />
      {label ? (
        <T x={x + w / 2} y={y + h / 2 + 7} b s={19}>
          {label}
        </T>
      ) : null}
    </g>
  );
}

function Ground({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const ticks = [];
  for (let x = x1 + 6; x < x2; x += 18) ticks.push(<line key={x} x1={x} y1={y} x2={x - 9} y2={y + 10} stroke={GREY} strokeWidth={1.5} />);
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={INK} strokeWidth={2.5} />
      {ticks}
    </g>
  );
}

/** Δύο μέρη: «Πριν» αριστερά, «Μετά» δεξιά. */
function Panels({ h, left = "Πριν", right = "Μετά" }: { h: number; left?: string; right?: string }) {
  return (
    <g>
      <T x={16} y={26} a="start" c={GREY} s={15} b>
        {left.toUpperCase()}
      </T>
      <T x={336} y={26} a="start" c={GREY} s={15} b>
        {right.toUpperCase()}
      </T>
      <line x1={320} y1={12} x2={320} y2={h - 12} stroke={GREY} strokeWidth={1.5} strokeDasharray="5 6" />
    </g>
  );
}

/** Θετική φορά. */
function Plus({ x, y, up = false }: { x: number; y: number; up?: boolean }) {
  return up ? (
    <g>
      <Arrow x1={x} y1={y} x2={x} y2={y - 50} c={GREY} w={2.5} />
      <T x={x + 12} y={y - 30} a="start" c={GREY} s={16} b>
        +
      </T>
    </g>
  ) : (
    <g>
      <Arrow x1={x} y1={y} x2={x + 50} y2={y} c={GREY} w={2.5} />
      <T x={x + 25} y={y - 8} c={GREY} s={16} b>
        +
      </T>
    </g>
  );
}

function Fig({ h, label, children }: { h: number; label: string; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 640 ${h}`} className="block h-auto w-full" role="img" aria-label={label} fontFamily="Inter, 'Segoe UI', Roboto, Arial, sans-serif">
      {children}
    </svg>
  );
}

/* ───────── Ομάδα Α ───────── */

function A1() {
  return (
    <Fig h={230} label="Δύο σώματα με ίσες κινητικές ενέργειες, το δεύτερο με τετραπλάσια μάζα. Ζητείται ο λόγος των ορμών.">
      <Box x={60} y={100} w={50} h={50} label="m₁" />
      <Arrow x1={114} y1={125} x2={240} y2={125} c={V} />
      <T x={177} y={112} c={V} b>υ₁</T>
      <Ground x1={20} x2={300} y={150} />
      <T x={160} y={190} c={EN} b>K₁ = K</T>

      <Box x={360} y={80} w={100} h={70} label="m₂ = 4m₁" />
      <Arrow x1={464} y1={115} x2={530} y2={115} c={V} />
      <T x={497} y={102} c={V} b>υ₂</T>
      <Ground x1={340} x2={620} y={150} />
      <T x={480} y={190} c={EN} b>K₂ = K</T>

      <T x={320} y={222} c={ASK} s={20} b>p₂ / p₁ = ?</T>
    </Fig>
  );
}

function A2() {
  return (
    <Fig h={270} label="Μπαλάκι 0,2 kg χτυπά στο πάτωμα με 5 m/s και αναπηδά με 3 m/s. Ζητείται η μεταβολή της ορμής.">
      <Panels h={230} left="Πριν: χτυπά" right="Μετά: αναπηδά" />
      <circle cx={150} cy={196} r={16} fill="#f2a65a" stroke={INK} strokeWidth={2} />
      <T x={110} y={201} a="end" s={16}>0,2 kg</T>
      <Arrow x1={200} y1={70} x2={200} y2={200} c={V} />
      <T x={214} y={140} a="start" c={V} b>5 m/s</T>

      <circle cx={470} cy={196} r={16} fill="#f2a65a" stroke={INK} strokeWidth={2} />
      <Arrow x1={520} y1={200} x2={520} y2={110} c={V} />
      <T x={534} y={160} a="start" c={V} b>3 m/s</T>
      <Plus x={608} y={200} up />

      <Ground x1={20} x2={620} y={212} />
      <T x={320} y={258} c={ASK} s={20} b>Δp = ?  (μέτρο και φορά)</T>
    </Fig>
  );
}

function A3() {
  return (
    <Fig h={210} label="Βλήμα 0,02 kg με 300 m/s σφηνώνεται σε τοίχο σε 0,002 s. Ζητείται η μέση δύναμη από τον τοίχο.">
      <rect x={160} y={102} width={44} height={16} rx={8} fill={INK} />
      <T x={182} y={90} s={16}>0,02 kg</T>
      <Arrow x1={212} y1={110} x2={420} y2={110} c={V} />
      <T x={316} y={96} c={V} b>300 m/s</T>
      <rect x={500} y={30} width={30} height={150} fill="url(#a3-hatch)" stroke={INK} strokeWidth={2.5} />
      <defs>
        <pattern id="a3-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill={BOX} />
          <line x1="0" y1="0" x2="0" y2="10" stroke={GREY} strokeWidth="3" />
        </pattern>
      </defs>
      <T x={515} y={200} c={GREY} s={16}>τοίχος</T>
      <Arrow x1={494} y1={150} x2={400} y2={150} c={F} dash />
      <T x={447} y={176} c={ASK} s={20} b>F = ?</T>
      <T x={110} y={170} a="start" c={GREY} s={17}>σφηνώνεται σε Δt = 0,002 s</T>
      <Plus x={40} y={60} />
    </Fig>
  );
}

function A4() {
  return (
    <Fig h={290} label="Σώμα κινείται κατακόρυφα προς τα πάνω με ορμή p = 30 − 15t. Ζητείται η μάζα και πότε φτάνει στο μέγιστο ύψος.">
      <line x1={70} y1={50} x2={270} y2={50} stroke={GREY} strokeWidth={2} strokeDasharray="7 6" />
      <T x={170} y={38} c={ASK} s={17} b>μέγιστο ύψος (υ = 0): t = ?</T>
      <Box x={120} y={160} w={50} h={50} label="m" />
      <Arrow x1={195} y1={200} x2={195} y2={80} c={V} />
      <T x={208} y={130} a="start" c={V} b>υ</T>
      <Arrow x1={145} y1={210} x2={145} y2={265} c={F} />
      <T x={130} y={250} a="end" c={F} b>mg</T>
      <Ground x1={40} x2={290} y={278} />
      <Plus x={40} y={160} up />

      <rect x={330} y={80} width={290} height={150} rx={16} fill="#fbf8f3" stroke="rgba(0,0,0,0.12)" strokeWidth={1.5} />
      <T x={475} y={125} s={24} b>p = 30 − 15t (SI)</T>
      <T x={475} y={160} c={GREY} s={17}>g = 10 m/s²</T>
      <T x={475} y={205} c={ASK} s={20} b>m = ?,  t = ?</T>
    </Fig>
  );
}

function Cart({ x, w, label, mass }: { x: number; w: number; label: string; mass: string }) {
  return (
    <g>
      <Box x={x} y={110} w={w} h={40} label={label} />
      <circle cx={x + 14} cy={157} r={7} fill={INK} />
      <circle cx={x + w - 14} cy={157} r={7} fill={INK} />
      <T x={x + w / 2} y={190} s={16} c={GREY}>
        {mass}
      </T>
    </g>
  );
}

function A5() {
  return (
    <Fig h={240} label="Αμαξίδιο Α 1 kg με 2 m/s δεξιά, αμαξίδιο Β 2 kg με 2 m/s αριστερά. Μετά το Α κινείται με 1 m/s αριστερά. Ζητείται η ταχύτητα του Β.">
      <Panels h={200} />
      <Cart x={40} w={70} label="A" mass="1 kg" />
      <Arrow x1={50} y1={84} x2={130} y2={84} c={V} />
      <T x={90} y={72} c={V} b>2 m/s</T>
      <Cart x={190} w={90} label="B" mass="2 kg" />
      <Arrow x1={275} y1={84} x2={195} y2={84} c={V} />
      <T x={235} y={72} c={V} b>2 m/s</T>
      <Ground x1={20} x2={305} y={164} />

      <Cart x={380} w={70} label="A" mass="1 kg" />
      <Arrow x1={440} y1={84} x2={360} y2={84} c={V} />
      <T x={400} y={72} c={V} b>1 m/s</T>
      <Cart x={500} w={90} label="B" mass="2 kg" />
      <T x={545} y={80} c={ASK} s={20} b>υ<Sub>Β</Sub><tspan dy="-0.3em"> = ?</tspan></T>
      <Ground x1={335} x2={620} y={164} />

      <Plus x={20} y={222} />
      <T x={80} y={228} a="start" c={GREY} s={15}>θετική φορά: προς τα δεξιά</T>
    </Fig>
  );
}

function A6() {
  const X = (t: number) => 70 + t * 75;
  const Y = (x: number) => 240 - x * 250;
  const pts: [number, number][] = [
    [0, 0.2],
    [2, 0.6],
    [3, 0.7],
  ];
  return (
    <Fig h={280} label="Διάγραμμα θέσης-χρόνου του αμαξιδίου Α: 0,2 m στο 0 s, 0,6 m στα 2 s (κρούση), 0,7 m στα 3 s. Ζητείται η μάζα του Β.">
      <Arrow x1={X(0)} y1={Y(0)} x2={X(3.6)} y2={Y(0)} c={INK} w={2} />
      <Arrow x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(0.86)} c={INK} w={2} />
      <T x={X(3.6)} y={Y(0) + 26} s={15}>t (s)</T>
      <T x={X(0) + 8} y={Y(0.86) + 4} a="start" s={15}>x (m)</T>
      {[1, 2, 3].map((t) => (
        <T key={t} x={X(t)} y={Y(0) + 22} s={14} c={GREY}>
          {t}
        </T>
      ))}
      {[0.2, 0.4, 0.6, 0.8].map((x) => (
        <g key={x}>
          <line x1={X(0) - 5} y1={Y(x)} x2={X(0)} y2={Y(x)} stroke={INK} strokeWidth={2} />
          <T x={X(0) - 9} y={Y(x) + 5} a="end" s={14} c={GREY}>
            {String(x).replace(".", ",")}
          </T>
        </g>
      ))}
      {pts.map(([t, x]) => (
        <g key={t}>
          <line x1={X(t)} y1={Y(x)} x2={X(t)} y2={Y(0)} stroke={GREY} strokeWidth={1.2} strokeDasharray="4 4" />
          <line x1={X(0)} y1={Y(x)} x2={X(t)} y2={Y(x)} stroke={GREY} strokeWidth={1.2} strokeDasharray="4 4" />
        </g>
      ))}
      <polyline points={pts.map(([t, x]) => `${X(t)},${Y(x)}`).join(" ")} fill="none" stroke={V} strokeWidth={4} />
      {pts.map(([t, x]) => (
        <circle key={t} cx={X(t)} cy={Y(x)} r={5} fill={V} />
      ))}
      <T x={X(2) - 6} y={Y(0.6) - 14} a="end" c={F} s={15} b>
        κρούση
      </T>

      <T x={360} y={44} a="start" c={GREY} s={15} b>
        ΠΡΙΝ ΤΗΝ ΚΡΟΥΣΗ
      </T>
      <Cart x={360} w={70} label="A" mass="1 kg" />
      <Arrow x1={370} y1={92} x2={450} y2={92} c={V} />
      <T x={410} y={82} c={V} b>υ<Sub>Α</Sub></T>
      <Cart x={500} w={90} label="B" mass="" />
      <T x={545} y={92} c={GREY} s={16}>ακίνητο</T>
      <Ground x1={345} x2={620} y={164} />
      <T x={545} y={190} c={ASK} s={20} b>m<Sub>Β</Sub><tspan dy="-0.3em"> = ?</tspan></T>
      <T x={485} y={235} c={GREY} s={15}>πλαστική κρούση</T>
    </Fig>
  );
}

/* ───────── Ομάδα Β ───────── */

function B1() {
  return (
    <Fig h={230} label="Σώμα 0,6 kg με 20 m/s δεξιά συγκρούεται πλαστικά με σώμα 0,4 kg με 5 m/s αριστερά. Ζητείται η ταχύτητα του συσσωματώματος.">
      <Panels h={200} right="Μετά: πλαστική κρούση" />
      <Box x={40} y={100} w={80} h={50} label="m₁" />
      <T x={80} y={180} c={GREY} s={16}>0,6 kg</T>
      <Arrow x1={50} y1={80} x2={150} y2={80} c={V} />
      <T x={100} y={68} c={V} b>20 m/s</T>
      <Box x={200} y={108} w={64} h={42} label="m₂" />
      <T x={232} y={180} c={GREY} s={16}>0,4 kg</T>
      <Arrow x1={262} y1={80} x2={192} y2={80} c={V} />
      <T x={227} y={68} c={V} b>5 m/s</T>
      <Ground x1={20} x2={305} y={150} />

      <Box x={410} y={100} w={130} h={50} label="m₁ + m₂" />
      <T x={475} y={80} c={ASK} s={20} b>V = ?  (και φορά)</T>
      <Ground x1={335} x2={620} y={150} />
      <Plus x={20} y={212} />
    </Fig>
  );
}

function BulletBox({ mass, label, ask }: { mass: string; label: string; ask: string }) {
  return (
    <Fig h={240} label={label}>
      <Panels h={200} right="Μετά: το διαπερνά" />
      <rect x={30} y={117} width={36} height={14} rx={7} fill={INK} />
      <T x={48} y={106} s={15} c={GREY}>0,1 kg</T>
      <Arrow x1={72} y1={124} x2={170} y2={124} c={V} />
      <T x={121} y={110} c={V} b>100 m/s</T>
      <Box x={190} y={90} w={90} h={60} label="M" />
      <T x={235} y={180} c={mass === "?" ? ASK : GREY} s={mass === "?" ? 20 : 16} b={mass === "?"}>
        {mass === "?" ? "M = ?" : mass}
      </T>
      <T x={235} y={78} c={GREY} s={15}>ακίνητο</T>
      <Ground x1={20} x2={305} y={150} />

      <Box x={370} y={90} w={90} h={60} label="M" />
      <Arrow x1={380} y1={72} x2={450} y2={72} c={V} />
      <T x={415} y={60} c={V} b>5 m/s</T>
      <rect x={490} y={117} width={36} height={14} rx={7} fill={INK} />
      <Arrow x1={532} y1={124} x2={605} y2={124} c={V} />
      <T x={568} y={110} c={V} b>20 m/s</T>
      <Ground x1={335} x2={620} y={150} />
      <T x={320} y={228} c={ASK} s={20} b>
        {ask}
      </T>
    </Fig>
  );
}

function B2() {
  return (
    <BulletBox
      mass="?"
      ask="Πόση είναι η μάζα M;"
      label="Βλήμα 0,1 kg με 100 m/s διαπερνά ακίνητο κιβώτιο και βγαίνει με 20 m/s, το κιβώτιο αποκτά 5 m/s. Ζητείται η μάζα του κιβωτίου."
    />
  );
}

function Burst({ x, y }: { x: number; y: number }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g>
      {rays.map((d) => {
        const r = (d * Math.PI) / 180;
        return <line key={d} x1={x + Math.cos(r) * 10} y1={y + Math.sin(r) * 10} x2={x + Math.cos(r) * 22} y2={y + Math.sin(r) * 22} stroke={EN} strokeWidth={3} strokeLinecap="round" />;
      })}
    </g>
  );
}

function B3() {
  return (
    <Fig h={240} label="Ακίνητο σώμα εκρήγνυται σε δύο κομμάτια με m₂ = 2m₁. Ζητείται ο λόγος ταχυτήτων και κινητικών ενεργειών.">
      <Panels h={200} right="Μετά: έκρηξη" />
      <Box x={110} y={95} w={110} h={55} label="m₁ + m₂" />
      <T x={165} y={80} c={GREY} s={16}>ακίνητο (υ = 0)</T>
      <Ground x1={20} x2={305} y={150} />

      <Box x={420} y={112} w={44} h={38} label="m₁" />
      <Arrow x1={414} y1={92} x2={344} y2={92} c={V} dash />
      <T x={380} y={80} c={ASK} b>υ₁</T>
      <Box x={482} y={96} w={74} h={54} label="2m₁" />
      <Arrow x1={562} y1={92} x2={625} y2={92} c={V} dash />
      <T x={594} y={80} c={ASK} b>υ₂</T>
      <Burst x={473} y={80} />
      <Ground x1={335} x2={620} y={150} />
      <T x={320} y={228} c={ASK} s={20} b>υ₁ / υ₂ = ?,  K₁ / K₂ = ?</T>
    </Fig>
  );
}

function B4() {
  return (
    <Fig h={230} label="Βλήμα μάζας 3m με ταχύτητα υ εκρήγνυται. Κομμάτι μάζας m συνεχίζει με 4υ. Ζητείται η ταχύτητα του κομματιού 2m.">
      <Panels h={200} right="Μετά: έκρηξη" />
      <Box x={70} y={95} w={110} h={55} label="3m" />
      <Arrow x1={80} y1={76} x2={210} y2={76} c={V} />
      <T x={145} y={64} c={V} b>υ</T>
      <Ground x1={20} x2={305} y={150} />

      <Box x={380} y={98} w={80} h={52} label="2m" />
      <T x={420} y={80} c={ASK} s={20} b>υ′ = ?</T>
      <Box x={500} y={112} w={44} h={38} label="m" />
      <Arrow x1={510} y1={92} x2={628} y2={92} c={V} />
      <T x={569} y={80} c={V} b>4υ</T>
      <Burst x={480} y={70} />
      <Ground x1={335} x2={620} y={150} />
      <Plus x={20} y={212} />
    </Fig>
  );
}

function Charge({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={20} fill="#f6d6d3" stroke={F} strokeWidth={2.5} />
      <T x={x} y={y + 8} c={F} s={24} b>
        +
      </T>
    </g>
  );
}

function B5() {
  return (
    <Fig h={240} label="Δύο ακίνητα φορτισμένα σφαιρίδια 0,1 kg με U = 0,9 J αφήνονται ελεύθερα. Ζητούνται οι ταχύτητες στο άπειρο.">
      <Panels h={200} left="Πριν: ακίνητα" right="Μετά: στο άπειρο" />
      <Charge x={80} y={120} />
      <Charge x={240} y={120} />
      <line x1={104} y1={120} x2={216} y2={120} stroke={EN} strokeWidth={2} strokeDasharray="5 5" />
      <T x={160} y={104} c={EN} b>U = 0,9 J</T>
      <T x={80} y={166} c={GREY} s={15}>0,1 kg</T>
      <T x={240} y={166} c={GREY} s={15}>0,1 kg</T>

      <Charge x={420} y={120} />
      <Charge x={540} y={120} />
      <Arrow x1={396} y1={120} x2={340} y2={120} c={V} dash />
      <Arrow x1={564} y1={120} x2={628} y2={120} c={V} dash />
      <T x={368} y={104} c={ASK} b>υ = ?</T>
      <T x={596} y={104} c={ASK} b>υ = ?</T>
      <T x={480} y={170} c={GREY} s={15}>U = 0</T>
      <T x={320} y={226} c={GREY} s={16}>Μόνο εσωτερικές δυνάμεις (Coulomb): ισχύει η ΑΔΟ</T>
    </Fig>
  );
}

function B6() {
  return (
    <Fig h={310} label="Σώμα ακίνητο σε απόσταση 2R από το κέντρο της Γης σπάει σε δύο ίσα κομμάτια. Το ένα διαφεύγει οριακά. Ζητείται η ταχύτητα του άλλου.">
      <clipPath id="b6-clip">
        <rect x={0} y={0} width={640} height={310} />
      </clipPath>
      <circle cx={320} cy={520} r={260} fill="#d7e8f6" stroke={V} strokeWidth={2.5} clipPath="url(#b6-clip)" />
      <T x={320} y={296} c={V} s={18} b>Γη (ακτίνα R)</T>
      <circle cx={310} cy={140} r={11} fill="#f2a65a" stroke={INK} strokeWidth={2} />
      <circle cx={332} cy={140} r={11} fill="#f2a65a" stroke={INK} strokeWidth={2} />
      <Arrow x1={321} y1={124} x2={321} y2={40} c={V} />
      <T x={340} y={70} a="start" c={V} s={17} b>διαφεύγει οριακά (υ<Sub>δ</Sub><tspan dy="-0.3em">)</tspan></T>
      <Arrow x1={321} y1={156} x2={321} y2={240} c={V} dash />
      <T x={340} y={210} a="start" c={ASK} s={20} b>υ₂ = ?</T>
      <T x={290} y={145} a="end" s={16}>πριν: υ = 0</T>
      <T x={290} y={168} a="end" c={GREY} s={15}>απόσταση από το κέντρο: r = 2R</T>
      <T x={20} y={30} a="start" c={GREY} s={15}>g₀ = 10 m/s²,  R = 6,4·10⁶ m</T>
    </Fig>
  );
}

/* ───────── Ομάδα Γ ───────── */

function Bar({ x, y, w, label, pct }: { x: number; y: number; w: number; label: string; pct: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={16} rx={8} fill={EN} />
      <T x={x} y={y - 8} a="start" c={EN} s={15} b>
        {label}
      </T>
      <T x={x + w + 8} y={y + 13} a="start" c={EN} s={15} b>
        {pct}
      </T>
    </g>
  );
}

function G1() {
  return (
    <Fig h={240} label="Σώμα m με ταχύτητα υ συγκρούεται πλαστικά με ακίνητο σώμα 3m. Ζητείται το ποσοστό της κινητικής ενέργειας που γίνεται θερμότητα.">
      <Panels h={200} right="Μετά: πλαστική κρούση" />
      <Box x={40} y={108} w={50} h={42} label="m" />
      <Arrow x1={46} y1={88} x2={150} y2={88} c={V} />
      <T x={98} y={76} c={V} b>υ</T>
      <Box x={170} y={90} w={110} h={60} label="3m" />
      <T x={225} y={78} c={GREY} s={15}>ακίνητο</T>
      <Ground x1={20} x2={305} y={150} />

      <Box x={400} y={90} w={150} h={60} label="m + 3m" />
      <Arrow x1={410} y1={72} x2={480} y2={72} c={V} />
      <T x={445} y={60} c={V} b>V</T>
      <Ground x1={335} x2={620} y={150} />
      <T x={320} y={226} c={ASK} s={20} b>Q = ? % της αρχικής K</T>
    </Fig>
  );
}

function G2() {
  return (
    <Fig h={260} label="Σε πλαστική κρούση με ακίνητο σώμα μένει το 20% της αρχικής κινητικής ενέργειας. Ζητείται ο λόγος των μαζών.">
      <Panels h={220} right="Μετά: πλαστική κρούση" />
      <Box x={40} y={70} w={60} h={46} label="m₁" />
      <Arrow x1={104} y1={93} x2={170} y2={93} c={V} />
      <T x={137} y={80} c={V} b>υ₁</T>
      <Box x={200} y={70} w={70} h={46} label="m₂" />
      <T x={235} y={58} c={GREY} s={15}>ακίνητο</T>
      <Ground x1={20} x2={305} y={116} />
      <Bar x={30} y={170} w={220} label="K αρχική" pct="100%" />

      <Box x={400} y={70} w={130} h={46} label="m₁ + m₂" />
      <Arrow x1={534} y1={93} x2={590} y2={93} c={V} />
      <T x={562} y={80} c={V} b>V</T>
      <Ground x1={335} x2={620} y={116} />
      <Bar x={350} y={170} w={44} label="K τελική" pct="20%" />
      <T x={320} y={248} c={ASK} s={20} b>m₁ / m₂ = ?</T>
    </Fig>
  );
}

function G3() {
  return (
    <BulletBox
      mass="1,6 kg"
      ask="Τι ποσοστό της αρχικής K του βλήματος πήρε το κιβώτιο;"
      label="Βλήμα 0,1 kg από 100 m/s βγαίνει με 20 m/s, το κιβώτιο 1,6 kg αποκτά 5 m/s. Ζητείται το ποσοστό της κινητικής ενέργειας που πήρε το κιβώτιο."
    />
  );
}

/* ───────── Ομάδα Δ ───────── */

function D1() {
  return (
    <Fig h={310} label="Βλήμα 10 g σφηνώνεται σε κιβώτιο 30 g στην άκρη τραπεζιού ύψους 0,8 m και πέφτει 0,8 m μακριά. Ζητείται η ταχύτητα του βλήματος.">
      <rect x={70} y={150} width={190} height={10} fill={BOX} stroke={INK} strokeWidth={2.5} />
      <line x1={90} y1={160} x2={90} y2={270} stroke={INK} strokeWidth={4} />
      <line x1={240} y1={160} x2={240} y2={270} stroke={INK} strokeWidth={4} />
      <Box x={218} y={118} w={40} h={32} />
      <T x={238} y={108} c={GREY} s={15}>30 g</T>
      <rect x={100} y={128} width={28} height={12} rx={6} fill={INK} />
      <T x={114} y={118} c={GREY} s={15}>10 g</T>
      <Arrow x1={134} y1={134} x2={210} y2={134} c={V} dash />
      <T x={150} y={190} c={ASK} s={20} b>υ = ?</T>
      <path d="M258 134 Q 340 134 390 270" fill="none" stroke={GREY} strokeWidth={2.5} strokeDasharray="7 6" />
      <circle cx={390} cy={262} r={7} fill={GREY} />
      <Ground x1={30} x2={620} y={270} />
      <line x1={60} y1={150} x2={60} y2={270} stroke={INK} strokeWidth={1.5} />
      <T x={54} y={215} a="end" s={16}>0,8 m</T>
      <line x1={258} y1={286} x2={390} y2={286} stroke={INK} strokeWidth={1.5} />
      <line x1={258} y1={278} x2={258} y2={294} stroke={INK} strokeWidth={1.5} />
      <line x1={390} y1={278} x2={390} y2={294} stroke={INK} strokeWidth={1.5} />
      <T x={324} y={306} s={16}>0,8 m</T>
      <T x={460} y={150} a="start" c={GREY} s={15}>οριζόντια βολή</T>
      <T x={460} y={60} a="start" c={GREY} s={15}>g = 10 m/s²</T>
    </Fig>
  );
}

function D2() {
  return (
    <Fig h={320} label="Ακίνητο σώμα σε ύψος εκρήγνυται σε δύο κομμάτια με m₂ = 2m₁ που κινούνται οριζόντια, πέφτουν σε 3 s σε σημεία που απέχουν 180 m. Ζητούνται οι ταχύτητες.">
      <circle cx={306} cy={70} r={9} fill="#f2a65a" stroke={INK} strokeWidth={2} />
      <circle cx={334} cy={70} r={13} fill="#f2a65a" stroke={INK} strokeWidth={2} />
      <T x={300} y={44} a="end" s={15} b>m₁</T>
      <T x={342} y={44} a="start" s={15} b>m₂ = 2m₁</T>
      <Arrow x1={294} y1={70} x2={230} y2={70} c={V} dash />
      <T x={250} y={98} c={ASK} b>υ₁ = ?</T>
      <Arrow x1={350} y1={70} x2={410} y2={70} c={V} dash />
      <T x={394} y={98} c={ASK} b>υ₂ = ?</T>
      <path d="M298 70 Q 90 70 80 262" fill="none" stroke={GREY} strokeWidth={2.5} strokeDasharray="7 6" />
      <path d="M345 70 Q 440 70 444 262" fill="none" stroke={GREY} strokeWidth={2.5} strokeDasharray="7 6" />
      <Ground x1={30} x2={620} y={262} />
      <line x1={80} y1={290} x2={444} y2={290} stroke={INK} strokeWidth={1.5} />
      <line x1={80} y1={282} x2={80} y2={298} stroke={INK} strokeWidth={1.5} />
      <line x1={444} y1={282} x2={444} y2={298} stroke={INK} strokeWidth={1.5} />
      <T x={262} y={312} s={16} b>180 m</T>
      <line x1={540} y1={70} x2={540} y2={262} stroke={INK} strokeWidth={1.5} />
      <T x={552} y={160} a="start" s={16}>πτώση</T>
      <T x={552} y={182} a="start" s={16} b>σε 3 s</T>
      <T x={320} y={22} c={GREY} s={15}>ακίνητο πριν σπάσει</T>
    </Fig>
  );
}

function D3() {
  return (
    <Fig h={230} label="Συσσωμάτωμα με 5 m/s σε επίπεδο με τριβή μ = 0,2. Ζητούνται ο χρόνος κίνησης και η απόσταση.">
      <Box x={60} y={100} w={100} h={50} label="m + M" />
      <Arrow x1={70} y1={80} x2={200} y2={80} c={V} />
      <T x={135} y={68} c={V} b>V = 5 m/s</T>
      <Arrow x1={60} y1={140} x2={14} y2={140} c={F} />
      <T x={30} y={128} c={F} b>T</T>
      <Box x={460} y={100} w={100} h={50} dash />
      <T x={510} y={88} c={GREY} s={16}>σταματά (υ = 0)</T>
      <Ground x1={10} x2={630} y={150} />
      <T x={320} y={140} c={GREY} s={16}>μ = 0,2</T>
      <line x1={110} y1={188} x2={510} y2={188} stroke={ASK} strokeWidth={1.8} strokeDasharray="6 5" />
      <line x1={110} y1={180} x2={110} y2={196} stroke={ASK} strokeWidth={1.8} />
      <line x1={510} y1={180} x2={510} y2={196} stroke={ASK} strokeWidth={1.8} />
      <T x={310} y={216} c={ASK} s={20} b>s = ?,  t = ?</T>
    </Fig>
  );
}

function D4() {
  return (
    <Fig h={310} label="Κάτοψη: σώμα 1 kg με 20 m/s συγκρούεται πλαστικά με σώμα 1 kg δεμένο σε έλασμα. Κύκλος ακτίνας 0,2 m. Ζητείται η δύναμη από το έλασμα.">
      <T x={16} y={26} a="start" c={GREY} s={15} b>
        ΚΑΤΟΨΗ (ΑΠΟ ΠΑΝΩ)
      </T>
      <circle cx={430} cy={150} r={110} fill="none" stroke={GREY} strokeWidth={2} strokeDasharray="7 7" />
      <line x1={430} y1={150} x2={430} y2={244} stroke={INK} strokeWidth={4} />
      <circle cx={430} cy={150} r={7} fill={INK} />
      <T x={444} y={146} a="start" s={15}>O</T>
      <T x={442} y={205} a="start" s={16}>R = 0,2 m</T>
      <Box x={413} y={244} w={34} h={34} />
      <T x={470} y={292} a="start" c={GREY} s={15}>1 kg (στο έλασμα)</T>
      <Arrow x1={406} y1={238} x2={406} y2={176} c={F} dash />
      <T x={392} y={212} a="end" c={ASK} s={20} b>F = ?</T>

      <Box x={150} y={244} w={34} h={34} />
      <T x={167} y={298} c={GREY} s={15}>1 kg</T>
      <Arrow x1={192} y1={261} x2={396} y2={261} c={V} />
      <T x={294} y={248} c={V} b>20 m/s</T>
      <T x={150} y={120} c={GREY} s={15}>πλαστική κρούση,</T>
      <T x={150} y={140} c={GREY} s={15}>μετά κύκλος</T>
    </Fig>
  );
}

function D5() {
  return (
    <Fig h={270} label="Σώμα αφήνεται από ύψος 0,45 m σε λεία καμπύλη και κάτω συγκρούεται πλαστικά με ακίνητο σώμα ίσης μάζας. Ζητείται η ταχύτητα του συσσωματώματος.">
      <path d="M80 60 Q 110 222 280 222 L 620 222" fill="none" stroke={INK} strokeWidth={3} />
      <circle cx={84} cy={50} r={13} fill="#f2a65a" stroke={INK} strokeWidth={2} />
      <T x={108} y={46} a="start" s={16} b>m</T>
      <T x={112} y={74} a="start" c={GREY} s={15}>αφήνεται (υ = 0)</T>
      <line x1={40} y1={50} x2={40} y2={222} stroke={INK} strokeWidth={1.5} />
      <line x1={32} y1={50} x2={48} y2={50} stroke={INK} strokeWidth={1.5} />
      <line x1={32} y1={222} x2={48} y2={222} stroke={INK} strokeWidth={1.5} />
      <T x={52} y={150} a="start" s={16}>0,45 m</T>
      <T x={180} y={180} c={GREY} s={15}>λεία</T>
      <Box x={330} y={190} w={40} h={32} label="m" />
      <T x={350} y={178} c={GREY} s={15}>ακίνητο</T>
      <Arrow x1={392} y1={150} x2={500} y2={150} c={V} dash />
      <T x={446} y={136} c={ASK} s={20} b>V = ?</T>
      <T x={446} y={258} c={GREY} s={15}>πλαστική κρούση στη βάση · g = 10 m/s²</T>
    </Fig>
  );
}

/** Σχήμα ανά περίπτωση (κλειδί: id της περίπτωσης). */
export const CASE_FIGURES: Record<string, () => ReactNode> = {
  pa1: A1,
  pa2: A2,
  pa3: A3,
  pa4: A4,
  pa5: A5,
  pa6: A6,
  pb1: B1,
  pb2: B2,
  pb3: B3,
  pb4: B4,
  pb5: B5,
  pb6: B6,
  pc1: G1,
  pc2: G2,
  pc3: G3,
  pd1: D1,
  pd2: D2,
  pd3: D3,
  pd4: D4,
  pd5: D5,
};
