/**
 * Ormi2 advanced-thinking QA
 * Audits five hand-authored source-grounded lessons and 20 answer pathways.
 * Independently recomputes answers from the numeric facts in the original scenarios.
 */
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),ts=require("typescript");
const assert=require("node:assert/strict");
function read(f){return fs.readFileSync(path.join(__dirname,"..",f),"utf8");}
const src=read("components/mixalis/ormi2/thinking-tricks-data.ts");
const out=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const context={exports:{},Math,Number,Set,Intl};
vm.runInNewContext(out,context,{timeout:4000});
const tricks=context.exports.THINKING_TRICKS;
const trainer=read("components/mixalis/ormi2/Ormi2Trainer.tsx");
const view=read("components/mixalis/ormi2/Ormi2ThinkingTricks.tsx");
const route=read("app/mixalis/(private)/ormi2/kolpa/page.tsx");
const sources=[read("components/mixalis/ormi/OrmiPhaseQuiz.tsx"),read("components/mixalis/ormi/sintheta/extra-quiz.ts")];
const originals=sources.flatMap(text=>[...text.matchAll(/^\s+id: "([^"]+)",\s*\n\s+title: "([^"]+)"/gm)].map(m=>({id:m[1],title:m[2]})));
const originalMap=Object.fromEntries(originals.map(o=>[o.id,o.title]));

function near(actual,expected,name){
 assert(Number.isFinite(actual),name+" expected finite");
 assert(Math.abs(actual-expected)<=1e-9*Math.max(1,Math.abs(actual),Math.abs(expected)),name+" expected "+expected+" got "+actual);
}
const nums={
  "two-pendulums":{between:60,initial:100,loss1:312,loss2:162},
  plank:{common:2,heat:12,relative:4,board:4/3},
  "oblique-bounce":{"vy-before":-4,"vy-after":2,normal:26,energy:1.2},
  "rod-loop":{"bottom-speed":4,"bullet-min":40,string:10*Math.sqrt(20),"rod-force":10},
  "tension-angle":{"speed-60":Math.sqrt(3),"tension-60":20,"tension-bottom":50,"max-angle":0.25},
};
assert.equal(tricks.length,5,"exactly five featured hard cases");
assert.equal(new Set(tricks.map(t=>t.scenarioId)).size,5,"must be distinct cases");
let options=0,steps=0;
for (const t of tricks) {
 assert.equal(originalMap[t.scenarioId],t.title,"title must match original case "+t.scenarioId);
 assert(Number.isInteger(t.number)&&t.number>0&&t.number<=36);
 assert(t.memorable.length>15&&t.headline.length>15&&t.key.length>65&&t.whyNot.length>55,
  "missing critical teaching narrative "+t.scenarioId);
 assert(t.forces.length>=2&&t.logic.length>=3&&t.condition.length>35,
  "missing force analysis or solution dependency graph "+t.scenarioId);
 assert.equal(t.variations.length,4,"each featured case needs four alternate questions");
 for (const q of t.variations){
  options++;
  assert.equal(q.expected,nums[t.scenarioId][q.id],"unexpected numerical answer "+t.scenarioId+":"+q.id);
  near(q.expected,nums[t.scenarioId][q.id],t.scenarioId+":"+q.id);
  assert(q.ask.length>30&&q.symbol.length>0&&q.answer.length>1&&q.takeaway.length>45);
  assert(q.steps.length>=2,"each worked answer needs at least two complete bridges");
  for(const st of q.steps){
    steps++;
    for(const field of ["title","question","choice","because","formula","result","bridge"]){
      assert(st[field].length>(field==="result"?3:7),"missing narrative part "+field+" in "+t.scenarioId+":"+q.id);
    }
  }
 }
}
assert.equal(options,20);
assert(steps>=50,"expected at least fifty separately articulated reasoning steps");
assert(trainer.includes("Η αποστολή μας — Τι ψάχνουμε?")||trainer.includes("Η αποστολή μας — Τι ψάχνουμε;"),"every scenario must clearly declare objective");
assert(trainer.includes('{s.ask}')&&trainer.includes('/mixalis/ormi2/kolpa'),"highlight all objectives and link featured pathways");
assert(view.includes("Τι κάνω")||view.includes("Τι κάνω;")||view.includes("Τι κάνω;"),"display reasoning, not just formulas");
assert(view.includes("Γιατί;")&&view.includes("Βρίσκω:")&&view.includes("Η γέφυρα:"),
  "teacher must explain what / why / output / connection");
assert(view.includes("setOpened(q.steps.length)")&&view.includes('setOpened(v=>Math.min(q.steps.length,v+1))'),
  "support both progressive and full worked solutions");
assert(view.includes("ThinkingForceDiagram")&&view.includes("Motion")&&route.includes("Ormi2ThinkingTricks"),
 "the five tricks require physics diagrams, motion, and routed page");

// Independently check the five physics systems using the original numeric givens.
{
 const m=0.1,M1=1,M2=0.9,g=10,h1=0.8,h2=1.8;
 const V1=Math.sqrt(2*g*h1),V2=Math.sqrt(2*g*h2);
 const u=(m+M2)*V2/m,U=u+M1*V1/m;
 const Q1=m*U*U/2-(m*u*u/2+M1*V1*V1/2);
 const Q2=m*u*u/2-(m+M2)*V2*V2/2;
 near(U,nums["two-pendulums"].initial,"double impact initial");
 near(u,nums["two-pendulums"].between,"double impact intermediate");
 near(Q1,nums["two-pendulums"].loss1,"double impact Q1");
 near(Q2,nums["two-pendulums"].loss2,"double impact Q2");
}
{
 const m=1,M=2,g=10,h=1.8,mu=0.3;
 const u=Math.sqrt(2*g*h),V=m*u/(m+M);
 const Q=m*u*u/2-(m+M)*V*V/2,T=mu*m*g;
 const aM=T/M,am=-T/m,t=u/(aM-am);
 near(V,nums.plank.common,"plank common speed");
 near(Q,nums.plank.heat,"plank thermal loss");
 near(Q/T,nums.plank.relative,"plank relative displacement");
 near(aM*t*t/2,nums.plank.board,"plank ground displacement");
}
{
 const m=0.2,g=10,H=0.8,h=0.2,dt=0.05,vx=3;
 const down=-Math.sqrt(2*g*H),up=Math.sqrt(2*g*h);
 near(down,nums["oblique-bounce"]["vy-before"],"impact down");
 near(up,nums["oblique-bounce"]["vy-after"],"impact up");
 near(m*(up-down)/dt + m*g,nums["oblique-bounce"].normal,"impact normal");
 near(m*(down*down-up*up)/2,nums["oblique-bounce"].energy,"impact kinetic loss");
}
{
 const m=0.1,M=0.9,g=10,L=0.4;
 const V=Math.sqrt(4*g*L),U=(m+M)/m*V;
 const stringV=Math.sqrt(5*g*L),stringU=(m+M)/m*stringV;
 near(V,nums["rod-loop"]["bottom-speed"],"rod threshold");
 near(U,nums["rod-loop"]["bullet-min"],"rod bullet threshold");
 near(stringU,nums["rod-loop"].string,"string vs rod");
 near((m+M)*g,nums["rod-loop"]["rod-force"],"rod compression at top");
}
{
 const m=0.1,M=1.9,g=10,L=0.6,phiCos=0.5,U=60;
 const V=m*U/(m+M),v2=V*V-2*g*L*(1-phiCos);
 near(Math.sqrt(v2),nums["tension-angle"]["speed-60"],"velocity at angle");
 near((m+M)*(g*phiCos+v2/L),nums["tension-angle"]["tension-60"],"tension at angle");
 near((m+M)*(g+V*V/L),nums["tension-angle"]["tension-bottom"],"tension at bottom");
 near(1-V*V/(2*g*L),nums["tension-angle"]["max-angle"],"maximum angle cosine");
}
console.log("Ormi2 thinking QA passed: five real source-grounded cases, 20 fully worked alternatives, "+steps+" reasoning steps, and five independent physics consistency checks.");
