"use client";

import type { ReactNode } from "react";
import { AnimCard, rich } from "./AnimCard";
import { KINDS, karatzikos7, karatzikos8 } from "./scenes-karatzikos";
import { karatzikosEx } from "./scenes-karatzikos-2";
import { karatzikos7Ex } from "./scenes-karatzikos-3";

/**
 * Karatzikos study guide (owner, 2026-11-23): Unit 7 pp. 425–432 and Unit 8 pp. 467–480.
 * A map "which kind of exercise is it?" and one animated card per worked example.
 * Layout: full width, no nested boxes (owner's preference for /mixalis study pages).
 */

const COLOR_7 = "#6b3fa0";
const COLOR_8 = "#b8322b";
const COLOR_EX = "#0f7d8c";
const COLOR_7EX = "#a0457a";

type Kind = { label: string; color: string; when: ReactNode; tool: ReactNode; cards: string[]; exercises: string };

const MAP: Kind[] = [
  {
    label: KINDS.uCalc,
    color: COLOR_7,
    when: "Δίνονται φορτία και αποστάσεις, ζητούν U ή ενέργεια για σχηματισμό ή διάλυση. Τίποτα δεν κινείται.",
    tool: (
      <>
        Ένας όρος k·qᵢ·qⱼ/r για κάθε ζευγάρι, με πρόσημα. Σχηματισμός E<sub>απ</sub> = U, διάλυση E<sub>απ</sub> = −U.
      </>
    ),
    cards: ["Κ1", "Κ2"],
    exercises: "7.1, 7.2, 7.38–7.45",
  },
  {
    label: KINDS.coulombK,
    color: COLOR_7,
    when: "Ένα φορτίο ακλόνητο, το άλλο κινείται (εκτοξεύεται ή αφήνεται). Ζητούν ταχύτητα ή ελάχιστη απόσταση.",
    tool: "ΑΔΜΕ: K_αρχ + U_αρχ = K_τελ + U_τελ. Όχι τύποι κινηματικής: η δύναμη αλλάζει με το r.",
    cards: ["Κ3"],
    exercises: "7.3, 7.4, 7.46–7.48",
  },
  {
    label: KINDS.coulombP,
    color: COLOR_7,
    when: "Και τα δύο σωματίδια είναι ελεύθερα να κινηθούν. Ζητούν δύο ταχύτητες.",
    tool: "ΑΔΟ (0 = −m₁υ₁ + m₂υ₂) μαζί με ΑΔΜΕ. Δύο άγνωστοι, δύο εξισώσεις.",
    cards: ["Κ4"],
    exercises: "7.5, 7.6, 7.49, 7.50, 7.59, 7.64",
  },
  {
    label: KINDS.coulombG,
    color: COLOR_7,
    when: "Κατακόρυφη κίνηση με φορτία: η εκφώνηση δίνει g και δεν λέει «βάρος αμελητέο».",
    tool: "Πρώτα F και B για τη φορά. Μετά ΑΔΜΕ με δύο δυναμικές: mgh και kqQ/r. Από τις δύο ρίζες, η μία είναι η αρχική θέση.",
    cards: ["Κ5"],
    exercises: "7.7, 7.8, 7.51–7.54, 7.63",
  },
  {
    label: KINDS.uniformV,
    color: COLOR_8,
    when: "Πλάκες ή ομογενές πεδίο, ζητούν V ανάμεσα σε σημεία (ίσως πλάγια).",
    tool: "V = E·x, με x την προβολή πάνω στη δυναμική γραμμή. Κάθετα στις γραμμές: ίδιο δυναμικό.",
    cards: ["Κ6"],
    exercises: "8.1, 8.57–8.59",
  },
  {
    label: KINDS.uniformLine,
    color: COLOR_8,
    when: "Ομογενές πεδίο, το σωματίδιο ξεκινά από ηρεμία ή κινείται παράλληλα στις γραμμές.",
    tool: "α = |q|E/m σταθερή ⇒ τύποι ευθύγραμμης ομαλά μεταβαλλόμενης. Η φορά της F από το πρόσημο του q.",
    cards: ["Κ7", "Κ8"],
    exercises: "8.2–8.5, 8.60–8.75",
  },
  {
    label: KINDS.uniformBolt,
    color: COLOR_8,
    when: "Μπαίνει ανάμεσα στις πλάκες παράλληλα σε αυτές (κάθετα στις γραμμές).",
    tool: "x: ευθύγραμμη ομαλή, y: ομαλά επιταχυνόμενη. t₁ = L/υ₀, y₁ = ½αt₁², εφφ = υ₁y/υ₀. Έλεγχος y₁ ≤ d!",
    cards: ["Κ9", "Κ10"],
    exercises: "8.6, 8.7, 8.76, 8.79, 8.82",
  },
  {
    label: KINDS.eqG,
    color: COLOR_EX,
    when: "Σωματίδιο ισορροπεί ανάμεσα σε οριζόντιες πλάκες· μετά αλλάζει η τάση.",
    tool: "|q|E = mg. Νέα τάση ⇒ νέα F ⇒ ΣF = F′ − mg ⇒ α σταθερή.",
    cards: ["Κ11"],
    exercises: "8.64, 8.74",
  },
  {
    label: KINDS.vertG,
    color: COLOR_EX,
    when: "Κατακόρυφη κίνηση ανάμεσα σε οριζόντιες πλάκες και η άσκηση δίνει g.",
    tool: "ΣF από F και B με τις φορές τους ⇒ α σταθερή ⇒ κινηματική. Ή ΘΜΚΕ: ΔK = W_F + W_B.",
    cards: ["Κ12"],
    exercises: "8.65, 8.67, 8.73",
  },
  {
    label: KINDS.backForth,
    color: COLOR_EX,
    when: "Το σωματίδιο φρενάρει, σταματά στιγμιαία και γυρίζει πίσω.",
    tool: "Στάση: υ = 0, t = υ₀/α. Επιστρέφει με το ίδιο μέτρο ταχύτητας (W κλειστής διαδρομής = 0). V από ΘΜΚΕ.",
    cards: ["Κ13"],
    exercises: "8.63, 8.69, 8.71, 8.72, 8.75",
  },
  {
    label: KINDS.hole,
    color: COLOR_EX,
    when: "Πλάκα με οπή: ζητούν ταχύτητα εξόδου ή ελάχιστη ταχύτητα για να φτάσει ως εκεί.",
    tool: "ΘΜΚΕ: ½mυ² = |q|·V. «Οριακά» σημαίνει φτάνει με υ = 0.",
    cards: ["Κ14"],
    exercises: "8.61, 8.66",
  },
  {
    label: KINDS.twoFields,
    color: COLOR_EX,
    when: "Βγαίνει από ένα πεδίο και μπαίνει αμέσως σε δεύτερο.",
    tool: "Η ταχύτητα εξόδου του πρώτου είναι η αρχική του δεύτερου. Μέση ταχύτητα υ/2 για τους χρόνους. W₁ + W₂ = ΔK.",
    cards: ["Κ15"],
    exercises: "8.68, 8.70",
  },
  {
    label: KINDS.boltOffset,
    color: COLOR_EX,
    when: "Μπαίνει κάθετα αλλά σε απόσταση d₁ από την πλάκα προς την οποία στρίβει, ή ζητούν όριο τάσης για να βγει.",
    tool: "Βγαίνει αν y₁ ≤ d₁. Οριακά y₁ = d₁ ⇒ V_max (ή υ_min).",
    cards: ["Κ16"],
    exercises: "8.77, 8.84",
  },
  {
    label: KINDS.boltScreen,
    color: COLOR_EX,
    when: "Πρώτα επιτάχυνση με τάση, μετά πλάκες, μετά οθόνη.",
    tool: "½mυ₀² = qV. Μετά «βολή». Έξω από τις πλάκες ευθεία: OK = y₁ + D·εφφ.",
    cards: ["Κ17"],
    exercises: "8.80",
  },
  {
    label: KINDS.boltG,
    color: COLOR_EX,
    when: "Κάθετη είσοδος σε οριζόντιες πλάκες και η άσκηση δίνει g.",
    tool: "α = ΣF/m από F και B. «Ξυστά»: απόκλιση = απόσταση από την πλάκα. qE = mg ⇒ ευθεία.",
    cards: ["Κ18"],
    exercises: "8.81",
  },
  {
    label: KINDS.boltAngle,
    color: COLOR_EX,
    when: "Ζητούν γωνία ή τάση από κινητικές ενέργειες, ή απάντηση μόνο με γράμματα.",
    tool: "ΔK = |q|·V εισόδου–εξόδου. συνφ = υ₀/υ₁ = √(K₁/K₂).",
    cards: ["Κ19"],
    exercises: "8.78, 8.83",
  },
  {
    label: KINDS.mixed,
    color: COLOR_EX,
    when: "Μετά τις πλάκες συναντά σημειακό φορτίο.",
    tool: "Πλάκες: κινηματική ή ΘΜΚΕ. Κοντά στο Q: μόνο ΑΔΜΕ με U = kqQ/r.",
    cards: ["Κ20"],
    exercises: "8.85",
  },
  {
    label: KINDS.collision,
    color: COLOR_EX,
    when: "Η άσκηση συνεχίζει με κρούση ή βολή και τα δεδομένα είναι στο τέλος.",
    tool: "Λύνεις ανάποδα: βολή ⇒ υ_κ, ΑΔΟ ⇒ υ, ανάλυση ⇒ υ₀, t = L/υ₀.",
    cards: ["Κ21"],
    exercises: "8.86",
  },
  {
    label: KINDS.cDist,
    color: COLOR_7EX,
    when: "Ακλόνητα φορτία αλλάζουν απόσταση· ζητούν ενέργεια ή νέα απόσταση.",
    tool: "E_δαπ = U_τελ − U_αρχ. Προσοχή στις μονάδες: nC, μC, mC.",
    cards: ["Κ22"],
    exercises: "7.38, 7.39, 7.40",
  },
  {
    label: KINDS.cInverse,
    color: COLOR_7EX,
    when: "Δίνεται η U ή η ενέργεια διάλυσης· ζητούν ένα φορτίο.",
    tool: "E_διάλ = −U. Γράφεις όλους τους όρους, ο άγνωστος βγαίνει κοινός παράγοντας.",
    cards: ["Κ23"],
    exercises: "7.39, 7.43, 7.58",
  },
  {
    label: KINDS.cShape,
    color: COLOR_7EX,
    when: "Φορτία σε τρίγωνο ή σε σημεία αξόνων.",
    tool: "Βρίσκεις όλες τις αποστάσεις (Πυθαγόρειο), έναν όρο για κάθε ζευγάρι.",
    cards: ["Κ24"],
    exercises: "7.44, 7.45, 7.56",
  },
  {
    label: KINDS.cWork,
    color: COLOR_7EX,
    when: "Μετακινούμε φορτίο και στο τέλος έχει ταχύτητα, ή το παίρνουμε στο άπειρο.",
    tool: "W_εξ = ΔU + ΔK. Έργο του πεδίου: W_F = U_αρχ − U_τελ.",
    cards: ["Κ25"],
    exercises: "7.56",
  },
  {
    label: KINDS.cOrbit,
    color: COLOR_7EX,
    when: "Φορτίο κάνει κυκλική κίνηση γύρω από άλλο (ή δύο γύρω από το μέσο τους).",
    tool: "F_Coulomb = mυ²/r. E = K + U = U/2 < 0.",
    cards: ["Κ26"],
    exercises: "7.41, 7.57",
  },
  {
    label: KINDS.cRails,
    color: COLOR_7EX,
    when: "Σώματα σε κυκλική ράγα· ζητούν δύναμη ράγας ή ταχύτητα αν αφεθούν.",
    tool: "N = mυ²/r + F_C (η άπωση σπρώχνει έξω). Στο άπειρο η U μοιράζεται.",
    cards: ["Κ27"],
    exercises: "7.62",
  },
  {
    label: KINDS.cEscape,
    color: COLOR_7EX,
    when: "Ρωτούν αν φτάνει στο άπειρο, πού σταματά ή ποια ταχύτητα χρειάζεται.",
    tool: "E = K + U: E < 0 σταματά, E = 0 οριακά, E > 0 φεύγει.",
    cards: ["Κ28"],
    exercises: "7.48, 7.60",
  },
  {
    label: KINDS.cTogether,
    color: COLOR_7EX,
    when: "Και τα δύο σωματίδια ελεύθερα· ζητούν ελάχιστη ή μέγιστη απόσταση.",
    tool: "Τη στιγμή εκείνη κοινή ταχύτητα: ΑΔΟ για την υ, ΑΔΜΕ για την απόσταση.",
    cards: ["Κ29"],
    exercises: "7.50, 7.59, 7.60",
  },
  {
    label: KINDS.cGmax,
    color: COLOR_7EX,
    when: "Κατακόρυφα πάνω από φορτίο με βάρος· ζητούν μέγιστη ταχύτητα ή πού σταματά.",
    tool: "υ_max εκεί όπου F = B. ΑΔΜΕ με mgh και kQq/r· η μία ρίζα είναι η αρχή.",
    cards: ["Κ30"],
    exercises: "7.51, 7.52, 7.53, 7.63",
  },
  {
    label: KINDS.cIncline,
    color: COLOR_7EX,
    when: "Φορτίο στη βάση κεκλιμένου επιπέδου.",
    tool: "Σύγκριση F με mg·ημφ. Ύψος = s·ημφ στην ΑΔΜΕ.",
    cards: ["Κ31"],
    exercises: "7.54",
  },
  {
    label: KINDS.cSymmetry,
    color: COLOR_7EX,
    when: "Δύο ίσα ακλόνητα φορτία και ένα που κινείται ανάμεσα.",
    tool: "Οι κάθετες συνιστώσες αναιρούνται ⇒ κίνηση στη μεσοκάθετο. Ενέργεια με δύο όρους.",
    cards: ["Κ32"],
    exercises: "7.55",
  },
  {
    label: KINDS.cThree,
    color: COLOR_7EX,
    when: "Τρία φορτία, κάποια κρατιούνται και κάποια αφήνονται.",
    tool: "Ο ελεύθερος παίρνει μόνο τους όρους που τον αφορούν. Συμμετρία ⇒ ίσες ταχύτητες.",
    cards: ["Κ33"],
    exercises: "7.58, 7.61",
  },
  {
    label: KINDS.cShare,
    color: COLOR_7EX,
    when: "Δύο σωματίδια αφήνονται μαζί από ηρεμία.",
    tool: "Ίσες ορμές: υ₂/υ₁ = m₁/m₂, K₂/K₁ = m₁/m₂. dp/dt = F.",
    cards: ["Κ34"],
    exercises: "7.47, 7.49, 7.64",
  },
  {
    label: KINDS.cCollision,
    color: COLOR_7EX,
    when: "Μετά την απώθηση ακολουθεί κρούση ή τριβή.",
    tool: "Κάθε κομμάτι με το εργαλείο του: ΑΔΜΕ, ΑΔΟ, ΘΜΚΕ.",
    cards: ["Κ35"],
    exercises: "7.65",
  },
];

const ANCHOR: Record<string, string> = Object.fromEntries([...karatzikos7, ...karatzikos8, ...karatzikosEx, ...karatzikos7Ex].map((c) => [c.badge ?? String(c.n), `#k${c.n}`]));

function KindMap() {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold tracking-tight">Τι άσκηση είναι;</h3>
      <p className="mt-1 max-w-3xl text-[15px] leading-7 text-[#3d4452]">
        Πρώτη ερώτηση: <b>σημειακά φορτία (Coulomb)</b> ή <b>πλάκες (ομογενές πεδίο)</b>; Στο Coulomb η δύναμη αλλάζει με την απόσταση, άρα λύνεις{" "}
        <b>μόνο με ενέργεια</b> (και ορμή, αν κινούνται και τα δύο). Στο ομογενές η δύναμη είναι σταθερή, άρα δουλεύουν οι <b>τύποι κινηματικής</b>.
      </p>
      <ol className="mt-4 divide-y divide-black/10 border-y border-black/10">
        {MAP.map((k) => (
          <li key={k.label} className="grid gap-2 py-4 md:grid-cols-[minmax(0,15rem)_1fr]">
            <p className="text-[15px] font-bold leading-6" style={{ color: k.color }}>
              {k.label}
            </p>
            <div className="text-[15px] leading-7 text-[#3d4452]">
              <p>
                <span className="font-semibold text-[#1c2433]">Πότε: </span>
                {rich(k.when)}
              </p>
              <p>
                <span className="font-semibold text-[#1c2433]">Τι γράφεις: </span>
                {rich(k.tool)}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                {k.cards.map((c) => (
                  <a key={c} href={ANCHOR[c]} className="rounded-full px-3 py-0.5 font-bold text-white" style={{ backgroundColor: k.color }}>
                    {c} ↓
                  </a>
                ))}
                <span className="text-xs text-[#857261]">Λυμένες στο βοήθημα: {k.exercises}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Unit({ unit, pages, title, color, intro, cards }: { unit: number; pages: string; title: string; color: string; intro: ReactNode; cards: typeof karatzikos7 }) {
  return (
    <div className="mt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color }}>
        Ενότητα {unit} · σελ. {pages}
      </p>
      <h3 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h3>
      <div className="mt-2 max-w-3xl text-[15px] leading-7 text-[#3d4452]">{intro}</div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {cards.map((c) => (
          <AnimCard key={c.n} data={c} accent={color} study={{ lesson: "pedio", path: "/mixalis/pedio" }} />
        ))}
      </div>
    </div>
  );
}

export function PedioKaratzikos() {
  return (
    <section id="karatzikos" className="scroll-mt-20 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9822f]">Βοήθημα Καρατζίκου</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Μεθοδολογίες με κίνηση</h2>
      <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5c534c]">
        Κάθε λυμένη εφαρμογή και κάθε νέα περίπτωση των λυμένων ασκήσεων του βοηθήματος ως κινούμενο σχέδιο (Κ1–Κ35). Πάνω από τον τίτλο κάθε κάρτας γράφει τι τύπος άσκησης είναι. Όλες οι πράξεις
        ελέγχθηκαν ξανά. Όπου το βιβλίο έχει λάθος ή ασάφεια (Κ9, 8.71 στην Κ13, Κ21, Κ25) υπάρχει σημείωση.
      </p>

      <KindMap />

      <Unit
        unit={7}
        pages="425–432"
        title="Δυναμική ενέργεια συστήματος σημειακών φορτίων"
        color={COLOR_7}
        intro={
          <>
            U = k·q₁·q₂/r με πρόσημα: ομόσημα ⇒ U &gt; 0, ετερόσημα ⇒ U &lt; 0, στο άπειρο U = 0. Η U ανήκει στο σύστημα. Γραφική U–r: για ομόσημα θετική
            καμπύλη που πέφτει προς το 0, για ετερόσημα αρνητική που ανεβαίνει προς το 0.
          </>
        }
        cards={karatzikos7}
      />

      <Unit
        unit={8}
        pages="467–480"
        title="Κινήσεις φορτισμένων σωματιδίων σε ομογενές πεδίο"
        color={COLOR_8}
        intro={
          <>
            E = V/x με x πάνω στη δυναμική γραμμή. F = |q|E σταθερή ⇒ α = |q|E/m = |q|V/(d·m) σταθερή. Το βάρος αμελείται, εκτός αν η άσκηση πει το αντίθετο.
          </>
        }
        cards={karatzikos8}
      />

      <Unit
        unit={8}
        pages="506–518"
        title="Λυμένες ασκήσεις (8.60–8.86): οι υπόλοιπες περιπτώσεις"
        color={COLOR_EX}
        intro={
          <>
            Από τις ασκήσεις Τράπεζας Θεμάτων του βοηθήματος, μία κάρτα για κάθε περίπτωση που δεν καλύπτουν τα Κ1–Κ10: βάρος μέσα στις πλάκες, πήγαινε–έλα,
            οπή, δύο πεδία, όριο τάσης, οθόνη, γωνία από ενέργειες, Coulomb μετά τις πλάκες και κρούση. Κάτω από κάθε λύση υπάρχουν και συγγενικές ασκήσεις.
          </>
        }
        cards={karatzikosEx}
      />

      <Unit
        unit={7}
        pages="452–460"
        title="Λυμένες ασκήσεις (7.38–7.65): δυναμική ενέργεια, οι υπόλοιπες περιπτώσεις"
        color={COLOR_7EX}
        intro={
          <>
            Από τις ασκήσεις της Ενότητας 7, μία κάρτα για κάθε περίπτωση που δεν καλύπτουν τα Κ1–Κ5: αλλαγή απόστασης, άγνωστο φορτίο, σχήματα, κυκλική
            τροχιά, διαφυγή, δύο ελεύθερα σωματίδια, βάρος, κεκλιμένο, συμμετρία, τρία φορτία και κρούση. Κάτω από κάθε λύση υπάρχουν και συγγενικές ασκήσεις.
          </>
        }
        cards={karatzikos7Ex}
      />
    </section>
  );
}
