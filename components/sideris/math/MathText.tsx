import { Fragment, type ReactNode } from "react";
import { F, Mx } from "./ui";

// Μικρή γλώσσα για κλάσματα μέσα σε κείμενο:
//   {3/4}        → κλάσμα
//   {2|1/3}      → μεικτός 2 1/3
//   [[A]/[B]]    → σύνθετο κλάσμα (A, B ξανά markup)
const TOKEN = /\[\[(.+?)\]\/\[(.+?)\]\]|\{([^{}|/]+)\|([^{}/]+)\/([^{}]+)\}|\{([^{}/]+)\/([^{}]+)\}/g;

export function MathText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index! > last) out.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1] !== undefined) out.push(<F key={k++} n={<MathText text={m[1]} />} d={<MathText text={m[2]} />} />);
    else if (m[3] !== undefined) out.push(<Mx key={k++} w={m[3]} n={m[4]} d={m[5]} />);
    else out.push(<F key={k++} n={m[6]} d={m[7]} />);
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}
