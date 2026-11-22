"use client";

import type { ReactNode } from "react";

function Arrow({ x1, y1, x2, y2, color, name, tx, ty }: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; name?: string; tx?: number; ty?: number;
}) {
  const dx = x2-x1, dy=y2-y1, l=Math.hypot(dx,dy) || 1;
  const hx=x2-dx/l*11,hy=y2-dy/l*11;
  return <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d={"M"+x1+" "+y1+"L"+x2+" "+y2} />
    <path d={"M"+(hx-dy/l*6)+" "+(hy+dx/l*6)+"L"+x2+" "+y2+"L"+(hx+dy/l*6)+" "+(hy-dx/l*6)} />
    {name && <text x={tx ?? x2} y={ty ?? y2-8} textAnchor="middle" fill={color} stroke="none" fontSize="13" fontWeight="700">{name}</text>}
  </g>;
}

const blue="#2876a0", green="#287b59", brown="#a16d3d", red="#b6533e";
const TEXT="#334c3c";
const label=(x:number,y:number,txt:string,small=false)=> <text x={x} y={y} fill={TEXT} fontSize={small?12:14} fontWeight="600">{txt}</text>;
const ball=(x:number,y:number,color=green,r=14)=> <circle cx={x} cy={y} r={r} fill={color} />;

export function ThinkingForceDiagram({ id }: { id: string }) {
  let illustration: ReactNode;
  let title = "";
  switch(id){
    case "two-pendulums":
      title = "Κάθε κρούση απαιτεί διαφορετικό σύστημα σωμάτων";
      illustration=<>
        <rect x="25" y="39" width="246" height="128" rx="12" stroke="#afcbbb" strokeWidth="2" strokeDasharray="6 5" fill="none" />
        <rect x="290" y="39" width="246" height="128" rx="12" stroke="#afcbbb" strokeWidth="2" strokeDasharray="6 5" fill="none" />
        {label(48,66,"1η: Βλήμα + ξύλο 1",true)}{label(316,66,"2η: Βλήμα + ξύλο 2",true)}
        {ball(72,113,blue,9)} <rect x="138" y="91" width="55" height="45" rx="6" fill={brown} />
        <Arrow x1={86} y1={113} x2={123} y2={113} color={blue} name="u₀" tx={103} ty={102}/>
        {label(143,156,"V₁",true)}
        {ball(336,113,blue,9)} <rect x="403" y="91" width="55" height="45" rx="6" fill={brown} />
        <Arrow x1={350} y1={113} x2={390} y2={113} color={blue} name="u" tx={368} ty={102}/>
        {label(407,156,"V₂",true)}
        <path d="M281 96v26" stroke="#779787" strokeWidth="2" strokeDasharray="3 5"/>
        {label(34,195,"ΑΔΟ₁: το βλήμα βγαίνει",true)}{label(304,195,"ΑΔΟ₂: το βλήμα κολλάει",true)}
      </>;
      break;
    case "plank":
      title="Η ίδια τριβή δρα με αντίθετη φορά στα δύο σώματα";
      illustration=<>
        <path d="M24 171H532" stroke="#9bbaa6" strokeWidth="4"/>
        <rect x="154" y="117" width="265" height="51" rx="10" fill="#ad7b4d"/>
        <rect x="260" y="81" width="61" height="34" rx="7" fill="#2678a0"/>
        {label(281,105,"m",false)}{label(255,149,"σανίδα M")}
        <Arrow x1={265} y1={76} x2={197} y2={76} color={red} name="T στον m" tx={205} ty={64}/>
        <Arrow x1={332} y1={148} x2={401} y2={148} color={red} name="T στη M" tx={407} ty={134}/>
        <Arrow x1={290} y1={82} x2={290} y2={33} color={green} name="N" tx={308} ty={42}/>
        <Arrow x1={311} y1={109} x2={311} y2={154} color={brown} name="mg" tx={337} ty={107}/>
        {label(32,43,"Σύστημα m+M:",true)}
        {label(32,61,"T και −T αλληλοαναιρούνται",true)}
        {label(32,204,"Η απώλεια ενέργειας εξαρτάται από σχετική ολίσθηση",true)}
      </>;
      break;
    case "oblique-bounce":
      title="Η οριζόντια ορμή δεν αλλάζει — η κατακόρυφη αντιστρέφεται";
      illustration=<>
        <path d="M36 172H526" stroke="#98b8a4" strokeWidth="6"/>
        {ball(270,126,blue,21)}
        <Arrow x1={270} y1={106} x2={270} y2={31} color={green} name="N" tx={286} ty={43}/>
        <Arrow x1={288} y1={137} x2={288} y2={172} color={brown} name="mg" tx={312} ty={151}/>
        <Arrow x1={199} y1={126} x2={125} y2={126} color={red} name="uᵧ πριν = −4" tx={117} ty={105}/>
        <Arrow x1={342} y1={126} x2={423} y2={126} color={blue} name="uₓ = 3" tx={437} ty={109}/>
        {label(27,34,"Προς τα πάνω: +y",true)}
        {label(328,49,"Δpᵧ > 0",true)}
        {label(25,204,"N − mg = Δpᵧ / Δt",false)}
      </>;
      break;
    case "rod-loop":
      title="Στην κορυφή η ράβδος μπορεί να πιέσει προς τα έξω";
      illustration=<>
        <path d="M155 80V151" stroke="#719989" strokeWidth="6"/>
        <circle cx="155" cy="153" r="7" fill="#526459"/>
        {ball(155,76,blue,20)}
        <Arrow x1={149} y1={58} x2={149} y2={16} color={green} name="R (προς τα έξω)" tx={89} ty={14}/>
        <Arrow x1={167} y1={89} x2={167} y2={139} color={brown} name="mg" tx={184} ty={134}/>
        <path d="M295 80V151" stroke="#a7b4ad" strokeWidth="3" strokeDasharray="5 5"/>
        <circle cx="295" cy="153" r="7" fill="#526459"/>
        {ball(295,76,blue,20)}
        <Arrow x1={305} y1={92} x2={305} y2={142} color={brown} name="mg" tx={324} ty={133}/>
        {label(52,193,"ΡΑΒΔΟΣ: μπορεί να σπρώξει",true)}
        {label(316,193,"ΝΗΜΑ: μόνο τραβά",true)}
        {label(368,50,"Οριακά T = 0",true)}
      </>;
      break;
    case "tension-angle":
      title="Στις 60° βάζω μόνο τη συνιστώσα του βάρους πάνω στο νήμα";
      illustration=<>
        <circle cx="228" cy="30" r="6" fill="#6b7b71"/>
        <path d="M228 30L336 103" stroke="#6c9983" strokeWidth="4"/>
        <path d="M228 68A40 40 0 0 1 262 51" stroke={brown} strokeWidth="2" fill="none"/>
        {label(261,45,"φ = 60°",true)}
        {ball(336,103,blue,20)}
        <Arrow x1={327} y1={97} x2={275} y2={61} color={green} name="T" tx={287} ty={73}/>
        <Arrow x1={338} y1={118} x2={338} y2={180} color={brown} name="mg" tx={361} ty={163}/>
        <Arrow x1={349} y1={117} x2={397} y2={148} color={red} name="mg·συνφ" tx={438} ty={147}/>
        <path d="M228 30v149" stroke="#9aa9a0" strokeDasharray="5 5"/>
        {label(29,46,"Ακτινικά προς το κέντρο:",true)}
        {label(28,68,"T − mg·συνφ = mv²/ℓ",false)}
        {label(28,196,"Η ακτινική ΣF ≠ μία νέα δύναμη",true)}
      </>;
      break;
    default:
      illustration=label(20,100,"Επίλεξε μια άσκηση από τα πέντε κόλπα.",false);
  }
  return (
    <figure className="overflow-hidden rounded-2xl border border-[#cddfd2] bg-[#f7faf7]">
      <figcaption className="px-4 pt-3 text-sm font-semibold text-[#315d49]">{title}</figcaption>
      <svg viewBox="0 0 560 218" xmlns="http://www.w3.org/2000/svg" className="block w-full"
        role="img" aria-label={"Διάγραμμα δυνάμεων και σωμάτων: "+title}>
        <rect width="560" height="218" fill="#f7faf7"/>
        {illustration}
      </svg>
      <p className="px-4 pb-3 text-xs leading-5 text-[#738475]">Σχηματική απεικόνιση — όχι υπό κλίμακα. Η φορά των βελών εξηγείται αναλυτικά παρακάτω.</p>
    </figure>
  );
}
