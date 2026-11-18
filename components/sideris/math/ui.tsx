import type { ReactNode } from "react";

/** Stacked fraction n/d. Nests, so compound fractions work: <F n={<F n={2} d={3} />} d={5} />. */
export function F({ n, d }: { n: ReactNode; d: ReactNode }) {
  return (
    <span className="mx-[0.12em] inline-flex flex-col items-center align-middle leading-none">
      <span className="px-[0.2em] pb-[0.14em]">{n}</span>
      <span className="w-full border-t-[1.5px] border-current px-[0.2em] pt-[0.14em] text-center">{d}</span>
    </span>
  );
}

/** Mixed number: whole + n/d, e.g. 2 3/4. */
export function Mx({ w, n, d }: { w: ReactNode; n: ReactNode; d: ReactNode }) {
  return (
    <span className="inline-flex items-center">
      {w}
      <F n={n} d={d} />
    </span>
  );
}

/** Inline maths: keeps an expression on one line and colours it like the book's handwriting. */
export function M({ children }: { children: ReactNode }) {
  return <span className="mx-[0.1em] inline-flex flex-wrap items-center gap-x-[0.2em] font-semibold text-[#1d5a8c]">{children}</span>;
}

/** A displayed (own line) maths expression. */
export function Eq({ children }: { children: ReactNode }) {
  return (
    <div className="my-2 overflow-x-auto py-1">
      <div className="inline-flex flex-wrap items-center gap-x-[0.3em] gap-y-2 text-lg font-semibold text-[#1d5a8c]">{children}</div>
    </div>
  );
}

export function Section({ id, code, title, children }: { id: string; code: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-11 shrink-0 place-items-center rounded-xl bg-[#3d6b3a] px-3 text-base font-bold text-white">{code}</span>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Block({ title, tone = "plain", children }: { title: string; tone?: "theory" | "plain" | "warn"; children: ReactNode }) {
  const styles = {
    theory: "border-[#c96a2b]/30 bg-[#fff7ef]",
    plain: "border-black/10 bg-white",
    warn: "border-[#b33a3a]/25 bg-[#fdf1f0]",
  }[tone];
  const head = {
    theory: "text-[#a2531f]",
    plain: "text-[#3d6b3a]",
    warn: "text-[#9b2c2c]",
  }[tone];
  return (
    <div className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${styles}`}>
      <h3 className={`mb-3 text-sm font-bold uppercase tracking-[0.14em] ${head}`}>{title}</h3>
      <div className="space-y-3 text-[15px] leading-7 sm:text-base">{children}</div>
    </div>
  );
}

/** One rule of theory, with an optional worked example on the side. */
export function Rule({ children, ex }: { children: ReactNode; ex?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-black/5 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex gap-2">
        <span className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full bg-[#c96a2b]" />
        <div>{children}</div>
      </div>
      {ex ? <div className="shrink-0 rounded-xl bg-white/80 px-3 py-1.5 text-[#1d5a8c] sm:max-w-[45%]">{ex}</div> : null}
    </div>
  );
}

export function Example({ n, q, children }: { n: number; q: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4">
      <p className="font-medium">
        <span className="mr-2 font-bold text-[#a2531f]">{n}.</span>
        {q}
      </p>
      <div className="mt-2 border-l-4 border-[#e2b26a] pl-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a2531f]">Λύση</p>
        <div className="mt-1 space-y-2">{children}</div>
      </div>
    </div>
  );
}

export type Mark = "kyklomeni" | "spiti";

export function Exercise({ n, q, mark, children }: { n: number; q: ReactNode; mark?: Mark; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start gap-2">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
            mark ? "border-2 border-[#2f4f9a] text-[#2f4f9a]" : "bg-[#eef3ec] text-[#3d6b3a]"
          }`}
        >
          {n}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          {mark ? (
            <span className="mb-1 mr-2 inline-block rounded-full bg-[#e8edf9] px-2 py-0.5 text-xs font-semibold text-[#2f4f9a]">
              {mark === "spiti" ? "Για το σπίτι" : "Κυκλωμένη στο βιβλίο"}
            </span>
          ) : null}
          <div>{q}</div>
        </div>
      </div>
      <details className="group mt-3">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-xl border border-black/10 bg-[#f7f4ef] px-3 py-1.5 text-sm font-semibold text-[#4d4138] transition hover:bg-[#ece4da]">
          <span className="group-open:hidden">Δείξε τη λύση ▾</span>
          <span className="hidden group-open:inline">Κρύψε τη λύση ▴</span>
        </summary>
        <div className="mt-3 space-y-2 border-l-4 border-[#9cc29a] pl-4">{children}</div>
      </details>
    </div>
  );
}

/** Lettered sub-items (α), (β), ... laid out as a wrapping list. */
export function Parts({ items }: { items: ReactNode[] }) {
  const letters = ["α", "β", "γ", "δ", "ε", "στ", "ζ", "η", "θ", "ι", "ια"];
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((item, i) => (
        <li key={i} className="inline-flex items-center gap-1">
          <span className="text-[#857261]">({letters[i]})</span> {item}
        </li>
      ))}
    </ul>
  );
}

/** Lettered steps of a solution, one per line. */
export function Steps({ items }: { items: ReactNode[] }) {
  const letters = ["α", "β", "γ", "δ", "ε", "στ", "ζ", "η", "θ", "ι", "ια"];
  return (
    <ol className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex flex-wrap items-center gap-x-1">
          <span className="mr-1 text-[#857261]">({letters[i]})</span> {item}
        </li>
      ))}
    </ol>
  );
}

export function Table({ head, rows, op }: { head: ReactNode[]; rows: { label: ReactNode; cells: ReactNode[] }[]; op: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-center text-[#1d5a8c]">
        <thead>
          <tr>
            <th className="border border-black/15 bg-[#f6e3c7] px-3 py-2 text-lg text-[#b33a3a]">{op}</th>
            {head.map((h, i) => (
              <th key={i} className="border border-black/15 bg-[#f6e3c7] px-3 py-2 font-semibold text-[#2c2825]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <th className="border border-black/15 bg-[#dbe9d6] px-3 py-2 font-semibold text-[#2c2825]">{r.label}</th>
              {r.cells.map((c, j) => (
                <td key={j} className="border border-black/15 bg-white px-3 py-2 font-semibold">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Η «χρυσή» θεωρία της ενότητας, με κινούμενο χρωματιστό περίγραμμα. */
export function KeyIdea({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="sx-key rounded-3xl p-[3px] shadow-md">
      <div className="rounded-[calc(1.5rem-3px)] bg-white p-5 sm:p-6">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-[#a2531f]">
          <span className="sx-float">🔑</span> Θυμήσου: {title}
        </p>
        <div className="space-y-2 text-[17px] leading-8">{children}</div>
      </div>
    </div>
  );
}

/** Μικρή εισαγωγή από την καθημερινή ζωή. */
export function Hook({ emoji, children }: { emoji: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 rounded-3xl bg-[#2c2825] p-5 text-white shadow-md">
      <span className="sx-float text-4xl">{emoji}</span>
      <p className="text-[17px] leading-8">{children}</p>
    </div>
  );
}
