import type { ReactNode } from "react";

/** Τα τέσσερα ποιοτικά διαγράμματα του κεφαλαίου: E–|Q|, E–r, V–r, U–r. */

const W = 240;
const H = 170;
const OX = 34; // origin x
const OY_TOP = 150; // origin y when only positive values
const OY_MID = 88; // origin y when the graph has both signs

const INK = "#1c2433";
const MUTED = "#5b6577";
const GREEN = "#1f9d55";
const ORANGE = "#e08a1e";
const BLUE = "#3d7fd6";

function path(f: (r: number) => number, ox: number, oy: number, sx: number, sy: number, r0: number, r1: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const r = r0 + ((r1 - r0) * i) / 60;
    pts.push(`${(ox + r * sx).toFixed(1)},${(oy - f(r) * sy).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")}`;
}

function Axes({ oy, x, y, both = false }: { oy: number; x: string; y: string; both?: boolean }) {
  return (
    <g>
      <line x1={OX} y1={both ? 158 : oy} x2={OX} y2={12} stroke={INK} strokeWidth={1.2} />
      <polygon points={`${OX},6 ${OX - 4},14 ${OX + 4},14`} fill={INK} />
      <line x1={OX} y1={oy} x2={W - 10} y2={oy} stroke={INK} strokeWidth={1.2} />
      <polygon points={`${W - 4},${oy} ${W - 12},${oy - 4} ${W - 12},${oy + 4}`} fill={INK} />
      <text x={OX - 8} y={14} fontSize={12} fontStyle="italic" fontWeight={700} fill={INK} textAnchor="end">
        {y}
      </text>
      <text x={W - 8} y={oy + 16} fontSize={12} fontStyle="italic" fontWeight={700} fill={INK} textAnchor="end">
        {x}
      </text>
      <text x={OX - 6} y={oy + 13} fontSize={10} fill={MUTED} textAnchor="end">
        0
      </text>
    </g>
  );
}

function Label({ x, y, s, color }: { x: number; y: number; s: string; color: string }) {
  return (
    <text x={x} y={y} fontSize={11} fontWeight={700} fill={color}>
      {s}
    </text>
  );
}

const GRAPHS: { title: string; formula: string; svg: ReactNode; text: string }[] = [
  {
    title: "E–|Q| (ίδια απόσταση r)",
    formula: "E = k|Q|/r²",
    svg: (
      <>
        <Axes oy={OY_TOP} x="|Q|" y="E" />
        <line x1={OX} y1={OY_TOP} x2={210} y2={30} stroke={GREEN} strokeWidth={2.6} />
      </>
    ),
    text: "Ευθεία από την αρχή: η ένταση είναι ανάλογη του φορτίου. Διπλάσιο |Q| ⇒ διπλάσια E.",
  },
  {
    title: "E–r (ίδιο φορτίο Q)",
    formula: "E = k|Q|/r²",
    svg: (
      <>
        <Axes oy={OY_TOP} x="r" y="E" />
        <path d={path((r) => 1 / (r * r), OX, OY_TOP, 40, 78, 0.9, 4.6)} fill="none" stroke={GREEN} strokeWidth={2.6} />
        <path d={path((r) => 1 / r, OX, OY_TOP, 40, 78, 0.9, 4.6)} fill="none" stroke={MUTED} strokeWidth={1.2} strokeDasharray="4 3" />
        <Label x={128} y={112} s="1/r (σύγκριση)" color={MUTED} />
      </>
    ),
    text: "Πέφτει σαν 1/r²: σε διπλάσια απόσταση ¼, σε τριπλάσια 1/9. Πέφτει πιο γρήγορα από το δυναμικό (διακεκομμένη). Δεν γίνεται ποτέ αρνητική: είναι μέτρο.",
  },
  {
    title: "V–r (πεδίο ενός φορτίου Q)",
    formula: "V = kQ/r",
    svg: (
      <>
        <Axes oy={OY_MID} x="r" y="V" both />
        <path d={path((r) => 1 / r, OX, OY_MID, 40, 52, 0.75, 4.6)} fill="none" stroke={ORANGE} strokeWidth={2.6} />
        <path d={path((r) => -1 / r, OX, OY_MID, 40, 52, 0.75, 4.6)} fill="none" stroke={BLUE} strokeWidth={2.6} />
        <Label x={150} y={64} s="Q > 0" color={ORANGE} />
        <Label x={150} y={120} s="Q < 0" color={BLUE} />
      </>
    ),
    text: "Πάνω από τον άξονα για θετικό Q, κάτω για αρνητικό. Και οι δύο καμπύλες πλησιάζουν το 0 στο άπειρο. Πάει σαν 1/r (όχι 1/r²), γιατί είναι αριθμός με πρόσημο, όχι μέτρο.",
  },
  {
    title: "U–r (σύστημα δύο φορτίων)",
    formula: "U = kq₁q₂/r",
    svg: (
      <>
        <Axes oy={OY_MID} x="r" y="U" both />
        <path d={path((r) => 1 / r, OX, OY_MID, 40, 52, 0.75, 4.6)} fill="none" stroke={ORANGE} strokeWidth={2.6} />
        <path d={path((r) => -1 / r, OX, OY_MID, 40, 52, 0.75, 4.6)} fill="none" stroke={BLUE} strokeWidth={2.6} />
        <Label x={128} y={64} s="ομόσημα (q₁q₂ > 0)" color={ORANGE} />
        <Label x={118} y={122} s="ετερόσημα (q₁q₂ < 0)" color={BLUE} />
      </>
    ),
    text: "Ίδιο σχήμα με το V–r. Ομόσημα: U > 0 και μικραίνει όσο απομακρύνονται (φεύγουν μόνα τους). Ετερόσημα: U < 0 και μεγαλώνει προς το 0 (θέλουν ενέργεια για να χωρίσουν). Στο άπειρο U = 0.",
  },
];

export function PedioGraphs() {
  return (
    <section id="diagrammata" className="scroll-mt-20 border-t border-[#ddd5c7] pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Ζητούνται στις εξετάσεις</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Τα διαγράμματα του κεφαλαίου</h2>
      <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
        Τέσσερα διαγράμματα που σου ζητάνε να «κατασκευάσεις» ή να αναγνωρίσεις. Μάθε τη μορφή τους και τη διαφορά: η ένταση πάει σαν 1/r² και είναι
        πάντα θετική (μέτρο), το δυναμικό και η δυναμική ενέργεια πάνε σαν 1/r και έχουν πρόσημο.
      </p>
      <div className="mt-6 grid gap-x-[2.5rem] gap-y-[2rem] sm:grid-cols-2 xl:grid-cols-4">
        {GRAPHS.map((g) => (
          <figure key={g.title} className="border-t-2 border-[#c9822f]/60 pt-3">
            <figcaption>
              <p className="font-semibold text-[#1c2433]">{g.title}</p>
              <p className="text-sm font-semibold text-[#a8651f]">{g.formula}</p>
            </figcaption>
            <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 block w-full max-w-[320px]" role="img" aria-label={`Διάγραμμα ${g.title}`} fontFamily="Inter, 'Segoe UI', Roboto, Arial, sans-serif">
              {g.svg}
            </svg>
            <p className="mt-2 text-sm leading-6 text-[#3d4452]">{g.text}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}
