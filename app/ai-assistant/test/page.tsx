"use client";

import { useMemo, useState } from "react";

type Locale = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";
type Result = {
  id:string;
  language:Locale;
  checkin:string;
  checkout:string;
  guests:number;
  status:"idle"|"running"|"pass"|"warning"|"error";
  durationMs?:number;
  answer?:string;
  offers?:any[];
  checks?:{label:string;ok:boolean;detail?:string}[];
  error?:string;
};

type Scenario = {id:string;label:string;checkin:string;checkout:string;guests:number};

const LANGUAGES:{code:Locale;label:string}[]=[
  {code:"el",label:"Ελληνικά"},{code:"en",label:"English"},{code:"de",label:"Deutsch"},
  {code:"fr",label:"Français"},{code:"it",label:"Italiano"},{code:"es",label:"Español"},{code:"tr",label:"Türkçe"}
];

const allowedByGuests:Record<number,string[]>={
  2:["1","2","3","4","5","6","7","8","9","10"],
  3:["1","3","4","5","7","8","9","10"],
  4:["1","8","9","10"],
  5:["10"]
};

function isoDate(offset:number){
  const d=new Date();d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10);
}

function defaultScenarios():Scenario[]{
  return [
    {id:"two-guests",label:"2 guests · all categories",checkin:isoDate(7),checkout:isoDate(10),guests:2},
    {id:"three-guests",label:"3 guests · capacity rules",checkin:isoDate(14),checkout:isoDate(17),guests:3},
    {id:"four-guests",label:"4 guests · apartments/room 1",checkin:isoDate(21),checkout:isoDate(24),guests:4},
    {id:"five-guests",label:"5 guests · room 10 only",checkin:isoDate(28),checkout:isoDate(30),guests:5},
    {id:"long-stay",label:"Long stay · 7 nights",checkin:isoDate(35),checkout:isoDate(42),guests:2},
  ];
}

function roomNumber(offer:any):string{
  const raw=String(offer?.roomId??offer?.unitId??offer?.roomNumber??"");
  const match=raw.match(/\d+/);return match?.[0]||raw;
}

function languageLooksRight(text:string,language:Locale){
  if(!text.trim())return true;
  const hints:Record<Locale,RegExp>={
    el:/[Α-Ωα-ω]/,tr:/[çğıöşüİ]/i,de:/\b(und|Zimmer|Sie|für|verfügbar)\b/i,
    fr:/\b(vous|chambre|disponible|pour|séjour)\b/i,it:/\b(camera|disponibile|per|soggiorno|puoi)\b/i,
    es:/\b(habitación|disponible|para|puedes|estancia)\b/i,en:/\b(room|available|for|you|stay)\b/i
  };
  return hints[language].test(text);
}

function analyze(payload:any,scenario:Scenario,language:Locale,durationMs:number){
  const offers=Array.isArray(payload?.offers)?payload.offers:[];
  const answer=typeof payload?.answer==="string"?payload.answer:"";
  const checks:{label:string;ok:boolean;detail?:string}[]=[];
  checks.push({label:"API response",ok:Boolean(payload),detail:payload?"JSON received":"No payload"});
  checks.push({label:"Response time under 8s",ok:durationMs<8000,detail:`${durationMs} ms`});
  checks.push({label:"Offers is an array",ok:Array.isArray(payload?.offers),detail:`${offers.length} offers`});
  checks.push({label:"Answer language",ok:languageLooksRight(answer,language),detail:answer?answer.slice(0,100):"No answer text"});

  const allowed=allowedByGuests[scenario.guests]||[];
  const invalid=offers.map(roomNumber).filter(Boolean).filter((room:string)=>!allowed.includes(room));
  checks.push({label:"Guest capacity rules",ok:invalid.length===0,detail:invalid.length?`Unexpected rooms: ${[...new Set(invalid)].join(", ")}`:"All rooms allowed"});

  const duplicateKeys=offers.map((o:any)=>`${roomNumber(o)}:${o?.unitId??""}`);
  const duplicates=duplicateKeys.filter((key:string,index:number)=>duplicateKeys.indexOf(key)!==index);
  checks.push({label:"No duplicate offers",ok:duplicates.length===0,detail:duplicates.length?`Duplicates: ${[...new Set(duplicates)].join(", ")}`:"No duplicates"});

  const badPrices=offers.filter((o:any)=>!Number.isFinite(Number(o?.directTotal))||Number(o?.directTotal)<=0);
  checks.push({label:"Valid direct prices",ok:badPrices.length===0,detail:badPrices.length?`${badPrices.length} invalid prices`:"All prices valid"});

  const badDiscount=offers.filter((o:any)=>Number(o?.originalTotal)>0&&Number(o?.directTotal)>Number(o?.originalTotal));
  checks.push({label:"Direct price not above original",ok:badDiscount.length===0,detail:badDiscount.length?`${badDiscount.length} inconsistent offers`:"Pricing logic consistent"});

  const outcome=offers.length?"availability":"no availability";
  checks.push({label:"Actionable outcome",ok:offers.length>0||answer.length>0,detail:outcome});
  return {offers,answer,checks};
}

export default function AiAssistantTestPage(){
  const [languages,setLanguages]=useState<Locale[]>(["el","en","tr"]);
  const [scenarios,setScenarios]=useState<Scenario[]>(defaultScenarios());
  const [results,setResults]=useState<Result[]>([]);
  const [running,setRunning]=useState(false);
  const [custom,setCustom]=useState({label:"Custom test",checkin:isoDate(7),checkout:isoDate(9),guests:2});

  const summary=useMemo(()=>({
    total:results.length,
    pass:results.filter(r=>r.status==="pass").length,
    warning:results.filter(r=>r.status==="warning").length,
    error:results.filter(r=>r.status==="error").length
  }),[results]);

  function toggleLanguage(code:Locale){setLanguages(v=>v.includes(code)?v.filter(x=>x!==code):[...v,code])}
  function addCustom(){setScenarios(v=>[...v,{id:`custom-${Date.now()}`,...custom,guests:Number(custom.guests)}])}

  async function runAll(){
    if(!languages.length||!scenarios.length)return;
    setRunning(true);setResults([]);
    for(const scenario of scenarios){
      for(const language of languages){
        const id=`${scenario.id}-${language}`;
        setResults(v=>[...v,{id,language,...scenario,status:"running"}]);
        const started=performance.now();
        try{
          const response=await fetch("/api/ai-assistant/smart",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
            messages:[{role:"user",content:`Check live availability from ${scenario.checkin} to ${scenario.checkout} for ${scenario.guests} guests.`}],
            search:{checkin:scenario.checkin,checkout:scenario.checkout,guests:scenario.guests},language
          })});
          const payload=await response.json().catch(()=>null);
          const durationMs=Math.round(performance.now()-started);
          if(!response.ok)throw new Error(payload?.error||`HTTP ${response.status}`);
          const analysis=analyze(payload,scenario,language,durationMs);
          const failed=analysis.checks.filter(c=>!c.ok).length;
          setResults(v=>v.map(r=>r.id===id?{...r,status:failed?"warning":"pass",durationMs,...analysis}:r));
        }catch(error){
          const durationMs=Math.round(performance.now()-started);
          setResults(v=>v.map(r=>r.id===id?{...r,status:"error",durationMs,error:error instanceof Error?error.message:"Unknown error"}:r));
        }
      }
    }
    setRunning(false);
  }

  return <main className="min-h-screen bg-stone-100 px-4 py-8 text-stone-900">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-stone-500">Internal QA tool</p><h1 className="mt-1 text-3xl font-black">AI Room Finder Logic Tester</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">Runs the real availability endpoint across dates, guest counts and languages. It checks capacity rules, prices, duplicates, response language and speed.</p></div>
        <a href="/ai-assistant/?lang=el" className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-bold">Open live assistant</a>
      </div>

      <section className="mt-6 grid gap-5 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-black">Languages</h2><div className="mt-3 flex flex-wrap gap-2">{LANGUAGES.map(l=><button key={l.code} onClick={()=>toggleLanguage(l.code)} className={`rounded-full border px-3 py-2 text-sm font-bold ${languages.includes(l.code)?"border-stone-900 bg-stone-900 text-white":"border-stone-300"}`}>{l.label}</button>)}</div></div>
          <div className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-black">Custom scenario</h2><div className="mt-3 grid gap-3"><input value={custom.label} onChange={e=>setCustom(v=>({...v,label:e.target.value}))} className="rounded-xl border border-stone-300 px-3 py-2"/><input type="date" value={custom.checkin} onChange={e=>setCustom(v=>({...v,checkin:e.target.value}))} className="rounded-xl border border-stone-300 px-3 py-2"/><input type="date" value={custom.checkout} onChange={e=>setCustom(v=>({...v,checkout:e.target.value}))} className="rounded-xl border border-stone-300 px-3 py-2"/><input type="number" min="1" max="5" value={custom.guests} onChange={e=>setCustom(v=>({...v,guests:Number(e.target.value)}))} className="rounded-xl border border-stone-300 px-3 py-2"/><button onClick={addCustom} className="rounded-xl border border-stone-900 px-4 py-3 font-bold">Add scenario</button></div></div>
          <button disabled={running||!languages.length} onClick={()=>void runAll()} className="w-full rounded-2xl bg-[#ff385c] px-5 py-4 text-lg font-black text-white shadow disabled:opacity-50">{running?"Running tests…":"Run all tests"}</button>
        </aside>

        <div>
          <div className="grid grid-cols-4 gap-2">{Object.entries(summary).map(([key,value])=><div key={key} className="rounded-2xl bg-white p-4 text-center shadow-sm"><div className="text-2xl font-black">{value}</div><div className="text-xs uppercase text-stone-500">{key}</div></div>)}</div>
          <div className="mt-5 space-y-3">{results.map(result=><details key={result.id} className="rounded-2xl bg-white p-4 shadow-sm" open={result.status==="warning"||result.status==="error"}><summary className="cursor-pointer list-none"><div className="flex flex-wrap items-center justify-between gap-3"><div><strong>{result.label}</strong><div className="mt-1 text-xs text-stone-500">{result.language.toUpperCase()} · {result.checkin} → {result.checkout} · {result.guests} guests</div></div><div className="flex items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-black ${result.status==="pass"?"bg-emerald-100 text-emerald-800":result.status==="warning"?"bg-amber-100 text-amber-800":result.status==="error"?"bg-red-100 text-red-800":"bg-stone-100"}`}>{result.status}</span>{result.durationMs?<span className="text-xs text-stone-500">{result.durationMs} ms</span>:null}</div></div></summary>
            {result.error?<p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{result.error}</p>:null}
            {result.checks?<div className="mt-4 grid gap-2 sm:grid-cols-2">{result.checks.map(check=><div key={check.label} className={`rounded-xl border p-3 text-sm ${check.ok?"border-emerald-200 bg-emerald-50":"border-amber-200 bg-amber-50"}`}><strong>{check.ok?"✓":"!"} {check.label}</strong>{check.detail?<div className="mt-1 text-xs text-stone-600">{check.detail}</div>:null}</div>)}</div>:null}
            {result.answer?<div className="mt-4 rounded-xl bg-stone-100 p-3 text-sm whitespace-pre-wrap"><strong>AI answer</strong><div className="mt-2">{result.answer}</div></div>:null}
            {result.offers?<div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-2">Room</th><th className="p-2">Unit</th><th className="p-2">Name</th><th className="p-2">Original</th><th className="p-2">Direct</th><th className="p-2">Saving</th></tr></thead><tbody>{result.offers.map((o:any,i:number)=><tr key={i} className="border-b border-stone-100"><td className="p-2">{roomNumber(o)}</td><td className="p-2">{String(o.unitId??"")}</td><td className="p-2">{String(o.name??"")}</td><td className="p-2">{String(o.originalTotal??"")}</td><td className="p-2 font-bold">{String(o.directTotal??"")}</td><td className="p-2">{String(o.saving??"")}</td></tr>)}</tbody></table></div>:null}
          </details>)}</div>
          {!results.length?<div className="mt-5 rounded-2xl border border-dashed border-stone-300 p-10 text-center text-stone-500">Choose languages and run the scenarios.</div>:null}
        </div>
      </section>
    </div>
  </main>;
}
