"use client";

import { Ball, Box, Bullet, Burst, C, Cart, Ground, Heat, StickPerson, T, Vec, Wall, bump, clamp, lerp, seg } from "../kit";
import { Ask, type Story } from "./story";

/* ───────── helpers ───────── */

/** Uniform deceleration to a stop: position fraction for time fraction k. */
export const decel = (k: number) => 1 - (1 - k) * (1 - k);
/** Point of a pendulum bob. θ = 0 hangs straight down, θ > 0 to the right. */
export const pend = (px: number, py: number, L: number, th: number) => ({ x: px + L * Math.sin(th), y: py + L * Math.cos(th) });

export function Pivot({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 26} y={y - 6} width={52} height={6} fill={C.edge} opacity={0.5} />
      <circle cx={x} cy={y} r={2.5} fill={C.edge} />
    </g>
  );
}

export function Hbar({ x1, x2, y, s, color = C.p }: { x1: number; x2: number; y: number; s: string; color?: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={1.5} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke={color} strokeWidth={1.5} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke={color} strokeWidth={1.5} />
      <T x={(x1 + x2) / 2} y={y + 13} s={s} size={10} color={color} />
    </g>
  );
}

export function Vbar({ x, y1, y2, s, color = C.p, side = "right" }: { x: number; y1: number; y2: number; s: string; color?: string; side?: "left" | "right" }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={1.5} strokeDasharray="3 3" />
      <T x={x + (side === "right" ? 5 : -5)} y={(y1 + y2) / 2 + 4} s={s} size={10} color={color} anchor={side === "right" ? "start" : "end"} />
    </g>
  );
}

/* ───────── 1. Βλήμα σε ξύλο που γλιστράει ───────── */
const s1: Story = {
  n: 1,
  title: "Βλήμα σε ξύλο που γλιστράει",
  what: "Βλήμα σφηνώνεται σε ξύλο πάνω σε τραχύ δάπεδο. Το συσσωμάτωμα γλιστράει και σταματά.",
  given: "m = 20 g, M = 1,98 kg, μ = 0,2, γλιστράει s = 4 m, g = 10 m/s².",
  ask: "Την ταχύτητα υ₀ του βλήματος και τη θερμότητα Q της κρούσης.",
  playSay:
    "Δες όλο το φαινόμενο και ρώτα: πού αλλάζει κάτι; Τη στιγμή που το βλήμα σφηνώνεται αλλάζει το σύστημα (πριν ένα σώμα, μετά δύο μαζί) και αρχίζει η τριβή. Εκεί κόβουμε: 2 φάσεις.",
  askSay:
    "Ζητούν υ₀ και Q, που αφορούν την κρούση. Όμως για την κρούση δεν μας δίνουν τίποτα· μας δίνουν το ΤΕΛΟΣ: «γλίστρησε 4 m». Όταν δίνουν το τέλος, η άσκηση λύνεται ανάποδα.",
  phases: [
    {
      name: "Κρούση",
      tool: "ΑΔΟ + Q",
      range: [0.12, 0.4],
      say: "Η κρούση κρατά ελάχιστα, η τριβή δεν προλαβαίνει να αλλάξει την ορμή. Γι' αυτό: ΑΔΟ για βλήμα + ξύλο, m·υ₀ = (m+M)·V. Ζητούν θερμότητα, άρα και Q = K_πριν − K_μετά. Εδώ όμως έχω ΔΥΟ αγνώστους (υ₀ και V): μόνη της αυτή η φάση δεν λύνεται.",
    },
    {
      name: "Ολίσθηση",
      tool: "ΘΜΚΕ",
      range: [0.3, 1],
      say: "Τώρα δρα τριβή και μου δίνουν ΑΠΟΣΤΑΣΗ. Τριβή + απόσταση ⇒ ΘΜΚΕ: 0 − ½(m+M)V² = −μ(m+M)g·s. Η μάζα φεύγει και μένει μόνο ένας άγνωστος, η V. Άρα αυτή η φάση λύνεται πρώτη: V = √(2μgs) = 4 m/s.",
    },
  ],
  order: [1, 0],
  orderSay:
    "Ξεκινώ από τη Φάση 2 (έχει έναν άγνωστο) και βρίσκω V = 4 m/s. Η V είναι η «γέφυρα»: τη μεταφέρω στη Φάση 1 και η ΑΔΟ δίνει υ₀ = 400 m/s, μετά το Q. Κανόνας: ξεκινάς από τη φάση με ΕΝΑΝ άγνωστο.",
  solve: (
    <>
      ΘΜΚΕ: V = √(2·0,2·10·4) = <b>4 m/s</b>. ΑΔΟ: 0,02·υ₀ = 2·4 ⇒ <b>υ₀ = 400 m/s</b>. Q = ½·0,02·400² − ½·2·4² = 1600 − 16 = <b>1584 J</b>.
    </>
  ),
  trap: "Μη γράψεις ΑΔΟ για όλη την κίνηση: μετά την κρούση η τριβή αλλάζει την ορμή.",
  draw: (tau, ctx) => {
    const gy = 170;
    const hit = 0.25;
    const k = seg(tau, hit, 1);
    const cx = tau < hit ? 120 : 120 + 170 * decel(k);
    const moving = tau > hit && k < 0.98;
    return (
      <g>
        <Ground y={gy} rough />
        <Box cx={cx} y={gy} w={34} h={26} fill={C.wood} label="M" />
        {tau < hit ? (
          <g>
            <Bullet x={lerp(20, 103, tau / hit)} y={gy - 13} />
            <Vec x={lerp(20, 103, tau / hit) - 40} y={gy - 26} dx={30} label="υ₀" />
          </g>
        ) : null}
        <Heat cx={120} cy={gy - 30} k={bump(tau, hit, hit + 0.18)} />
        {moving ? (
          <g>
            <Vec x={cx + 18} y={gy - 18} dx={40 * (1 - k)} label="V" />
            <Vec x={cx - 17} y={gy - 4} dx={-24} color={C.F} label="T" labelSide="below" />
          </g>
        ) : null}
        {tau > 0.97 || ctx.phase === 1 ? <Hbar x1={120} x2={290} y={gy + 22} s="s = 4 m" /> : null}
        {ctx.mode === "ask" ? (
          <g>
            <Ask x={60} y={120} s="υ₀ = ?" />
            <Ask x={150} y={95} s="Q = ?" />
          </g>
        ) : null}
      </g>
    );
  },
};

/* ───────── 2. Βαλλιστικό εκκρεμές ───────── */
const s2: Story = {
  n: 2,
  title: "Βαλλιστικό εκκρεμές",
  what: "Βλήμα σφηνώνεται σε κύβο που κρέμεται από νήμα. Το συσσωμάτωμα ανεβαίνει σε ύψος h.",
  given: "m = 50 g, M = 1,95 kg, ανεβαίνει h = 0,45 m, g = 10 m/s².",
  ask: "Την υ₀ του βλήματος και το ποσοστό της κινητικής που χάθηκε στην κρούση.",
  playSay:
    "Δύο πράγματα συμβαίνουν: πρώτα το σφήνωμα (στιγμιαίο), μετά η άνοδος (κρατά χρόνο, δρα το βάρος). Κόβουμε ανάμεσά τους: 2 φάσεις.",
  askSay: "Ζητούν υ₀ και Π% (αφορούν την κρούση). Μας δίνουν όμως το ύψος h, δηλαδή το ΤΕΛΟΣ της ανόδου. Ξανά ανάποδη άσκηση.",
  phases: [
    {
      name: "Κρούση",
      tool: "ΑΔΟ + Π%",
      range: [0.1, 0.38],
      say: "Στιγμιαία κρούση ⇒ ΑΔΟ: m·υ₀ = (m+M)·V. Για το ποσοστό: Π% = (K_πριν − K_μετά)/K_πριν. Δύο άγνωστοι (υ₀, V), οπότε περιμένει.",
    },
    {
      name: "Άνοδος",
      tool: "ΑΔΜΕ",
      range: [0.3, 1],
      say: "Δεν υπάρχει τριβή, δίνεται ύψος ⇒ ΑΔΜΕ: ½(m+M)V² = (m+M)g·h. Ένας άγνωστος: V = √(2gh) = 3 m/s. ΠΡΟΣΟΧΗ: ΑΔΜΕ μόνο από ΜΕΤΑ την κρούση, όχι από το βλήμα, γιατί στην κρούση χάνεται ενέργεια.",
    },
  ],
  order: [1, 0],
  orderSay: "Πρώτα η άνοδος (ΑΔΜΕ) δίνει V = 3 m/s. Μετά η ΑΔΟ δίνει υ₀ = 120 m/s και το Π%.",
  solve: (
    <>
      ΑΔΜΕ: V = √(2·10·0,45) = <b>3 m/s</b>. ΑΔΟ: 0,05·υ₀ = 2·3 ⇒ <b>υ₀ = 120 m/s</b>. K_πριν = 360 J, K_μετά = 9 J ⇒ <b>Π% = 97,5%</b>.
    </>
  ),
  trap: "Το λάθος ½mυ₀² = (m+M)gh δίνει λάθος αποτέλεσμα: αγνοεί την ενέργεια που χάθηκε στην κρούση.",
  draw: (tau, ctx) => {
    const P = { x: 210, y: 30 };
    const L = 116;
    const hit = 0.3;
    const th = tau < hit ? 0 : 0.78 * decel(seg(tau, hit, 1));
    const b = pend(P.x, P.y, L, th);
    const rest = pend(P.x, P.y, L, 0);
    return (
      <g>
        <Pivot x={P.x} y={P.y} />
        <line x1={P.x} y1={P.y} x2={b.x} y2={b.y - 12} stroke={C.edge} strokeWidth={1.4} />
        <Box cx={b.x} y={b.y + 12} w={30} h={24} fill={C.wood} label="M" />
        {tau < hit ? <Bullet x={lerp(20, 192, tau / hit)} y={rest.y} /> : null}
        <Heat cx={rest.x} cy={rest.y - 20} k={bump(tau, hit, hit + 0.15)} />
        {tau > hit && tau < hit + 0.2 ? <Vec x={b.x + 16} y={b.y} dx={34} label="V" /> : null}
        {tau > 0.95 ? (
          <g>
            <line x1={150} y1={rest.y} x2={300} y2={rest.y} stroke={C.faint} strokeDasharray="3 3" />
            <line x1={150} y1={b.y} x2={300} y2={b.y} stroke={C.faint} strokeDasharray="3 3" />
            <Vbar x={300} y1={b.y} y2={rest.y} s="h" />
          </g>
        ) : null}
        {ctx.mode === "ask" ? (
          <g>
            <Ask x={70} y={rest.y - 18} s="υ₀ = ?" />
            <Ask x={90} y={70} s="Π% = ?" />
          </g>
        ) : null}
      </g>
    );
  },
};

/* ───────── 3. Εκκρεμές που χτυπά άλλη σφαίρα ───────── */
const s3: Story = {
  n: 3,
  title: "Εκκρεμές που χτυπά άλλη σφαίρα",
  what: "Σφαίρα σε νήμα αφήνεται από οριζόντια θέση, χτυπά πλαστικά άλλη σφαίρα στο κατώτατο σημείο και συνεχίζουν μαζί κυκλικά.",
  given: "m = 1 kg, ℓ = 0,8 m, M = 3 kg ακίνητη στο κατώτατο σημείο, g = 10 m/s².",
  ask: "Την ταχύτητα πριν την κρούση, την κοινή ταχύτητα και την τάση του νήματος αμέσως μετά.",
  playSay:
    "Τρεις αλλαγές: κατεβαίνει (δρα βάρος), συγκρούεται (στιγμιαίο), και «αμέσως μετά» μας ρωτούν για το νήμα. Το «αμέσως μετά» είναι ΣΤΙΓΜΗ, όχι κίνηση. 3 φάσεις.",
  askSay: "Ζητούν τρία πράγματα, ένα για κάθε φάση: υ₁ (κάθοδος), V (κρούση), T (αμέσως μετά). Τα δεδομένα είναι στην αρχή, άρα λύνουμε με τη σειρά.",
  phases: [
    {
      name: "Κάθοδος",
      tool: "ΑΔΜΕ",
      range: [0, 0.39],
      say: "Πέφτει ύψος ℓ, χωρίς τριβές, η τάση δεν παράγει έργο ⇒ ΑΔΜΕ: m·g·ℓ = ½m·υ₁². Ένας άγνωστος: υ₁ = √(2gℓ) = 4 m/s.",
    },
    {
      name: "Κρούση",
      tool: "ΑΔΟ",
      range: [0.32, 0.47],
      say: "Στιγμιαία πλαστική κρούση ⇒ ΑΔΟ: m·υ₁ = (m+M)·V. Ξέρω την υ₁ από πριν: V = 4/4 = 1 m/s.",
    },
    {
      name: "Αμέσως μετά",
      tool: "Κεντρομόλος",
      range: [0.4, 0.5],
      say: "Είναι ακόμα στο κατώτατο σημείο αλλά ήδη κάνει κυκλική κίνηση: η συνισταμένη προς το κέντρο είναι κεντρομόλος. T − (m+M)g = (m+M)V²/ℓ ⇒ T = 40 + 5 = 45 N.",
    },
  ],
  order: [0, 1, 2],
  orderSay: "Εδώ η σειρά είναι η «κανονική»: Φάση 1 → υ₁, Φάση 2 → V, Φάση 3 → T. Κάθε φάση δίνει τη γέφυρα για την επόμενη.",
  solve: (
    <>
      υ₁ = √(2·10·0,8) = <b>4 m/s</b>. 1·4 = 4·V ⇒ <b>V = 1 m/s</b>. T = 4·10 + 4·1²/0,8 = <b>45 N</b>.
    </>
  ),
  trap: "«Αμέσως μετά» δεν είναι ισορροπία: T ≠ (m+M)g. Πρόσθεσε την κεντρομόλο.",
  draw: (tau, ctx) => {
    const P = { x: 180, y: 26 };
    const L = 112;
    const hit = 0.4;
    const k1 = seg(tau, 0, hit);
    const th1 = (-Math.PI / 2) * Math.cos((k1 * Math.PI) / 2);
    const thC = tau < hit ? 0 : 0.6 * decel(seg(tau, hit, 1));
    const b2 = pend(P.x, P.y, L, thC);
    const b1 = tau < hit ? pend(P.x - 20, P.y, L, th1) : { x: b2.x - 20 * Math.cos(thC), y: b2.y + 20 * Math.sin(thC) };
    const right = tau > hit - 0.001;
    return (
      <g>
        <Pivot x={P.x} y={P.y} />
        <line x1={P.x - (right ? 0 : 20)} y1={P.y} x2={b1.x} y2={b1.y} stroke={C.edge} strokeWidth={1.2} />
        <line x1={P.x} y1={P.y} x2={b2.x} y2={b2.y} stroke={C.edge} strokeWidth={1.2} />
        <Ball cx={b1.x} cy={b1.y} r={9} label="m" />
        <Ball cx={b2.x} cy={b2.y} r={11} fill={C.b2} label="M" />
        {tau > 0.3 && tau < hit ? <Vec x={b1.x + 8} y={b1.y + 14} dx={30} label="υ₁" /> : null}
        {(ctx.phase === 2 || (tau >= hit && tau < hit + 0.12)) ? (
          <g>
            <Vec x={b2.x} y={b2.y - 12} dx={0} dy={-44} color={C.F} label="T" labelSide="right" />
            <Vec x={b2.x + 4} y={b2.y + 12} dx={0} dy={22} color={C.F} label="(m+M)g" labelSide="right" />
            <Vec x={b2.x + 14} y={b2.y} dx={22} label="V" labelSide="above" />
          </g>
        ) : null}
        {ctx.mode === "ask" ? (
          <g>
            <Ask x={90} y={110} s="υ₁ = ?" />
            <Ask x={250} y={120} s="V = ?" />
            <Ask x={250} y={80} s="T = ?" />
          </g>
        ) : null}
      </g>
    );
  },
};

/* ───────── 4. Πλαστελίνη στην άκρη τραπεζιού ───────── */
const s4: Story = {
  n: 4,
  title: "Πλαστελίνη στην άκρη τραπεζιού",
  what: "Πλαστελίνη κολλάει σε κύβο στην άκρη ενός τραπεζιού και το συσσωμάτωμα πέφτει στο πάτωμα.",
  given: "m = 10 g, M = 30 g, ύψος τραπεζιού H = 0,8 m, πέφτει S = 0,8 m πιο πέρα, g = 10 m/s².",
  ask: "Την ταχύτητα υ της πλαστελίνης πριν την κρούση.",
  playSay: "Πρώτα η κρούση (κολλάνε), μετά φεύγει από την άκρη και πέφτει. Από τη στιγμή που φεύγει δρα μόνο το βάρος: οριζόντια βολή. 2 φάσεις.",
  askSay: "Ζητούν την υ πριν την κρούση. Δίνουν πού έπεσε (το ΤΕΛΟΣ) και το ύψος. Ανάποδη άσκηση: θα ξεκινήσουμε από τη βολή.",
  phases: [
    {
      name: "Κρούση",
      tool: "ΑΔΟ",
      range: [0.08, 0.36],
      say: "Πλαστική κρούση ⇒ ΑΔΟ: m·υ = (m+M)·V. Δύο άγνωστοι (υ, V): χρειάζομαι πρώτα τη V από αλλού.",
    },
    {
      name: "Πτώση",
      tool: "Οριζόντια βολή",
      range: [0.36, 1],
      say: "Φεύγει ΟΡΙΖΟΝΤΙΑ από ύψος ⇒ οριζόντια βολή. Ο χρόνος βγαίνει ΜΟΝΟ από το ύψος: t = √(2H/g) = 0,4 s. Οριζόντια κινείται ομαλά: S = V·t ⇒ V = 0,8/0,4 = 2 m/s.",
    },
  ],
  order: [1, 0],
  orderSay: "Πρώτα η βολή: t = 0,4 s, V = 2 m/s. Μετά η ΑΔΟ: υ = (m+M)V/m = 8 m/s.",
  solve: (
    <>
      t = √(2·0,8/10) = 0,4 s, V = 0,8/0,4 = <b>2 m/s</b>. ΑΔΟ: 0,01·υ = 0,04·2 ⇒ <b>υ = 8 m/s</b>.
    </>
  ),
  trap: "Ο χρόνος πτώσης δεν εξαρτάται από τη V, μόνο από το ύψος.",
  draw: (tau, ctx) => {
    const top = 96;
    const floor = 186;
    const hit = 0.28;
    const edge = 0.36;
    const k = seg(tau, edge, 1);
    let cx: number;
    let by: number;
    if (tau < hit) {
      cx = 160;
      by = top;
    } else if (tau < edge) {
      cx = lerp(160, 168, seg(tau, hit, edge));
      by = top;
    } else {
      cx = 168 + 80 * k;
      by = top + (floor - top) * k * k;
    }
    const path = Array.from({ length: 21 }, (_, i) => {
      const u = i / 20;
      return `${i ? "L" : "M"}${168 + 80 * u},${top - 9 + (floor - top) * u * u}`;
    }).join(" ");
    return (
      <g>
        <rect x={20} y={top} width={156} height={7} fill={C.wood} stroke={C.edge} />
        <line x1={32} y1={top + 7} x2={32} y2={floor} stroke={C.edge} strokeWidth={3} />
        <line x1={164} y1={top + 7} x2={164} y2={floor} stroke={C.edge} strokeWidth={3} />
        <Ground y={floor} />
        <path d={path} fill="none" stroke={C.faint} strokeDasharray="3 4" />
        <Box cx={cx} y={by} w={18} h={18} fill={C.b2} />
        {tau < hit ? <Ball cx={lerp(40, 146, tau / hit)} cy={top - 6} r={5} fill="#c06c84" /> : null}
        {tau < hit ? <Vec x={lerp(40, 146, tau / hit) - 34} y={top - 20} dx={24} label="υ" /> : null}
        {tau > edge && k < 0.98 ? (
          <g>
            <Vec x={cx + 10} y={by - 9} dx={24} label="V" />
            <Vec x={cx} y={by + 2} dx={0} dy={20 * k + 2} color={C.F} label="mg" labelSide="right" />
          </g>
        ) : null}
        {tau > 0.97 || ctx.phase === 1 ? (
          <g>
            <Hbar x1={168} x2={248} y={floor + 10} s="S = 0,8 m" />
            <Vbar x={300} y1={top} y2={floor} s="H = 0,8 m" />
          </g>
        ) : null}
        {ctx.mode === "ask" ? <Ask x={80} y={60} s="υ = ?" /> : null}
      </g>
    );
  },
};

/* ───────── 5. Μπάλα που αναπηδά ───────── */
const s5: Story = {
  n: 5,
  title: "Μπάλα που αναπηδά",
  what: "Μπάλα πέφτει, χτυπά στο έδαφος και ανεβαίνει σε μικρότερο ύψος.",
  given: "m = 0,2 kg, h₁ = 1,8 m, h₂ = 0,8 m, επαφή Δt = 0,05 s, g = 10 m/s².",
  ask: "Τη μέση δύναμη N που ασκεί το έδαφος στη μπάλα.",
  playSay: "Τρεις φάσεις: πτώση (βάρος), επαφή με το έδαφος (πολύ μεγάλη δύναμη για λίγο χρόνο), άνοδος (βάρος).",
  askSay: "Ζητούν δύναμη ΜΕΣΑ στην επαφή, για ΕΝΑ σώμα (τη μπάλα). Για να τη βρω θέλω την ταχύτητα πριν και μετά την επαφή, που βγαίνουν από τις άλλες δύο φάσεις.",
  phases: [
    {
      name: "Πτώση",
      tool: "ΑΔΜΕ",
      range: [0, 0.39],
      say: "Ελεύθερη πτώση από ύψος ⇒ ΑΔΜΕ (ή κινηματική): υ₁ = √(2gh₁) = 6 m/s προς τα κάτω.",
    },
    {
      name: "Επαφή",
      tool: "ΣF = Δp/Δt",
      range: [0.37, 0.53],
      say: "Ζητείται δύναμη σε ΕΝΑ σώμα με γνωστό Δt ⇒ ΣF = Δp/Δt. Πρώτα θετική φορά: προς τα πάνω. p_πριν = 0,2·(−6) = −1,2, p_μετά = 0,2·(+4) = +0,8 ⇒ Δp = 0,8 − (−1,2) = +2 kg·m/s (οι ταχύτητες «προστίθενται» γιατί αλλάζει φορά). ΣF = 40 N είναι η ΣΥΝΙΣΤΑΜΕΝΗ: N − mg = 40 ⇒ N = 42 N. Το βάρος είναι μικρό, αλλά δεν το παραλείπουμε.",
    },
    {
      name: "Άνοδος",
      tool: "ΑΔΜΕ",
      range: [0.5, 0.92],
      say: "Ανεβαίνει σε ύψος h₂ ⇒ ΑΔΜΕ για την ταχύτητα αμέσως μετά: υ₂ = √(2gh₂) = 4 m/s προς τα πάνω.",
    },
  ],
  order: [0, 2, 1],
  orderSay: "Πρώτα οι δύο άκρες (πτώση → υ₁, άνοδος → υ₂), γιατί έχουν από έναν άγνωστο. Τελευταία η επαφή, που τις χρειάζεται και τις δύο.",
  solve: (
    <>
      υ₁ = 6 m/s, υ₂ = 4 m/s. Δp = 0,2·(4 + 6) = 2 kg·m/s ⇒ ΣF = 2/0,05 = 40 N ⇒ <b>N = 40 + 2 = 42 N</b>.
    </>
  ),
  trap: "Το Δp/Δt δίνει τη συνισταμένη. Η δύναμη του εδάφους είναι N = ΣF + mg.",
  draw: (tau, ctx) => {
    const x = 190;
    const floor = 180;
    const top = 40;
    const h2y = floor - 140 * (0.8 / 1.8);
    let y = floor - 10;
    let squash = 0;
    if (tau < 0.4) y = top + (floor - 10 - top) * Math.pow(seg(tau, 0, 0.4), 2);
    else if (tau < 0.5) squash = 0.35 * bump(tau, 0.4, 0.5);
    else y = floor - 10 - (floor - 10 - h2y) * decel(seg(tau, 0.5, 0.9));
    const contact = tau >= 0.4 && tau < 0.5;
    return (
      <g>
        <Ground y={floor} />
        <line x1={60} y1={top} x2={150} y2={top} stroke={C.faint} strokeDasharray="3 3" />
        <line x1={60} y1={h2y} x2={150} y2={h2y} stroke={C.faint} strokeDasharray="3 3" />
        <Vbar x={70} y1={top} y2={floor} s="h₁" side="right" />
        <Vbar x={120} y1={h2y} y2={floor} s="h₂" side="right" />
        <Ball cx={x} cy={contact ? floor - 10 * (1 - squash) : y} r={10} squash={squash} axis="y" />
        {tau > 0.2 && tau < 0.4 ? <Vec x={x + 16} y={y - 10} dx={0} dy={34} label="υ₁" labelSide="right" /> : null}
        {tau > 0.5 && tau < 0.62 ? <Vec x={x + 16} y={y + 10} dx={0} dy={-26} label="υ₂" labelSide="right" /> : null}
        {contact || ctx.phase === 1 ? (
          <g>
            <Vec x={x} y={floor - 22} dx={0} dy={-56} color={C.F} label="N" labelSide="right" />
            <Vec x={x - 18} y={floor - 14} dx={0} dy={12} color={C.F} label="mg" labelSide="left" />
          </g>
        ) : null}
        {ctx.mode === "ask" ? <Ask x={270} y={110} s="N = ?" /> : null}
      </g>
    );
  },
};

/* ───────── 6. Βλήμα σε δύο ξύλα ───────── */
const s6: Story = {
  n: 6,
  title: "Βλήμα σε δύο ξύλα",
  what: "Βλήμα διαπερνά ένα κρεμασμένο ξύλο και σφηνώνεται σε ένα δεύτερο. Τα δύο ξύλα ανεβαίνουν σε διαφορετικά ύψη.",
  given: "m = 0,1 kg, M₁ = 1 kg, M₂ = 0,9 kg, h₁ = 0,8 m, h₂ = 1,8 m, g = 10 m/s².",
  ask: "Την αρχική ταχύτητα υ₀ του βλήματος και την απώλεια ενέργειας σε κάθε κρούση.",
  playSay: "Δύο κρούσεις στη σειρά (με διαφορετικό σύστημα η καθεμία) και μετά οι άνοδοι. 3 φάσεις.",
  askSay: "Ζητούν υ₀ και δύο απώλειες. Δίνουν δύο ύψη, δηλαδή το ΤΕΛΟΣ. Θα πάμε ανάποδα, από τις ανόδους προς την 1η κρούση.",
  phases: [
    {
      name: "1η κρούση",
      tool: "ΑΔΟ + Q₁",
      range: [0.12, 0.3],
      say: "Σύστημα: βλήμα + ξύλο 1. Δεν κολλάνε, άρα δύο ταχύτητες μετά: m·υ₀ = m·u + M₁·V₁. Τρεις άγνωστοι αν δεν ξέρω τίποτα: περιμένει.",
    },
    {
      name: "2η κρούση",
      tool: "ΑΔΟ + Q₂",
      range: [0.26, 0.4],
      say: "ΝΕΟ σύστημα: βλήμα + ξύλο 2 (κολλάνε): m·u = (m+M₂)·V₂. Δύο κρούσεις = δύο ΑΔΟ, η καθεμία με το δικό της σύστημα.",
    },
    {
      name: "Άνοδοι",
      tool: "ΑΔΜΕ",
      range: [0.35, 1],
      say: "Κάθε ξύλο ανεβαίνει σε γνωστό ύψος χωρίς τριβές ⇒ ΑΔΜΕ για το καθένα: V₁ = √(2gh₁) = 4 m/s, V₂ = √(2gh₂) = 6 m/s.",
    },
  ],
  order: [2, 1, 0],
  orderSay: "Ανάποδα: Άνοδοι → V₁ = 4, V₂ = 6. Μετά 2η κρούση → u = 60 m/s. Τέλος 1η κρούση → υ₀ = 100 m/s. Τα Q στο τέλος.",
  solve: (
    <>
      V₁ = 4 m/s, V₂ = 6 m/s. 0,1·u = 1·6 ⇒ <b>u = 60 m/s</b>. 0,1·υ₀ = 0,1·60 + 1·4 ⇒ <b>υ₀ = 100 m/s</b>. Q₁ = 500 − (180 + 8) = <b>312 J</b>, Q₂ = 180 − 18 ={" "}
      <b>162 J</b>.
    </>
  ),
  trap: "Μη γράψεις μία ΑΔΟ «για όλα μαζί»: κάθε κρούση είναι ξεχωριστή φάση με δικό της σύστημα.",
  draw: (tau, ctx) => {
    const P1 = { x: 160, y: 26 };
    const P2 = { x: 232, y: 26 };
    const L = 112;
    const c1 = 0.22;
    const c2 = 0.32;
    const th1 = tau < c1 ? 0 : 0.42 * decel(seg(tau, c1, 0.8));
    const th2 = tau < c2 ? 0 : 0.68 * decel(seg(tau, c2, 0.95));
    const b1 = pend(P1.x, P1.y, L, th1);
    const b2 = pend(P2.x, P2.y, L, th2);
    const by = P1.y + L;
    let bx: number | null = null;
    if (tau < c1) bx = lerp(20, 150, tau / c1);
    else if (tau < c2) bx = lerp(170, 220, seg(tau, c1, c2));
    return (
      <g>
        <Pivot x={P1.x} y={P1.y} />
        <Pivot x={P2.x} y={P2.y} />
        <line x1={P1.x} y1={P1.y} x2={b1.x} y2={b1.y - 11} stroke={C.edge} strokeWidth={1.2} />
        <line x1={P2.x} y1={P2.y} x2={b2.x} y2={b2.y - 11} stroke={C.edge} strokeWidth={1.2} />
        <Box cx={b1.x} y={b1.y + 11} w={22} h={22} fill={C.wood} label="1" />
        <Box cx={b2.x} y={b2.y + 11} w={22} h={22} fill={C.b2} label="2" />
        {bx !== null ? <Bullet x={bx} y={by} /> : null}
        <Burst cx={160} cy={by} k={seg(tau, c1, c1 + 0.08)} />
        <Heat cx={232} cy={by - 20} k={bump(tau, c2, c2 + 0.15)} />
        {tau < c1 ? <Vec x={Math.max(10, (bx ?? 20) - 40)} y={by - 14} dx={28} label="υ₀" /> : null}
        {tau >= c1 && tau < c2 ? <Vec x={(bx ?? 170) - 34} y={by - 14} dx={20} label="u" /> : null}
        {tau > 0.95 ? (
          <g>
            <T x={b1.x - 20} y={b1.y - 4} s="h₁" size={10} color={C.p} />
            <T x={b2.x + 22} y={b2.y - 4} s="h₂" size={10} color={C.p} />
          </g>
        ) : null}
        {ctx.mode === "ask" ? (
          <g>
            <Ask x={60} y={by - 30} s="υ₀ = ?" />
            <Ask x={110} y={60} s="Q₁, Q₂ = ?" />
          </g>
        ) : null}
      </g>
    );
  },
};

/* ───────── 7. Γλιστράει, χτυπά, ξαναγλιστράει ───────── */
const s7: Story = {
  n: 7,
  title: "Γλιστράει, χτυπά, ξαναγλιστράει",
  what: "Κιβώτιο γλιστράει με τριβή, χτυπά ακίνητο κιβώτιο, κολλάνε και γλιστράνε μαζί μέχρι να σταματήσουν.",
  given: "m = 2 kg με υ₀ = 6 m/s, μ = 0,2, διανύει d = 5 m ως την κρούση, M = 2 kg ακίνητο, g = 10 m/s².",
  ask: "Πόση απόσταση s διανύει το συσσωμάτωμα.",
  playSay: "Τριβή πριν την κρούση, στιγμιαία κρούση, τριβή μετά. 3 φάσεις. Η τριβή ΚΑΙ στις δύο άκρες!",
  askSay: "Ζητούν το s (τέλος). Τα δεδομένα (υ₀, d) είναι στην αρχή: εδώ η λύση πάει «κανονικά», από την αρχή προς το τέλος.",
  phases: [
    {
      name: "Ολίσθηση πριν",
      tool: "ΘΜΚΕ",
      range: [0, 0.44],
      say: "Τριβή + απόσταση d ⇒ ΘΜΚΕ: ½mυ₁² − ½mυ₀² = −μmg·d ⇒ υ₁ = 4 m/s. ΟΧΙ ΑΔΟ εδώ: η τριβή αλλάζει την ορμή όσο γλιστράει.",
    },
    {
      name: "Κρούση",
      tool: "ΑΔΟ",
      range: [0.4, 0.52],
      say: "Τώρα η κρούση είναι στιγμιαία και η τριβή δεν προλαβαίνει ⇒ ΑΔΟ: m·υ₁ = (m+M)·V ⇒ V = 2 m/s.",
    },
    {
      name: "Ολίσθηση μετά",
      tool: "ΘΜΚΕ",
      range: [0.45, 1],
      say: "Ζητείται απόσταση με τριβή ⇒ ΘΜΚΕ: 0 − ½(m+M)V² = −μ(m+M)g·s ⇒ s = V²/(2μg) = 1 m.",
    },
  ],
  order: [0, 1, 2],
  orderSay: "Κανονική σειρά: ΘΜΚΕ → υ₁ = 4, ΑΔΟ → V = 2, ΘΜΚΕ → s = 1 m.",
  solve: (
    <>
      υ₁² = 36 − 2·2·5 = 16 ⇒ <b>υ₁ = 4 m/s</b>. 2·4 = 4·V ⇒ <b>V = 2 m/s</b>. s = 4/(2·0,2·10) = <b>1 m</b>.
    </>
  ),
  trap: "Η υ₀ = 6 m/s ΔΕΝ μπαίνει στην ΑΔΟ: μπαίνει η ταχύτητα αμέσως πριν την κρούση (4 m/s).",
  draw: (tau, ctx) => {
    const gy = 168;
    const hit = 0.45;
    const k = seg(tau, 0, hit);
    const x1 = tau < hit ? 30 + 126 * ((6 * k - k * k) / 5) : 156 + 60 * decel(seg(tau, hit, 1));
    const x2 = tau < hit ? 190 : x1 + 34;
    const moving = tau < hit || seg(tau, hit, 1) < 0.98;
    return (
      <g>
        <Ground y={gy} rough />
        <Box cx={x1} y={gy} w={34} h={26} fill={C.b1} label="m" />
        <Box cx={x2} y={gy} w={34} h={26} fill={C.b2} label="M" />
        {moving ? <Vec x={x1 - 17} y={gy - 4} dx={-20} color={C.F} label="T" labelSide="below" /> : null}
        {tau < hit ? <Vec x={x1 + 18} y={gy - 34} dx={38 * (1 - 0.33 * k)} label="υ" /> : null}
        {tau > hit && moving ? <Vec x={x2 + 18} y={gy - 34} dx={22 * (1 - seg(tau, hit, 1))} label="V" /> : null}
        {tau > 0.4 || ctx.phase === 0 ? <Hbar x1={30} x2={156} y={gy + 20} s="d = 5 m" /> : null}
        {tau > 0.97 ? <Hbar x1={156} x2={216} y={gy + 20} s="s" color={C.v} /> : null}
        {ctx.mode === "ask" ? <Ask x={250} y={110} s="s = ?" /> : null}
      </g>
    );
  },
};

/* ───────── 8. Οβίδα που σπάει στο ψηλότερο σημείο ───────── */
const s8: Story = {
  n: 8,
  title: "Οβίδα που σπάει στο ψηλότερο σημείο",
  what: "Οβίδα ανεβαίνει κατακόρυφα, στο ψηλότερο σημείο σπάει σε δύο κομμάτια που φεύγουν οριζόντια και πέφτουν.",
  given: "M = 3 kg, υ₀ = 20 m/s προς τα πάνω, κομμάτια 1 kg και 2 kg, το 1 kg πέφτει 16 m μακριά, g = 10 m/s².",
  ask: "Το ύψος της έκρηξης, τις ταχύτητες των κομματιών και την ενέργεια που ελευθερώθηκε.",
  playSay: "Άνοδος (βάρος), έκρηξη (στιγμιαία), πτώση των κομματιών (βάρος, φεύγουν οριζόντια). 3 φάσεις.",
  askSay: "Ζητούν H, υ₁, υ₂, E. Δεδομένα σε δύο σημεία: η υ₀ στην αρχή και τα 16 m στο τέλος. Η σειρά λύσης θα πηδήξει: 1 → 3 → 2.",
  phases: [
    {
      name: "Άνοδος",
      tool: "ΑΔΜΕ",
      range: [0, 0.39],
      say: "Κατακόρυφη βολή ως το ψηλότερο σημείο (εκεί υ = 0) ⇒ ΑΔΜΕ ή κινηματική: H = υ₀²/(2g) = 20 m.",
    },
    {
      name: "Έκρηξη",
      tool: "ΑΔΟ + ενέργεια",
      range: [0.36, 0.5],
      say: "Ακριβώς πριν την έκρηξη υ = 0, άρα p = 0 ⇒ ΑΔΟ: 0 = m₁υ₁ − m₂υ₂. Εδώ η κινητική ΑΥΞΑΝΕΤΑΙ: E = K_μετά − K_πριν. Δύο άγνωστοι: χρειάζομαι την υ₁ από την πτώση.",
    },
    {
      name: "Πτώση",
      tool: "Οριζόντια βολή",
      range: [0.45, 1],
      say: "Τα κομμάτια φεύγουν οριζόντια από ύψος H ⇒ οριζόντια βολή, ίδιος χρόνος για τα δύο: t = √(2H/g) = 2 s. Από τα 16 m: υ₁ = 16/2 = 8 m/s.",
    },
  ],
  order: [0, 2, 1],
  orderSay: "Άνοδος → H = 20 m. Πτώση → t = 2 s, υ₁ = 8 m/s. Έκρηξη → υ₂ = 4 m/s και E = 48 J.",
  solve: (
    <>
      H = 400/20 = <b>20 m</b>, t = 2 s, <b>υ₁ = 8 m/s</b>. 1·8 = 2·υ₂ ⇒ <b>υ₂ = 4 m/s</b>. E = ½·1·64 + ½·2·16 = <b>48 J</b>.
    </>
  ),
  trap: "Στην έκρηξη δεν διατηρείται η κινητική: αυξάνεται. Διατηρείται μόνο η ορμή.",
  draw: (tau, ctx) => {
    const gx = 180;
    const floor = 192;
    const topY = 50;
    const ex = 0.4;
    const k = seg(tau, 0.42, 1);
    const pieces = tau >= ex;
    const y = tau < ex ? floor - (floor - topY) * decel(seg(tau, 0, ex)) : topY;
    const py = topY + (floor - topY - 6) * k * k;
    return (
      <g>
        <Ground y={floor} />
        {!pieces ? <Ball cx={gx} cy={y} r={9} fill={C.edge} /> : null}
        {!pieces && tau < 0.3 ? <Vec x={gx + 14} y={y + 10} dx={0} dy={-34 * (1 - tau / ex)} label="υ" labelSide="right" /> : null}
        <Burst cx={gx} cy={topY} k={seg(tau, ex, ex + 0.08)} />
        {pieces ? (
          <g>
            <Ball cx={gx + 110 * k} cy={py} r={6} fill={C.ball} />
            <Ball cx={gx - 55 * k} cy={py} r={8} fill={C.b2} />
            {k < 0.15 ? (
              <g>
                <Vec x={gx + 10} y={topY - 12} dx={40} label="υ₁" />
                <Vec x={gx - 10} y={topY - 12} dx={-20} label="υ₂" />
              </g>
            ) : null}
          </g>
        ) : null}
        <line x1={gx} y1={topY} x2={gx} y2={floor} stroke={C.faint} strokeDasharray="2 4" />
        {tau > 0.97 || ctx.phase === 2 ? <Hbar x1={gx} x2={gx + 110} y={floor + 10} s="16 m" /> : null}
        {ctx.mode === "ask" ? (
          <g>
            <Ask x={130} y={110} s="H = ?" />
            <Ask x={260} y={40} s="υ₁, υ₂ = ?" />
            <Ask x={70} y={40} s="E = ?" />
          </g>
        ) : null}
      </g>
    );
  },
};

/* ───────── 9. Οριακή ανακύκλωση ───────── */
const s9: Story = {
  n: 9,
  title: "Οριακή ανακύκλωση",
  what: "Βλήμα σφηνώνεται σε ξύλο που κρέμεται από νήμα· το συσσωμάτωμα κάνει μόλις-μόλις έναν πλήρη κύκλο.",
  given: "m = 0,1 kg, M = 0,9 kg, ℓ = 0,5 m, «οριακή ανακύκλωση», g = 10 m/s².",
  ask: "Την ταχύτητα υ₀ του βλήματος.",
  playSay: "Κρούση, άνοδος στον κύκλο, και η «κρίσιμη στιγμή» στην κορυφή. Η κορυφή είναι ξεχωριστή φάση γιατί εκεί μας δίνουν πληροφορία: «οριακά».",
  askSay: "Ζητούν υ₀. Δεν δίνουν ταχύτητα πουθενά! Η μόνη πληροφορία είναι η λέξη «οριακή» στην κορυφή. Άρα ξεκινάμε από την κορυφή.",
  phases: [
    {
      name: "Κρούση",
      tool: "ΑΔΟ",
      range: [0.08, 0.3],
      say: "Σφήνωμα ⇒ ΑΔΟ: m·υ₀ = (m+M)·V. Δύο άγνωστοι, περιμένει τη V.",
    },
    {
      name: "Άνοδος",
      tool: "ΑΔΜΕ",
      range: [0.25, 0.85],
      say: "Χωρίς τριβές, ανεβαίνει ύψος 2ℓ ⇒ ΑΔΜΕ: ½(m+M)V² = ½(m+M)υ_κ² + (m+M)g·2ℓ. Θέλω την υ_κ στην κορυφή.",
    },
    {
      name: "Κορυφή",
      tool: "Κεντρομόλος",
      range: [0.8, 0.92],
      say: "«Οριακή» με νήμα σημαίνει T = 0 στην κορυφή: μόνο το βάρος δίνει κεντρομόλο, (m+M)g = (m+M)υ_κ²/ℓ ⇒ υ_κ = √(gℓ) = √5 m/s. Εδώ δεν υπάρχει άγνωστος άλλος: ξεκινάμε από εδώ!",
    },
  ],
  order: [2, 1, 0],
  orderSay: "Κορυφή → υ_κ = √5. ΑΔΜΕ → V² = 5 + 20 = 25, V = 5 m/s. ΑΔΟ → υ₀ = 50 m/s.",
  solve: (
    <>
      υ_κ² = gℓ = 5. V² = υ_κ² + 4gℓ = 25 ⇒ <b>V = 5 m/s</b>. 0,1·υ₀ = 1·5 ⇒ <b>υ₀ = 50 m/s</b>.
    </>
  ),
  trap: "Με ΡΑΒΔΟ αντί για νήμα, οριακά σημαίνει υ_κ = 0 (η ράβδος μπορεί να σπρώχνει).",
  draw: (tau, ctx) => {
    const O = { x: 180, y: 98 };
    const L = 62;
    const hit = 0.25;
    const phi = tau < hit ? 0 : Math.PI * decel(seg(tau, hit, 0.85)) + (tau > 0.85 ? 0.6 * seg(tau, 0.85, 1) : 0);
    const b = { x: O.x + L * Math.sin(phi), y: O.y + L * Math.cos(phi) };
    const atTop = Math.abs(phi - Math.PI) < 0.35;
    return (
      <g>
        <circle cx={O.x} cy={O.y} r={L} fill="none" stroke={C.faint} strokeDasharray="3 4" />
        <circle cx={O.x} cy={O.y} r={3} fill={C.edge} />
        <line x1={O.x} y1={O.y} x2={b.x} y2={b.y} stroke={C.edge} strokeWidth={1.3} />
        <Box cx={b.x} y={b.y + 10} w={22} h={20} fill={C.wood} />
        {tau < hit ? <Bullet x={lerp(20, 168, tau / hit)} y={O.y + L} /> : null}
        {tau < hit ? <Vec x={lerp(20, 168, tau / hit) - 44} y={O.y + L - 14} dx={28} label="υ₀" /> : null}
        {tau >= hit && tau < hit + 0.12 ? <Vec x={b.x + 14} y={b.y} dx={36} label="V" /> : null}
        {atTop || ctx.phase === 2 ? (
          <g>
            <Vec x={O.x} y={O.y - L + 12} dx={0} dy={22} color={C.F} label="(m+M)g" labelSide="right" />
            <Vec x={O.x - 16} y={O.y - L + 2} dx={-26} label="υκ" labelSide="below" />
            <T x={O.x + 46} y={O.y - L + 6} s="T = 0" size={11} color={C.F} />
          </g>
        ) : null}
        {ctx.mode === "ask" ? <Ask x={60} y={O.y + L - 30} s="υ₀ = ?" /> : null}
      </g>
    );
  },
};

/* ───────── 10. Βλήμα σε σώμα πάνω σε κεκλιμένο ───────── */
const s10: Story = {
  n: 10,
  title: "Βλήμα σε σώμα πάνω σε κεκλιμένο",
  what: "Βλήμα κινείται παράλληλα σε κεκλιμένο, σφηνώνεται σε σώμα και το συσσωμάτωμα ανεβαίνει με τριβή μέχρι να σταματήσει.",
  given: "m = 0,4 kg, υ₀ = 250 m/s, M = 4,6 kg, ημφ = 0,6, συνφ = 0,8, μ = 0,5, g = 10 m/s².",
  ask: "Πόσο ανεβαίνει το συσσωμάτωμα πάνω στο κεκλιμένο (s) και σε ποιο ύψος.",
  playSay: "Κρούση πάνω στο κεκλιμένο (στιγμιαία), μετά άνοδος με τριβή. 2 φάσεις.",
  askSay: "Ζητούν απόσταση στο τέλος. Η υ₀ δίνεται στην αρχή: κανονική σειρά.",
  phases: [
    {
      name: "Κρούση",
      tool: "ΑΔΟ",
      range: [0.08, 0.32],
      say: "Στιγμιαία, κατά μήκος του κεκλιμένου ⇒ ΑΔΟ σε αυτή τη διεύθυνση: m·υ₀ = (m+M)·V ⇒ V = 100/5 = 20 m/s.",
    },
    {
      name: "Άνοδος με τριβή",
      tool: "ΘΜΚΕ",
      range: [0.28, 1],
      say: "Τριβή + απόσταση ⇒ ΘΜΚΕ (όχι ΑΔΜΕ, γιατί υπάρχει τριβή). Έργο παράγουν ΚΑΙ το βάρος (mg·ημφ·s) ΚΑΙ η τριβή (μmg·συνφ·s): 0 − ½V² = −g(ημφ + μσυνφ)·s ⇒ s = 400/20 = 20 m, h = s·ημφ = 12 m.",
    },
  ],
  order: [0, 1],
  orderSay: "Κρούση → V = 20 m/s. ΘΜΚΕ → s = 20 m, h = 12 m.",
  solve: (
    <>
      0,4·250 = 5·V ⇒ <b>V = 20 m/s</b>. 0 − ½·20² = −10·(0,6 + 0,5·0,8)·s ⇒ <b>s = 20 m</b>, <b>h = 12 m</b>.
    </>
  ),
  trap: "Στο κεκλιμένο N = mg·συνφ, όχι mg. Και στην άνοδο το βάρος φρενάρει κι αυτό.",
  draw: (tau, ctx) => {
    const A = { x: 40, y: 190 };
    const ang = Math.atan2(180, 240);
    const deg = (ang * 180) / Math.PI;
    const at = (s: number) => ({ x: A.x + s * Math.cos(ang), y: A.y - s * Math.sin(ang) });
    const hit = 0.28;
    const sBlock = tau < hit ? 105 : 105 + 120 * decel(seg(tau, hit, 1));
    const bp = at(sBlock);
    const moving = tau > hit && seg(tau, hit, 1) < 0.98;
    const bul = at(lerp(8, 90, clamp(tau / hit)));
    return (
      <g>
        <line x1={A.x} y1={A.y} x2={at(300).x} y2={at(300).y} stroke={C.ground} strokeWidth={2.2} />
        <line x1={A.x} y1={A.y} x2={330} y2={A.y} stroke={C.ground} strokeWidth={1.2} />
        <g transform={`rotate(${-deg} ${bp.x} ${bp.y})`}>
          <rect x={bp.x - 14} y={bp.y - 22} width={28} height={22} rx={3} fill={C.wood} stroke={C.edge} />
        </g>
        {tau < hit ? (
          <g transform={`rotate(${-deg} ${bul.x} ${bul.y})`}>
            <Bullet x={bul.x} y={bul.y - 11} />
          </g>
        ) : null}
        {moving ? (
          <g>
            <Vec x={bp.x + 8} y={bp.y - 30} dx={30 * Math.cos(ang) * (1 - seg(tau, hit, 1))} dy={-30 * Math.sin(ang) * (1 - seg(tau, hit, 1))} label="V" />
            <Vec x={bp.x - 14} y={bp.y + 6} dx={-26 * Math.cos(ang)} dy={26 * Math.sin(ang)} color={C.F} label="T + mgημφ" labelSide="below" />
          </g>
        ) : null}
        <T x={78} y={184} s="φ" size={11} color={C.muted} />
        {tau > 0.97 || ctx.phase === 1 ? <T x={at(165).x - 30} y={at(165).y - 26} s="s" size={12} color={C.v} /> : null}
        {ctx.mode === "ask" ? <Ask x={280} y={150} s="s, h = ?" /> : null}
      </g>
    );
  },
};

/* ───────── 11. Ελατήριο και ράμπα ───────── */
const s11: Story = {
  n: 11,
  title: "Ελατήριο και ράμπα",
  what: "Δύο ακίνητα αμαξάκια με συμπιεσμένο ελατήριο ανάμεσά τους. Κόβουμε το νήμα, απομακρύνονται, και το ένα ανεβαίνει σε ράμπα.",
  given: "m₁ = 1 kg, m₂ = 2 kg, λείο δάπεδο και ράμπα, το m₁ ανεβαίνει h = 0,8 m, g = 10 m/s².",
  ask: "Την ταχύτητα υ₂ του αμαξιού 2 kg και την ενέργεια U του ελατηρίου.",
  playSay: "Εκτόνωση του ελατηρίου (σαν έκρηξη) και μετά η άνοδος στη ράμπα. 2 φάσεις.",
  askSay: "Ζητούν υ₂ και U (αφορούν την εκτόνωση). Δίνουν το ύψος h (το τέλος): ξεκινάμε από τη ράμπα.",
  phases: [
    {
      name: "Εκτόνωση",
      tool: "ΑΔΟ + ενέργεια",
      range: [0, 0.3],
      say: "Αρχικά ακίνητα ⇒ p = 0. Το ελατήριο ασκεί ΕΣΩΤΕΡΙΚΕΣ δυνάμεις ⇒ ΑΔΟ: 0 = m₁υ₁ − m₂υ₂. Η ενέργεια του ελατηρίου γίνεται κινητική: U = ½m₁υ₁² + ½m₂υ₂².",
    },
    {
      name: "Ράμπα",
      tool: "ΑΔΜΕ",
      range: [0.3, 0.85],
      say: "Λεία ράμπα, δίνεται ύψος ⇒ ΑΔΜΕ: ½m₁υ₁² = m₁g·h ⇒ υ₁ = 4 m/s.",
    },
  ],
  order: [1, 0],
  orderSay: "Ράμπα → υ₁ = 4 m/s. ΑΔΟ → υ₂ = 2 m/s. Ενέργεια → U = 8 + 4 = 12 J.",
  solve: (
    <>
      υ₁ = √(2·10·0,8) = <b>4 m/s</b>. 1·4 = 2·υ₂ ⇒ <b>υ₂ = 2 m/s</b>. U = ½·1·16 + ½·2·4 = <b>12 J</b>.
    </>
  ),
  trap: "Το ελαφρύ παίρνει τη μεγαλύτερη ταχύτητα ΚΑΙ τη μεγαλύτερη κινητική: K₁/K₂ = m₂/m₁.",
  draw: (tau, ctx) => {
    const gy = 170;
    const R0 = { x: 100, y: gy };
    const R1 = { x: 30, y: gy - 70 };
    const rel = 0.12;
    const k = seg(tau, rel, 0.42);
    let c1 = { x: 150, y: gy };
    let rot = 0;
    if (tau >= rel && tau < 0.42) c1 = { x: lerp(150, R0.x + 10, k), y: gy };
    if (tau >= 0.42) {
      const r = 0.72 * decel(seg(tau, 0.42, 0.85));
      c1 = { x: lerp(R0.x, R1.x, r), y: lerp(R0.y, R1.y, r) };
      rot = (Math.atan2(R0.y - R1.y, R0.x - R1.x) * 180) / Math.PI;
    }
    const c2x = tau < rel ? 205 : 205 + 130 * seg(tau, rel, 1);
    const springL = tau < rel ? 12 : 12 + 20 * seg(tau, rel, rel + 0.06);
    return (
      <g>
        <Ground y={gy} x1={R0.x} />
        <line x1={R0.x} y1={R0.y} x2={R1.x} y2={R1.y} stroke={C.ground} strokeWidth={2.2} />
        <g transform={`rotate(${rot} ${c1.x} ${c1.y})`}>
          <Cart cx={c1.x} y={c1.y} w={36} label="1" />
        </g>
        <Cart cx={c2x} y={gy} w={50} fill={C.b2} label="2" />
        {tau < rel + 0.06 ? (
          <path
            d={`M ${168} ${gy - 15} ${Array.from({ length: 6 }, (_, i) => `L ${168 + (springL * (i + 1)) / 6} ${gy - 15 + (i % 2 ? 5 : -5)}`).join(" ")}`}
            fill="none"
            stroke={C.edge}
            strokeWidth={1.4}
          />
        ) : null}
        {tau >= rel && tau < 0.3 ? (
          <g>
            <Vec x={c1.x - 20} y={gy - 34} dx={-40} label="υ₁" />
            <Vec x={c2x + 26} y={gy - 34} dx={20} label="υ₂" />
          </g>
        ) : null}
        {tau > 0.85 || ctx.phase === 1 ? <Vbar x={20} y1={R1.y} y2={gy} s="h" side="left" /> : null}
        {ctx.mode === "ask" ? (
          <g>
            <Ask x={280} y={110} s="υ₂ = ?" />
            <Ask x={190} y={80} s="U = ?" />
          </g>
        ) : null}
      </g>
    );
  },
};

/* ───────── 12. Βάθος εισχώρησης και ολίσθηση ───────── */
const s12: Story = {
  n: 12,
  title: "Βάθος εισχώρησης και ολίσθηση",
  what: "Βλήμα μπαίνει σε κιβώτιο (η αντίσταση του ξύλου είναι σταθερή) και μετά το κιβώτιο γλιστράει με τριβή.",
  given: "m = 0,2 kg με 200 m/s, M = 1,8 kg, αντίσταση F = 14 400 N, μ = 0,5, g = 10 m/s².",
  ask: "Το βάθος εισχώρησης d και την απόσταση ολίσθησης s.",
  playSay: "Η εισχώρηση είναι η κρούση (στιγμιαία), μετά η ολίσθηση με τριβή. 2 φάσεις.",
  askSay: "Ζητούν d (μέσα στην κρούση) και s (στο τέλος). Η υ₀ δίνεται: κανονική σειρά.",
  phases: [
    {
      name: "Κρούση / εισχώρηση",
      tool: "ΑΔΟ + Q = F·d",
      range: [0.1, 0.38],
      say: "ΑΔΟ για τη V: 0,2·200 = 2·V ⇒ V = 20 m/s. Η θερμότητα της κρούσης είναι το έργο της αντίστασης στο ΒΑΘΟΣ d μέσα στο ξύλο: Q = F·d = K_πριν − K_μετά.",
    },
    {
      name: "Ολίσθηση",
      tool: "ΘΜΚΕ",
      range: [0.35, 1],
      say: "Απόσταση με τριβή ⇒ ΘΜΚΕ: 0 − ½(m+M)V² = −μ(m+M)g·s ⇒ s = V²/(2μg) = 40 m.",
    },
  ],
  order: [0, 1],
  orderSay: "ΑΔΟ → V = 20 m/s → Q = 3600 J → d = 0,25 m. Μετά ΘΜΚΕ → s = 40 m.",
  solve: (
    <>
      <b>V = 20 m/s</b>. Q = 4000 − 400 = 3600 J ⇒ <b>d = 3600/14 400 = 0,25 m</b>. s = 400/(2·0,5·10) = <b>40 m</b>.
    </>
  ),
  trap: "Στο Q = F·d, το d είναι πόσο μπήκε το βλήμα ΜΕΣΑ στο ξύλο, όχι πόσο μετακινήθηκε το κιβώτιο.",
  draw: (tau, ctx) => {
    const gy = 165;
    const hit = 0.2;
    const pen = 0.35;
    const cx = tau < pen ? 140 : 140 + 150 * decel(seg(tau, pen, 1));
    const left = cx - 25;
    let bx = lerp(20, left + 2, clamp(tau / hit));
    if (tau >= hit) bx = left + 2 + 18 * seg(tau, hit, pen);
    const moving = tau > pen && seg(tau, pen, 1) < 0.98;
    return (
      <g>
        <Ground y={gy} rough />
        <Box cx={cx} y={gy} w={50} h={34} fill={C.wood} label="M" />
        <Bullet x={tau < pen ? bx : left + 20} y={gy - 17} />
        <Heat cx={cx - 10} cy={gy - 40} k={bump(tau, hit, pen + 0.1)} />
        {tau >= hit && (tau < pen + 0.05 || ctx.phase === 0) ? <Hbar x1={left} x2={left + 20} y={gy - 44} s="d" color={C.F} /> : null}
        {tau < hit ? <Vec x={bx - 44} y={gy - 30} dx={28} label="υ₀" /> : null}
        {moving ? (
          <g>
            <Vec x={cx + 27} y={gy - 18} dx={40 * (1 - seg(tau, pen, 1))} label="V" />
            <Vec x={cx - 25} y={gy - 4} dx={-22} color={C.F} label="T" labelSide="below" />
          </g>
        ) : null}
        {ctx.mode === "ask" ? (
          <g>
            <Ask x={140} y={92} s="d = ?" />
            <Ask x={260} y={120} s="s = ?" />
          </g>
        ) : null}
      </g>
    );
  },
};

/* ───────── 13. Φρενάρισμα και τοίχος ───────── */
const s13: Story = {
  n: 13,
  title: "Φρενάρισμα και τοίχος",
  what: "Αυτοκίνητο φρενάρει με τριβή για κάποια μέτρα και μετά χτυπά σε τοίχο και σταματά μέσα σε ελάχιστο χρόνο.",
  given: "m = 1000 kg, υ₀ = 20 m/s, μ = 0,5, φρενάρει d = 30 m, σταματά στον τοίχο σε Δt = 0,1 s, g = 10 m/s².",
  ask: "Τη μέση δύναμη F που δέχεται από τον τοίχο.",
  playSay: "Φρενάρισμα (τριβή, απόσταση) και πρόσκρουση (τεράστια δύναμη, μικρό Δt). 2 φάσεις.",
  askSay: "Ζητούν δύναμη σε ΕΝΑ σώμα, μέσα σε γνωστό Δt. Χρειάζομαι την ταχύτητα τη στιγμή της πρόσκρουσης: θα βγει από το φρενάρισμα.",
  phases: [
    {
      name: "Φρενάρισμα",
      tool: "ΘΜΚΕ",
      range: [0, 0.69],
      say: "Τριβή + απόσταση ⇒ ΘΜΚΕ: ½mυ₁² − ½mυ₀² = −μmg·d ⇒ υ₁² = 400 − 300 ⇒ υ₁ = 10 m/s.",
    },
    {
      name: "Πρόσκρουση",
      tool: "ΣF = Δp/Δt",
      range: [0.66, 0.86],
      say: "Δύναμη σε ΕΝΑ σώμα με γνωστό Δt ⇒ ΣF = Δp/Δt = (0 − 1000·10)/0,1 = −100 000 N. ΟΧΙ ΑΔΟ: ο τοίχος δεν είναι «δεύτερο σώμα» του συστήματος, είναι εξωτερικός.",
    },
  ],
  order: [0, 1],
  orderSay: "ΘΜΚΕ → υ₁ = 10 m/s. Δp/Δt → F = 10⁵ N.",
  solve: (
    <>
      υ₁² = 20² − 2·0,5·10·30 = 100 ⇒ <b>υ₁ = 10 m/s</b>. F = 1000·10/0,1 = <b>100 000 N</b>.
    </>
  ),
  draw: (tau, ctx) => {
    const gy = 168;
    const wall = 300;
    const hit = 0.7;
    const k = seg(tau, 0, hit);
    const front = tau < hit ? 70 + 205 * ((20 * k - 5 * k * k) / 15) : 275;
    const squash = tau < hit ? 0 : 10 * seg(tau, hit, hit + 0.1);
    const w = 50 - squash;
    const cx = front - w / 2 + (tau < hit ? 0 : 25 - w / 2 + squash / 2);
    return (
      <g>
        <Ground y={gy} rough />
        <Wall x={wall} y1={90} y2={gy} />
        <Cart cx={tau < hit ? front - 25 : wall - w / 2} y={gy} w={w} label="m" />
        {tau < hit ? (
          <g>
            <Vec x={front + 2} y={gy - 30} dx={36 * (1 - 0.5 * k)} label="υ" />
            <Vec x={cx - 26} y={gy - 4} dx={-20} color={C.F} label="T" labelSide="below" />
          </g>
        ) : null}
        {(tau >= hit && tau < hit + 0.15) || ctx.phase === 1 ? <Vec x={wall - 2} y={gy - 18} dx={-50} color={C.F} label="F" /> : null}
        {tau > 0.66 || ctx.phase === 0 ? <Hbar x1={45} x2={275} y={gy + 20} s="d = 30 m" /> : null}
        {ctx.mode === "ask" ? <Ask x={240} y={80} s="F = ?" /> : null}
      </g>
    );
  },
};

/* ───────── 14. Κρούση σε κυκλική κίνηση ───────── */
const s14: Story = {
  n: 14,
  title: "Κρούση σε κυκλική κίνηση",
  what: "Κάτοψη: σώμα κάνει κύκλο σε λείο τραπέζι δεμένο σε νήμα. Συγκρούεται πλαστικά με μπίλια που έρχεται αντίθετα και συνεχίζουν μαζί στον κύκλο.",
  given: "m = 4 kg, ℓ = 2 m, τάση πριν T = 50 N, μπίλια m₂ = 2 kg με 16 m/s αντίθετα.",
  ask: "Τη νέα τάση T′ του νήματος.",
  playSay: "Κυκλική πριν, κρούση, κυκλική μετά. 3 φάσεις. Η τάση εμφανίζεται πριν και μετά: εκεί δουλεύει η κεντρομόλος.",
  askSay: "Ζητούν τάση μετά. Δίνουν τάση πριν. Κανονική σειρά: τάση → ταχύτητα → ΑΔΟ → νέα τάση.",
  phases: [
    {
      name: "Κυκλική πριν",
      tool: "Κεντρομόλος",
      range: [0, 0.44],
      say: "Σε λείο ΟΡΙΖΟΝΤΙΟ τραπέζι η τάση είναι όλη η κεντρομόλος: T = m·υ²/ℓ ⇒ 50 = 4υ²/2 ⇒ υ = 5 m/s.",
    },
    {
      name: "Κρούση",
      tool: "ΑΔΟ",
      range: [0.38, 0.52],
      say: "Πλαστική, αντίθετες φορές ⇒ ΑΔΟ με πρόσημα (θετική η φορά του m): 4·5 − 2·16 = 6·V ⇒ V = −2 m/s (γυρίζει ανάποδα).",
    },
    {
      name: "Κυκλική μετά",
      tool: "Κεντρομόλος",
      range: [0.48, 1],
      say: "Νέα μάζα, νέα ταχύτητα ⇒ νέα κεντρομόλος: T′ = (m+m₂)V²/ℓ = 6·4/2 = 12 N.",
    },
  ],
  order: [0, 1, 2],
  orderSay: "Κεντρομόλος → υ = 5. ΑΔΟ → V = −2. Κεντρομόλος → T′ = 12 N.",
  solve: (
    <>
      υ = 5 m/s. 20 − 32 = 6V ⇒ <b>V = −2 m/s</b>. <b>T′ = 6·4/2 = 12 N</b>.
    </>
  ),
  trap: "Το πρόσημο της V δεν αλλάζει την τάση (μπαίνει στο τετράγωνο), αλλά σου λέει ότι αλλάζει φορά περιστροφής.",
  draw: (tau, ctx) => {
    const O = { x: 170, y: 108 };
    const R = 72;
    const hit = 0.45;
    const a = tau < hit ? -1.6 * (1 - tau / hit) : -0.8 * seg(tau, hit, 1);
    const p = { x: O.x + R * Math.cos(a), y: O.y - R * Math.sin(a) };
    const ballY = tau < hit ? lerp(18, O.y - 12, seg(tau, 0.15, hit)) : null;
    return (
      <g>
        <circle cx={O.x} cy={O.y} r={R} fill="none" stroke={C.faint} strokeDasharray="3 4" />
        <circle cx={O.x} cy={O.y} r={3} fill={C.edge} />
        <line x1={O.x} y1={O.y} x2={p.x} y2={p.y} stroke={C.edge} strokeWidth={1.3} />
        <Ball cx={p.x} cy={p.y} r={tau < hit ? 10 : 12} fill={C.b1} />
        {ballY !== null ? <Ball cx={O.x + R} cy={ballY} r={7} fill={C.ball} /> : null}
        {ballY !== null && tau > 0.15 ? <Vec x={O.x + R + 14} y={ballY - 10} dx={0} dy={24} label="υ₂" labelSide="right" /> : null}
        {tau < hit ? <Vec x={p.x + 14} y={p.y} dx={0} dy={-30} label="υ" labelSide="right" /> : <Vec x={p.x + 14} y={p.y} dx={0} dy={14} label="V" labelSide="right" />}
        <Vec x={p.x - 12 * Math.cos(a)} y={p.y + 12 * Math.sin(a)} dx={-30 * Math.cos(a)} dy={30 * Math.sin(a)} color={C.F} label={tau < hit ? "T" : "T′"} labelSide="below" />
        <T x={20} y={190} s="κάτοψη" size={9} color={C.muted} anchor="start" bold={false} />
        {ctx.mode === "ask" ? <Ask x={90} y={50} s="T′ = ?" /> : null}
      </g>
    );
  },
};

/* ───────── 15. Άλμα από κινούμενο καρότσι ───────── */
const s15: Story = {
  n: 15,
  title: "Άλμα από κινούμενο καρότσι",
  what: "Παιδί πάνω σε καρότσι που ήδη κινείται πηδά μπροστά. Το καρότσι μετά φρενάρει από την τριβή μέχρι να σταματήσει.",
  given: "M = 100 kg, m = 50 kg, κοινή ταχύτητα u = 4 m/s, το παιδί πηδά με υ = 8 m/s (ως προς το έδαφος), μ = 0,1, g = 10 m/s².",
  ask: "Την ταχύτητα V του καροτσιού αμέσως μετά και τον χρόνο Δt μέχρι να σταματήσει.",
  playSay: "Το πήδημα είναι «έκρηξη» (στιγμιαίο, εσωτερικές δυνάμεις). Μετά το καρότσι μόνο του με τριβή. 2 φάσεις.",
  askSay: "Ζητούν V και ΧΡΟΝΟ. Προσοχή στη λέξη χρόνος: θα αλλάξει το εργαλείο της 2ης φάσης.",
  phases: [
    {
      name: "Πήδημα",
      tool: "ΑΔΟ",
      range: [0.2, 0.42],
      say: "Στιγμιαίο ⇒ ΑΔΟ. Η αρχική ορμή ΔΕΝ είναι μηδέν: κινούνταν ήδη. (M+m)·u = M·V + m·υ ⇒ 600 = 100V + 400 ⇒ V = 2 m/s.",
    },
    {
      name: "Φρενάρισμα",
      tool: "Δp = ΣF·Δt",
      range: [0.38, 1],
      say: "Τριβή και ζητείται ΧΡΟΝΟΣ ⇒ Δp = −T·Δt (ή κινηματική). Το ΘΜΚΕ δίνει απόσταση, όχι χρόνο. 0 − M·V = −μMg·Δt ⇒ Δt = V/(μg) = 2 s.",
    },
  ],
  order: [0, 1],
  orderSay: "ΑΔΟ → V = 2 m/s. Δp = ΣF·Δt → Δt = 2 s.",
  solve: (
    <>
      150·4 = 100·V + 50·8 ⇒ <b>V = 2 m/s</b>. Δt = 2/(0,1·10) = <b>2 s</b>.
    </>
  ),
  trap: "Μη γράψεις «0 = …» όπως στη βάρκα: το σύστημα κινούνταν ήδη.",
  draw: (tau, ctx) => {
    const gy = 168;
    const jump = 0.35;
    const cartX = tau < jump ? lerp(40, 150, tau / jump) : 150 + 80 * decel(seg(tau, jump, 1));
    const k = seg(tau, jump, 0.62);
    const person = tau < jump ? { x: cartX, y: gy - 24 } : { x: lerp(150, 270, k), y: gy - 24 + (k < 1 ? -50 * Math.sin(Math.PI * k) + 24 * k : 24) };
    const moving = tau > jump && seg(tau, jump, 1) < 0.98;
    return (
      <g>
        <Ground y={gy} rough />
        <Cart cx={cartX} y={gy} w={56} label="M" />
        <StickPerson x={person.x} y={person.y} step={tau * 20} scale={0.8} />
        {tau < jump ? <Vec x={cartX + 30} y={gy - 12} dx={24} label="u" /> : null}
        {tau > jump && k < 0.6 ? <Vec x={person.x + 10} y={person.y - 30} dx={36} label="υ" /> : null}
        {moving ? (
          <g>
            <Vec x={cartX + 30} y={gy - 12} dx={18 * (1 - seg(tau, jump, 1))} label="V" />
            <Vec x={cartX - 28} y={gy - 4} dx={-18} color={C.F} label="T" labelSide="below" />
          </g>
        ) : null}
        {ctx.mode === "ask" ? (
          <g>
            <Ask x={200} y={70} s="V = ?" />
            <Ask x={290} y={110} s="Δt = ?" />
          </g>
        ) : null}
      </g>
    );
  },
};

/* ───────── 16. Σύγκρουση στον αέρα ───────── */
const s16: Story = {
  n: 16,
  title: "Σύγκρουση στον αέρα",
  what: "Μια μπάλα αφήνεται από ψηλά και ταυτόχρονα μια άλλη ρίχνεται από κάτω προς τα πάνω. Συγκρούονται, κολλάνε και ανεβαίνουν μαζί.",
  given: "m₁ = 0,1 kg αφήνεται από 40 m, m₂ = 0,4 kg ρίχνεται με 40 m/s, συγκρούονται στο t = 1 s, g = 10 m/s².",
  ask: "Τις ταχύτητες πριν, την κοινή ταχύτητα και το μέγιστο ύψος.",
  playSay: "Κινήσεις πριν (ελεύθερη πτώση και κατακόρυφη βολή), κρούση, άνοδος μαζί. 3 φάσεις.",
  askSay: "Δίνουν ΧΡΟΝΟ (1 s) για την πρώτη φάση: σημάδι για κινηματική. Κανονική σειρά.",
  phases: [
    {
      name: "Κινήσεις πριν",
      tool: "Κινηματική",
      range: [0, 0.44],
      say: "Δίνεται χρόνος ⇒ κινηματική: πάνω μπάλα υ₁ = g·t = 10 m/s κάτω, κάτω μπάλα υ₂ = υ₀ − g·t = 30 m/s πάνω. Βρίσκονται και οι δύο στα 35 m.",
    },
    {
      name: "Κρούση",
      tool: "ΑΔΟ",
      range: [0.4, 0.52],
      say: "Υπάρχει βάρος, αλλά η κρούση είναι στιγμιαία: η ώθηση του βάρους δεν προλαβαίνει ⇒ ΑΔΟ με πρόσημα (θετικά πάνω): 0,4·30 − 0,1·10 = 0,5·V ⇒ V = 22 m/s πάνω.",
    },
    {
      name: "Άνοδος",
      tool: "ΑΔΜΕ",
      range: [0.45, 1],
      say: "Ζητείται ύψος ⇒ ΑΔΜΕ από το σημείο της κρούσης: Δh = V²/(2g) = 24,2 m ⇒ h_max = 35 + 24,2 = 59,2 m.",
    },
  ],
  order: [0, 1, 2],
  orderSay: "Κινηματική → 10 και 30 m/s. ΑΔΟ → V = 22 m/s. ΑΔΜΕ → h_max = 59,2 m.",
  solve: (
    <>
      υ₁ = 10 m/s ↓, υ₂ = 30 m/s ↑. 12 − 1 = 0,5V ⇒ <b>V = 22 m/s</b>. Δh = 484/20 = 24,2 m ⇒ <b>h_max = 59,2 m</b>.
    </>
  ),
  trap: "Πρόσημα! Οι μπάλες κινούνται αντίθετα: η πάνω μπαίνει με «−» στην ΑΔΟ.",
  draw: (tau, ctx) => {
    const x = 190;
    const floor = 192;
    const Y = (h: number) => floor - 3 * h;
    const hit = 0.45;
    const tp = seg(tau, 0, hit);
    const hTop = 40 - 5 * tp * tp;
    const hBot = 40 * tp - 5 * tp * tp;
    const t2 = 2.2 * seg(tau, hit, 1);
    const hC = 35 + 22 * t2 - 5 * t2 * t2;
    return (
      <g>
        <Ground y={floor} />
        <line x1={x} y1={Y(60)} x2={x} y2={floor} stroke={C.faint} strokeDasharray="2 4" />
        {tau < hit ? (
          <g>
            <Ball cx={x} cy={Y(hTop) - 6} r={6} fill={C.ball} />
            <Ball cx={x} cy={Y(hBot) - 9} r={9} fill={C.b1} />
            {tp > 0.4 ? (
              <g>
                <Vec x={x + 14} y={Y(hTop) - 14} dx={0} dy={14} label="υ₁" labelSide="right" />
                <Vec x={x + 14} y={Y(hBot) - 2} dx={0} dy={-34} label="υ₂" labelSide="right" />
              </g>
            ) : null}
          </g>
        ) : (
          <g>
            <Ball cx={x} cy={Y(hC) - 9} r={10} fill={C.b2} />
            {t2 < 1.2 ? <Vec x={x + 14} y={Y(hC) - 4} dx={0} dy={-30 * (1 - t2 / 2.2)} label="V" labelSide="right" /> : null}
          </g>
        )}
        <T x={x - 40} y={Y(35) + 4} s="35 m" size={9} color={C.muted} anchor="end" bold={false} />
        <line x1={x - 36} y1={Y(35)} x2={x - 10} y2={Y(35)} stroke={C.faint} strokeDasharray="2 2" />
        {ctx.mode === "ask" ? (
          <g>
            <Ask x={80} y={60} s="υ₁, υ₂ = ?" />
            <Ask x={290} y={70} s="V = ?" />
            <Ask x={290} y={30} s="h_max = ?" />
          </g>
        ) : null}
      </g>
    );
  },
};

/* ───────── 17. Έκρηξη σε σώμα που κρέμεται ───────── */
const s17: Story = {
  n: 17,
  title: "Έκρηξη σε σώμα που κρέμεται",
  what: "Σώμα κρέμεται από νήμα και εκρήγνυται: το ένα κομμάτι μένει στο νήμα, το άλλο φεύγει οριζόντια και πέφτει.",
  given: "M = 9 kg, ℓ = 2 m, ύψος από το έδαφος H = 1,8 m, κομμάτια 6 kg (στο νήμα) και 3 kg, το 3 kg πέφτει 6 m πιο πέρα, g = 10 m/s².",
  ask: "Τις ταχύτητες των κομματιών αμέσως μετά και την τάση του νήματος αμέσως μετά.",
  playSay: "Έκρηξη (στιγμιαία) και μετά δύο διαφορετικές ιστορίες: το 3 kg κάνει βολή, το 6 kg κάνει κυκλική στο νήμα. 3 φάσεις.",
  askSay: "Ζητούν ταχύτητες και τάση. Δίνουν πού έπεσε το 3 kg (τέλος της βολής): από εκεί ξεκινάμε.",
  phases: [
    {
      name: "Έκρηξη",
      tool: "ΑΔΟ",
      range: [0.08, 0.28],
      say: "Αρχικά ακίνητο ⇒ p = 0 ⇒ ΑΔΟ: 0 = m₁υ₁ − m₂υ₂. Τα κομμάτια φεύγουν αντίθετα. Δύο άγνωστοι: χρειάζομαι τη μία ταχύτητα από τη βολή.",
    },
    {
      name: "Πτώση 3 kg",
      tool: "Οριζόντια βολή",
      range: [0.2, 0.75],
      say: "Φεύγει οριζόντια από ύψος 1,8 m ⇒ οριζόντια βολή: t = √(2H/g) = 0,6 s, υ₂ = S/t = 6/0,6 = 10 m/s.",
    },
    {
      name: "6 kg αμέσως μετά",
      tool: "Κεντρομόλος",
      range: [0.2, 0.34],
      say: "«Αμέσως μετά» στο νήμα, στο κατώτατο σημείο ⇒ κεντρομόλος: T − m₁g = m₁υ₁²/ℓ. Με υ₁ = 5 m/s (από την ΑΔΟ): T = 60 + 75 = 135 N.",
    },
  ],
  order: [1, 0, 2],
  orderSay: "Βολή → υ₂ = 10 m/s. ΑΔΟ → υ₁ = 5 m/s. Κεντρομόλος → T = 135 N.",
  solve: (
    <>
      t = 0,6 s ⇒ <b>υ₂ = 10 m/s</b>. 6·υ₁ = 3·10 ⇒ <b>υ₁ = 5 m/s</b>. T = 6·10 + 6·25/2 = <b>135 N</b>.
    </>
  ),
  draw: (tau, ctx) => {
    const P = { x: 150, y: 22 };
    const L = 95;
    const floor = P.y + L + 75;
    const ex = 0.12;
    const k = seg(tau, 0.18, 0.7);
    const th = tau < ex ? 0 : -0.6 * decel(seg(tau, 0.18, 1));
    const b = pend(P.x, P.y, L, th);
    return (
      <g>
        <Pivot x={P.x} y={P.y} />
        <Ground y={floor} />
        <line x1={P.x} y1={P.y} x2={b.x} y2={b.y - 10} stroke={C.edge} strokeWidth={1.3} />
        {tau < ex ? (
          <Box cx={P.x} y={P.y + L + 11} w={30} h={22} fill={C.wood} label="M" />
        ) : (
          <g>
            <Box cx={b.x} y={b.y + 11} w={24} h={20} fill={C.wood} label="6" />
            <Box cx={P.x + 16 + 150 * k} y={P.y + L + 7 + 75 * k * k} w={14} h={14} fill={C.b2} />
          </g>
        )}
        <Burst cx={P.x} cy={P.y + L} k={seg(tau, ex, ex + 0.08)} />
        {tau > 0.18 && tau < 0.3 ? (
          <g>
            <Vec x={P.x + 20} y={P.y + L - 14} dx={36} label="υ₂" />
            <Vec x={b.x - 16} y={b.y - 16} dx={-18} label="υ₁" />
          </g>
        ) : null}
        {ctx.phase === 2 || (tau > 0.18 && tau < 0.34) ? (
          <g>
            <Vec x={b.x} y={b.y - 12} dx={0} dy={-38} color={C.F} label="T" labelSide="left" />
            <Vec x={b.x + 4} y={b.y + 12} dx={0} dy={18} color={C.F} label="m₁g" labelSide="right" />
          </g>
        ) : null}
        {tau > 0.7 || ctx.phase === 1 ? (
          <g>
            <Hbar x1={P.x} x2={P.x + 150} y={floor + 8} s="6 m" />
            <Vbar x={330} y1={P.y + L} y2={floor} s="1,8 m" side="left" />
          </g>
        ) : null}
        {ctx.mode === "ask" ? (
          <g>
            <Ask x={60} y={70} s="υ₁, υ₂ = ?" />
            <Ask x={250} y={60} s="T = ?" />
          </g>
        ) : null}
      </g>
    );
  },
};

export const BASE_STORIES: Story[] = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17];

