import type { ReactNode } from "react";

/** Διάνυσμα με βελάκι από πάνω: <V>AB</V>, <V>α</V>. */
export function V({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap" style={{ paddingTop: "0.42em", lineHeight: 1.1 }}>
      <span aria-hidden="true" className="pointer-events-none absolute left-[0.04em] right-[0.14em] top-[0.2em] border-t-[1.5px] border-current" />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-[0.2em] -translate-y-1/2"
        width="0.38em"
        height="0.38em"
        viewBox="0 0 6 6"
      >
        <path d="M0.5 0.5 L5.5 3 L0.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      {children}
    </span>
  );
}

/** Μέτρο διανύσματος: |α⃗|. */
export function Abs({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap">
      |{children}|
    </span>
  );
}

/** Κλάσμα σε μία γραμμή κειμένου. */
export function Frac({ n, d }: { n: ReactNode; d: ReactNode }) {
  return (
    <span className="mx-[0.1em] inline-flex flex-col items-center align-middle text-[0.8em] leading-none">
      <span className="px-[0.15em] pb-[0.1em]">{n}</span>
      <span className="w-full border-t border-current px-[0.15em] pt-[0.1em]">{d}</span>
    </span>
  );
}

/** Ζεύγος συντεταγμένων με ελληνική υποδιαστολή. */
export function num(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.round(value * 1000) / 1000;
  return rounded.toLocaleString("el-GR", { maximumFractionDigits: 3 }).replace("-", "−");
}

export function pair(x: number, y: number): string {
  return `(${num(x)}, ${num(y)})`;
}

/** Γράφει √n απλοποιημένη (π.χ. √8 = 2√2) ή ακέραιο όταν είναι τέλειο τετράγωνο. */
export function sqrtText(n: number): string {
  if (n < 0) return "—";
  const r = Math.round(Math.sqrt(n));
  if (r * r === n) return String(r);
  let outside = 1;
  let inside = n;
  for (let k = Math.floor(Math.sqrt(n)); k >= 2; k--) {
    if (inside % (k * k) === 0) {
      outside = k;
      inside = inside / (k * k);
      break;
    }
  }
  return outside === 1 ? `√${inside}` : `${outside}√${inside}`;
}

/** Γωνία με «καπέλο» στη μεσαία κορυφή: <Ang>ΑΟΔ</Ang>. */
export function Ang({ children }: { children: string }) {
  const [a, b, c] = Array.from(children);
  return (
    <span className="whitespace-nowrap">
      {a}
      <span className="relative inline-block">
        {b}
        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-0.62em] -translate-x-1/2 text-[0.85em]">
          ^
        </span>
      </span>
      {c}
    </span>
  );
}
