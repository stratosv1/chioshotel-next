"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight, BookOpen, BrainCircuit, CheckCircle2, ChevronDown, Eye, GitBranch, Lightbulb, RotateCcw, Target, Trophy, Waypoints } from "lucide-react";
import { SCENARIOS } from "@/components/mixalis/ormi/OrmiPhaseQuiz";
import { THINKING_TRICKS } from "./thinking-tricks-data";
import { ThinkingForceDiagram } from "./ThinkingForceDiagram";

const Motion = dynamic(() => import("./Ormi2MotionScene").then((x) => x.Ormi2MotionScene), {
  ssr:false, loading:()=> <div className="min-h-40 animate-pulse rounded-xl bg-[#f2f8f3] p-4 text-sm">Φόρτωση φυσικού σχήματος…</div>,
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
  function selectTrick(i:number){setIdx(i);setQuestion(0);setOpened(0);setShowMap(false);setShowForces(true);}
  function selectQuestion(i:number){setQuestion(i);setOpened(0);}

  return (
    <main className="min-h-screen bg-[#f3efe8] px-3 py-5 text-[#292e2a] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-3xl bg-[#203d35] p-5 text-white sm:p-9">
          <Link href="/mixalis/ormi2" className="inline-flex items-center gap-2 text-sm text-[#b8dec9]"><ArrowLeft size={16}/> Πίσω στην Ορμή 2</Link>
          <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9bdab8]">Προχωρημένη φυσική · Διαδρομές σκέψης</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">5 δυνατά κόλπα για δύσκολες ασκήσεις</h1>
              <p className="mt-3 text-sm leading-7 text-[#d4e7dc]">Δεν απομνημονεύεις τύπους: μαθαίνεις τι ψάχνεις, τι υπολογίζεις πρώτα, γιατί επιλέγεις έναν νόμο και πώς συνδέεις τις διαφορετικές φάσεις.</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-center">
              <p className="text-2xl font-bold">{studiedCount}/20</p>
              <p className="text-xs">Μελετήθηκαν</p>
              <p className="text-[10px] text-[#c9dbd0]">Μόνο σε αυτή τη συνεδρία</p>
            </div>
          </div>
        </header>
        <div className="grid items-start gap-5 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-black/10 bg-white p-4 lg:sticky lg:top-4">
            <h2 className="flex items-center gap-2 font-semibold"><Trophy size={19} className="text-[#a07845]"/> Επίλεξε το κόλπο</h2>
            <p className="mt-1 text-xs leading-5 text-[#6b6a61]">Πέντε επιλεγμένες ασκήσεις από τα 36 σενάρια.</p>
            <div className="mt-3 space-y-2">
              {THINKING_TRICKS.map((t,i)=>(
                <button type="button" key={t.scenarioId} onClick={()=>selectTrick(i)} aria-current={idx===i?"true":undefined}
                  className={"flex min-h-20 w-full gap-3 rounded-xl border p-3 text-left "+(idx===i?"border-[#2a7b56] bg-[#e8f5ed]":"border-[#e7e5dd] hover:bg-[#faf9f5]")}>
                  <span className={"grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold "+(idx===i?"bg-[#2e7958] text-white":"bg-[#eee9e0]")}>{i+1}</span>
                  <span>
                    <span className="block text-sm font-semibold">{t.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#6d796b]">{t.memorable}</span>
                    <span className="mt-1 block text-[11px] font-medium text-[#297859]">Περίπτωση {t.number} · 4 ερωτήματα</span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div className="min-w-0 space-y-4">
            <section className="rounded-3xl border border-black/10 bg-white p-4 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-[#e3f2e8] px-3 py-1 text-xs font-bold text-[#2a6d4e]">Κόλπο {idx+1}/5 · Περίπτωση {trick.number}</span>
                <Link href={"/mixalis/ormi2?scenario="+encodeURIComponent(trick.scenarioId)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#267151]"><BookOpen size={15}/> Αρχική άσκηση</Link>
              </div>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{trick.title}</h2>
              <div className="mt-4 rounded-2xl border-l-4 border-[#34865e] bg-[#eef7ef] p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#287350]"><Lightbulb size={17}/> Το κόλπο που θυμάμαι</p>
                <p className="mt-2 text-xl font-semibold leading-8 text-[#23503a]">{trick.memorable}</p>
                <p className="mt-1 text-sm leading-7 text-[#46674f]">{trick.headline}</p>
              </div>
              <p className="mt-4 rounded-xl bg-[#f8f7f3] p-4 text-sm leading-7"><strong>Η εκφώνηση:</strong> {trick.problem}</p>
              {scene && <Motion key={trick.scenarioId} scenario={scene}/>}
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-5 sm:p-7">
              <h3 className="flex items-center gap-2 text-xl font-semibold"><BrainCircuit size={21} className="text-[#287958]"/> Η πονηριά της άσκησης</h3>
              <p className="mt-3 text-sm leading-8">{trick.key}</p>
              <div className="mt-4 rounded-xl border border-[#ead2bd] bg-[#fff7ec] p-4">
                <p className="text-sm font-semibold text-[#92532d]">Γιατί ΔΕΝ αρκεί ένας άλλος νόμος;</p>
                <p className="mt-2 text-sm leading-7 text-[#72543c]">{trick.whyNot}</p>
              </div>
              <button type="button" onClick={()=>setShowForces(v=>!v)} aria-expanded={showForces}
                className="mt-4 flex min-h-11 w-full items-center justify-between rounded-xl bg-[#edf5ee] px-4 py-3 text-left text-sm font-semibold text-[#316349]">
                <span className="flex items-center gap-2"><Waypoints size={18}/>{trick.forceHeading}</span>
                <ChevronDown size={18} className={showForces?"rotate-180":""}/>
              </button>
              {showForces && <div className="mt-3 space-y-2">
                <ThinkingForceDiagram id={trick.scenarioId}/>
                {trick.forces.map((force,i)=>(
                  <div className="rounded-xl border border-[#e1e9de] bg-[#fafcf9] p-3 text-sm leading-7" key={i}>
                    <p className="font-semibold text-[#25704e]">{force.subject}</p>
                    {force.horizontal && <p><strong>Οριζόντια:</strong> {force.horizontal}</p>}
                    {force.vertical && <p><strong>Κατακόρυφα:</strong> {force.vertical}</p>}
                    {force.radial && <p><strong>Ακτινικά:</strong> {force.radial}</p>}
                  </div>
                ))}
              </div>}
              <button type="button" onClick={()=>setShowMap(v=>!v)} aria-expanded={showMap}
                className="mt-4 flex min-h-11 w-full items-center justify-between rounded-xl bg-[#e8f3ec] px-4 py-3 text-left text-sm font-semibold text-[#316349]">
                <span className="flex items-center gap-2"><GitBranch size={18}/> Ο γενικός χάρτης επίλυσης</span>
                <ChevronDown size={18} className={showMap?"rotate-180":""}/>
              </button>
              {showMap && <ol className="mt-3 space-y-2">
                {trick.logic.map((item,i)=><li className="flex items-start gap-3 rounded-xl bg-[#f5faf5] p-3 text-sm" key={i}><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#31805b] text-xs font-bold text-white">{i+1}</span><span>{item}</span></li>)}
              </ol>}
              <p className="mt-3 text-xs leading-6 text-[#887e70]"><strong>Προϋποθέσεις:</strong> {trick.condition}</p>
            </section>

            <section className="rounded-3xl border border-[#b5d3c0] bg-white p-4 sm:p-7">
              <h3 className="flex items-center gap-2 text-xl font-semibold"><Target size={21} className="text-[#267c57]"/> Τι άλλο θα μπορούσαν να ζητήσουν;</h3>
              <p className="mt-2 text-sm leading-7 text-[#625d52]">Τέσσερα εναλλακτικά ζητούμενα, με πραγματικές αριθμητικές λύσεις. Σε κάθε βήμα: <strong>τι κάνω, γιατί, τι βρίσκω και πού το χρησιμοποιώ.</strong></p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {trick.variations.map((v,i)=>(
                  <button type="button" key={v.id} onClick={()=>selectQuestion(i)} aria-pressed={i===question}
                    className={"min-h-28 rounded-2xl border p-3 text-left "+(i===question?"border-[#2b7a57] bg-[#e8f5ec]":"border-[#dedfd8] bg-[#faf9f6]")}>
                    <span className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#287b57]">
                      Ερώτημα {i+1} {studied[trick.scenarioId+":"+v.id]&&<CheckCircle2 size={15}/>}
                    </span>
                    <span className="mt-1 block text-sm font-semibold leading-6">{v.ask}</span>
                    <span className="mt-1 block text-[11px] text-[#7c7062]">{v.kind}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-[#f1f7f1] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#297754]">Η νέα αποστολή</p>
                <h4 className="mt-2 text-lg font-semibold leading-7">{q.ask}</h4>
                <p className="mt-1 font-mono font-semibold text-[#297452]">{q.symbol}</p>
                <p className="mt-2 text-sm text-[#74786c]">Σκέψου πριν αποκαλύψεις τη λύση.</p>
              </div>
              <div className="mt-4 space-y-3">
                {q.steps.slice(0,opened).map((s,i)=>(
                  <div className="overflow-hidden rounded-2xl border border-[#d7e4d8]" key={i}>
                    <div className="flex items-center gap-3 bg-[#e7f3e9] p-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#297a55] text-sm font-bold text-white">{i+1}</span>
                      <p className="font-semibold">{s.title}</p>
                    </div>
                    <div className="space-y-3 p-4 text-sm leading-7">
                      <p><strong>Τι σκέφτομαι;</strong> {s.question}</p>
                      <p><strong>Τι κάνω;</strong> {s.choice}</p>
                      <p><strong>Γιατί;</strong> {s.because}</p>
                      <div className="overflow-x-auto rounded-lg bg-[#f2f6f0] p-3 font-mono font-semibold text-[#345e45]">{s.formula}</div>
                      <p className="rounded-lg bg-[#eaf6eb] p-3 font-semibold text-[#236d49]">Βρίσκω: {s.result}</p>
                      <p className="rounded-lg bg-[#f7f4ea] p-3 text-[#6b614f]"><strong>Η γέφυρα:</strong> {s.bridge}</p>
                    </div>
                  </div>
                ))}
              </div>
              {!full ? <div className="mt-4 flex flex-wrap items-center gap-2">
                <button type="button" onClick={()=>setOpened(v=>Math.min(q.steps.length,v+1))}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#286b50] px-5 py-3 text-sm font-semibold text-white">
                  <Eye size={17}/> {opened===0?"Δες το πρώτο βήμα":"Επόμενο βήμα"} <ArrowRight size={16}/>
                </button>
                <button type="button" onClick={()=>setOpened(q.steps.length)}
                  className="min-h-11 rounded-xl border border-[#b3d0bd] bg-white px-4 py-3 text-sm font-semibold text-[#33644d]">Πλήρης λύση</button>
                <span className="text-xs text-[#7e786d]">{opened}/{q.steps.length} βήματα</span>
              </div> :
              <div className="mt-4 rounded-2xl border border-[#a3ccae] bg-[#e8f6eb] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#277553]">Τελικό αποτέλεσμα</p>
                <p className="mt-2 text-2xl font-bold text-[#226244]">{q.answer}</p>
                <p className="mt-2 text-sm leading-7"><strong>Τι θυμάμαι:</strong> {q.takeaway}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" disabled={!!studied[studyKey]} onClick={()=>setStudied(v=>({...v,[studyKey]:true}))}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#2b714f] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"><CheckCircle2 size={16}/>{studied[studyKey]?"Μελετήθηκε":"Το μελέτησα"}</button>
                  <button type="button" onClick={()=>setOpened(0)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#aed0b5] bg-white px-4 py-2 text-sm font-semibold text-[#2a6649]"><RotateCcw size={16}/> Ξανά χωρίς βοήθεια</button>
                </div>
              </div>}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
