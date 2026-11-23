import type { ReactNode } from "react";
import { StudyMark } from "@/components/mixalis/study/StudyMark";

/**
 * Theory + methodologies from the Karatzikos study guide (owner, 2026-11-23):
 * Unit 7 (pp. 425–432) potential energy of a system of point charges,
 * Unit 8 (pp. 467–480) motion of charged particles in a uniform field.
 * Every worked number was recomputed; one inconsistency in the book's data is flagged.
 * Layout: full width, no nested boxes (owner's preference for /mixalis study pages).
 */

type Example = { title: string; given: string; steps: string[]; result: string; warn?: ReactNode };
type Method = { n: number; title: string; when: string; how: string[]; examples: Example[]; exercises: string };

const unit7Theory: ReactNode[] = [
  <>
    <b>U = k·q₁·q₂ / r</b>, με τα πρόσημα των φορτίων. Ομόσημα φορτία ⇒ U &gt; 0, ετερόσημα ⇒ U &lt; 0. Όσο τα φορτία απομακρύνονται προς το άπειρο, το U
    πλησιάζει το 0.
  </>,
  <>
    Η U είναι το έργο που πρέπει να δώσει μια εξωτερική δύναμη για να φέρει το q₂ <b>από το άπειρο</b> στη θέση του, αργά (χωρίς να αποκτήσει κινητική
    ενέργεια). Αυτό βγαίνει με το ΘΜΚΕ.
  </>,
  <>
    Η δυναμική ενέργεια <b>ανήκει στο σύστημα</b>, όχι σε ένα από τα φορτία. Για τρία ή περισσότερα φορτία προσθέτεις έναν όρο για κάθε ζευγάρι
    (τρία φορτία ⇒ 3 όροι). Η «δυναμική ενέργεια του q₁ μέσα στο σύστημα» είναι το άθροισμα μόνο των όρων που περιέχουν το q₁.
  </>,
  <>
    <b>Σχηματισμός</b> συστήματος (από το άπειρο, ακίνητα στην αρχή και στο τέλος): E<sub>απ</sub> = U. <b>Διάλυση</b> (μέχρι το άπειρο): E<sub>απ</sub> = −U.
  </>,
  <>
    <b>Γραφική U–r:</b> για ομόσημα η καμπύλη είναι θετική και πέφτει προς το 0, για ετερόσημα είναι αρνητική και ανεβαίνει προς το 0. Παράδειγμα: στο
    άτομο του υδρογόνου U = −k·e²/r.
  </>,
];

const unit7Methods: Method[] = [
  {
    n: 1,
    title: "Υπολογισμός δυναμικής ενέργειας συστήματος",
    when: "Σου δίνουν φορτία και αποστάσεις και ζητούν την U.",
    how: ["Γράφεις έναν όρο k·qᵢ·qⱼ/r για κάθε ζευγάρι, με τα πρόσημα.", "Μετατρέπεις μC → 10⁻⁶ C και cm → m και προσθέτεις αλγεβρικά."],
    examples: [
      {
        title: "Δύο φορτία",
        given: "Q₁ = +4 μC, Q₂ = −6 μC, r = 3 cm",
        steps: ["U = 9·10⁹ · (4·10⁻⁶)·(−6·10⁻⁶) / (3·10⁻²)"],
        result: "U = −7,2 J",
      },
      {
        title: "Τρία φορτία σε ισόπλευρο τρίγωνο",
        given: "q₁ = −4 μC, q₂ = +1 μC, q₃ = +4 μC, πλευρά α = 4 cm",
        steps: ["Ζεύγος q₁q₂: −0,9 J · ζεύγος q₁q₃: −3,6 J · ζεύγος q₂q₃: +0,9 J"],
        result: "U = −3,6 J",
      },
    ],
    exercises: "7.1, 7.2, 7.38–7.45",
  },
  {
    n: 2,
    title: "Κίνηση φορτίου κοντά σε ακλόνητο φορτίο",
    when: "Το ένα φορτίο είναι ακλόνητο και το άλλο κινείται. Η δύναμη Coulomb αλλάζει με την απόσταση, άρα δεν λύνεται με α = σταθ.",
    how: ["ΑΔΜΕ: K_αρχ + U_αρχ = K_τελ + U_τελ, ή ΘΜΚΕ.", "Στην ελάχιστη απόσταση (ή στο ψηλότερο σημείο) η ταχύτητα είναι μηδέν."],
    examples: [
      {
        title: "Ελάχιστη απόσταση",
        given: "Q = 5 μC ακλόνητο, q = 3 μC, m = 6 g, d = 5 cm, d_min = 1 cm",
        steps: ["½·m·v₀² + k·Q·q/d = 0 + k·Q·q/d_min", "v₀² = 2·k·Q·q·(1/d_min − 1/d) / m = 3600"],
        result: "v₀ = 60 m/s",
      },
    ],
    exercises: "7.3, 7.4, 7.46–7.48",
  },
  {
    n: 3,
    title: "Δύο σωματίδια ελεύθερα να κινηθούν",
    when: "Και τα δύο αφήνονται ελεύθερα. Ασκούνται μόνο εσωτερικές δυνάμεις, άρα το σύστημα είναι μονωμένο.",
    how: ["ΑΔΟ: 0 = −m₁·υ₁ + m₂·υ₂ (φεύγουν αντίθετα).", "ΑΔΜΕ: k·q₁·q₂/r = ½·m₁·υ₁² + ½·m₂·υ₂² (στο άπειρο U = 0)."],
    examples: [
      {
        title: "Ταχύτητες στο άπειρο",
        given: "m₁ = 3 g, m₂ = 1 g, q₁ = q₂ = 4 μC, r = 16 dm = 1,6 m",
        steps: ["ΑΔΟ: υ₂ = 3·υ₁", "k·q₁·q₂/r = 0,09 J = 6·10⁻³·υ₁²"],
        result: "υ₁ = √15 m/s ≈ 3,9 m/s και υ₂ = 3√15 m/s ≈ 11,6 m/s",
      },
    ],
    exercises: "7.5, 7.6, 7.49, 7.50, 7.59, 7.64",
  },
  {
    n: 4,
    title: "Ηλεκτρικό πεδίο μαζί με βαρυτικό",
    when: "Το σωματίδιο κινείται κατακόρυφα, οπότε το βάρος δεν αμελείται.",
    how: [
      "Πρώτα συγκρίνεις F (Coulomb) και B = m·g για να δεις προς τα πού θα κινηθεί.",
      "ΑΔΜΕ με δύο δυναμικές ενέργειες: m·g·h (μηδέν στο δάπεδο) και k·q·Q/r.",
    ],
    examples: [
      {
        title: "Μέγιστο ύψος",
        given: "Q = +2 μC στο δάπεδο, q = 0,5 μC, m = 9 g, r = 10 cm, g = 10 m/s²",
        steps: [
          "B = 0,09 N, F = 0,9 N ⇒ F > B, το σωματίδιο ανεβαίνει",
          "m·g·r + k·q·Q/r = m·g·h + k·q·Q/h ⇒ 10h² − 11h + 1 = 0",
          "Ρίζες h = 0,1 m (η αρχική θέση) και h = 1 m",
        ],
        result: "h_max = 1 m",
      },
    ],
    exercises: "7.7, 7.8, 7.51–7.54, 7.63",
  },
];

const unit8Theory: ReactNode[] = [
  <>
    <b>E = V / x</b>, όπου x η απόσταση <b>πάνω στη δυναμική γραμμή</b>. Αν η μετακίνηση είναι πλάγια, παίρνεις την προβολή της: W = q·E·(ΑΓ).
  </>,
  <>Κατά τη φορά των δυναμικών γραμμών το δυναμικό μειώνεται. Σημεία πάνω σε ευθεία κάθετη στις γραμμές έχουν το ίδιο δυναμικό.</>,
  <>
    Στο ομογενές πεδίο η δύναμη F = |q|·E είναι σταθερή, άρα <b>α = |q|·E / m = |q|·V / (d·m)</b> σταθερή. Το βάρος αμελείται, εκτός αν η άσκηση πει
    το αντίθετο. Ισορροπία: q·E = m·g.
  </>,
  <>
    <b>Από ηρεμία</b> (ή με v₀ παράλληλη στις γραμμές): ευθύγραμμη ομαλά επιταχυνόμενη. Μέχρι την απέναντι πλάκα: t₁ = √(2d/α) και υ₁ = √(2·α·d). Αν η
    δύναμη είναι αντίθετη στη v₀ (π.χ. αρνητικό φορτίο που μπαίνει με τη φορά της E), η κίνηση είναι επιβραδυνόμενη: υ = υ₀ − α·t.
  </>,
  <>
    <b>Με v₀ κάθετη στις γραμμές</b> (αρχή ανεξαρτησίας των κινήσεων): στον x ευθύγραμμη ομαλή (x = υ₀·t), στον y ομαλά επιταχυνόμενη (y = ½·α·t²).
    Χρόνος t₁ = L/υ₀, απόκλιση y₁ = ½·α·(L/υ₀)², ταχύτητα εξόδου υ₁ = √(υ₀² + υ₁y²), εφφ = υ₁y/υ₀ και τροχιά <b>y = V·|q|·x² / (2·d·m·υ₀²)</b>, παραβολή.
  </>,
  <>
    <b>Συνθήκη εξόδου:</b> το σωματίδιο βγαίνει από το πεδίο μόνο αν y₁ ≤ d (ή ≤ την απόσταση από την πλάκα προς την οποία πηγαίνει). Αλλιώς χτυπά την
    πλάκα. Εφαρμογές: καθοδικός σωλήνας, φωτοτυπικό, ηλεκτροστατικό φίλτρο.
  </>,
];

const unit8Methods: Method[] = [
  {
    n: 1,
    title: "Διαφορά δυναμικού σε ομογενές πεδίο",
    when: "Ζητούν V ανάμεσα σε δύο σημεία, που μπορεί να μην είναι στην ίδια δυναμική γραμμή.",
    how: ["Βρίσκεις την προβολή της απόστασης πάνω στη δυναμική γραμμή.", "V = E·x. Για σημεία πάνω σε κάθετη στις γραμμές, V = 0."],
    examples: [
      {
        title: "Πλάγια απόσταση",
        given: "E = 200 V/m, ΑΓ = 0,8 m, γωνία φ = 60° με τις δυναμικές γραμμές",
        steps: ["ΑΔ = ΑΓ·συν60° = 0,4 m", "V_ΑΔ = E·ΑΔ = 80 V · τα Γ, Δ στην ίδια κάθετη ⇒ V_ΑΓ = V_ΑΔ · τα Β, Α στην ίδια κάθετη ⇒ V_ΒΑ = 0"],
        result: "V_ΑΔ = 80 V, V_ΑΓ = 80 V, V_ΒΑ = 0",
      },
    ],
    exercises: "8.1, 8.57–8.59",
  },
  {
    n: 2,
    title: "Κίνηση παράλληλα στις δυναμικές γραμμές",
    when: "Το σωματίδιο ξεκινά από ηρεμία ή έχει v₀ παράλληλη στις γραμμές.",
    how: ["α = |q|·E/m.", "Ίδια φορά δύναμης και v₀: υ = υ₀ + α·t. Αντίθετη: υ = υ₀ − α·t (σταματά όταν t = υ₀/α)."],
    examples: [
      {
        title: "Από ηρεμία ως την αρνητική πλάκα",
        given: "d = 10 cm, q = +8 μC, m = 4·10⁻⁶ kg, E = 1000 V/m",
        steps: ["α = 2·10³ m/s²", "t₁ = √(2d/α) = 10⁻² s, υ₁ = α·t₁"],
        result: "t₁ = 0,01 s, υ₁ = 20 m/s",
      },
      {
        title: "Αρνητικό φορτίο που επιβραδύνεται",
        given: "q = −4 μC, m = 4·10⁻⁸ kg, E = 2000 V/m, υ₀ = 20 m/s με τη φορά της E",
        steps: ["α = 2·10⁵ m/s², η δύναμη είναι αντίθετη στην κίνηση", "0 = υ₀ − α·t₁"],
        result: "t₁ = 10⁻⁴ s (εκείνη τη στιγμή σταματά στιγμιαία)",
      },
    ],
    exercises: "8.2–8.5, 8.60–8.75",
  },
  {
    n: 3,
    title: "Είσοδος με v₀ κάθετη στις δυναμικές γραμμές",
    when: "Το σωματίδιο μπαίνει ανάμεσα στις πλάκες παράλληλα σε αυτές.",
    how: [
      "Σχεδιάζεις τη δύναμη και άξονες: x κατά μήκος των πλακών, y κατά μήκος των γραμμών.",
      "Βρίσκεις α, μετά t₁ = L/υ₀ και y₁. Ελέγχεις y₁ ≤ d πριν συνεχίσεις.",
    ],
    examples: [
      {
        title: "Χρόνος και απόκλιση",
        given: "m = 4·10⁻⁸ kg, q = 2 μC, υ₀ = 250 m/s, L = 1 m, V = 400 V, d = 0,2 m",
        steps: ["α = q·V/(m·d) = 10⁵ m/s²", "t₁ = L/υ₀ = 4·10⁻³ s, y₁ = ½·α·t₁²"],
        result: "Το βιβλίο δίνει t₁ = 4·10⁻³ s και y₁ = 0,8 m",
        warn: (
          <>
            <b>Προσοχή, τα δεδομένα δεν στέκουν:</b> y₁ = 0,8 m βγαίνει μεγαλύτερο από d = 0,2 m, άρα το σωματίδιο δεν μπορεί να βγει. Χτυπά την αρνητική
            πλάκα όταν ½·α·t² = 0,2 m, δηλαδή σε t = 2·10⁻³ s, στο x = 0,5 m. Οι πράξεις του βιβλίου είναι σωστές, το λάθος είναι στα δεδομένα. Γι' αυτό
            ελέγχεις πάντα y₁ ≤ d.
          </>
        ),
      },
      {
        title: "Ταχύτητα εξόδου, γωνία και τροχιά",
        given: "m = 4·10⁻⁷ kg, q = 4 μC, υ₀ = 100 m/s, L = 0,1 m, E = 10⁴ V/m",
        steps: ["α = 10⁵ m/s², t₁ = 10⁻³ s", "υ₁x = 100 m/s, υ₁y = α·t₁ = 100 m/s ⇒ εφφ = 1", "y = ½·α·(x/υ₀)²"],
        result: "υ₁ = 100√2 m/s, φ = 45°, τροχιά y = 5x² (SI) για 0 ≤ x ≤ 0,1 m",
      },
    ],
    exercises: "8.6, 8.7, 8.76–8.84",
  },
];

function Methods({ unit, items }: { unit: number; items: Method[] }) {
  return (
    <ol className="mt-6 divide-y divide-black/10 border-t border-black/10">
      {items.map((m) => (
        <li key={m.n} className="py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Μεθοδολογία {m.n}</p>
          <h4 className="mt-1 text-xl font-semibold tracking-tight">{m.title}</h4>
          <p className="mt-2 text-[15px] leading-7 text-[#5c534c]">{m.when}</p>
          <ul className="mt-2 space-y-1 text-[15px] leading-7 text-[#3d4452]">
            {m.how.map((h) => (
              <li key={h}>→ {h}</li>
            ))}
          </ul>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {m.examples.map((ex) => (
              <div key={ex.title}>
                <p className="font-semibold">Εφαρμογή: {ex.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#5c534c]">Δεδομένα: {ex.given}</p>
                <ul className="mt-1 space-y-0.5 font-mono text-sm leading-6 text-[#3d4452]">
                  {ex.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="mt-1 text-[15px] font-semibold text-[#1f6fd1]">{ex.result}</p>
                {ex.warn ? <p className="mt-2 border-l-4 border-[#e08a1e] pl-3 text-sm leading-6 text-[#7a4a0f]">⚠️ {ex.warn}</p> : null}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#857261]">
            Λυμένες ασκήσεις στο βοήθημα (Ενότητα {unit}): {m.exercises}
          </p>
        </li>
      ))}
    </ol>
  );
}

function Unit({ id, unit, pages, title, theory, methods }: { id: string; unit: number; pages: string; title: string; theory: ReactNode[]; methods: Method[] }) {
  return (
    <div id={id} data-study-lesson="pedio" data-study-id={id} className="scroll-mt-20 pt-8 first:pt-4">
      <p className="text-xs font-semibold text-[#857261]">
        Ενότητα {unit} · σελ. {pages}
      </p>
      <h3 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#4d4138]">Θεωρία</p>
      <ul className="mt-2 space-y-2 text-[15px] leading-7 text-[#3d4452]">
        {theory.map((t, i) => (
          <li key={i}>• {t}</li>
        ))}
      </ul>
      <Methods unit={unit} items={methods} />
      <StudyMark lesson="pedio" id={id} title={`Καρατζίκος · ${title}`} path="/mixalis/pedio" />
    </div>
  );
}

export function PedioKaratzikos() {
  return (
    <section id="karatzikos" className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Βοήθημα Καρατζίκου</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Θεωρία και μεθοδολογίες</h2>
      <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
        Οι μεθοδολογίες του βοηθήματος με τις λυμένες εφαρμογές του. Όλες οι πράξεις ελέγχθηκαν μία μία. Όπου τα δεδομένα του βιβλίου δεν στέκουν, υπάρχει
        σημείωση.
      </p>
      <div className="divide-y divide-black/10">
        <Unit
          id="karatzikos-7"
          unit={7}
          pages="425–432"
          title="Δυναμική ενέργεια συστήματος σημειακών φορτίων"
          theory={unit7Theory}
          methods={unit7Methods}
        />
        <Unit
          id="karatzikos-8"
          unit={8}
          pages="467–480"
          title="Κινήσεις φορτισμένων σωματιδίων σε ομογενές πεδίο"
          theory={unit8Theory}
          methods={unit8Methods}
        />
      </div>
    </section>
  );
}
