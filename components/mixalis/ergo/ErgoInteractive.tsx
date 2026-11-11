"use client";

import { useState } from "react";
import { Arrow, Slider, Pill, Stat, fmt, useClock, usePlaying } from "@/components/mixalis/omali/shared";
import { StudyMark } from "@/components/mixalis/study/StudyMark";

type Mode = "work" | "energy" | "spring" | "power";
const G = 10;
const MODES: { key: Mode; label: string }[] = [
  { key: "work", label: "Έργο δύναμης" },
  { key: "energy", label: "Πτώση και ενέργεια" },
  { key: "spring", label: "Ελατήριο" },
  { key: "power", label: "Ανύψωση και ισχύς" },
];

const quiz = [
  { q: "Δύναμη F = 20 N μετατοπίζει σώμα κατά 3 m με γωνία 60°. Πόσο είναι το έργο της;", a: ["60 J", "30 J", "0 J", "−30 J"], ok: 1, why: "W = F·s·συν60° = 20·3·0,5 = 30 J." },
  { q: "Ένα σώμα διπλασιάζει την ταχύτητά του. Η κινητική του ενέργεια…", a: ["διπλασιάζεται", "τετραπλασιάζεται", "υποδιπλασιάζεται", "μένει σταθερή"], ok: 1, why: "Κ = ½mυ². Όταν υ → 2υ, η κινητική γίνεται 4Κ." },
  { q: "Σώμα κινείται οριζόντια προς τα δεξιά με τριβή ολίσθησης. Το έργο της τριβής είναι…", a: ["θετικό", "μηδέν", "αρνητικό", "πάντα ίσο με το βάρος"], ok: 2, why: "Η τριβή είναι αντίθετη της μετατόπισης: το έργο της είναι −Τ·s." },
  { q: "Σε ελεύθερη πτώση χωρίς αντίσταση αέρα, ποιο μέγεθος μένει σταθερό;", a: ["Η κινητική", "Η βαρυτική δυναμική", "Το άθροισμα Κ + U", "Η ταχύτητα"], ok: 2, why: "Η βαρυτική δυναμική μετατρέπεται σε κινητική: Κ + U = σταθερό." },
  { q: "Στο διάγραμμα δύναμης–θέσης F–x, το προσημασμένο εμβαδόν δίνει…", a: ["ορμή", "έργο", "ισχύ", "επιτάχυνση"], ok: 1, why: "Το εμβαδόν κάτω από F–x δίνει έργο (J). Στο F–t δίνει ώθηση (N·s)." },
  { q: "Γερανός παράγει ωφέλιμο έργο 800 J σε 4 s. Ποια είναι η μέση ωφέλιμη ισχύς;", a: ["200 W", "3200 W", "0,005 W", "800 W"], ok: 0, why: "P = W/Δt = 800/4 = 200 W." },
  { q: "Κινητήρας παίρνει 1000 J και αποδίδει 750 J χρήσιμη ενέργεια. Ποια είναι η απόδοση;", a: ["25%", "75%", "100%", "133%"], ok: 1, why: "η = ωφέλιμη / εισερχόμενη = 750/1000 = 0,75 = 75%." },
];

export function ErgoLab() {
  const [mode, setMode] = useState<Mode>("work");
  const [playing, setPlaying] = usePlaying(true);
  const { ref, t, setT } = useClock(playing, 0.65);
  const [force, setForce] = useState(20);
  const [distance, setDistance] = useState(4);
  const [angle, setAngle] = useState(60);
  const [mass, setMass] = useState(2);
  const [loadMass, setLoadMass] = useState(100);
  const [height, setHeight] = useState(10);
  const [springK, setSpringK] = useState(200);
  const [springX, setSpringX] = useState(0.2);
  const [seconds, setSeconds] = useState(20);
  const [efficiency, setEfficiency] = useState(80);
  const progress = (t % 6) / 6;
  const theta = (angle * Math.PI) / 180;
  const parallel = force * Math.cos(theta);
  const work = parallel * distance;
  const currentHeight = height * (1 - progress * progress);
  const potential = mass * G * currentHeight;
  const kinetic = mass * G * (height - currentHeight);
  const total = mass * G * height;
  const elastic = 0.5 * springK * springX * springX;
  const useful = loadMass * G * height;
  const powerOut = useful / seconds;
  const powerIn = powerOut / (efficiency / 100);
  const springPoints = Array.from({ length: 24 }, (_, i) => {
    const x = 95 + i * (9 + springX * 15);
    const y = i === 0 || i === 23 ? 150 : 150 + (i % 2 ? -18 : 18);
    return String(x) + "," + String(y);
  }).join(" ");

  const setModeAndReset = (v: Mode) => { setMode(v); setT(0); };

  return (
    <div ref={ref} className="space-y-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Επιλογή εργαστηρίου">
        {MODES.map((m) => <Pill key={m.key} active={mode === m.key} onClick={() => setModeAndReset(m.key)}>{m.label}</Pill>)}
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(270px,0.7fr)]">
        <div className="overflow-hidden rounded-2xl border border-[#e2d9cd] bg-[#fbf8f3] p-3 sm:p-5">
          <svg viewBox="0 0 720 280" role="img" aria-label={mode === "work" ? "Κινούμενο σώμα και διάνυσμα δύναμης" : mode === "energy" ? "Πτώση σώματος με μετατροπή δυναμικής σε κινητική ενέργεια" : mode === "spring" ? "Ελατήριο που επιμηκύνεται" : "Γερανός που ανυψώνει φορτίο"} className="h-auto w-full">
            <rect x="0" y="0" width="720" height="280" rx="16" fill="#fbf8f3" />
            {mode === "work" && <>
              <line x1="35" x2="685" y1="216" y2="216" stroke="#9f9183" strokeWidth="5"/>
              {Array.from({length: 24}, (_, i) => <line key={i} x1={40 + i * 27} x2={31 + i * 27} y1="219" y2="228" stroke="#b8a99a" strokeWidth="2"/>)}
              <rect x={105 + 420 * progress} y="157" width="76" height="58" rx="8" fill="#e2b982" stroke="#7f5c37" strokeWidth="3"/>
              <Arrow x1={144 + 420 * progress} y1={153} x2={144 + 420 * progress + 105 * Math.cos(theta)} y2={153 - 105 * Math.sin(theta)} color="#c0392b" width={4}/>
              <Arrow x1={130} y1={256} x2={558} y2={256} color="#1f6fd1" width={4} />
              <text x="360" y="246" textAnchor="middle" fill="#1f6fd1" fontSize="20" fontWeight="bold">μετατόπιση s = {fmt(distance)} m</text>
              <text x="35" y="40" fill="#c0392b" fontSize="22" fontWeight="bold">F = {fmt(force)} N · θ = {angle}°</text>
              <text x="35" y="75" fill="#2c2825" fontSize="20">Fₓ = F συνθ = {fmt(parallel)} N</text>
              <text x="680" y="40" textAnchor="end" fill={work < -0.001 ? "#b43f32" : work > 0.001 ? "#23764d" : "#6b625b"} fontSize="25" fontWeight="bold">W = {fmt(work)} J</text>
            </>}
            {mode === "energy" && <>
              <line x1="60" x2="655" y1="243" y2="243" stroke="#8e8477" strokeWidth="5"/>
              <line x1="100" x2="100" y1="30" y2="238" stroke="#d1c5b7" strokeWidth="2" strokeDasharray="6 6"/>
              <circle cx="200" cy={47 + 175 * progress * progress} r="24" fill="#7fa8cc" stroke="#315677" strokeWidth="3"/>
              <Arrow x1={244} y1={70 + 175 * progress * progress} x2={244} y2={115 + 175 * progress * progress} color="#c0392b"/>
              <text x="280" y="130" fontSize="22" fill="#2c2825">υ = {fmt(Math.sqrt(2 * G * (height - currentHeight)))} m/s</text>
              <text x="60" y="28" fill="#315677" fontSize="20">Αρχικό ύψος: {fmt(height)} m</text>
              <text x="280" y="162" fontSize="20" fill="#2c2825">h = {fmt(currentHeight)} m</text>
              <rect x="505" y={235 - (potential / Math.max(1, total)) * 170} width="52" height={(potential / Math.max(1, total)) * 170} fill="#76bd9d" rx="4"/>
              <rect x="575" y={235 - (kinetic / Math.max(1, total)) * 170} width="52" height={(kinetic / Math.max(1, total)) * 170} fill="#efa467" rx="4"/>
              <text x="531" y="255" fill="#245c3d" textAnchor="middle" fontSize="18">U</text>
              <text x="601" y="255" fill="#90521b" textAnchor="middle" fontSize="18">K</text>
              <text x="565" y="32" textAnchor="middle" fontSize="18" fill="#4d4138">K + U = {fmt(total)} J</text>
            </>}
            {mode === "spring" && <>
              <rect x="45" y="45" width="25" height="195" fill="#9c8c7d"/>
              <polyline points={springPoints} stroke="#255b80" strokeWidth="5" fill="none" strokeLinejoin="round"/>
              <rect x={95 + 23 * (9 + springX * 15)} y="112" width="85" height="76" rx="8" fill="#e2b982" stroke="#7f5c37" strokeWidth="3"/>
              <Arrow x1={125 + 23 * (9 + springX * 15)} y1={100} x2={220 + 23 * (9 + springX * 15)} y2={100} color="#1f6fd1"/>
              <Arrow x1={125 + 23 * (9 + springX * 15)} y1={204} x2={70 + 23 * (9 + springX * 15)} y2={204} color="#c0392b"/>
              <text x="50" y="32" fontSize="22" fontWeight="bold" fill="#2c2825">F<tspan baselineShift="sub" fontSize="70%">ελ</tspan> = −kx</text>
              <text x="340" y="45" fontSize="20" fill="#1f6fd1">x = {fmt(springX)} m</text>
              <text x="340" y="75" fontSize="20" fill="#c0392b">|F<tspan baselineShift="sub" fontSize="70%">ελ</tspan>| = {fmt(springK * springX)} N</text>
              <text x="340" y="245" fontSize="25" fontWeight="bold" fill="#23764d">U<tspan baselineShift="sub" fontSize="70%">ελ</tspan> = {fmt(elastic)} J</text>
            </>}
            {mode === "power" && <>
              <line x1="65" x2="610" y1="248" y2="248" stroke="#a99a8b" strokeWidth="5"/>
              <line x1="185" x2="185" y1="35" y2="248" stroke="#846b58" strokeWidth="14"/>
              <line x1="178" x2="390" y1="35" y2="35" stroke="#846b58" strokeWidth="13"/>
              <circle cx="390" cy="35" r="17" fill="#e7d7c6" stroke="#846b58" strokeWidth="4"/>
              <line x1="390" x2="390" y1="48" y2={196 - 126 * progress} stroke="#7a7068" strokeWidth="4"/>
              <rect x="350" y={196 - 126 * progress} width="80" height="51" fill="#d7a96f" rx="5" stroke="#7f5c37" strokeWidth="3"/>
              <Arrow x1={450} y1={200} x2={450} y2={80} color="#23764d" />
              <text x="490" y="110" fill="#23764d" fontSize="20">h = {fmt(height)} m</text>
              <text x="470" y="55" fill="#2c2825" fontSize="20">m = {fmt(loadMass)} kg</text>
              <text x="490" y="165" fill="#2c2825" fontSize="20">Δt = {fmt(seconds)} s</text>
              <text x="480" y="204" fill="#2c2825" fontSize="22" fontWeight="bold">P<tspan baselineShift="sub" fontSize="70%">ωφ</tspan> = {fmt(powerOut)} W</text>
            </>}
          </svg>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#e9e0d5] pt-3">
            <p className="text-xs leading-5 text-[#71665a]">Η κίνηση είναι σχηματική και όχι σε πραγματική χρονική κλίμακα.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPlaying(!playing)} className="rounded-full bg-[#2c2825] px-4 py-2 text-sm font-semibold text-white">{playing ? "Παύση" : "Κίνηση"}</button>
              <button type="button" onClick={() => setT(0)} className="rounded-full border border-[#d7c8b6] bg-white px-4 py-2 text-sm font-semibold text-[#4d4138]">Αρχή</button>
            </div>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-[#e2d9cd] bg-white p-4 sm:p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#b07427]">Άλλαξε τις τιμές</p>
          {mode === "work" && <>
            <Slider label="Δύναμη F" value={force} min={5} max={60} step={5} onChange={setForce} display={fmt(force) + " N"}/>
            <Slider label="Μετατόπιση s" value={distance} min={1} max={10} step={1} onChange={setDistance} display={fmt(distance) + " m"}/>
            <Slider label="Γωνία θ" value={angle} min={0} max={180} step={15} onChange={setAngle} display={angle + "°"}/>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Έργο δύναμης" value={fmt(work)} unit="J" color={work < 0 ? "#b43f32" : "#2e8b57"}/>
              <Stat label="Συνιστώσα F·συνθ" value={fmt(parallel)} unit="N"/>
            </div>
            <p className="text-sm leading-6 text-[#5c534c]">W = F·s·συνθ. {Math.abs(work) < 0.001 ? "Η δύναμη είναι κάθετη στη μετατόπιση: έργο μηδέν." : work > 0 ? "Θετικό έργο: η δύναμη μεταφέρει ενέργεια στο σώμα." : "Αρνητικό έργο: η δύναμη αφαιρεί ενέργεια από το σώμα."}</p>
          </>}
          {mode === "energy" && <>
            <Slider label="Μάζα m" value={mass} min={1} max={10} step={1} onChange={setMass} display={fmt(mass) + " kg"}/>
            <Slider label="Αρχικό ύψος H" value={height} min={2} max={20} step={1} onChange={setHeight} display={fmt(height) + " m"}/>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Κινητική K" value={fmt(kinetic)} unit="J" color="#ae6727"/>
              <Stat label="Δυναμική U" value={fmt(potential)} unit="J" color="#23764d"/>
            </div>
            <Stat label="Μηχανική ενέργεια K + U" value={fmt(total)} unit="J"/>
            <p className="text-sm leading-6 text-[#5c534c]">Χωρίς αντίσταση αέρα, όσο μειώνεται το ύψος τόσο αυξάνεται η ταχύτητα. Το άθροισμα μένει σταθερό.</p>
          </>}
          {mode === "spring" && <>
            <Slider label="Σταθερά ελατηρίου k" value={springK} min={50} max={500} step={50} onChange={setSpringK} display={fmt(springK) + " N/m"}/>
            <Slider label="Επιμήκυνση x" value={springX} min={0} max={0.5} step={0.05} onChange={setSpringX} display={fmt(springX) + " m"}/>
            <Stat label="Αποθηκευμένη ενέργεια" value={fmt(elastic)} unit="J" color="#23764d"/>
            <p className="text-sm leading-6 text-[#5c534c]">U<sub>ελ</sub> = ½kx². Η δύναμη επαναφοράς έχει αντίθετη φορά από τη μετατόπιση: F<sub>ελ</sub> = −kx.</p>
          </>}
          {mode === "power" && <>
            <Slider label="Μάζα φορτίου m" value={loadMass} min={10} max={500} step={10} onChange={setLoadMass} display={fmt(loadMass) + " kg"}/>
            <Slider label="Ύψος h" value={height} min={2} max={20} step={1} onChange={setHeight} display={fmt(height) + " m"}/>
            <Slider label="Χρόνος Δt" value={seconds} min={2} max={40} step={2} onChange={setSeconds} display={fmt(seconds) + " s"}/>
            <Slider label="Απόδοση η" value={efficiency} min={40} max={100} step={5} onChange={setEfficiency} display={fmt(efficiency) + "%"}/>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Ωφέλιμη ισχύς" value={fmt(powerOut)} unit="W" color="#23764d"/>
              <Stat label="Ισχύς εισόδου" value={fmt(powerIn)} unit="W" color="#b07427"/>
            </div>
            <p className="text-sm leading-6 text-[#5c534c]">W<sub>ωφ</sub> = mgh = {fmt(useful)} J. P<sub>ωφ</sub> = W<sub>ωφ</sub>/Δt. Για η = {efficiency}%, η ισχύς εισόδου είναι P<sub>εισ</sub> = P<sub>ωφ</sub>/η. Υποθέτουμε σταθερή ή μέση ισχύ σε όλη την ανύψωση.</p>
          </>}
        </div>
      </div>
    </div>
  );
}

export function ErgoQuiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const completed = Object.keys(answers).length;
  const correct = quiz.filter((q, i) => answers[i] === q.ok).length;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f7f2ec] p-4">
        <p className="text-sm font-semibold text-[#4d4138]">Απαντημένες {completed}/{quiz.length} · Σωστές {correct}/{quiz.length}</p>
        <button type="button" onClick={() => setAnswers({})} className="rounded-full border border-[#d7c8b6] bg-white px-4 py-2 text-sm font-semibold">Ξανά από την αρχή</button>
      </div>
      {quiz.map((q, i) => {
        const a = answers[i];
        return <article id={"q" + (i + 1)} data-study-lesson="ergo" data-study-id={"q" + (i + 1)} key={i} className="scroll-mt-24 rounded-2xl border border-[#e4dacc] bg-white p-4 sm:p-6">
          <p className="font-semibold text-[#2c2825]">{i + 1}. {q.q}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {q.a.map((option, j) => <button type="button" key={j} onClick={() => setAnswers((prev) => ({...prev, [i]: j}))} aria-pressed={a === j} className={"rounded-xl border p-3 text-left text-sm font-medium transition " + (a === j ? (j === q.ok ? "border-[#2e8b57] bg-[#e8f5ed] text-[#245c3d]" : "border-[#c0392b] bg-[#fcebe8] text-[#8b3025]") : "border-[#ddd4c9] bg-[#fbf9f6] hover:bg-[#f4ebdf]")}>{String.fromCharCode(65 + j)}. {option}</button>)}
          </div>
          {a !== undefined && <p role="status" className={"mt-3 rounded-xl p-3 text-sm leading-6 " + (a === q.ok ? "bg-[#ecf7f0] text-[#245c3d]" : "bg-[#fdf2e8] text-[#714c27]")}>{a === q.ok ? "Σωστά. " : "Όχι ακριβώς. "}{q.why}</p>}
          <StudyMark lesson="ergo" id={"q" + (i + 1)} title={"Quiz " + (i + 1)} path="/mixalis/ergo" className="mt-4"/>
        </article>;
      })}
      {completed === quiz.length && <p role="status" className="rounded-2xl bg-[#e9f2ed] p-4 font-semibold text-[#245c3d]">Αποτέλεσμα: {correct}/{quiz.length}. {correct === quiz.length ? "Όλες σωστές!" : "Δες τις εξηγήσεις και προσπάθησε ξανά."}</p>}
    </div>
  );
}
