"use client";

import type { ReactNode } from "react";
import { Arrow } from "../omali/shared";
import { AngleArc, C, Dot, Sb, Txt, V, VL } from "./figures";

type Idea = {
  title: string;
  figure: ReactNode;
  text: ReactNode;
  eg: ReactNode;
};

const ideas: Idea[] = [
  {
    title: "Διάνυσμα ≠ βέλος",
    figure: (
      <>
        <Arrow x1={30} y1={95} x2={170} y2={40} color={C.teal} width={4} head={13} />
        <VL x={90} y={52} color={C.teal}>A</VL>
        <Txt x={100} y={118}>π.χ. μετατόπιση 5 m προς ΒΑ</Txt>
      </>
    ),
    text: (
      <>
        Το βέλος είναι η <b>εικόνα</b>. Το διάνυσμα είναι το <b>φυσικό μέγεθος</b>: έχει μέτρο, διεύθυνση και φορά.
      </>
    ),
    eg: "Η δύναμη, η ταχύτητα και η μετατόπιση είναι διανύσματα. Η μάζα και ο χρόνος όχι (μονόμετρα).",
  },
  {
    title: "Ίσα διανύσματα",
    figure: (
      <>
        <Arrow x1={20} y1={100} x2={85} y2={40} color={C.orange} width={4} head={12} />
        <Arrow x1={110} y1={100} x2={175} y2={40} color={C.orange} width={4} head={12} />
        <VL x={40} y={58} color={C.orange}>A</VL>
        <VL x={160} y={95} color={C.orange}>B</VL>
        <Txt x={100} y={120}>A = B</Txt>
      </>
    ),
    text: (
      <>
        Ίδιο <b>μέτρο</b>, ίδια <b>διεύθυνση</b>, ίδια <b>φορά</b>. Δεν έχει σημασία <i>πού</i> τα σχεδιάζεις.
      </>
    ),
    eg: "Δύο αυτοκίνητα σε παράλληλες λωρίδες, και τα δύο με 50 km/h προς βορρά, έχουν ίσες ταχύτητες.",
  },
  {
    title: "Αντίθετα διανύσματα",
    figure: (
      <>
        <Arrow x1={30} y1={45} x2={170} y2={45} color={C.teal} width={4} head={13} />
        <Arrow x1={170} y1={90} x2={30} y2={90} color={C.orange} width={4} head={13} />
        <VL x={100} y={33} color={C.teal}>A</VL>
        <VL x={100} y={115} color={C.orange} arrowDx={5}>−A</VL>
      </>
    ),
    text: (
      <>
        Ίδιο μέτρο, ίδια διεύθυνση, <b>αντίθετη φορά</b>. Γράφεται <V>−A</V>.
      </>
    ),
    eg: "Δύναμη και αντίδραση (3ος νόμος του Νεύτωνα): ίσα μέτρα, αντίθετες φορές.",
  },
  {
    title: "Παράλληλα ή αντιπαράλληλα",
    figure: (
      <>
        <line x1={100} y1={15} x2={100} y2={105} stroke={C.grid} strokeWidth={2} strokeDasharray="4 4" />
        <Arrow x1={15} y1={40} x2={85} y2={40} color={C.teal} width={3.5} />
        <Arrow x1={15} y1={75} x2={85} y2={75} color={C.teal} width={3.5} />
        <Arrow x1={115} y1={40} x2={185} y2={40} color={C.orange} width={3.5} />
        <Arrow x1={185} y1={75} x2={115} y2={75} color={C.orange} width={3.5} />
        <Txt x={50} y={110} color={C.teal}>θ = 0°</Txt>
        <Txt x={150} y={110} color={C.orange}>θ = 180°</Txt>
      </>
    ),
    text: (
      <>
        <b>Παράλληλα</b> (ίδια φορά): τα μέτρα <b>προστίθενται</b>. <b>Αντιπαράλληλα</b> (αντίθετη φορά): τα μέτρα <b>αφαιρούνται</b>.
      </>
    ),
    eg: "Δύο παιδιά σπρώχνουν μαζί ένα τραπέζι: 30 N + 20 N = 50 N. Αν σπρώχνουν αντίθετα: 30 − 20 = 10 N.",
  },
  {
    title: "Συνιστώσες",
    figure: (
      <>
        <line x1={40} y1={30} x2={160} y2={30} stroke={C.muted} strokeWidth={1} strokeDasharray="3 3" />
        <line x1={160} y1={30} x2={160} y2={100} stroke={C.muted} strokeWidth={1} strokeDasharray="3 3" />
        <Arrow x1={40} y1={100} x2={160} y2={100} color={C.teal} width={3.5} />
        <Arrow x1={40} y1={100} x2={40} y2={30} color={C.green} width={3.5} />
        <Arrow x1={40} y1={100} x2={160} y2={30} color={C.orange} width={4} head={12} />
        <AngleArc cx={40} cy={100} r={26} a1={30.3} label="θ" />
        <VL x={100} y={55} color={C.orange}>A</VL>
        <Txt x={100} y={118} color={C.teal} italic>A<Sb>x</Sb></Txt>
        <Txt x={24} y={70} color={C.green} italic>A<Sb>y</Sb></Txt>
      </>
    ),
    text: (
      <>
        Κάθε διάνυσμα «σπάει» σε ένα κομμάτι στον άξονα x και ένα στον y. Μαζί ξαναφτιάχνουν το <V>A</V>.
      </>
    ),
    eg: "Αυτή είναι η πιο χρήσιμη ιδέα: δες παρακάτω πώς τις βρίσκεις με ημ και συν.",
  },
  {
    title: "Συνισταμένη",
    figure: (
      <>
        <Arrow x1={30} y1={100} x2={90} y2={40} color={C.teal} width={4} head={12} />
        <Arrow x1={90} y1={40} x2={172} y2={55} color={C.orange} width={4} head={12} />
        <Arrow x1={30} y1={100} x2={172} y2={55} color={C.green} width={3.5} dashed head={12} />
        <VL x={50} y={60} color={C.teal}>A</VL>
        <VL x={135} y={38} color={C.orange}>B</VL>
        <VL x={115} y={100} color={C.green}>R</VL>
      </>
    ),
    text: (
      <>
        <V>R</V> = <V>A</V> + <V>B</V>. Βάζεις την ουρά του <V>B</V> στη μύτη του <V>A</V>. Το <V>R</V> πάει από την αρχή ως το τέλος.
      </>
    ),
    eg: "Περπατάς 3 m ανατολικά και μετά 4 m βόρεια: η συνολική μετατόπιση είναι 5 m (όχι 7 m).",
  },
  {
    title: "Αφαίρεση",
    figure: (
      <>
        <Arrow x1={20} y1={95} x2={120} y2={95} color={C.teal} width={4} head={12} />
        <Arrow x1={120} y1={95} x2={85} y2={30} color={C.orange} width={4} head={12} />
        <Arrow x1={20} y1={95} x2={85} y2={30} color={C.green} width={3.5} dashed head={12} />
        <Arrow x1={175} y1={30} x2={155} y2={67} color={C.orange} width={2} opacity={0.45} />
        <VL x={70} y={115} color={C.teal}>A</VL>
        <VL x={120} y={58} color={C.orange} arrowDx={5}>−B</VL>
        <VL x={182} y={60} color={C.orange} size={13}>B</VL>
      </>
    ),
    text: (
      <>
        <V>A</V> − <V>B</V> = <V>A</V> + (<V>−B</V>). Για να αφαιρέσεις, <b>προσθέτεις το αντίθετο</b>.
      </>
    ),
    eg: "Η μεταβολή ταχύτητας Δυ = υτελ − υαρχ βγαίνει ακριβώς έτσι.",
  },
  {
    title: "Μηδενική συνισταμένη",
    figure: (
      <>
        <Arrow x1={30} y1={100} x2={95} y2={22} color={C.teal} width={4} head={12} />
        <Arrow x1={95} y1={22} x2={170} y2={100} color={C.orange} width={4} head={12} />
        <Arrow x1={170} y1={100} x2={30} y2={100} color={C.green} width={4} head={12} />
        <VL x={48} y={55} color={C.teal}>A</VL>
        <VL x={152} y={55} color={C.orange}>B</VL>
        <VL x={100} y={121} color={C.green}>C</VL>
      </>
    ),
    text: (
      <>
        Αν τα βέλη, ένα μετά το άλλο, κλείνουν σχήμα, γύρισες εκεί που ξεκίνησες: <V>A</V> + <V>B</V> + <V>C</V> = 0.
      </>
    ),
    eg: "Ένα φωτιστικό που κρέμεται ακίνητο: βάρος και τάσεις των σχοινιών κλείνουν τρίγωνο ⇒ ισορροπία.",
  },
  {
    title: "Θέση και μετατόπιση",
    figure: (
      <>
        <Arrow x1={25} y1={108} x2={190} y2={108} color={C.grid} width={1.5} head={7} />
        <Arrow x1={25} y1={108} x2={25} y2={10} color={C.grid} width={1.5} head={7} />
        <Arrow x1={25} y1={108} x2={80} y2={40} color={C.orange} width={3.5} />
        <Arrow x1={25} y1={108} x2={170} y2={35} color={C.teal} width={3.5} />
        <Arrow x1={80} y1={40} x2={170} y2={35} color={C.green} width={3.5} />
        <Dot x={80} y={40} />
        <Dot x={170} y={35} />
        <Txt x={14} y={120} color={C.ink} italic>O</Txt>
        <Txt x={78} y={30} color={C.ink} italic>Π</Txt>
        <Txt x={180} y={30} color={C.ink} italic>Κ</Txt>
        <Txt x={125} y={30} color={C.green}>Δr</Txt>
      </>
    ),
    text: (
      <>
        Η <b>θέση</b> μετριέται από την αρχή O. Η <b>μετατόπιση</b> Π→Κ εξαρτάται μόνο από την αρχή και το τέλος, όχι από τη διαδρομή.
      </>
    ),
    eg: "Κάνεις τον γύρο του γηπέδου και γυρνάς στην αφετηρία: διανύθηκαν 400 m, μετατόπιση 0.",
  },
  {
    title: "Εσωτερικό γινόμενο",
    figure: (
      <>
        <Arrow x1={30} y1={90} x2={180} y2={90} color={C.teal} width={4} head={12} />
        <Arrow x1={30} y1={90} x2={130} y2={30} color={C.orange} width={4} head={12} />
        <line x1={130} y1={30} x2={130} y2={90} stroke={C.muted} strokeWidth={1.2} strokeDasharray="3 3" />
        <AngleArc cx={30} cy={90} r={26} a1={31} label="θ" />
        <line x1={30} y1={106} x2={130} y2={106} stroke={C.muted} strokeWidth={1.2} />
        <line x1={30} y1={101} x2={30} y2={111} stroke={C.muted} strokeWidth={1.2} />
        <line x1={130} y1={101} x2={130} y2={111} stroke={C.muted} strokeWidth={1.2} />
        <Txt x={80} y={122}>B·συνθ</Txt>
        <VL x={170} y={80} color={C.teal}>A</VL>
        <VL x={78} y={45} color={C.orange}>B</VL>
      </>
    ),
    text: (
      <>
        <V>A</V>·<V>B</V> = A·B·συνθ. Το αποτέλεσμα είναι <b>αριθμός</b> και δείχνει πόσο «συμφωνούν» οι κατευθύνσεις.
      </>
    ),
    eg: "Έργο δύναμης: W = F·Δx·συνθ. Αν θ = 90°, η δύναμη δεν παράγει έργο.",
  },
  {
    title: "Εξωτερικό γινόμενο",
    figure: (
      <>
        <Arrow x1={85} y1={100} x2={190} y2={100} color={C.teal} width={4} head={12} />
        <Arrow x1={85} y1={100} x2={150} y2={40} color={C.orange} width={4} head={12} />
        <AngleArc cx={85} cy={100} r={24} a1={42.7} label="θ" />
        <circle cx={32} cy={30} r={11} fill="none" stroke={C.purple} strokeWidth={2.5} />
        <circle cx={32} cy={30} r={3.5} fill={C.purple} />
        <Txt x={32} y={60} color={C.purple}>A×B</Txt>
        <Txt x={32} y={74} color={C.purple} size={10}>έξω από</Txt>
        <Txt x={32} y={86} color={C.purple} size={10}>τη σελίδα</Txt>
        <VL x={178} y={90} color={C.teal}>A</VL>
        <VL x={132} y={38} color={C.orange}>B</VL>
      </>
    ),
    text: (
      <>
        |<V>A</V>×<V>B</V>| = A·B·ημθ. Το αποτέλεσμα είναι <b>διάνυσμα</b>, κάθετο και στα δύο (κανόνας δεξιού χεριού).
      </>
    ),
    eg: "Ροπή: όσο πιο κάθετα σπρώχνεις την πόρτα (ημ90° = 1), τόσο πιο εύκολα ανοίγει.",
  },
  {
    title: "Μοναδιαίο διάνυσμα",
    figure: (
      <>
        <Arrow x1={25} y1={45} x2={180} y2={45} color={C.teal} width={4} head={13} />
        <Arrow x1={25} y1={90} x2={70} y2={90} color={C.orange} width={4} head={11} />
        <VL x={100} y={33} color={C.teal}>A</VL>
        <VL x={47} y={113} color={C.orange} hat>A</VL>
        <Txt x={130} y={95} color={C.orange}>μέτρο = 1</Txt>
      </>
    ),
    text: (
      <>
        Â = <V>A</V> / |<V>A</V>|. Έχει μέτρο 1 και κρατάει <b>μόνο την κατεύθυνση</b>.
      </>
    ),
    eg: (
      <>
        Τα î και ĵ είναι τα μοναδιαία των αξόνων x και y: A = A<sub>x</sub>·î + A<sub>y</sub>·ĵ.
      </>
    ),
  },
];

export function IdeaCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea, i) => (
        <article key={idea.title} className="flex flex-col rounded-2xl border border-black/10 bg-[#fffdf9] p-4">
          <h3 className="text-base font-semibold text-[#2c2825]">
            <span className="mr-1.5 text-[#c9822f]">{i + 1}.</span>
            {idea.title}
          </h3>
          <svg viewBox="0 0 200 125" className="mt-2 w-full rounded-xl bg-white" role="img" aria-label={idea.title}>
            {idea.figure}
          </svg>
          <p className="mt-3 text-[14px] leading-6 text-[#4d4138]">{idea.text}</p>
          <p className="mt-2 rounded-xl bg-[#f3efe8] px-3 py-2 text-[13px] leading-5 text-[#6b625b]">
            <b className="text-[#857261]">Π.χ.</b> {idea.eg}
          </p>
        </article>
      ))}
    </div>
  );
}
