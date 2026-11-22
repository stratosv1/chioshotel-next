"use client";

import type { ReactNode } from "react";
import type { ChallengeFamily, ChallengeVariant } from "./challenges-data";

type Props = { family: ChallengeFamily; phase: number; variant: ChallengeVariant };

/**
 * Purpose-built physics storyboards; phase movement is deliberately schematic.
 * No decorative "physics" pretending to simulate forces numerically.
 */
const ink = "#264538";
const motion = "#237cb4";
const warm = "#be7942";
const ground = "#adbcaf";
const friction = "#ba563c";

function Arrow({ x, y, dx, dy = 0, color = motion, weight = 3 }: {
  x: number; y: number; dx: number; dy?: number; color?: string; weight?: number;
}) {
  const endX = x + dx, endY = y + dy;
  const length = Math.hypot(dx, dy) || 1;
  const perpX = -dy / length, perpY = dx / length;
  const headX = endX - dx / length * 10, headY = endY - dy / length * 10;
  return <g stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d={"M"+x+" "+y+"L"+endX+" "+endY} />
    <path d={"M"+(headX+perpX*6)+" "+(headY+perpY*6)+"L"+endX+" "+endY+"L"+(headX-perpX*6)+" "+(headY-perpY*6)} />
  </g>;
}

function Cart({ x, y, width = 52, color = warm, name, wheels = false }: {
  x: number; y: number; width?: number; color?: string; name: string; wheels?: boolean;
}) {
  return <g>
    <rect x={x} y={y} width={width} height={32} rx={6} fill={color} />
    {wheels && <>
      <circle cx={x+12} cy={y+36} r={5} fill="#495c52" />
      <circle cx={x+width-12} cy={y+36} r={5} fill="#495c52" />
    </>}
    <text x={x+width/2} y={y+21} textAnchor="middle" fontSize={12} fontWeight="700" fill="white">{name}</text>
  </g>;
}

function Chip({ x, y, children, color = ink }: {
  x: number; y: number; children: ReactNode; color?: string;
}) {
  return <text x={x} y={y} fill={color} fontSize={13} fontWeight="600">{children}</text>;
}

export function AdvancedMotionScene({ family, phase, variant }: Props) {
  const id = family.id;
  const p = variant.p;
  const at = Math.max(0, Math.min(phase, family.phases.length - 1));
  const rough = (p.mu ?? 0) > 0;
  return (
    <svg viewBox="0 0 600 245" className="block w-full" role="img"
      aria-label={"Σχηματική απεικόνιση: "+family.phases[at]} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="594" height="239" rx={17} fill="#f3f9f6"/>
      <text x="22" y="25" fontSize={13} fontWeight="700" fill="#276b52">{at+1}/{family.phases.length} · {family.phases[at]}</text>

      {id === "collision-rough-ramp" && <>
        <path d="M22 199 H234 L532 70" stroke={ground} strokeWidth={9} fill="none" strokeLinejoin="round"/>
        <path d="M234 199L532 70L532 199Z" fill="#dbe9de" opacity={0.65}/>
        {at === 0 ? <>
          <Cart x={112} y={160} name="m"/>
          <Cart x={205} y={160} name="M" color="#4f8f7b"/>
          <Arrow x={170} y={174} dx={28}/>
          <Chip x={42} y={95}>Κρούση στο χαμηλό σημείο</Chip>
        </> : <>
          <g style={{transform:"translate("+(at>0?85:0)+"px,-38px)",transition:"transform 450ms ease"}}>
            <Cart x={258} y={154} width={78} name="m+M"/>
          </g>
          <Arrow x={367} y={148} dx={65} dy={-28}/>
          {rough ? <>
            <Arrow x={390} y={132} dx={-46} dy={20} color={friction}/>
            <Chip x={397} y={168} color={friction}>Τριβή προς τα κάτω</Chip>
            <Chip x={25} y={82}>ΘΜΚΕ με έργο τριβής</Chip>
          </> : <>
            <Chip x={25} y={82}>Λεία ράμπα: ΑΔΜΕ</Chip>
            <Chip x={25} y={105}>Δεν υπάρχει τριβή</Chip>
          </>}
        </>}
        <Chip x={505} y={215}>θ</Chip>
      </>}

      {id === "double-collision-spring" && <>
        <path d="M25 192H578" stroke={ground} strokeWidth={5} />
        <rect x={559} y={90} width={9} height={103} rx={3} fill="#829b8b"/>
        <path d="M559 163l-14-9-12 18-12-18-12 18-12-18-10 9" fill="none" stroke="#c99646" strokeWidth={4} />
        {at === 0 ? <>
          <Cart x={65} y={154} name="m₁" wheels/>
          <Cart x={176} y={154} name="m₂" color="#4d907f" wheels/>
          <Cart x={368} y={154} name="m₃" color="#286f9b" wheels/>
          <Arrow x={126} y={149} dx={38}/>
          <Chip x={82} y={91}>Πρώτη πλαστική κρούση</Chip>
        </> : at === 1 ? <>
          <Cart x={211} y={154} width={82} name="m₁+m₂" wheels/>
          <Cart x={372} y={154} name="m₃" color="#286f9b" wheels/>
          <Arrow x={297} y={148} dx={58}/>
          <Chip x={66} y={84}>Δεύτερη κρούση: ελαστική</Chip>
        </> : <>
          <Cart x={202} y={154} width={82} name="m₁+m₂" wheels/>
          <Cart x={461} y={154} name="m₃" color="#286f9b" wheels/>
          <Arrow x={217} y={135} dx={p.m3 > p.m1+p.m2 ? -50 : 52}/>
          <Chip x={40} y={89}>{p.m3 > p.m1+p.m2 ? "Το συσσωμάτωμα ανακρούεται" : "Το συσσωμάτωμα συνεχίζει δεξιά"}</Chip>
          <Chip x={348} y={115}>Συμπίεση ελατηρίου</Chip>
        </>}
      </>}

      {id === "penetration-capture" && <>
        <path d="M20 193H576" stroke={ground} strokeWidth={5} />
        <circle cx={230} cy={55} r={5} fill="#5d7067"/>
        <path d={at === 1 ? "M230 55L299 135" : "M230 55L230 157"} stroke="#66756a" strokeWidth={3}/>
        {at === 1 ? <Cart x={285} y={131} name="M₁"/> : <Cart x={213} y={157} name="M₁"/>}
        {at <= 2 && <circle cx={at===0?86:at===1?314:426} cy={at===1?146:169} r={8} fill={motion}/>}
        {at === 0 ? <>
          <Arrow x={100} y={171} dx={80}/>
          <Cart x={461} y={157} name="M₂" color="#4c8e7b"/>
          <Chip x={25} y={99}>Βλήμα διαπερνά το ξύλο</Chip>
        </> : at === 1 ? <>
          <Cart x={461} y={157} name="M₂" color="#4c8e7b"/>
          <Arrow x={313} y={123} dx={34} dy={-18}/>
          <Chip x={20} y={100}>Άνοδος πρώτου ξύλου</Chip>
        </> : at === 2 ? <>
          <Cart x={461} y={157} name="M₂" color="#4c8e7b"/>
          <Arrow x={425} y={148} dx={30}/>
          <Chip x={25} y={94}>Δεύτερη κρούση: κόλλημα</Chip>
        </> : <>
          <Cart x={470} y={157} width={86} name="m+M₂" color="#4c8e7b"/>
          <Arrow x={487} y={215} dx={-58} color={friction}/>
          <Chip x={22} y={96}>Ολίσθηση έως ακινητοποίηση</Chip>
          <Chip x={401} y={231} color={friction}>Τριβή</Chip>
        </>}
      </>}

      {id === "collision-pendulum-tension" && <>
        <circle cx={289} cy={49} r={6} fill="#68756b" />
        <path d={at===2 ? "M289 49L381 134" : "M289 49L289 182"} stroke="#6b796f" strokeWidth={3}/>
        {at===2 ? <Cart x={366} y={128} name="m+M" width={62}/> :
          <Cart x={257} y={153} name="m+M" width={64}/>}
        {at===0 ? <>
          <circle cx={100} cy={168} r={8} fill={motion}/>
          <Arrow x={119} y={168} dx={92}/>
          <Chip x={28} y={98}>Πλαστική κρούση στον πυθμένα</Chip>
        </> : at===1 ? <>
          <Arrow x={340} y={161} dx={0} dy={-87} color={motion}/>
          <Arrow x={356} y={163} dx={0} dy={58} color={friction}/>
          <Chip x={351} y={79}>T</Chip>
          <Chip x={364} y={223} color={friction}>Βάρος</Chip>
          <Chip x={28} y={97}>T−mg=mv²/L (ακτινικά)</Chip>
        </> : <>
          <path d="M289 182A133 133 0 0 0 385 140" fill="none" stroke="#9dc3b0" strokeWidth={2} strokeDasharray="5 5"/>
          <Chip x={36} y={98}>Η κινητική γίνεται δυναμική</Chip>
          <Chip x={420} y={109}>Ύψος h</Chip>
        </>}
      </>}

      {id === "wall-rebound-catch" && <>
        <path d="M39 186H576" stroke={ground} strokeWidth={5}/>
        <rect x={38} y={93} width={12} height={93} rx={3} fill="#83988a"/>
        <Chip x={22} y={67}>Τοίχος</Chip>
        {at===0 ? <>
          <Cart x={144} y={148} name="m₁" wheels/>
          <Cart x={311} y={148} name="m₂" color="#4d8d7d" wheels/>
          <Arrow x={201} y={144} dx={92}/>
          <Chip x={212} y={93}>Ελαστική κρούση</Chip>
        </> : at===1 ? <>
          <Cart x={89} y={148} name="m₁" wheels/>
          <Cart x={377} y={148} name="m₂" color="#4d8d7d" wheels/>
          <Arrow x={148} y={141} dx={80}/>
          <Arrow x={433} y={141} dx={56}/>
          <Chip x={159} y={93}>Αντιστροφή φοράς του m₁</Chip>
        </> : at===2 ? <>
          <Cart x={340} y={148} name="m₁" wheels/>
          <Cart x={397} y={148} name="m₂" color="#4d8d7d" wheels/>
          <Arrow x={334} y={129} dx={78}/>
          <Chip x={186} y={88}>Πλαστική δεύτερη κρούση</Chip>
        </> : <>
          <Cart x={389} y={148} name="m₁+m₂" width={100} wheels/>
          <Arrow x={420} y={210} dx={-67} color={friction}/>
          <Chip x={157} y={87}>Τριβή και ακινητοποίηση</Chip>
          <Chip x={350} y={231} color={friction}>T</Chip>
        </>}
      </>}
      <text x={300} y={241} textAnchor="middle" fontSize={10} fill="#698071">
        Τα σχήματα δείχνουν φάσεις και κατευθύνσεις, όχι ακριβή κλίμακα ή χρονική διάρκεια
      </text>
    </svg>
  );
}
