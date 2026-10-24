/**
 * Full-bleed hero that opens the full-screen theory deck (public/mixalis/dianismata-theory.html).
 * The background is an animated coordinate plane drawn in SVG with CSS keyframes (no JS).
 */

const DECK = "/mixalis/dianismata-theory.html";

const chapters = [
  { letter: "Α", title: "Τα βασικά", text: "Τι είναι διάνυσμα, πρόσθεση, λ·α, οι λέξεις που θα ακούς", slide: 0 },
  { letter: "Β", title: "Συντεταγμένες", text: "Άξονας, επίπεδο Oxy, α = (x, y), πράξεις", slide: 4 },
  { letter: "Γ", title: "Σημεία", text: "AB = τέλος − αρχή, μέσο, κέντρο βάρους, μέτρο, απόσταση", slide: 11 },
  { letter: "Δ", title: "Κατεύθυνση", text: "Τριγωνομετρία, γωνία φ, λ, ορίζουσα, παραλληλία", slide: 21 },
]

export function TheoryHero() {
  return (
    <section id="theoria" className="relative overflow-hidden bg-[#141821] text-white">
      <style>{`
        .th-grid { stroke: rgba(255,255,255,.07); }
        .th-axis { stroke: rgba(255,255,255,.35); }
        .th-vec { stroke-dasharray: 400; stroke-dashoffset: 400; animation: th-draw 6s cubic-bezier(.2,.8,.2,1) infinite; }
        .th-vec.b { animation-delay: 1s; } .th-vec.c { animation-delay: 2s; }
        .th-head { opacity: 0; animation: th-fade 6s ease infinite; }
        .th-head.b { animation-delay: 1s; } .th-head.c { animation-delay: 2s; }
        .th-dash { stroke-dasharray: 5 6; animation: th-march 1.2s linear infinite; }
        .th-spin { transform-origin: 600px 300px; animation: th-spin 14s linear infinite; }
        .th-rise { animation: th-rise .8s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes th-draw { 0% { stroke-dashoffset: 400; } 30%, 80% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 0; opacity: 0; } }
        @keyframes th-fade { 0%, 22% { opacity: 0; } 32%, 80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes th-march { to { stroke-dashoffset: -22; } }
        @keyframes th-spin { to { transform: rotate(360deg); } }
        @keyframes th-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .th-vec, .th-head, .th-dash, .th-spin, .th-rise { animation: none !important; stroke-dashoffset: 0; opacity: 1; } }
      `}</style>

      <svg aria-hidden="true" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full">
        {Array.from({ length: 25 }, (_, i) => (
          <line key={`v${i}`} className="th-grid" x1={i * 50} y1={0} x2={i * 50} y2={600} />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`h${i}`} className="th-grid" x1={0} y1={i * 50} x2={1200} y2={i * 50} />
        ))}
        <line className="th-axis" x1={0} y1={300} x2={1200} y2={300} />
        <line className="th-axis" x1={600} y1={0} x2={600} y2={600} />
        {/* α = (3, 2) drawn as staircase + arrow */}
        <path className="th-dash" d="M600 300 H750 V200" fill="none" stroke="#45cf8c" strokeWidth={2.5} />
        <line className="th-vec" x1={600} y1={300} x2={750} y2={200} stroke="#6aa6ff" strokeWidth={5} strokeLinecap="round" />
        <polygon className="th-head" points="760,193 735,198 748,216" fill="#6aa6ff" />
        <line className="th-vec b" x1={600} y1={300} x2={850} y2={400} stroke="#ff7a6e" strokeWidth={5} strokeLinecap="round" />
        <polygon className="th-head b" points="861,404 838,390 832,409" fill="#ff7a6e" />
        <line className="th-vec c" x1={750} y1={200} x2={1000} y2={300} stroke="#c58af0" strokeWidth={4} strokeLinecap="round" strokeDasharray="6 6" />
        <g className="th-spin">
          <line x1={600} y1={300} x2={600 + 220} y2={300} stroke="rgba(243,166,74,.55)" strokeWidth={3} strokeLinecap="round" />
          <circle cx={820} cy={300} r={5} fill="#f3a64a" />
        </g>
        <circle cx={600} cy={300} r={150} fill="none" stroke="rgba(243,166,74,.25)" strokeWidth={1.5} strokeDasharray="3 7" />
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#141821] via-[#141821]/70 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-6 sm:px-8 sm:pb-20 sm:pt-8">
        <a href="/mixalis" className="th-rise text-sm font-semibold text-white/55 hover:text-white">
          ← Αρχική
        </a>
        <p className="th-rise mt-10 text-sm font-semibold uppercase tracking-[0.2em] text-[#e7b77a] sm:mt-14">Μαθηματικά Προσανατολισμού · Β΄ Λυκείου</p>
        <h1 className="th-rise mt-3 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl" style={{ animationDelay: ".08s" }}>
          Διανύσματα
        </h1>
        <p className="th-rise mt-5 max-w-xl text-[15px] leading-7 text-white/75 sm:text-base" style={{ animationDelay: ".16s" }}>
          Τρία βήματα με τη σειρά: πρώτα η θεωρία σε 31 κινούμενες διαφάνειες (από το «τι είναι διάνυσμα» μέχρι την παραλληλία), μετά τα
          θέματα της Τράπεζας και στο τέλος εξάσκηση με αυτόματο έλεγχο.
        </p>
        <div className="th-rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ animationDelay: ".24s" }}>
          <a
            href={DECK}
            className="inline-flex items-center gap-2 rounded-full bg-[#e7b77a] px-6 py-3 text-base font-semibold text-[#141821] shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-[#f0c98f]"
          >
            1. Ξεκίνα τη θεωρία <span aria-hidden="true">→</span>
          </a>
          <a href="#trapeza" className="text-sm font-semibold text-white/70 hover:text-white">
            2. Τράπεζα Θεμάτων ↓
          </a>
          <a href="#eksaskisi" className="text-sm font-semibold text-white/70 hover:text-white">
            3. Εξάσκηση ↓
          </a>
        </div>

        <div className="mt-14 grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {chapters.map((c, i) => (
            <a
              key={c.letter}
              href={`${DECK}?s=${c.slide}`}
              className="th-rise group relative flex gap-4 border-b border-white/10 py-5 transition sm:pr-6 lg:border-b-0"
              style={{ animationDelay: `${0.32 + i * 0.08}s` }}
            >
              <span
                aria-hidden="true"
                className="text-5xl font-bold leading-none text-transparent transition duration-300 group-hover:-translate-y-1"
                style={{ WebkitTextStroke: "1.5px rgba(231,183,122,.7)" }}
              >
                {c.letter}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold transition group-hover:text-[#e7b77a]">{c.title} →</span>
                <span className="mt-1 block text-sm leading-6 text-white/60">{c.text}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
