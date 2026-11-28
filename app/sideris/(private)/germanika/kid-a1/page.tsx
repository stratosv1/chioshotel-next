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

const QUESTION_EL = ["Πού γεννήθηκες;","Τι χρώμα έχουν τα μαλλιά σου;","Έχεις κατοικίδιο;","Πού μένεις;","Τι ύψος έχεις;","Πώς σε λένε;","Σε ποια τάξη πηγαίνεις;","Πόσο χρονών είσαι;","Πότε πηγαίνεις στο σχολείο;","Από πού κατάγεσαι;","Σε ποιο σχολείο πηγαίνεις;","Πώς λένε τους γονείς σου;","Πώς λένε τον καλύτερό σου φίλο / την καλύτερή σου φίλη;","Τι χρώμα έχουν τα μάτια σου;","Έχεις αδέλφια;","Πότε έχεις γενέθλια;","Τι σου αρέσει να φοράς;","Ποιο είναι το αγαπημένο σου φαγητό;","Ποιο χρώμα σου αρέσει;","Τι κάνεις στον ελεύθερο χρόνο σου;","Τι κάνεις στις διακοπές;","Τι σου αρέσει να βλέπεις στην τηλεόραση;","Τι σου αρέσει να κάνεις στα γενέθλιά σου;","Τι κάνεις με τους φίλους σου;","Τι σου αρέσει να βλέπεις στο σινεμά;","Τι σου αρέσει να διαβάζεις;","Τι μουσική ακούς;","Τι σου αρέσει να κάνεις στο σχολείο;","Ποια ζώα σου αρέσουν;","Ποιες γλώσσες μιλάς;","Ποιο άθλημα σου αρέσει;","Ποια παιχνίδια σου αρέσουν;"];
type OralAnswer = {de:string;el:string};
const oralButton = "rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-40";

function OralPractice(){
  const [current,setCurrent]=useState(0);
  const [done,setDone]=useState<number[]>([]);
  const [order,setOrder]=useState(()=>QUESTIONS.map((_,i)=>i));
  const [answers,setAnswers]=useState<OralAnswer[]|null>(null);
  const [show,setShow]=useState(false);
  const [translation,setTranslation]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [audioError,setAudioError]=useState("");
  const pos=order.indexOf(current);
  const answer=answers?.[current];
  function go(i:number){setCurrent(i);setShow(false);setTranslation(false);setAudioError("");if(typeof window!=="undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();}
  function speak(value:string){
    if(!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance==="undefined"){setAudioError("Η συσκευή δεν υποστηρίζει ανάγνωση κειμένου.");return;}
    setAudioError("");
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(value);u.lang="de-DE";u.rate=0.85;
    const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith("de"));
    if(voice)u.voice=voice;
    u.onerror=()=>setAudioError("Δεν ήταν δυνατή η αναπαραγωγή. Έλεγξε τη γερμανική φωνή της συσκευής.");
    window.speechSynthesis.speak(u);
  }
  async function reveal(){
    if(show){setShow(false);return;}
    if(answers){setShow(true);return;}
    setLoading(true);setError("");
    try{
      const response=await fetch("/sideris/api/kid-a1/oral",{cache:"no-store",credentials:"same-origin"});
      if(!response.ok)throw Error("unavailable");
      const data=await response.json();
      if(!Array.isArray(data.answers)||data.answers.length!==32)throw Error("invalid");
      setAnswers(data.answers);setShow(true);
    }catch{setError("Οι απαντήσεις δεν φορτώθηκαν. Δοκίμασε ξανά ή συνδέσου πάλι.");}
    finally{setLoading(false);}
  }
  function reset(random:boolean){
    const next=QUESTIONS.map((_,i)=>i);
    if(random)for(let i=next.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[next[i],next[j]]=[next[j],next[i]];}
    setOrder(next);setDone([]);go(next[0]);
  }
  return <section id="sprechen" className="scroll-mt-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8 print:border-0 print:shadow-none">
    <p className="text-sm font-semibold text-[#857261]">ÖSD KID A1 · Sprechen</p>
    <h2 className="mt-2 text-2xl font-bold">32 ερωτήσεις προφορικών</h2>
    <p className="mt-2 text-sm text-[#6b625b] print:hidden">Άκουσε την ερώτηση, απάντησε προφορικά και μετά δες τη δική σου διορθωμένη απάντηση.</p>
    <div className="my-5 rounded-2xl bg-[#f8e9e0] p-5 print:hidden">
      <p className="text-sm font-semibold text-[#86391a]">Ερώτηση {current+1} · Σειρά {pos+1}/32 · Ολοκληρωμένες {done.length}/32</p>
      <p className="my-4 text-2xl font-semibold" lang="de">{QUESTIONS[current]}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={oralButton} onClick={()=>speak(QUESTIONS[current])}>Ακρόαση ερώτησης</button>
        <button type="button" className={oralButton} onClick={()=>setTranslation(v=>!v)}>{translation?"Απόκρυψη μετάφρασης":"Μετάφραση ερώτησης"}</button>
      </div>
      {translation&&<p className="mt-3 text-base">{QUESTION_EL[current]}</p>}
      <button type="button" disabled={loading} onClick={reveal} className="mt-4 rounded-xl bg-[#b5562a] px-4 py-3 font-semibold text-white disabled:opacity-50">{loading?"Φόρτωση…":show?"Απόκρυψη απάντησης":"Δες την απάντησή μου"}</button>
      {error&&<p role="alert" className="mt-2 text-red-700">{error}</p>}
      {show&&answer&&<div className="mt-4 rounded-xl border border-[#b5562a]/25 bg-white p-4">
        <p lang="de" className="text-lg font-medium leading-relaxed">{answer.de}</p>
        <button type="button" onClick={()=>speak(answer.de)} className={oralButton+" mt-3"}>Ακρόαση απάντησης</button>
        <details className="mt-3"><summary className="cursor-pointer font-semibold text-sm">Ελληνική μετάφραση απάντησης</summary><p className="mt-2 leading-relaxed">{answer.el}</p></details>
      </div>}
      {audioError&&<p role="status" className="mt-2 text-sm">{audioError}</p>}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-black/10 pt-4">
        <button type="button" disabled={pos===0||loading} onClick={()=>go(order[pos-1])} className={oralButton}>Προηγούμενη</button>
        <button type="button" disabled={loading} onClick={()=>{setDone(old=>old.includes(current)?old:[...old,current]);if(pos<31)go(order[pos+1]);else setShow(false)}} className="rounded-xl bg-[#b5562a] px-3 py-2 font-semibold text-white disabled:opacity-50">Απάντησα</button>
        <button type="button" disabled={pos===31||loading} onClick={()=>go(order[pos+1])} className={oralButton}>Επόμενη</button>
        <button type="button" disabled={loading} onClick={()=>reset(true)} className={oralButton}>Τυχαία εξέταση</button>
        <button type="button" disabled={loading} onClick={()=>reset(false)} className={oralButton}>Επανεκκίνηση</button>
      </div>
      {done.length===32&&<p className="mt-3 font-semibold text-green-800">Ολοκλήρωσες και τις 32 ερωτήσεις!</p>}
    </div>
    {[0,16].map(start=><div key={start} className="mt-5 print:break-inside-avoid">
      <h3 className="mb-2 font-semibold">Teil {start===0?1:2}</h3>
      <ol start={start+1} className="list-decimal space-y-2 pl-6" lang="de">{QUESTIONS.slice(start,start+16).map((q,i)=><li key={q}><button type="button" disabled={loading} onClick={()=>go(start+i)} className="text-left hover:underline disabled:opacity-50 print:hidden">{q}</button><span className="hidden print:inline">{q}</span>{done.includes(start+i)&&<span className="ml-2 text-green-700 print:hidden">✓</span>}</li>)}</ol>
    </div>)}
  </section>
}


const FLIGHT = [
  {n:3,text:"Im Raumschiff gibt es einen Stuhl. Dort sitzt normalerweise der Pilot. Jetzt sitzen Lukas und Max auf dem Stuhl und spielen mit den Knöpfen."},
  {n:6,text:"Jetzt macht Lukas seine Augen auf. Er liegt auf dem kleinen Teppich neben seinem Bett. Lukas hat geschlafen und es war alles nur ein Traum!"},
  {n:1,text:"An einem schönen Sonntagnachmittag geht Lukas mit seinem Hund Max spazieren. Da sieht er ein Raumschiff."},
  {n:5,text:"Plötzlich gibt es ein Problem. Etwas ist kaputt. Das Raumschiff kann nicht weiterfliegen. Es fällt ganz schnell nach unten."},
  {n:2,text:"Die Tür vom Raumschiff ist offen. Lukas und Max gehen zum Raumschiff. Dann steigen sie ein."},
  {n:4,text:"Dann ist es ganz laut. Das Raumschiff startet! Lukas und Max fliegen mit dem Raumschiff davon."},
];
function FlightRocket({x=0,y=0,rotation=0}:{x?:number;y?:number;rotation?:number}){
 return <g transform={`translate(${x} ${y}) rotate(${rotation})`} stroke="#443c35" strokeWidth="2" strokeLinejoin="round">
  <path d="M0 -45 Q-17 -24 -15 19 L-26 36 L-10 30 L10 30 L26 36 L15 19 Q17 -24 0 -45Z" fill="#e7e1d7"/>
  <path d="M0 -45 Q-9 -34 -12 -21 L12 -21 Q9 -34 0 -45Z" fill="#84786a"/>
  <circle cy="-6" r="6" fill="#a9d4e5"/><path d="M-9 30 L-8 36 H8 L9 30" fill="#84786a"/>
 </g>
}
function FlightBoy({x=0,y=0,rotation=0}:{x?:number;y?:number;rotation?:number}){
 return <g transform={`translate(${x} ${y}) rotate(${rotation})`} stroke="#443c35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <circle cy="-24" r="9" fill="#f5d6ad"/><path d="M-8 -27 Q-7 -37 4 -33 L9 -26" fill="#735744"/><circle cx="4" cy="-24" r="1" fill="#443c35"/>
  <path d="M-7 -15 L8 -15 L12 8 L-9 8Z" fill="#9bbdc8"/><path d="M-7 -10 L-15 4 M8 -10 L20 -3 M-4 8 L-6 26 M7 8 L13 26 M-6 26 H-13 M13 26 H20" fill="none"/>
 </g>
}
function FlightDog({x=0,y=0}:{x?:number;y?:number}){
 return <g transform={`translate(${x} ${y})`} stroke="#443c35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <ellipse rx="12" ry="7" fill="#d7b185"/><circle cx="12" cy="-7" r="7" fill="#d7b185"/><path d="M10 -12 L5 -20 L4 -8 M16 -10 L22 -6 L15 -4 M-12 -3 L-20 -12 M-7 6 V14 M7 6 V14" fill="none"/><circle cx="15" cy="-9" r="1" fill="#443c35"/>
 </g>
}
function FlightPicture({n}:{n:number}){
 const line={stroke:"#443c35",strokeWidth:2,strokeLinecap:"round" as const,strokeLinejoin:"round" as const};
 return <svg viewBox="0 0 180 124" role="img" aria-label={"Bild "+n} className="block w-full rounded-xl border border-black/15 bg-[#faf7f0]">
 {n===1&&<g {...line}><path d="M0 86 L33 51 L58 74 L85 43 L119 78 M0 106 H180" fill="none"/><path d="M83 104 L108 87 H158 L180 104" fill="#d1c7b7"/><FlightRocket x={133} y={61}/><FlightBoy x={32} y={79}/><FlightDog x={61} y={94}/></g>}
 {n===2&&<g {...line}><path d="M45 5 H145 L160 119 H25Z" fill="#e7e1d7"/><ellipse cx="91" cy="62" rx="27" ry="38" fill="#514b45"/><ellipse cx="127" cy="65" rx="14" ry="29" fill="#d4c8b5"/><path d="M122 65 H127" fill="none"/><FlightBoy x={76} y={79} rotation={-30}/><FlightDog x={93} y={104}/></g>}
 {n===3&&<g {...line}><path d="M0 0 H180 V124 H0Z" fill="#e9e5db"/><path d="M36 22 H57 V82 H111 V99 H36Z" fill="#b4a99a"/><path d="M70 98 V117 M139 18 L175 12 V109 H124 L143 49Z" fill="#d0c4b2"/>{[0,1,2,3,4,5].map(i=><circle key={i} cx={145+i%3*11} cy={30+Math.floor(i/3)*13} r="3" fill="#829ca2"/>)}<FlightBoy x={75} y={62} rotation={-12}/><path d="M80 57 L123 42" fill="none"/><FlightDog x={100} y={77}/></g>}
 {n===4&&<g {...line}><FlightRocket x={95} y={10}/><path d="M88 47 L82 83 M95 47 V91 M102 47 L111 82 M72 48 L62 71" stroke="#b5562a" strokeWidth="3" fill="none"/><path d="M0 108 Q5 90 25 99 Q20 76 48 82 Q52 59 76 78 Q89 66 104 86 Q124 62 138 86 Q165 76 170 99 Q180 95 180 113 H0Z" fill="#e3ddd2"/></g>}
 {n===5&&<g {...line}><path d="M25 100 Q32 18 85 21 Q147 17 147 64 M37 99 Q43 31 86 33 Q132 31 134 61" strokeDasharray="6 4" fill="none"/><path d="M5 111 Q14 87 37 100 Q50 81 67 108 M26 39 Q28 16 45 22 Q54 4 70 23 Q88 15 96 37" fill="#e1d9cc"/><FlightRocket x={141} y={76} rotation={180}/><path d="M124 94 L119 111 M163 94 L169 111" fill="none"/></g>}
 {n===6&&<g {...line}><path d="M8 112 H175 M24 86 V28 H40 V62 H155 V96 H24 M40 72 H155 V92 H40Z" fill="#d3c1aa"/><rect x="119" y="9" width="34" height="42" rx="2" fill="#fff"/><g transform="translate(136 31) scale(.32)"><FlightRocket/></g><ellipse cx="85" cy="108" rx="58" ry="10" fill="#c1b6a5"/><FlightBoy x={69} y={93} rotation={-57}/><path d="M79 90 Q98 76 117 91 L143 103 H91Z" fill="#e7d7a4"/></g>}
 <rect x="4" y="4" width="22" height="22" rx="4" fill="#443c35"/><text x="15" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">{n}</text>
 </svg>
}
function FlightReading(){
 const initial=()=>FLIGHT.map(row=>row.n===1?"1":"");
 const [values,setValues]=useState<string[]>(initial);
 const [checked,setChecked]=useState(false);
 const [solutions,setSolutions]=useState(false);
 const correct=FLIGHT.map((row,i)=>values[i]===String(row.n));
 const score=correct.filter((ok,i)=>ok&&FLIGHT[i].n!==1).length*2;
 return <section id="kurzer-flug" className="scroll-mt-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8 print:break-after-page print:border-0 print:shadow-none print:p-0">
  <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-3"><p className="text-sm font-semibold text-[#857261]">ÖSD KID A1 · Lesen · Aufgabe 2</p><p className="text-sm font-semibold">10 Punkte</p></div>
  <p lang="de" className="mt-4 text-sm leading-6">Situation: Du findest in einer Jugendzeitschrift folgende Bildgeschichte. Der Text zur Geschichte ist leider durcheinandergeraten. Schau dir die Geschichte genau an und ordne die Textteile (1 – 6). Textteil 1 haben wir für dich schon gefunden.</p>
  <h2 lang="de" className="my-5 text-center text-2xl font-bold">Ein kurzer Flug</h2>
  <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 print:grid-cols-3">{[1,2,3,4,5,6].map(n=><FlightPicture key={n} n={n}/>)}</div>
  <div className="overflow-hidden rounded-xl border border-black/15" lang="de">
   <div className="flex items-center gap-3 bg-[#f3efe8] p-3 text-sm font-semibold"><span className="w-16 shrink-0">Nummer</span><span>Text</span></div>
   {FLIGHT.map((row,i)=><div key={row.n} className="flex items-center gap-3 border-t border-black/15 p-3">
    {row.n===1?<span className="w-16 shrink-0 text-center font-bold">1</span>:<><select aria-label={"Text "+(i+1)+" – Nummer"} value={values[i]} onChange={e=>{setValues(old=>old.map((v,j)=>i===j?e.target.value:v));setChecked(false);setSolutions(false)}} className={"w-16 shrink-0 rounded-lg border-2 p-2 text-center text-lg print:hidden "+(checked?(correct[i]?"border-green-700 bg-green-50":"border-red-600 bg-red-50"):"border-[#b9a18d] bg-white")}><option value="">–</option>{[2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}</select><span className="hidden h-9 w-16 shrink-0 border border-black print:block"/></>}
    <div className="min-w-0 flex-1 text-base leading-relaxed print:text-sm">{row.text}{checked&&row.n!==1&&<span className={"ml-2 text-sm font-semibold print:hidden "+(correct[i]?"text-green-800":"text-red-700")}>{correct[i]?"Σωστό":"Λάθος"}</span>}{solutions&&row.n!==1&&<span className="ml-2 font-bold text-[#86391a] print:hidden">→ {row.n}</span>}</div>
   </div>)}
  </div>
  <div className="mt-5 flex flex-wrap items-center gap-2 print:hidden">
   <button type="button" disabled={values.some(v=>!v)} onClick={()=>{setChecked(true);setSolutions(false)}} className="rounded-xl bg-[#b5562a] px-4 py-2.5 font-semibold text-white disabled:opacity-45">Έλεγχος</button>
   <button type="button" onClick={()=>{setValues(initial());setChecked(false);setSolutions(false)}} className="rounded-xl border border-black/15 px-4 py-2.5 font-semibold">Ξανά από την αρχή</button>
   {checked&&<><span role="status" className="font-semibold">Βαθμός: {score}/10</span><button type="button" onClick={()=>setSolutions(v=>!v)} className="rounded-xl border border-black/15 px-3 py-2 text-sm">{solutions?"Απόκρυψη λύσεων":"Δες τις λύσεις"}</button></>}
  </div>
  <p className="mt-4 text-xs text-[#6b625b]">ÖSD KID A1 · Modellsatz · Aufgabe 2. Τα σκίτσα έχουν αναδημιουργηθεί από τη φωτογραφία για προσωπική εξάσκηση.</p>
 </section>
}


const ELEPHANT_OPTIONS = [
 ["A","Elefanten sind keine schnellen Tiere. In einer Stunde gehen sie nur circa 5 Kilometer weit."],
 ["B","Elefantenmütter leben in Gruppen mit ihren Kindern, die Väter meistens alleine."],
 ["C","Ein Elefant kann zwischen 2000 und 5000 Kilogramm schwer und bis zu 4 Meter hoch werden."],
 ["D","Elefanten fressen gerne Pflanzen, besonders gut schmecken ihnen Gras und Blätter."],
 ["E","Elefanten können gut und lange schwimmen. Besonders junge Elefanten lieben Schwimmen und Tauchen!"],
 ["F","Elefanten sind braun oder grau, haben weiße Zähne und große Ohren."],
 ["G","In vielen Ländern tragen Elefanten schwere Dinge oder arbeiten im Zirkus."],
];
const ELEPHANT_QUESTIONS = [
 ["Wie groß sind Elefanten?","C"],
 ["Was ist die Lieblingsspeise von Elefanten?","D"],
 ["Wie sehen Elefanten aus?","F"],
 ["Leben Elefanten in Familien?","B"],
 ["Helfen Elefanten den Menschen bei der Arbeit?","G"],
 ["Sind Elefanten gern im Wasser?","E"],
];
function ElephantDrawing(){
 return <svg viewBox="0 0 260 160" role="img" aria-label="Ein Elefant mit einem jungen Elefanten" className="mx-auto block w-full max-w-[260px]">
  <defs><g id="elephant-shape" stroke="#514c46" strokeWidth="1.5" strokeLinejoin="round"><ellipse cx="105" cy="64" rx="49" ry="34" fill="#99958e"/><path d="M69 82 L68 129 H83 L91 84 M124 84 L125 129 H140 L145 80" fill="#99958e"/><path d="M151 65 Q163 81 153 96" fill="none"/><ellipse cx="56" cy="67" rx="27" ry="30" fill="#a19d96"/><path d="M52 45 Q24 26 22 62 Q21 93 53 90 Q64 73 52 45Z" fill="#b1ada6"/><path d="M40 81 Q29 103 34 125 Q38 138 48 129 L48 120 Q41 126 43 116 L54 85" fill="#99958e"/><path d="M47 87 Q46 103 57 108 L55 88" fill="#fff8df"/><circle cx="43" cy="67" r="2" fill="#514c46"/></g></defs>
  <path d="M9 146 H251" stroke="#b7aa93" strokeWidth="2"/>
  <use href="#elephant-shape" transform="translate(5 1) scale(1.08)"/><use href="#elephant-shape" transform="translate(143 65) scale(.61)"/>
 </svg>
}
function ElephantReading(){
 const initial=()=>["C","","","","",""];
 const [values,setValues]=useState<string[]>(initial);
 const [checked,setChecked]=useState(false);
 const [solutions,setSolutions]=useState(false);
 const correct=ELEPHANT_QUESTIONS.map((q,i)=>values[i]===q[1]);
 const score=correct.slice(1).filter(Boolean).length*2;
 const used=values.slice(1).filter(Boolean);
 const duplicate=new Set(used).size!==used.length;
 return <section id="der-elefant" className="scroll-mt-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8 print:break-after-page print:border-0 print:shadow-none print:p-0">
  <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-3"><p className="text-sm font-semibold text-[#857261]">ÖSD KID A1 · Lesen · Aufgabe 1</p><p className="text-sm font-semibold">10 Punkte</p></div>
  <p lang="de" className="mt-4 text-sm leading-6">Situation: Was weißt du über Elefanten? Hier gibt es 5 Fragen. Findest du die richtige Antwort (A – G) zu den Fragen? Die Antwort auf Frage 0 haben wir für dich schon gefunden. Achtung: Es gibt eine Antwort zu viel.</p>
  <h2 lang="de" className="my-5 text-center text-2xl font-bold">Der Elefant</h2>
  <ElephantDrawing/>
  <div className="my-5 grid grid-cols-1 gap-3 sm:grid-cols-2 print:grid-cols-3" lang="de">{ELEPHANT_OPTIONS.map(([letter,option])=><div key={letter} className="flex gap-3 rounded-xl border border-black/15 bg-[#fcf6f0] p-3 print:break-inside-avoid"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#b5562a] font-bold text-white print:bg-white print:text-black">{letter}</span><p className="text-base leading-relaxed print:text-sm">{option}</p></div>)}</div>
  <div className="overflow-hidden rounded-xl border border-black/15" lang="de">
   <div className="flex justify-between bg-[#f3efe8] p-3 text-sm font-semibold"><span>Fragen</span><span>Antwort</span></div>
   {ELEPHANT_QUESTIONS.map(([question,answer],i)=><div key={i} className="flex items-center gap-3 border-t border-black/15 p-3">
    <span className="w-5 shrink-0 font-bold">{i}</span><p className="min-w-0 flex-1 text-base leading-relaxed print:text-sm">{question}{checked&&i>0&&<span className={"ml-2 text-sm font-semibold print:hidden "+(correct[i]?"text-green-800":"text-red-700")}>{correct[i]?"Σωστό":"Λάθος"}</span>}{solutions&&i>0&&<span className="ml-2 font-bold text-[#86391a] print:hidden">→ {answer}</span>}</p>
    {i===0?<span className="w-16 shrink-0 text-center font-bold">C</span>:<><select aria-label={"Antwort "+i} value={values[i]} onChange={e=>{setValues(old=>old.map((v,j)=>i===j?e.target.value:v));setChecked(false);setSolutions(false)}} className={"w-16 shrink-0 rounded-lg border-2 p-2 text-center text-lg print:hidden "+(checked?(correct[i]?"border-green-700 bg-green-50":"border-red-600 bg-red-50"):"border-[#b9a18d] bg-white")}><option value="">–</option>{ELEPHANT_OPTIONS.filter(([letter])=>letter!=="C").map(([letter])=><option key={letter} value={letter}>{letter}</option>)}</select><span className="hidden h-9 w-16 shrink-0 border border-black print:block"/></>}
   </div>)}
  </div>
  {duplicate&&<p role="status" className="mt-2 text-sm font-semibold text-[#86391a] print:hidden">Κάθε γράμμα χρησιμοποιείται μόνο μία φορά.</p>}
  <div className="mt-5 flex flex-wrap items-center gap-2 print:hidden">
   <button type="button" disabled={values.some(v=>!v)||duplicate} onClick={()=>{setChecked(true);setSolutions(false)}} className="rounded-xl bg-[#b5562a] px-4 py-2.5 font-semibold text-white disabled:opacity-45">Έλεγχος</button>
   <button type="button" onClick={()=>{setValues(initial());setChecked(false);setSolutions(false)}} className="rounded-xl border border-black/15 px-4 py-2.5 font-semibold">Ξανά από την αρχή</button>
   {checked&&<><span role="status" className="font-semibold">Βαθμός: {score}/10</span><button type="button" onClick={()=>setSolutions(v=>!v)} className="rounded-xl border border-black/15 px-3 py-2 text-sm">{solutions?"Απόκρυψη λύσεων":"Δες τις λύσεις"}</button></>}
  </div>
  <p className="mt-4 text-xs text-[#6b625b]">ÖSD KID A1 · Übungssatz 3 · Aufgabe 1. Προσωπική εξάσκηση από τη φωτογραφία.</p>
 </section>
}


const FASHION = [
 {n:5,text:"Julia hat Glück: Hier gibt es noch einen Trichter! Er ist sehr teuer, aber das ist nicht wichtig. Julia kauft den Trichter."},
 {n:1,text:"Julia sieht auf der Straße ein Bild von Sina, dem Superstar. Sina ist sehr schön. Auf dem Kopf trägt sie einen neuen Hut: der Hut ist ein Trichter*!"},
 {n:3,text:"Aber es gibt keine Trichter mehr, alle Regale sind leer! Julia ist traurig."},
 {n:6,text:"Mit ihrem Trichter ist Julia jetzt so schön wie der Superstar Sina. Und wie alle anderen Mädchen."},
 {n:2,text:"Julia möchte auch so gut aussehen wie Sina! Sie will auch einen Trichter auf dem Kopf tragen! Sofort läuft sie in die Einkaufsstraße zum ersten Geschäft."},
 {n:4,text:"Sie läuft schnell weiter zum zweiten Geschäft. Hoffentlich gibt es dort noch Trichter! Julia ist ganz nervös."},
];
function FashionFunnel({x=0,y=0,rotation=0,scale=1}:{x?:number;y?:number;rotation?:number;scale?:number}){
 return <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} stroke="#52453e" strokeWidth="1.8" strokeLinejoin="round"><path d="M-17 -13 L17 -13 L4 5 L3 19 H-3 L-4 5Z" fill="#d9ab76"/><ellipse cy="-13" rx="17" ry="3" fill="#f5dbb6"/></g>
}
function FashionGirl({x=0,y=0,hat=false,mirror=false,scale=1,shade="#b87560"}:{x?:number;y?:number;hat?:boolean;mirror?:boolean;scale?:number;shade?:string}){
 return <g transform={`translate(${x} ${y}) scale(${mirror?-scale:scale} ${scale})`} stroke="#52453e" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
 <path d="M-11 -23 Q-14 -43 4 -43 Q19 -40 11 -18 L-2 -14Z" fill="#9a7152"/><ellipse cx="4" cy="-29" rx="9" ry="12" fill="#f4d6b3"/><path d="M-5 -36 Q3 -37 9 -40 L12 -31" fill="#9a7152"/><circle cx="8" cy="-29" r="1" fill="#52453e"/><path d="M9 -22 L5 -21" fill="none"/><path d="M-5 -16 H7 L16 17 H-15Z" fill={shade}/><path d="M-1 -12 L-13 2 M7 -12 L23 -5 M-7 17 L-9 33 M9 17 L13 33 M-9 33 H-14 M13 33 H20" fill="none"/>{hat&&<FashionFunnel x={2} y={-54} rotation={180} scale={.83}/>}
 </g>
}
function FashionShop({second=false}:{second?:boolean}){
 return <g stroke="#52453e" strokeWidth="1.6" strokeLinejoin="round"><rect x="90" y="5" width="88" height="115" fill="#e4d6bb"/><rect x="96" y="9" width="76" height="25" fill="#fff7e9"/><text x="134" y="19" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#52453e" stroke="none">{second?"ALLES FÜR":"HAUSHALTS-"}</text><text x="134" y="29" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#52453e" stroke="none">{second?"DIE KÜCHE":"WAREN"}</text><rect x="103" y="40" width="56" height="80" fill="#d5e5e6"/><path d="M110 113 H155 M150 81 H155" fill="none"/><FashionFunnel x={132} y={63} scale={.66}/></g>
}
function FashionPicture({n}:{n:number}){
 return <svg viewBox="0 0 180 124" role="img" aria-label={"Bild "+n} className="block w-full rounded-xl border border-black/15 bg-[#faf7f0]">
 {n===1&&<g><path d="M0 112 H180 M86 103 V39 L124 15 L161 41 V103" fill="none" stroke="#9b8c7c" strokeWidth="2"/><rect x="29" y="10" width="65" height="96" rx="2" fill="#f1d7af" stroke="#52453e" strokeWidth="2"/><text x="61" y="23" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#52453e">SINA</text><FashionGirl x={60} y={69} hat scale={.65} shade="#a48bb3"/><text x="61" y="99" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#52453e">SUPERSTAR</text><FashionGirl x={145} y={89} mirror scale={.9}/></g>}
 {n===2&&<g><path d="M0 108 H180 M10 67 V36 H39 V63 H72 V22 H90" fill="none" stroke="#a39280" strokeWidth="2"/><FashionShop/><path d="M15 79 H39 M8 89 H31" stroke="#a39280" strokeWidth="2"/><FashionGirl x={55} y={84} scale={.95}/></g>}
 {n===3&&<g stroke="#52453e" strokeWidth="1.6"><rect x="72" y="5" width="103" height="115" fill="#e4d6bb"/><path d="M75 38 H172 M75 72 H172 M75 105 H172 M123 5 V120" fill="none"/><rect x="89" y="42" width="65" height="27" fill="#fff7e9"/><text x="121" y="53" textAnchor="middle" stroke="none" fill="#52453e" fontSize="8">TRICHTER</text><text x="121" y="63" textAnchor="middle" stroke="none" fill="#52453e" fontSize="8" fontWeight="bold">AUSVERKAUFT</text><FashionGirl x={42} y={86} scale={.95}/></g>}
 {n===4&&<g><path d="M0 108 H180 M0 56 H22 V31 H67 V65 H90" fill="none" stroke="#a39280" strokeWidth="2"/><FashionShop second/><path d="M5 79 H32 M1 91 H27" stroke="#a39280" strokeWidth="2"/><FashionGirl x={52} y={84} scale={.95}/></g>}
 {n===5&&<g stroke="#52453e" strokeWidth="1.6"><rect x="4" y="4" width="172" height="116" fill="#f3e9d9"/><rect x="57" y="8" width="115" height="20" fill="#fff"/><text x="115" y="21" fontSize="9" textAnchor="middle" stroke="none" fill="#52453e">KOCH- UND BACKZUBEHÖR</text><FashionGirl x={41} y={77} scale={.9} shade="#809a8e"/><rect x="7" y="92" width="98" height="26" fill="#b5a28c"/><FashionFunnel x={87} y={60}/><rect x="81" y="79" width="27" height="16" fill="#fff"/><text x="94" y="90" fontSize="9" textAnchor="middle" stroke="none" fill="#52453e">80 €</text><FashionGirl x={145} y={86} mirror scale={.9}/></g>}
 {n===6&&<g><path d="M0 110 H180 M8 50 L35 19 L60 50 M103 50 L137 20 L176 49" stroke="#a39280" strokeWidth="2" fill="none"/><FashionGirl x={35} y={89} hat scale={.87}/><FashionGirl x={91} y={89} hat scale={.87} shade="#8c9eac"/><FashionGirl x={148} y={89} hat mirror scale={.87} shade="#a48bb3"/></g>}
 <rect x="4" y="4" width="22" height="22" rx="4" fill="#443c35"/><text x="15" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">{n}</text>
 </svg>
}

function FashionReading(){
 const initial=()=>FASHION.map(row=>row.n===1?"1":"");
 const [values,setValues]=useState<string[]>(initial);
 const [checked,setChecked]=useState(false);
 const [solutions,setSolutions]=useState(false);
 const correct=FASHION.map((row,i)=>values[i]===String(row.n));
 const score=correct.filter((ok,i)=>ok&&FASHION[i].n!==1).length*2;
 return <section id="die-neue-mode" className="scroll-mt-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8 print:break-after-page print:border-0 print:shadow-none print:p-0">
  <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-3"><p className="text-sm font-semibold text-[#857261]">ÖSD KID A1 · Lesen · Aufgabe 2</p><p className="text-sm font-semibold">10 Punkte</p></div>
  <p lang="de" className="mt-4 text-sm leading-6">Situation: Du findest in einer Jugendzeitschrift folgende Bildgeschichte. Der Text zur Geschichte ist leider durcheinandergeraten. Schau dir die Geschichte genau an und ordne die Textteile (1 – 6). Textteil 1 haben wir für dich schon gefunden.</p>
  <h2 lang="de" className="my-5 text-center text-2xl font-bold">Die neue Mode</h2>
  <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 print:grid-cols-3">{[1,2,3,4,5,6].map(n=><FashionPicture key={n} n={n}/>)}</div>
  <div className="overflow-hidden rounded-xl border border-black/15" lang="de">
   <div className="flex items-center gap-3 bg-[#f3efe8] p-3 text-sm font-semibold"><span className="w-16 shrink-0">Nummer</span><span>Text</span></div>
   {FASHION.map((row,i)=><div key={row.n} className="flex items-center gap-3 border-t border-black/15 p-3">
    {row.n===1?<span className="w-16 shrink-0 text-center font-bold">1</span>:<><select aria-label={"Text "+(i+1)+" – Nummer"} value={values[i]} onChange={e=>{setValues(old=>old.map((v,j)=>i===j?e.target.value:v));setChecked(false);setSolutions(false)}} className={"w-16 shrink-0 rounded-lg border-2 p-2 text-center text-lg print:hidden "+(checked?(correct[i]?"border-green-700 bg-green-50":"border-red-600 bg-red-50"):"border-[#b9a18d] bg-white")}><option value="">–</option>{[2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}</select><span className="hidden h-9 w-16 shrink-0 border border-black print:block"/></>}
    <div className="min-w-0 flex-1 text-base leading-relaxed print:text-sm">{row.text}{checked&&row.n!==1&&<span className={"ml-2 text-sm font-semibold print:hidden "+(correct[i]?"text-green-800":"text-red-700")}>{correct[i]?"Σωστό":"Λάθος"}</span>}{solutions&&row.n!==1&&<span className="ml-2 font-bold text-[#86391a] print:hidden">→ {row.n}</span>}</div>
   </div>)}
  </div>
  <div lang="de" className="mt-3 flex items-center gap-2 text-sm"><span>* der Trichter:</span><svg viewBox="0 0 44 44" className="h-10 w-10" role="img" aria-label="Trichter"><FashionFunnel x={22} y={20}/></svg></div>
  <div className="mt-5 flex flex-wrap items-center gap-2 print:hidden">
   <button type="button" disabled={values.some(v=>!v)} onClick={()=>{setChecked(true);setSolutions(false)}} className="rounded-xl bg-[#b5562a] px-4 py-2.5 font-semibold text-white disabled:opacity-45">Έλεγχος</button>
   <button type="button" onClick={()=>{setValues(initial());setChecked(false);setSolutions(false)}} className="rounded-xl border border-black/15 px-4 py-2.5 font-semibold">Ξανά από την αρχή</button>
   {checked&&<><span role="status" className="font-semibold">Βαθμός: {score}/10</span><button type="button" onClick={()=>setSolutions(v=>!v)} className="rounded-xl border border-black/15 px-3 py-2 text-sm">{solutions?"Απόκρυψη λύσεων":"Δες τις λύσεις"}</button></>}
  </div>
  <p className="mt-4 text-xs text-[#6b625b]">ÖSD KID A1 · Übungssatz 3 · Aufgabe 2. Τα σκίτσα έχουν αναδημιουργηθεί από τη φωτογραφία για προσωπική εξάσκηση.</p>
 </section>
}

export default function GermanKidA1Page(){
  return <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8 print:bg-white print:p-0">
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm print:hidden">
        <Link href="/sideris" prefetch={false} className="text-sm font-semibold hover:underline">← Τα μαθήματά μου</Link>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-[#857261]">Γερμανικά · ÖSD KID A1</p>
        <h1 className="mt-2 text-3xl font-bold">Lesen &amp; Sprechen</h1>
        <p className="mt-3 text-[#6b625b]">3 ασκήσεις αντιστοίχισης, 4 τεστ συμπλήρωσης λέξεων και 32 ερωτήσεις προφορικών. Οι απαντήσεις δεν εμφανίζονται πριν από τον έλεγχο.</p>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Ασκήσεις">
          <a href="#die-neue-mode" className="rounded-full bg-[#f8e9e0] px-3 py-2 text-sm font-medium">Die neue Mode</a>
          <a href="#der-elefant" className="rounded-full bg-[#f8e9e0] px-3 py-2 text-sm font-medium">Der Elefant</a>
          <a href="#kurzer-flug" className="rounded-full bg-[#f8e9e0] px-3 py-2 text-sm font-medium">Ein kurzer Flug</a>
          {TESTS.map((t,i)=><a key={t.title} href={"#lesen-"+(i+1)} className="rounded-full bg-[#f8e9e0] px-3 py-2 text-sm font-medium">{t.title}</a>)}
          <a href="#sprechen" className="rounded-full bg-[#f8e9e0] px-3 py-2 text-sm font-medium">Προφορικά</a>
          <button type="button" onClick={()=>window.print()} className="rounded-full border border-black/15 px-3 py-2 text-sm font-medium">Εκτύπωση / PDF</button>
        </nav>
      </header>
      <ElephantReading/>
      <FashionReading/>
      <FlightReading/>
      {TESTS.map((test,index)=><ReadingTest key={test.title} test={test} index={index}/>)}
      <OralPractice/>
      <p className="text-xs text-[#6b625b]">Πηγή κειμένων: ÖSD KID A1, Modellsatz και Übungssätze 1–3, από τις φωτογραφίες των ασκήσεων. Αναπαραγωγή για προσωπική εξάσκηση.</p>
    </div>
  </main>
}
