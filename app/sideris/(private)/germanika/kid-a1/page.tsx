"use client";

import Link from "next/link";
import { Fragment, useState } from "react";

const TESTS = [
  {
    "title": "Die Goggis",
    "words": [
      "kauft",
      "kann",
      "liebt",
      "gibt",
      "geht",
      "steht",
      "wohnt",
      "spielt"
    ],
    "example": "wohnt",
    "parts": [
      "Willkommen bei der Familie Goggi! Das sind Goggivater, Goggimutter und der kleine Goggi. Die Goggifamilie (0) wohnt in einem kleinen Haus aus Holz im Goggiland. Dort ",
      " es Berge, Wald und ein großes Meer. Die Goggis sind 50 cm groß, ein bisschen dick und sie haben eine große Nase. Goggimutter ",
      " gern einkaufen und kocht dann etwas Gutes für die ganze Familie. Der kleine Goggi ",
      " das Meer. Er fährt gern mit dem Schiff und er ",
      " sehr gut schwimmen. Am liebsten ",
      " er aber zu Hause mit seinen Freunden. Sein bester Freund heißt Lenno."
    ],
    "answers": [
      "gibt",
      "geht",
      "liebt",
      "kann",
      "spielt"
    ]
  },
  {
    "title": "Pinocchio",
    "words": [
      "fährt",
      "trinkt",
      "ist",
      "sieht",
      "macht",
      "heißt",
      "soll",
      "sitzt"
    ],
    "example": "heißt",
    "parts": [
      "Die Geschichte von Pinocchio ist ein italienisches Kinderbuch. Der Vater von Pinocchio (0) heißt Gepetto. Gepetto ",
      " Tischler und macht eines Tages aus einem Stück Holz eine Figur. Die Figur kann sprechen und Gepetto gibt ihr den Namen „Pinocchio“. Pinocchio ",
      " zur Schule gehen. Aber Pinocchio will das nicht, er ",
      " lieber in andere Länder und erlebt dort viele Abenteuer. Erst nach langer Zeit ",
      " er seinen Vater wieder. Pinocchio möchte jetzt ein braver Junge sein. Am Ende geht er zur Schule und ",
      " jeden Tag seine Hausaufgaben."
    ],
    "answers": [
      "ist",
      "soll",
      "fährt",
      "sieht",
      "macht"
    ]
  },
  {
    "title": "Oldtimer",
    "words": [
      "kann",
      "kostet",
      "ist",
      "heißt",
      "kauft",
      "hat",
      "kommt",
      "macht"
    ],
    "example": "heißt",
    "parts": [
      "Ein mehr als 30 Jahre altes Auto (0) heißt Oldtimer. Ein Oldtimer ",
      " nicht mehr modern. So ein altes Auto fährt aber vielleicht immer noch ohne Probleme und das Oldtimer-Fahren ",
      " viel Spaß. Beim Kauf und bei einer Reparatur ",
      " ein Oldtimer oft sehr viel Geld. Wenn jemand selbst keinen Oldtimer hat, dann ",
      " er sich die alten Autos in einem Museum ansehen. Oder er ",
      " zu einem Oldtimer-Treffen. Bei so einem Treffen zeigen Oldtimer-Fahrer anderen Leuten ihre Autos."
    ],
    "answers": [
      "ist",
      "macht",
      "kostet",
      "kann",
      "kommt"
    ]
  },
  {
    "title": "Asterix und Obelix",
    "words": [
      "hat",
      "sind",
      "lernt",
      "bleibt",
      "heißt",
      "schickt",
      "darf",
      "reist"
    ],
    "example": "sind",
    "parts": [
      "Kennst du Asterix und Obelix? Das (0) sind zwei Comicfiguren aus einem kleinen Dorf in Gallien. Asterix ist klein und dünn, aber sehr intelligent! Sein dicker Freund Obelix ",
      " immer großen Hunger. Er isst am liebsten Wildschweine. Asterix ",
      " mit Obelix oft in andere Länder und erlebt dort große Abenteuer. Obelix hat einen Hund. Er ",
      " Idefix. Idefix ",
      " nicht gern allein zu Hause. Meistens ",
      " er mit Asterix und Obelix mitkommen."
    ],
    "answers": [
      "hat",
      "reist",
      "heißt",
      "bleibt",
      "darf"
    ]
  }
];
const QUESTIONS = [
  "Wo bist du geboren?",
  "Welche Farbe haben deine Haare?",
  "Hast du ein Haustier?",
  "Wo wohnst du?",
  "Wie groß bist du?",
  "Wie heißt du?",
  "In welche Klasse gehst du?",
  "Wie alt bist du?",
  "Wann gehst du in die Schule?",
  "Woher kommst du?",
  "In welche Schule gehst du?",
  "Wie heißen deine Eltern?",
  "Wie heißt dein bester Freund / deine beste Freundin?",
  "Welche Farbe haben deine Augen?",
  "Hast du Brüder oder Schwestern?",
  "Wann hast du Geburtstag?",
  "Was ziehst du gern an?",
  "Was ist dein Lieblingsessen?",
  "Welche Farbe magst du?",
  "Was machst du in deiner Freizeit?",
  "Was machst du in den Ferien?",
  "Was siehst du gern im Fernsehen?",
  "Was machst du gern an deinem Geburtstag?",
  "Was machst du mit deinen Freunden?",
  "Was siehst du gern im Kino?",
  "Was liest du gern?",
  "Welche Musik hörst du?",
  "Was machst du in der Schule gern?",
  "Welche Tiere magst du?",
  "Welche Sprachen sprichst du?",
  "Welchen Sport magst du?",
  "Welche Spiele magst du?"
];
type Test = (typeof TESTS)[number];

function ReadingTest({test, index}: {test: Test; index: number}) {
  const [values,setValues] = useState<string[]>(Array(5).fill(""));
  const [checked,setChecked] = useState(false);
  const [showSolutions,setShowSolutions] = useState(false);
  const correct = values.map((v,i)=>v.trim().toLocaleLowerCase("de")===test.answers[i]);
  const score = correct.filter(Boolean).length * 2;
  return (
    <section id={"lesen-"+(index+1)} className="scroll-mt-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8 print:break-inside-avoid print:break-after-page print:rounded-none print:border-0 print:p-0 print:shadow-none">
      <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-3">
        <p className="text-sm font-semibold text-[#857261]">ÖSD KID A1 · Lesen · Aufgabe 3</p>
        <p className="text-sm font-semibold">10 Punkte</p>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#6b625b]" lang="de">Finde für jede Lücke das passende Wort und schreib es hinein. Achtung: Es gibt zwei Wörter zu viel.</p>
      <h2 className="mb-4 mt-5 text-2xl font-bold" lang="de">{test.title}</h2>
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4" lang="de" aria-label="Wörter">
        {test.words.map(word=><span key={word} className={"rounded-xl border border-[#b5562a]/35 px-3 py-2 text-center font-medium "+(word===test.example?"line-through text-[#777]":"bg-[#fcf6f0]")}>{word}</span>)}
      </div>
      <p className="text-lg leading-[2.8] text-[#2c2825] print:text-base print:leading-loose" lang="de">
        {test.parts.map((part,i)=><Fragment key={i}>{part}{i<5&&<span className="inline-block whitespace-nowrap align-baseline">
          <span className="mr-1 text-sm font-medium">({i+1})</span>
          <input type="text" autoComplete="off" autoCapitalize="none" spellCheck={false} aria-label={test.title+" – Lücke "+(i+1)} value={values[i]} onChange={e=>{setValues(old=>old.map((v,j)=>j===i?e.target.value:v));setChecked(false);setShowSolutions(false)}} className={"w-[6.6rem] rounded-lg border-2 px-2 py-1 text-center text-base leading-normal focus:outline-none focus:ring-2 focus:ring-[#b5562a]/35 print:hidden "+(checked?(correct[i]?"border-green-700 bg-green-50":"border-red-600 bg-red-50"):"border-[#b9a18d] bg-white")}/>
          <span className="hidden w-28 border-b border-black print:inline-block">&nbsp;</span>
        </span>}</Fragment>)}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4 print:hidden">
        <button type="button" onClick={()=>{setChecked(true);setShowSolutions(false)}} disabled={values.some(v=>!v.trim())} className="rounded-xl bg-[#b5562a] px-4 py-2.5 font-semibold text-white disabled:opacity-45">Έλεγχος</button>
        <button type="button" onClick={()=>{setValues(Array(5).fill(""));setChecked(false);setShowSolutions(false)}} className="rounded-xl border border-black/15 px-4 py-2.5 font-semibold">Ξανά από την αρχή</button>
        {checked&&<><span role="status" className="font-semibold">Βαθμός: {score}/10</span><button type="button" onClick={()=>setShowSolutions(v=>!v)} className="rounded-xl border border-black/15 px-3 py-2 text-sm">{showSolutions?"Απόκρυψη λύσεων":"Δες τις λύσεις"}</button></>}
      </div>
      {showSolutions&&<p className="mt-3 rounded-xl bg-[#f8e9e0] p-3 text-sm print:hidden">{test.answers.map((a,i)=>(i+1)+". "+a).join(" · ")}</p>}
    </section>
  );
}

function OralPractice(){
  const [current,setCurrent]=useState(0);
  const [done,setDone]=useState<number[]>([]);
  return <section id="sprechen" className="scroll-mt-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8 print:border-0 print:shadow-none">
    <p className="text-sm font-semibold text-[#857261]">ÖSD KID A1 · Sprechen</p>
    <h2 className="mt-2 text-2xl font-bold">32 ερωτήσεις προφορικών</h2>
    <p className="mt-2 text-sm text-[#6b625b] print:hidden">Απάντησε προφορικά στα γερμανικά, με ολοκληρωμένη πρόταση.</p>
    <div className="my-5 rounded-2xl bg-[#f8e9e0] p-5 print:hidden">
      <p className="text-sm font-semibold text-[#86391a]">Ερώτηση {current+1}/32 · Ολοκληρωμένες {done.length}/32</p>
      <p className="my-5 text-2xl font-semibold" lang="de">{QUESTIONS[current]}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={current===0} onClick={()=>setCurrent(v=>v-1)} className="rounded-xl border border-black/15 bg-white px-3 py-2 disabled:opacity-40">Προηγούμενη</button>
        <button type="button" onClick={()=>{setDone(old=>old.includes(current)?old:[...old,current]);setCurrent(v=>Math.min(v+1,31))}} className="rounded-xl bg-[#b5562a] px-3 py-2 font-semibold text-white">Απάντησα</button>
        <button type="button" onClick={()=>setCurrent(v=>(v+1)%32)} className="rounded-xl border border-black/15 bg-white px-3 py-2">Επόμενη</button>
        <button type="button" onClick={()=>{setDone([]);setCurrent(0)}} className="rounded-xl border border-black/15 bg-white px-3 py-2">Επανεκκίνηση</button>
      </div>
    </div>
    {[0,16].map(start=><div key={start} className="mt-5 print:break-inside-avoid">
      <h3 className="mb-2 font-semibold">Teil {start===0?1:2}</h3>
      <ol start={start+1} className="list-decimal space-y-2 pl-6" lang="de">{QUESTIONS.slice(start,start+16).map((q,i)=><li key={q}><button type="button" onClick={()=>setCurrent(start+i)} className="text-left hover:underline print:hidden">{q}</button><span className="hidden print:inline">{q}</span>{done.includes(start+i)&&<span className="ml-2 text-green-700 print:hidden">✓</span>}</li>)}</ol>
    </div>)}
  </section>
}

export default function GermanKidA1Page(){
  return <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8 print:bg-white print:p-0">
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm print:hidden">
        <Link href="/sideris" prefetch={false} className="text-sm font-semibold hover:underline">← Τα μαθήματά μου</Link>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-[#857261]">Γερμανικά · ÖSD KID A1</p>
        <h1 className="mt-2 text-3xl font-bold">Lesen &amp; Sprechen</h1>
        <p className="mt-3 text-[#6b625b]">4 τεστ συμπλήρωσης λέξεων και 32 ερωτήσεις προφορικών. Οι απαντήσεις δεν εμφανίζονται πριν από τον έλεγχο.</p>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Ασκήσεις">
          {TESTS.map((t,i)=><a key={t.title} href={"#lesen-"+(i+1)} className="rounded-full bg-[#f8e9e0] px-3 py-2 text-sm font-medium">{t.title}</a>)}
          <a href="#sprechen" className="rounded-full bg-[#f8e9e0] px-3 py-2 text-sm font-medium">Προφορικά</a>
          <button type="button" onClick={()=>window.print()} className="rounded-full border border-black/15 px-3 py-2 text-sm font-medium">Εκτύπωση / PDF</button>
        </nav>
      </header>
      {TESTS.map((test,index)=><ReadingTest key={test.title} test={test} index={index}/>)}
      <OralPractice/>
      <p className="text-xs text-[#6b625b]">Πηγή κειμένων: ÖSD KID A1, Modellsatz και Übungssätze 1–3, από τις φωτογραφίες των ασκήσεων. Αναπαραγωγή για προσωπική εξάσκηση.</p>
    </div>
  </main>
}
