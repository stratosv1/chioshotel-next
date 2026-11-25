"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CheckCircle2, ChevronDown, RotateCcw } from "lucide-react";
import { SCENARIOS } from "@/components/mixalis/ormi/OrmiPhaseQuiz";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { THINKING_TRICKS } from "./thinking-tricks-data";
import { ThinkingForceDiagram } from "./ThinkingForceDiagram";
import { Ormi2Navbar, Ormi2Secs, Ormi2Shell } from "./Ormi2Shell";

const Motion = dynamic(() => import("./Ormi2MotionScene").then((x) => x.Ormi2MotionScene), {
  ssr:false, loading:()=> <div className="o2-bench o2-readout">Φόρτωση φυσικού σχήματος…</div>,
});

export function Ormi2ThinkingTricks() {
  const [idx,setIdx]=useState(0);
  const [question,setQuestion]=useState(0);
  const [opened,setOpened]=useState(0);
  const [showForces,setShowForces]=useState(true);
  const [showMap,setShowMap]=useState(false);
  const [studied,setStudied]=useState<Record<string,boolean>>({});
  useEffect(()=>{
    const wanted=new URLSearchParams(window.location.search).get("scenario");
    const found=THINKING_TRICKS.findIndex((t)=>t.scenarioId===wanted);
    if(found>=0)setIdx(found);
  },[]);
  const trick=THINKING_TRICKS[idx];
  const q=trick.variations[question];
  const scene=SCENARIOS.find((s)=>s.id===trick.scenarioId);
  const full=opened===q.steps.length;
  const studyKey=trick.scenarioId+":"+q.id;
  const studiedCount=Object.values(studied).filter(Boolean).length;
  const total=THINKING_TRICKS.length;
  function selectTrick(i:number){
    setIdx(i);setQuestion(0);setOpened(0);setShowMap(false);setShowForces(true);
    try{const url=new URL(window.location.href);url.searchParams.set("scenario",THINKING_TRICKS[i].scenarioId);window.history.replaceState(null,"",url);}catch{/* optional */}
  }
  function selectQuestion(i:number){setQuestion(i);setOpened(0);}
  const studiedIn=(t:typeof trick)=>t.variations.filter((v)=>studied[t.scenarioId+":"+v.id]).length;

  return (
    <Ormi2Shell page="tricks" subtitle="5 δυνατά κόλπα" counter={<>Κόλπο {idx+1} / {total} · {studiedCount}/20 μελετήθηκαν σε αυτή τη συνεδρία</>}>
      <Ormi2Secs label="Τα 5 κόλπα" items={THINKING_TRICKS.map((t,i)=>({
        key:t.scenarioId, label:(i+1)+" · "+t.title, fill:studiedIn(t)/t.variations.length || (i===idx?0.15:0),
        current:i===idx, onClick:()=>selectTrick(i),
      }))}/>

      <section className="o2-slide">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="o2-kicker">Κόλπο {idx+1} · Περίπτωση {trick.number} · {trick.title}</p>
          <Link href={"/mixalis/ormi2?scenario="+encodeURIComponent(trick.scenarioId)} className="o2-btn sm">Λύσε την αρχική άσκηση →</Link>
        </div>
        <h1 className="o2-h1">{trick.memorable}</h1>
        <p className="o2-lead">{trick.headline}</p>
        <div className="o2-card">
          <p className="o2-card-title">Η εκφώνηση</p>
          <p>{trick.problem}</p>
        </div>
        {scene && <Motion key={trick.scenarioId} scenario={scene}/>}

        <div className="o2-cols">
          <div className="o2-card key">
            <p className="o2-card-title">Η πονηριά της άσκησης</p>
            <p className="o2-small">{trick.key}</p>
          </div>
          <div className="o2-card trap">
            <p className="o2-h3">Γιατί ΔΕΝ αρκεί ένας άλλος νόμος;</p>
            <p className="o2-small">{trick.whyNot}</p>
          </div>
        </div>

        <div className="o2-acc">
          <button type="button" onClick={()=>setShowForces(v=>!v)} aria-expanded={showForces}>
            <span className="n">F</span><span>{trick.forceHeading}</span>
            <ChevronDown size={18} className={"chev "+(showForces?"rotate-180":"")}/>
          </button>
          {showForces && <div className="body">
            <ThinkingForceDiagram id={trick.scenarioId}/>
            <div className="o2-cols">
              {trick.forces.map((force,i)=>(
                <div className="o2-card tip" key={i}>
                  <p className="o2-card-title">{force.subject}</p>
                  {force.horizontal && <p className="o2-small"><b>Οριζόντια:</b> {force.horizontal}</p>}
                  {force.vertical && <p className="o2-small"><b>Κατακόρυφα:</b> {force.vertical}</p>}
                  {force.radial && <p className="o2-small"><b>Ακτινικά:</b> {force.radial}</p>}
                </div>
              ))}
            </div>
          </div>}
        </div>
        <div className="o2-acc">
          <button type="button" onClick={()=>setShowMap(v=>!v)} aria-expanded={showMap}>
            <span className="n">→</span><span>Ο γενικός χάρτης επίλυσης</span>
            <ChevronDown size={18} className={"chev "+(showMap?"rotate-180":"")}/>
          </button>
          {showMap && <div className="body">
            <ol className="list-decimal pl-5">
              {trick.logic.map((item,i)=><li key={i}>{item}</li>)}
            </ol>
            <p className="o2-small o2-muted"><b>Προϋποθέσεις:</b> {trick.condition}</p>
          </div>}
        </div>
      </section>

      <section className="o2-slide">
        <p className="o2-kicker">Τι άλλο θα μπορούσαν να ζητήσουν;</p>
        <h2 className="o2-h2">Τέσσερα εναλλακτικά ζητούμενα</h2>
        <p className="o2-muted">Με πραγματικές αριθμητικές λύσεις. Σε κάθε βήμα: <b>τι κάνω, γιατί, τι βρίσκω και πού το χρησιμοποιώ.</b></p>
        <div className="o2-mapgrid">
          {trick.variations.map((v,i)=>(
            <button type="button" key={v.id} onClick={()=>selectQuestion(i)} aria-current={i===question?"true":undefined}>
              <b className="inline-flex items-center gap-1">Ερώτημα {i+1} {studied[trick.scenarioId+":"+v.id]&&<CheckCircle2 size={15} color="var(--ok)"/>}</b>
              <span style={{color:"var(--ink)"}}>{v.ask}</span>
              <span>{v.kind}</span>
            </button>
          ))}
        </div>

        <div className="o2-card key">
          <p className="o2-kicker">Η νέα αποστολή</p>
          <p className="o2-h3">{q.ask}</p>
          <p className="o2-m" style={{color:"var(--accent2)"}}>{q.symbol}</p>
          <p className="o2-small o2-muted">Σκέψου πριν αποκαλύψεις τη λύση.</p>
        </div>

        <div className="flex flex-col gap-3">
          {q.steps.slice(0,opened).map((s,i)=>(
            <div className="o2-card white o2-pop" key={i}>
              <p className="o2-card-title"><span style={{color:"var(--accent)"}}>{i+1}.</span> {s.title}</p>
              <p className="o2-small"><b>Τι σκέφτομαι;</b> {s.question}</p>
              <p className="o2-small"><b>Τι κάνω;</b> {s.choice}</p>
              <p className="o2-small"><b>Γιατί;</b> {s.because}</p>
              <code className="o2-formula">{s.formula}</code>
              <p className="o2-fb ok"><b>Βρίσκω:</b> {s.result}</p>
              <p className="o2-fb warn"><b>Η γέφυρα:</b> {s.bridge}</p>
            </div>
          ))}
        </div>
        {!full ? <div className="o2-seg">
          <button type="button" onClick={()=>setOpened(v=>Math.min(q.steps.length,v+1))} className="o2-btn pri big">
            {opened===0?"Δες το πρώτο βήμα":"Επόμενο βήμα"} →
          </button>
          <button type="button" onClick={()=>setOpened(q.steps.length)} className="o2-btn big">Πλήρης λύση</button>
          <span className="o2-counter">{opened}/{q.steps.length} βήματα</span>
        </div> :
        <div className="o2-card ok o2-pop">
          <p className="o2-kicker" style={{color:"var(--ok)"}}>Τελικό αποτέλεσμα</p>
          <p className="o2-h2">{q.answer}</p>
          <p className="o2-small"><b>Τι θυμάμαι:</b> {q.takeaway}</p>
          <div className="o2-seg">
            <button type="button" disabled={!!studied[studyKey]} onClick={()=>setStudied(v=>({...v,[studyKey]:true}))} className="o2-btn teal">
              <CheckCircle2 size={16}/>{studied[studyKey]?"Μελετήθηκε":"Το μελέτησα"}
            </button>
            <button type="button" onClick={()=>setOpened(0)} className="o2-btn"><RotateCcw size={15}/> Ξανά χωρίς βοήθεια</button>
          </div>
        </div>}
        <StudyMark lesson="ormi2" id={"t-"+trick.scenarioId} title={"Κόλπο: "+trick.memorable}
          path={"/mixalis/ormi2/kolpa?scenario="+encodeURIComponent(trick.scenarioId)}/>
      </section>

      <Ormi2Navbar prevLabel="Προηγούμενο" nextLabel="Επόμενο κόλπο" onPrev={()=>selectTrick((idx-1+total)%total)}
        onNext={()=>selectTrick((idx+1)%total)} hint="← → αλλάζουν κόλπο"/>
      <div className="pb-4"/>
    </Ormi2Shell>
  );
}
