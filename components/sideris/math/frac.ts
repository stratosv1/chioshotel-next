export type Fr = { n: number; d: number };

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
export function reduce(f: Fr): Fr {
  const g = gcd(f.n, f.d);
  return { n: f.n / g, d: f.d / g };
}
export const same = (a: Fr, b: Fr) => a.n * b.d === b.n * a.d;
export const isReduced = (f: Fr) => gcd(f.n, f.d) === 1;
export const rnd = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/** Δέχεται «3», «3/4», «2 1/3» (μεικτός). Επιστρέφει null αν δεν καταλαβαίνει. */
export function parseFrac(raw: string): Fr | null {
  const s = raw.replace(/[−–]/g, "-").replace(/\s+/g, " ").trim();
  let m = s.match(/^(\d+) (\d+)\s*\/\s*(\d+)$/);
  if (m) return +m[3] ? { n: +m[1] * +m[3] + +m[2], d: +m[3] } : null;
  m = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (m) return +m[2] ? { n: +m[1], d: +m[2] } : null;
  if (/^\d+$/.test(s)) return { n: +s, d: 1 };
  return null;
}

/** Κλάσμα → markup του MathText, π.χ. {7/4} ή {1|3/4} ή 2. */
export function fmt(f: Fr, mixed = false): string {
  const r = reduce(f);
  if (r.d === 1) return String(r.n);
  if (mixed && r.n > r.d) return `{${Math.floor(r.n / r.d)}|${r.n % r.d}/${r.d}}`;
  return `{${r.n}/${r.d}}`;
}
