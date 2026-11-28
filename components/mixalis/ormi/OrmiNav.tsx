import Link from "next/link";

export type OrmiNavKey = "theoria" | "askiseis" | "trapeza" | "sintheta" | "proodos";

/**
 * Η μία διαδρομή του κεφαλαίου «Ορμή και κρούσεις» (owner, 2026-11-25):
 * όλο το υλικό χωρίζεται σε 4 βήματα + πρόοδο, και η ίδια μπάρα μπαίνει
 * στην κορυφή κάθε σελίδας του κεφαλαίου, ώστε να φαίνεται πάντα πού είσαι.
 */
const STEPS: { key: OrmiNavKey; n?: string; label: string; hint: string; href: string }[] = [
  { key: "theoria", n: "1", label: "Θεωρία & τυπολόγιο", hint: "μάθημα με κίνηση · 65 περιπτώσεις", href: "/mixalis/ormi" },
  { key: "askiseis", n: "2", label: "Εξάσκηση", hint: "ΑΔΟ ή Δp; · λυμένες Τριπολίτη", href: "/mixalis/ormi/askiseis" },
  { key: "trapeza", n: "3", label: "Τράπεζα Θεμάτων", hint: "20 περιπτώσεις · Θέματα 2", href: "/mixalis/ormi/trapeza" },
  { key: "sintheta", n: "4", label: "Σύνθετες", hint: "36 σενάρια · κόλπα · προκλήσεις", href: "/mixalis/ormi2" },
  { key: "proodos", label: "Πρόοδος", hint: "τι να ξαναδώ", href: "/mixalis/ormi2/proodos" },
];

export function OrmiNav({ active, className = "" }: { active: OrmiNavKey; className?: string }) {
  return (
    <nav aria-label="Ορμή και κρούσεις: τα βήματα του κεφαλαίου" className={`rounded-2xl border border-black/10 bg-white p-2 shadow-sm ${className}`}>
      <div className="flex items-center gap-x-4 gap-y-1 px-2 pb-1.5 pt-0.5 text-sm font-semibold">
        <Link href="/mixalis" prefetch={false} className="text-[#857261] hover:text-[#5f5045]">
          ← Τα μαθήματά μου
        </Link>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Ορμή και κρούσεις</span>
      </div>
      <ol className="flex gap-1.5 overflow-x-auto md:flex-wrap md:overflow-visible">
        {STEPS.map((s) => {
          const on = s.key === active;
          return (
            <li key={s.key} className="shrink-0">
              <Link
                href={s.href}
                prefetch={false}
                aria-current={on ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors ${
                  on ? "bg-[#2c2825] text-white" : "text-[#4d4138] hover:bg-[#f3efe8]"
                }`}
              >
                {s.n ? (
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                      on ? "bg-[#c9822f] text-white" : "bg-[#f3efe8] text-[#a8651f]"
                    }`}
                  >
                    {s.n}
                  </span>
                ) : (
                  <span aria-hidden="true" className={on ? "text-[#f2a65a]" : "text-[#c9822f]"}>★</span>
                )}
                <span className="leading-tight">
                  <span className="block text-sm font-semibold">{s.label}</span>
                  <span className={`block text-xs ${on ? "text-white/70" : "text-[#857261]"}`}>{s.hint}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Τύλιγμα για σελίδες του κεφαλαίου που έχουν δικό τους <main> (ormi2, κόλπα, προκλήσεις, πρόοδος). */
export function OrmiNavStrip({ active }: { active: OrmiNavKey }) {
  return (
    <div className="bg-[#f3efe8] px-3 pt-5 sm:px-6 sm:pt-8">
      <div className="mx-auto max-w-7xl">
        <OrmiNav active={active} />
      </div>
    </div>
  );
}
