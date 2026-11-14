import type { ReactNode } from "react";
import { V } from "@/components/mixalis/dianismata/math";

/**
 * Μικρή σήμανση για τα κείμενα της σελίδας:
 * "{α}" → διάνυσμα με βελάκι, "**λέξη**" → έντονα.
 */
export function rich(s: string): ReactNode {
  const out: ReactNode[] = [];
  const re = /\{([^}]+)\}|\*\*([^*]+)\*\*/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    if (m[1] !== undefined) out.push(<V key={i++}>{m[1]}</V>);
    else out.push(<b key={i++}>{m[2]}</b>);
    last = m.index + m[0].length;
  }
  if (!out.length) return s;
  if (last < s.length) out.push(s.slice(last));
  return <>{out}</>;
}
